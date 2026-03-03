# Company Incorporation System

A full-stack web application to manage the company incorporation workflow.

---

## Features

- Multi-step company registration flow
- Backend API for company data and shareholders
- Frontend UI for form submission and progress tracking
- Environment-based configuration

---

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Django + Django REST Framework
- **Database:** PostgreSQL

---

## Project Structure

```text
Company-Incorporation-System/
├─ backend/
├─ frontend/
└─ README.md
```

---

## Prerequisites

- Node.js 18+
- npm 9+
- Python 3.10+
- PostgreSQL

---

## Environment Variables

### Backend

Create `backend/.env` from `backend/.env.example`.

**backend/.env.example:**

```env
# Django secret key
SECRET_KEY=your_django_secret_key

# Debug mode
DEBUG=True

# Database settings
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_PORT=your_database_port
```

---

### Frontend

Create `frontend/.env` from `frontend/.env.example`.

**frontend/.env.example:**

```env
# Base URL for API requests
VITE_API_BASE_URL=your_backend_api_url
```

**frontend/.env (example for local development):**

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

> **Note:** In Vite, all environment variables must be prefixed with `VITE_`. Access them in code using `import.meta.env.VITE_API_BASE_URL`.

---

## Run Locally

### 1) Backend

```bash
cd backend
python -m venv .venv

# Windows PowerShell
.\.venv\Scripts\Activate.ps1

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env        # macOS/Linux
copy .env.example .env      # Windows

python manage.py migrate
python manage.py createsuperuser   # optional: create admin user
python manage.py runserver
```

Backend runs at: `http://127.0.0.1:8000`

---

### 2) Frontend

Open a new terminal:

```bash
cd frontend
npm install
cp .env.example .env        # macOS/Linux
copy .env.example .env      # Windows
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

---

### Admin Panel

```
GET /admin/
```

Django admin interface. Requires superuser credentials (created via `python manage.py createsuperuser`).

---

## Common Scripts

### Frontend

```bash
npm run dev      # start dev server
npm run build    # build production files
npm run preview  # preview production build
```

### Backend

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

---

## Troubleshooting

- **`process is not defined` in frontend:** Use `import.meta.env.VITE_*` instead of `process.env.*`.
- **CORS issues:** Add the frontend URL to `CORS_ALLOWED_ORIGINS` in `backend/settings.py`.
- **Port conflict:** Change local ports or stop the conflicting process.
- **Database connection errors:** Verify PostgreSQL is running and your `.env` credentials are correct.

---

## License

Internal / private project.
