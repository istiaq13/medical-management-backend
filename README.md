# Doctor Tracker – Backend RESTful API

A high-performance, secure RESTful API for the Doctor Tracker administrative portal, built with **Node.js, Express, TypeScript, and MongoDB (Mongoose)**, following 3-tier enterprise architecture and MongoDB indexing standards.

* **Live Production URL:** [https://medical-management-backend-of4a.onrender.com](https://medical-management-backend-of4a.onrender.com)
* **Production API Base:** [https://medical-management-backend-of4a.onrender.com/api/v1](https://medical-management-backend-of4a.onrender.com/api/v1)
* **Live Health Check:** [https://medical-management-backend-of4a.onrender.com/health](https://medical-management-backend-of4a.onrender.com/health)

---

## 📌 Elevator Pitch

Doctor Tracker Backend provides an enterprise-grade administrative API to manage healthcare practitioners and patient records. It features JWT-based role authentication, dynamic MongoDB schema and index migrations, query-optimized regex search, multi-criteria filtering, server-side pagination, real-time analytics aggregations, and standardized human-readable error handling.

---

## 🛠️ Tech Stack & Architecture

* **Runtime:** Node.js (v20+)
* **Framework:** Express.js (v5)
* **Language:** TypeScript
* **Database:** MongoDB Atlas (Mongoose ODM)
* **Validation:** Zod (Strict schema validation for Body, Query, and Params)
* **Security:** Helmet, CORS, BCrypt password hashing (10 salt rounds), JWT authentication (8h TTL)
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
├── src/
│   ├── app/                      # Express app initialization & API routes
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── doctor.routes.ts
│   │   │   ├── patient.routes.ts
│   │   │   ├── dashboard.routes.ts
│   │   │   └── user.routes.ts
│   │   └── index.ts
│   ├── controllers/              # HTTP request & response handlers
│   │   ├── auth.controller.ts
│   │   ├── doctor.controller.ts
│   │   ├── patient.controller.ts
│   │   ├── dashboard.controller.ts
│   │   └── health.controller.ts
│   ├── database/                 # Connection management, seeds & dynamic migrations
│   │   ├── connection.ts
│   │   └── seeders/
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
│   │   ├── error.middleware.ts
│   │   └── rate-limit.middleware.ts
│   ├── models/                   # Mongoose schemas & models with compound indexing
│   │   ├── user.model.ts
│   │   ├── doctor.model.ts
│   │   └── patient.model.ts
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
* MongoDB running locally (`mongodb://localhost:27017/doctor_tracker`) or a MongoDB Atlas URI

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Ensure `.env` contains:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/doctor_tracker
JWT_SECRET=super_secret_jwt_key_change_in_production_min32chars
JWT_EXPIRES_IN=8h
CORS_ORIGIN=http://localhost:3000
```

### 4. Database Seed (Optional but Recommended)
Populate doctors, patients, and initial admin accounts:
```bash
npm run seed
```

### 5. Run Server
```bash
# Development mode (with live reload)
npm run dev

# Production build & start
npm run build
npm start
```
The API is available at `http://localhost:5000/api/v1`.

---

## 🛡️ Error Handling & Validation Standards

The backend features a unified, strict error handling pipeline in [`src/middlewares/error.middleware.ts`](file:///o:/Code/Testing/Assesement/medical-management-backend/src/middlewares/error.middleware.ts):

* **Readable Authentication Messages**: Preserves explicit error reasons (`"Invalid email or password"`, `"Your session has expired. Please sign in again."`, `"Authentication token missing"`).
* **Mongoose Duplicate Key Errors (`E11000`)**: Formats duplicate fields cleanly: `A record with this <field> "<value>" already exists.`
* **CastError Handling**: Converts invalid MongoDB `ObjectId` parameters into a clear `400 Bad Request` format: `Invalid resource identifier format: <value>`.
* **JSON Syntax Errors**: Intercepts broken JSON bodies and returns `400 Malformed JSON payload in request body`.
* **Zod Schema Validation**: Formats missing or invalid fields into structured error arrays: `{ errors: [{ field: "email", message: "Invalid email" }] }`.

---

## 📊 Performance & Optimization

1. **Compound Indexing**:
   - `Doctor`: `{ name: 'text', specialization: 1, email: 1, createdAt: -1 }`
   - `Patient`: `{ name: 'text', doctorId: 1, condition: 1, createdAt: -1 }`
2. **MongoDB Aggregation Pipelines**:
   - Doctor queries utilize a single `$facet` pipeline with `$lookup` to simultaneously return the paginated doctor list and real-time patient count without N+1 query bottlenecks.
   - Dashboard analytics aggregate total patients, doctors, workload ratios, monthly registration trends, and diagnosis groupings in real-time.
3. **Multi-field Regex Search**:
   - Searches across multiple fields (`name`, `specialization`, `hospital`, `email`, `condition`, `phone`) using case-insensitive RegExp patterns.
