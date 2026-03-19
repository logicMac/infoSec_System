# Security Features - Quick Start Guide

## 🚀 What's Been Added

Your inventory management system now has enterprise-grade security:

1. ✅ **OTP Authentication** - Two-factor authentication via email
2. ✅ **CSRF Protection** - Prevents cross-site request forgery attacks
3. ✅ **Rate Limiting** - Prevents brute force and DDoS attacks
4. ✅ **Secured Routing** - Role-based access control
5. ✅ **Session Security** - Automatic timeout and regeneration
6. ✅ **API Protection** - Secure API endpoints with rate limiting

## 🔧 Quick Setup

### 1. Test the System

1. **Start your server** (XAMPP, WAMP, etc.)

2. **Access the application**:
   ```
   http://localhost/your-project/public/login.php
   ```

3. **Test login flow**:
   - Enter username and password
   - System generates OTP
   - Check `logs/otp_log.txt` for the OTP code
   - Enter OTP on verification page
   - Access granted!

### 2. Configure Email (Production)

For production, you need to send real emails. Install PHPMailer:

```bash
composer require phpmailer/phpmailer
```

Then edit `inc/security.php`, function `sendOTPEmail()`:

```php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

function sendOTPEmail($email, $otp, $fullName) {
    $mail = new PHPMailer(true);
    
    try {
        // SMTP Configuration
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'your-email@gmail.com';
        $mail->Password = 'your-app-password';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        
        // Email content
        $mail->setFrom('your-email@gmail.com', 'Inventory System');
        $mail->addAddress($email, $fullName);
        $mail->Subject = 'Your OTP Code';
        $mail->Body = "Hello {$fullName},\n\nYour OTP code is: {$otp}\n\nThis code will expire in 5 minutes.";
        
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email error: {$mail->ErrorInfo}");
        return false;
    }
}
```

### 3. Enable HTTPS (Production)

1. Get SSL certificate (Let's Encrypt is free)
2. Configure your web server for HTTPS
3. Update `inc/security.php`:
   ```php
   ini_set('session.cookie_secure', 1); // Change from 0 to 1
   ```
4. Uncomment HTTPS redirect in `.htaccess`:
   ```apache
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

## 📋 How It Works

### Login Flow
```
User enters credentials
    ↓
System validates username/password
    ↓
OTP generated and sent to email
    ↓
User enters OTP
    ↓
OTP validated (max 3 attempts, 5 min expiry)
    ↓
Session created with security features
    ↓
User redirected to dashboard
```

### CSRF Protection
Every form now includes a hidden CSRF token:
```php
<form method="POST">
    <?php echo csrfField(); ?>
    <!-- form fields -->
</form>
```

### Rate Limiting
Automatic protection against abuse:
- Login: 5 attempts per 5 minutes
- Registration: 3 attempts per 10 minutes
- OTP: 5 attempts per 5 minutes
- API: 60 requests per minute

### Route Protection
Pages automatically check authentication:
```php
// Admin pages
require_once '../inc/auth_middleware.php';
requireAdmin();

// Staff pages
require_once '../inc/auth_middleware.php';
requireStaff();
```

## 🧪 Testing

### Test OTP Flow
```bash
# 1. Register new account
http://localhost/your-project/public/register.php

# 2. Login
http://localhost/your-project/public/login.php

# 3. Check OTP
cat logs/otp_log.txt

# 4. Enter OTP
# Use the code from the log file
```

### Test Rate Limiting
```bash
# Try logging in 6 times with wrong password
# After 5 attempts, you'll see:
# "Too many login attempts. Please try again in X minutes."
```

### Test CSRF Protection
```bash
# Try submitting a form without CSRF token
# You'll see: "Invalid security token"
```

### Test Route Protection
```bash
# 1. Logout
# 2. Try accessing: http://localhost/your-project/admin/dashboard.php
# Result: Redirected to login
# 3. Login as staff
# 4. Try accessing admin dashboard
# Result: "Access denied. Insufficient permissions."
```

## 🔐 Security Checklist

### Development
- [x] OTP authentication implemented
- [x] CSRF protection on all forms
- [x] Rate limiting configured
- [x] Route protection active
- [x] Session security enabled
- [x] Input validation added

### Before Production
- [ ] Configure real email service
- [ ] Enable HTTPS
- [ ] Update session.cookie_secure to 1
- [ ] Set strong database passwords
- [ ] Disable error display
- [ ] Enable error logging
- [ ] Set up database backups
- [ ] Review and adjust rate limits
- [ ] Test all security features
- [ ] Perform security audit

## 📁 New Files

```
inc/
├── security.php              # Core security functions
├── auth_middleware.php       # Authentication middleware
├── api_protection.php        # API security layer
└── routes_config.php         # Route protection config

public/
├── verify_otp.php           # OTP verification page
└── api_example.php          # Secure API example

logs/
└── otp_log.txt              # OTP log (development only)

.htaccess                     # Web server security
SECURITY_IMPLEMENTATION.md    # Detailed documentation
SECURITY_QUICKSTART.md        # This file
```

## 🛠️ Customization

### Adjust Rate Limits
Edit `inc/security.php`:
```php
function checkRateLimit($action, $maxAttempts = 5, $timeWindow = 300) {
    // Change maxAttempts and timeWindow as needed
}
```

### Add New Protected Routes
Edit `inc/routes_config.php`:
```php
$protectedRoutes = [
    'admin' => [
        'role' => 'admin',
        'paths' => [
            '/admin/dashboard.php',
            '/admin/new-page.php',  // Add here
        ]
    ],
];
```

### Create Secure API Endpoint
```php
require_once '../inc/api_protection.php';

secureAPIEndpoint('my_endpoint', ['GET', 'POST'], true, 'read');

// Your API logic here

sendJSONResponse(['data' => $result], 200);
```

## 🆘 Troubleshooting

### OTP not working
- Check `logs/otp_log.txt` for generated codes
- Verify email configuration
- Check PHP error logs

### Rate limit too strict
- Clear browser cookies
- Adjust limits in `inc/security.php`
- Wait for cooldown period

### Session expires quickly
- Increase timeout in `inc/security.php`:
  ```php
  if (time() - $_SESSION['last_activity'] > 3600) { // 1 hour
  ```

### CSRF errors
- Ensure forms include `<?php echo csrfField(); ?>`
- Check session is started
- Clear browser cache

## 📚 Additional Resources

- Full documentation: `SECURITY_IMPLEMENTATION.md`
- API example: `public/api_example.php`
- Security functions: `inc/security.php`

## 🎯 Next Steps

1. Test all features in development
2. Configure email service
3. Set up HTTPS
4. Perform security audit
5. Deploy to production
6. Monitor logs regularly

---

**Need Help?** Check `SECURITY_IMPLEMENTATION.md` for detailed documentation.
