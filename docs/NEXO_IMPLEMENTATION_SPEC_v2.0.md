# NEXO

# AI Implementation Specification

Version: 2.0

Status: Approved for Development

Last Update: July 2026

---

# Document Purpose

This document defines the complete technical specification for **NEXO**.

Its primary consumer is an AI Software Engineering Agent (Claude Code, Codex, Cursor, Windsurf, Roo Code, Gemini CLI or equivalent).

The objective is to minimize architectural decisions during implementation.

Every section of this document MUST be considered authoritative.

Whenever there is ambiguity, this specification prevails.

---

# Product Definition

## Product Name

NEXO

---

## Product Category

Commercial Management Platform

Secondary categories

- Product Catalog
- Sales Management
- Social Commerce
- Business Operations

---

## Product Vision

NEXO is a Commercial Management Platform designed for small and medium-sized businesses that sell through WhatsApp, social media and digital catalogs.

The platform centralizes every commercial operation into a single application.

Instead of using multiple disconnected tools, the merchant manages products, publishes catalog items, records sales, generates marketing assets and analyzes business performance from one place.

NEXO is intentionally lightweight.

It is NOT an ERP.

It is NOT a CRM.

It is NOT an eCommerce platform.

It is a Commercial Management Platform.

---

## Product Philosophy

Simple.

Fast.

Modern.

Scalable.

Cloud Native.

Low operational cost.

AI-friendly architecture.

---

## Target Users

Small businesses

Dropshipping sellers

Local stores

Independent sellers

Entrepreneurs

Businesses selling primarily through WhatsApp

---

## Main Objectives

The platform SHALL provide:

- Product Management

- Categories

- Product Images

- Public Catalog

- Sales Registration

- Basic Reports

- Social Media Post Generator

- Configuration

without unnecessary ERP complexity.

---

# Non Objectives

The platform SHALL NOT include during MVP:

Customer CRM

Accounting

Billing

Inventory management

Purchase orders

Multi warehouse

Employee management

Supplier management

Multi-user permissions

Artificial Intelligence

Automation Engines

Marketing Campaigns

Marketplace integrations

These features may be implemented in future versions.

---

# Business Model

Single Business Owner

Single Administrator

No employee accounts.

No customer accounts.

Products are published publicly.

Sales continue being completed through WhatsApp.

The system only records the final sale.

---

# Core Business Workflow

Product

↓

Published in Catalog

↓

Customer opens product

↓

Customer clicks WhatsApp

↓

Merchant closes sale manually

↓

Merchant registers sale

↓

Reports update automatically

---

# Product Principles

NEXO follows these principles.

1.

Keep everything simple.

2.

Every screen must solve one business problem.

3.

Every operation should require as few clicks as possible.

4.

No duplicated information.

5.

No unnecessary modules.

6.

Everything must be responsive.

7.

Performance first.

8.

Accessibility first.

9.

Cloud native.

10.

Free-tier friendly.

---

# Technical Principles

The application SHALL be developed using modern web standards.

Frontend and Backend MUST be fully separated.

The system SHALL expose a REST API.

Every API endpoint SHALL return JSON.

Every database operation SHALL use Drizzle ORM.

Every validation SHALL use Zod.

All identifiers SHALL use UUID.

Every timestamp SHALL be stored in UTC.

The application SHALL support internationalization.

The application SHALL support Dark Mode.

The application SHALL support future scalability without architectural redesign.

---

# MVP Modules

The MVP includes only the following modules.

## Public Catalog

Public product listing

Product details

Category filter

WhatsApp CTA

---

## Product Administration

CRUD Products

Upload Images

Categories

Visibility

Availability

Featured Products

---

## Sales

Manual Sale Registration

Sales List

Basic Filters

---

## Reports

Revenue

Sales Count

Top Products

Daily Sales

---

## Social Media Generator

Generate promotional image

Download PNG

Copy marketing text

Template selection

---

## Settings

General Configuration

Currency

Language

WhatsApp Number

Theme

---

# 02. Approved Technology Stack

This section defines the ONLY technologies allowed in the project.

The AI Agent MUST NOT replace any technology unless explicitly instructed.

---

# General Architecture

NEXO follows a modern cloud-native architecture.

Frontend and Backend are completely independent applications.

Communication occurs exclusively through HTTPS REST APIs.

The system is designed around free-tier cloud services.

Architecture:

                        GitHub

                           │

                    GitHub Actions

                           │

                Azure Static Web Apps

                    (React Frontend)

                           │

                     HTTPS REST API

                           │

                  Node.js + Express API

                           │

                      Drizzle ORM

                           │

                 PostgreSQL (Supabase)

                      │           │

                      │           │

             Supabase Storage   JWT Auth

                      │

                 Product Images

---

# Approved Technology Stack

## Frontend

Framework

React 19

Language

TypeScript

Build Tool

Vite

Routing

React Router

UI Library

Mantine

State Management

Zustand

Server State

TanStack Query

Tables

TanStack Table

Forms

React Hook Form

Validation

Zod

Charts

Recharts

Icons

Lucide React

Internationalization

react-i18next

Dates

date-fns

---

## Backend

Runtime

Node.js LTS

Language

TypeScript

Framework

Express

ORM

Drizzle ORM

Validation

Zod

Authentication

JWT

Password Hashing

bcrypt

Logging

Winston

API Documentation

Swagger / OpenAPI

---

## Database

Engine

PostgreSQL

Provider

Supabase

Primary Keys

UUID

Timezone

UTC

Encoding

UTF-8

---

## Storage

Provider

Supabase Storage

Bucket

product-images

Visibility

Public Read

Private Write

---

## Hosting

Frontend

Azure Static Web Apps

Backend

Node.js hosting (initial deployment)

Database

Supabase PostgreSQL

Storage

Supabase Storage

Repository

GitHub

---

# Why This Stack

The selected technologies satisfy the following requirements.

✔ Free Tier Available

✔ Large Community

✔ Excellent Documentation

✔ Long-term Support

✔ Modern

✔ AI Friendly

✔ Strong Type Safety

✔ Easily Scalable

---

# Technologies NOT Allowed

The AI Agent SHALL NOT introduce the following.

Angular

Vue

Next.js

Nuxt

NestJS

Laravel

Spring

Material UI

Bootstrap

Redux

MobX

Prisma

Sequelize

Moment.js

jQuery

Any CSS Framework other than Mantine.

---

# TypeScript Configuration

The project MUST use TypeScript Strict Mode.

Required compiler options.

strict

noImplicitAny

strictNullChecks

noUnusedLocals

noUnusedParameters

exactOptionalPropertyTypes

noFallthroughCasesInSwitch

noUncheckedIndexedAccess

The AI Agent MUST NEVER use the "any" type.

---

# Folder Structure

The project SHALL follow exactly this structure.

frontend/

    src/

        assets/

        components/

            common/

            layout/

            ui/

        features/

            catalog/

            products/

            sales/

            reports/

            settings/

            social/

        hooks/

        i18n/

        layouts/

        pages/

        routes/

        services/

            api/

        stores/

        types/

        utils/

        App.tsx

backend/

    src/

        config/

        controllers/

        database/

            migrations/

            schema/

            seed/

        middleware/

        repositories/

        routes/

        services/

        validators/

        types/

        utils/

        app.ts

shared/

    constants/

    types/

docs/

---

# Layer Responsibilities

Controller

Receive HTTP requests.

Validate input.

Call Services.

Return HTTP responses.

No business logic.

---

Service

Contains ALL business logic.

Never accesses HTTP objects.

Never accesses database directly.

Uses repositories.

---

Repository

Contains ONLY database operations.

No business logic.

Uses Drizzle ORM.

---

Database

Contains schema definitions.

Migration files.

Seed scripts.

Nothing else.

---

# API Design Rules

The API SHALL follow REST conventions.

Examples.

GET

POST

PUT

DELETE

PATCH (only if necessary)

All responses MUST be JSON.

---

Response Format

Success

{
  "success": true,
  "data": {}
}

List

{
  "success": true,
  "data": [],
  "pagination": {}
}

Error

{
  "success": false,
  "message": "...",
  "errors": []
}

---

# Naming Convention

Variables

camelCase

Functions

camelCase

React Components

PascalCase

Interfaces

PascalCase

Enums

PascalCase

Files

kebab-case

Folders

lowercase

Database tables

snake_case

Columns

snake_case

API Routes

kebab-case

---

# Import Rules

Always use absolute imports.

Never use long relative imports like

../../../../

Example

Good

@/components

Bad

../../components

---

# Environment Variables

Frontend

VITE_API_URL

VITE_APP_NAME

Backend

PORT

NODE_ENV

JWT_SECRET

SUPABASE_URL

SUPABASE_SERVICE_KEY

SUPABASE_STORAGE_BUCKET

ADMIN_WHATSAPP

DEFAULT_LANGUAGE

DEFAULT_CURRENCY

---

# Configuration Rules

No secrets inside source code.

Every environment MUST have its own .env.

The AI Agent MUST NEVER hardcode URLs.

---

# Logging

Every unexpected exception SHALL be logged.

Every database error SHALL be logged.

Authentication failures SHALL be logged.

Application startup SHALL be logged.

---

# Error Handling

Every endpoint MUST return consistent JSON.

Never expose stack traces.

Never expose SQL errors.

Never expose internal exceptions.

---

# Internationalization

Supported Languages

Spanish

English

Default

Spanish

Every visible string MUST use translation keys.

Hardcoded text is prohibited.

---

# Dark Mode

The UI MUST support.

Light Theme

Dark Theme

The theme selection SHALL persist between sessions.

---

# Responsive Design

Supported widths

Desktop

Tablet

Mobile

No fixed layouts.

No horizontal scrolling.

---

# Accessibility

Every button must have an accessible label.

Forms must support keyboard navigation.

Color contrast must satisfy WCAG AA.

---

# Performance Requirements

Initial Load

< 2 seconds

API Response

< 300 ms (p95)

Image Size

< 200 KB

Pagination

Maximum 50 rows per page

---

# AI Agent Mandatory Rules

The AI Agent SHALL NEVER

- Change architecture
- Replace approved libraries
- Introduce new frameworks
- Duplicate code
- Skip validation
- Skip TypeScript typing
- Skip error handling
- Skip loading states
- Skip responsive behavior

The AI Agent SHALL ALWAYS

- Reuse existing components.
- Write clean code.
- Follow SOLID principles.
- Prefer composition.
- Write reusable modules.
- Maintain separation of concerns.
- Generate maintainable code.

---

# 03. Database Specification

This section defines the complete database model.

This document is the single source of truth.

The AI Agent MUST implement the database exactly as specified.

Database Engine

PostgreSQL

Provider

Supabase PostgreSQL

ORM

Drizzle ORM

Primary Keys

UUID

Timezone

UTC

Encoding

UTF8

---

# General Rules

Every table SHALL use UUID as Primary Key.

Every table SHALL include:

created_at

updated_at

All timestamps are stored in UTC.

Every Foreign Key SHALL use ON DELETE CASCADE only when explicitly specified.

No table SHALL duplicate information from another table.

---

# ENUMS

## ProductAvailabilityStatus

Represents how a product can be sold.

```ts
enum ProductAvailabilityStatus {

    IN_STOCK,

    CHECK_SUPPLIER

}
```

Meaning

IN_STOCK

The product is immediately available.

The catalog SHALL display

"Disponible"

Button

Comprar / Consultar por WhatsApp

---

CHECK_SUPPLIER

The merchant must verify availability with the supplier.

The catalog SHALL display

"Consultar disponibilidad"

The WhatsApp message SHALL indicate that availability must be confirmed.

---

Future versions may include

OUT_OF_STOCK

COMING_SOON

DISCONTINUED

without database redesign.

---

# TABLE categories

Represents product categories.

Columns

id

UUID

PK

Default

gen_random_uuid()

---

name

TEXT

Required

Unique

Maximum

100 characters

---

slug

TEXT

Required

Unique

Generated automatically.

Example

electronics

gaming

home

office

---

description

TEXT

Nullable

---

display_order

INTEGER

Default

0

---

is_active

BOOLEAN

Default

TRUE

---

created_at

TIMESTAMP

Default NOW()

---

updated_at

TIMESTAMP

Default NOW()

---

Indexes

name

slug

display_order

---

Business Rules

Categories cannot have duplicate names.

Inactive categories SHALL NOT appear in the public catalog.

Deleting a category SHALL NOT delete products.

Products must be reassigned before deleting categories.

---

# TABLE products

Represents every commercial product.

Columns

id

UUID

PK

---

category_id

UUID

FK

categories.id

Required

---

name

TEXT

Required

Maximum 200 characters

---

description

TEXT

Nullable

Supports Markdown.

---

price_cost

NUMERIC(12,2)

Required

---

price_sale

NUMERIC(12,2)

Required

Must be greater than zero.

---

availability_status

ENUM

ProductAvailabilityStatus

Default

IN_STOCK

---

supplier_info

TEXT

Nullable

Free text.

Example

Supplier

Warehouse

Contact

Internal notes

---

is_featured

BOOLEAN

Default FALSE

---

is_visible

BOOLEAN

Default TRUE

Invisible products SHALL NOT appear in the public catalog.

---

created_at

TIMESTAMP

Default NOW()

---

updated_at

TIMESTAMP

Default NOW()

---

Indexes

category_id

availability_status

is_featured

is_visible

name

---

Business Rules

A product MUST belong to one category.

Products can exist without images only while being created.

Before publishing, at least one image is required.

Deleting a product SHALL delete every image.

Deleting a product SHALL delete manual sales only if explicitly requested by administrator.

Default behavior

RESTRICT

---

# TABLE product_images

Stores product gallery.

Maximum

5 images.

Columns

id

UUID

PK

---

product_id

UUID

FK

products.id

ON DELETE CASCADE

---

image_url

TEXT

Required

---

display_order

INTEGER

Default 0

---

is_primary

BOOLEAN

Default FALSE

---

created_at

TIMESTAMP

NOW()

---

Indexes

product_id

display_order

---

Business Rules

Exactly ONE image SHALL be primary.

Maximum five images.

Minimum one image before product becomes visible.

Deleting a product SHALL delete every image.

---

# TABLE manual_sales

Stores manually registered sales.

Columns

id

UUID

PK

---

product_id

UUID

FK

products.id

---

customer_name

TEXT

Required

Maximum

150

---

customer_contact

TEXT

Nullable

Phone

Email

Free text

---

quantity

INTEGER

Required

Minimum

1

---

sale_price

NUMERIC(12,2)

Required

Represents total sale amount.

---

payment_method

TEXT

Nullable

Examples

Cash

Transfer

Nequi

Daviplata

Credit Card

---

notes

TEXT

Nullable

---

sale_date

TIMESTAMP

Default NOW()

---

created_at

TIMESTAMP

NOW()

---

updated_at

TIMESTAMP

NOW()

---

Indexes

sale_date

product_id

payment_method

---

Business Rules

Sales SHALL NOT modify inventory.

Inventory management is outside MVP scope.

Sales SHALL remain immutable.

Corrections are made by editing the record.

---

# TABLE settings

Stores application configuration.

Single Row Table.

Columns

id

UUID

PK

---

business_name

TEXT

---

logo_url

TEXT

Nullable

---

currency

TEXT

Default

COP

---

currency_symbol

TEXT

Default

$

---

default_language

TEXT

Default

es

---

whatsapp_number

TEXT

Required

International format.

Example

573001234567

---

theme

TEXT

Values

light

dark

system

Default

system

---

created_at

TIMESTAMP

NOW()

---

updated_at

TIMESTAMP

NOW()

---

Business Rules

Exactly ONE row SHALL exist.

Configuration is editable.

---

# Relationships

categories

↓

products

↓

product_images

products

↓

manual_sales

settings

↓

application

---

# Database Constraints

Products

price_sale > 0

price_cost >= 0

quantity >= 1

Maximum

5 images

Exactly

1 primary image

Unique

Category name

Category slug

---

# Soft Delete

The MVP SHALL NOT implement soft delete.

Records are physically deleted.

Exception

Future versions may introduce deleted_at.

---

# Seed Data

The initial migration SHALL create

One default category

General

One settings row

Business Name

"NEXO"

Currency

COP

Language

Spanish

Theme

System

---

# Migration Order

001

Enums

002

Categories

003

Products

004

Product Images

005

Manual Sales

006

Settings

007

Indexes

008

Seed

---

# AI Agent Implementation Rules

The AI Agent SHALL

Create migrations.

Generate Drizzle schemas.

Generate relations.

Generate indexes.

Generate constraints.

Generate seed files.

Generate repository interfaces.

Generate repository implementations.

No database object SHALL be omitted.

# 04. Backend Specification

This section defines the complete backend architecture.

The AI Agent SHALL implement the backend exactly as described.

No architectural decisions shall be made outside this specification.

---

# Backend Overview

Technology

Node.js LTS

Framework

Express

Language

TypeScript

ORM

Drizzle ORM

Validation

Zod

Authentication

JWT

Database

PostgreSQL (Supabase)

Storage

Supabase Storage

Documentation

Swagger / OpenAPI

---

# Architecture

The backend SHALL implement a layered architecture.

HTTP Request

↓

Route

↓

Controller

↓

Service

↓

Repository

↓

Database

No layer may skip another.

Controllers SHALL NEVER access the database directly.

Repositories SHALL NEVER contain business rules.

---

# Folder Structure

backend/

    src/

        config/

        controllers/

            auth/

            products/

            categories/

            images/

            sales/

            reports/

            settings/

        services/

            auth/

            products/

            categories/

            images/

            sales/

            reports/

            settings/

        repositories/

            products/

            categories/

            images/

            sales/

            settings/

        routes/

        middleware/

        validators/

        database/

            schema/

            migrations/

            seed/

        storage/

        utils/

        types/

        app.ts

        server.ts

---

# Application Bootstrap

server.ts SHALL only:

Load environment variables

Initialize Express

Register middleware

Register routes

Initialize database connection

Start HTTP server

No business logic.

---

# Express Configuration

Required middleware

helmet

cors

compression

express.json()

express.urlencoded()

request logger

global error handler

404 handler

---

# CORS

Allowed Origins

Development

http://localhost:5173

Production

Configured through ENV.

Credentials

Disabled.

Methods

GET

POST

PUT

DELETE

OPTIONS

---

# Compression

Compression SHALL be enabled.

Only JSON responses shall be compressed.

---

# Security Headers

Helmet SHALL be enabled.

Default configuration is acceptable.

---

# Logging

Every request SHALL be logged.

Log fields

Timestamp

Method

URL

Status Code

Execution Time

IP

Errors SHALL include

Stack

Request ID

Message

---

# Validation

Every endpoint SHALL validate incoming data.

Validation library

Zod

Validation SHALL occur before reaching Services.

Invalid requests return

HTTP 400

---

# Error Handling

Global Error Middleware SHALL exist.

Expected Errors

400

Unauthorized

401

Forbidden

403

Not Found

404

Conflict

409

Validation

422

Internal Error

500

Every error SHALL return

{
    "success": false,
    "message": "...",
    "errors": []
}

---

# Repository Pattern

Repositories SHALL only communicate with PostgreSQL.

Repositories SHALL NOT

Validate data

Transform DTOs

Generate business rules

Repositories SHALL only

Insert

Update

Delete

Select

---

# Service Layer

Services contain ALL business rules.

Examples

Product visibility

Image limits

Primary image validation

Category existence

Price validation

Availability rules

Services SHALL NOT access Express objects.

---

# Controllers

Controllers SHALL

Receive Request

Validate Input

Call Services

Return Response

Nothing else.

Controllers SHALL NEVER

Query PostgreSQL

Upload files

Generate business logic

---

# DTOs

Every endpoint SHALL define DTOs.

Example

CreateProductDto

UpdateProductDto

CreateCategoryDto

UpdateCategoryDto

CreateSaleDto

UpdateSettingsDto

DTOs SHALL be validated with Zod.

---

# Dependency Injection

Manual Dependency Injection only.

No IoC container.

No decorators.

Repositories are injected into Services.

Services are injected into Controllers.

---

# Storage Service

A dedicated StorageService SHALL exist.

Responsibilities

Upload Image

Delete Image

Generate Public URL

Validate MIME Type

Validate Size

No Controller SHALL communicate directly with Supabase Storage.

---

# Image Upload Rules

Allowed Types

image/jpeg

image/png

image/webp

Maximum Size

5 MB

Maximum Images

5

Minimum Images Before Publish

1

Storage Path

product-images/{productId}/{timestamp}-{filename}

---

# Pagination

Every list endpoint SHALL support pagination.

Query Parameters

page

limit

Defaults

page=1

limit=20

Maximum

50

---

# Sorting

Every list endpoint SHALL support sorting.

Parameters

sortBy

sortOrder

Allowed

ASC

DESC

Default

created_at DESC

---

# Filtering

Filtering SHALL be server-side.

Products

Category

Availability

Visible

Featured

Name

Sales

Date

Payment Method

Product

Reports

Date Range

---

# Search

Products SHALL support search.

Search Fields

Product Name

Description

Search SHALL be case insensitive.

---

# API Versioning

Base Path

/api/v1

Examples

/api/v1/products

/api/v1/categories

/api/v1/sales

Future versions

/api/v2/

without breaking compatibility.

---

# Authentication

The Admin Panel SHALL require authentication.

Public Catalog SHALL NOT.

Authentication Method

JWT

Authorization Header

Bearer TOKEN

Every protected endpoint SHALL validate JWT.

---

# Authorization

MVP

Single Administrator.

No Roles.

No Permissions.

The backend SHALL assume a single authenticated administrator.

---

# Business Rules

Products

Must belong to a category.

May have up to five images.

One image must be primary.

Invisible products never appear publicly.

Categories

Cannot be duplicated.

Cannot be deleted if products exist.

Sales

Never modify product availability.

Never modify product prices.

Settings

Exactly one configuration record exists.

---

# Background Jobs

Not implemented.

The backend SHALL execute requests synchronously.

---

# Scheduled Jobs

Not implemented.

---

# Caching

Not implemented during MVP.

The architecture SHALL allow future Redis integration.

---

# API Documentation

Swagger SHALL be available.

Endpoint

/api/docs

Every endpoint SHALL include

Description

Parameters

Responses

Examples

Authentication

---

# Health Endpoint

Endpoint

GET /api/v1/health

Response

{
    "success": true,
    "status": "healthy",
    "database": "connected",
    "storage": "connected",
    "timestamp": "..."
}

Used by monitoring services.

---

# AI Agent Mandatory Rules

The AI Agent SHALL

Generate controllers.

Generate services.

Generate repositories.

Generate validators.

Generate DTOs.

Generate routes.

Generate middleware.

Generate Swagger annotations.

Generate unit-testable code.

The AI Agent SHALL NEVER

Place business logic inside controllers.

Access the database outside repositories.

Upload images outside StorageService.

Skip validation.

Skip logging.

Skip error handling.

Skip pagination.

Skip filtering.

Skip authentication.

# 05. REST API Specification

This section defines the complete REST API contract.

The API contract is immutable.

The Frontend MUST consume these endpoints.

The Backend MUST implement these endpoints.

No endpoint SHALL deviate from this specification.

---

# Base URL

Development

http://localhost:3001/api/v1

Production

https://{domain}/api/v1

---

# Content Type

Request

application/json

Response

application/json

---

# Standard Success Response

{
    "success": true,
    "data": {}
}

---

# Standard List Response

{
    "success": true,
    "data": [],
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 145,
        "pages": 8
    }
}

---

# Standard Error Response

{
    "success": false,
    "message": "Validation Error",
    "errors": [
        {
            "field": "name",
            "message": "Name is required."
        }
    ]
}

---

# Authentication

Protected endpoints require

Authorization

Bearer JWT_TOKEN

Public endpoints do not require authentication.

---

########################################################

CATEGORY ENDPOINTS

########################################################

GET

/categories

Description

Returns every active category.

Authentication

Public

Query Parameters

page

limit

search

sortBy

sortOrder

Response

200 OK

---

GET

/categories/:id

Returns one category.

404 if not found.

---

POST

/categories

Authentication

Required

Body

{
    "name": "",
    "description": "",
    "displayOrder": 0
}

Response

201 Created

---

PUT

/categories/:id

Authentication

Required

Updates category.

---

DELETE

/categories/:id

Authentication

Required

Business Rule

Categories containing products cannot be deleted.

Return

409 Conflict

---

########################################################

PRODUCT ENDPOINTS

########################################################

GET

/products

Authentication

Public

Query Parameters

page

limit

category

featured

availability

search

sortBy

sortOrder

Returns

Visible products only.

---

GET

/products/:id

Returns one product.

Includes

Category

Images

---

POST

/products

Authentication

Required

Body

{
    "categoryId":"",
    "name":"",
    "description":"",
    "priceCost":0,
    "priceSale":0,
    "availabilityStatus":"IN_STOCK",
    "supplierInfo":"",
    "isFeatured":false,
    "isVisible":true
}

Response

201

---

PUT

/products/:id

Authentication

Required

Updates any editable field.

---

DELETE

/products/:id

Authentication

Required

Deletes product.

Images SHALL be removed.

---

########################################################

IMAGE ENDPOINTS

########################################################

GET

/products/:productId/images

Returns image collection.

---

POST

/products/:productId/images

Authentication

Required

Content-Type

multipart/form-data

Fields

file

displayOrder

isPrimary

Business Rules

Maximum

5 images

Allowed Types

jpg

jpeg

png

webp

Maximum Size

5MB

---

PUT

/products/:productId/images/:imageId

Updates

displayOrder

primary image

---

DELETE

/products/:productId/images/:imageId

Deletes image.

If primary image is deleted

another image MUST automatically become primary.

---

########################################################

SALES ENDPOINTS

########################################################

GET

/sales

Authentication

Required

Filters

Date

Payment Method

Product

Pagination

Supported

---

GET

/sales/:id

Returns sale details.

---

POST

/sales

Authentication

Required

Body

{
    "productId":"",
    "customerName":"",
    "customerContact":"",
    "quantity":1,
    "salePrice":0,
    "paymentMethod":"",
    "notes":""
}

Response

201

Business Rules

Sale does not affect product availability.

Sale does not update prices.

---

PUT

/sales/:id

Authentication

Required

Updates manual sale.

---

DELETE

/sales/:id

Authentication

Required

Deletes manual sale.

---

########################################################

REPORTS

########################################################

GET

/reports/summary

Authentication

Required

Returns

Total Revenue

Total Sales

Average Sale

Top Products

Sales By Day

---

GET

/reports/top-products

Authentication

Required

Returns

Top selling products.

---

GET

/reports/daily-sales

Authentication

Required

Returns

Daily sales.

---

########################################################

SETTINGS

########################################################

GET

/settings

Authentication

Required

Returns application settings.

---

PUT

/settings

Authentication

Required

Body

{
    "businessName":"",
    "currency":"COP",
    "currencySymbol":"$",
    "language":"es",
    "theme":"system",
    "whatsappNumber":"573001111111"
}

---

########################################################

HEALTH

########################################################

GET

/health

Public

Returns

{
    "success": true,
    "status":"healthy"
}

---

########################################################

SEARCH

########################################################

GET

/search/products

Authentication

Required

Parameters

q

Returns

Products matching

Name

Description

Category

---

########################################################

VALIDATION RULES

########################################################

Category

Name

Required

Maximum

100 chars

Unique

---

Product

Name

Required

Maximum

200 chars

---

Description

Optional

Markdown supported.

---

Price Cost

>= 0

---

Price Sale

> 0

---

Availability

Allowed

IN_STOCK

CHECK_SUPPLIER

---

Visibility

Boolean

---

Featured

Boolean

---

Sales

Quantity

>=1

---

Customer Name

Required

150 chars

---

########################################################

HTTP STATUS CODES

########################################################

200

Success

201

Created

204

Deleted

400

Bad Request

401

Unauthorized

403

Forbidden

404

Not Found

409

Conflict

422

Validation

500

Internal Server Error

---

########################################################

AI IMPLEMENTATION RULES

########################################################

The AI Agent SHALL

Implement every endpoint.

Generate OpenAPI documentation.

Generate DTOs.

Generate Zod validation.

Generate Repository methods.

Generate Service methods.

Generate Controller methods.

Generate Route definitions.

Generate Integration Tests.

The AI Agent SHALL NEVER

Change endpoint names.

Change request bodies.

Change response structures.

Change HTTP methods.

Change HTTP status codes.

Change authentication rules.

This API Specification is the single source of truth for every communication between Frontend and Backend.

# 06. Frontend Specification

This section defines the complete frontend architecture.

The AI Agent SHALL implement the frontend exactly as specified.

The frontend SHALL consume ONLY the REST API defined in Section 05.

Business logic SHALL NEVER exist in UI components.

---

# Frontend Overview

Framework

React 19

Language

TypeScript

Bundler

Vite

UI Library

Mantine

Routing

React Router

Server State

TanStack Query

Global State

Zustand

Forms

React Hook Form

Validation

Zod

Icons

Lucide React

Charts

Recharts

Internationalization

react-i18next

Dates

date-fns

---

# General Architecture

The frontend SHALL follow Feature-Based Architecture.

Every feature MUST encapsulate:

Components

Hooks

Pages

Services

Types

Validation

The application SHALL avoid a flat folder structure.

---

# Folder Structure

frontend/

    src/

        assets/

        components/

            common/

            layout/

            ui/

        features/

            auth/

            categories/

            dashboard/

            products/

            reports/

            sales/

            settings/

            social/

        hooks/

        layouts/

        pages/

        routes/

        services/

            api/

        stores/

        types/

        utils/

        i18n/

        App.tsx

---

# Component Rules

Components SHALL be

Small

Reusable

Stateless whenever possible

No component SHALL exceed approximately 300 lines.

Large screens MUST be decomposed into smaller components.

---

# Presentational Components

Responsibilities

Render UI

Receive Props

Emit Events

They SHALL NOT

Call APIs

Contain business logic

Store global state

---

# Container Components

Responsibilities

Consume API

Use TanStack Query

Call Services

Manage page state

Coordinate child components

---

# Global State

Zustand SHALL store ONLY

Authenticated User

Application Settings

Theme

Language

Sidebar State

No server data SHALL be stored inside Zustand.

Server data belongs to TanStack Query.

---

# Server State

Every API request SHALL use TanStack Query.

The AI Agent SHALL NEVER use fetch() directly inside React Components.

Every request MUST support

Loading

Success

Error

Retry

Cache

Invalidation

---

# Forms

Every form SHALL use

React Hook Form

Validation SHALL use

Zod

Every form SHALL provide

Inline validation

Disabled submit while loading

Error messages

Success notification

---

# Routing

React Router SHALL be used.

Routes

/

Public Catalog

/login

Admin Login

/dashboard

Dashboard

/products

Products

/categories

Categories

/sales

Sales

/reports

Reports

/settings

Settings

/social

Social Generator

/404

Not Found

---

# Layouts

Two layouts SHALL exist.

PublicLayout

Catalog

Product Details

AdminLayout

Sidebar

Header

Content

Footer

---

# Navigation

Sidebar SHALL include

Dashboard

Products

Categories

Sales

Reports

Social Generator

Settings

Logout

---

# Theme

Mantine Theme SHALL be customized.

Primary Color

Configurable

Dark Mode

Supported

Light Mode

Supported

Theme persistence

Required

---

# Design Principles

Clean

Minimal

Professional

Fast

Responsive

Accessible

---

# Loading States

Every page SHALL include

Loading Skeleton

Empty State

Error State

Success State

No blank screens are allowed.

---

# Empty States

Examples

No Products

No Categories

No Sales

Each empty state SHALL explain

Why it is empty

How to solve it

---

# Notifications

Mantine Notifications SHALL be used.

Success

Green

Error

Red

Warning

Yellow

Information

Blue

---

# Dialogs

Confirmation dialogs SHALL exist for

Delete Product

Delete Category

Delete Sale

Replace Primary Image

Cancel Changes

---

# Data Tables

Every table SHALL use

TanStack Table

Supported Features

Sorting

Pagination

Filtering

Search

Column Visibility

Responsive Layout

---

# Search

Search SHALL be debounced.

Delay

300 milliseconds

Search SHALL occur server-side.

---

# Pagination

Default

20 rows

Maximum

50

Pagination SHALL be server-side.

---

# Images

Lazy Loading

Enabled

Placeholder

Required

Broken Image

Fallback image

---

# Accessibility

Keyboard Navigation

Required

Focus Management

Required

ARIA Labels

Required

Contrast

WCAG AA

---

# Responsiveness

Desktop

>=1200 px

Tablet

768-1199 px

Mobile

<=767 px

The application SHALL work without horizontal scrolling.

---

# Error Pages

404

Unauthorized

Unexpected Error

Network Error

---

# Public Catalog

The Public Catalog SHALL include

Search

Category Filter

Featured Products

Product Cards

WhatsApp Button

Product Detail Page

No authentication required.

---

# Product Card

Every Product Card SHALL display

Primary Image

Product Name

Category

Sale Price

Availability Badge

WhatsApp Button

---

# Availability Badge

AvailabilityStatus

IN_STOCK

Badge

Disponible

Color

Green

---

CHECK_SUPPLIER

Badge

Consultar

Color

Yellow

---

# Product Detail

Displays

Gallery

Description

Price

Category

Availability

WhatsApp Button

Related Products

---

# Dashboard

Dashboard SHALL display

Total Products

Visible Products

Featured Products

Categories

Revenue

Sales Count

Latest Sales

Top Products

Charts

---

# Product Administration

CRUD

Create

Edit

Delete

Visibility

Featured

Image Upload

Availability

---

# Categories

CRUD

Create

Edit

Delete

Order

Activation

---

# Sales

Create

Edit

Delete

Search

Filters

Pagination

---

# Reports

Revenue

Sales

Products

Charts

Date Filters

---

# Settings

Business Name

Currency

Language

Theme

WhatsApp Number

Logo

---

# Social Generator

Generate promotional image

Select template

Preview

Download PNG

Copy marketing text

---

# Internationalization

Supported Languages

Spanish

English

All strings SHALL use translation keys.

No hardcoded strings.

---

# Performance

Lighthouse Score

>=95

Initial Bundle

Minimized

Lazy Loading

Required

Route Splitting

Required

---

# AI Agent Rules

The AI Agent SHALL

Generate reusable components.

Reuse layouts.

Use Mantine components.

Use TanStack Query.

Use TanStack Table.

Use React Hook Form.

Use Zod validation.

Implement loading states.

Implement error states.

Implement responsive layouts.

Generate accessible components.

Generate strongly typed code.

The AI Agent SHALL NEVER

Duplicate components.

Place business logic inside components.

Call APIs directly from UI.

Store server data inside Zustand.

Skip loading states.

Skip validation.

Skip accessibility.

# 07. User Interface Specification

This section defines every screen of NEXO.

The AI Agent SHALL implement every screen exactly as described.

No additional screens shall be created.

No screen shall contain functionality from another module.

---

# Design System

The application SHALL use Mantine.

Visual Style

Minimal

Professional

Modern

Clean

Business-oriented

Rounded Corners

8px

Card Radius

md

Spacing

Mantine Default

Shadows

Soft

Animations

Fast

Subtle

Never distracting.

---

# Color Palette

Primary

Blue

Success

Green

Warning

Yellow

Danger

Red

Neutral

Gray

Dark Theme

Supported

Light Theme

Supported

---

# Typography

Font

Inter

Fallback

sans-serif

Titles

Bold

Body

Regular

Buttons

Medium

---

#######################################################

LOGIN

#######################################################

Purpose

Authenticate administrator.

Components

Logo

Application Name

Email

Password

Login Button

Forgot Password (future)

Validation

Email required

Password required

Redirect

/dashboard

---

#######################################################

ADMIN LAYOUT

#######################################################

Structure

Sidebar

Header

Main Content

Footer

Header

Contains

Search

Theme Toggle

Language

Profile Menu

Sidebar

Dashboard

Products

Categories

Sales

Reports

Social Generator

Settings

Logout

Footer

Version

Copyright

---

#######################################################

DASHBOARD

#######################################################

Purpose

Business overview.

Cards

Products

Categories

Sales

Revenue

Featured Products

Charts

Revenue

Sales per Day

Top Products

Recent Activity

Latest Sales

Latest Products

Quick Actions

New Product

Register Sale

Generate Post

---

#######################################################

PRODUCT LIST

#######################################################

Header

Title

Products

Buttons

New Product

Filters

Search

Category

Availability

Visible

Featured

Table Columns

Image

Name

Category

Sale Price

Availability

Visible

Featured

Actions

Actions

View

Edit

Delete

Pagination

Required

---

#######################################################

CREATE PRODUCT

#######################################################

Fields

Category

Name

Description

Cost Price

Sale Price

Availability

Supplier Information

Visible

Featured

Images

Buttons

Save

Cancel

Validation

Realtime

Preview

Not required

---

#######################################################

EDIT PRODUCT

#######################################################

Same layout as Create Product.

Load current data.

Support image management.

---

#######################################################

IMAGE MANAGER

#######################################################

Features

Upload

Delete

Replace

Change order

Select primary image

Drag & Drop

Optional

Maximum

5 images

Primary Image

Exactly one

---

#######################################################

CATEGORY LIST

#######################################################

Columns

Name

Products Count

Order

Status

Actions

Buttons

Create

Edit

Delete

Activate

Deactivate

---

#######################################################

CREATE CATEGORY

#######################################################

Fields

Name

Description

Display Order

Active

Buttons

Save

Cancel

---

#######################################################

SALES

#######################################################

Header

Register Sale

Filters

Date

Product

Payment Method

Search

Table

Date

Product

Customer

Quantity

Total

Payment Method

Actions

Edit

Delete

---

#######################################################

REGISTER SALE

#######################################################

Fields

Product

Customer Name

Customer Contact

Quantity

Sale Price

Payment Method

Notes

Buttons

Save

Cancel

---

#######################################################

REPORTS

#######################################################

Cards

Revenue

Sales

Average Ticket

Products Sold

Charts

Revenue by Day

Top Products

Sales Trend

Filters

Date Range

Export

Future

---

#######################################################

SOCIAL GENERATOR

#######################################################

Purpose

Generate marketing assets.

Workflow

Select Product

↓

Choose Template

↓

Preview

↓

Download PNG

↓

Copy Marketing Text

Templates

Square

Story

Landscape

Output

PNG

---

#######################################################

SETTINGS

#######################################################

Business Name

Logo

Currency

Currency Symbol

Language

Theme

WhatsApp Number

Buttons

Save

Restore Defaults

---

#######################################################

PUBLIC CATALOG

#######################################################

Landing Page

Logo

Business Name

Search

Categories

Featured Products

Product Grid

Footer

---

#######################################################

PRODUCT CARD

#######################################################

Image

Product Name

Category

Price

Availability Badge

WhatsApp Button

Featured Badge (optional)

---

#######################################################

PRODUCT DETAIL

#######################################################

Gallery

Name

Category

Description

Price

Availability

WhatsApp Button

Related Products

---

#######################################################

SEARCH BAR

#######################################################

Searches

Product Name

Description

Category

Debounce

300 ms

Server-side

---

#######################################################

EMPTY STATES

#######################################################

No Products

Illustration

Message

Action Button

No Categories

Illustration

Message

Action

No Sales

Illustration

Message

Action

---

#######################################################

LOADING STATES

#######################################################

Skeletons

Dashboard

Tables

Cards

Product Detail

Images

---

#######################################################

ERROR STATES

#######################################################

404

500

Network Error

Unauthorized

Friendly messages.

Retry button.

---

#######################################################

CONFIRMATION DIALOGS

#######################################################

Delete Product

Delete Category

Delete Sale

Replace Primary Image

Discard Changes

All destructive actions require confirmation.

---

#######################################################

TOAST NOTIFICATIONS

#######################################################

Success

Error

Warning

Info

Position

Top Right

Auto Close

5 seconds

---

#######################################################

RESPONSIVE BEHAVIOR

#######################################################

Desktop

Sidebar expanded.

Tablet

Sidebar collapsible.

Mobile

Drawer navigation.

Tables

Become cards if necessary.

No horizontal scrolling.

---

#######################################################

ACCESSIBILITY

#######################################################

Keyboard Navigation

Required

Focus Indicators

Required

ARIA Labels

Required

Semantic HTML

Required

Contrast

WCAG AA

---

#######################################################

AI IMPLEMENTATION RULES

#######################################################

The AI Agent SHALL

Generate every screen.

Generate reusable components.

Reuse dialogs.

Reuse forms.

Reuse buttons.

Reuse layouts.

Never duplicate UI.

Maintain visual consistency.

Never introduce additional screens.

Never change navigation.

Never change workflows.

# 08. Business Rules Specification

This section defines every business rule of NEXO.

Business Rules SHALL always prevail over implementation details.

Whenever implementation conflicts with a business rule, the business rule wins.

The AI Agent SHALL NEVER infer business behavior.

Every rule is explicitly defined below.

---

#######################################################
GENERAL RULES
#######################################################

BR-001

NEXO manages ONE business only.

Every deployment represents exactly one company.

No multi-tenant logic is allowed.

---

BR-002

Products are the primary entity of the application.

Every commercial operation starts from a product.

---

BR-003

Categories organize products.

Categories do not contain business logic.

---

BR-004

Sales are historical records.

Sales SHALL NEVER modify product information.

---

BR-005

Deleting information is permanent.

Soft Delete is outside MVP scope.

---

#######################################################
CATEGORY RULES
#######################################################

BR-100

Every product SHALL belong to exactly one category.

---

BR-101

Category names must be unique.

Comparison is case insensitive.

Invalid

Electronics

electronics

ELECTRONICS

---

BR-102

Category slug is automatically generated.

The administrator cannot edit the slug.

---

BR-103

Inactive categories SHALL NOT appear in the public catalog.

---

BR-104

Products assigned to inactive categories SHALL NOT appear publicly.

---

BR-105

Categories cannot be deleted while products exist.

Attempting to delete SHALL return HTTP 409.

---

BR-106

Display Order determines category ordering.

Lower values appear first.

---

#######################################################
PRODUCT RULES
#######################################################

BR-200

Every product SHALL have

Category

Name

Sale Price

Availability

Visibility

---

BR-201

Product names are not required to be unique.

---

BR-202

Sale Price must always be greater than zero.

---

BR-203

Cost Price cannot be negative.

---

BR-204

Products are created invisible by default.

Administrator decides when to publish.

Default

is_visible = false

---

BR-205

Invisible products SHALL NEVER appear

Catalog

Search

Related Products

Featured Products

---

BR-206

Featured products MUST also be visible.

Invisible products cannot be featured.

---

BR-207

Every visible product SHALL contain at least one image.

---

BR-208

Products support a maximum of five images.

---

BR-209

Exactly one image SHALL be primary.

Never zero.

Never multiple.

---

BR-210

If the primary image is deleted

The next image becomes primary automatically.

---

BR-211

Products without images cannot become visible.

---

BR-212

Supplier information is private.

Never exposed publicly.

---

BR-213

Changing product prices SHALL NOT modify historical sales.

Sales preserve their original value.

---

#######################################################
AVAILABILITY RULES
#######################################################

BR-300

Availability values

IN_STOCK

CHECK_SUPPLIER

Only these values are valid.

---

BR-301

IN_STOCK means

Merchant owns the product.

Immediate sale is possible.

---

BR-302

CHECK_SUPPLIER means

Merchant must verify availability.

---

BR-303

Availability SHALL be displayed

Dashboard

Product List

Catalog

Product Detail

---

BR-304

Availability NEVER blocks WhatsApp.

The customer can always contact the merchant.

---

#######################################################
IMAGE RULES
#######################################################

BR-400

Allowed formats

JPEG

PNG

WEBP

---

BR-401

Maximum file size

5 MB

---

BR-402

Images SHALL be optimized before upload.

---

BR-403

Images SHALL preserve aspect ratio.

---

BR-404

Deleting a product SHALL delete every image.

---

BR-405

Image order SHALL be configurable.

---

#######################################################
SALES RULES
#######################################################

BR-500

Sales are registered manually.

---

BR-501

Sales do not affect product availability.

---

BR-502

Sales do not decrease inventory.

Inventory management is outside MVP.

---

BR-503

Sales preserve historical prices.

---

BR-504

Editing products SHALL NEVER modify previous sales.

---

BR-505

Deleting a product SHALL NOT delete historical sales.

The relationship SHALL be preserved.

If deletion is required,

the system SHALL prevent deletion

or require reassignment.

Default

Prevent deletion.

---

BR-506

Quantity must be greater than zero.

---

#######################################################
REPORT RULES
#######################################################

BR-600

Reports use only registered sales.

---

BR-601

Revenue equals

Sum of every sale_price.

---

BR-602

Top Products are calculated

using quantity sold.

---

BR-603

Reports ignore invisible products only if they have never been sold.

Historical sales remain valid.

---

#######################################################
SETTINGS RULES
#######################################################

BR-700

Exactly one settings record exists.

---

BR-701

Changing business name updates

Admin Panel

Public Catalog

Browser Title

---

BR-702

Changing WhatsApp number affects

Catalog

Product Detail

Generated Links

Social Generator

---

BR-703

Changing currency updates

Entire application.

Historical sales keep numeric values.

---

#######################################################
PUBLIC CATALOG RULES
#######################################################

BR-800

Public Catalog requires no authentication.

---

BR-801

Only visible products appear.

---

BR-802

Only active categories appear.

---

BR-803

Hidden products SHALL NEVER be accessible by URL.

Return

404

---

BR-804

Related products

Must belong to same category.

Must be visible.

Must exclude current product.

Maximum

4 products.

---

#######################################################
SEARCH RULES
#######################################################

BR-900

Search is server-side.

---

BR-901

Search ignores upper/lower case.

---

BR-902

Search matches

Name

Description

Category Name

---

#######################################################
WHATSAPP RULES
#######################################################

BR-1000

Every product contains a WhatsApp action.

---

BR-1001

The generated message SHALL include

Product Name

Product Price

Product URL

---

BR-1002

CHECK_SUPPLIER products SHALL append

"I would like to check product availability."

---

#######################################################
ERROR RULES
#######################################################

BR-1100

Unexpected exceptions SHALL be logged.

---

BR-1101

Internal implementation details SHALL NEVER be exposed.

---

BR-1102

Validation errors SHALL identify the field.

---

#######################################################
AUDIT RULES
#######################################################

BR-1200

MVP does not implement audit logs.

Future versions may include them.

---

#######################################################
PERFORMANCE RULES
#######################################################

BR-1300

Product listing SHALL always be paginated.

---

BR-1301

Images SHALL use lazy loading.

---

BR-1302

Database queries SHALL avoid N+1 patterns.

---

#######################################################
CONSISTENCY RULES
#######################################################

BR-1400

The system SHALL NEVER leave inconsistent data.

Examples

Product without category

Multiple primary images

Negative prices

Duplicate category names

Broken foreign keys

These states are prohibited.

---

#######################################################
AI IMPLEMENTATION RULES
#######################################################

The AI Agent SHALL implement every business rule exactly.

The AI Agent SHALL NOT invent new business behavior.

Whenever implementation uncertainty exists,

this section is authoritative.

Business Rules override

UI

API

Database

Implementation details

