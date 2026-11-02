// =====================================================================
// REUNITE: Campus Lost & Found Management System
// Backend RESTful API Server
// Course: UE23CS351A – DBMS Project
// Team 10: Pranay Shah (PES2UG24CS366), Pradyumna P (PES2UG24CS359)
// =====================================================================

const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// -------------------------------------------------------------
// 1. Health & Dashboard Statistics
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', project: 'REUNITE DBMS', version: '1.0.0' });
});

app.get('/api/stats', async (req, res) => {
    try {
        const totalLost = (await db.query(`SELECT COUNT(*) AS count FROM items WHERE item_type = 'lost'`))[0]?.count || 0;
        const totalFound = (await db.query(`SELECT COUNT(*) AS count FROM items WHERE item_type = 'found'`))[0]?.count || 0;
        const totalMatches = (await db.query(`SELECT COUNT(*) AS count FROM matches`))[0]?.count || 0;
        const activeClaims = (await db.query(`SELECT COUNT(*) AS count FROM claims WHERE claim_status = 'pending'`))[0]?.count || 0;
        const resolvedItems = (await db.query(`SELECT COUNT(*) AS count FROM items WHERE status = 'claimed'`))[0]?.count || 0;
        const totalUsers = (await db.query(`SELECT COUNT(*) AS count FROM users`))[0]?.count || 0;

        res.json({
            totalLost,
            totalFound,
            totalMatches,
            activeClaims,
            resolvedItems,
            totalUsers
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------------------------------------------------
// 2. Users Management
// -------------------------------------------------------------
app.get('/api/users', async (req, res) => {
    try {
        const users = await db.query(`SELECT * FROM users ORDER BY user_id ASC`);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------------------------------------------------
// 3. Items Management
// -------------------------------------------------------------
app.get('/api/items', async (req, res) => {
    try {
        const { type, category, status, search } = req.query;
        let sql = `
            SELECT i.*, u.name AS reporter_name, u.email AS reporter_email, u.role AS reporter_role
            FROM items i
            JOIN users u ON i.user_id = u.user_id
            WHERE 1=1
        `;
        const params = [];

        if (type && type !== 'all') {
            sql += ` AND i.item_type = ?`;
            params.push(type);
        }
        if (category && category !== 'all') {
            sql += ` AND i.category = ?`;
            params.push(category);
        }
        if (status && status !== 'all') {
            sql += ` AND i.status = ?`;
            params.push(status);
        }
        if (search) {
            sql += ` AND (i.item_name LIKE ? OR i.description LIKE ? OR i.location LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        sql += ` ORDER BY i.item_id DESC`;
        const items = await db.query(sql, params);
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/items', async (req, res) => {
    try {
        const { user_id, item_name, description, category, location, item_type } = req.body;
        if (!user_id || !item_name || !category || !item_type) {
            return res.status(400).json({ error: 'Missing required item fields.' });
        }

        // Executes Stored Procedure logic: inserts item + automated matching against opposite type
        const result = await db.reportItemAndAutoMatch(
            parseInt(user_id, 10),
            item_name.trim(),
            description || '',
            category.trim(),
            location || 'PES University Campus',
            item_type.toLowerCase().trim()
        );

        res.status(201).json({
            message: 'Item registered successfully.',
            item_id: result.newItemId,
            matches_found: result.matchCount
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/items/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const itemId = req.params.id;
        await db.run(`UPDATE items SET status = ? WHERE item_id = ?`, [status, itemId]);
        res.json({ message: 'Item status updated.', status });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/items/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        await db.run(`DELETE FROM items WHERE item_id = ?`, [itemId]);
        res.json({ message: 'Item deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------------------------------------------------
// 4. Matches Management
// -------------------------------------------------------------
app.get('/api/matches', async (req, res) => {
    try {
        const sql = `
            SELECT 
                m.match_id,
                m.similarity_score,
                m.match_status,
                lost.item_id AS lost_item_id,
                lost.item_name AS lost_item_name,
                lost.location AS lost_location,
                lost.category AS category,
                u_lost.name AS lost_owner_name,
                u_lost.email AS lost_owner_email,
                found.item_id AS found_item_id,
                found.item_name AS found_item_name,
                found.location AS found_location,
                u_found.name AS finder_name,
                u_found.email AS finder_email
            FROM matches m
            JOIN items lost ON m.lost_item_id = lost.item_id
            JOIN users u_lost ON lost.user_id = u_lost.user_id
            JOIN items found ON m.found_item_id = found.item_id
            JOIN users u_found ON found.user_id = u_found.user_id
            ORDER BY m.similarity_score DESC, m.match_id DESC
        `;
        const matches = await db.query(sql);
        res.json(matches);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Run bulk auto-match algorithm across all open items
app.post('/api/matches/auto-match-all', async (req, res) => {
    try {
        const lostItems = await db.query(`SELECT * FROM items WHERE item_type = 'lost' AND status = 'open'`);
        const foundItems = await db.query(`SELECT * FROM items WHERE item_type = 'found' AND status = 'open'`);
        let created = 0;

        for (const lost of lostItems) {
            for (const found of foundItems) {
                if (lost.category === found.category) {
                    const score = db.calculateSimilarity(lost.category, found.category, lost.item_name, found.item_name);
                    if (score >= 60.0) {
                        const existing = await db.query(
                            `SELECT * FROM matches WHERE lost_item_id = ? AND found_item_id = ?`,
                            [lost.item_id, found.item_id]
                        );
                        if (existing.length === 0) {
                            await db.run(
                                `INSERT INTO matches (lost_item_id, found_item_id, similarity_score, match_status)
                                 VALUES (?, ?, ?, 'potential')`,
                                [lost.item_id, found.item_id, score]
                            );
                            created++;
                        }
                    }
                }
            }
        }
        res.json({ message: 'Auto-match execution complete', new_matches: created });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------------------------------------------------
// 5. Claims Management
// -------------------------------------------------------------
app.get('/api/claims', async (req, res) => {
    try {
        const sql = `
            SELECT 
                c.claim_id,
                c.claim_status,
                u.user_id,
                u.name AS claimant_name,
                u.email AS claimant_email,
                u.role AS claimant_role,
                i.item_id,
                i.item_name,
                i.category,
                i.location,
                i.item_type,
                i.status AS item_status
            FROM claims c
            JOIN users u ON c.user_id = u.user_id
            JOIN items i ON c.item_id = i.item_id
            ORDER BY c.claim_id DESC
        `;
        const claims = await db.query(sql);
        res.json(claims);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/claims', async (req, res) => {
    try {
        const { user_id, item_id } = req.body;
        if (!user_id || !item_id) {
            return res.status(400).json({ error: 'User ID and Item ID are required.' });
        }

        // Trigger simulation: Check for existing active claims
        const existing = await db.query(
            `SELECT * FROM claims WHERE user_id = ? AND item_id = ? AND claim_status IN ('pending', 'approved')`,
            [user_id, item_id]
        );
        if (existing.length > 0) {
            return res.status(400).json({ error: 'You have already submitted an active claim for this item.' });
        }

        const result = await db.run(
            `INSERT INTO claims (user_id, item_id, claim_status) VALUES (?, ?, 'pending')`,
            [user_id, item_id]
        );

        res.status(201).json({ message: 'Claim submitted successfully.', claim_id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/claims/:id/resolve', async (req, res) => {
    try {
        const { decision } = req.body; // 'approved' or 'rejected'
        const claimId = parseInt(req.params.id, 10);
        if (!['approved', 'rejected'].includes(decision)) {
            return res.status(400).json({ error: 'Decision must be "approved" or "rejected".' });
        }

        const result = await db.processClaim(claimId, decision);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------------------------------------------------
// 6. Notifications
// -------------------------------------------------------------
app.get('/api/notifications', async (req, res) => {
    try {
        const userId = req.query.user_id || 1;
        const notifs = await db.query(
            `SELECT * FROM notifications WHERE user_id = ? ORDER BY notification_id DESC`,
            [userId]
        );
        const unreadCount = notifs.filter(n => !n.is_read).length;
        res.json({ notifications: notifs, unread_count: unreadCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/notifications/:id/read', async (req, res) => {
    try {
        await db.run(`UPDATE notifications SET is_read = 1 WHERE notification_id = ?`, [req.params.id]);
        res.json({ message: 'Notification marked as read.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/notifications/mark-all-read', async (req, res) => {
    try {
        const userId = req.body.user_id || 1;
        await db.run(`UPDATE notifications SET is_read = 1 WHERE user_id = ?`, [userId]);
        res.json({ message: 'All notifications marked as read.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------------------------------------------------
// 7. Academic DBMS Query Runner (Deliverables 7.1 - 7.5)
// -------------------------------------------------------------
app.get('/api/queries/:queryId', async (req, res) => {
    const qid = req.params.queryId;
    let sql = '';
    let title = '';
    let description = '';

    switch (qid) {
        case '7.1':
            title = '7.1 Simple Query with GROUP BY & Aggregate Functions';
            description = 'Aggregates items count, claimed count, open count, and average description character length grouped by category and item type.';
            sql = `
                SELECT 
                    category,
                    item_type,
                    COUNT(*) AS total_items,
                    SUM(CASE WHEN status = 'claimed' THEN 1 ELSE 0 END) AS claimed_items,
                    SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) AS open_items,
                    ROUND(AVG(LENGTH(description)), 1) AS avg_desc_length
                FROM items
                GROUP BY category, item_type
                ORDER BY total_items DESC, category ASC;
            `;
            break;

        case '7.2':
            title = '7.2 Update Operation';
            description = 'Updates item statuses to "claimed" for all items having verified approved claims.';
            sql = `
                UPDATE items
                SET status = 'claimed'
                WHERE item_id IN (
                    SELECT item_id 
                    FROM claims 
                    WHERE claim_status = 'approved'
                );
            `;
            try {
                const affected = await db.run(sql);
                const verification = await db.query(`SELECT item_id, item_name, status FROM items WHERE status = 'claimed'`);
                return res.json({
                    queryId: qid,
                    title,
                    description,
                    sql: sql.trim(),
                    affectedRows: affected.affectedRows,
                    results: verification
                });
            } catch (err) {
                return res.status(500).json({ error: err.message });
            }

        case '7.3':
            title = '7.3 Delete Operation';
            description = 'Purges rejected claims from the system to preserve administrative integrity.';
            sql = `DELETE FROM claims WHERE claim_status = 'rejected';`;
            try {
                const affected = await db.run(sql);
                const verification = await db.query(`SELECT * FROM claims`);
                return res.json({
                    queryId: qid,
                    title,
                    description,
                    sql: sql.trim(),
                    affectedRows: affected.affectedRows,
                    results: verification
                });
            } catch (err) {
                return res.status(500).json({ error: err.message });
            }

        case '7.4':
            title = '7.4 Correlated Subquery';
            description = 'Finds matches whose similarity score is strictly greater than the average score of all matches belonging to that specific category.';
            sql = `
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
            `;
            break;

        case '7.5':
            title = '7.5 Nested Subquery';
            description = 'Retrieves all users who have reported items that currently have NO claims submitted against them and are still open.';
            sql = `
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
            `;
            break;

        default:
            return res.status(404).json({ error: 'Unknown query ID. Choose from 7.1, 7.2, 7.3, 7.4, 7.5.' });
    }

    try {
        const results = await db.query(sql);
        res.json({
            queryId: qid,
            title,
            description,
            sql: sql.trim(),
            results
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Server
async function start() {
    await db.initialize();
    app.listen(PORT, () => {
        console.log(`====================================================`);
        console.log(`🚀 REUNITE DBMS Server running at http://localhost:${PORT}`);
        console.log(`🎓 Team 10: Pranay Shah & Pradyumna P (PES University)`);
        console.log(`====================================================`);
    });
}

start();

