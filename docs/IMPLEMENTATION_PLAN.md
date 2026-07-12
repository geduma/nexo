# NEXO - Plan de Implementación

Versión: 1.0

Fecha: Julio 2026

---

## Resumen Ejecutivo

Este documento define el plan de implementación del MVP de NEXO, una Plataforma de Gestión Comercial para pequeños y medianos negocios. El plan está organizado en 7 fases secuenciales con una estimación de 48 días de desarrollo.

---

## Stack Tecnológico Autorizado

### Frontend

| Componente | Tecnología |
|---|---|
| Framework | React 19 |
| Lenguaje | TypeScript (Strict Mode) |
| Build Tool | Vite |
| Routing | React Router |
| UI Library | Mantine |
| State Management | Zustand |
| Server State | TanStack Query |
| Tables | TanStack Table |
| Forms | React Hook Form |
| Validation | Zod |
| Charts | Recharts |
| Icons | Lucide React |
| i18n | react-i18next |
| Dates | date-fns |

### Backend

| Componente | Tecnología |
|---|---|
| Runtime | Node.js LTS |
| Lenguaje | TypeScript (Strict Mode) |
| Framework | Express |
| ORM | Drizzle ORM |
| Validation | Zod |
| Authentication | JWT |
| Password Hashing | bcrypt |
| Logging | Winston |
| API Docs | Swagger / OpenAPI |

### Database & Storage

| Componente | Tecnología |
|---|---|
| Engine | PostgreSQL |
| Provider | Supabase |
| Storage | Supabase Storage |
| Bucket | product-images |
| Hosting Frontend | Azure Static Web Apps |
| Repository | GitHub |

---

## Estructura del Proyecto

```
nenxo/
├── frontend/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── common/
│       │   ├── layout/
│       │   └── ui/
│       ├── features/
│       │   ├── auth/
│       │   ├── catalog/
│       │   ├── categories/
│       │   ├── dashboard/
│       │   ├── products/
│       │   ├── reports/
│       │   ├── sales/
│       │   ├── settings/
│       │   └── social/
│       ├── hooks/
│       ├── i18n/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       │   └── api/
│       ├── stores/
│       ├── types/
│       ├── utils/
│       └── App.tsx
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       │   ├── auth/
│       │   ├── categories/
│       │   ├── images/
│       │   ├── products/
│       │   ├── reports/
│       │   ├── sales/
│       │   └── settings/
│       ├── database/
│       │   ├── migrations/
│       │   ├── schema/
│       │   └── seed/
│       ├── middleware/
│       ├── repositories/
│       │   ├── categories/
│       │   ├── images/
│       │   ├── products/
│       │   ├── sales/
│       │   └── settings/
│       ├── routes/
│       ├── services/
│       │   ├── auth/
│       │   ├── categories/
│       │   ├── images/
│       │   ├── products/
│       │   ├── reports/
│       │   ├── sales/
│       │   └── settings/
│       ├── storage/
│       ├── types/
│       ├── utils/
│       ├── validators/
│       ├── app.ts
│       └── server.ts
├── shared/
│   ├── constants/
│   └── types/
└── docs/
```

---

## Variables de Entorno

### Frontend

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base del API backend |
| `VITE_APP_NAME` | Nombre de la aplicación |

### Backend

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor |
| `NODE_ENV` | Entorno (development/production) |
| `JWT_SECRET` | Secreto para firmar JWT |
| `SUPABASE_URL` | URL de Supabase |
| `SUPABASE_SERVICE_KEY` | Service key de Supabase |
| `SUPABASE_STORAGE_BUCKET` | Nombre del bucket de storage |
| `ADMIN_WHATSAPP` | Número WhatsApp del admin |
| `DEFAULT_LANGUAGE` | Idioma por defecto (es) |
| `DEFAULT_CURRENCY` | Moneda por defecto (COP) |

---

## Fase 0: Infraestructura Base (Días 1-2)

### Objetivo

Proyecto compilable con monorepo funcional, backend con health endpoint y frontend con theme configurado.

### 0.1 Monorepo Setup

- Inicializar proyecto con `npm workspaces`
- Estructura: `frontend/`, `backend/`, `shared/`
- Configurar `tsconfig.json` base con strict mode para ambos proyectos
- Configurar `.editorconfig` y reglas de linting compartidas
- Scripts de workspace para dev, build, lint

### 0.2 Backend Bootstrap

**Archivos a crear:**
- `backend/package.json`
- `backend/tsconfig.json`
- `backend/.env.example`
- `backend/src/app.ts` → Express app con middleware
- `backend/src/server.ts` → bootstrap de la aplicación

**Dependencias:**
```
express, helmet, cors, compression, dotenv, winston
@types/express, @types/cors, @types/compression
typescript, ts-node, tsx
```

**Middleware a registrar:**
- helmet (security headers)
- cors (origins: localhost:5173 dev, ENV prod)
- compression (JSON responses)
- express.json()
- express.urlencoded()
- request logger (Winston)
- global error handler
- 404 handler

**Endpoint:**
- `GET /api/v1/health` → `{ success: true, status: "healthy", database: "connected", storage: "connected", timestamp: "..." }`

### 0.3 Frontend Bootstrap

**Archivos a crear:**
- `frontend/package.json`
- `frontend/tsconfig.json`
- `frontend/vite.config.ts`
- `frontend/.env.example`
- `frontend/src/main.tsx`
- `frontend/src/App.tsx`

**Dependencias:**
```
react, react-dom, react-router-dom
@mantine/core, @mantine/hooks, @mantine/notifications, @mantine/styles
@tanstack/react-query
zustand
react-hook-form, @hookform/resolvers
zod
recharts, lucide-react, date-fns
react-i18next, i18next
```

**Configuración:**
- Path aliases: `@/` → `src/`
- i18n con archivos `es.json` y `en.json`
- Theme provider con Mantine (light/dark)
- Notifications provider

### 0.4 Database Setup

- Crear proyecto en Supabase (PostgreSQL)
- Instalar `drizzle-orm`, `drizzle-kit`, `@supabase/supabase-js`
- Configurar `drizzle.config.ts`
- Definir conexión a BD en `backend/src/config/database.ts`

---

## Fase 1: Base de Datos (Días 3-5)

### Objetivo

Schema completo de la base de datos con migraciones, seed y relaciones.

### 1.1 Schema Drizzle

**Archivos:** `backend/src/database/schema/`

| Archivo | Contenido |
|---|---|
| `enums.ts` | `ProductAvailabilityStatus` (IN_STOCK, CHECK_SUPPLIER) |
| `categories.ts` | Tabla categories con todos los campos |
| `products.ts` | Tabla products con FK a categories |
| `product-images.ts` | Tabla product_images con FK a products (CASCADE) |
| `manual-sales.ts` | Tabla manual_sales con FK a products (RESTRICT) |
| `settings.ts` | Tabla settings (single row) |
| `relations.ts` | Relaciones entre todas las tablas |
| `indexes.ts` | Todos los índices definidos en el spec |
| `constraints.ts` | Constraints de negocio |

### 1.2 Migraciones

**Archivos:** `backend/src/database/migrations/`

| Migración | Contenido |
|---|---|
| `001_create_enums.sql` | ProductAvailabilityStatus |
| `002_create_categories.sql` | Tabla categories |
| `003_create_products.sql` | Tabla products |
| `004_create_product_images.sql` | Tabla product_images |
| `005_create_manual_sales.sql` | Tabla manual_sales |
| `006_create_settings.sql` | Tabla settings |
| `007_create_indexes.sql` | Todos los índices |
| `008_seed.sql` | Datos iniciales |

### 1.3 Seed Data

**Categoría por defecto:**
- name: "General"
- slug: "general"
- is_active: true
- display_order: 0

**Settings por defecto:**
- business_name: "NEXO"
- currency: "COP"
- currency_symbol: "$"
- default_language: "es"
- theme: "system"
- whatsapp_number: "" (requerido, admin debe configurar)

### 1.4 Índices

**categories:** name, slug, display_order

**products:** category_id, availability_status, is_featured, is_visible, name

**product_images:** product_id, display_order

**manual_sales:** sale_date, product_id, payment_method

---

## Fase 2: Backend Core (Días 6-12)

### Objetivo

Backend completo con todos los endpoints, validación, autenticación y documentación Swagger.

### 2.1 Configuración

**Archivos:** `backend/src/config/`

| Archivo | Responsabilidad |
|---|---|
| `database.ts` | Conexión Drizzle + Supabase client |
| `storage.ts` | Configuración Supabase Storage |
| `logger.ts` | Winston configurado con transports |
| `cors.ts` | Orígenes permitidos por entorno |
| `swagger.ts` | OpenAPI/Swagger setup en /api/docs |

### 2.2 Middleware

**Archivos:** `backend/src/middleware/`

| Archivo | Responsabilidad |
|---|---|
| `error-handler.ts` | Error global: 400, 401, 403, 404, 409, 422, 500 |
| `request-logger.ts` | Log: timestamp, method, url, status, time, IP |
| `auth.ts` | Validación JWT (Bearer token) |
| `validate.ts` | Wrapper Zod → HTTP 422 con errores field-level |

### 2.3 Validators (DTOs)

**Archivos:** `backend/src/validators/`

| Archivo | DTOs |
|---|---|
| `category.validator.ts` | CreateCategoryDto, UpdateCategoryDto |
| `product.validator.ts` | CreateProductDto, UpdateProductDto |
| `sale.validator.ts` | CreateSaleDto, UpdateSaleDto |
| `settings.validator.ts` | UpdateSettingsDto |
| `pagination.validator.ts` | PaginationQuery, SortQuery |

### 2.4 Repositories

**Archivos:** `backend/src/repositories/`

| Repositorio | Métodos |
|---|---|
| `categories/category.repository.ts` | findAll, findById, create, update, delete, existsByName, countProducts |
| `products/product.repository.ts` | findAll (paginated+filtered), findById, create, update, delete, search |
| `images/image.repository.ts` | findByProduct, findById, create, update, delete, getPrimary, setPrimary, countByProduct, deleteByProduct |
| `sales/sale.repository.ts` | findAll (paginated+filtered), findById, create, update, delete, summary, topProducts, dailySales |
| `settings/settings.repository.ts` | get, update |

### 2.5 Services

**Archivos:** `backend/src/services/`

| Servicio | Reglas de Negocio |
|---|---|
| `categories/category.service.ts` | BR-100 a BR-106 (nombres únicos, slug auto, no borrar con productos) |
| `products/product.service.ts` | BR-200 a BR-213 (precios, visibilidad, featured, imágenes) |
| `images/image.service.ts` | BR-400 a BR-405 (formatos, tamaño, primary, cascade delete) |
| `sales/sale.service.ts` | BR-500 a BR-506 (no afecta inventario, preserva precios históricos) |
| `reports/report.service.ts` | BR-600 a BR-603 (summary, top products, daily sales) |
| `settings/settings.service.ts` | BR-700 a BR-703 (single row, propagate changes) |
| `storage/storage.service.ts` | Upload, delete, getPublicUrl, validate MIME/size |
| `auth/auth.service.ts` | Login, JWT generation, password hashing |

### 2.6 Controllers

**Archivos:** `backend/src/controllers/`

Cada controller sigue el patrón: Recibir Request → Validar → Llamar Service → Retornar Response

| Controller | Endpoints |
|---|---|
| `auth/auth.controller.ts` | POST /login |
| `categories/category.controller.ts` | CRUD categorías |
| `products/product.controller.ts` | CRUD productos |
| `images/image.controller.ts` | CRUD imágenes de producto |
| `sales/sale.controller.ts` | CRUD ventas manuales |
| `reports/report.controller.ts` | GET summary, top-products, daily-sales |
| `settings/settings.controller.ts` | GET/PUT settings |
| `health.controller.ts` | GET /health |

### 2.7 Routes

**Archivos:** `backend/src/routes/`

Todas las rutas bajo `/api/v1`:

| Ruta | Métodos | Auth |
|---|---|---|
| `/health` | GET | No |
| `/auth/login` | POST | No |
| `/categories` | GET, POST | GET: No, POST: Sí |
| `/categories/:id` | GET, PUT, DELETE | GET: No, PUT/DELETE: Sí |
| `/products` | GET, POST | GET: No, POST: Sí |
| `/products/:id` | GET, PUT, DELETE | GET: No, PUT/DELETE: Sí |
| `/products/:productId/images` | GET, POST | GET: No, POST: Sí |
| `/products/:productId/images/:imageId` | PUT, DELETE | Sí |
| `/sales` | GET, POST | Sí |
| `/sales/:id` | GET, PUT, DELETE | Sí |
| `/reports/summary` | GET | Sí |
| `/reports/top-products` | GET | Sí |
| `/reports/daily-sales` | GET | Sí |
| `/settings` | GET, PUT | Sí |
| `/search/products` | GET | Sí |

### 2.8 Swagger

**Endpoint:** `GET /api/docs`

Cada endpoint documentado con:
- Descripción
- Parámetros
- Responses (200, 201, 204, 400, 401, 403, 404, 409, 422, 500)
- Ejemplos
- Autenticación

---

## Fase 3: Frontend Core (Días 13-22)

### Objetivo

Infrastructure del frontend: API client, stores, hooks compartidos, componentes comunes, layouts, routing e i18n.

### 3.1 API Client

**Archivos:** `frontend/src/services/api/`

| Archivo | Contenido |
|---|---|
| `client.ts` | Instancia axios con base URL, interceptores JWT, manejo de errores |
| `types.ts` | SuccessResponse, ListResponse, ErrorResponse, Pagination |

### 3.2 Stores (Zustand)

**Archivos:** `frontend/src/stores/`

| Store | Estado |
|---|---|
| `auth.store.ts` | token, user, isAuthenticated, login(), logout() |
| `settings.store.ts` | theme, language, currency, businessName |
| `ui.store.ts` | sidebarOpen, toggleSidebar() |

**Regla:** No server data en Zustand. Solo auth, settings, theme, language, sidebar.

### 3.3 Hooks Compartidos

**Archivos:** `frontend/src/hooks/`

| Hook | Uso |
|---|---|
| `use-debounce.ts` | Debounce 300ms para búsqueda |
| `use-pagination.ts` | Estado de paginación |
| `use-sort.ts` | Estado de ordenamiento |

### 3.4 Types

**Archivos:** `frontend/src/types/`

| Archivo | Contenido |
|---|---|
| `product.ts` | Product, ProductImage, ProductAvailabilityStatus |
| `category.ts` | Category |
| `sale.ts` | ManualSale |
| `settings.ts` | Settings |
| `reports.ts` | ReportSummary, TopProduct, DailySale |
| `api.ts` | ApiResponse, PaginatedResponse, ErrorResponse |

### 3.5 Shared Components

**Archivos:** `frontend/src/components/`

| Componente | Uso |
|---|---|
| `common/loading-skeleton.tsx` | Skeleton de carga |
| `common/empty-state.tsx` | Estado vacío con ilustración y acción |
| `common/error-state.tsx` | Estado de error con retry |
| `common/confirm-dialog.tsx` | Diálogo de confirmación reutilizable |
| `common/data-table.tsx` | Wrapper TanStack Table con sort/pagination/filter |
| `common/search-input.tsx` | Input con debounce 300ms |
| `common/image-upload.tsx` | Upload de imágenes (máx 5, jpg/png/webp, 5MB) |
| `common/availability-badge.tsx` | Badge: Disponible (verde) / Consultar (amarillo) |
| `common/currency-display.tsx` | Formato de moneda desde settings |
| `common/price-display.tsx` | Precio con formato |

### 3.6 Layouts

**Archivos:** `frontend/src/layouts/` y `frontend/src/components/layout/`

| Layout | Estructura |
|---|---|
| `public-layout.tsx` | Contenido público (catálogo) |
| `admin-layout.tsx` | Sidebar + Header + Content + Footer |

| Componente Layout | Contenido |
|---|---|
| `sidebar.tsx` | Navegación: Dashboard, Products, Categories, Sales, Reports, Social, Settings, Logout |
| `header.tsx` | Search, Theme Toggle, Language Selector, Profile Menu |
| `footer.tsx` | Versión, Copyright |

### 3.7 i18n

**Archivos:** `frontend/src/i18n/`

| Archivo | Contenido |
|---|---|
| `es.json` | Traducciones al español (todas las strings visibles) |
| `en.json` | Traducciones al inglés |
| `index.ts` | Configuración react-i18next |

**Regla:** Ninguna string hardcodeada. Todas usan translation keys.

### 3.8 Routes

**Archivos:** `frontend/src/routes/`

| Ruta | Página | Auth |
|---|---|---|
| `/` | Catálogo Público | No |
| `/login` | Login Admin | No |
| `/dashboard` | Dashboard | Sí |
| `/products` | Lista Productos | Sí |
| `/products/create` | Crear Producto | Sí |
| `/products/:id/edit` | Editar Producto | Sí |
| `/products/:id` | Detalle Producto | Sí |
| `/categories` | Lista Categorías | Sí |
| `/categories/create` | Crear Categoría | Sí |
| `/categories/:id/edit` | Editar Categoría | Sí |
| `/sales` | Lista Ventas | Sí |
| `/sales/create` | Registrar Venta | Sí |
| `/sales/:id/edit` | Editar Venta | Sí |
| `/reports` | Reportes | Sí |
| `/settings` | Configuración | Sí |
| `/social` | Generador Social | Sí |
| `/404` | No Encontrado | No |

**Guard:** Componente que redirige a `/login` si no hay token.

---

## Fase 4: Módulos Frontend (Días 23-38)

### Objetivo

Implementar cada módulo de la aplicación frontend siguiendo feature-based architecture.

### 4.1 Auth (Días 23-24)

**Archivos:** `frontend/src/features/auth/`

| Archivo | Contenido |
|---|---|
| `pages/login.tsx` | Formulario email + password, Logo, NOMBRE_APP |
| `hooks/use-login.ts` | TanStack Query mutation para login |
| `services/auth.service.ts` | POST /auth/login |
| `validations/auth.schema.ts` | Zod: email required, password required |

**Comportamiento:**
- Login exitoso → guardar token en Zustand → redirect a /dashboard
- Login fallido → toast error
- Formulario con React Hook Form + Zod

### 4.2 Dashboard (Días 25-26)

**Archivos:** `frontend/src/features/dashboard/`

| Archivo | Contenido |
|---|---|
| `pages/dashboard.tsx` | Layout principal del dashboard |
| `components/stat-cards.tsx` | 4 cards: Productos, Categorías, Ventas, Revenue |
| `components/charts/revenue-chart.tsx` | Gráfico de ingresos (Recharts) |
| `components/charts/daily-sales-chart.tsx` | Gráfico de ventas diarias |
| `components/charts/top-products-chart.tsx` | Top productos más vendidos |
| `components/recent-sales.tsx` | Últimas ventas registradas |
| `components/quick-actions.tsx` | Acciones rápidas: Nuevo Producto, Registrar Venta, Generar Post |
| `hooks/use-dashboard.ts` | TanStack Query para datos del dashboard |
| `services/dashboard.service.ts` | GET /reports/summary |

### 4.3 Categories (Días 27-28)

**Archivos:** `frontend/src/features/categories/`

| Archivo | Contenido |
|---|---|
| `pages/category-list.tsx` | Tabla con TanStack Table |
| `pages/category-create.tsx` | Formulario de creación |
| `pages/category-edit.tsx` | Formulario de edición (pre-cargado) |
| `components/category-form.tsx` | Formulario reutilizable (create/edit) |
| `components/category-dialogs.tsx` | Delete confirmation dialog |
| `components/category-table-columns.tsx` | Definición de columnas |
| `hooks/use-categories.ts` | CRUD queries con TanStack Query |
| `services/category.service.ts` | GET, POST, PUT, DELETE /categories |
| `validations/category.schema.ts` | Zod: name (required, max 100, unique), description, displayOrder |

**Columnas de tabla:** Nombre, Productos Count, Orden, Status, Acciones (Edit, Delete, Activate/Deactivate)

**Reglas implementadas:**
- BR-100: Cada producto pertenece a una categoría
- BR-101: Nombres únicos (case insensitive)
- BR-102: Slug automático
- BR-103: Categorías inactivas no aparecen en catálogo
- BR-105: No se puede borrar si tiene productos (409)
- BR-106: display_order para ordenamiento

### 4.4 Products (Días 29-33)

**Archivos:** `frontend/src/features/products/`

| Archivo | Contenido |
|---|---|
| `pages/product-list.tsx` | Tabla con filtros (category, availability, visible, featured, search) |
| `pages/product-create.tsx` | Formulario completo + image manager |
| `pages/product-edit.tsx` | Edición con datos precargados |
| `pages/product-detail.tsx` | Vista de detalle (admin) |
| `components/product-form.tsx` | Formulario reutilizable |
| `components/product-table-columns.tsx` | Columnas de tabla |
| `components/product-filters.tsx` | Filtros de búsqueda y categoría |
| `components/image-manager.tsx` | Upload, delete, order, primary (máx 5) |
| `components/product-card.tsx` | Card para grid del catálogo |
| `hooks/use-products.ts` | CRUD queries |
| `services/product.service.ts` | GET, POST, PUT, DELETE /products |
| `services/image.service.ts` | GET, POST, PUT, DELETE /products/:id/images |
| `validations/product.schema.ts` | Zod: name, categoryId, priceCost, priceSale, availability, etc. |

**Columnas de tabla:** Imagen, Nombre, Categoría, Precio Venta, Disponibilidad, Visible, Featured, Acciones (View, Edit, Delete)

**Reglas implementadas:**
- BR-200: Producto requiere categoría, nombre, precio, disponibilidad, visibilidad
- BR-202: precio_sale > 0
- BR-203: precio_cost >= 0
- BR-204: Creado invisible por defecto
- BR-205: Invisibles no aparecen en catálogo
- BR-206: Featured requiere visible
- BR-207: Mínimo 1 imagen para ser visible
- BR-208: Máximo 5 imágenes
- BR-209: Exactamente 1 imagen primary
- BR-210: Si se borra primary, siguiente se vuelve primary
- BR-212: supplier_info es privado (nunca en catálogo)
- BR-213: Cambiar precios no afecta ventas históricas

### 4.5 Sales (Días 34-35)

**Archivos:** `frontend/src/features/sales/`

| Archivo | Contenido |
|---|---|
| `pages/sale-list.tsx` | Tabla con filtros (fecha, producto, método pago) |
| `pages/sale-create.tsx` | Formulario de registro |
| `pages/sale-edit.tsx` | Edición de venta |
| `components/sale-form.tsx` | Formulario reutilizable |
| `components/sale-table-columns.tsx` | Columnas de tabla |
| `components/sale-filters.tsx` | Filtros de búsqueda |
| `hooks/use-sales.ts` | CRUD queries |
| `services/sale.service.ts` | GET, POST, PUT, DELETE /sales |
| `validations/sale.schema.ts` | Zod: productId, customerName, quantity, salePrice, etc. |

**Columnas de tabla:** Fecha, Producto, Cliente, Cantidad, Total, Método Pago, Acciones (Edit, Delete)

**Reglas implementadas:**
- BR-500: Registro manual
- BR-501: No afecta disponibilidad
- BR-502: No reduce inventario
- BR-503: Preserva precios históricos
- BR-504: Editar producto no modifica ventas
- BR-506: quantity >= 1

### 4.6 Reports (Días 36-37)

**Archivos:** `frontend/src/features/reports/`

| Archivo | Contenido |
|---|---|
| `pages/reports.tsx` | Layout principal de reportes |
| `components/report-cards.tsx` | 4 cards: Revenue, Ventas, Ticket Promedio, Productos Vendidos |
| `components/charts/revenue-by-day.tsx` | Gráfico de ingresos por día |
| `components/charts/top-products.tsx` | Top productos vendidos |
| `components/charts/sales-trend.tsx` | Tendencia de ventas |
| `components/date-range-filter.tsx` | Filtro de rango de fechas |
| `hooks/use-reports.ts` | Queries para reportes |
| `services/report.service.ts` | GET /reports/summary, /reports/top-products, /reports/daily-sales |

**Reglas implementadas:**
- BR-600: Solo ventas registradas
- BR-601: Revenue = suma de sale_price
- BR-602: Top products = cantidad vendida
- BR-603: Productos invisibles que nunca se vendieron se ignoran

### 4.7 Settings (Día 38)

**Archivos:** `frontend/src/features/settings/`

| Archivo | Contenido |
|---|---|
| `pages/settings.tsx` | Página de configuración |
| `components/settings-form.tsx` | Formulario: business name, logo, currency, language, theme, whatsapp |
| `hooks/use-settings.ts` | GET/PUT settings |
| `services/settings.service.ts` | GET, PUT /settings |
| `validations/settings.schema.ts` | Zod: businessName, currency, language, theme, whatsappNumber |

**Reglas implementadas:**
- BR-700: Exactamente un registro
- BR-701: Cambio de nombre actualiza admin, catálogo, título
- BR-702: Cambio de WhatsApp afecta catálogo, detalle, links, social
- BR-703: Cambio de moneda actualiza toda la app

### 4.8 Social Generator (Día 38)

**Archivos:** `frontend/src/features/social/`

| Archivo | Contenido |
|---|---|
| `pages/social-generator.tsx` | Flujo: Select Product → Choose Template → Preview → Download |
| `components/product-selector.tsx` | Selector de producto |
| `components/template-selector.tsx` | 3 templates: Square, Story, Landscape |
| `components/preview-canvas.tsx` | Canvas de preview con imagen del producto |
| `components/download-button.tsx` | Export a PNG (html-to-image) |
| `components/copy-text-button.tsx` | Copiar texto de marketing al clipboard |

### 4.9 Public Catalog (Días 38-39)

**Archivos:** `frontend/src/features/catalog/`

| Archivo | Contenido |
|---|---|
| `pages/catalog-home.tsx` | Landing page pública |
| `pages/catalog-product.tsx` | Detalle de producto público |
| `components/catalog-header.tsx` | Logo + Nombre del negocio |
| `components/catalog-search.tsx` | Búsqueda con debounce |
| `components/category-filter.tsx` | Filtro de categorías activas |
| `components/featured-section.tsx` | Productos destacados |
| `components/product-grid.tsx` | Grid de productos |
| `components/whatsapp-button.tsx` | Link wa.me/phone?text=message |
| `components/related-products.tsx` | Productos relacionados (misma categoría, máx 4) |
| `components/catalog-footer.tsx` | Footer del catálogo |
| `hooks/use-catalog.ts` | Queries del catálogo público |
| `services/catalog.service.ts` | GET /products, /products/:id, /categories |

**Reglas implementadas:**
- BR-800: Sin autenticación
- BR-801: Solo productos visibles
- BR-802: Solo categorías activas
- BR-803: Producto invisible → 404
- BR-804: Relacionados: misma categoría, visibles, excluye actual, máx 4
- BR-1000: Cada producto tiene acción WhatsApp
- BR-1001: Mensaje incluye nombre, precio, URL
- BR-1002: CHECK_SUPPLIER agrega "Consultar disponibilidad"

---

## Fase 5: Pages & Routing (Días 40-42)

### Objetivo

Páginas de error, routing completo y conexión de todas las rutas.

### 5.1 Error Pages

**Archivos:** `frontend/src/pages/`

| Página | Ruta | Contenido |
|---|---|---|
| `not-found.tsx` | /404 | Ilustración + mensaje + botón volver |
| `unauthorized.tsx` | /unauthorized | Mensaje de acceso + redirect login |
| `error.tsx` | Error genérico | Mensaje amigable + retry |

### 5.2 App.tsx

- MantineProvider con theme
- Notifications provider (position: top-right, auto-close: 5s)
- RouterProvider con todas las rutas
- QueryClientProvider para TanStack Query

---

## Fase 6: Polish & QA (Días 43-48)

### Objetivo

Calidad final: responsive, accesibilidad, performance y edge cases.

### 6.1 Responsive Design

| Breakpoint | Comportamiento |
|---|---|
| Desktop (≥1200px) | Sidebar expandido, layout completo |
| Tablet (768-1199px) | Sidebar colapsable |
| Mobile (≤767px) | Drawer navigation, tablas → cards |

**Verificar en todas las pantallas:**
- Sin scroll horizontal
- Formularios utilizables
- Botones accesibles
- Imágenes responsivas

### 6.2 Accessibility

| Requisito | Implementación |
|---|---|
| ARIA Labels | Todos los botones interactivos |
| Focus Management | Tab order lógico, focus visible |
| Keyboard Navigation | Todos los formularios y tablas navegables |
| Semantic HTML | headings, landmarks, lists |
| Contrast | WCAG AA en light y dark mode |

### 6.3 Performance

| Métrica | Target |
|---|---|
| Initial Load | < 2 segundos |
| Lighthouse Score | ≥ 95 |
| Initial Bundle | Minimizado |
| API Response (p95) | < 300ms |
| Image Size | < 200 KB |
| Pagination | Máximo 50 rows/página |

**Optimizaciones:**
- Lazy loading de rutas con `React.lazy`
- Lazy loading de imágenes
- Code splitting por feature
- Tree shaking
- Compresión de assets

### 6.4 Loading States

Todas las pantallas deben tener:
- Loading Skeleton durante carga
- Empty State cuando no hay datos (con ilustración, mensaje y acción)
- Error State con retry
- Success State

### 6.5 Confirmation Dialogs

Acciones destructivas que requieren confirmación:
- Delete Product
- Delete Category
- Delete Sale
- Replace Primary Image
- Discard Changes

### 6.6 Toast Notifications

| Tipo | Color | Posición |
|---|---|---|
| Success | Verde | Top Right |
| Error | Rojo | Top Right |
| Warning | Amarillo | Top Right |
| Info | Azul | Top Right |

Auto-close: 5 segundos

---

## Dependencias del Proyecto

### Backend

```json
{
  "dependencies": {
    "express": "^4.x",
    "helmet": "^7.x",
    "cors": "^2.x",
    "compression": "^1.x",
    "dotenv": "^16.x",
    "winston": "^3.x",
    "drizzle-orm": "^0.x",
    "@supabase/supabase-js": "^2.x",
    "zod": "^3.x",
    "bcrypt": "^5.x",
    "jsonwebtoken": "^9.x",
    "swagger-jsdoc": "^6.x",
    "swagger-ui-express": "^5.x",
    "uuid": "^9.x",
    "multer": "^1.x"
  },
  "devDependencies": {
    "@types/express": "^4.x",
    "@types/cors": "^2.x",
    "@types/compression": "^1.x",
    "@types/bcrypt": "^5.x",
    "@types/jsonwebtoken": "^9.x",
    "@types/swagger-jsdoc": "^6.x",
    "@types/swagger-ui-express": "^4.x",
    "@types/uuid": "^9.x",
    "@types/multer": "^1.x",
    "typescript": "^5.x",
    "tsx": "^4.x",
    "drizzle-kit": "^0.x"
  }
}
```

### Frontend

```json
{
  "dependencies": {
    "react": "^19.x",
    "react-dom": "^19.x",
    "react-router-dom": "^6.x",
    "@mantine/core": "^7.x",
    "@mantine/hooks": "^7.x",
    "@mantine/notifications": "^7.x",
    "@tanstack/react-query": "^5.x",
    "@tanstack/react-table": "^8.x",
    "zustand": "^4.x",
    "react-hook-form": "^7.x",
    "@hookform/resolvers": "^3.x",
    "zod": "^3.x",
    "recharts": "^2.x",
    "lucide-react": "^0.x",
    "date-fns": "^3.x",
    "react-i18next": "^14.x",
    "i18next": "^23.x",
    "html-to-image": "^1.x",
    "axios": "^1.x"
  },
  "devDependencies": {
    "@types/react": "^19.x",
    "@types/react-dom": "^19.x",
    "typescript": "^5.x",
    "vite": "^5.x",
    "@vitejs/plugin-react": "^4.x"
  }
}
```

---

## Orden de Ejecución

```
Fase 0 (Días 1-2)   → Infraestructura compilable
    ↓
Fase 1 (Días 3-5)   → Base de datos funcionando
    ↓
Fase 2 (Días 6-12)  → Backend completo con todos los endpoints
    ↓
Fase 3 (Días 13-22) → Frontend infrastructure
    ↓
Fase 4 (Días 23-38) → Módulos frontend (categories → products → sales → reports → settings → social → catalog)
    ↓
Fase 5 (Días 40-42) → Routing completo
    ↓
Fase 6 (Días 43-48) → Polish & QA
```

**Regla:** Cada fase debe ser verificable de forma independiente antes de avanzar.

---

## Reglas del Agente AI

### SIEMPRE

- Reutilizar componentes existentes
- Escribir código limpio
- Seguir principios SOLID
- Preferir composición
- Escribir módulos reutilizables
- Mantener separación de responsabilidades
- Generar código mantenible
- Implementar cada endpoint del API
- Generar documentación OpenAPI
- Generar DTOs y validación Zod
- Generar estados de carga, error y vacío
- Implementar responsive behavior
- Generar componentes accesibles
- Usar TypeScript Strong Typing

### NUNCA

- Cambiar la arquitectura
- Reemplazar librerías aprobadas
- Introducir nuevos frameworks
- Duplicar código
- Skip validación
- Skip TypeScript typing
- Skip error handling
- Skip loading states
- Skip responsive behavior
- Colocar lógica de negocio en controllers
- Acceder a BD fuera de repositories
- Subir archivos fuera de StorageService
- Usar `fetch()` directamente en componentes React
- Guardar datos del servidor en Zustand
- Cambiar nombres de endpoints
- Cambiar request bodies
- Cambiar response structures
- Cambiar HTTP methods
- Cambiar HTTP status codes
- Cambiar reglas de autenticación
