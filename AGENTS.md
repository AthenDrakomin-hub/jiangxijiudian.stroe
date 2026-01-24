# AGENTS.md

This file provides guidance to Qoder (qoder.com) when working with code in this repository.

## Project Overview

This is a full-stack restaurant ordering system called "江云厨智能点餐系统" (Jiangyun Chef Smart Ordering System) with:
- Backend: Node.js, Express, TypeScript, MongoDB
- Frontend: React, TypeScript, Tailwind CSS, Vite
- Database: MongoDB with Mongoose ODM
- Storage: AWS S3-compatible service (e.g., Supabase) for image uploads
- Real-time communication: WebSocket for Kitchen Display System

## Architecture

### Backend Structure (src/)
- `config/` - Database and S3 configuration
- `controllers/` - Request handlers for API endpoints
- `middleware/` - Express middleware
- `models/` - Mongoose data models
- `routes/` - API route definitions
- `services/` - Business logic layer
- `utils/` - Utility functions
- `scripts/` - Database seeding and maintenance scripts
- `server.ts` - Main server entry point with WebSocket support

### Frontend Structure (frontend/src/)
- `components/` - React UI components (AdminLayout, OrderManagement, MenuManagement, etc.)
- `utils/` - Frontend utility functions and API service
- `services/` - Frontend services (authentication, notifications, etc.)
- `types/` - TypeScript interfaces and types
- `constants/` - Application constants and translations
- `App.tsx` - Main application component with routing

### Core Models
- `User` - System users with roles (admin, staff, guest)
- `Room` - Restaurant tables/rooms with status tracking
- `Dish` - Menu items with pricing and categorization
- `Order` - Customer orders with status lifecycle
- `Category` - Menu categories for organization
- `Inventory` - Stock management system
- `Expense` - Financial expense tracking
- `Partner` - Supplier/vendor relationships
- `Payment` - Payment processing records
- `Staff` - Employee management
- `SystemConfig` - Application configuration settings
- `Ingredient` - Raw material and supply tracking
- `Notification` - System notifications and alerts

### API Endpoints
- `GET /api/dishes` - Get dish list
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get specific order
- `PATCH /api/orders/:id/status` - Update order status
- `GET /api/rooms/:roomNumber` - Get room information
- `GET /api/rooms` - Get all rooms
- `GET /health` - Health check endpoint
- `GET /api/admin/*` - Administrative API endpoints
- `GET /api/data/*` - Data management endpoints
- `GET /ws` - WebSocket endpoint for real-time updates (Kitchen Display System)
- `POST /api/admin/payments` - Create payment record
- `PUT /api/admin/payments/:id` - Update payment record
- `DELETE /api/admin/payments/:id` - Delete payment record
- `PATCH /api/admin/payments/:id/toggle` - Toggle payment status
- `POST /api/admin/registration` - Submit staff registration
- `PATCH /api/admin/registration/approve/:id` - Approve registration
- `PATCH /api/admin/registration/reject/:id` - Reject registration
- `POST /api/admin/ingredients` - Create ingredient record
- `PUT /api/admin/ingredients/:id` - Update ingredient record
- `DELETE /api/admin/ingredients/:id` - Delete ingredient record
- `POST /api/admin/partners` - Create partner record
- `POST /api/admin/categories` - Create category
- `POST /api/admin/categories/batch` - Save all categories in batch
- `POST /api/admin/staff` - Create staff member
- `POST /api/admin/inventory` - Create inventory record
- `POST /api/admin/finance` - Create finance record
- `POST /api/admin/supply-chain` - Create supply chain record
- `POST /api/admin/archive/import` - Import data
- `GET /api/admin/archive/export` - Export data
- `PUT /api/admin/translations` - Update translations

## Development Commands

### Setup
```bash
npm install
cd frontend && npm install
```

### Environment Variables
Copy `.env.example` to `.env` and configure `MONGODB_URI` and optional S3 settings

### Common Commands
- `npm run dev` - Start development servers (both frontend and backend)
- `npm run dev:server` - Start backend server only with ts-node-dev
- `npm run dev:client` - Start frontend server only
- `npm run dev:backend` - Alternative backend development command
- `npm run dev:frontend` - Alternative frontend development command
- `npm run build` - Build production versions of frontend and backend
- `npm run build:full` - Full build including dependencies installation
- `npm run seed` - Seed database with sample data using src/scripts/seed.ts
- `npm run start` - Start production server
- `npm run lint` - Run ESLint on TypeScript files
- `npm run clean` - Remove dist directory
- `npm test` - Placeholder for backend tests
- `cd frontend && npm test` - Run frontend tests with Jest/React Testing Library

### Frontend Commands (cd frontend/)
- `npm run dev` - Start development server with Vite (port 3000)
- `npm run build` - Build for production with Vite
- `npm run preview` - Preview production build locally

## Testing

- Frontend uses Jest with React Testing Library (@testing-library/react, @testing-library/jest-dom, @testing-library/user-event)
- Backend testing can be implemented with similar testing libraries if needed
- Test files should follow the naming convention `*.test.tsx` or `*.test.ts`
- Currently no test files exist in the project

## Environment Configuration

- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Server port (defaults to 4000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing (if implemented)
- `S3_ENDPOINT` - S3-compatible storage endpoint (optional)
- `S3_REGION` - S3 region (optional, defaults to ap-south-1)
- `S3_ACCESS_KEY` - S3 access key (optional)
- `S3_SECRET_KEY` - S3 secret key (optional)
- `S3_BUCKET` - S3 bucket name (optional, defaults to jx-cloud-dishes)

## Deployment

- Configured for Vercel deployment
- Production builds serve frontend static files from backend
- API routes: `/api/*`
- Frontend routes: `/*` (SPA fallback)
- Environment variables needed: `MONGODB_URI`
- Vercel configuration in `vercel.json`

## Key Dependencies

### Backend
- Express - Web framework
- Mongoose - MongoDB ODM
- Cors - Cross-origin resource sharing
- Dotenv - Environment variable management
- Concurrently - Running multiple processes
- Ts-node-dev - Development TypeScript compiler with auto-restart
- @aws-sdk/client-s3 - AWS S3 client for image uploads
- ws - WebSocket library for real-time communication

### Frontend
- React - UI library
- React Router DOM - Routing
- Tailwind CSS - Styling
- Axios - HTTP client
- React Hook Form - Form handling
- Yup - Form validation
- Lucide React - Icon library
- Recharts - Data visualization
- Vite - Build tool and development server
- Testing Library - Testing utilities
- Supabase - Backend-as-a-service (configured but may not be actively used)

## Application Features

### Core Functionality
- Guest ordering system with room-based ordering
- Real-time order management dashboard
- Menu management with categories
- Room/table status tracking
- Order status lifecycle (pending → confirmed → preparing → ready → delivered)
- Admin panel with multiple management modules

### Admin Modules
- Dashboard - Overview statistics and metrics
- Order Management - Process and track orders
- Menu Management - Create and manage dishes
- Room Management - Table/room status monitoring
- Supply Chain - Vendor and ingredient management
- Financial Center - Expense and payment tracking
- Staff Management - User and employee administration
- System Settings - Configuration management
- Category Management - Menu categorization
- Inventory Management - Stock control
- Payment Management - Transaction processing
- Image Library - Media management
- Kitchen Display System (KDS) - Real-time kitchen order tracking
- Registration Review - Staff registration approval workflow
- Ingredient Management - Raw material tracking
- Partner Management - Supplier relationship management
- Translation Management - Multi-language support configuration

### Technical Features
- Responsive design with mobile-first approach
- Real-time data synchronization via WebSocket
- Multi-language support (Chinese/English)
- QR code integration for room-based ordering
- Component-based architecture with shared data contexts
- Error boundaries and loading states
- Toast notifications for user feedback
- Safe API calls with fallbacks to prevent crashes
- MongoDB connection caching for serverless environments
- S3-compatible storage for image uploads
- WebSocket-based Kitchen Display System (KDS) for real-time order tracking
- Automatic status transition timestamps (preparingAt, readyAt, deliveredAt)
- Validated order status transitions to ensure business logic integrity

## Data Models

### Order Model (`src/models/Order.ts`)
- Implements status transition validation to ensure only valid state changes
- Pre-save middleware to calculate total amount
- Status transitions: pending → confirmed → preparing → ready → delivered (cancellation possible until delivered)
- Valid status values: 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'
- Automatic timestamp fields: preparingAt, readyAt, deliveredAt based on status changes
- Valid status transitions: pending→(confirmed,cancelled), confirmed→(preparing,cancelled), preparing→(ready,cancelled), ready→delivered

### Dish Model (`src/models/Dish.ts`)
- Supports bilingual names (Chinese and English)
- Availability tracking
- Category association
- Image storage capabilities

### Room Model (`src/models/Room.ts`)
- Room/table number identification
- Capacity tracking
- Status management (available, occupied, reserved, maintenance)
- Indexes for optimized queries

## Frontend Architecture

### API Service (`frontend/src/utils/api.ts`)
- Centralized API service with safe fallbacks
- MongoDB `_id` to frontend `id` mapping
- Timeout handling and error recovery
- Structured by entity (dishes, orders, rooms, etc.)

### State Management
- Global state management in App.tsx
- Shared data context between components
- Real-time data refresh capabilities
- Loading state management

## Security Considerations

- CORS configured to allow all origins (should be restricted in production)
- Input validation through Mongoose schemas
- Environment variables for sensitive configuration
- Mock authentication currently in place (needs proper implementation)
- API rate limiting should be implemented in production
- JWT authentication implementation planned for future versions
- WebSocket connections use the same origin as HTTP requests (ws:// or wss://)
- Client-side authentication should be implemented for WebSocket connections in production

## Additional Development Tips

- To run backend tests: `npm test` (configure as needed)
- To run frontend tests: `cd frontend && npm test`
- To lint the backend code: `npm run lint` (requires ESLint setup)
- Sample data can be seeded using: `npm run seed`
- The seed script initializes 12 modules: rooms, dishes, categories, partners, expenses, ingredients, system configs, staff, notifications
- Seeded rooms include ranges 8201-8232, 8301-8332, plus VIP rooms 3333, 6666, 9999
- Seeded dishes include 30+ sample menu items across multiple cuisine categories
- Frontend development server runs on port 3000 and proxies API requests to backend on port 4000
- WebSocket connections are established at `/ws` endpoint for real-time KDS updates