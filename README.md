# ShopModern - OMS Microservices Frontend

ShopModern is a high-end E-commerce frontend application designed to integrate seamlessly with an **OMS (Order Management System) Microservices** architecture. The project focuses on a smooth user experience, premium design, and real-time data synchronization across independent backend services.

## Key Features

### 1. User Management (Identity & Profile)
*   **Sign Up & Sign In**: Integrated with JWT Authentication.
*   **Profile Management**: Update personal information and avatars.
*   **Address Book**: Manage multiple shipping addresses with default settings.

### 2. Shopping & Products (Product & Inventory)
*   **Product Catalog**: Browse products with full pagination support.
*   **Search & Filter**: Search by name and filter by categories (Electronics, Fashion, etc.).
*   **Product Details**: Detailed view with image galleries and product attributes.
*   **Real-time Inventory**: Live stock checking before order placement.

### 3. Cart & Checkout (Order & Payment)
*   **Cart System**: Manage items, update quantities, and live price calculation.
*   **Multi-step Checkout**: Smooth flow through Shipping Address -> Shipping Method -> Payment.
*   **Payment Options**: Support for COD, Credit Cards, and E-Wallets (Simulated).
*   **Order Tracking**: **Polling system** for real-time status updates (Saga pattern).
*   **Order History**: Comprehensive list of all past orders and transaction details.

## Tech Stack

*   **Core**: React 19 + Vite
*   **Styling**: Tailwind CSS
*   **State Management**: React Context API (Auth, Cart)
*   **API Client**: Axios (with Request/Response Interceptors)
*   **Icons**: Google Material Symbols
*   **Design**: Modern Premium UI/UX

## Microservices Integration

The application connects to the API Gateway at `http://localhost:8888` and orchestrates data across the following services:
*   **Identity Service**: `/api/v1/auth/*`
*   **Profile Service**: `/api/v1/customers/*`
*   **Product Service**: `/api/v1/products/*`
*   **Inventory Service**: `/api/v1/inventory/*`
*   **Order Service**: `/api/v1/orders/*`
*   **Payment Service**: `/api/v1/payment/*`

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run in Development mode**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

---
*Developed by Phan Huu Loc.*
