<?php 
require_once '../inc/auth_middleware.php';
require_once '../inc/header.php';
require_once '../db/db_connect.php';
require_once '../inc/functions.php';

// Require admin role
requireAdmin();

// ===============================
// DATABASE COUNTS & TOTALS
// ===============================
$totalUsers = $pdo->query("SELECT COUNT(*) FROM user")->fetchColumn();
$totalItems = $pdo->query("SELECT COUNT(*) FROM item")->fetchColumn();
$totalCategories = $pdo->query("SELECT COUNT(*) FROM category")->fetchColumn();
$totalSuppliers = $pdo->query("SELECT COUNT(*) FROM supplier")->fetchColumn();
$totalSales = $pdo->query("SELECT SUM(total_amount) FROM sale")->fetchColumn() ?? 0;
$totalPurchases = $pdo->query("SELECT SUM(total_amount) FROM purchase")->fetchColumn() ?? 0;
$totalValue = $pdo->query("SELECT SUM(stock * price) FROM item")->fetchColumn();

// ===============================
// CHART DATA
// ===============================
// Sales by month (last 6 months)
$salesData = $pdo->query("
  SELECT DATE_FORMAT(sale_date, '%b') as month, COUNT(*) as count, SUM(total_amount) as total
  FROM sale
  WHERE sale_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
  GROUP BY DATE_FORMAT(sale_date, '%Y-%m')
  ORDER BY sale_date
")->fetchAll(PDO::FETCH_ASSOC);

// Category distribution
$categoryData = $pdo->query("
  SELECT c.category_name, COUNT(i.item_id) as count
  FROM category c
  LEFT JOIN item i ON c.category_id = i.category_id
  GROUP BY c.category_id
")->fetchAll(PDO::FETCH_ASSOC);

// Stock levels
$stockData = $pdo->query("
  SELECT item_name, stock FROM item ORDER BY stock DESC LIMIT 8
")->fetchAll(PDO::FETCH_ASSOC);

// Purchase vs Sales comparison
$purchaseSalesData = $pdo->query("
  SELECT 
    'Purchases' as type, COUNT(*) as count FROM purchase
  UNION ALL
  SELECT 
    'Sales' as type, COUNT(*) as count FROM sale
")->fetchAll(PDO::FETCH_ASSOC);

// Low stock alert (stock < 5)
$lowStockAlert = $pdo->query("
  SELECT item_id, item_name, stock FROM item WHERE stock < 5 ORDER BY stock ASC
")->fetchAll(PDO::FETCH_ASSOC);

// Format data for charts
$salesMonths = json_encode(array_column($salesData, 'month'));
$salesCounts = json_encode(array_column($salesData, 'count'));
$salesTotals = json_encode(array_column($salesData, 'total'));
$categoryNames = json_encode(array_column($categoryData, 'category_name'));
$categoryCounts = json_encode(array_column($categoryData, 'count'));
$stockNames = json_encode(array_column($stockData, 'item_name'));
$stockLevels = json_encode(array_column($stockData, 'stock'));
$psTypes = json_encode(array_column($purchaseSalesData, 'type'));
$psCounts = json_encode(array_column($purchaseSalesData, 'count'));
?>

<div class="dashboard-container">
  <header class="dashboard-header">
    <h2>👑 Admin Dashboard</h2>
    <p class="subtitle">
      Welcome back, <strong><?= ucfirst($username) ?></strong>! Here's your system overview.
    </p>
  </header>

  <!-- ===== Low Stock Alert ===== -->
  <?php if (!empty($lowStockAlert)): ?>
  <div class="alert-banner">
    <div class="alert-icon">⚠️</div>
    <div class="alert-content">
      <h3>Low Stock Alert</h3>
      <p><?= count($lowStockAlert) ?> item(s) have stock below 5 units</p>
      <div class="alert-items">
        <?php foreach ($lowStockAlert as $item): ?>
          <span class="alert-item">
            <strong><?= e($item['item_name']) ?></strong> (<?= $item['stock'] ?> units)
          </span>
        <?php endforeach; ?>
      </div>
    </div>
  </div>
  <?php endif; ?>

  <!-- ===== KPI Cards ===== -->
  <div class="kpi-grid">
    <!-- Total Users (spans 2 rows) -->
    <div class="kpi-card kpi-span-2">
      <div class="kpi-icon" style="color:#3b82f6;background:#3b82f620;"><span>👥</span></div>
      <div class="kpi-content">
        <h4>Total Users</h4>
        <p><?= $totalUsers ?></p>
      </div>
    </div>

    <!-- Other KPI cards -->
    <div class="kpi-card">
      <div class="kpi-icon" style="color:#10b981;background:#10b98120;"><span>📦</span></div>
      <div class="kpi-content">
        <h4>Total Items</h4>
        <p><?= $totalItems ?></p>
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-icon" style="color:#f59e0b;background:#f59e0b20;"><span>📂</span></div>
      <div class="kpi-content">
        <h4>Categories</h4>
        <p><?= $totalCategories ?></p>
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-icon" style="color:#8b5cf6;background:#8b5cf620;"><span>🚚</span></div>
      <div class="kpi-content">
        <h4>Suppliers</h4>
        <p><?= $totalSuppliers ?></p>
      </div>
    </div>

    <!-- Row 2 starts here -->
    <div class="kpi-card">
      <div class="kpi-icon" style="color:#ef4444;background:#ef444420;"><span>🛍️</span></div>
      <div class="kpi-content">
        <h4>Total Sales</h4>
        <p>₱<?= formatMoney($totalSales) ?></p>
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-icon" style="color:#06b6d4;background:#06b6d420;"><span>📥</span></div>
      <div class="kpi-content">
        <h4>Total Purchases</h4>
        <p>₱<?= formatMoney($totalPurchases) ?></p>
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-icon" style="color:#22c55e;background:#22c55e20;"><span>💰</span></div>
      <div class="kpi-content">
        <h4>Inventory Value</h4>
        <p>₱<?= formatMoney($totalValue ?? 0) ?></p>
      </div>
    </div>
  </div>

  <!-- ===== Charts Section ===== -->
  <div class="charts-grid">
    <!-- Sales Trend Chart -->
    <div class="chart-card">
      <h3>📈 Sales Trend (Last 6 Months)</h3>
      <canvas id="salesChart"></canvas>
    </div>

    <!-- Category Distribution Chart -->
    <div class="chart-card">
      <h3>📊 Category Distribution</h3>
      <canvas id="categoryChart"></canvas>
    </div>

    <!-- Purchases vs Sales Chart -->
    <div class="chart-card">
      <h3>🔄 Purchases vs Sales</h3>
      <canvas id="purchaseSalesChart"></canvas>
    </div>

    <!-- Top 8 Stock Levels Chart (side by side now) -->
    <div class="chart-card">
      <h3>📦 Top 8 Items by Stock Level</h3>
      <canvas id="stockChart"></canvas>
    </div>
  </div>
</div>

<!-- Chart.js Library -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
<script>
const salesCtx = document.getElementById('salesChart').getContext('2d');
new Chart(salesCtx, {
  type: 'line',
  data: {
    labels: <?= $salesMonths ?>,
    datasets: [{
      label: 'Sales Count',
      data: <?= $salesCounts ?>,
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointRadius: 6,
      pointBackgroundColor: '#2563eb',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointHoverRadius: 8
    }]
  },
  options: { responsive:true, maintainAspectRatio:true }
});

const categoryCtx = document.getElementById('categoryChart').getContext('2d');
new Chart(categoryCtx, {
  type: 'doughnut',
  data: {
    labels: <?= $categoryNames ?>,
    datasets: [{ data: <?= $categoryCounts ?>,
      backgroundColor:['#3b82f6','#10b981','#f59e0b','#8b5cf6','#ef4444','#06b6d4'],
      borderColor:'#fff', borderWidth:2
    }]
  },
  options: { responsive:true, maintainAspectRatio:true }
});

const purchaseSalesCtx = document.getElementById('purchaseSalesChart').getContext('2d');
new Chart(purchaseSalesCtx, {
  type: 'bar',
  data: {
    labels: <?= $psTypes ?>,
    datasets: [{ label:'Count', data: <?= $psCounts ?>, backgroundColor:['#2563eb','#10b981'], borderRadius:8, borderSkipped:false }]
  },
  options: { responsive:true, maintainAspectRatio:true }
});

const stockCtx = document.getElementById('stockChart').getContext('2d');
new Chart(stockCtx, {
  type: 'bar',
  data: {
    labels: <?= $stockNames ?>,
    datasets: [{ label:'Stock Level', data: <?= $stockLevels ?>,
      backgroundColor:['#3b82f6','#2563eb','#1e40af','#1e3a8a','#10b981','#059669','#047857','#065f46'],
      borderRadius:8, borderSkipped:false
    }]
  },
  options: { indexAxis:'y', responsive:true, maintainAspectRatio:true }
});
</script>

<!-- ===== Styling ===== -->
<style>
.dashboard-container {padding:30px 30px 60px 30px; background:#f1f5f9; font-family:'Poppins',sans-serif; min-height:100vh;}
.dashboard-header {margin-bottom:35px;}
.dashboard-header h2 {font-size:2rem; font-weight:700; color:#1e293b;}
.subtitle {font-size:.95rem; color:#64748b; margin-bottom:0; font-weight:500;}

.alert-banner {background:linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border:2px solid #dc2626; border-radius:12px; padding:20px; margin-bottom:30px; display:flex; gap:16px; align-items:flex-start;}
.alert-icon {font-size:2rem; flex-shrink:0;}
.alert-content h3 {font-size:1.1rem; color:#991b1b; margin:0 0 8px 0; font-weight:700;}
.alert-content p {font-size:0.95rem; color:#7f1d1d; margin:0 0 12px 0; font-weight:500;}
.alert-items {display:flex; flex-wrap:wrap; gap:10px;}
.alert-item {background:#fff; border:1px solid #dc2626; border-radius:8px; padding:8px 12px; font-size:0.9rem; color:#991b1b; font-weight:600;}

.kpi-grid {
  display:grid;
  grid-template-columns: repeat(4,1fr);
  grid-auto-rows:140px;
  gap:16px;
  margin-bottom:30px;
}
.kpi-card {background:#fff; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.05); border:1px solid rgba(255,255,255,0.8); padding:16px; display:flex; align-items:center; gap:12px; transition:all 0.3s ease;}
.kpi-card:hover {transform:translateY(-4px); box-shadow:0 8px 20px rgba(0,0,0,0.1);}
.kpi-icon {font-size:2rem; border-radius:10px; padding:8px; flex-shrink:0;}
.kpi-content h4 {font-size:.8rem; color:#64748b; margin:0; font-weight:600; text-transform:uppercase;}
.kpi-content p {font-size:1.4rem; font-weight:700; color:#1e293b; margin:4px 0 0 0;}
.kpi-span-2 {grid-row: span 2;}

.charts-grid {display:grid; grid-template-columns:repeat(auto-fit,minmax(450px,1fr)); gap:24px; animation: fadeInUp 0.8s ease; margin-bottom:40px;}
.chart-card {background:#fff; border-radius:14px; box-shadow:0 6px 20px rgba(0,0,0,0.06); border:1px solid rgba(255,255,255,0.8); padding:24px;}
.chart-card canvas {max-height:300px;}

@media(max-width:900px){
  .kpi-grid {grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); grid-auto-rows:auto;}
  .kpi-span-2 {grid-row:span 1 !important;}
  .charts-grid {grid-template-columns:1fr;}
}
</style>
