# Doctor Tracker – Backend API

A high-performance, secure RESTful API for the Doctor Tracker administrative portal, built with **Node.js, Express, TypeScript, and MongoDB (Mongoose)**, following 3-tier enterprise architecture and MongoDB migration standards.

* **Live Production URL:** [https://medical-management-backend-of4a.onrender.com](https://medical-management-backend-of4a.onrender.com)
* **Production API Base:** [https://medical-management-backend-of4a.onrender.com/api/v1](https://medical-management-backend-of4a.onrender.com/api/v1)
* **Live Health Check:** [https://medical-management-backend-of4a.onrender.com/health](https://medical-management-backend-of4a.onrender.com/health)

---

## 📌 Elevator Pitch

Doctor Tracker Backend provides an enterprise-grade administrative API to manage healthcare practitioners and patient records. It features JWT-based role authentication, dynamic MongoDB schema and index migrations via `migrate-mongo`, query-optimized searching, multi-criteria filtering, pagination, and real-time analytical aggregations for administrative reporting.

---

## 🛠️ Tech Stack & Architecture

* **Runtime:** Node.js (v20+)
* **Framework:** Express.js (v5)
* **Language:** TypeScript
* **Database:** MongoDB Atlas (Mongoose ODM)
* **Migrations:** Internal Dynamic Migrations & Index Synchronizer
* **Validation:** Zod (Strict schema validation for Body, Query, and Params)
* **Security:** Helmet, CORS, BCrypt password hashing, JWT authentication
* **API Testing:** Bruno (`/bruno` collection with Local and Production environments)

### Architectural Pattern: Modular 3-Tier Layered Architecture
```
medical-management-backend/
├── bruno/                         # Version-controlled Bruno API testing collection
│   ├── bruno.json
│   ├── environments/
│   │   ├── Local.bru              # Local environment (http://localhost:5000/api/v1)
│   │   └── Production.bru         # Production environment (Render live URL)
│   ├── Auth/                      # Login, Register, Me
│   ├── Doctors/                   # CRUD, Search, Filter, Doctor's Patients
│   ├── Patients/                  # CRUD, Search, Filter by Condition/Doctor/Date
│   ├── Dashboard/                 # Analytical aggregations
│   └── Health/                    # Health check endpoint
├── migrations/                    # migrate-mongo migration scripts
│   └── 20261103000001-init-indexes-and-admin.js
├── src/
│   ├── app/                      # Express app initialization & API routes
│   │   ├── routes/
│   │   └── index.ts
│   ├── controllers/              # HTTP request & response handlers
│   │   ├── auth.controller.ts
│   │   ├── doctor.controller.ts
│   │   ├── patient.controller.ts
│   │   └── dashboard.controller.ts
│   ├── database/                 # Connection management & seed script
│   │   ├── connection.ts
│   │   └── seed.ts
│   ├── helpers/                  # ApiResponse, ApiError, pagination helpers
│   │   ├── api-response.ts
│   │   ├── api-error.ts
│   │   └── pagination.helper.ts
│   ├── lib/                      # Environment variables, JWT utilities
│   │   ├── env.ts
│   │   └── jwt.ts
│   ├── middlewares/              # JWT Auth, Zod Validation, Centralized Error Handling
│   │   ├── auth.middleware.ts
│   │   ├── validate.middleware.ts
│   │   └── error.middleware.ts
│   ├── models/                   # Mongoose schemas & models with indexing
│   │   ├── user.model.ts
│   │   ├── doctor.model.ts
│   │   └── patient.model.ts
│   ├── provider/                 # DatabaseProvider singleton
│   │   └── database.provider.ts
│   ├── services/                 # Business logic & MongoDB aggregation pipelines
│   │   ├── auth.service.ts
│   │   ├── doctor.service.ts
│   │   ├── patient.service.ts
│   │   └── dashboard.service.ts
│   ├── validators/               # Zod validation schemas
│   │   ├── auth.validator.ts
│   │   ├── doctor.validator.ts
│   │   └── patient.validator.ts
│   ├── instrumentation.ts        # Server startup & runtime lifecycle hook
│   ├── middleware.ts             # Global middleware chain setup
│   └── server.ts                 # Server entry point
├── package.json
└── tsconfig.json
```

---

## 🚀 Setup & Local Installation

### 1. Prerequisites
* Node.js (v18+)
* MongoDB running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your `MONGODB_URI` points to your MongoDB instance:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/doctor_tracker
JWT_SECRET=doctor_tracker_super_secure_jwt_secret_key_2026
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000

ADMIN_NAME=Super Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
```

---

## 📦 Database Migrations (Dynamic & Timestamped)

The project includes a robust, zero-dependency migration engine in [`src/database/migrations/`](src/database/migrations).

* **Generate Migration Dynamically:**
  Creates a timestamped migration file (`YYYYMMDDHHmmss_<name>.ts`) with boilerplate `up(db)` and `down(db)` functions:
  ```bash
  npm run migrate:generate <migration_name>
  # Example: npm run migrate:generate add_doctor_awards
  ```

* **Run Migrations (Forward):**
  Discovers all timestamped migrations, tracks executed ones in MongoDB (`_migrations` collection), and runs pending ones in chronological order:
  ```bash
  npm run migrate
  ```
  *(Note: Migrations also run automatically on server boot via `src/instrumentation.ts`)*

* **Rollback Last Migration:**
  Reverts the most recently applied migration:
  ```bash
  npm run migrate:down
  ```

---

## 🌱 Seeding Demo Data

To populate the database with realistic doctors and patients across historical dates for testing charts and pagination:
```bash
npm run seed
```
**Default Admin Credentials:**
* **Email:** `admin@example.com`
* **Password:** `Admin@123`

---

## 🏃 Running the Application

* **Development mode (with hot-reload):**
  ```bash
  npm run dev
  ```
* **Production Build & Start:**
  ```bash
  npm run build
  npm start
  ```
The server will run on `http://localhost:5000`.

---

## 📡 REST API Reference

All protected endpoints require the header: `Authorization: Bearer <token>`

### 1. Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Login with email and password | No |
| `POST` | `/api/v1/auth/register` | Register new user | No |
| `GET` | `/api/v1/auth/me` | Fetch authenticated user profile | **Yes** |

### 2. Doctors (`/api/v1/doctors`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/doctors` | List doctors with search, filters & pagination | **Yes** |
| `POST` | `/api/v1/doctors` | Create a new doctor | **Yes** |
| `GET` | `/api/v1/doctors/:id` | Get doctor details & patient count | **Yes** |
| `PUT` | `/api/v1/doctors/:id` | Update doctor information | **Yes** |
| `DELETE` | `/api/v1/doctors/:id` | Delete doctor and cascade records | **Yes** |
| `GET` | `/api/v1/doctors/:id/patients` | List all patients under this doctor | **Yes** |
| `POST` | `/api/v1/doctors/:id/patients` | Add a patient under this doctor | **Yes** |
| `DELETE` | `/api/v1/doctors/:id/patients/:patientId` | Remove patient from doctor | **Yes** |

**Query Parameters for `GET /api/v1/doctors`:**
* `search`: Searches across name, specialization, hospital, email.
* `specialization`: Filter by medical specialization (e.g. `Cardiology`).
* `hospital`: Filter by hospital name.
* `startDate` & `endDate`: Date range filter (ISO date format).
* `page` (default: 1), `limit` (default: 10), `sortBy` (default: `createdAt`), `sortOrder` (`asc` / `desc`).

### 3. Patients (`/api/v1/patients`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/patients` | List patients with search, condition filter & pagination | **Yes** |
| `POST` | `/api/v1/patients` | Create a new patient | **Yes** |
| `GET` | `/api/v1/patients/:id` | Get patient details (populated with doctor info) | **Yes** |
| `PUT` | `/api/v1/patients/:id` | Update patient record | **Yes** |
| `DELETE` | `/api/v1/patients/:id` | Delete patient | **Yes** |

**Query Parameters for `GET /api/v1/patients`:**
* `search`: Searches across name, phone, email, condition.
* `condition`: Filter by condition (e.g. `Hypertension`, `Asthma`).
* `gender`: `MALE`, `FEMALE`, or `OTHER`.
* `doctorId`: Filter patients assigned to a specific doctor.
* `startDate` & `endDate`: Date range filter.
* `page`, `limit`, `sortBy`, `sortOrder`.

### 4. Dashboard & Analytics (`/api/v1/dashboard`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/dashboard/analytics` | Aggregated analytics for dashboard charts | **Yes** |

**Returns:**
* `summary`: `totalDoctors`, `totalPatients`, `averagePatientsPerDoctor`.
* `patientsPerDoctor`: Top doctors with their active patient counts.
* `dateBasedStats`: Historical monthly patient intake for trend charts.
* `conditionDistribution`: Patient counts grouped by medical condition (for pie/doughnut charts).
* `specializationDistribution`: Doctor counts grouped by specialization.

---

## ⚡ Performance & Query Optimizations

1. **MongoDB Indexing:**
   * Text index on `{ name: 'text', specialization: 'text', hospital: 'text' }` for search.
   * Compound index on `{ doctorId: 1, createdAt: -1 }` for doctor-patient queries.
   * B-tree index on `{ createdAt: -1 }` for date-wise sorting and filtering.
2. **`.lean()` Execution:**
   * Read queries use `.lean()` to bypass Mongoose document hydration, cutting memory usage and query latency by over 50%.
3. **MongoDB Aggregation Pipelines:**
   * Single-trip `$facet` and `$lookup` aggregations compute paginated results, total counts, and patient relations simultaneously.
   * Dashboard analytics use `$group` and `$concat` pipelines directly in the database engine.

---

## 🧪 Testing with Bruno

The repository includes a complete **Bruno collection** in the `bruno/` directory:

1. Open **Bruno**.
2. Click **Open Collection** and select the `medical-management-backend/bruno` folder.
3. Select the **Local** environment (`Local.bru`).
4. Execute `Auth > Login Admin`:
   * The post-response script automatically captures the returned JWT token and stores it in the `token` variable.
5. All subsequent requests in `Doctors`, `Patients`, and `Dashboard` automatically use the `{{token}}` bearer authentication!

---

## 🔄 CI/CD Pipeline (GitHub Actions)

A production-ready CI/CD pipeline is configured in [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml):
* **Automated on:** Push & PR to `main`, `master`, and `dev` branches.
* **Service Container:** Spins up an isolated MongoDB 7.0 container in the runner.
* **Pipeline Stages:**
  1. Dependencies installation with cache verification (`npm ci`).
  2. Strict TypeScript type-checking & compile (`npm run build`).
  3. Dynamic database migration verification against live MongoDB container (`npm run migrate`).
  4. Database seeding verification (`npm run seed`).
  5. Live background server start and `/health` verification.
  6. Automated deployment stage on `main` branch.


