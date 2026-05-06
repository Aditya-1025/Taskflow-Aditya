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

## 🛡 Security & Permissions

- **ADMIN**: Can manage all projects, users, and view global analytics.
- **PROJECT OWNER**: Full control over a specific project and its members.
- **MEMBER**: Can view assigned projects, create tasks, and add comments.

## 📄 License
MIT
