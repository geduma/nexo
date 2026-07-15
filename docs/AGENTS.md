# AGENTS.md - AI Agent Guide for NEXO

This document provides guidelines for AI agents working on the NEXO codebase.

---

## 1. Project Context

NEXO is a Commercial Management Platform for small businesses selling through WhatsApp and social media.

- **Monorepo** with npm workspaces: `frontend/`, `backend/`, `shared/`
- **Single admin, single business** - no multi-tenant, no multi-user
- **MVP scope** - keep it simple, no over-engineering

---

## 2. Commands

Always run from the repository root unless specified otherwise.

| Command | Description |
|---|---|
| `npm run dev` | Start backend + frontend concurrently |
| `npm run build` | Build backend then frontend |
| `npm run lint` | Lint all workspaces |
| `npm run typecheck` | Type-check all workspaces |
| `npm run db:seed --workspace=backend` | Seed database |

After making changes, always run:
```bash
npm run typecheck && npm run lint
```

---

## 3. Architecture

### Backend Layered Architecture

```
HTTP Request -> Route -> Controller -> Service -> Repository -> Supabase REST API
```

No layer may skip another. Controllers handle HTTP. Services contain business logic. Repositories handle database access.

### Frontend Feature Structure

Each feature module follows:
```
src/features/<name>/
├── pages/          # Page components
├── components/     # Feature-specific components
├── hooks/          # TanStack Query hooks
├── services/       # API service functions
└── validations/    # Zod schemas
```

### Shared Package

`shared/src/` contains types and constants used by both frontend and backend. Import via `shared/*` path alias.

---

## 4. Conventions

### Naming

| Item | Convention |
|---|---|
| Variables, functions | camelCase |
| React components | PascalCase |
| Interfaces, enums | PascalCase |
| Files | kebab-case |
| Folders | lowercase |
| Database tables | snake_case |
| Database columns | snake_case |
| API routes | kebab-case |

### Imports

Use absolute imports with `@/` alias. Never use long relative paths.

```typescript
// Good
import { Button } from '@/components/button';

// Bad
import { Button } from '../../../components/button';
```

### Code Style

- TypeScript strict mode is enabled
- 2-space indentation, LF line endings, UTF-8
- No comments unless explicitly asked
- Use Zod for all validation (shared between frontend and backend)
- All visible UI strings must use i18n translation keys (`useTranslation()`)

### Design System

- **Global default radius**: `defaultRadius: "lg"` set in Mantine theme - all components inherit this
- Do NOT use explicit `radius="md"` on components - they should inherit the global default
- Do NOT use `var(--mantine-radius-md)` in inline styles - use `var(--mantine-radius-lg)` instead
- Consistent gray color palette defined in theme provider
- All UI strings must use i18n translation keys (`t()`) - never hardcode Spanish/English strings directly

---

## 5. API Response Format

All API responses follow this structure:

```json
// Success
{ "success": true, "data": {} }

// List with pagination
{ "success": true, "data": [], "pagination": { "page": 1, "limit": 20, "total": 100 } }

// Error
{ "success": false, "message": "...", "errors": [] }
```

---

## 6. Business Rules

Business rules are defined in `docs/NEXO_IMPLEMENTATION_SPEC_v2.0.md` under section 08.

Key rules to always follow:
- **BR-001**: One business only. No multi-tenant.
- **BR-004**: Sales are historical records. Never modify product info.
- **BR-100**: Every product belongs to exactly one category.
- **BR-204**: Products are invisible by default.
- **BR-206**: Featured products must be visible.
- **BR-304**: Availability never blocks WhatsApp.
- **BR-500**: Sales are manual records. No inventory impact.
- **BR-800**: Public catalog requires no auth.
- **BR-1400**: Never leave inconsistent data.

**Business rules override implementation details.** If implementation conflicts with a business rule, the business rule wins.

---

## 7. State Management

| Store | Purpose | Persisted |
|---|---|---|
| `useAuthStore` | Token, auth state | localStorage |
| `useSettingsStore` | Theme, language | localStorage |
| `useUIStore` | Sidebar state | Memory only |

**Rule:** No server data in Zustand. Server state uses TanStack Query.

---

## 8. Authentication

- JWT Bearer token stored in localStorage
- Token injected via Axios request interceptor
- 401 response (except login) clears token and redirects to `/login`
- Protected routes use `PrivateRoute` component

---

## 9. Database Access

- All database access goes through Supabase JS client (`@supabase/supabase-js`)
- Repositories are the only layer that touches the database client
- Tables: `categories`, `products`, `product_images`, `manual_sales`, `settings`
- UUIDs for all primary keys
- Foreign keys: `CASCADE` on product_images, `RESTRICT` on manual_sales

---

## 10. Frontend Patterns

- All page components use `React.lazy()` for code splitting
- Forms use React Hook Form + Zod resolvers
- Data fetching uses TanStack Query hooks (one hook per query/mutation)
- Tables use TanStack Table with built-in sort/pagination
- API calls go through a centralized Axios client (`src/services/api/client.ts`)
- Vite dev server proxies `/api` to `http://localhost:3001`

### Public Catalog

- Product cards with hover effects (translateY + shadow), image zoom, overlay badges
- Buy button on IN_STOCK products (shows "pending implementation" toast)
- WhatsApp button on cards and detail modal (requires configured WhatsApp number in settings)
- Detail modal with image carousel, pagination dots, buy + WhatsApp CTAs
- Search and category filter on same line (Flex layout)
- Grid skeleton loading state during data fetch
- Sticky footer with `min-height: 100vh` flex layout

### Social Generator

- Layout options: Single Image (with size variations) or Mosaic (max 5 images)
- Mosaic layouts adapt per template: story (vertical), square (balanced), landscape (horizontal)
- Auto-extracted dominant color from product image for gradient background
- Uses plain HTML divs for mosaic rendering (not Mantine components) to avoid layout issues

---

## 11. Backend Patterns

- Express 5 with ESM modules (`"type": "module"`)
- TypeScript executed via `tsx` in development
- Validation middleware wraps Zod schemas for route handlers
- Winston for request logging and error logging
- Helmet for security headers
- Multer for file uploads (images)
- Swagger docs auto-generated via `swagger-jsdoc`
- **Supabase snake_case mapping**: Repositories must map snake_case DB columns to camelCase frontend fields using a `toCamelCase()` helper method (see `settings.repository.ts` for reference)

---

## 12. Environment Variables

Never hardcode URLs or secrets. Always use environment variables.

**Backend** (`backend/.env`):
- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` - Database connection
- `JWT_SECRET` - Token signing
- `PORT`, `NODE_ENV`, `CORS_ORIGIN` - Server config
- `ADMIN_WHATSAPP`, `DEFAULT_LANGUAGE`, `DEFAULT_CURRENCY` - App defaults

**Frontend** (`frontend/.env`):
- `VITE_API_URL` - Backend API base URL
- `VITE_APP_NAME` - Display name
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` - Direct Supabase access

---

## 13. What NOT To Do

- Do not invent new business behavior beyond what's in the spec
- Do not add dependencies without checking if an existing one already serves the purpose
- Do not hardcode UI strings - always use i18n keys
- Do not put server state in Zustand
- Do not skip layers in the backend architecture
- Do not expose internal errors, stack traces, or SQL to the client
- Do not create multi-tenant or multi-user logic
- Do not implement inventory management or stock tracking
- Do not add comments to code unless explicitly requested
- Do not use explicit `radius="md"` on Mantine components - use the global default
- Do not use `var(--mantine-radius-md)` in inline CSS - use `var(--mantine-radius-lg)`
