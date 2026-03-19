<?php
require_once '../db/db_connect.php';
require_once '../inc/functions.php';

if (session_status() === PHP_SESSION_NONE) session_start();

// --- Role restriction ---
if ($_SESSION['role'] !== 'admin') {
    header('Location: ../staff/dashboard.php');
    exit;
}

// --- Filters ---
$start = $_GET['start'] ?? '';
$end = $_GET['end'] ?? '';
$search = $_GET['search'] ?? '';
$type = $_GET['type'] ?? ''; // NEW TYPE FILTER

$paramsSale = [];
$paramsPurchase = [];
$filterSale = 'WHERE 1';
$filterPurchase = 'WHERE 1';

// --- DATE FILTER ---
if (!empty($start) && !empty($end)) {
    $filterSale .= " AND s.sale_date BETWEEN :start AND :end";
    $filterPurchase .= " AND p.purchase_date BETWEEN :start AND :end";

    $paramsSale[':start'] = $start;
    $paramsSale[':end'] = $end;

    $paramsPurchase[':start'] = $start;
    $paramsPurchase[':end'] = $end;
}

// --- TEXT SEARCH FILTER ---
if (!empty($search)) {
    $filterSale .= " AND (
        s.sale_id LIKE :search 
        OR s.customer_name LIKE :search
        OR u.full_name LIKE :search
    )";

    $filterPurchase .= " AND (
        p.purchase_id LIKE :search
        OR sup.supplier_name LIKE :search
        OR u.full_name LIKE :search
    )";

    $paramsSale[':search'] = "%$search%";
    $paramsPurchase[':search'] = "%$search%";
}

/* ================================
   FETCH SALES
================================ */
$sales = [];

if ($type === '' || $type === 'sale') {
    $stmtSale = $pdo->prepare("
        SELECT 
            s.sale_id AS reference_id,
            s.sale_date AS date,
            s.customer_name AS subject,
            s.total_amount,
            u.full_name AS generated_by
        FROM sale s
        LEFT JOIN user u ON s.user_id = u.user_id
        $filterSale
        ORDER BY s.sale_date DESC
    ");
    $stmtSale->execute($paramsSale);
    $sales = $stmtSale->fetchAll(PDO::FETCH_ASSOC);
}

/* ================================
   FETCH PURCHASES
================================ */
$purchases = [];

if ($type === '' || $type === 'purchase') {
    $stmtPurchase = $pdo->prepare("
        SELECT 
            p.purchase_id AS reference_id,
            p.purchase_date AS date,
            sup.supplier_name AS subject,
            p.total_amount,
            u.full_name AS generated_by
        FROM purchase p
        LEFT JOIN supplier sup ON p.supplier_id = sup.supplier_id
        LEFT JOIN user u ON p.user_id = u.user_id
        $filterPurchase
        ORDER BY p.purchase_date DESC
    ");
    $stmtPurchase->execute($paramsPurchase);
    $purchases = $stmtPurchase->fetchAll(PDO::FETCH_ASSOC);
}

/* ================================
   MERGE SALES + PURCHASES
================================ */
$reports = [];

foreach ($sales as $s) {
    $s['report_type'] = 'sale';
    $reports[] = $s;
}

foreach ($purchases as $p) {
    $p['report_type'] = 'purchase';
    $reports[] = $p;
}

/* Sort merged results by date DESC */
usort($reports, fn($a, $b) => strtotime($b['date']) - strtotime($a['date']));

/* ================================
   TOTALS
================================ */
$totalSales = ($type === 'purchase') ? 0 : array_sum(array_column($sales, 'total_amount'));
$totalPurchases = ($type === 'sale') ? 0 : array_sum(array_column($purchases, 'total_amount'));
$totalTransactions = count($reports);

require_once '../inc/header.php';
?>

<div class="content-container">
    <h2 class="page">📊 Reports (Sales & Purchases)</h2>

    <!-- Filter Bar -->
    <form method="get" class="filter-bar">
        <input type="date" name="start" value="<?= htmlspecialchars($start) ?>">
        <input type="date" name="end" value="<?= htmlspecialchars($end) ?>">

        <!-- TEXT SEARCH -->
        <input type="text" name="search" placeholder="Search..." 
               value="<?= htmlspecialchars($search) ?>" style="width:200px;">

        <!-- TYPE FILTER -->
        <select name="type" style="padding:8px;border-radius:6px;border:1px solid #cbd5e1;">
            <option value="" <?= $type === '' ? 'selected' : '' ?>>All</option>
            <option value="sale" <?= $type === 'sale' ? 'selected' : '' ?>>Sales</option>
            <option value="purchase" <?= $type === 'purchase' ? 'selected' : '' ?>>Purchases</option>
        </select>

        <button type="submit" class="btn btn-primary">🔎 Filter</button>

        <?php if ($start || $end || $search || $type): ?>
            <a href="reports.php" class="btn btn-cancel">❌ Clear</a>
        <?php endif; ?>

        <!-- EXPORT PDF BUTTON -->
        <a 
            href="export_pdf.php?start=<?= $start ?>&end=<?= $end ?>&search=<?= $search ?>&type=<?= $type ?>" 
            class="btn" 
            style="background:#0ea5e9;">
            📄 Export PDF
        </a>
    </form>

    <!-- Summary Cards -->
    <div class="summary-cards">
        <div class="summary-card blue">
            <h3>💰 Total Sales</h3>
            <p>₱<?= formatMoney($totalSales) ?></p>
        </div>
        <div class="summary-card green">
            <h3>📥 Total Purchases</h3>
            <p>₱<?= formatMoney($totalPurchases) ?></p>
        </div>
        <div class="summary-card purple">
            <h3>📦 Total Records</h3>
            <p><?= $totalTransactions ?></p>
        </div>
    </div>

    <!-- Reports Table -->
    <div class="card">
        <h3>📑 All Transactions</h3>

        <table>
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Reference ID</th>
                    <th>Date</th>
                    <th>Subject</th>
                    <th>Total (₱)</th>
                    <th>Generated By</th>
                </tr>
            </thead>

            <tbody>
                <?php if ($reports): ?>
                    <?php foreach ($reports as $r): ?>
                        <tr>
                            <td><?= ucfirst($r['report_type']) ?></td>
                            <td><?= $r['reference_id'] ?></td>
                            <td><?= $r['date'] ?></td>
                            <td><?= htmlspecialchars($r['subject']) ?></td>
                            <td>₱<?= formatMoney($r['total_amount']) ?></td>
                            <td><?= htmlspecialchars($r['generated_by'] ?? 'N/A') ?></td>
                        </tr>
                    <?php endforeach; ?>
                <?php else: ?>
                    <tr><td colspan="6">No matching transactions found.</td></tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<style>
/* === Your UI Styling (unchanged) === */
.content-container { padding: 30px 40px; background: #f9fafb; font-family: 'Inter', sans-serif; }
h2.page { font-size: 1.6rem; margin-bottom: 20px; color: #1e293b; font-weight: 700; }

.filter-bar { display: flex; justify-content: flex-end; align-items: center; gap: 10px; margin-bottom: 25px; flex-wrap: wrap; }
.filter-bar input { padding: 8px 10px; border-radius: 6px; border: 1px solid #cbd5e1; font-family: inherit; }

.summary-cards { display: flex; gap: 15px; margin-bottom: 30px; flex-wrap: wrap; }
.summary-card { flex: 1; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); text-align: center; transition: transform 0.2s ease; }
.summary-card:hover { transform: translateY(-4px); }
.summary-card h3 { font-size: 1rem; color: #374151; margin-bottom: 5px; }
.summary-card p { font-size: 1.5rem; font-weight: 700; color: #1e3a8a; }
.summary-card.blue { border-top: 4px solid #2563eb; }
.summary-card.green { border-top: 4px solid #10b981; }
.summary-card.purple { border-top: 4px solid #8b5cf6; }

.card { background: #fff; border-radius: 10px; padding: 15px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); }
.card h3 { margin-bottom: 10px; color: #111827; text-align: center; font-size: 1rem; font-weight: 600; }

table { width: 100%; border-collapse: collapse; }
th, td { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; text-align: left; font-size: 0.9rem; }
th { background: #2563eb; color: white; }
td { color: #1e293b; }

.btn {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4); }

.btn-cancel {
    background: #ef4444 !important;
}

@media(max-width: 992px) {
    .summary-cards { flex-direction: column; }
    .filter-bar { flex-direction: column; }
    .filter-bar input { width: 100%; }
    .btn { width: 100%; justify-content: center; }
}
</style>
