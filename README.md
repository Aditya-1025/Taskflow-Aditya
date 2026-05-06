# TeamFlow Enterprise Task Manager

A production-ready, enterprise-grade task management platform built with Spring Boot and React.

## 🚀 Features

- **Advanced Kanban Board**: Drag and drop tasks across statuses with real-time updates.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions for Admins and Members.
- **Enterprise Analytics**: Interactive charts (Recharts) for project health and team productivity.
- **Activity Logging**: Full audit trail of project and task lifecycle events.
- **Discussion System**: Real-time comments on tasks for seamless collaboration.
- **Soft Deletion**: Secure data management with auditable record recovery.
- **Modern UI/UX**: Dark mode support, glassmorphic aesthetics, and responsive design.

## 🛠 Tech Stack

- **Backend**: Java 17, Spring Boot 3.2, PostgreSQL, JPA/Hibernate, Spring Security (JWT).
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS 4, TanStack Query, Recharts, Dnd Kit.
- **DevOps**: Docker, Docker Compose.

## 📦 Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)
- Java 17+ (for local development)

### Running with Docker
```bash
docker-compose up --build
```

The app will be available at:
- Frontend: `http://localhost:80`
- API Documentation (Swagger): `http://localhost:8080/swagger-ui.html`

## 🚢 Deployment

### Option 1: Deploy the full project on a VPS with Docker Compose

1. Copy the production environment template:
```bash
cp .env.production.example .env.production
```

2. Edit `.env.production` and set strong real values:
```bash
nano .env.production
```

Important values:
- `POSTGRES_PASSWORD`: use a strong database password.
- `JWT_SECRET`: use a long random secret.
- `FRONTEND_URL`: your public frontend URL, for example `https://app.example.com`.
- `BACKEND_URL`: your public backend URL, for example `https://api.example.com`.

3. Build and start the production stack:
```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up --build -d
```

4. Check containers and logs:
```bash
docker compose --env-file .env.production -f docker-compose.prod.yml ps
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f backend
```

5. Open:
- Frontend: the value of `FRONTEND_URL`
- Backend health: `${BACKEND_URL}/actuator/health`

For a real domain, point your DNS to the server and put Nginx or Caddy in front of the containers for HTTPS.

### Option 2: Deploy services separately

Deploy these three services:
- PostgreSQL database
- Backend from `backend/Dockerfile`
- Frontend from `frontend/Dockerfile`

Backend environment variables:
```bash
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=jdbc:postgresql://YOUR_DB_HOST:5432/YOUR_DB_NAME
SPRING_DATASOURCE_USERNAME=YOUR_DB_USER
SPRING_DATASOURCE_PASSWORD=YOUR_DB_PASSWORD
JWT_SECRET=YOUR_LONG_RANDOM_SECRET
ALLOWED_ORIGINS=https://YOUR_FRONTEND_DOMAIN
```

Frontend environment variable:
```bash
API_URL=https://YOUR_BACKEND_DOMAIN/api
```

## 🛡 Security & Permissions

- **ADMIN**: Can manage all projects, users, and view global analytics.
- **PROJECT OWNER**: Full control over a specific project and its members.
- **MEMBER**: Can view assigned projects, create tasks, and add comments.

## 📄 License
MIT
