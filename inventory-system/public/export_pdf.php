<?php
require_once '../db/db_connect.php';
require_once '../inc/functions.php';

if (session_status() === PHP_SESSION_NONE) session_start();

// --- Role restriction ---
if ($_SESSION['role'] !== 'admin') {
    header('Location: ../staff/dashboard.php');
    exit;
}

// --- Get filters from query parameters ---
$start = $_GET['start'] ?? '';
$end = $_GET['end'] ?? '';
$search = $_GET['search'] ?? '';
$type = $_GET['type'] ?? '';

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

// --- Generate PDF HTML ---
$dateRange = ($start && $end) ? "{$start} to {$end}" : 'All Records';

$html = '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Sales & Purchases Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: "Segoe UI", Arial, sans-serif; color: #333; line-height: 1.6; background: #fff; }
        .container { max-width: 900px; margin: 0 auto; padding: 30px 20px; }
        
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #2563eb; padding-bottom: 20px; }
        .header h1 { color: #1e3a8a; font-size: 28px; margin-bottom: 5px; font-weight: 700; }
        .header h2 { color: #2563eb; font-size: 18px; margin-bottom: 10px; font-weight: 600; }
        .header p { color: #666; font-size: 12px; margin: 3px 0; }
        
        .summary { display: flex; gap: 15px; margin-bottom: 30px; flex-wrap: wrap; }
        .summary-item { flex: 1; min-width: 200px; border: 2px solid #e5e7eb; padding: 20px; text-align: center; border-radius: 8px; background: #f9fafb; }
        .summary-item h3 { color: #2563eb; font-size: 13px; margin-bottom: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .summary-item p { font-size: 24px; font-weight: 700; color: #1e3a8a; }
        
        table { width: 100%; border-collapse: collapse; margin-top: 20px; border: 1px solid #ddd; }
        th { background-color: #2563eb; color: white; padding: 12px; text-align: left; font-weight: 600; font-size: 12px; border: 1px solid #2563eb; }
        td { padding: 10px 12px; border: 1px solid #ddd; font-size: 11px; }
        tr:nth-child(even) { background-color: #f9fafb; }
        
        .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #ddd; padding-top: 15px; }
        
        @media print { body { background: white; } .container { padding: 0; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Inventory Management System</h1>
            <h2>Sales & Purchases Report</h2>
            <p>Date Range: ' . htmlspecialchars($dateRange) . '</p>
            <p>Generated on: ' . date('F d, Y H:i:s') . '</p>
        </div>
        
        <div class="summary">
            <div class="summary-item">
                <h3>💰 Total Sales</h3>
                <p>₱' . formatMoney($totalSales) . '</p>
            </div>
            <div class="summary-item">
                <h3>📥 Total Purchases</h3>
                <p>₱' . formatMoney($totalPurchases) . '</p>
            </div>
            <div class="summary-item">
                <h3>📦 Total Records</h3>
                <p>' . $totalTransactions . '</p>
            </div>
        </div>
        
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
            <tbody>';

if ($reports) {
    foreach ($reports as $r) {
        $html .= '
                <tr>
                    <td>' . ucfirst($r['report_type']) . '</td>
                    <td>' . htmlspecialchars($r['reference_id']) . '</td>
                    <td>' . htmlspecialchars($r['date']) . '</td>
                    <td>' . htmlspecialchars($r['subject']) . '</td>
                    <td>₱' . formatMoney($r['total_amount']) . '</td>
                    <td>' . htmlspecialchars($r['generated_by'] ?? 'N/A') . '</td>
                </tr>';
    }
} else {
    $html .= '
                <tr>
                    <td colspan="6" style="text-align: center;">No matching transactions found.</td>
                </tr>';
}

$html .= '
            </tbody>
        </table>
        
        <div class="footer">
            <p>This is an automatically generated report from the Inventory Management System.</p>
            <p>For more information, please contact your system administrator.</p>
        </div>
    </div>
</body>
</html>';

// --- Send as downloadable HTML file (browser will print to PDF) ---
$filename = 'Report_' . date('Y-m-d_H-i-s') . '.html';

header('Content-Type: text/html; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

echo $html;
exit;
?>
