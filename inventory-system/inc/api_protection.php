<?php
// ==============================================
// API Protection - Rate Limiting & Security
// ==============================================

require_once __DIR__ . '/security.php';

/**
 * API Rate Limiter with configurable limits per endpoint
 */
class APIRateLimiter {
    private $limits = [
        'default' => ['requests' => 60, 'window' => 60],      // 60 requests per minute
        'login' => ['requests' => 5, 'window' => 300],        // 5 requests per 5 minutes
        'register' => ['requests' => 3, 'window' => 600],     // 3 requests per 10 minutes
        'otp' => ['requests' => 5, 'window' => 300],          // 5 requests per 5 minutes
        'sensitive' => ['requests' => 10, 'window' => 60],    // 10 requests per minute
        'read' => ['requests' => 100, 'window' => 60],        // 100 requests per minute
        'write' => ['requests' => 30, 'window' => 60],        // 30 requests per minute
    ];
    
    /**
     * Check if request is within rate limit
     */
    public function checkLimit($endpoint, $customLimit = null) {
        $ip = $this->getClientIP();
        $key = "api_rate_{$endpoint}_{$ip}";
        
        // Use custom limit or get from predefined limits
        $limit = $customLimit ?? ($this->limits[$endpoint] ?? $this->limits['default']);
        
        if (!isset($_SESSION[$key])) {
            $_SESSION[$key] = [
                'count' => 1,
                'reset_time' => time() + $limit['window']
            ];
            return ['allowed' => true, 'remaining' => $limit['requests'] - 1];
        }
        
        $data = $_SESSION[$key];
        
        // Reset if window has passed
        if (time() >= $data['reset_time']) {
            $_SESSION[$key] = [
                'count' => 1,
                'reset_time' => time() + $limit['window']
            ];
            return ['allowed' => true, 'remaining' => $limit['requests'] - 1];
        }
        
        // Check if limit exceeded
        if ($data['count'] >= $limit['requests']) {
            $retryAfter = $data['reset_time'] - time();
            return [
                'allowed' => false,
                'remaining' => 0,
                'retry_after' => $retryAfter,
                'message' => "Rate limit exceeded. Try again in {$retryAfter} seconds."
            ];
        }
        
        // Increment count
        $_SESSION[$key]['count']++;
        
        return [
            'allowed' => true,
            'remaining' => $limit['requests'] - $_SESSION[$key]['count']
        ];
    }
    
    /**
     * Get client IP address
     */
    private function getClientIP() {
        $ip = $_SERVER['REMOTE_ADDR'];
        
        // Check for proxy headers
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
        }
        
        return $ip;
    }
    
    /**
     * Send rate limit headers
     */
    public function sendHeaders($result, $limit) {
        header("X-RateLimit-Limit: {$limit['requests']}");
        header("X-RateLimit-Remaining: {$result['remaining']}");
        
        if (!$result['allowed']) {
            header("X-RateLimit-Reset: " . (time() + $result['retry_after']));
            header("Retry-After: {$result['retry_after']}");
        }
    }
}

/**
 * Secure API endpoint wrapper
 */
function secureAPIEndpoint($endpoint, $allowedMethods = ['GET', 'POST'], $requireAuth = true, $rateLimitType = 'default') {
    initSecureSession();
    
    // Check HTTP method
    if (!in_array($_SERVER['REQUEST_METHOD'], $allowedMethods)) {
        http_response_code(405);
        header('Allow: ' . implode(', ', $allowedMethods));
        die(json_encode(['error' => 'Method not allowed']));
    }
    
    // Check authentication
    if ($requireAuth && !validateSession()) {
        http_response_code(401);
        die(json_encode(['error' => 'Unauthorized']));
    }
    
    // Check CSRF for state-changing methods
    if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'DELETE', 'PATCH'])) {
        if (!validateCSRFToken()) {
            http_response_code(403);
            die(json_encode(['error' => 'Invalid CSRF token']));
        }
    }
    
    // Rate limiting
    $rateLimiter = new APIRateLimiter();
    $result = $rateLimiter->checkLimit($endpoint);
    
    if (!$result['allowed']) {
        http_response_code(429);
        header("Retry-After: {$result['retry_after']}");
        die(json_encode([
            'error' => 'Too many requests',
            'message' => $result['message'],
            'retry_after' => $result['retry_after']
        ]));
    }
    
    return true;
}

/**
 * Validate API request origin
 */
function validateOrigin() {
    $allowedOrigins = [
        $_SERVER['HTTP_HOST'],
        'localhost',
        '127.0.0.1'
    ];
    
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        $origin = parse_url($_SERVER['HTTP_ORIGIN'], PHP_URL_HOST);
        if (!in_array($origin, $allowedOrigins)) {
            http_response_code(403);
            die(json_encode(['error' => 'Invalid origin']));
        }
    }
}

/**
 * Sanitize API input
 */
function sanitizeAPIInput($data) {
    if (is_array($data)) {
        return array_map('sanitizeAPIInput', $data);
    }
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

/**
 * Send JSON response with security headers
 */
function sendJSONResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 1; mode=block');
    echo json_encode($data);
    exit;
}
?>
