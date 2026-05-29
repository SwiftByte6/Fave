# 🛍️ Ecommerce Application

A modern ecommerce application built with Next.js, featuring user authentication, payment processing, and email notifications.

## ✨ Features

- **🔐 User Authentication** - Clerk integration for secure login/signup
- **💳 Payment Processing** - Razorpay integration for secure payments
- **📧 Email Notifications** - Automatic order confirmation emails
- **🛒 Shopping Cart** - Redux-powered cart management
- **📱 Responsive Design** - Mobile-first responsive UI
- **🎨 Modern UI** - Beautiful design with Tailwind CSS

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create `.env.local` file with:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Razorpay Payment
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Email Service (Optional - for real emails)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME=Your Store Name
```

### 3. Run Development Server
```bash
npm run dev
```

## 📧 Email Configuration

The application automatically sends order confirmation emails after successful checkout.

### Email Service Options:
1. **Gmail SMTP** (Real emails) - Set `GMAIL_USER` and `GMAIL_APP_PASSWORD`
2. **Ethereal Email** (Testing) - Works automatically for development
3. **Custom SMTP** (Production) - Set `SMTP_HOST`, `SMTP_USER`, etc.

### Gmail Setup:
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password (Security → App passwords)
3. Add credentials to `.env.local`

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: Supabase
- **Payments**: Razorpay
- **Email**: Nodemailer
- **State Management**: Redux Toolkit
- **Icons**: Lucide React, React Icons

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── checkout/          # Checkout page
│   ├── orders/            # Order management
│   └── ...
├── component/             # Reusable components
├── lib/                   # Utility functions
├── Redux/                 # State management
└── public/                # Static assets
```

## 🎯 Key Features

### Authentication
- Secure user registration and login
- Protected routes and API endpoints
- User session management

### Shopping Experience
- Product browsing and search
- Add to cart functionality
- Responsive product pages

### Checkout & Payments
- Secure checkout process
- Multiple payment methods via Razorpay
- Order confirmation and tracking
- Automatic email notifications

### Admin Features
- Order management
- Product management
- User management

## 🚀 Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to Vercel** (recommended):
   ```bash
   npx vercel
   ```

3. **Set environment variables** in your deployment platform

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

Built with ❤️ using Next.js and modern web technologies.