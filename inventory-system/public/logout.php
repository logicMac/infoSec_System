<?php
require_once '../inc/security.php';
require_once '../inc/functions.php';

initSecureSession();

// Clear all session data
$_SESSION = array();

// Delete session cookie
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 3600, '/');
}

// Destroy session
session_unset();
session_destroy();

// Redirect to login
redirect('login.php?logged_out=1');
?>
