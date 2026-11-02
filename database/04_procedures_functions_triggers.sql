-- =====================================================================
-- REUNITE: Campus Lost & Found Management System
-- Course: UE23CS351A – DBMS Project
-- Team 10:
--   Pranay Shah  : PES2UG24CS366
--   Pradyumna P  : PES2UG24CS359
-- Deliverable 8: Stored Procedures, Functions, and Triggers
-- =====================================================================

USE reunite_db;

DELIMITER $$

-- =====================================================================
-- 8.1 FUNCTIONS
-- =====================================================================

-- Function 1: Calculate word/token similarity score heuristic between two texts
DROP FUNCTION IF EXISTS fn_CalculateSimilarity$$
CREATE FUNCTION fn_CalculateSimilarity(
    cat1 VARCHAR(50), 
    cat2 VARCHAR(50), 
    name1 VARCHAR(100), 
    name2 VARCHAR(100)
)
RETURNS DECIMAL(5,2)
DETERMINISTIC
BEGIN
    DECLARE score DECIMAL(5,2) DEFAULT 0.00;
    
    -- Category match contributes 40 points
    IF LOWER(TRIM(cat1)) = LOWER(TRIM(cat2)) THEN
        SET score = score + 40.00;
    END IF;
    
    -- Exact item name match contributes 50 points
    IF LOWER(TRIM(name1)) = LOWER(TRIM(name2)) THEN
        SET score = score + 50.00;
    -- Substring presence contributes 30 points
    ELSEIF INSTR(LOWER(name1), LOWER(name2)) > 0 OR INSTR(LOWER(name2), LOWER(name1)) > 0 THEN
        SET score = score + 30.00;
    ELSE
        -- Basic heuristic token match
        SET score = score + 15.00;
    END IF;
    
    -- Baseline confidence bonus
    SET score = score + 10.00;
    
    IF score > 100.00 THEN
        SET score = 100.00;
    END IF;
    
    RETURN score;
END$$

-- Function 2: Get count of unread notifications for a student/user
DROP FUNCTION IF EXISTS fn_GetUnreadNotificationCount$$
CREATE FUNCTION fn_GetUnreadNotificationCount(p_user_id INT)
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE unread_count INT DEFAULT 0;
    
    SELECT COUNT(*) INTO unread_count
    FROM notifications
    WHERE user_id = p_user_id AND is_read = FALSE;
    
    RETURN unread_count;
END$$


-- =====================================================================
-- 8.1 STORED PROCEDURES
-- =====================================================================

-- Stored Procedure 1: Report a new item and auto-detect matches
DROP PROCEDURE IF EXISTS sp_ReportItemAndAutoMatch$$
CREATE PROCEDURE sp_ReportItemAndAutoMatch(
    IN p_user_id INT,
    IN p_item_name VARCHAR(100),
    IN p_description TEXT,
    IN p_category VARCHAR(50),
    IN p_location VARCHAR(100),
    IN p_item_type VARCHAR(20),
    OUT p_new_item_id INT,
    OUT p_match_count INT
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE cur_opp_id INT;
    DECLARE cur_opp_name VARCHAR(100);
    DECLARE cur_opp_cat VARCHAR(50);
    DECLARE calc_score DECIMAL(5,2);
    DECLARE opp_type VARCHAR(20);
    
    -- Cursor for matching candidate items of the opposite type
    DECLARE item_cursor CURSOR FOR
        SELECT item_id, item_name, category
        FROM items
        WHERE item_type = opp_type AND status = 'open' AND category = p_category;
        
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    SET p_match_count = 0;
    
    -- Determine opposite type
    IF p_item_type = 'lost' THEN
        SET opp_type = 'found';
    ELSE
        SET opp_type = 'lost';
    END IF;
    
    -- 1. Insert the newly reported item
    INSERT INTO items (user_id, item_name, description, category, location, status, item_type)
    VALUES (p_user_id, p_item_name, p_description, p_category, p_location, 'open', p_item_type);
    
    SET p_new_item_id = LAST_INSERT_ID();
    
    -- 2. Scan for candidate matches
    OPEN item_cursor;
    match_loop: LOOP
        FETCH item_cursor INTO cur_opp_id, cur_opp_name, cur_opp_cat;
        IF done THEN
            LEAVE match_loop;
        END IF;
        
        SET calc_score = fn_CalculateSimilarity(p_category, cur_opp_cat, p_item_name, cur_opp_name);
        
        -- If score passes threshold (>= 60%), insert into matches table
        IF calc_score >= 60.00 THEN
            IF p_item_type = 'lost' THEN
                INSERT INTO matches (lost_item_id, found_item_id, similarity_score, match_status)
                VALUES (p_new_item_id, cur_opp_id, calc_score, 'potential');
            ELSE
                INSERT INTO matches (lost_item_id, found_item_id, similarity_score, match_status)
                VALUES (cur_opp_id, p_new_item_id, calc_score, 'potential');
            END IF;
            
            SET p_match_count = p_match_count + 1;
        END IF;
    END LOOP;
    CLOSE item_cursor;
END$$

-- Stored Procedure 2: Administrative resolution of a claim
DROP PROCEDURE IF EXISTS sp_ProcessClaim$$
CREATE PROCEDURE sp_ProcessClaim(
    IN p_claim_id INT,
    IN p_decision VARCHAR(20),  -- 'approved' or 'rejected'
    OUT p_result_message VARCHAR(255)
)
BEGIN
    DECLARE target_item_id INT;
    DECLARE claimant_id INT;
    DECLARE item_title VARCHAR(100);
    
    -- Fetch claim details
    SELECT user_id, item_id INTO claimant_id, target_item_id
    FROM claims
    WHERE claim_id = p_claim_id;
    
    IF claimant_id IS NULL THEN
        SET p_result_message = 'Error: Claim ID not found.';
    ELSE
        SELECT item_name INTO item_title FROM items WHERE item_id = target_item_id;
        
        IF p_decision = 'approved' THEN
            -- Update claim status
            UPDATE claims SET claim_status = 'approved' WHERE claim_id = p_claim_id;
            
            -- Update item status to claimed
            UPDATE items SET status = 'claimed' WHERE item_id = target_item_id;
            
            -- Reject all other pending claims on this specific item
            UPDATE claims 
            SET claim_status = 'rejected' 
            WHERE item_id = target_item_id AND claim_id <> p_claim_id AND claim_status = 'pending';
            
            -- Create notification
            INSERT INTO notifications (user_id, match_id, message, is_read)
            VALUES (claimant_id, NULL, CONCAT('Your claim for item "', item_title, '" has been APPROVED. Please visit Security Office.'), FALSE);
            
            SET p_result_message = 'Claim approved successfully. Item marked as claimed.';
            
        ELSEIF p_decision = 'rejected' THEN
            UPDATE claims SET claim_status = 'rejected' WHERE claim_id = p_claim_id;
            
            INSERT INTO notifications (user_id, match_id, message, is_read)
            VALUES (claimant_id, NULL, CONCAT('Your claim for item "', item_title, '" was reviewed and REJECTED due to insufficient verification.'), FALSE);
            
            SET p_result_message = 'Claim rejected.';
        ELSE
            SET p_result_message = 'Invalid decision parameter. Must be "approved" or "rejected".';
        END IF;
    END IF;
END$$


-- =====================================================================
-- 8.2 TRIGGERS
-- =====================================================================

-- Trigger 1: Automatically notify both users when a new match is generated
DROP TRIGGER IF EXISTS trg_AfterMatchInsert_Notify$$
CREATE TRIGGER trg_AfterMatchInsert_Notify
AFTER INSERT ON matches
FOR EACH ROW
BEGIN
    DECLARE lost_user_id INT;
    DECLARE found_user_id INT;
    DECLARE lost_name VARCHAR(100);
    DECLARE found_name VARCHAR(100);
    
    SELECT user_id, item_name INTO lost_user_id, lost_name
    FROM items WHERE item_id = NEW.lost_item_id;
    
    SELECT user_id, item_name INTO found_user_id, found_name
    FROM items WHERE item_id = NEW.found_item_id;
    
    -- Notify the student who reported lost item
    IF lost_user_id IS NOT NULL THEN
        INSERT INTO notifications (user_id, match_id, message, is_read)
        VALUES (
            lost_user_id, 
            NEW.match_id, 
            CONCAT('Possible match found: "', found_name, '" matches your lost item "', lost_name, '" with ', NEW.similarity_score, '% similarity.'), 
            FALSE
        );
    END IF;
    
    -- Notify the student/staff who reported found item
    IF found_user_id IS NOT NULL AND found_user_id <> lost_user_id THEN
        INSERT INTO notifications (user_id, match_id, message, is_read)
        VALUES (
            found_user_id, 
            NEW.match_id, 
            CONCAT('An owner may have been located for "', found_name, '" (Match score: ', NEW.similarity_score, '%).'), 
            FALSE
        );
    END IF;
END$$

-- Trigger 2: Prevent duplicate pending claims by the same user for the same item
DROP TRIGGER IF EXISTS trg_BeforeClaimInsert_Validate$$
CREATE TRIGGER trg_BeforeClaimInsert_Validate
BEFORE INSERT ON claims
FOR EACH ROW
BEGIN
    DECLARE existing_claims_count INT DEFAULT 0;
    
    SELECT COUNT(*) INTO existing_claims_count
    FROM claims
    WHERE user_id = NEW.user_id AND item_id = NEW.item_id AND claim_status IN ('pending', 'approved');
    
    IF existing_claims_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User has already submitted an active claim for this item.';
    END IF;
END$$

-- Trigger 3: Automatically sync item status when claim is approved directly
DROP TRIGGER IF EXISTS trg_AfterClaimStatusUpdate_ItemStatus$$
CREATE TRIGGER trg_AfterClaimStatusUpdate_ItemStatus
AFTER UPDATE ON claims
FOR EACH ROW
BEGIN
    IF NEW.claim_status = 'approved' AND OLD.claim_status <> 'approved' THEN
        UPDATE items
        SET status = 'claimed'
        WHERE item_id = NEW.item_id;
    END IF;
END$$

DELIMITER ;
