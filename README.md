# NEXO

Commercial management platform for small and medium-sized businesses that sell through WhatsApp, social media, and digital catalogs.

NEXO is not an ERP, CRM, or eCommerce platform. It is a lightweight tool that centralizes product management, sales recording, reporting, and social media asset generation.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Mantine 7, Zustand, TanStack Query |
| Backend | Node.js, Express 5, TypeScript |
| Database | PostgreSQL (Supabase) |
| Storage | Supabase Storage |
| Validation | Zod |
| Monorepo | npm workspaces |

## Prerequisites

- Node.js >= 18
- npm >= 9
- A [Supabase](https://supabase.com) project (free tier works)

## Getting Started

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/<org>/nexo.git
cd nexo
npm install
```

2. Set up environment variables:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env` with your Supabase credentials and a secure JWT secret.

3. Seed the database:

```bash
npm run db:seed --workspace=backend
```

4. Start the development servers:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:3001`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start backend and frontend in parallel |
| `npm run build` | Build backend then frontend |
| `npm run lint` | Lint all workspaces |
| `npm run typecheck` | Type-check all workspaces |
| `npm run db:seed` | Seed the database with default data |

### Backend

| Command | Description |
|---|---|
| `npm run dev --workspace=backend` | Start backend with hot reload |
| `npm run build --workspace=backend` | Compile TypeScript |
| `npm run db:generate --workspace=backend` | Generate Drizzle migrations |
| `npm run db:push --workspace=backend` | Push schema to database |
| `npm run db:studio --workspace=backend` | Open Drizzle Studio |

### Frontend

| Command | Description |
|---|---|
| `npm run dev --workspace=frontend` | Start Vite dev server |
| `npm run build --workspace=frontend` | Type-check and build for production |
| `npm run preview --workspace=frontend` | Preview production build |

## Project Structure

```
nexo/
├── frontend/          # React SPA
│   └── src/
│       ├── features/  # Feature modules (auth, products, sales, reports, ...)
│       ├── components/# Shared UI components
│       ├── hooks/     # Shared hooks
│       ├── services/  # API client
│       ├── i18n/      # Internationalization (es, en)
│       └── stores/    # Zustand stores (auth, settings, UI)
├── backend/           # Express REST API
│   └── src/
│       ├── routes/    # Route definitions
│       ├── controllers/
│       ├── services/  # Business logic
│       ├── repositories/ # Database access (Supabase)
│       ├── middleware/ # Auth, validation, error handling
│       └── validators/ # Zod schemas
├── shared/            # Shared types and constants
└── docs/              # Documentation
```

## API

The backend exposes a REST API under `/api/v1`. Swagger documentation is available at `/api/docs` when the server is running.

> Change these before deploying to production.

## License

Private
