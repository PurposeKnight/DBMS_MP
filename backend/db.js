// =====================================================================
// REUNITE: Backend Database Adapter
// Supports both MySQL (reunite_db) and Portable SQLite (sql.js)
// Course: UE23CS351A – DBMS Project
// Team 10: Pranay Shah (PES2UG24CS366), Pradyumna P (PES2UG24CS359)
// =====================================================================

const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

let mysqlPool = null;
let sqliteDb = null;
const DB_CLIENT = process.env.DB_CLIENT || 'sqlite'; // 'mysql' or 'sqlite'
const SQLITE_FILE = path.join(__dirname, '..', 'database', 'reunite.sqlite');

// Similarity calculation function (same heuristic as MySQL stored function)
function calculateSimilarity(cat1, cat2, name1, name2) {
    let score = 0.0;
    if ((cat1 || '').toLowerCase().trim() === (cat2 || '').toLowerCase().trim()) {
        score += 40.0;
    }
    const n1 = (name1 || '').toLowerCase().trim();
    const n2 = (name2 || '').toLowerCase().trim();
    if (n1 === n2) {
        score += 50.0;
    } else if (n1.includes(n2) || n2.includes(n1)) {
        score += 30.0;
    } else {
        // Token overlap heuristic
        const tokens1 = n1.split(/\s+/);
        const tokens2 = n2.split(/\s+/);
        const overlap = tokens1.some(t => t.length > 2 && tokens2.includes(t));
        score += overlap ? 25.0 : 15.0;
    }
    score += 10.0;
    return Math.min(100.0, score);
}

// Initialize SQLite database
async function initSqlite() {
    const SQL = await initSqlJs();
    let fileBuffer = null;
    if (fs.existsSync(SQLITE_FILE)) {
        fileBuffer = fs.readFileSync(SQLITE_FILE);
        sqliteDb = new SQL.Database(fileBuffer);
    } else {
        sqliteDb = new SQL.Database();
        // Create schema
        sqliteDb.run(`
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                role TEXT DEFAULT 'student'
            );

            CREATE TABLE IF NOT EXISTS items (
                item_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                item_name TEXT NOT NULL,
                description TEXT,
                category TEXT,
                location TEXT,
                status TEXT DEFAULT 'open',
                item_type TEXT DEFAULT 'lost',
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS claims (
                claim_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                item_id INTEGER NOT NULL,
                claim_status TEXT DEFAULT 'pending',
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS matches (
                match_id INTEGER PRIMARY KEY AUTOINCREMENT,
                lost_item_id INTEGER NOT NULL,
                found_item_id INTEGER NOT NULL,
                similarity_score REAL,
                match_status TEXT DEFAULT 'potential',
                FOREIGN KEY (lost_item_id) REFERENCES items(item_id) ON DELETE CASCADE,
                FOREIGN KEY (found_item_id) REFERENCES items(item_id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS notifications (
                notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                match_id INTEGER,
                message TEXT,
                is_read INTEGER DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                FOREIGN KEY (match_id) REFERENCES matches(match_id) ON DELETE SET NULL
            );
        `);

        // Seed data
        sqliteDb.run(`
            INSERT INTO users (user_id, name, email, role) VALUES
            (1, 'Pranay Shah', 'pranay.shah@pes.edu', 'student'),
            (2, 'Pradyumna P', 'pradyumna.p@pes.edu', 'student'),
            (3, 'Aarav Sharma', 'aarav.sharma@pes.edu', 'student'),
            (4, 'Diya Sen', 'diya.sen@pes.edu', 'student'),
            (5, 'Rohan Verma', 'rohan.verma@pes.edu', 'student'),
            (6, 'Ananya Iyer', 'ananya.iyer@pes.edu', 'student'),
            (7, 'Suresh Gowda', 'suresh.security@pes.edu', 'staff'),
            (8, 'Dr. Shilpa S', 'shilpa.cs@pes.edu', 'admin');

            INSERT INTO items (item_id, user_id, item_name, description, category, location, status, item_type) VALUES
            (1, 1, 'Dell XPS 15 Laptop', 'Silver Dell XPS laptop with CS sticker on top cover.', 'Electronics', 'Central Library Floor 2', 'open', 'lost'),
            (2, 2, 'PES Student ID Card', 'ID Card belonging to Pradyumna P, SRN PES2UG24CS359.', 'Cards/ID', 'Silver Jubilee Block 4th Floor', 'open', 'lost'),
            (3, 3, 'Sony WH-1000XM4 Headphones', 'Black over-ear wireless headphones in zipper case.', 'Electronics', 'Tech Park Canteen', 'matched', 'lost'),
            (4, 4, 'Casio FX-991CW Calculator', 'Scientific calculator with engraved initials D.S.', 'Stationery', 'B-Block Room 302', 'open', 'lost'),
            (5, 5, 'Hydro Flask Water Bottle', 'Matte black 32oz metal water bottle with dent.', 'Accessories', 'Sports Complex Badminton Court', 'claimed', 'lost'),
            (6, 6, 'Royal Enfield Bike Key', 'Single bike key with leather PES keychain.', 'Keys', 'Basement Parking Lot B', 'open', 'lost'),
            (7, 7, 'Dell Inspiron Silver Laptop', 'Found a silver Dell laptop on desk 14.', 'Electronics', 'Central Library Floor 2', 'open', 'found'),
            (8, 7, 'PES ID Card Blue Lanyard', 'PES student ID found on staircase railing.', 'Cards/ID', 'Silver Jubilee Block 4th Floor', 'open', 'found'),
            (9, 2, 'Sony Wireless Headphones', 'Black noise cancelling headphones found near table 8.', 'Electronics', 'Tech Park Canteen', 'matched', 'found'),
            (10, 7, 'Casio Scientific Calculator', 'Casio calculator found after exam session.', 'Stationery', 'B-Block Room 302', 'open', 'found'),
            (11, 3, 'Black Metal Insulated Bottle', '32oz black insulated flask found by bench.', 'Accessories', 'Sports Complex Gym', 'claimed', 'found'),
            (12, 7, 'Two-Wheeler Key Keychain', 'Key found near parking entrance gate.', 'Keys', 'Basement Parking Gate 2', 'open', 'found');

            INSERT INTO matches (match_id, lost_item_id, found_item_id, similarity_score, match_status) VALUES
            (1, 1, 7, 86.50, 'potential'),
            (2, 2, 8, 96.00, 'potential'),
            (3, 3, 9, 94.20, 'confirmed'),
            (4, 4, 10, 82.00, 'potential'),
            (5, 5, 11, 91.50, 'confirmed'),
            (6, 6, 12, 74.00, 'potential');

            INSERT INTO claims (claim_id, user_id, item_id, claim_status) VALUES
            (1, 5, 11, 'approved'),
            (2, 3, 9, 'approved'),
            (3, 1, 7, 'pending'),
            (4, 2, 8, 'pending'),
            (5, 4, 10, 'pending'),
            (6, 6, 11, 'rejected');

            INSERT INTO notifications (notification_id, user_id, match_id, message, is_read) VALUES
            (1, 1, 1, 'A high-confidence match (86.5%) was found for your Dell XPS 15 Laptop.', 0),
            (2, 2, 2, 'Your lost PES Student ID Card was turned into Security (96.0% match).', 0),
            (3, 3, 3, 'Claim approved: Your Sony headphones match has been verified.', 1),
            (4, 4, 4, 'A Casio calculator matching your report was turned into Room 302 collection.', 0),
            (5, 5, 5, 'Your claim on Hydro Flask bottle was approved. Collect from Security Office.', 1),
            (6, 6, 6, 'A set of keys matching your bike key was discovered in Basement Parking.', 0);
        `);
        persistSqlite();
    }
}

function persistSqlite() {
    if (sqliteDb) {
        const data = sqliteDb.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(SQLITE_FILE, buffer);
    }
}

// Database query interface
async function query(sql, params = []) {
    if (DB_CLIENT === 'mysql' && mysqlPool) {
        const [rows] = await mysqlPool.execute(sql, params);
        return rows;
    }
    
    // SQLite execution
    const stmt = sqliteDb.prepare(sql);
    if (params && params.length > 0) {
        stmt.bind(params);
    }
    const results = [];
    while (stmt.step()) {
        results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
}

// Database write/execution interface
async function run(sql, params = []) {
    if (DB_CLIENT === 'mysql' && mysqlPool) {
        const [result] = await mysqlPool.execute(sql, params);
        return result;
    }

    sqliteDb.run(sql, params);
    persistSqlite();
    // Get last insert ID and changes
    const idRes = sqliteDb.exec("SELECT last_insert_rowid() AS id, changes() AS affected;");
    const lastId = idRes[0]?.values[0][0] || 0;
    const affected = idRes[0]?.values[0][1] || 0;
    return { insertId: lastId, affectedRows: affected };
}

// Automated Item Reporting & Matching Procedure
async function reportItemAndAutoMatch(userId, itemName, description, category, location, itemType) {
    // 1. Insert Item
    const insertRes = await run(
        `INSERT INTO items (user_id, item_name, description, category, location, status, item_type)
         VALUES (?, ?, ?, ?, ?, 'open', ?)`,
        [userId, itemName, description, category, location, itemType]
    );
    const newItemId = insertRes.insertId;

    // 2. Find opposite items in same category
    const oppType = itemType === 'lost' ? 'found' : 'lost';
    const candidates = await query(
        `SELECT item_id, item_name, category, user_id FROM items WHERE item_type = ? AND category = ? AND status = 'open'`,
        [oppType, category]
    );

    let matchCount = 0;
    for (const cand of candidates) {
        const score = calculateSimilarity(category, cand.category, itemName, cand.item_name);
        if (score >= 60.0) {
            const lostId = itemType === 'lost' ? newItemId : cand.item_id;
            const foundId = itemType === 'lost' ? cand.item_id : newItemId;
            
            const matchRes = await run(
                `INSERT INTO matches (lost_item_id, found_item_id, similarity_score, match_status)
                 VALUES (?, ?, ?, 'potential')`,
                [lostId, foundId, score]
            );
            const matchId = matchRes.insertId;
            matchCount++;

            // Trigger Notification for lost owner
            const lostUserId = itemType === 'lost' ? userId : cand.user_id;
            const foundUserId = itemType === 'lost' ? cand.user_id : userId;

            await run(
                `INSERT INTO notifications (user_id, match_id, message, is_read)
                 VALUES (?, ?, ?, 0)`,
                [
                    lostUserId,
                    matchId,
                    `Match alert (${score.toFixed(1)}% match): Found item "${cand.item_name}" may correspond to your report.`
                ]
            );

            if (foundUserId !== lostUserId) {
                await run(
                    `INSERT INTO notifications (user_id, match_id, message, is_read)
                     VALUES (?, ?, ?, 0)`,
                    [
                        foundUserId,
                        matchId,
                        `A student reported an item that matches the "${cand.item_name}" you found (Score: ${score.toFixed(1)}%).`
                    ]
                );
            }
        }
    }

    return { newItemId, matchCount };
}

// Process Claim Resolution (Stored Procedure logic)
async function processClaim(claimId, decision) {
    const claimRows = await query(`SELECT * FROM claims WHERE claim_id = ?`, [claimId]);
    if (claimRows.length === 0) {
        throw new Error('Claim not found');
    }
    const claim = claimRows[0];
    const itemRows = await query(`SELECT * FROM items WHERE item_id = ?`, [claim.item_id]);
    const item = itemRows[0] || {};

    if (decision === 'approved') {
        await run(`UPDATE claims SET claim_status = 'approved' WHERE claim_id = ?`, [claimId]);
        await run(`UPDATE items SET status = 'claimed' WHERE item_id = ?`, [claim.item_id]);
        // Reject all other pending claims on this item
        await run(`UPDATE claims SET claim_status = 'rejected' WHERE item_id = ? AND claim_id != ? AND claim_status = 'pending'`, [claim.item_id, claimId]);
        
        // Notify claimant
        await run(
            `INSERT INTO notifications (user_id, match_id, message, is_read) VALUES (?, NULL, ?, 0)`,
            [claim.user_id, `Congratulations! Your claim for "${item.item_name}" has been APPROVED. Please collect it from Security Office.`]
        );
        return { status: 'approved', message: 'Claim approved successfully and item marked as claimed.' };
    } else {
        await run(`UPDATE claims SET claim_status = 'rejected' WHERE claim_id = ?`, [claimId]);
        await run(
            `INSERT INTO notifications (user_id, match_id, message, is_read) VALUES (?, NULL, ?, 0)`,
            [claim.user_id, `Your claim for "${item.item_name}" was reviewed and REJECTED due to verification mismatch.`]
        );
        return { status: 'rejected', message: 'Claim rejected.' };
    }
}

// Try connecting to MySQL if available, otherwise use SQLite
async function initialize() {
    if (DB_CLIENT === 'mysql') {
        try {
            const mysql = require('mysql2/promise');
            mysqlPool = mysql.createPool({
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || 'reunite_db',
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
            await mysqlPool.query('SELECT 1');
            console.log('✅ Connected to MySQL database (reunite_db)');
            return;
        } catch (err) {
            console.warn('⚠️  MySQL connection failed, falling back to embedded SQLite engine:', err.message);
        }
    }

    await initSqlite();
    console.log('✅ SQLite engine initialized and persistent at:', SQLITE_FILE);
}

module.exports = {
    initialize,
    query,
    run,
    reportItemAndAutoMatch,
    processClaim,
    calculateSimilarity
};

