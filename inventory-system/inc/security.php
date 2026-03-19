<?php
// ==============================================
// Security Functions - CSRF, Rate Limiting, OTP
// ==============================================

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// ==============================================
// CSRF TOKEN FUNCTIONS
// ==============================================

/**
 * Generate CSRF token and store in session
 */
function generateCSRFToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Validate CSRF token from POST request
 */
function validateCSRFToken() {
    if (!isset($_POST['csrf_token']) || !isset($_SESSION['csrf_token'])) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $_POST['csrf_token']);
}

/**
 * Output CSRF token as hidden input field
 */
function csrfField() {
    $token = generateCSRFToken();
    return '<input type="hidden" name="csrf_token" value="' . htmlspecialchars($token, ENT_QUOTES, 'UTF-8') . '">';
}

// ==============================================
// RATE LIMITING FUNCTIONS
// ==============================================

/**
 * Check rate limit for specific action
 * @param string $action - Action identifier (e.g., 'login', 'register', 'otp')
 * @param int $maxAttempts - Maximum attempts allowed
 * @param int $timeWindow - Time window in seconds
 * @return bool - True if within limit, false if exceeded
 */
function checkRateLimit($action, $maxAttempts = 5, $timeWindow = 300) {
    $ip = $_SERVER['REMOTE_ADDR'];
    $key = "rate_limit_{$action}_{$ip}";
    
    if (!isset($_SESSION[$key])) {
        $_SESSION[$key] = [
            'attempts' => 0,
            'first_attempt' => time()
        ];
    }
    
    $data = $_SESSION[$key];
    $currentTime = time();
    
    // Reset if time window has passed
    if ($currentTime - $data['first_attempt'] > $timeWindow) {
        $_SESSION[$key] = [
            'attempts' => 1,
            'first_attempt' => $currentTime
        ];
        return true;
    }
    
    // Check if limit exceeded
    if ($data['attempts'] >= $maxAttempts) {
        return false;
    }
    
    // Increment attempts
    $_SESSION[$key]['attempts']++;
    return true;
}

/**
 * Get remaining time for rate limit cooldown
 */
function getRateLimitCooldown($action) {
    $ip = $_SERVER['REMOTE_ADDR'];
    $key = "rate_limit_{$action}_{$ip}";
    
    if (!isset($_SESSION[$key])) {
        return 0;
    }
    
    $data = $_SESSION[$key];
    $elapsed = time() - $data['first_attempt'];
    $remaining = 300 - $elapsed; // 5 minutes default
    
    return max(0, $remaining);
}

// ==============================================
// OTP FUNCTIONS
// ==============================================

/**
 * Generate 6-digit OTP
 */
function generateOTP() {
    return str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
}

/**
 * Store OTP in session with expiration
 */
function storeOTP($userId, $otp) {
    $_SESSION['otp_data'] = [
        'user_id' => $userId,
        'otp' => password_hash($otp, PASSWORD_DEFAULT),
        'expires_at' => time() + 300, // 5 minutes
        'attempts' => 0
    ];
}

/**
 * Verify OTP
 */
function verifyOTP($otp) {
    if (!isset($_SESSION['otp_data'])) {
        return ['success' => false, 'message' => 'No OTP session found.'];
    }
    
    $otpData = $_SESSION['otp_data'];
    
    // Check expiration
    if (time() > $otpData['expires_at']) {
        unset($_SESSION['otp_data']);
        return ['success' => false, 'message' => 'OTP has expired. Please request a new one.'];
    }
    
    // Check max attempts
    if ($otpData['attempts'] >= 3) {
        unset($_SESSION['otp_data']);
        return ['success' => false, 'message' => 'Too many failed attempts. Please request a new OTP.'];
    }
    
    // Verify OTP
    if (password_verify($otp, $otpData['otp'])) {
        $userId = $otpData['user_id'];
        unset($_SESSION['otp_data']);
        return ['success' => true, 'user_id' => $userId];
    }
    
    // Increment attempts
    $_SESSION['otp_data']['attempts']++;
    return ['success' => false, 'message' => 'Invalid OTP. Please try again.'];
}

/**
 * Send OTP via email (simulated - replace with actual email service)
 */
function sendOTPEmail($email, $otp, $fullName) {
    // In production, use PHPMailer or similar
    // For now, we'll log it to a file for testing
    $message = "Hello {$fullName},\n\nYour OTP code is: {$otp}\n\nThis code will expire in 5 minutes.\n\nIf you didn't request this, please ignore this message.";
    
    // Simulate email sending (in production, use mail() or PHPMailer)
    error_log("OTP Email to {$email}: {$otp}");
    
    // For development, you can also write to a file
    $logFile = __DIR__ . '/../logs/otp_log.txt';
    $logDir = dirname($logFile);
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Email: {$email}, OTP: {$otp}\n", FILE_APPEND);
    
    return true;
}

// ==============================================
// ROUTE PROTECTION FUNCTIONS
// ==============================================

/**
 * Check if user is authenticated
 */
function requireAuth() {
    if (!isset($_SESSION['user_id'])) {
        header('Location: /public/login.php');
        exit;
    }
}

/**
 * Check if user has specific role
 */
function requireRole($role) {
    requireAuth();
    if ($_SESSION['role'] !== $role) {
        http_response_code(403);
        die('Access denied. Insufficient permissions.');
    }
}

/**
 * Check if user is admin
 */
function requireAdmin() {
    requireRole('admin');
}

/**
 * Check if user is staff or admin
 */
function requireStaff() {
    requireAuth();
    if (!in_array($_SESSION['role'], ['admin', 'staff'])) {
        http_response_code(403);
        die('Access denied. Insufficient permissions.');
    }
}

/**
 * Validate allowed HTTP methods
 */
function requireMethod($methods) {
    if (!is_array($methods)) {
        $methods = [$methods];
    }
    
    if (!in_array($_SERVER['REQUEST_METHOD'], $methods)) {
        http_response_code(405);
        die('Method not allowed.');
    }
}

/**
 * Prevent direct file access
 */
function preventDirectAccess() {
    if (!isset($_SERVER['HTTP_REFERER']) || empty($_SERVER['HTTP_REFERER'])) {
        // Allow if coming from same domain
        $currentDomain = $_SERVER['HTTP_HOST'];
        if (isset($_SERVER['HTTP_REFERER'])) {
            $refererDomain = parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST);
            if ($refererDomain !== $currentDomain) {
                http_response_code(403);
                die('Direct access not allowed.');
            }
        }
    }
}

// ==============================================
// SESSION SECURITY
// ==============================================

/**
 * Regenerate session ID to prevent session fixation
 */
function regenerateSession() {
    if (session_status() === PHP_SESSION_ACTIVE) {
        session_regenerate_id(true);
    }
}

/**
 * Validate session integrity
 */
function validateSession() {
    if (!isset($_SESSION['user_id'])) {
        return false;
    }
    
    // Check session timeout (30 minutes)
    if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > 1800)) {
        session_unset();
        session_destroy();
        return false;
    }
    
    $_SESSION['last_activity'] = time();
    return true;
}

/**
 * Secure session initialization
 */
function initSecureSession() {
    if (session_status() === PHP_SESSION_NONE) {
        ini_set('session.cookie_httponly', 1);
        ini_set('session.use_only_cookies', 1);
        ini_set('session.cookie_secure', 0); // Set to 1 if using HTTPS
        session_start();
    }
}
?>
