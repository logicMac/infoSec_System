<?php
// ==============================================
// Authentication Middleware
// Include this at the top of protected pages
// ==============================================

require_once __DIR__ . '/security.php';

initSecureSession();

// Validate session
if (!validateSession()) {
    session_unset();
    session_destroy();
    header('Location: /public/login.php?session_expired=1');
    exit;
}

// Regenerate session ID periodically (every 30 minutes)
if (!isset($_SESSION['last_regeneration'])) {
    $_SESSION['last_regeneration'] = time();
} elseif (time() - $_SESSION['last_regeneration'] > 1800) {
    regenerateSession();
    $_SESSION['last_regeneration'] = time();
}
?>
