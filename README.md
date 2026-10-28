# Lahore Garrison University (LGU) Super App Ecosystem
### All-in-One Enterprise Platform (Mobile App • Backend API • Admin Control Panel)

Welcome to the **Lahore Garrison University (LGU) Super App** enterprise monorepo. This platform unifies academic management, department operations, student services, and administrative governance into a single cohesive, high-performance ecosystem.

---

## 🏛️ Ecosystem Architecture

```
/lgu-super-app
  ├── backend/               # NestJS 10 + Prisma ORM + PostgreSQL 16 + Redis
  ├── mobile-app/            # React Native (Expo SDK 51) with TypeScript
  ├── admin-web/             # Next.js 14 (App Router) + Tailwind CSS
  ├── docker-compose.yml     # Containerized PostgreSQL 16 & Redis Services
  └── package.json           # Monorepo Workspace Configuration
```

---

## 🛡️ Database Schema & RBAC Design

The platform uses **Prisma ORM** with **PostgreSQL 16+**, structured to handle 5,000+ active university users with high-concurrency access and strict Role-Based Access Control (RBAC).

### Role Hierarchy
| Role | Display Name | Permissions & Scope |
| :--- | :--- | :--- |
| `SUPER_ADMIN` | Super Administrator | Complete system access, audit logs, and global overrides |
| `VC` | Vice Chancellor | University-wide executive dashboards, strategic notices, and high-level reports |
| `REGISTRAR` | Registrar Office | Academic circulars, enrollments, degree policies, and admissions |
| `HOD` | Head of Department | Faculty allocation, timetable curation, course assignments |
| `FACULTY` | Professor / Lecturer | Teaching schedule, student grading, course materials |
| `STUDENT` | Enrolled Student | Personal timetable, fee challans, bus pass, library loan records, canteen |
| `ACCOUNTS` | Accounts & Finance | Fee challan generation, bank reconciliation (HBL / 1Bill), ledger tracking |
| `TRANSPORT` | Transport Directorate | Bus fleet management, route stops with GPS, digital bus pass allocation |
| `SECURITY` | Campus Security | RFID card reader integration, vehicle gate entry clearance, visitor logs |
| `LIBRARY` | Central Library Staff | OPAC book cataloging, ISBN lookup, issue/return ledger and fines |
| `CAFETERIA` | Campus Cafeteria | Digital canteen menu, live order queue, pickup OTP verification |

---

## 🗓️ Timetable & Venue Collision Resolution Matrix

The schema enforces strict relational uniqueness to eliminate class clashes algorithmically:
1. **Room Slot Uniqueness**: `@@unique([dayOfWeek, roomId, startTime, academicYear])` — Prevents double-booking any lecture hall or computer lab.
2. **Teacher Slot Uniqueness**: `@@unique([dayOfWeek, teacherId, startTime, academicYear])` — Prevents a professor from being assigned two concurrent lectures.
3. **Section Slot Uniqueness**: `@@unique([dayOfWeek, sectionId, startTime, academicYear])` — Guarantees students never encounter overlapping class commitments.

---

## 📦 Department Modules Included

- **Central Library**: ISBN tracking, shelf rack locations (`Rack A-1`), real-time copy availability, automated fine calculation for overdue items.
- **Campus Transport**: 4 high-traffic Lahore metropolitan routes (Thokar Niaz Baig, Shahdara, DHA Phase 5, Johar Town/Wapda Town), bus fleet metadata, stop-by-stop GPS coordinates, and student bus passes.
- **Accounts & Finance**: Fee challan voucher generator, fee itemization (tuition, lab charges, library fund, exam fee), and multi-channel payment verification (HBL, JazzCash, NayaPay).
- **Digital Cafeteria**: Canteen menu item catalog, dietary categories (Fast Food, Meals, Beverages, Snacks), real-time order queue with pickup verification OTPs.
- **Campus Notices**: Priority-based circular distribution (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), target audience filters (`ALL`, `STUDENTS`, `FACULTY`, `STAFF`), and pinned announcements.
- **Security & RFID Access**: Digital gate pass issuance for student cards, staff cards, and registered motor vehicles.

---

## 🚀 Quickstart & Local Setup Guide

### 1. Prerequisites
- **Node.js**: v18+ (v20+ recommended)
- **NPM**: v9+ or **pnpm**
- **PostgreSQL**: Local instance or Docker

### 2. Start PostgreSQL Database
If you have Docker installed, start the database with one command:
```bash
docker-compose up -d
```
Or use your existing local PostgreSQL instance and set your credentials in `backend/.env`:
```env
DATABASE_URL="postgresql://lgu_admin:lgu_secret_2026@localhost:5432/lgu_super_app?schema=public"
```

### 3. Install Backend Dependencies & Generate Prisma Client
```bash
cd backend
npm install
npx prisma generate
```

### 4. Run Migrations
Run database migrations to generate all relational tables, constraints, and indexes:
```bash
npx prisma migrate dev --name init_lgu_enterprise_schema
```

### 5. Seed the Database (`seed.ts`)
Run the mock dataset generation script:
```bash
npm run prisma:seed
# or
npx ts-node prisma/seed.ts
```

#### Seed Script Output Summary:
- **Roles & Permissions**: 11 Roles + 12 Granular permissions
- **Departments**: 12 Academic & Administrative departments (CS, SE, IT, Math, Business, Accounts, Transport, Library, etc.)
- **Venues & Rooms**: 32 Lecture Halls, Computer Labs, and Seminar Auditoriums
- **Executive Leadership**: SuperAdmin, Vice Chancellor, Registrar
- **Faculty Members**: 55+ Professors & Lecturers with complete profiles, qualifications, and HoDs
- **Operational Staff**: 20+ Admins across Accounts, Transport, Security, Library, and Cafeteria
- **Students**: 520 Enrolled Students with roll numbers (`FA23-BCS-042`), CGPAs, and contact details
- **Timetable Matrix**: 100+ Conflict-free class sessions linking rooms, teachers, and student sections
- **Transport Fleet**: 4 Lahore routes with GPS stops & 50 active bus passes
- **Library Catalog**: 15 Standard textbooks & 40 student borrow records
- **Fee Challans**: 520 Itemized semester fee vouchers (Paid, Unpaid, Overdue)
- **Cafeteria Menu**: 14 Canteen items & 30 active student orders
- **Campus Notices**: 5 Official university announcements

### 6. Default Login Credentials
All mock accounts share a common testing password:
- **Default Password**: `LguPass2026!`

| Role | Email |
| :--- | :--- |
| **SuperAdmin** | `admin@lgu.edu.pk` |
| **Vice Chancellor** | `vc@lgu.edu.pk` |
| **Registrar** | `registrar@lgu.edu.pk` |
| **HoD (Computer Science)** | `dr. (hod) muhammad.khan1@lgu.edu.pk` |
| **Faculty Member** | Check generated faculty emails in database |
| **Student** | `fa23-bcs-001@lgu.edu.pk` |
| **Accounts Staff** | `staff.acc1@lgu.edu.pk` |
| **Transport Staff** | `staff.trans1@lgu.edu.pk` |

---

## 🖥️ Running the Services

### Backend API (NestJS)
```bash
cd backend
npm run start:dev
```
- API Base URL: `http://localhost:4000/api/v1`
- Interactive Swagger Documentation: `http://localhost:4000/api/docs`

### Visual Database Inspection (Prisma Studio)
```bash
cd backend
npx prisma studio
```
- Web UI: `http://localhost:5555`

### Admin Web Panel (Next.js)
```bash
cd admin-web
npm install
npm run dev
```
- Web URL: `http://localhost:3000`

### Mobile App (React Native Expo)
```bash
cd mobile-app
npm install
npm run start
```
