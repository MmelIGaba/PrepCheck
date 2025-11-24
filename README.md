# PrepCheck

PrepCheck is an AI-powered career readiness screener application designed to analyze CVs and provide insightful feedback. It consists of a modern React frontend and a Node.js/Express backend integrated with Google Gemini AI for advanced CV analysis.

---

## Table of Contents

- [App Overview](#app-overview)
- [Technologies](#technologies)
- [Features](#features)
- [Getting Started - Development Setup](#getting-started---development-setup)
- [Testing](#testing)
- [Docker & Containerization](#docker--containerization)
- [CI/CD Pipeline](#cicd-pipeline)
- [Hosting](#hosting)
- [License](#license)

---

## App Overview

The PrepCheck application allows users to upload their CVs/resumes in PDF or DOCX format for AI-powered parsing and analysis. The backend extracts the textual content from the CV and sends it to Google Gemini AI for analysis to deliver personalized career readiness insights. Additionally, the app features a chat assistant for interactive querying.

The frontend is a React-based UI built with Vite and Tailwind CSS, providing a performant and responsive user experience including visualization and document upload.

---

## Technologies

### Backend
- Node.js with Express framework
- File upload handling with Multer
- CV parsing with `pdf-parse` and `mammoth` (for DOCX)
- AI integration via Google Generative AI SDK
- Environment configuration with `dotenv`
- Testing with Jest and Supertest

### Frontend
- React 18 with Vite as the build tool
- Styling with Tailwind CSS
- HTTP requests with Axios
- Animations using Framer Motion
- Visualization using Recharts
- PDF generation using jsPDF
- Tested with relevant unit and e2e testing tools

---

## Features

- **CV Upload and Analysis:** Upload PDF or DOCX CV files for AI-driven analysis.
- **AI Chat Assistant:** Interactive chat for career-related questions.
- **Health Check API:** Endpoint to verify backend server status.
- **Robust Validation:** File size limits and format validation (max 10MB).
- **Responsive Frontend:** Fast, intuitive user interface with charts and dashboards.

---

## Getting Started - Development Setup

### Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server with hot reload:
   ```bash
   npm run dev
   ```
4. The backend server will run by default on `http://localhost:5000`.

### Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The frontend app will run by default on `http://localhost:5173`.

---

## Testing

### Backend Tests

- Located in `backend/tests/`
- Run backend tests using Jest:
  ```bash
  npm test
  ```

### Frontend Tests

- Located under `frontend/tests/`
- Use your preferred test runner as configured for React/Vite stack.

---

## Docker & Containerization

PrepCheck uses Docker to containerize both the backend and frontend for easy deployment and consistent environment:

- **Backend Dockerfile:**
  - Uses `node:22-alpine` base image.
  - Installs dependencies with production optimizations.
  - Exposes port `5000`.
  - Starts with `node server.js`.

- **Frontend Dockerfile:**
  - Multi-stage build with `node:22-alpine` for building the React app via Vite.
  - Production image served by `nginx:stable-alpine`.
  - Exposes port `80`.

- **docker-compose.yaml** orchestrates both services:
  - Backend listens on host port `6000` mapping to container port `5000`.
  - Frontend serves on host port `80`.
  - Frontend service waits on backend healthcheck to ensure readiness.

To build and run containers locally with Docker Compose:

```bash
docker-compose up --build
```

---

## CI/CD Pipeline

PrepCheck leverages GitHub Actions for continuous integration and deployment:

- The workflow triggers on pushes and pull requests to the `main` branch.
- Uses Docker Buildx to build and push the backend Docker image.
- Pushes to Docker Hub repository `mmeligab/prepcheck-backend`.
- Configured with caching for efficient image builds.
- Authentication uses GitHub Secrets for Docker Hub credentials.

This pipeline ensures automated testing, building, and pushing of Docker images on update.

---

## Hosting

The application is designed to be hosted in a Docker-compatible environment:

- Run backend and frontend as separate containers managed via `docker-compose`.
- Backend exposed on port `6000` on the host.
- Frontend exposed on port `80` and depends on the backend being healthy before starting.
- Suitable for deployment on cloud platforms supporting Docker (e.g., AWS ECS, Azure Container Instances, DigitalOcean, or a VPS server with Docker installed).

---
## Devs

- Tech Lead Frontend / Backend: [Nqobile](https://nqobile-portfolio.onrender.com/)
- Writer: [Boipelo](https://github.com/boipelo-codes)
- DevOps: [Mmeli](https://personal-site-zeta-silk.vercel.app/)

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
