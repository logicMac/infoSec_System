<?php
session_start();
require_once '../db/db_connect.php';
require_once '../inc/functions.php';

// 🔐 Check if logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

// 🔐 Get current user role
$current_role = $_SESSION['role'] ?? 'staff';

// 🚫 Restrict access to admins only
if ($current_role !== 'admin') {
    header("Location: dashboard.php?err=Access denied! Admins only.");
    exit;
}

// === Handle Delete ===
if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];

    // Prevent deleting yourself
    if ($id === (int)$_SESSION['user_id']) {
        header("Location: users.php?err=You cannot delete your own account!");
        exit;
    }

    $stmt = $pdo->prepare("SELECT role FROM user WHERE user_id = ?");
    $stmt->execute([$id]);
    $role = $stmt->fetchColumn();

    if ($role && $role !== 'admin') {
        $pdo->prepare("DELETE FROM user WHERE user_id = ?")->execute([$id]);
        header("Location: users.php?msg=User deleted successfully");
        exit;
    } else {
        header("Location: users.php?err=You cannot delete another admin!");
        exit;
    }
}

// === Handle Add/Update ===
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $full_name = trim($_POST['full_name']);
    $username  = trim($_POST['username']);
    $email     = trim($_POST['email']);
    $password  = $_POST['password'];
    $role      = $_POST['role'];
    $id        = $_POST['user_id'] ?? '';

    // Update existing user
    if ($id) {
        // Prevent editing yourself as admin (role change or delete)
        if ((int)$id === (int)$_SESSION['user_id']) {
            header("Location: users.php?err=You cannot modify your own account!");
            exit;
        }

        $stmt = $pdo->prepare("SELECT role FROM user WHERE user_id = ?");
        $stmt->execute([$id]);
        $userRole = $stmt->fetchColumn();

        if ($userRole && $userRole !== 'admin') {
            $query = "UPDATE user SET full_name=?, username=?, email=?, role=?";
            $params = [$full_name, $username, $email, $role];

            if (!empty($password)) {
                $query .= ", password=?";
                $params[] = password_hash($password, PASSWORD_DEFAULT);
            }

            $query .= " WHERE user_id=?";
            $params[] = $id;

            $stmt = $pdo->prepare($query);
            $stmt->execute($params);

            header("Location: users.php?msg=User updated successfully");
            exit;
        } else {
            header("Location: users.php?err=You cannot update another admin!");
            exit;
        }

    } else {
        // Add new user
        $stmt = $pdo->prepare("INSERT INTO user (full_name, username, password, role, email) VALUES (?,?,?,?,?)");
        $stmt->execute([
            $full_name,
            $username,
            password_hash($password, PASSWORD_DEFAULT),
            $role,
            $email
        ]);
        header("Location: users.php?msg=User created successfully");
        exit;
    }
}

// === Fetch All Users ===
$users = $pdo->query("SELECT * FROM user ORDER BY user_id DESC")->fetchAll(PDO::FETCH_ASSOC);

// ✅ Include header after logic
require_once '../inc/header.php';
?>

<main class="main-content">
  <div class="user-management-container">
    <div class="user-header">
      <h2>👥 User Management</h2>
      <?php if ($current_role === 'admin'): ?>
        <button class="add-btn" onclick="openForm()">+ Add User</button>
      <?php endif; ?>
    </div>

    <?php if (isset($_GET['msg'])): ?>
      <div class="alert success"><?= htmlspecialchars($_GET['msg']) ?></div>
    <?php elseif (isset($_GET['err'])): ?>
      <div class="alert error"><?= htmlspecialchars($_GET['err']) ?></div>
    <?php endif; ?>

    <div class="table-container">
      <table class="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($users as $u): ?>
          <tr>
            <td><?= $u['user_id'] ?></td>
            <td><?= htmlspecialchars($u['full_name']) ?></td>
            <td><?= htmlspecialchars($u['username']) ?></td>
            <td><?= htmlspecialchars($u['email']) ?></td>
            <td><span class="role <?= $u['role'] ?>"><?= ucfirst($u['role']) ?></span></td>
            <td>
              <?php if ($u['role'] === 'admin'): ?>
                <span class="no-action">🔒 Protected</span>
              <?php else: ?>
                <div class="action-btns">
                  <button class="edit-btn" onclick='editUser(<?= json_encode($u) ?>)'>Edit</button>
                  <a href="?delete=<?= $u['user_id'] ?>" onclick="return confirm('Delete this user?')" class="delete-btn">Delete</a>
                </div>
              <?php endif; ?>
            </td>
          </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  </div>
</main>

<!-- ===== MODAL ===== -->
<div id="userFormModal" class="modal">
  <div class="modal-content">
    <h3 id="modalTitle">Add User</h3>
    <form method="POST" class="user-form">
      <input type="hidden" name="user_id" id="userId">

      <label>Full Name</label>
      <input type="text" name="full_name" id="userFullName" required>

      <label>Username</label>
      <input type="text" name="username" id="userUsername" required>

      <label>Email</label>
      <input type="email" name="email" id="userEmail" required>

      <label>Password</label>
      <input type="password" name="password" id="userPassword">

      <label>Role</label>
      <select name="role" id="userRole" required>
        <option value="staff">Staff</option>
        <option value="admin">Admin</option>
      </select>

      <div class="form-actions">
        <button type="submit" class="save-btn">Save</button>
        <button type="button" class="cancel-btn" onclick="closeForm()">Cancel</button>
      </div>
    </form>
  </div>
</div>

<style>
.main-content {
  padding: 40px;
  background: #f1f5f9;
  min-height: 100vh;
}

.user-management-container {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  padding: 25px 30px;
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.user-header h2 {
  font-size: 1.6rem;
  font-weight: 600;
  color: #1e293b;
}

.add-btn {
  background: #3b82f6;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: 0.3s;
}
.add-btn:hover { background: #1d4ed8; }

.table-container { overflow-x: auto; }

.user-table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
}

.user-table th {
  background: #f3f4f6;
  color: #374151;
  text-align: left;
  padding: 12px 15px;
  font-weight: 600;
  font-size: 0.95rem;
}

.user-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #e5e7eb;
  color: #1e293b;
}

.role.admin { color: #dc2626; font-weight: bold; }
.role.staff { color: #16a34a; font-weight: bold; }

.action-btns { display: flex; gap: 8px; }

.edit-btn, .delete-btn {
  width: 75px;
  text-align: center;
  padding: 6px 0;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
  transition: 0.3s;
  border: none;
}

.edit-btn { background: #3b82f6; }
.edit-btn:hover { background: #1e40af; }
.delete-btn { background: #ef4444; }
.delete-btn:hover { background: #b91c1c; }

.no-action {
  color: #9ca3af;
  font-style: italic;
  font-weight: 500;
}

.alert {
  margin-bottom: 15px;
  padding: 10px 15px;
  border-radius: 8px;
  font-weight: 500;
}
.alert.success { background: #dcfce7; color: #166534; }
.alert.error { background: #fee2e2; color: #991b1b; }

.modal {
  display: none;
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.4);
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal-content {
  background: #fff;
  padding: 25px;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
  animation: scaleIn 0.25s ease;
}
@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.user-form label {
  display: block;
  margin-top: 10px;
  color: #374151;
  font-weight: 500;
}

.user-form input, .user-form select {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
  gap: 10px;
}

.save-btn { background: #10b981; color: #fff; border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer; }
.cancel-btn { background: #9ca3af; color: #fff; border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer; }
</style>

<script>
function openForm() {
  document.getElementById('userFormModal').style.display = 'flex';
  document.getElementById('modalTitle').textContent = 'Add User';
  document.getElementById('userId').value = '';
  document.getElementById('userFullName').value = '';
  document.getElementById('userUsername').value = '';
  document.getElementById('userEmail').value = '';
  document.getElementById('userPassword').value = '';
  document.getElementById('userRole').value = 'staff';
}

function closeForm() {
  document.getElementById('userFormModal').style.display = 'none';
}

function editUser(user) {
  document.getElementById('userFormModal').style.display = 'flex';
  document.getElementById('modalTitle').textContent = 'Edit User';
  document.getElementById('userId').value = user.user_id;
  document.getElementById('userFullName').value = user.full_name;
  document.getElementById('userUsername').value = user.username;
  document.getElementById('userEmail').value = user.email;
  document.getElementById('userRole').value = user.role;
  document.getElementById('userPassword').value = '';
}

window.onclick = function(event) {
  const modal = document.getElementById('userFormModal');
  if (event.target === modal) modal.style.display = 'none';
};
</script>
