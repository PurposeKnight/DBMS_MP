-- =====================================================================
-- REUNITE: Campus Lost & Found Management System
-- Course: UE23CS351A – DBMS Project
-- Team 10:
--   Pranay Shah  : PES2UG24CS366
--   Pradyumna P  : PES2UG24CS359
-- Database Schema Definition (DDL)
-- =====================================================================

CREATE DATABASE IF NOT EXISTS reunite_db;
USE reunite_db;

-- 1. Drop existing tables in reverse order of foreign keys
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS claims;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS users;

-- 2. USERS Table
-- Stores details of campus users (students, faculty, administrative/security staff)
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(30) DEFAULT 'student'
);

-- 3. ITEMS Table
-- Stores items reported as lost or found across campus locations
CREATE TABLE items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    location VARCHAR(100),
    status VARCHAR(30) DEFAULT 'open',
    item_type VARCHAR(20) DEFAULT 'lost',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 4. CLAIMS Table
-- Stores claim requests submitted by users for specific found/lost items
CREATE TABLE claims (
    claim_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    claim_status VARCHAR(30) DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE
);

-- 5. MATCHES Table
-- Stores automated or verified match pairings between a lost item and a found item
CREATE TABLE matches (
    match_id INT PRIMARY KEY AUTO_INCREMENT,
    lost_item_id INT NOT NULL,
    found_item_id INT NOT NULL,
    similarity_score DECIMAL(5,2),
    match_status VARCHAR(30) DEFAULT 'potential',
    FOREIGN KEY (lost_item_id) REFERENCES items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (found_item_id) REFERENCES items(item_id) ON DELETE CASCADE
);

-- 6. NOTIFICATIONS Table
-- Stores alert messages sent to users regarding potential matches or claim updates
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    match_id INT,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (match_id) REFERENCES matches(match_id) ON DELETE SET NULL
);

-- Indices for performance optimization
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_item_type ON items(item_type);
CREATE INDEX idx_claims_status ON claims(claim_status);
CREATE INDEX idx_matches_score ON matches(similarity_score);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
