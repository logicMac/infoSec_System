<?php
// ==============================================
// Secure Routes Configuration
// ==============================================

/**
 * Define protected routes and their access requirements
 */
$protectedRoutes = [
    // Admin-only routes
    'admin' => [
        'role' => 'admin',
        'paths' => [
            '/admin/dashboard.php',
            '/admin/*'
        ]
    ],
    
    // Staff and Admin routes
    'staff' => [
        'role' => ['staff', 'admin'],
        'paths' => [
            '/staff/dashboard.php',
            '/staff/*',
            '/public/products.php',
            '/public/categories.php',
            '/public/suppliers.php',
            '/public/sales.php',
            '/public/purchases.php',
            '/public/reports.php',
            '/public/export_pdf.php'
        ]
    ],
    
    // Public routes (no authentication required)
    'public' => [
        'role' => null,
        'paths' => [
            '/public/login.php',
            '/public/register.php',
            '/public/verify_otp.php',
            '/public/logout.php'
        ]
    ]
];

/**
 * Rate limit configuration per route type
 */
$routeRateLimits = [
    'auth' => ['requests' => 5, 'window' => 300],        // Login, register, OTP
    'read' => ['requests' => 100, 'window' => 60],       // GET requests
    'write' => ['requests' => 30, 'window' => 60],       // POST, PUT, DELETE
    'export' => ['requests' => 10, 'window' => 60],      // PDF exports
    'api' => ['requests' => 60, 'window' => 60]          // API endpoints
];

/**
 * Check if current route requires authentication
 */
function checkRouteAccess() {
    global $protectedRoutes;
    
    $currentPath = $_SERVER['PHP_SELF'];
    $isProtected = false;
    $requiredRole = null;
    
    foreach ($protectedRoutes as $group => $config) {
        foreach ($config['paths'] as $path) {
            // Convert wildcard to regex
            $pattern = str_replace('*', '.*', $path);
            $pattern = '#^' . $pattern . '$#';
            
            if (preg_match($pattern, $currentPath)) {
                if ($config['role'] !== null) {
                    $isProtected = true;
                    $requiredRole = $config['role'];
                }
                break 2;
            }
        }
    }
    
    if ($isProtected) {
        require_once __DIR__ . '/security.php';
        initSecureSession();
        
        if (!validateSession()) {
            header('Location: /public/login.php?redirect=' . urlencode($currentPath));
            exit;
        }
        
        // Check role
        if (is_array($requiredRole)) {
            if (!in_array($_SESSION['role'], $requiredRole)) {
                http_response_code(403);
                die('Access denied. Insufficient permissions.');
            }
        } else {
            if ($_SESSION['role'] !== $requiredRole) {
                http_response_code(403);
                die('Access denied. Insufficient permissions.');
            }
        }
    }
}

/**
 * Get rate limit for current route
 */
function getRouteRateLimit() {
    global $routeRateLimits;
    
    $currentPath = $_SERVER['PHP_SELF'];
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Determine rate limit type
    if (strpos($currentPath, 'login') !== false || 
        strpos($currentPath, 'register') !== false || 
        strpos($currentPath, 'otp') !== false) {
        return $routeRateLimits['auth'];
    }
    
    if (strpos($currentPath, 'export') !== false || 
        strpos($currentPath, 'pdf') !== false) {
        return $routeRateLimits['export'];
    }
    
    if (strpos($currentPath, 'api') !== false) {
        return $routeRateLimits['api'];
    }
    
    if ($method === 'GET') {
        return $routeRateLimits['read'];
    }
    
    return $routeRateLimits['write'];
}
?>
