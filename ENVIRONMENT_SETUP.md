# 🔧 Environment Variables Setup Guide

## Create `.env.local` file in your project root:

```env
# 🔐 CLERK AUTHENTICATION (REQUIRED)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here

# 🗄️ SUPABASE DATABASE (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# 💳 RAZORPAY PAYMENT (REQUIRED)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret_here

# 📧 EMAIL SERVICE (REQUIRED)
RESEND_API_KEY=re_your_resend_api_key_here
```

## 🎯 **Why Clerk + Supabase + Razorpay?**

### **Perfect Architecture for Ecommerce:**

1. **Clerk** = User Authentication (Login, Signup, Sessions)
2. **Supabase** = Database (Orders, Products, Cart Storage)  
3. **Razorpay** = Payment Processing (Secure Payments)

### **This is NOT using Supabase Auth!**

- ❌ **NOT** using Supabase authentication
- ✅ **USING** Clerk for authentication
- ✅ **USING** Supabase only for database storage

## 🚀 **Setup Steps:**

### 1. **Clerk Setup** (Authentication)
- Go to [Clerk Dashboard](https://dashboard.clerk.com/)
- Create new application
- Copy Publishable Key and Secret Key

### 2. **Supabase Setup** (Database)
- Go to [Supabase Dashboard](https://supabase.com/dashboard)
- Create new project
- Copy URL, Anon Key, and Service Role Key

### 3. **Razorpay Setup** (Payments)
- Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
- Create account and get API keys
- Copy Key ID and Key Secret

### 4. **Resend Setup** (Email Service)
- Go to [Resend Dashboard](https://resend.com/)
- Create account and get API key
- Copy API key for email notifications

## 🔍 **Current Error Fix:**

The error you're seeing:
```
Error: `key_id` or `oauthToken` is mandatory
```

This means your Razorpay environment variables are not set. Add them to `.env.local` and restart the server.

## ✅ **After Setup:**

1. Create `.env.local` with all variables
2. Restart development server: `npm run dev`
3. Test at `/test-payment` page
4. Verify all environment variables are loaded

## 🎉 **Benefits of This Architecture:**

- **Clerk**: Best-in-class authentication UX
- **Supabase**: Powerful database with real-time features
- **Razorpay**: Secure payment processing
- **Resend**: Reliable email delivery service
- **Separation**: Each service does what it's best at

