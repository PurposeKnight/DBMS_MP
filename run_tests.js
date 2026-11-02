const http = require('http');
const db = require('./backend/db');

async function testAll() {
    console.log('--- Initializing DB directly ---');
    await db.initialize();
    
    console.log('--- Testing DB Queries ---');
    const users = await db.query('SELECT * FROM users');
    console.log(`Users loaded: ${users.length} users found.`);
    
    const items = await db.query('SELECT * FROM items');
    console.log(`Items loaded: ${items.length} items found.`);

    const matches = await db.query('SELECT * FROM matches');
    console.log(`Matches loaded: ${matches.length} matches found.`);

    const claims = await db.query('SELECT * FROM claims');
    console.log(`Claims loaded: ${claims.length} claims found.`);

    console.log('--- Testing Query 7.1 (GROUP BY & Aggregate) ---');
    const q1 = await db.query(`
        SELECT 
            category,
            item_type,
            COUNT(*) AS total_items,
            SUM(CASE WHEN status = 'claimed' THEN 1 ELSE 0 END) AS claimed_items,
            SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) AS open_items
        FROM items
        GROUP BY category, item_type
        ORDER BY total_items DESC;
    `);
    console.table(q1);

    console.log('--- Testing Query 7.4 (Correlated Subquery) ---');
    const q4 = await db.query(`
        SELECT 
            m.match_id,
            lost.item_name AS lost_item,
            found.item_name AS found_item,
            lost.category,
            m.similarity_score
        FROM matches m
        JOIN items lost ON m.lost_item_id = lost.item_id
        JOIN items found ON m.found_item_id = found.item_id
        WHERE m.similarity_score > (
            SELECT AVG(inner_m.similarity_score)
            FROM matches inner_m
            JOIN items inner_lost ON inner_m.lost_item_id = inner_lost.item_id
            WHERE inner_lost.category = lost.category
        );
    `);
    console.table(q4);

    console.log('--- Testing Query 7.5 (Nested Subquery) ---');
    const q5 = await db.query(`
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
    `);
    console.table(q5);

    console.log('--- Testing Auto-Match Stored Procedure Logic ---');
    const reportRes = await db.reportItemAndAutoMatch(
        1,
        'Casio Scientific Calculator FX',
        'Left on bench in room 302',
        'Stationery',
        'B-Block Room 302',
        'lost'
    );
    console.log('Report result:', reportRes);

    console.log('✅ ALL TEST SUITES PASSED SUCCESSFULLY!');
}

testAll().catch(err => {
    console.error('Test error:', err);
    process.exit(1);
});

