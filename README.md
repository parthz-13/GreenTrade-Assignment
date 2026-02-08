# GreenTrade - Supplier & Product Management System

A full-stack web application for managing sustainable product suppliers, tracking certifications, and analyzing business metrics. Built for GreenTrade's export operations.

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

---

## Live Demo

- **Frontend (Vercel):** [https://green-trade-assignment.vercel.app/](https://green-trade-assignment.vercel.app/)
- **Backend API (Render):** [https://greentrade-assignment.onrender.com](https://greentrade-assignment.onrender.com)
- **API Documentation:** [https://greentrade-assignment.onrender.com/docs](https://greentrade-assignment.onrender.com/docs)

---

## Screenshots

### Dashboard - Analytics Overview
*Real-time analytics showing supplier count, product inventory, category distribution, and certification status*


<img width="1352" height="756" alt="Screenshot 2026-02-07 at 9 22 02 PM" src="https://github.com/user-attachments/assets/ad61c370-3063-4a51-922f-3dac09d7fc91" />

### Suppliers Management
*Complete supplier directory with contact information and associated products*


<img width="1352" height="755" alt="Screenshot 2026-02-07 at 9 22 29 PM" src="https://github.com/user-attachments/assets/7cea415f-9ae6-4337-898c-41a18bba2c5b" />
<img width="1335" height="733" alt="Screenshot 2026-02-07 at 9 23 01 PM" src="https://github.com/user-attachments/assets/83f44a32-ac91-4d7e-a216-bd0e91ac9b05" />

### Products Catalog
*Product inventory with advanced filtering by category and certification status*


<img width="1352" height="761" alt="Screenshot 2026-02-07 at 9 23 16 PM" src="https://github.com/user-attachments/assets/4dadc6d5-644b-496e-959d-c65ca5c3cbad" />

---

## Tech Stack

### Backend
- **Framework:** FastAPI 
- **Database:** PostgreSQL (Neon Serverless)
- **ORM:** SQLAlchemy 
- **Validation:** Pydantic 
- **Server:** Uvicorn 
- **Package Manager:** UV (Python)

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** CSS 
- **Routing:** React Router DOM
- **Charts:** Recharts
- **Icons:** Lucide React

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Neon (PostgreSQL)

---

## Features Implemented

### Core Features
- Complete CRUD operations for Suppliers and Products  
- Advanced product filtering (Category, Certification Status)  
- Real-time analytics dashboard with visualizations  
- Supplier-Product relationship management  
- Form validation (frontend & backend)  
- Error handling with user-friendly messages  
- Loading states for better UX  

### CSV Export Feature (Bonus)
The products page includes an "Export to CSV" button that allows users to download all product data (with applied filters) as a CSV file. This feature is useful for:
- Importing product data into spreadsheet applications
- Creating offline backups
- Sharing data with external stakeholders
- Performing custom analysis in Excel/Google Sheets

The exported CSV includes all product fields: name, category, price, stock quantity, unit, certification status, supplier name, and more.

---

## API Endpoints

### Base URL
```
https://greentrade-assignment.onrender.com
```

### Suppliers

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/suppliers` | Create new supplier |
| `GET` | `/api/suppliers` | Get all suppliers |
| `GET` | `/api/suppliers/{id}` | Get supplier details with products |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/products` | Create new product |
| `GET` | `/api/products` | Get all products (with filters) |
| `PUT` | `/api/products/{id}` | Update product |
| `DELETE` | `/api/products/{id}` | Delete product |

### Query Parameters for GET /api/products
- `category` - Filter by category (Organic Food, Handmade, Sustainable Goods)
- `certification_status` - Filter by status (Certified, Pending, Not Certified)
- `skip` - Pagination offset (default: 0)
- `limit` - Results per page (default: 100)

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/analytics/summary` | Get aggregated statistics |

---

## Database Schema
- Suppliers
  
<img width="572" height="573" alt="Screenshot 2026-02-07 at 10 25 49 PM" src="https://github.com/user-attachments/assets/270f0748-d317-473d-b389-31e5148521b1" />

- Products
  
<img width="698" height="666" alt="Screenshot 2026-02-07 at 10 24 55 PM" src="https://github.com/user-attachments/assets/9259ca65-ab43-4c81-a486-4968c02aa58f" />

---

## Local Setup Instructions

### Prerequisites
- Python 3.10+ installed
- Node.js 18+ and npm installed
- PostgreSQL database (or use Neon free tier)
- Git installed

---

### Backend Setup

#### Step 1: Clone the Repository
```bash
git clone https://github.com/parthz-13/GreenTrade-Assignment.git
cd greentrade-assignment/backend
```

#### Step 2: Set Up Python Environment

**Option A: Using UV (Recommended - Faster)**
```bash
# Install UV if you don't have it
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create virtual environment and install dependencies
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -r requirements.txt
```

**Option B: Using Standard pip**
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### Step 3: Configure Environment Variables

Create a `.env` file in the `backend` directory with your configuration:
```env
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
BACKEND_PORT=8000
FRONTEND_URL=http://localhost:5173
```

**To get a FREE PostgreSQL database (Neon):**
1. Visit [neon.tech](https://neon.tech)
2. Sign up (no credit card required)
3. Create a new project
4. Copy the connection string to `DATABASE_URL`

#### Step 4: Run the Backend Server

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at:
- **API Base:** http://localhost:8000
- **Interactive Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health

---

### Frontend Setup

#### Step 1: Navigate to Frontend Directory
```bash
cd ../frontend
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Configure Environment Variables

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:8000/api
```

#### Step 4: Run the Development Server
```bash
npm run dev
```

The application will be available at: **http://localhost:5173**

---

### Quick Start (Both Servers)

**Terminal 1 - Backend:**
```bash
cd backend
source .venv/bin/activate  # or: source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Visit **http://localhost:5173** in your browser! 

---

## Testing the Application
### Test Scenarios
1. **Create Supplier:** Add "Organic Valley Farms" from India
2. **Create Product:** Add "Organic Honey" linked to a supplier
3. **Filter Products:** Filter by "Organic Food" category
4. **Update Product:** Change price and stock quantity
5. **View Analytics:** Check dashboard for updated statistics
6. **Delete Product:** Remove a product and verify analytics update
7. **Export to CSV:** Click 'Export to CSV' button on Products page and download the CSV file

### API Testing
Use the interactive Swagger UI at `/docs` endpoint or use `Postman`:
- Test all endpoints with custom data
- View request/response schemas
- Download OpenAPI specification

---

## Design Decisions & Assumptions

### Backend Architecture
1. **FastAPI + SQLAlchemy:** Chosen for type safety, automatic API documentation, and robust ORM capabilities
2. **Neon PostgreSQL:** Serverless database for zero-maintenance, automatic scaling, and free tier availability
3. **Pydantic Validation:** All API inputs validated at schema level before reaching business logic
4. **CORS Configuration:** Configured to allow frontend access while maintaining security

### Frontend Architecture
1. **React + Vite:** Fast development experience with Hot Module Replacement (HMR)
2. **Component Structure:** Organized by feature (Dashboard, Suppliers, Products) for maintainability
3. **Recharts:** Lightweight charting library for analytics visualization

### Data Model Decisions
1. **Certification Expiry Date:** Tracks certification validity (not product expiry) as per sustainable trade standards
2. **Stock Units:** Added `unit` field (kg, pcs, liters) to accurately represent different product types
3. **Cascade Delete:** Products are automatically deleted when their supplier is removed
4. **Email Uniqueness:** Supplier emails must be unique to prevent duplicates

### Assumptions
- Certification expiry dates are optional (products can be "Not Certified")
- Price is stored in USD as the default currency
- Stock quantities are always non-negative integers
- Suppliers can have zero products initially
- The system is designed for internal use (no authentication implemented for this MVP)



