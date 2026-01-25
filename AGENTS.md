# AGENTS.md

This file provides guidance to Qoder (qoder.com) when working with code in this repository.

## Project Overview

This is a full-stack restaurant ordering system called "江云厨智能点餐系统" (Jiangyun Chef Smart Ordering System) with:
- Backend: Node.js, Express, TypeScript, MongoDB
- Frontend: React, TypeScript, Tailwind CSS, Vite
- Database: MongoDB with Mongoose ODM
- Storage: AWS S3-compatible service (e.g., Supabase) for image uploads
- Real-time communication: WebSocket for Kitchen Display System

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
# Note: Frontend dependencies are managed separately in the root package.json
```

### Environment Variables
Create `.env` file with the following required variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing
Optional S3 configuration:
- `S3_ENDPOINT` - S3-compatible storage endpoint
- `S3_REGION` - S3 region (defaults to ap-south-1)
- `S3_ACCESS_KEY` - S3 access key
- `S3_SECRET_KEY` - S3 secret key
- `S3_BUCKET` - S3 bucket name (defaults to jx-cloud-dishes)

### Common Commands
- `npm run dev` - Start development servers (both frontend and backend using concurrently)
- `npm run dev:server` - Start backend server only with ts-node-dev (transpile-only mode)
- `npm run dev:client` - Start frontend development server with Vite
- `npm run dev:backend` - Alternative backend development command
- `npm run dev:frontend` - Alternative frontend development command
- `npm run build` - Build production versions of frontend and backend
- `npm run build:full` - Full build including dependencies installation
- `npm run build:frontend` - Build frontend only using Vite
- `npm run build:backend` - Build backend only using TypeScript compiler
- `npm run seed` - Seed database with sample data using src/scripts/seed.ts
- `npm run start` - Start production server from dist folder
- `npm run lint` - Run ESLint on TypeScript files
- `npm run clean` - Remove dist directory using rimraf
- `npm test` - Placeholder for backend tests
- `npm run prebuild` - Clean build directory (runs automatically before build)
- `npm run postbuild` - Post-build success message (runs automatically after build)

### Frontend Development Commands
- `npm run dev:client` - Start frontend development server with Vite on port 3000
- `npm run build:frontend` - Build frontend for production with Vite
- `npm run preview` - Preview production build locally

Note: Frontend uses Vite proxy to forward API requests from port 3000 to backend on port 4000 during development.

## Testing

### Frontend Testing
- Uses Vitest with React Testing Library (@testing-library/react, @testing-library/jest-dom, @testing-library/user-event)
- Test files should follow the naming convention `*.test.tsx` or `*.test.ts`
- Run tests with: `npm test` in the frontend directory
- Test environment configured with jsdom for DOM simulation

### Backend Testing
- Currently uses placeholder test command
- Can be implemented with Jest or Vitest
- Test files should follow the naming convention `*.test.ts`
- MongoDB connection should be mocked or use test database

### Current Test Status
- No test files currently exist in the project
- Test infrastructure is configured but not implemented
- Consider implementing tests for critical business logic and API endpoints

## Environment Configuration

### Required Environment Variables
- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Server port (defaults to 4000)
- `MONGODB_URI` - MongoDB connection string (required)
- `JWT_SECRET` - Secret key for JWT token signing (required for auth)

### Optional S3 Configuration
- `S3_ENDPOINT` - S3-compatible storage endpoint
- `S3_REGION` - S3 region (defaults to ap-south-1)
- `S3_ACCESS_KEY` - S3 access key
- `S3_SECRET_KEY` - S3 secret key
- `S3_BUCKET` - S3 bucket name (defaults to jx-cloud-dishes)

### Development vs Production
- Development: Frontend runs on port 3000, backend on port 4000 with proxy
- Production: Both served from same port with Vercel routing or built-in Express static serving
- WebSocket connections use the same origin as HTTP requests (ws:// or wss://)

## Deployment

### Vercel Deployment
- Configured for Vercel deployment with serverless functions
- Production builds serve frontend static files from backend
- API routes: `/api/*` handled by serverless functions
- Frontend routes: `/*` (SPA fallback to index.html)
- Environment variables needed: `MONGODB_URI`, `JWT_SECRET`
- WebSocket functionality limited in serverless environment

### Local Production Deployment
1. Build the project: `npm run build`
2. Set environment variables in production
3. Start production server: `npm start`
4. Server will serve frontend static files and API endpoints

### Vercel Configuration (`vercel.json`)
- Routes API requests to serverless function handler
- Rewrites all other requests to serve SPA index.html
- Uses @vercel/node runtime for serverless functions
- Static file serving for built frontend assets

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

### Current Security Status
- CORS configured to allow all origins (should be restricted in production to specific domains)
- Input validation through Mongoose schemas with type checking
- Environment variables for sensitive configuration (database, S3, JWT)
- Mock authentication currently in place (needs proper JWT implementation)
- No API rate limiting implemented

### Production Security Recommendations
- Implement proper JWT authentication with role-based access control
- Restrict CORS to specific allowed origins
- Add API rate limiting middleware
- Implement input sanitization and validation
- Use HTTPS in production
- Regular security audits and dependency updates
- Implement proper WebSocket authentication
- Add request logging and monitoring

### Authentication Status
- Currently uses mock authentication system
- JWT implementation partially configured but not fully integrated
- Role-based access control middleware exists but needs proper user management
- Password hashing with bcryptjs is available but not fully implemented

## Additional Development Tips

### Database Management
- Sample data can be seeded using: `npm run seed`
- The seed script initializes 12 modules: rooms, dishes, categories, partners, expenses, ingredients, system configs, staff, notifications
- Seeded rooms include ranges 8201-8232, 8301-8332, plus VIP rooms 3333, 6666, 9999
- Seeded dishes include 30+ sample menu items across multiple cuisine categories
- MongoDB connection automatically closes on SIGINT/SIGTERM signals

### Development Workflow
- Frontend development server runs on port 3000 and proxies API requests to backend on port 4000
- WebSocket connections are established at `/ws` endpoint for real-time KDS updates
- Changes to TypeScript files trigger automatic restart via ts-node-dev
- Vite provides hot module replacement for frontend development
- Use `npm run clean` before major rebuilds to ensure fresh build

### Debugging and Monitoring
- Health check endpoint available at `/health` showing database and S3 status
- WebSocket connections log connection/disconnection events
- MongoDB connection state monitored in health checks
- Console logs provide debugging information for WebSocket and database operations

### Performance Considerations
- MongoDB connection caching implemented for serverless environments
- WebSocket connections maintained in memory for real-time updates
- API responses include timeout handling (10 seconds)
- Frontend implements safe API calls with fallback mechanisms
- Lazy loading and code splitting recommended for large components