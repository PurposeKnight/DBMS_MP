# REUNITE: Campus Lost & Found Management System

> **PES University • Department of Computer Science & Engineering**  
> **Course:** UE23CS351A – DBMS Project (Aug – Dec 2026)  
> **Team 10:**  
> - **Pranay Shah** (PES2UG24CS366)  
> - **Pradyumna P** (PES2UG24CS359)  
> **Faculty Guide:** Dr. Shilpa S, Assistant Professor  

---

## 📌 Overview

**REUNITE** is an end-to-end, automated relational database management platform designed to streamline lost-and-found recovery operations across the PES University campus. Built on a normalized schema adhering to Boyce-Codd Normal Form (BCNF), the system replaces manual security registers and uncoordinated social channels with automated correlation algorithms, integrity triggers, stored procedures, and a responsive web application.

---

## 🚀 Key Features

- **Relational Schema (5 Core Entities):** `users`, `items`, `claims`, `matches`, and `notifications` structured with foreign key constraints, cascade rules, and domain validation.
- **Smart Heuristic Match Engine:** Automated similarity scoring based on categorical and lexical token overlap between lost and found item reports.
- **Stored Procedures & Triggers:**
  - `sp_ReportItemAndAutoMatch`: Registers newly reported belongings and executes candidate matching.
  - `sp_ProcessClaim`: Evaluates claims, synchronizes item states, and generates alerts.
  - `trg_AfterMatchInsert_Notify`: Automatically notifies reporting parties upon candidate match generation.
  - `trg_BeforeClaimInsert_Validate`: Prevents duplicate claims from being submitted by the same user.
- **Academic Query Suite (PES University Syllabus):**
  - **7.1 Simple Query:** Aggregations with `GROUP BY` and summary statistics.
  - **7.2 Update Operation:** Cross-table updates with subqueries.
  - **7.3 Delete Operation:** Referential integrity enforcement.
  - **7.4 Correlated Subquery:** Category-relative average comparison.
  - **7.5 Nested Subquery:** Multi-level condition filtering.
- **Dual Database Architecture:**
  - **Embedded Engine:** Ships out-of-the-box with a persistent embedded SQL database (`sql.js`) for zero-configuration testing.
  - **MySQL Production Engine:** Supports standard MySQL 8.x (`reunite_db`) via `mysql2`.
- **Interactive Full-Stack Web Application:**
  - Live analytics dashboard.
  - Item catalog with live keyword search and multi-facet filtering.
  - Interactive "Report Item" modal.
  - Smart match visualizer with side-by-side comparison.
  - Claims resolution console with role-switching simulation.
  - Live academic SQL query executor.

---

## 📐 Entity-Relationship (ER) Architecture

```
     +-------------------+                          +-------------------+
     |       USER        |                          |       ITEM        |
     +-------------------+                          +-------------------+
     | PK: user_id       |1                       N | PK: item_id       |
     |     name          |------[ REPORTS ]-------->| FK: user_id       |
     |     email (UQ)    |                          |     item_name     |
     |     role          |                          |     description   |
     +-------------------+                          |     category      |
       | 1             | 1                          |     location      |
       |               |                            |     status        |
       | Submits       | Receives                   |     item_type     |
       v N             v N                          +-------------------+
+--------------+ +-------------------+                | 1             | 1
|    CLAIM     | |   NOTIFICATION    |                | Lost          | Found
+--------------+ +-------------------+                |               |
|PK: claim_id  | |PK: notification_id|                v N             v N
|FK: user_id   | |FK: user_id        |         +-----------------------------+
|FK: item_id   | |FK: match_id       |<--------|            MATCH            |
|    claim_stat| |    message        |Generates+-----------------------------+
+--------------+ |    is_read        |         | PK: match_id                |
       ^         +-------------------+         | FK: lost_item_id            |
       |                   ^                   | FK: found_item_id           |
       +-------Has---------+                   |     similarity_score        |
                1                              |     match_status            |
                                               +-----------------------------+
```

---

## 🗂️ Project Directory Structure

```
DBMS/
├── database/
│   ├── 01_schema.sql                      # DDL schema definitions (reunite_db)
│   ├── 02_seed_data.sql                   # Realistic sample campus dataset
│   ├── 03_queries.sql                     # Deliverable 7 academic SQL queries
│   └── 04_procedures_functions_triggers.sql # Stored procedures, functions & triggers
├── backend/
│   ├── db.js                              # Dual-adapter database abstraction layer
│   └── server.js                          # Express.js REST API server
├── frontend/
│   └── index.html                         # Full-stack responsive web client
├── docs/
│   ├── REPORT.md                          # Full academic report (PES University format)
│   └── report.html                        # Printable HTML formatted report
├── package.json                           # Dependencies & scripts
├── run_tests.js                           # Test suite verifying schema, seed & queries
└── README.md                              # Project documentation
```

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- Git

### 1. Clone & Install
```bash
git clone https://github.com/PurposeKnight/DBMS_MP.git
cd DBMS
npm install
```

### 2. Run Verification Test Suite
```bash
npm test
```
*This validates table creation, data seeding, aggregate queries, correlated queries, nested queries, and auto-matching.*

### 3. Start the Web Application
```bash
npm start
```
*Open your browser and navigate to:* **`http://localhost:3000`**

---

## 🗄️ MySQL Setup (Optional for Production)

If running directly on a MySQL Server:
1. Open MySQL CLI or MySQL Workbench:
   ```bash
   mysql -u root -p < database/01_schema.sql
   mysql -u root -p < database/02_seed_data.sql
   mysql -u root -p < database/04_procedures_functions_triggers.sql
   ```
2. Set environment variables before starting the backend:
   ```bash
   set DB_CLIENT=mysql
   set DB_HOST=localhost
   set DB_USER=root
   set DB_PASSWORD=your_password
   set DB_NAME=reunite_db
   npm start
   ```

---

## 📊 Academic Deliverables Coverage

| Syllabus Section | Deliverable File | Implementation Details |
| :--- | :--- | :--- |
| **DDL Statements** | `database/01_schema.sql` | 5 tables, PKs, FKs, Unique constraints, cascades |
| **DML Statements** | `database/02_seed_data.sql` | Users, items, claims, matches, notifications |
| **7.1 Group By & Aggregation** | `database/03_queries.sql` | Total items, claimed items, and avg desc length by category |
| **7.2 Update Operation** | `database/03_queries.sql` | Status synchronization on claim approval |
| **7.3 Delete Operation** | `database/03_queries.sql` | Purge rejected claims with referential checks |
| **7.4 Correlated Subquery** | `database/03_queries.sql` | Similarity scores exceeding category mean |
| **7.5 Nested Subquery** | `database/03_queries.sql` | Users with open unclaimed items |
| **8.1 Procedures & Functions** | `database/04_procedures_functions_triggers.sql` | `sp_ReportItemAndAutoMatch`, `sp_ProcessClaim`, `fn_CalculateSimilarity` |
| **8.2 Triggers** | `database/04_procedures_functions_triggers.sql` | `trg_AfterMatchInsert_Notify`, `trg_BeforeClaimInsert_Validate` |
| **9.0 Frontend Development** | `frontend/index.html` | Responsive single-page application with live query runner |
| **Formal Project Report** | `docs/REPORT.md` | Complete academic report adhering to PES format |

---

## 👥 Authors
- **Pranay Shah** (SRN: `PES2UG24CS366`)
- **Pradyumna P** (SRN: `PES2UG24CS359`)
- **Institution:** PES University, Electronic City Campus, Bengaluru

