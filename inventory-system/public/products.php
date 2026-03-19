<?php
require_once '../db/db_connect.php';
require_once '../inc/functions.php';

/* --------------------------
   1️⃣ ADD ITEM
-------------------------- */
if (isset($_POST['add_item'])) {
    $name = trim($_POST['item_name']);
    $category_id = $_POST['category_id'] ?: NULL;
    $supplier_id = $_POST['supplier_id'] ?: NULL;
    $stock = $_POST['stock'];
    $price = $_POST['price'];
    $description = trim($_POST['description']);

    if ($name !== '' && $stock !== '' && $price !== '') {
        $stmt = $pdo->prepare("INSERT INTO item (item_name, category_id, supplier_id, stock, price)
                               VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$name, $category_id, $supplier_id, $stock, $price]);

        $item_id = $pdo->lastInsertId();
        $details = $pdo->prepare("INSERT INTO item_detail (item_id, description)
                                  VALUES (?, ?)");
        $details->execute([$item_id, $description]);

        redirect('products.php');
    }
}

/* --------------------------
   2️⃣ UPDATE ITEM
-------------------------- */
if (isset($_POST['update_item'])) {
    $id = (int)$_POST['item_id'];
    $name = trim($_POST['item_name']);
    $category_id = $_POST['category_id'];
    $supplier_id = $_POST['supplier_id'];
    $stock = $_POST['stock'];
    $price = $_POST['price'];
    $description = trim($_POST['description']);

    $pdo->prepare("UPDATE item 
                   SET item_name=?, category_id=?, supplier_id=?, stock=?, price=? 
                   WHERE item_id=?")
        ->execute([$name, $category_id, $supplier_id, $stock, $price, $id]);

    $check = $pdo->prepare("SELECT * FROM item_detail WHERE item_id=?");
    $check->execute([$id]);

    if ($check->rowCount() > 0) {
        $pdo->prepare("UPDATE item_detail SET description=? WHERE item_id=?")
            ->execute([$description, $id]);
    } else {
        $pdo->prepare("INSERT INTO item_detail (item_id, description) VALUES (?, ?)")
            ->execute([$id, $description]);
    }

    redirect('products.php');
}

/* --------------------------
   3️⃣ DELETE ITEM
-------------------------- */
if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    $pdo->prepare("DELETE FROM item WHERE item_id = ?")->execute([$id]);
    redirect('products.php');
}

/* --------------------------
   4️⃣ FETCH ITEMS + DATA
-------------------------- */
$search = $_GET['search'] ?? '';
$params = [];
$searchQuery = '';
if (!empty($search)) {
    $searchQuery = "WHERE i.item_name LIKE :search OR c.category_name LIKE :search OR s.supplier_name LIKE :search";
    $params[':search'] = "%$search%";
}

$sql = "SELECT i.item_id, i.item_name, c.category_id, c.category_name, 
               s.supplier_id, s.supplier_name, i.stock, i.price, d.description
        FROM item i
        LEFT JOIN category c ON i.category_id = c.category_id
        LEFT JOIN supplier s ON i.supplier_id = s.supplier_id
        LEFT JOIN item_detail d ON i.item_id = d.item_id
        $searchQuery
        ORDER BY i.item_id DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$products = $stmt->fetchAll();

$categories = $pdo->query("SELECT * FROM category")->fetchAll();
$suppliers = $pdo->query("SELECT * FROM supplier")->fetchAll();

/* --------------------------
   5️⃣ LOW STOCK NOTIFICATION
-------------------------- */
$lowStockItems = $pdo->query("
    SELECT item_name, stock 
    FROM item 
    WHERE stock < 5 
    ORDER BY stock ASC
")->fetchAll(PDO::FETCH_ASSOC);
?>

<?php require_once '../inc/header.php'; ?>

<div class="content-container">
<h2>📦 Inventory List</h2>

<!-- � Low Stock Notification -->
<?php if ($lowStockItems): ?>
  <div class="alert alert-warning">
    <strong>⚠️ Low Stock Alert:</strong>
    The following items are running low:
    <ul>
      <?php foreach ($lowStockItems as $ls): ?>
        <li><?= e($ls['item_name']) ?> (<?= $ls['stock'] ?> in stock)</li>
      <?php endforeach; ?>
    </ul>
  </div>
<?php endif; ?>

<!-- �💡 Add Item Button + Search -->
<div style="display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-bottom: 20px; flex-wrap: wrap;">

    <!-- Add Item Button -->
    <button class="btn btn-primary" onclick="openAddModal()" style="font-size:15px; padding:10px 20px;">📦 Add New Item</button>

    <div id="popupAlert" class="popup-alert">
    <div class="popup-box">
        <span id="popupMessage"></span>
    </div>
</div>

    <!-- Search Bar -->
    <form method="get" action="products.php" class="search-form" style="display:flex; align-items:center; gap:10px;">
        <input type="text" name="search" placeholder="Search by name, category, or supplier..." 
               value="<?php echo e($search); ?>" 
               style="padding:8px; width:260px; border-radius:6px; border:1px solid #ccc;">
        <button type="submit" class="btn">🔎 Search</button>
        <?php if (!empty($search)): ?>
            <a href="products.php" class="btn btn-cancel">❌ Clear</a>
        <?php endif; ?>
    </form>
</div>

<!-- 📋 Table -->
<div class="table-container">
<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Item Name</th>
            <th>Category</th>
            <th>Supplier</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <?php if ($products): ?>
            <?php foreach ($products as $p): ?>
                <tr <?= $p['stock'] < 5 ? 'style="background:#fff3cd;"' : '' ?>>
                    <td><?= e($p['item_id']) ?></td>
                    <td><?= e($p['item_name']) ?></td>
                    <td><?= e($p['category_name'] ?? '—') ?></td>
                    <td><?= e($p['supplier_name'] ?? '—') ?></td>
                    <td><?= e($p['stock']) ?></td>
                    <td>₱<?= formatMoney($p['price']) ?></td>
                    <td style="display:flex; gap:6px;">
                        <button class="btn btn-edit"
                            onclick="openEditModal(
                                '<?= $p['item_id'] ?>',
                                '<?= addslashes($p['item_name']) ?>',
                                '<?= $p['category_id'] ?>',
                                '<?= $p['supplier_id'] ?>',
                                '<?= $p['stock'] ?>',
                                '<?= $p['price'] ?>',
                                '<?= addslashes($p['description'] ?? '') ?>'
                            )">✏️ Edit</button>
                        <a href="products.php?delete=<?= $p['item_id'] ?>" class="btn btn-delete" onclick="return confirm('Delete this item?');">🗑️ Delete</a>
                    </td>
                </tr>
            <?php endforeach; ?>
        <?php else: ?>
            <tr><td colspan="7">No items found in inventory.</td></tr>
        <?php endif; ?>
    </tbody>
</table>
</div>
</div>

<!-- 🟢 ADD ITEM MODAL (MATCH SUPPLIERS STYLE) -->
<div id="addModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>➕ Add New Item</h3>
            <button type="button" class="modal-close" onclick="closeAddModal()">✕</button>
        </div>

        <form method="POST" class="add-item-form">

            <div class="form-group">
                <label>Item Name <span class="required">*</span></label>
                <input type="text" name="item_name" placeholder="Enter item name" required>
                <small class="help-text">Enter the product name</small>
            </div>

            <div class="form-group">
                <label>Category <span class="required">*</span></label>
                <select name="category_id" required>
                    <option value="">-- Select Category --</option>
                    <?php foreach ($categories as $c): ?>
                        <option value="<?= $c['category_id'] ?>"><?= e($c['category_name']) ?></option>
                    <?php endforeach; ?>
                </select>
                <small class="help-text">Choose the category</small>
            </div>

            <div class="form-group">
                <label>Supplier</label>
                <select name="supplier_id">
                    <option value="">-- Select Supplier --</option>
                    <?php foreach ($suppliers as $s): ?>
                        <option value="<?= $s['supplier_id'] ?>"><?= e($s['supplier_name']) ?></option>
                    <?php endforeach; ?>
                </select>
                <small class="help-text">Optional supplier</small>
            </div>

            <div class="form-group">
                <label>Stock <span class="required">*</span></label>
                <input type="number" name="stock" min="0" placeholder="0" required>
                <small class="help-text">Initial quantity</small>
            </div>

            <div class="form-group">
                <label>Price (₱) <span class="required">*</span></label>
                <input type="number" name="price" step="0.01" min="0" placeholder="0.00" required>
                <small class="help-text">Unit price</small>
            </div>

            <div class="form-group">
                <label>Description</label>
                <textarea name="description" placeholder="Enter item description..."></textarea>
                <small class="help-text">Optional item details</small>
            </div>

            <div class="modal-actions">
                <button type="button" class="btn btn-cancel" onclick="closeAddModal()">Cancel</button>
                <button type="submit" name="add_item" class="btn btn-save">💾 Save Item</button>
            </div>

        </form>
    </div>
</div>

<!-- ✏️ EDIT ITEM MODAL (MATCH SUPPLIERS STYLE) -->
<div id="editModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>✏️ Edit Item</h3>
            <button type="button" class="modal-close" onclick="closeEditModal()">✕</button>
        </div>

        <form method="POST" class="add-item-form">

            <input type="hidden" name="item_id" id="edit_item_id">

            <div class="form-group">
                <label>Item Name <span class="required">*</span></label>
                <input type="text" name="item_name" id="edit_item_name" required>
            </div>

            <div class="form-group">
                <label>Category <span class="required">*</span></label>
                <select name="category_id" id="edit_category_id" required>
                    <option value="">-- Select Category --</option>
                    <?php foreach ($categories as $c): ?>
                        <option value="<?= $c['category_id'] ?>"><?= e($c['category_name']) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="form-group">
                <label>Supplier</label>
                <select name="supplier_id" id="edit_supplier_id">
                    <option value="">-- Select Supplier --</option>
                    <?php foreach ($suppliers as $s): ?>
                        <option value="<?= $s['supplier_id'] ?>"><?= e($s['supplier_name']) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="form-group">
                <label>Stock <span class="required">*</span></label>
                <input type="number" name="stock" id="edit_stock" min="0" required>
            </div>

            <div class="form-group">
                <label>Price (₱) <span class="required">*</span></label>
                <input type="number" name="price" id="edit_price" step="0.01" min="0" required>
            </div>

            <div class="form-group">
                <label>Description</label>
                <textarea name="description" id="edit_description"></textarea>
            </div>

            <div class="modal-actions">
                <button type="button" class="btn btn-cancel" onclick="closeEditModal()">Cancel</button>
                <button type="submit" name="update_item" class="btn btn-save">💾 Update Item</button>
            </div>

        </form>
    </div>
</div>

<script>
function openAddModal() {
  document.getElementById('addModal').style.display = 'flex';
}
function closeAddModal() {
  document.getElementById('addModal').style.display = 'none';
}
function openEditModal(id, name, cat, sup, stock, price, desc) {
  document.getElementById('edit_item_id').value = id;
  document.getElementById('edit_item_name').value = name;
  document.getElementById('edit_category_id').value = cat;
  document.getElementById('edit_supplier_id').value = sup;
  document.getElementById('edit_stock').value = stock;
  document.getElementById('edit_price').value = price;
  document.getElementById('edit_description').value = desc;
  document.getElementById('editModal').style.display = 'flex';
}
function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
}
window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
  }
}
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "add") showPopup("Item added successfully!");
    if (params.get("success") === "update") showPopup("Item updated successfully!");
    if (params.get("success") === "delete") showPopup("Item deleted successfully!");
});

// Show popup
function showPopup(message) {
    const popup = document.getElementById("popupAlert");
    document.getElementById("popupMessage").innerText = message;
    popup.classList.add("show");

    // Auto hide after 2.5s
    setTimeout(() => {
        popup.classList.remove("show");
    }, 2500);
}
</script>

<style>

.content-container {
  padding: 30px 40px;
  background: #f8fafc;
}

.alert { padding:15px 20px; border-radius:8px; margin-bottom:20px; }
.alert-warning { background-color:#fff8e1; border-left:6px solid #facc15; color:#854d0e; }

/* Popup Alert */
.popup-alert {
    position: fixed;
    top: -80px;
    left: 50%;
    transform: translateX(-50%);
    background: #16a34a;
    color: white;
    padding: 14px 26px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    box-shadow: 0 8px 20px rgba(0,0,0,0.25);
    opacity: 0;
    z-index: 3000;
    transition: all 0.4s ease;
}

.popup-alert.show {
    top: 25px;
    opacity: 1;
}

.popup-box {
    display: flex;
    align-items: center;
    gap: 10px;
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

.add-item-form {
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-section {
  display:flex;
  flex-direction:column;
  gap:16px;
}

.section-title {
  font-size:0.95rem;
  font-weight:700;
  color:#2563eb;
  margin:0;
  text-transform:uppercase;
  letter-spacing:0.5px;
}

.form-group { 
  display:flex; 
  flex-direction:column; 
  gap:8px; 
}

.form-group label { 
  font-size:0.9rem; 
  font-weight:600; 
  color:#1e293b;
  display:flex;
  align-items:center;
  gap:4px;
}

.required {
  color:#dc2626;
  font-weight:700;
}

.help-text {
  font-size:0.8rem;
  color:#64748b;
  font-weight:400;
  margin-top:2px;
}

.form-row { 
  display:grid; 
  grid-template-columns:1fr 1fr; 
  gap:16px; 
}

.modal-actions { 
  display:flex; 
  justify-content:center; 
  gap:12px;
  padding-top:16px;
  border-top:1px solid #e5e7eb;
  margin-top:8px;
}

input, select, textarea { 
  padding:11px 14px; 
  border:1.5px solid #e2e8f0; 
  border-radius:10px; 
  width:100%; 
  font-family:'Poppins', sans-serif; 
  font-size:0.9rem;
  color:#1e293b;
  transition:all 0.3s ease;
  background:#f8fafc;
}

input::placeholder, select::placeholder, textarea::placeholder {
  color:#cbd5e1;
}

input:focus, select:focus, textarea:focus { 
  outline:none; 
  border-color:#2563eb; 
  background:#fff;
  box-shadow:0 0 0 4px rgba(37,99,235,0.1);
}

select {
  appearance:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232563eb' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat:no-repeat;
  background-position:right 12px center;
  padding-right:36px;
  cursor:pointer;
}

textarea { 
  resize:vertical; 
  min-height:100px;
  font-family:'Poppins', sans-serif;
}

@media(max-width:600px) {
    .modal-content {
        width: 90%;
        max-width: 500px;
    }
}
</style>
