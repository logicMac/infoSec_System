<?php
// ==============================================
// Database Connection File
// ==============================================

// Database credentials — update if needed
$host = "localhost";
$dbname = "inventory_db";   // ✅ must match your database name
$username = "root";         // default XAMPP username
$password = "";             // default XAMPP password is empty

try {
    // Create PDO connection
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);

    // Set PDO error mode to Exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>
