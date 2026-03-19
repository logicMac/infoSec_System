# Security Implementation Guide

## Overview
This document describes the security features implemented in the Inventory Management System.

## Features Implemented

### 1. OTP (One-Time Password) Authentication
- **Location**: `public/verify_otp.php`, `inc/security.php`
- **How it works**:
  - After successful username/password verification, a 6-digit OTP is generated
  - OTP is sent to the user's registered email
  - OTP expires after 5 minutes
  - Maximum 3 verification attempts allowed
  - OTP is hashed before storage in session

- **Testing**:
  - OTPs are logged to `logs/otp_log.txt` for development
  - In production, configure email service (PHPMailer recommended)

### 2. CSRF (Cross-Site Request Forgery) Protection
- **Location**: `inc/security.php`
- **How it works**:
  - Unique token generated per session
  - Token must be included in all POST requests
  - Token validated server-side before processing
  - Uses `hash_equals()` for timing-attack-safe comparison

- **Usage**:
  ```php
  // In forms
  <?php echo csrfField(); ?>
  
  // Manual validation
  if (!validateCSRFToken()) {
      die('Invalid CSRF token');
  }
  ```

### 3. Rate Limiting
- **Location**: `inc/security.php`, `inc/api_protection.php`
- **Limits**:
  - Login: 5 attempts per 5 minutes
  - Registration: 3 attempts per 10 minutes
  - OTP verification: 5 attempts per 5 minutes
  - API default: 60 requests per minute
  - Read operations: 100 requests per minute
  - Write operations: 30 requests per minute

- **Usage**:
  ```php
  if (!checkRateLimit('login', 5, 300)) {
      $cooldown = getRateLimitCooldown('login');
      die("Too many attempts. Try again in $cooldown seconds.");
  }
  ```

### 4. Secured Routing
- **Location**: `inc/routes_config.php`, `inc/auth_middleware.php`
- **Features**:
  - Role-based access control (Admin, Staff)
  - Automatic route protection
  - Session validation on every request
  - Automatic redirect to login for unauthorized access

- **Protected Routes**:
  - `/admin/*` - Admin only
  - `/staff/*` - Staff and Admin
  - `/public/products.php` - Authenticated users
  - `/public/categories.php` - Authenticated users
  - `/public/suppliers.php` - Authenticated users
  - `/public/sales.php` - Authenticated users
  - `/public/purchases.php` - Authenticated users
  - `/public/reports.php` - Authenticated users

### 5. Session Security
- **Features**:
  - HTTP-only cookies
  - Session regeneration after login
  - Periodic session ID regeneration (every 30 minutes)
  - Session timeout (30 minutes of inactivity)
  - Session validation on every request

### 6. API Protection
- **Location**: `inc/api_protection.php`
- **Features**:
  - Rate limiting per endpoint
  - CSRF validation for state-changing methods
  - Origin validation
  - Input sanitization
  - Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)

- **Usage**:
  ```php
  require_once '../inc/api_protection.php';
  
  // Protect endpoint
  secureAPIEndpoint('products', ['GET', 'POST'], true, 'read');
  
  // Send secure response
  sendJSONResponse(['data' => $products], 200);
  ```

## Implementation in Existing Files

### Login Page (`public/login.php`)
- Added CSRF token validation
- Added rate limiting (5 attempts per 5 minutes)
- Added OTP generation and email sending
- Redirects to OTP verification page

### Register Page (`public/register.php`)
- Added CSRF token validation
- Added rate limiting (3 attempts per 10 minutes)
- Added email validation
- Added password strength requirement (min 8 characters)
- Added duplicate email check

### Dashboard Pages
- `admin/dashboard.php` - Added `requireAdmin()` check
- `staff/dashboard.php` - Added `requireStaff()` check
- Both include `auth_middleware.php` for session validation

## Configuration

### Email Configuration
Edit `inc/security.php` function `sendOTPEmail()`:
```php
// Replace with actual email service
// Example using PHPMailer:
$mail = new PHPMailer(true);
$mail->isSMTP();
$mail->Host = 'smtp.gmail.com';
$mail->SMTPAuth = true;
$mail->Username = 'your-email@gmail.com';
$mail->Password = 'your-app-password';
$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
$mail->Port = 587;
$mail->setFrom('your-email@gmail.com', 'Inventory System');
$mail->addAddress($email, $fullName);
$mail->Subject = 'Your OTP Code';
$mail->Body = $message;
$mail->send();
```

### HTTPS Configuration
For production, enable HTTPS and update session settings in `inc/security.php`:
```php
ini_set('session.cookie_secure', 1); // Change from 0 to 1
```

### Rate Limit Customization
Edit limits in `inc/api_protection.php`:
```php
private $limits = [
    'default' => ['requests' => 60, 'window' => 60],
    'login' => ['requests' => 5, 'window' => 300],
    // Add more...
];
```

## Security Best Practices

1. **Always use HTTPS in production**
2. **Keep PHP and dependencies updated**
3. **Use environment variables for sensitive data**
4. **Enable error logging, disable error display**
5. **Regular security audits**
6. **Implement database backups**
7. **Use prepared statements (already implemented)**
8. **Validate and sanitize all user input**

## Testing

### Test OTP Flow
1. Register a new account
2. Login with credentials
3. Check `logs/otp_log.txt` for OTP code
4. Enter OTP on verification page
5. Should redirect to dashboard

### Test Rate Limiting
1. Try logging in with wrong credentials 6 times
2. Should see rate limit error after 5 attempts
3. Wait 5 minutes or clear session to reset

### Test CSRF Protection
1. Try submitting a form without CSRF token
2. Should see "Invalid security token" error

### Test Route Protection
1. Logout
2. Try accessing `/admin/dashboard.php` directly
3. Should redirect to login page
4. Login as staff user
5. Try accessing `/admin/dashboard.php`
6. Should see "Access denied" error

## Troubleshooting

### OTP not received
- Check `logs/otp_log.txt` for generated OTP
- Configure actual email service for production

### Session expires too quickly
- Increase timeout in `inc/security.php`:
  ```php
  if (time() - $_SESSION['last_activity'] > 3600) { // 1 hour instead of 30 min
  ```

### Rate limit too strict
- Adjust limits in `checkRateLimit()` calls
- Clear session to reset counters during testing

## Files Created/Modified

### New Files
- `inc/security.php` - Core security functions
- `inc/auth_middleware.php` - Authentication middleware
- `inc/api_protection.php` - API security layer
- `inc/routes_config.php` - Route protection configuration
- `public/verify_otp.php` - OTP verification page
- `logs/otp_log.txt` - OTP log file (auto-created)

### Modified Files
- `public/login.php` - Added OTP, CSRF, rate limiting
- `public/register.php` - Added CSRF, rate limiting, validation
- `admin/dashboard.php` - Added authentication check
- `staff/dashboard.php` - Added authentication check

## Next Steps

1. Configure email service for OTP delivery
2. Enable HTTPS in production
3. Set up environment variables for sensitive configuration
4. Implement additional security headers via .htaccess or web server config
5. Set up monitoring and alerting for security events
6. Regular security audits and penetration testing
