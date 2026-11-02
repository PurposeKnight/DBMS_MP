-- =====================================================================
-- REUNITE: Campus Lost & Found Management System
-- Course: UE23CS351A – DBMS Project
-- Team 10:
--   Pranay Shah  : PES2UG24CS366
--   Pradyumna P  : PES2UG24CS359
-- Seed Data Insertion (DML)
-- =====================================================================

USE reunite_db;

-- Clear previous data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE notifications;
TRUNCATE TABLE matches;
TRUNCATE TABLE claims;
TRUNCATE TABLE items;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Insert Users
INSERT INTO users (user_id, name, email, role) VALUES
(1, 'Pranay Shah', 'pranay.shah@pes.edu', 'student'),
(2, 'Pradyumna P', 'pradyumna.p@pes.edu', 'student'),
(3, 'Aarav Sharma', 'aarav.sharma@pes.edu', 'student'),
(4, 'Diya Sen', 'diya.sen@pes.edu', 'student'),
(5, 'Rohan Verma', 'rohan.verma@pes.edu', 'student'),
(6, 'Ananya Iyer', 'ananya.iyer@pes.edu', 'student'),
(7, 'Suresh Gowda', 'suresh.security@pes.edu', 'staff'),
(8, 'Prof. Sheela Devi', 'sheeladevi.cs@pes.edu', 'admin');

-- 2. Insert Items (Lost and Found items)
INSERT INTO items (item_id, user_id, item_name, description, category, location, status, item_type) VALUES
-- Lost Items
(1, 1, 'Dell XPS 15 Laptop', 'Silver Dell XPS laptop with CS sticker on the top cover, left in the library 2nd floor.', 'Electronics', 'Central Library Floor 2', 'open', 'lost'),
(2, 2, 'PES University Student ID Card', 'ID Card belonging to Pradyumna P, SRN PES2UG24CS359 with blue lanyard.', 'Cards/ID', 'Silver Jubilee Block 4th Floor', 'open', 'lost'),
(3, 3, 'Sony WH-1000XM4 Headphones', 'Black over-ear wireless headphones inside a black zipper case.', 'Electronics', 'Tech Park Canteen', 'matched', 'lost'),
(4, 4, 'Casio FX-991CW Calculator', 'Scientific calculator with engraved initials D.S. on the rear battery lid.', 'Stationery', 'B-Block Room 302', 'open', 'lost'),
(5, 5, 'Hydro Flask Water Bottle', 'Matte black 32oz metal water bottle with a dent near the bottom rim.', 'Accessories', 'Sports Complex Badminton Court', 'claimed', 'lost'),
(6, 6, 'Royal Enfield Bike Key', 'Single bike key with a leather PES keychain and a brass tag.', 'Keys', 'Basement Parking Lot B', 'open', 'lost'),

-- Found Items
(7, 7, 'Dell Inspiron Silver Laptop', 'Found a silver Dell laptop left unattended on study desk 14.', 'Electronics', 'Central Library Floor 2', 'open', 'found'),
(8, 7, 'PES ID Card on Blue Lanyard', 'PES student ID found on staircase railing near room 405.', 'Cards/ID', 'Silver Jubilee Block 4th Floor', 'open', 'found'),
(9, 2, 'Sony Wireless Noise Cancelling Headphones', 'Black noise cancelling headphones found near table 8 in canteen.', 'Electronics', 'Tech Park Canteen', 'matched', 'found'),
(10, 7, 'Casio Scientific Calculator', 'Casio calculator found in classroom after exam session.', 'Stationery', 'B-Block Room 302', 'open', 'found'),
(11, 3, 'Black Metal Insulated Bottle', '32oz black insulated flask found by the court bench.', 'Accessories', 'Sports Complex Gym', 'claimed', 'found'),
(12, 7, 'Two-Wheeler Key with Keychain', 'Key found near parking entrance gate.', 'Keys', 'Basement Parking Gate 2', 'open', 'found');

-- 3. Insert Matches (Automated/Calculated similarity between Lost and Found)
INSERT INTO matches (match_id, lost_item_id, found_item_id, similarity_score, match_status) VALUES
(1, 1, 7, 86.50, 'potential'),
(2, 2, 8, 96.00, 'potential'),
(3, 3, 9, 94.20, 'confirmed'),
(4, 4, 10, 82.00, 'potential'),
(5, 5, 11, 91.50, 'confirmed'),
(6, 6, 12, 74.00, 'potential');

-- 4. Insert Claims
INSERT INTO claims (claim_id, user_id, item_id, claim_status) VALUES
(1, 5, 11, 'approved'),
(2, 3, 9, 'approved'),
(3, 1, 7, 'pending'),
(4, 2, 8, 'pending'),
(5, 4, 10, 'pending'),
(6, 6, 11, 'rejected');

-- 5. Insert Notifications
INSERT INTO notifications (notification_id, user_id, match_id, message, is_read) VALUES
(1, 1, 1, 'A high-confidence match (86.5%) was found for your lost "Dell XPS 15 Laptop". Check Central Library desk.', FALSE),
(2, 2, 2, 'Your lost "PES University Student ID Card" has been turned into Security with a 96.0% match score.', FALSE),
(3, 3, 3, 'Claim approved: Your Sony headphones match has been verified and marked for handover.', TRUE),
(4, 4, 4, 'A Casio calculator matching your report was turned into Room 302 lost collection.', FALSE),
(5, 5, 5, 'Your claim on Hydro Flask bottle has been approved. Please collect it from Security Office.', TRUE),
(6, 6, 6, 'A set of keys matching your bike key was discovered in Basement Parking.', FALSE);

