# looom.shop - Handwoven Heritage E-commerce Platform

A modern e-commerce platform for traditional handwoven Ikkat products, built with React, TypeScript, and Supabase.

## 🚀 Features

- **Product Management**: Full CRUD operations for products with image upload
- **Admin Dashboard**: Comprehensive admin panel for managing products, orders, and customers
- **Shopping Cart**: Advanced cart functionality with size/color variants
- **Order Management**: Complete order lifecycle from creation to delivery
- **Payment Integration**: Razorpay integration for secure payments
- **User Authentication**: Secure login/signup with Supabase Auth
- **Responsive Design**: Mobile-first design with beautiful animations
- **Real-time Updates**: Live data synchronization with Supabase

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Payments**: Razorpay
- **Build Tool**: Vite

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Razorpay account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd looom-shop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Razorpay Configuration
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   VITE_RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   VITE_RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
   ```

4. **Set up Supabase**
   
   - Create a new Supabase project
   - Run the migration file `supabase/migrations/setup_products_table.sql` in your Supabase SQL editor
   - This will create the products table with sample data

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Setup

The application uses Supabase as the backend. The database schema includes:

- **products**: Main products table with all product information
- **Row Level Security (RLS)**: Enabled for secure data access
- **Policies**: Public read access, authenticated write access
- **Indexes**: Optimized for search and filtering

### Sample Data

The migration includes sample products to get you started:
- Traditional Ikkat Silk Sarees
- Cotton Ikkat Frocks  
- Dress Material Sets
- Designer Kurtas
- Handwoven Blouses
- Festive Lehenga Sets

## 🔐 Authentication

### Admin Access

Default admin credentials for demo:
- **Email**: admin@looom.shop
- **Password**: admin123

Access the admin panel at: `/admin`

### Customer Authentication

Users can sign up and log in to:
- Save addresses
- Track orders
- Manage wishlist
- View order history

## 💳 Payment Integration

The application integrates with Razorpay for secure payments:

- Multiple payment methods (UPI, Cards, Net Banking, Wallets)
- Secure payment processing
- Order confirmation and tracking
- Payment status management

## 📱 Features Overview

### Customer Features
- Browse products by category
- Advanced search and filtering
- Product details with image gallery
- Shopping cart with variants
- Secure checkout process
- Order tracking
- User profile management
- Wishlist functionality

### Admin Features
- Product management (CRUD operations)
- Bulk product upload
- Order management
- Payment tracking
- Customer management
- Analytics dashboard
- Category management
- Theme customization

## 🎨 Design System

The application features a modern design system with:

- **Color Palette**: Purple, pink, and red gradients
- **Typography**: Inter font family
- **Spacing**: 8px grid system
- **Components**: Reusable UI components
- **Animations**: Smooth micro-interactions
- **Responsive**: Mobile-first approach

## 🚀 Deployment

The application can be deployed to various platforms:

- **Netlify**: Automatic deployment from Git
- **Vercel**: Zero-config deployment
- **Supabase**: Backend hosting included

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email support@looom.shop or create an issue in the repository.