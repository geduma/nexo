# NEXO - Product Requirements Document

Version: 1.0
Last Update: July 2026

---

## 1. Product Overview

**NEXO** is a Commercial Management Platform for small and medium-sized businesses that sell through WhatsApp, social media, and digital catalogs.

It centralizes product management, sales recording, reporting, and social media asset generation into a single application.

### 1.1 What NEXO Is Not

- Not an ERP
- Not a CRM
- Not an eCommerce platform

### 1.2 Philosophy

Simple. Fast. Modern. Scalable. Cloud Native. Low operational cost.

### 1.3 Target Users

- Small businesses
- Dropshipping sellers
- Local stores
- Independent sellers
- Entrepreneurs
- Businesses selling primarily through WhatsApp

---

## 2. Scope

### 2.1 In Scope (MVP)

| Module | Description |
|---|---|
| Product Management | CRUD, images (max 5), categories, visibility, availability |
| Categories | CRUD, ordering, activation |
| Public Catalog | Public product listing, search, product detail, WhatsApp CTA |
| Sales Registration | Manual sale recording with product linking |
| Reports | Revenue, top products, daily sales, dashboard overview |
| Social Media Generator | Product image templates for Instagram/WhatsApp (Square, Story, Landscape) |
| Settings | Business name, logo, currency, WhatsApp number, language, theme |
| Authentication | Single admin login (JWT) |
| Internationalization | Spanish (default) and English |

### 2.2 Out of Scope (MVP)

- Customer CRM
- Accounting and billing
- Inventory management
- Purchase orders
- Multi-warehouse
- Employee/permission management
- Supplier management
- Multi-user roles
- AI features
- Automation engines
- Audit logs
- Soft delete

---

## 3. User Roles

| Role | Description |
|---|---|
| Admin | Single administrator. Full access to all features. No multi-user permissions. |
| Public Visitor | Unauthenticated. Can browse the public catalog and view products. |

---

## 4. Features

### 4.1 Authentication

- Single admin account (hardcoded for MVP)
- JWT token with 24-hour expiry
- Login via email and password
- Protected admin routes redirect to login if unauthenticated

### 4.2 Dashboard

- Summary stat cards (total products, total sales, revenue, average sale)
- Revenue chart
- Daily sales chart
- Top products chart
- Recent sales list
- Quick action links

### 4.3 Product Management

**Fields:**
- Name (required)
- Description (optional)
- Category (required, exactly one)
- Cost Price (optional, >= 0)
- Sale Price (required, > 0)
- Availability Status: `IN_STOCK` | `CHECK_SUPPLIER`
- Supplier Info (private, never exposed publicly)
- Visibility: visible/invisible (default: invisible)
- Featured: boolean (requires visible)
- Images: up to 5, one must be primary

**Rules:**
- Products are created invisible by default
- Invisible products never appear in catalog, search, related, or featured
- Featured products must be visible
- Visible products must have at least one image
- Changing prices does not affect historical sales
- Product names do not need to be unique

### 4.4 Categories

**Fields:**
- Name (required, unique case-insensitive)
- Slug (auto-generated, not editable)
- Description (optional)
- Display Order (lower = first)
- Is Active (boolean)

**Rules:**
- Inactive categories and their products do not appear in the public catalog
- Categories with products cannot be deleted (HTTP 409)

### 4.5 Product Images

- Max 5 images per product
- Allowed formats: JPEG, PNG, WEBP
- Max file size: 5 MB
- One image must be primary
- If primary is deleted, next image becomes primary automatically
- Display order is configurable
- Deleting a product deletes all its images

### 4.6 Sales Registration

**Fields:**
- Product (required)
- Customer Name (optional)
- Customer Contact (optional)
- Quantity (required, > 0)
- Sale Price (required)
- Payment Method (optional)
- Notes (optional)
- Sale Date (required)

**Rules:**
- Sales are registered manually
- Sales do not affect product availability or inventory
- Sales preserve historical prices
- Editing/deleting products does not modify historical sales
- Products with sales cannot be deleted

### 4.7 Reports

- **Summary:** Total revenue, total sales count, average sale value
- **Top Products:** Ranked by quantity sold
- **Daily Sales:** Revenue and count aggregated by date
- **Dashboard Data:** Combined overview for the dashboard

Reports use only registered sales. Historical sales remain valid even if products become invisible.

### 4.8 Public Catalog

- No authentication required
- Only visible products from active categories
- Product search (server-side, case-insensitive, matches name/description/category)
- Product detail with images, pricing, availability, WhatsApp CTA
- Related products (same category, visible, max 4)
- Featured products section
- Category filter
- Hidden products return 404 if accessed by URL
- Redesigned catalog home with centered business header, gradient background, sticky footer
- Search input and category filter displayed on the same line (Flex layout)
- Product cards with hover effects (translateY + shadow), image zoom, overlay badges
- Buy button on IN_STOCK products (shows "pending implementation" toast)
- WhatsApp button on product cards and detail modal (requires configured WhatsApp number)
- Product detail modal with image carousel, pagination dots, buy + WhatsApp CTAs
- Grid skeleton loading state during data fetch

### 4.9 Social Media Generator

- Product selector
- Three templates: Square (1080x1080), Story (1080x1920), Landscape (1200x628)
- Layout options: Single Image or Mosaic
- Single image layout with size variations: Small, Medium, Large
- Mosaic layout with magazine-style arrangements per template (1-5 product images)
- Mosaic grid adapts per template: story (vertical), square (balanced), landscape (horizontal)
- Live preview canvas with auto-extracted dominant color from product image
- Gradient background generation from base color
- PNG download via html-to-image
- Marketing text copy to clipboard

### 4.10 Settings

Single-row configuration:
- Business Name
- Logo URL
- Currency and Symbol
- Default Language
- WhatsApp Number
- Theme

Changes propagate to admin panel, public catalog, browser title, and generated links.

### 4.11 WhatsApp Integration

- Every product has a WhatsApp contact action
- Generated message includes: product name, price, product URL
- CHECK_SUPPLIER products append availability check text
- WhatsApp is never blocked by availability status

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Product listings are always paginated (default 20, max 50)
- Images use lazy loading
- Database queries avoid N+1 patterns
- Responses use compression

### 5.2 Security

- Helmet security headers
- CORS restricted to configured origin
- JWT authentication on protected routes
- Input validation via Zod on all endpoints
- Error responses never expose internal details
- Supplier information is never public

### 5.3 Responsive Design

- Mobile-first approach
- Sidebar collapses on mobile
- All layouts adapt to screen size

### 5.4 Internationalization

- Spanish (default) and English
- All UI strings use translation keys
- Language preference persisted in localStorage

### 5.5 Theme

- Light, Dark, and System modes
- Persisted in localStorage
- Custom Mantine theme with blue primary color
- Global default border radius: `lg` (all components inherit this radius)
- Custom gray and dark color palettes

---

## 6. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 6, Mantine 7, Zustand, TanStack Query |
| Backend | Node.js, Express 5, TypeScript |
| Database | PostgreSQL via Supabase (REST API) |
| Storage | Supabase Storage |
| Validation | Zod (shared between frontend and backend) |
| Monorepo | npm workspaces |

---

## 7. API Design

- REST API under `/api/v1`
- JSON responses with `{ success, data, message?, errors?, pagination? }` format
- Swagger documentation at `/api/docs`
- Public endpoints: catalog, search, product detail, settings, login
- Protected endpoints: CRUD for products, categories, sales, reports, settings update

---

## 8. Database Schema

| Table | Key Columns |
|---|---|
| `categories` | id, name (unique), slug (unique), description, display_order, is_active |
| `products` | id, category_id (FK), name, description, price_cost, price_sale, availability_status, supplier_info, is_featured, is_visible |
| `product_images` | id, product_id (FK CASCADE), image_url, display_order, is_primary |
| `manual_sales` | id, product_id (FK RESTRICT), customer_name, customer_contact, quantity, sale_price, payment_method, notes, sale_date |
| `settings` | id, business_name, logo_url, currency, currency_symbol, default_language, whatsapp_number, theme |

---

## 9. Business Rules Summary

| ID | Rule |
|---|---|
| BR-001 | NEXO manages one business only. No multi-tenant. |
| BR-002 | Products are the primary entity. |
| BR-004 | Sales are historical records, never modify product info. |
| BR-005 | Deleting is permanent. No soft delete. |
| BR-100 | Every product belongs to exactly one category. |
| BR-101 | Category names are unique (case-insensitive). |
| BR-105 | Categories cannot be deleted while products exist. |
| BR-202 | Sale Price must be > 0. |
| BR-204 | Products are invisible by default. |
| BR-206 | Featured products must be visible. |
| BR-208 | Max 5 images per product. |
| BR-209 | Exactly one primary image. |
| BR-300 | Availability: IN_STOCK or CHECK_SUPPLIER only. |
| BR-304 | Availability never blocks WhatsApp contact. |
| BR-400 | Image formats: JPEG, PNG, WEBP. |
| BR-401 | Max image size: 5 MB. |
| BR-500 | Sales are registered manually. |
| BR-501 | Sales do not affect product availability. |
| BR-505 | Products with sales cannot be deleted. |
| BR-800 | Public catalog requires no authentication. |
| BR-801 | Only visible products appear publicly. |
| BR-900 | Search is server-side, case-insensitive. |
| BR-1000 | Every product has a WhatsApp action. |
| BR-1400 | System never leaves inconsistent data. |

---

## 10. Deployment

| Component | Target |
|---|---|
| Frontend | Azure Static Web Apps |
| Backend | Azure App Service or Container |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| CI/CD | GitHub Actions |

---

## 11. Version History

| Version | Date | Changes |
|---|---|---|
| 0.1.0 | July 2026 | MVP initial implementation |
| 0.2.0 | July 2026 | UI/UX improvements: catalog redesign, social generator enhancements, design system |
