# Wachemo University AI-Powered Accommodation & Property Management System
## የዋቸሞ ዩኒቨርሲቲ የተማሪዎች ማደሪያና የቋሚ ንብረት አስተዳደር ሲስተም

### Modern Institutional Architecture for Higher Education

---

## 🌟 Executive Summary

The **AI-Powered University Accommodation and Property Management System** is an enterprise web platform designed specifically for **Wachemo University (ዋቸሞ ዩኒቨርሲቲ)**, Hosanna, Ethiopia. It centralizes student official registration verification, dormitory housing allocation, interactive bed maps, university property inventory, and facilities maintenance workflows.

---

## 🛡️ Core Security Architecture & Official Verification (Section 5)

### Verification Protocol
1. **Super Admin Source of Truth**: The Super Admin uploads or inputs the official Wachemo University registrar roster (via Excel, CSV, or manual entry).
2. **Strict Matching Engine**: When a student registers, they input:
   - **Student ID** (e.g. `WU/2024/001`)
   - **Official Full Name**
   - **College** (Selected from admin-managed dropdown)
   - **Department** (Dynamic dropdown strictly filtered to the selected college)
   - **Admission Batch** (e.g. `Batch 2024 / 2016 E.C.`)
   - **Semester** (e.g. `Semester 1`)
3. **Automated Cross-Verification**:
   - **Exact Match**: Instant account activation, verified badge, and access to student accommodation portal.
   - **Data Mismatch**: Flagged for Super Admin manual review and security audit.
   - **Non-Existent ID**: Blocked with an official registrar contact notice.
   - **Duplicate ID**: Blocked immediately per Business Rule 6.

---

## 👥 Supported Roles & Dashboards

| Role | Responsibilities | Key Capabilities |
| :--- | :--- | :--- |
| **👑 Super Admin** | Full University Governance | Official roster upload/editing, colleges/departments management (Rule 11 protected), staff user provisioning, campus analytics, database backup snapshots |
| **🎓 Student** | Housing Services & Maintenance | Official verified student ID profile, view assigned dorm block & room & bed, roommates directory, gate pass QR, submit complaints with photos, AI Chatbot |
| **🏢 Dormitory Manager** | Building & Room Operations | Manage Block 45/46/47, interactive visual floor & bed matrix (color-coded), check-in / check-out gate station, building damage reports |
| **📋 Accommodation Officer** | Housing Applications & Placement | Review applications, **AI Room & Bed Recommendation Engine** (batch cohesion, department proximity, medical accessibility priority), 1-click batch allocation |
| **📦 Property Manager** | University Asset Inventory | Registry with `WU-PROP-2024-XXXX` codes, asset condition monitoring (Good, Needs Repair, Damaged, Missing), inter-building property transfers |
| **🔧 Maintenance Staff** | Work Orders & Repairs | Task inbox with urgency beacons (Water leak, Electrical fire hazard), field status workflow (In Progress, Completed with repair notes), parts reporting |

---

## 💻 Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Canvas Confetti
- **Backend**: Node.js, Express.js, TypeScript, REST API
- **Database**: PostgreSQL 17, Prisma ORM
- **Visual Design**: High-tech modern institutional design with dark and light themes, featuring authentic Wachemo University crest, gate, fountain, and dormitory imagery.
- **Language Support**: English & Amharic (አማርኛ) bilingual interface.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js v18+ or v20+ LTS
- PostgreSQL 17 (installed on port 5432)

### 2. Run Frontend
```bash
cd frontend
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Backend API
```bash
cd backend
npm run dev
```
API running on [http://localhost:5000](http://localhost:5000).

---

## 🔑 Pre-Configured Demo Accounts (One-Click Access on Home Page)

- **Super Admin**: `admin@wachemo.edu.et`
- **Student**: `WU/2024/001` (Abebe Kebede Tadesse - Software Engineering)
- **Dormitory Manager**: `dorm.mgr@wachemo.edu.et` (Proctor Tariku)
- **Accommodation Officer**: `accommodation@wachemo.edu.et` (W/ro Genet)
- **Property Manager**: `property@wachemo.edu.et` (Ato Solomon)
- **Maintenance Staff**: `maintenance@wachemo.edu.et` (Eng. Dawit)
