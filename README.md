# Takam

A web application that connects home cooks with food lovers, enabling the buying and selling of homemade food items.

## Features

- **User Management**
    - User registration and authentication
    - Profile creation and management
- **Food Listings**
    - Create, read, update, and delete food posts
    - Rich media support for food images
    - Food descriptions and pricing
- **Interaction**
    - Search functionality
    - Comment system on food listings
    - Shopping cart functionality
    - Order management system

## Tech Stack

**Frontend:**

- React.js
- React Router
- React Query
- Zustand
- Shadcn
- Tailwind CSS

**Backend:**

- Node.js
- Express.js
- MongoD
- Mongoose ODM
- Bcrypt.js
- JSON Web Tokens (JWT)
- Cloudinary

## API Documentation

### Authentication Endpoints

- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - User login
- `DELETE /api/v1/auth/`logout - User login

### User Endpoints

- `GET /api/v1/users/:username` - Get user
- `PATCH /api/v1/users/:username` - Update user
- `DELETE /api/v1/users/:username` - Delete user

### Food Endpoints

- `GET /api/v1/foods` - Get all food listings
- `POST /api/v1/foods` - Create new food listing
- `GET /api/v1/foods/:id` - Get food listing
- `PATCH /api/v1/foods/:id` - Update food listing
- `DELETE /api/v1/foods/:id` - Delete food listing

### Order Endpoints

- `GET /api/v1/orders/users/:username` - Get user’s food listings
- `POST /api/v1/orders` - Create new order
- `GET /api/v1/orders/:id` - Get order
- `PATCH /api/v1/orders/:id` - Update order
- `DELETE /api/v1/orders/:id` - Delete order

## Security Features

- JWT authentication
- Password hashing
- Input validation
- XSS protection
- CORS configuration

Live demo: [Takam](https://takam.onrender.com/)
