# 🛒 abcdeVentures - Shopping Cart Application

A full-stack shopping cart application built with React and Go (Golang), featuring user authentication, cart management, order history, and a responsive UI.

![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)
![Go](https://img.shields.io/badge/Go-1.21-green?logo=go)
![Gin](https://img.shields.io/badge/Gin-1.9.0-blue)
![SQLite](https://img.shields.io/badge/SQLite-3.44.0-lightgrey)

## ✨ Features

### User Authentication

- **Secure Registration**: User registration with password strength validation
- **Login System**: JWT-based authentication with secure session management
- **Password Requirements**:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- **Session Persistence**: Remember me functionality using localStorage

### Shopping Cart

- **Add to Cart**: One-click add items from the product listing
- **Quantity Management**: Increase/decrease item quantities (1-100 limit)
- **Remove Items**: Remove individual items from the cart
- **Real-time Updates**: Cart count updates across the application
- **Price Calculation**: Automatic total calculation with USD formatting

### Order Management

- **Checkout**: Convert cart to order with a single click
- **Order History**: View all past orders with detailed breakdown
- **Status Tracking**: Order status (pending, processing, shipped, completed, cancelled)
- **Order Details**: View items, quantities, and totals for each order

### Admin Features

- **Admin Badge**: Visual indicator for admin users
- **Product Management**: Create, update, and delete products
- **Order Management**: View all orders and update order status
- **User Management**: List all registered users

### Responsive UI

- **Modern Design**: Clean, professional interface with smooth animations
- **Mobile Friendly**: Fully responsive layout for all screen sizes
- **Modal System**: Cart and Order History in smooth modal overlays
- **Loading States**: Loading spinners and states for better UX
- **Error Handling**: Clear error messages and success notifications
- **Visual Feedback**: Hover effects, transitions, and interactive elements

## 🏗️ Tech Stack

### Frontend

- **React 19.2.0** - Modern UI library
- **Vite 7.2.5** - Fast build tool and dev server
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **ESLint** - Code linting

### Backend

- **Go 1.21** - Programming language
- **Gin Gonic 1.9** - Web framework
- **GORM** - ORM for database operations
- **SQLite** - Lightweight database
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing

## 📁 Project Structure

```
abcdeVenturesProject/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Login.jsx          # Login page component
│   │   │   ├── Register.jsx       # Registration page
│   │   │   ├── ItemsList.jsx      # Product catalog
│   │   │   ├── CartModal.jsx      # Shopping cart modal
│   │   │   └── OrderHistory.jsx   # Order history modal
│   │   ├── App.jsx                # Main application component
│   │   ├── main.jsx               # Application entry point
│   │   └── index.css              # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
├── backend/
│   ├── config/
│   │   └── db.go                  # Database configuration
│   ├── controllers/
│   │   ├── user_controller.go    # User authentication
│   │   ├── item_controller.go     # Product management
│   │   ├── cart_controller.go     # Cart operations
│   │   └── order_controller.go    # Order management
│   ├── middleware/
│   │   └── auth.go                # JWT authentication
│   ├── models/
│   │   ├── user.go                # User model
│   │   ├── item.go                # Product model
│   │   ├── cart.go                # Cart model
│   │   ├── cart_item.go           # Cart item model
│   │   └── order.go               # Order model
│   ├── routes/
│   │   └── routes.go              # API route definitions
│   ├── main.go                    # Application entry point
│   ├── go.mod
│   ├── go.sum
│   └── shop.db                    # SQLite database
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Go** 1.21+

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/abhi01326/abcdeVentures.git
   cd abcdeVentures
   ```

2. **Setup Backend**

   ```bash
   cd backend
   go mod tidy
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start the Backend**

   ```bash
   cd backend
   go run main.go
   ```

   - Server runs on `http://localhost:8080`
   - Database: `backend/shop.db`
   - Auto-migrates database schema
   - Seeds sample data (admin, user, products)

2. **Start the Frontend**

   ```bash
   cd frontend
   npm run dev
   ```

   - Development server: `http://localhost:5173`

3. **Access the Application**
   - Open browser to `http://localhost:5173`

## 📖 Usage Guide

### Demo Credentials

| Role  | Username | Password   |
| ----- | -------- | ---------- |
| Admin | `admin`  | `admin123` |
| User  | `user`   | `user123`  |

### User Flow

1. **Registration**
   - Click "Create Account" on the login page
   - Fill in username and password
   - Password must meet strength requirements
   - Upon success, redirect to login

2. **Login**
   - Enter username and password
   - Click "Sign In"
   - Session persists via localStorage

3. **Browse Products**
   - View all products on the Items page
   - Each product shows name, price, and emoji icon
   - Click "Add to Cart" to add items

4. **Manage Cart**
   - Click "View Cart" button or cart icon
   - View all cart items with quantities
   - Adjust quantities (+/- buttons)
   - Remove items (trash icon)
   - View cart total
   - Click "Checkout" to place order

5. **View Orders**
   - Click "Order History" button
   - View all past orders
   - See order status and details
   - Orders show items, quantities, and totals

6. **Logout**
   - Click "Logout" button in header
   - Clear session and return to login

### Admin Features

1. **Login as Admin** (`admin` / `admin123`)
2. **Manage Products**
   - Create new products
   - Update existing products
   - Delete products
3. **Manage Orders**
   - View all user orders
   - Update order status
4. **View Users**
   - List all registered users

## 🔌 API Documentation

### Authentication Endpoints

| Method | Endpoint       | Description            |
| ------ | -------------- | ---------------------- |
| POST   | `/users`       | Register new user      |
| POST   | `/users/login` | User login             |
| GET    | `/users`       | List all users (admin) |

### Item Endpoints

| Method | Endpoint     | Description            |
| ------ | ------------ | ---------------------- |
| GET    | `/items`     | List all products      |
| GET    | `/items/:id` | Get single product     |
| POST   | `/items`     | Create product (admin) |
| PUT    | `/items/:id` | Update product (admin) |
| DELETE | `/items/:id` | Delete product (admin) |

### Cart Endpoints

| Method | Endpoint     | Description               |
| ------ | ------------ | ------------------------- |
| GET    | `/carts`     | Get user cart             |
| POST   | `/carts`     | Add item to cart          |
| PUT    | `/carts/:id` | Update cart item quantity |
| DELETE | `/carts/:id` | Remove cart item          |

### Order Endpoints

| Method | Endpoint        | Description                 |
| ------ | --------------- | --------------------------- |
| POST   | `/orders`       | Create order (checkout)     |
| GET    | `/orders/user`  | Get user orders             |
| GET    | `/orders/admin` | Get all orders (admin)      |
| PUT    | `/orders/:id`   | Update order status (admin) |

### Authentication Middleware

All cart and order endpoints require JWT token in header:

```
Authorization: <token>
```

## 🛠️ Development

### Database Schema

```sql
-- Users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT,
    token TEXT,
    admin BOOLEAN,
    created_at DATETIME
);

-- Items table
CREATE TABLE items (
    id INTEGER PRIMARY KEY,
    name TEXT,
    price REAL,
    created_at DATETIME
);

-- Carts table
CREATE TABLE carts (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    created_at DATETIME
);

-- Cart items table
CREATE TABLE cart_items (
    id INTEGER PRIMARY KEY,
    cart_id INTEGER,
    item_id INTEGER,
    price REAL,
    quantity INTEGER
);

-- Orders table
CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    cart_id INTEGER,
    user_id INTEGER,
    total REAL,
    status TEXT,
    created_at DATETIME
);
```

### Seeded Data

The application seeds the following data on first run:

**Users:**

- Admin: `admin` / `admin123`
- User: `user` / `user123`

**Products:**

- Laptop - $999.99
- Phone - $499.99
- Headphones - $199.99
- Smartwatch - $299.99
- Tablet - $399.99
- Camera - $599.99
- Speaker - $149.99
- Monitor - $249.99

**Sample Cart:**

- 1 Laptop
- 2 Phones

**Sample Order:**

- Order with 1 Laptop and 2 Phones (total: $1,998.97)

## 🎨 UI Components

### Button Variants

| Class            | Purpose                                  |
| ---------------- | ---------------------------------------- |
| `.btn-primary`   | Main actions (login, register)           |
| `.btn-success`   | Positive actions (add to cart, checkout) |
| `.btn-secondary` | Secondary actions (cancel, close)        |
| `.btn-danger`    | Destructive actions                      |

### Color Scheme

- Primary: `#4f46e5` (Indigo)
- Success: `#10b981` (Green)
- Secondary: `#64748b` (Slate)
- Danger: `#ef4444` (Red)
- Background: `#f8fafc` (Light slate)

## 📝 Scripts

### Frontend

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend

```bash
go run main.go   # Start server
go build        # Build binary
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Go](https://go.dev/)
- [Gin Web Framework](https://gin-gonic.com/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [GORM](https://gorm.io/)
