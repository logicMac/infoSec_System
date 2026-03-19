<?php
// 🛡 Prevent "headers already sent" warnings
ob_start();

require_once __DIR__ . '/../db/db_connect.php';
require_once __DIR__ . '/functions.php';

if (session_status() === PHP_SESSION_NONE) session_start();

// ✅ Authentication check BEFORE HTML
if (!isset($_SESSION['user_id'])) {
    header('Location: ../public/login.php');
    exit;
}

$role = $_SESSION['role'] ?? 'staff';
$username = $_SESSION['username'] ?? 'User';
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Inventory Management System</title>

<link rel="stylesheet" href="../assets/css/style.css">
<script defer src="../assets/js/main.js"></script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Poppins', sans-serif;
  background:#f1f5f9;
  color:#1e293b;
  display:flex;
  min-height:100vh;
  overflow-x:hidden;
}
/* ===== Page Title & Welcome ===== */
.page-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.05);
  letter-spacing: 0.3px;
  transition: color 0.3s ease;
}
.page-title:hover {
  color: #2563eb;
}

.welcome-text {
  font-size: 0.95rem;
  color: #475569;
  font-weight: 500;
}

.sidebar {
  width:260px;
  background: linear-gradient(180deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%);
  color:#fff;
  display:flex;
  flex-direction:column;
  position:fixed;
  inset:0 auto 0 0;
  height:100vh;
  overflow-y:auto;
  z-index:1001;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
  font-family: 'Poppins', sans-serif;
}

.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.sidebar-header {
  padding: 24px 16px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.2);
}

.sidebar-header h2 {
  font-size: 1.35rem;
  font-weight: 800;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 0;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.sidebar-menu {
  padding: 20px 12px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.sidebar-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.sidebar-menu li {
  margin-bottom: 0;
}

.sidebar-menu a {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #e2e8f0;
  padding: 12px 16px;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  font-size: 0.95rem;
  position: relative;
  overflow: hidden;
}

.sidebar-menu a::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: #facc15;
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.3s ease;
}

.sidebar-menu a:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  transform: translateX(4px);
}

.sidebar-menu a:hover::before {
  transform: scaleY(1);
}

.sidebar-menu a.active {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.sidebar-menu a.active::before {
  transform: scaleY(1);
}

.sidebar-footer {
  padding: 20px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  background: rgba(0, 0, 0, 0.15);
}

.sidebar-footer .user-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 800;
  color: #fff;
  font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.sidebar-footer .user-role {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.sidebar-footer a {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.9) 0%, rgba(185, 28, 28, 0.9) 100%);
  color: #fff;
  padding: 12px 16px;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  text-align: center;
  font-weight: 700;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.sidebar-footer a:hover {
  background: linear-gradient(135deg, rgba(185, 28, 28, 1) 0%, rgba(153, 27, 27, 1) 100%);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(220, 38, 38, 0.5);
}

.page-wrapper {
  margin-left:260px;
  width:calc(100% - 260px);
  min-height:100vh;
  padding-top:80px;
}
.main-header {
  position:fixed;
  top:0; left:250px; right:0;
  height:60px;
  background:#ffffff;
  border-bottom:1px solid #e2e8f0;
  box-shadow:0 2px 8px rgba(0,0,0,.05);
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:0 25px;
}
@media(max-width:768px){
  .sidebar { width:220px; }
  .page-wrapper { margin-left:0; width:100%; }
  .main-header { left:0; }
}
</style>
</head>
<body>
<aside class="sidebar">
  <div>
    <div class="sidebar-header"><h2>📦 Inventory System</h2></div>
    <div class="sidebar-menu">
      <ul>
        <li><a href="<?= $role==='admin'?'../admin/dashboard.php':'../staff/dashboard.php' ?>" class="<?=basename($_SERVER['PHP_SELF'])=='dashboard.php'?'active':''?>">🏠 Dashboard</a></li>
        <li><a href="../public/products.php" class="<?=basename($_SERVER['PHP_SELF'])=='products.php'?'active':''?>">📦 Products</a></li>
        <li><a href="../public/categories.php" class="<?=basename($_SERVER['PHP_SELF'])=='categories.php'?'active':''?>">📂 Categories</a></li>
        <li><a href="../public/suppliers.php" class="<?=basename($_SERVER['PHP_SELF'])=='suppliers.php'?'active':''?>">🚚 Suppliers</a></li>
        <li><a href="../public/purchases.php" class="<?=basename($_SERVER['PHP_SELF'])=='purchases.php'?'active':''?>">🛒 Purchases</a></li>
        <li><a href="../public/sales.php" class="<?=basename($_SERVER['PHP_SELF'])=='sales.php'?'active':''?>">💰 Sales</a></li>
        <?php if ($role === 'admin'): ?>
          <li><a href="../public/reports.php" class="<?=basename($_SERVER['PHP_SELF'])=='reports.php'?'active':''?>">📊 Reports</a></li>
          <li><a href="../public/users.php" class="<?=basename($_SERVER['PHP_SELF'])=='users.php'?'active':''?>">👥 Manage Users</a></li>
        <?php endif; ?>
      </ul>
    </div>
  </div>
  <div class="sidebar-footer">
    <div class="user-avatar"><?= strtoupper(substr($username,0,1)) ?></div>
    <div class="user-role">👤 <?= ucfirst($role) ?></div>
    <a href="../public/logout.php">🚪 Logout</a>
  </div>
</aside>

<div class="page-wrapper">
  <header class="main-header">
    <h1 class="page-title">📊 Inventory Management System</h1>
    <span class="welcome-text">Welcome, <?= ucfirst($username) ?>!</span>
  </header>
<?php ob_end_flush(); ?>