# Backend Setup Guide

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database
DATABASE_URL="mongodb://localhost:27017/ducali"

# Authentication
NEXTAUTH_SECRET="your-super-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# JWT
JWT_SECRET="your-jwt-secret-key-here-change-in-production"

# Redis (for caching and sessions)
REDIS_URL="redis://localhost:6379"

# UploadThing
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Stripe
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="whsec_your-stripe-webhook-secret"

# M-Pesa (if you're using it)
MPESA_CONSUMER_KEY="your-mpesa-consumer-key"
MPESA_CONSUMER_SECRET="your-mpesa-consumer-secret"
MPESA_PASSKEY="your-mpesa-passkey"
MPESA_BUSINESS_SHORT_CODE="your-mpesa-business-short-code"

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-email-password"

# App Configuration
NODE_ENV="development"
```

### 2. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Create database: `ducali`

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and update `DATABASE_URL`

### 3. Install Dependencies

```bash
npm install
```

### 4. Database Migration & Seeding

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

## 📊 Database Schema

The application uses MongoDB with the following main entities:

- **Users**: Customers and Artisans
- **ArtisanProfiles**: Extended profiles for artisans
- **PortfolioItems**: Artisan's work samples
- **Services**: Services offered by artisans
- **Orders**: Customer orders and quotes
- **Messages**: Communication between users
- **Payments**: Payment transactions
- **Reviews**: Customer reviews
- **Notifications**: System notifications

## 🔐 Authentication

The backend uses JWT-based authentication with the following features:

- **Registration**: User signup with role selection (Customer/Artisan)
- **Login**: Email/password authentication
- **Token Refresh**: Automatic token refresh
- **Password Hashing**: bcrypt with salt rounds
- **Role-based Access**: Different permissions for customers and artisans

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Token refresh

#### Artisans
- `GET /api/artisans` - List artisans with filters
- `POST /api/artisans` - Create artisan profile
- `GET /api/artisans/[id]` - Get artisan details
- `PUT /api/artisans/[id]` - Update artisan profile
- `DELETE /api/artisans/[id]` - Delete artisan

#### Orders
- `GET /api/orders` - List user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get order details
- `PUT /api/orders/[id]` - Update order status
- `DELETE /api/orders/[id]` - Cancel order

#### Messages
- `GET /api/messages?orderId=xxx` - Get messages for an order
- `POST /api/messages` - Send a message

## 🛠️ Backend Features Implemented

### ✅ Completed
- [x] Database schema and migrations
- [x] User authentication (JWT)
- [x] User registration and login
- [x] Artisan listing and filtering
- [x] Order creation and management
- [x] Messaging system
- [x] Database seeding with sample data
- [x] Input validation and error handling
- [x] Role-based access control

### 🚧 In Progress / Next Steps
- [ ] Payment integration (Stripe/M-Pesa)
- [ ] File upload system (UploadThing)
- [ ] Real-time messaging (Socket.io)
- [ ] Email notifications
- [ ] Search and filtering
- [ ] Review system
- [ ] Notification system
- [ ] Redis caching
- [ ] API rate limiting

## 🔧 Development Tools

### Database Management
```bash
# Generate Prisma client after schema changes
npm run db:generate

# Push schema changes to database
npm run db:push

# Reset and seed database
npm run db:seed

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Testing
```bash
# Run linting
npm run lint

# Build for production
npm run build
```

## 📝 API Documentation

### Authentication Headers
For protected routes, include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Common Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "status": 400
}
```

## 🚀 Deployment

### Environment Variables for Production
- Update all secret keys
- Use production database URL
- Set `NODE_ENV=production`
- Configure proper CORS settings
- Set up SSL certificates

### Database Migration for Production
```bash
# Generate migration files
npx prisma migrate dev --name production

# Deploy migrations
npx prisma migrate deploy
```

## 🔒 Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens are HTTP-only cookies
- Input validation on all endpoints
- Role-based access control
- CORS configuration
- Rate limiting (to be implemented)

## 📞 Support

For backend issues or questions:
1. Check the console logs for error messages
2. Verify environment variables are set correctly
3. Ensure database is running and accessible
4. Check Prisma schema for any validation errors

## 🎯 Next Steps

1. **Set up your environment variables** in `.env.local`
2. **Install and start MongoDB** (local or Atlas)
3. **Run the database setup commands**
4. **Start the development server**
5. **Test the API endpoints** using tools like Postman or Thunder Client

The backend is now ready for frontend integration! 🎉
