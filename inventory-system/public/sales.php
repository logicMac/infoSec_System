<?php 
require_once '../inc/header.php';
require_once '../db/db_connect.php';
require_once '../inc/functions.php';

// ==============================
// ADD SALE
// ==============================
if (isset($_POST['add_sale'])) {
    $customer = trim($_POST['customer_name']);
    $total = floatval($_POST['total_amount']);
    $date = date('Y-m-d');
    $user_id = $_SESSION['user_id'] ?? 1;

    if ($customer !== '' && $total > 0) {
        $stmt = $pdo->prepare("
            INSERT INTO sale (user_id, sale_date, customer_name, total_amount)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$user_id, $date, $customer, $total]);
        redirect('sales.php');
    }
}

// ==============================
// UPDATE SALE
// ==============================
if (isset($_POST['update_sale'])) {
    $id = (int)$_POST['sale_id'];
    $customer = trim($_POST['customer_name']);
    $total = floatval($_POST['total_amount']);

    if ($customer !== '' && $total > 0) {
        $stmt = $pdo->prepare("
            UPDATE sale 
            SET customer_name = ?, total_amount = ? 
            WHERE sale_id = ?
        ");
        $stmt->execute([$customer, $total, $id]);
        redirect('sales.php');
    }
}

// ==============================
// DELETE SALE
// ==============================
if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    $pdo->prepare("DELETE FROM sale WHERE sale_id = ?")->execute([$id]);
    redirect('sales.php');
}

// ==============================
// SEARCH FILTER
// ==============================
$search = $_GET['search'] ?? '';
$searchQuery = '';
$params = [];

if (!empty($search)) {
    $searchQuery = "WHERE 
        s.customer_name LIKE :search OR 
        s.sale_date LIKE :search OR 
        u.full_name LIKE :search";
    $params[':search'] = "%$search%";
}

// ==============================
// FETCH SALES
// ==============================
$sql = "
    SELECT s.*, u.full_name AS user_name
    FROM sale s
    LEFT JOIN user u ON s.user_id = u.user_id
    $searchQuery
    ORDER BY s.sale_id DESC
";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$sales = $stmt->fetchAll();
?>

<div class="content-container">
<h2>🛍️ Sales</h2>

<!-- ➕ Add Sale Button + 🔍 Search -->
<div style="display:flex; justify-content:space-between; align-items:center; gap:20px; margin-bottom:20px; flex-wrap:wrap;">
    <!-- Add Sale Button -->
    <button class="btn btn-primary" onclick="openAddModal()" style="font-size:15px; padding:10px 20px;">💰 Add Sale</button>

    <!-- Search -->
    <form method="get" action="sales.php" class="search-form" style="display:flex; align-items:center; gap:10px;">
        <input type="text" name="search" placeholder="Search by customer, date, or user..." 
               value="<?php echo e($search); ?>" 
               style="padding:8px; width:260px; border-radius:6px; border:1px solid #ccc;">
        <button type="submit" class="btn">🔎 Search</button>
        <?php if (!empty($search)): ?>
            <a href="sales.php" class="btn btn-cancel">❌ Clear</a>
        <?php endif; ?>
    </form>
</div>

<!-- 📋 Sales Table -->
<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Total (₱)</th>
            <th>Date</th>
            <th>Recorded By</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <?php if ($sales): ?>
            <?php foreach ($sales as $s): ?>
                <tr>
                    <td><?= e($s['sale_id']); ?></td>
                    <td><?= e($s['customer_name']); ?></td>
                    <td>₱<?= formatMoney($s['total_amount']); ?></td>
                    <td><?= e($s['sale_date']); ?></td>
                    <td><?= e($s['user_name'] ?? 'Unknown'); ?></td>
                    <td>
                        <button class="btn btn-edit" 
                            onclick="openEditModal(
                                '<?= $s['sale_id'] ?>',
                                '<?= addslashes($s['customer_name']) ?>',
                                '<?= $s['total_amount'] ?>'
                            )">✏️ Edit</button>
                        <a href="sales.php?delete=<?= $s['sale_id'] ?>" 
                           class="btn btn-delete" 
                           onclick="return confirm('Delete this sale?');">🗑️ Delete</a>
                    </td>
                </tr>
            <?php endforeach; ?>
        <?php else: ?>
            <tr><td colspan="6">No sales recorded.</td></tr>
        <?php endif; ?>
    </tbody>
</table>
</div> <!-- End .content-container -->

<!-- 🟢 ADD SALE MODAL -->
<div id="addModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>💰 Add New Sale</h3>
            <button type="button" class="modal-close" onclick="closeAddModal()">✕</button>
        </div>
        <form method="POST" class="add-form">
            <div class="form-group">
                <label>Customer Name <span class="required">*</span></label>
                <input type="text" name="customer_name" placeholder="Enter customer name" required>
                <small class="help-text">Name of the customer</small>
            </div>
            <div class="form-group">
                <label>Total Amount (₱) <span class="required">*</span></label>
                <input type="number" step="0.01" name="total_amount" placeholder="0.00" min="0" required>
                <small class="help-text">Sale total amount</small>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-cancel" onclick="closeAddModal()">Cancel</button>
                <button type="submit" name="add_sale" class="btn btn-save">💾 Save Sale</button>
            </div>
        </form>
    </div>
</div>

<!-- ✏️ EDIT MODAL -->
<div id="editModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>✏️ Edit Sale</h3>
            <button type="button" class="modal-close" onclick="closeEditModal()">✕</button>
        </div>
        <form method="POST" class="add-form">
            <input type="hidden" name="sale_id" id="edit_sale_id">
            <div class="form-group">
                <label>Customer Name <span class="required">*</span></label>
                <input type="text" name="customer_name" id="edit_customer_name" placeholder="Enter customer name" required>
            </div>
            <div class="form-group">
                <label>Total Amount (₱) <span class="required">*</span></label>
                <input type="number" step="0.01" name="total_amount" id="edit_total_amount" placeholder="0.00" min="0" required>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-cancel" onclick="closeEditModal()">Cancel</button>
                <button type="submit" name="update_sale" class="btn btn-save">💾 Update Sale</button>
            </div>
        </form>
    </div>
</div>

<!-- 🧠 JS -->
<script>
function openAddModal() {
    document.getElementById('addModal').style.display = 'flex';
}
function closeAddModal() {
    document.getElementById('addModal').style.display = 'none';
}
function openEditModal(id, customer, total) {
    document.getElementById('edit_sale_id').value = id;
    document.getElementById('edit_customer_name').value = customer;
    document.getElementById('edit_total_amount').value = total;
    document.getElementById('editModal').style.display = 'flex';
}
function closeEditModal() { 
    document.getElementById('editModal').style.display = 'none'; 
}
window.onclick = function(e) {
    if (e.target.classList.contains('modal')) e.target.style.display = 'none';
};
</script>

<!-- 🎨 CSS -->
<style>
/* Page container */
.content-container {
  padding: 30px 40px;
  background: #f8fafc;
}

table {
    width: 100%;
    border-collapse: collapse;
}
th, td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    text-align: left;
}

.btn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background: #3498db;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    cursor: pointer;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
}
.btn:hover { opacity: 0.9; }
.btn-edit { background: #2563eb; }
.btn-delete { background: #e74c3c; }
.btn-cancel { background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); color: #1e293b; }
.btn-cancel:hover { background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%); }
.btn-save { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
.btn-save:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(16,185,129,0.4); }
.btn-primary { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 10px 20px; font-size: 15px; }

.modal {
    display: none;
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    justify-content: center;
    align-items: center;
    z-index: 2000;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { background: rgba(0,0,0,0); }
    to { background: rgba(0,0,0,0.5); }
}

.modal-content {
    background: #fff;
    padding: 0;
    border-radius: 16px;
    width: 450px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideUp {
    from { transform: translateY(50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 28px;
    border-bottom: 1px solid #e5e7eb;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-radius: 16px 16px 0 0;
}

.modal-header h3 {
    font-size: 1.3rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #94a3b8;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.modal-close:hover {
    background: #e2e8f0;
    color: #1e293b;
}

.add-form {
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #1e293b;
}

.required {
    color: #dc2626;
    font-weight: 700;
}

.help-text {
    font-size: 0.8rem;
    color: #64748b;
    margin-top: 2px;
}

.modal-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
    margin-top: 8px;
}

input {
    padding: 11px 14px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    width: 100%;
    font-family: 'Poppins', sans-serif;
    font-size: 0.9rem;
    color: #1e293b;
    background: #f8fafc;
    transition: all 0.3s ease;
}

input::placeholder {
    color: #cbd5e1;
}

input:focus {
    outline: none;
    border-color: #2563eb;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(37,99,235,0.1);
}

@media(max-width:600px) {
    .modal-content {
        width: 90%;
        max-width: 450px;
    }
}
</style>
