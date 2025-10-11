# 📧 Email Service Configuration Guide

## ✅ **Smart Email Service with Multiple Options**

### **How It Works:**
The email service now has **3 configuration options** that work automatically:

1. **🥇 Gmail SMTP** (Real emails to actual addresses)
2. **🥈 Ethereal Email** (Fake SMTP for testing)  
3. **🥉 Custom SMTP** (Production servers)

### **Priority Order:**
The system automatically chooses the best available option based on your configuration.

## 🔧 **Step 1: Enable Gmail App Password**

1. **Go to your Google Account settings**
2. **Security** → **2-Step Verification** (enable if not already)
3. **App passwords** → **Generate app password**
4. **Select "Mail"** and **"Other"** → Enter "Ecommerce App"
5. **Copy the 16-character password** (save it securely)

## ⚙️ **Step 2: Add Environment Variables**

Create or update your `.env.local` file:

```env
# Gmail Configuration for Email Sending
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password

# Optional: Custom email settings
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME=Fave Store
```

## 🧪 **Step 3: Test Email Sending**

1. **Restart your development server**
2. **Go to `/test-email-simple`**
3. **Click "Send Real Email"**
4. **Check the console logs** for detailed information
5. **Check your email inbox** (and spam folder)

## 📧 **How It Works Now:**

### **Automatic Email Service Selection:**
1. **If Gmail credentials are set** → Uses Gmail SMTP (real emails)
2. **If no Gmail credentials** → Uses Ethereal Email (fake SMTP for testing)
3. **If SMTP_HOST is set** → Uses custom SMTP server

### **Email Flow:**
1. **Customer enters email** during checkout
2. **Payment is processed** successfully
3. **System automatically chooses** best email service
4. **Email is sent** to the actual email address they entered
5. **Real email delivery** to their inbox (if Gmail configured)

### **Console Logs:**
You'll see detailed logs like:
```
📧 Starting email send process...
📧 Email data: { customerEmail: "customer@example.com", ... }
📧 Mail options: { from: "Fave Store <noreply@favee.com>", to: "customer@example.com", ... }
✅ Order confirmation email sent successfully!
📧 Message ID: <message-id>
```

## 🔍 **Troubleshooting:**

### **If emails still don't arrive:**

1. **Check console logs** for error messages
2. **Verify Gmail credentials** are correct
3. **Check spam folder** in the recipient's email
4. **Ensure 2FA is enabled** on Gmail account
5. **Use App Password** (not regular password)

### **Common Issues:**

#### **"Invalid login" error:**
- ❌ Using regular Gmail password
- ✅ Use App Password instead

#### **"Less secure app access" error:**
- ❌ Don't enable less secure apps
- ✅ Use App Password with 2FA

#### **Emails in spam:**
- ✅ Normal for new email addresses
- ✅ Recipients should check spam folder
- ✅ Will improve with time and reputation

## 🚀 **Alternative Email Services:**

### **If you prefer other services:**

#### **Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

#### **SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

## ✅ **After Setup:**

1. **Test with `/test-email-simple`** first
2. **Complete a test checkout** with real email
3. **Check email delivery** in customer's inbox
4. **Monitor console logs** for any issues

The email system will now send real emails to the actual email addresses customers enter during checkout! 🎉
