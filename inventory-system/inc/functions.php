<?php
// ✅ Global helper functions

function e($string) {
    return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
}

function redirect($url) {
    if (!headers_sent()) {
        header("Location: " . $url);
        exit;
    } else {
        echo "<script>window.location.href='$url';</script>";
        exit;
    }
}

function formatMoney($amount) {
    return number_format($amount, 2);
}
?>
