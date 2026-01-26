# AGENTS.md

This file provides guidance to Qoder (qoder.com) when working with code in this repository.

## Project Overview

This is a full-stack restaurant ordering system called "江云厨智能点餐系统" (Jiangyun Chef Smart Ordering System) with:
- Backend: Node.js, Express, TypeScript, MongoDB
- Database: MongoDB with Mongoose ODM
- Storage: AWS S3-compatible service (e.g., Supabase) for image uploads
- Real-time communication: WebSocket for Kitchen Display System

## Architecture

### Backend Structure (src/)
- `config/` - Database and S3 configuration
- `controllers/` - Request handlers for API endpoints
- `middleware/` - Express middleware (auth, role guard, error handling)
- `models/` - Mongoose data models
- `routes/` - API route definitions
- `scripts/` - Database seeding and maintenance scripts
- `services/` - Business logic layer
- `types/` - TypeScript interfaces and types
- `utils/` - Utility functions
- `server.ts` - Main server entry point with WebSocket support

### Core Models
- `User` - System users with roles (admin, staff, partner)
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
```

### Environment Variables
Create `.env` file with the following required variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `FRONTEND_URL` - Frontend domain for production CORS configuration
Optional S3 configuration:
- `S3_ENDPOINT` - S3-compatible storage endpoint
- `S3_REGION` - S3 region (defaults to ap-south-1)
- `S3_ACCESS_KEY` - S3 access key
- `S3_SECRET_KEY` - S3 secret key
- `S3_BUCKET` - S3 bucket name (defaults to jx-cloud-dishes)

### Common Commands
- `npm run dev` - Start development server with ts-node-dev (auto-restart on changes)
- `npm run build` - Compile TypeScript code to JavaScript in dist directory
- `npm run seed` - Seed database with sample data using src/scripts/seed.ts
- `npm run start` - Start production server from dist folder
- `npm run lint` - Run ESLint on TypeScript files
- `npm run clean` - Remove dist directory using rimraf
- `npm test` - Placeholder for tests (no tests currently implemented)
- `npm run prebuild` - Clean build directory (runs automatically before build)
- `npm run postbuild` - Post-build success message (runs automatically after build)

Note: This is primarily a backend-only project despite references to frontend in some documentation. The actual frontend directory does not exist in the current project structure.

## Testing

### Current Test Status
- No test files currently exist in the project
- Test infrastructure is configured but not implemented
- Consider implementing tests for critical business logic and API endpoints using Vitest with React Testing Library

## Environment Configuration

### Required Environment Variables
- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Server port (defaults to 4000)
- `MONGODB_URI` - MongoDB connection string (required)
- `JWT_SECRET` - Secret key for JWT token signing (required for auth)
- `FRONTEND_URL` - Frontend domain in production for CORS

### Optional S3 Configuration
- `S3_ENDPOINT` - S3-compatible storage endpoint
- `S3_REGION` - S3 region (defaults to ap-south-1)
- `S3_ACCESS_KEY` - S3 access key
- `S3_SECRET_KEY` - S3 secret key
- `S3_BUCKET` - S3 bucket name (defaults to jx-cloud-dishes)

### Development vs Production
- Development: Server runs on port 4000 with auto-restart
- Production: Server runs from dist folder
- WebSocket connections use the same origin as HTTP requests (ws:// or wss://)

## Deployment

### Vercel Deployment
- Configured for Vercel deployment with serverless functions
- API routes: `/api/*` handled by serverless functions
- Environment variables needed: `MONGODB_URI`, `JWT_SECRET`
- WebSocket functionality limited in serverless environment

### Local Production Deployment
1. Build the project: `npm run build`
2. Set environment variables in production
3. Start production server: `npm start`
4. Server will serve API endpoints

### Vercel Configuration (`vercel.json`)
- Routes API requests to serverless function handler
- Uses @vercel/node runtime for serverless functions

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
- jsonwebtoken - JWT token implementation
- bcryptjs - Password hashing
- node-thermal-printer - Thermal printer support

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
- RESTful API design following best practices
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
- Role-based access control with admin, staff, and partner permissions
- Data isolation for partners to only access their own records

## Data Models

### Order Model (`src/models/Order.ts`)
- Implements status transition validation to ensure only valid state changes
- Pre-save middleware to calculate total amount
- Status transitions: pending → confirmed → preparing → ready → delivered (cancellation possible until delivered)
- Valid status values: 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'
- Automatic timestamp fields: preparingAt, readyAt, deliveredAt based on status changes
- Valid status transitions: pending→(confirmed,cancelled), confirmed→(preparing,cancelled), preparing→(ready,cancelled), ready→delivered

### User Model (`src/models/User.ts`)
- Supports three roles: admin, staff, and partner
- Password hashing with bcryptjs
- Email validation and uniqueness constraints
- Module-specific permissions for fine-grained access control
- Partner-specific data isolation through partnerId

### Dish Model (`src/models/Dish.ts`)
- Supports bilingual names (Chinese and English)
- Availability tracking
- Category association
- Image storage capabilities

### Room Model (`src/models/Room.ts`)
- Room/table number identification
- Capacity tracking
- Status management (available, occupied, maintenance)
- Indexes for optimized queries

## Authentication & Authorization

### JWT-Based Authentication
- Token-based authentication using jsonwebtoken
- Middleware to verify tokens and attach user info to requests
- Role-based access control with different permission levels

### Role System
- `admin`: Full system access, can manage all resources
- `staff`: Access to order management, basic operations
- `partner`: Limited access to their own data only, with data isolation

### Security Features
- Passwords hashed with bcryptjs
- Role verification middleware
- Partner data isolation through middleware
- Protected routes based on user roles

## Frontend Architecture (Documentation Reference)

While the frontend code is not present in this repository, documentation indicates:
- React-based frontend with TypeScript
- Tailwind CSS for styling
- Vite as build tool
- API service with safe fallbacks
- Global state management
- WebSocket integration for real-time updates

## Security Considerations

### Current Security Implementation
- JWT-based authentication with role-based access control
- Input validation through Mongoose schemas with type checking
- Environment variables for sensitive configuration (database, S3, JWT)
- Password hashing with bcryptjs
- Role-based access control with admin, staff, and partner roles
- Partner data isolation through middleware
- CORS configured differently for development (wildcard) vs production (specific domains)

### Production Security Measures
- Proper JWT authentication with role-based access control
- Restrict CORS to specific allowed origins in production
- Input sanitization and validation
- HTTPS enforcement in production
- API rate limiting (to be implemented)
- Request logging and monitoring

## Additional Development Tips

### Database Management
- Sample data can be seeded using: `npm run seed`
- The seed script initializes 12 modules: rooms, dishes, categories, partners, expenses, ingredients, system configs, staff, notifications
- Seeded rooms include ranges 8201-8232, 8301-8332, plus VIP rooms 3333, 6666, 9999
- Seeded dishes include 30+ sample menu items across multiple cuisine categories
- MongoDB connection automatically closes on SIGINT/SIGTERM signals

### Development Workflow
- WebSocket connections are established at `/ws` endpoint for real-time KDS updates
- Changes to TypeScript files trigger automatic restart via ts-node-dev
- Use `npm run clean` before major rebuilds to ensure fresh build

### Debugging and Monitoring
- Health check endpoint available at `/health` showing database and S3 status
- WebSocket connections log connection/disconnection events
- MongoDB connection state monitored in health checks
- Console logs provide debugging information for WebSocket and database operations

### Performance Considerations
- MongoDB connection caching implemented for serverless environments
- WebSocket connections maintained in memory for real-time updates
- API responses include timeout handling
- Proper indexing on database collections for optimized queries

## WebSocket Real-Time System

### Kitchen Display System (KDS)
- Implemented using WebSocket protocol via the `ws` library
- Endpoint: `/ws` for real-time order updates
- Broadcast functionality exported as `broadcastToClients` from server.ts
- Used in OrdersController for real-time order creation and status updates
- Messages include:
  - `NEW_ORDER` - When a new order is created
  - `ORDER_STATUS_UPDATE` - When order status changes
  - `CONNECTION_ESTABLISHED` - Welcome message to new clients

### Broadcasting Mechanism
- WebSocket server integrated with Express HTTP server
- Maintains a Set of active WebSocket connections
- Broadcasts messages to all connected clients simultaneously
- Used for real-time order tracking in kitchen display systems

## API Design Patterns

### Controller Structure
- Each controller follows consistent async/await pattern
- Standard error handling with try/catch blocks
- Proper HTTP status codes for different response scenarios
- Detailed error logging for debugging purposes

### Middleware Implementation
- Authentication middleware (`authMiddleware`) for basic JWT verification
- Role verification middleware (`verifyRole`) for access control
- Partner filter middleware for data isolation
- Error handling middleware for centralized error responses

### Type Safety
- Strong TypeScript typing throughout the codebase
- Interface definitions for all data models
- Request/response type safety using Express extensions
- Strict TypeScript configuration in tsconfig.json

## Additional API Endpoints

### Authentication Endpoints
- `POST /api/auth/login` - User authentication with JWT token generation

### Print Service Endpoints
- `POST /api/print/orders/:id` - Send order to thermal printer

### Additional Admin Endpoints
- `POST /api/admin/users` - Create new user accounts
- `PUT /api/admin/users/:id` - Update user information
- `DELETE /api/admin/users/:id` - Delete user account
- `POST /api/admin/system-config` - Create system configuration
- `PUT /api/admin/system-config/:key` - Update specific configuration value
- `GET /api/admin/notifications` - Get system notifications
- `POST /api/admin/notifications` - Create notification
- `DELETE /api/admin/notifications/:id` - Delete notification