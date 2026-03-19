<?php 
require_once '../inc/header.php';
require_once '../db/db_connect.php';
require_once '../inc/functions.php';

/* ================================
   1️⃣ HANDLE ADD SUPPLIER
================================ */
if (isset($_POST['add_supplier'])) {
    $name = trim($_POST['supplier_name']);
    $contact_person = trim($_POST['contact_person']);
    $phone = trim($_POST['phone']);
    $email = trim($_POST['email']);
    $address = trim($_POST['address']);

    if ($name !== '') {
        $stmt = $pdo->prepare("
            INSERT INTO supplier (supplier_name, contact_person, phone, email, address)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([$name, $contact_person, $phone, $email, $address]);
        redirect('suppliers.php');
    }
}

/* ================================
   2️⃣ HANDLE EDIT SUPPLIER
================================ */
if (isset($_POST['update_supplier'])) {
    $id = (int)$_POST['supplier_id'];
    $name = trim($_POST['supplier_name']);
    $contact_person = trim($_POST['contact_person']);
    $phone = trim($_POST['phone']);
    $email = trim($_POST['email']);
    $address = trim($_POST['address']);

    $pdo->prepare("
        UPDATE supplier
        SET supplier_name=?, contact_person=?, phone=?, email=?, address=?
        WHERE supplier_id=?
    ")->execute([$name, $contact_person, $phone, $email, $address, $id]);

    redirect('suppliers.php');
}

/* ================================
   3️⃣ HANDLE DELETE SUPPLIER
================================ */
if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    $pdo->prepare("DELETE FROM supplier WHERE supplier_id = ?")->execute([$id]);
    redirect('suppliers.php');
}

/* ================================
   4️⃣ FETCH SUPPLIERS (SEARCH)
================================ */
$search = $_GET['search'] ?? '';
$searchQuery = '';
$params = [];

if (!empty($search)) {
    $searchQuery = "WHERE 
        supplier_name LIKE :search OR 
        contact_person LIKE :search OR 
        phone LIKE :search OR 
        email LIKE :search OR 
        address LIKE :search";
    $params[':search'] = "%$search%";
}

$sql = "SELECT * FROM supplier $searchQuery ORDER BY supplier_id DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$suppliers = $stmt->fetchAll();
?>

<div class="content-container">
<h2>🚚 Suppliers</h2>

<!-- 💡 Add Supplier Button + Search -->
<div style="display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-bottom: 20px; flex-wrap: wrap;">

    <!-- Add Supplier Button -->
    <button class="btn btn-primary" onclick="openAddModal()" style="font-size:15px; padding:10px 20px;">🚚 Add Supplier</button>

    <!-- Search Bar -->
    <form method="get" action="suppliers.php" class="search-form" style="display:flex; align-items:center; gap:10px;">
        <input type="text" name="search" placeholder="Search by name, contact, or email..." 
               value="<?php echo e($search); ?>" 
               style="padding:8px; width:260px; border-radius:6px; border:1px solid #ccc;">
        <button type="submit" class="btn">🔎 Search</button>
        <?php if (!empty($search)): ?>
            <a href="suppliers.php" class="btn btn-cancel">❌ Clear</a>
        <?php endif; ?>
    </form>
</div>

<!-- 📋 Suppliers Table -->
<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Supplier Name</th>
            <th>Contact Person</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <?php if ($suppliers): ?>
            <?php foreach ($suppliers as $s): ?>
                <tr>
                    <td><?= e($s['supplier_id']); ?></td>
                    <td><?= e($s['supplier_name']); ?></td>
                    <td><?= e($s['contact_person']); ?></td>
                    <td><?= e($s['phone']); ?></td>
                    <td><?= e($s['email']); ?></td>
                    <td><?= e($s['address']); ?></td>
                    <td>
                        <button class="btn btn-edit"
                            onclick="openEditModal(
                                '<?= $s['supplier_id'] ?>',
                                '<?= addslashes($s['supplier_name']) ?>',
                                '<?= addslashes($s['contact_person']) ?>',
                                '<?= addslashes($s['phone']) ?>',
                                '<?= addslashes($s['email']) ?>',
                                '<?= addslashes($s['address']) ?>'
                            )">✏️ Edit</button>
                        <a href="suppliers.php?delete=<?= $s['supplier_id'] ?>" 
                           class="btn btn-delete" 
                           onclick="return confirm('Delete this supplier?');">🗑️ Delete</a>
                    </td>
                </tr>
            <?php endforeach; ?>
        <?php else: ?>
            <tr><td colspan="7">No suppliers found.</td></tr>
        <?php endif; ?>
    </tbody>
</table>
</div> <!-- END content-container -->

<!-- 🟢 ADD SUPPLIER MODAL -->
<div id="addModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>🚚 Add New Supplier</h3>
            <button type="button" class="modal-close" onclick="closeAddModal()">✕</button>
        </div>
        <form method="POST" class="add-form">
            <div class="form-group">
                <label>Supplier Name <span class="required">*</span></label>
                <input type="text" name="supplier_name" placeholder="Enter supplier name" required>
                <small class="help-text">Official name of the supplier</small>
            </div>
            <div class="form-group">
                <label>Contact Person</label>
                <input type="text" name="contact_person" placeholder="Enter contact person name">
                <small class="help-text">Primary contact at the supplier</small>
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="text" name="phone" placeholder="Enter phone number">
                <small class="help-text">Contact phone number</small>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" placeholder="Enter email address">
                <small class="help-text">Contact email address</small>
            </div>
            <div class="form-group">
                <label>Address</label>
                <input type="text" name="address" placeholder="Enter address">
                <small class="help-text">Supplier's physical address</small>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-cancel" onclick="closeAddModal()">Cancel</button>
                <button type="submit" name="add_supplier" class="btn btn-save">💾 Save Supplier</button>
            </div>
        </form>
    </div>
</div>

<!-- ✏️ EDIT MODAL -->
<div id="editModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>✏️ Edit Supplier</h3>
            <button type="button" class="modal-close" onclick="closeEditModal()">✕</button>
        </div>
        <form method="POST" class="add-form">
            <input type="hidden" name="supplier_id" id="edit_supplier_id">
            <div class="form-group">
                <label>Supplier Name <span class="required">*</span></label>
                <input type="text" name="supplier_name" id="edit_supplier_name" placeholder="Enter supplier name" required>
            </div>
            <div class="form-group">
                <label>Contact Person</label>
                <input type="text" name="contact_person" id="edit_contact_person" placeholder="Enter contact person name">
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="text" name="phone" id="edit_phone" placeholder="Enter phone number">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" id="edit_email" placeholder="Enter email address">
            </div>
            <div class="form-group">
                <label>Address</label>
                <input type="text" name="address" id="edit_address" placeholder="Enter address">
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-cancel" onclick="closeEditModal()">Cancel</button>
                <button type="submit" name="update_supplier" class="btn btn-save">💾 Update Supplier</button>
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
function openEditModal(id, name, contact, phone, email, address) {
    document.getElementById('edit_supplier_id').value = id;
    document.getElementById('edit_supplier_name').value = name;
    document.getElementById('edit_contact_person').value = contact;
    document.getElementById('edit_phone').value = phone;
    document.getElementById('edit_email').value = email;
    document.getElementById('edit_address').value = address;
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
    width: 500px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    max-height: 90vh;
    overflow-y: auto;
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

input, select {
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

input::placeholder, select::placeholder {
    color: #cbd5e1;
}

input:focus, select:focus {
    outline: none;
    border-color: #2563eb;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(37,99,235,0.1);
}

@media(max-width:600px) {
    .modal-content {
        width: 90%;
        max-width: 500px;
    }
}
</style>
