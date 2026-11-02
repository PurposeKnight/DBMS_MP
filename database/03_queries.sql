-- =====================================================================
-- REUNITE: Campus Lost & Found Management System
-- Course: UE23CS351A – DBMS Project
-- Team 10:
--   Pranay Shah  : PES2UG24CS366
--   Pradyumna P  : PES2UG24CS359
-- Deliverable 7: Academic SQL Queries (Chapters 7.1 - 7.5)
-- =====================================================================

USE reunite_db;

-- =====================================================================
-- 7.1 SIMPLE QUERY WITH GROUP BY & AGGREGATE FUNCTION
-- Business Objective:
-- Generate a department summary displaying the total count of items reported,
-- grouped by category and item_type, along with the average word length of descriptions.
-- =====================================================================
SELECT 
    category,
    item_type,
    COUNT(*) AS total_items,
    SUM(CASE WHEN status = 'claimed' THEN 1 ELSE 0 END) AS claimed_items,
    SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) AS open_items,
    ROUND(AVG(CHAR_LENGTH(description)), 1) AS avg_desc_length
FROM items
GROUP BY category, item_type
ORDER BY total_items DESC, category ASC;

-- Summary query on Matches:
SELECT 
    match_status,
    COUNT(*) AS match_count,
    ROUND(AVG(similarity_score), 2) AS avg_similarity_score,
    MAX(similarity_score) AS max_similarity_score,
    MIN(similarity_score) AS min_similarity_score
FROM matches
GROUP BY match_status;


-- =====================================================================
-- 7.2 UPDATE OPERATION
-- Business Objective:
-- Update item status to 'claimed' and claim status to 'approved' when an
-- administrator resolves a verified claim, and mark corresponding notifications.
-- =====================================================================
-- Operation 1: Update status of all items that have approved claims
UPDATE items
SET status = 'claimed'
WHERE item_id IN (
    SELECT item_id 
    FROM claims 
    WHERE claim_status = 'approved'
);

-- Operation 2: Mark all unread notifications older than a specific ID as read for a given user
UPDATE notifications
SET is_read = TRUE
WHERE user_id = 1 AND is_read = FALSE;

-- Verify update:
SELECT item_id, item_name, status FROM items WHERE status = 'claimed';


-- =====================================================================
-- 7.3 DELETE OPERATION
-- Business Objective:
-- Safely purge rejected claims or orphaned match notifications while
-- respecting foreign key constraints.
-- =====================================================================
-- Delete rejected claims that have no active follow-up
DELETE FROM claims 
WHERE claim_status = 'rejected' AND claim_id = 6;

-- Verify deletion:
SELECT * FROM claims WHERE claim_status = 'rejected';


-- =====================================================================
-- 7.4 CORRELATED SUBQUERY
-- Business Objective:
-- Retrieve all matches whose similarity score is strictly greater than the
-- average similarity score of all matches belonging to that specific category.
-- (Correlated via lost_item category)
-- =====================================================================
SELECT 
    m.match_id,
    lost.item_name AS lost_item,
    found.item_name AS found_item,
    lost.category,
    m.similarity_score,
    m.match_status
FROM matches m
JOIN items lost ON m.lost_item_id = lost.item_id
JOIN items found ON m.found_item_id = found.item_id
WHERE m.similarity_score > (
    SELECT AVG(inner_m.similarity_score)
    FROM matches inner_m
    JOIN items inner_lost ON inner_m.lost_item_id = inner_lost.item_id
    WHERE inner_lost.category = lost.category
);

-- Correlated Query 2:
-- Find users who have submitted more claims than the average number of claims
-- submitted by users of the same role.
SELECT 
    u.user_id,
    u.name,
    u.role,
    COUNT(c.claim_id) AS total_claims
FROM users u
LEFT JOIN claims c ON u.user_id = c.user_id
GROUP BY u.user_id, u.name, u.role
HAVING COUNT(c.claim_id) >= (
    SELECT AVG(user_claims.claim_cnt)
    FROM (
        SELECT u2.user_id, COUNT(c2.claim_id) AS claim_cnt
        FROM users u2
        LEFT JOIN claims c2 ON u2.user_id = c2.user_id
        WHERE u2.role = u.role
        GROUP BY u2.user_id
    ) AS user_claims
);


-- =====================================================================
-- 7.5 NESTED SUBQUERY
-- Business Objective:
-- Find all users who have reported items that currently have NO claims submitted against them,
-- and whose items are still in 'open' status.
-- =====================================================================
SELECT 
    u.user_id,
    u.name,
    u.email,
    u.role
FROM users u
WHERE u.user_id IN (
    SELECT i.user_id
    FROM items i
    WHERE i.status = 'open' 
      AND i.item_id NOT IN (
          SELECT DISTINCT c.item_id 
          FROM claims c 
          WHERE c.claim_status IN ('pending', 'approved')
      )
);

-- Nested Query 2:
-- Find items that have potential matches with similarity score > 85
-- but have not yet been claimed.
SELECT 
    item_id, 
    item_name, 
    category, 
    location 
FROM items
WHERE item_id IN (
    SELECT lost_item_id 
    FROM matches 
    WHERE similarity_score >= 85.00
) 
AND item_id NOT IN (
    SELECT item_id 
    FROM claims
);


-- =====================================================================
-- EXTRA ACADEMIC FEATURES: USEFUL VIEWS
-- =====================================================================
CREATE OR REPLACE VIEW vw_ActiveMatches AS
SELECT 
    m.match_id,
    m.similarity_score,
    m.match_status,
    l.item_id AS lost_id,
    l.item_name AS lost_name,
    u_lost.name AS lost_by,
    u_lost.email AS lost_by_email,
    f.item_id AS found_id,
    f.item_name AS found_name,
    u_found.name AS found_by,
    f.location AS found_location
FROM matches m
JOIN items l ON m.lost_item_id = l.item_id
JOIN users u_lost ON l.user_id = u_lost.user_id
JOIN items f ON m.found_item_id = f.item_id
JOIN users u_found ON f.user_id = u_found.user_id;

CREATE OR REPLACE VIEW vw_ClaimsOverview AS
SELECT 
    c.claim_id,
    c.claim_status,
    u.name AS claimant_name,
    u.email AS claimant_email,
    i.item_name,
    i.category,
    i.location,
    i.item_type
FROM claims c
JOIN users u ON c.user_id = u.user_id
JOIN items i ON c.item_id = i.item_id;

