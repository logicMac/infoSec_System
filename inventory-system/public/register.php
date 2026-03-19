<?php 
require_once '../db/db_connect.php';
require_once '../inc/functions.php';
require_once '../inc/security.php';

initSecureSession();

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // CSRF validation
    if (!validateCSRFToken()) {
        $error = 'Invalid security token. Please try again.';
    }
    // Rate limiting
    elseif (!checkRateLimit('register', 3, 600)) {
        $cooldown = getRateLimitCooldown('register');
        $error = "Too many registration attempts. Please try again in " . ceil($cooldown / 60) . " minutes.";
    }
    else {
        $username = trim($_POST['username']);
        $password = trim($_POST['password']);
        $confirm = trim($_POST['confirm']);
        $full_name = trim($_POST['full_name']);
        $email = trim($_POST['email']);
        $role = 'staff'; // Default role for all new users

        // Validate inputs
        if ($username === '' || $password === '' || $confirm === '' || $full_name === '' || $email === '') {
            $error = 'Please fill in all fields.';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $error = 'Please enter a valid email address.';
        } elseif (strlen($password) < 8) {
            $error = 'Password must be at least 8 characters long.';
        } elseif ($password !== $confirm) {
            $error = 'Passwords do not match.';
        } else {
            // Check if username already exists
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM `user` WHERE username = ?");
            $stmt->execute([$username]);
            if ($stmt->fetchColumn() > 0) {
                $error = 'Username already exists. Please choose another.';
            } else {
                // Check if email already exists
                $stmt = $pdo->prepare("SELECT COUNT(*) FROM `user` WHERE email = ?");
                $stmt->execute([$email]);
                if ($stmt->fetchColumn() > 0) {
                    $error = 'Email already registered. Please use another email.';
                } else {
                    // Hash password
                    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

                    // Insert new user
                    $stmt = $pdo->prepare("
                        INSERT INTO `user` (username, password, role, full_name, email)
                        VALUES (?, ?, ?, ?, ?)
                    ");
                    if ($stmt->execute([$username, $hashedPassword, $role, $full_name, $email])) {
                        $success = 'Account created successfully! You can now log in.';
                    } else {
                        $error = 'Error creating account. Please try again.';
                    }
                }
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Register | Inventory Management System</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .register-card {
            background: rgba(255, 255, 255, 0.12);
            backdrop-filter: blur(30px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 50px 55px;
            border-radius: 25px;
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
            width: 100%;
            max-width: 450px;
            text-align: center;
            color: white;
            animation: slideUp 0.8s ease;
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .register-card h2 {
            margin-bottom: 10px;
            font-size: 2.2rem;
            font-weight: 700;
        }

        .register-card .subtitle {
            font-size: 0.95rem;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 30px;
        }

        form {
            display: flex;
            flex-direction: column;
            gap: 18px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        label {
            text-align: left;
            font-size: 0.9rem;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.95);
        }

        input {
            padding: 14px 16px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            font-size: 0.95rem;
            font-family: 'Poppins', sans-serif;
            color: #fff;
            transition: all 0.3s;
        }

        input::placeholder {
            color: rgba(255, 255, 255, 0.6);
        }

        input:focus {
            outline: none;
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.4);
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
        }

        button {
            margin-top: 8px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 14px 20px;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        button:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 30px rgba(102, 126, 234, 0.6);
        }

        .error, .success {
            padding: 14px 16px;
            border-radius: 12px;
            font-size: 0.9rem;
            margin-bottom: 20px;
            text-align: left;
            font-weight: 500;
        }
        .error {
            background: rgba(239, 68, 68, 0.25);
            border: 1px solid rgba(239, 68, 68, 0.5);
            color: #fecaca;
        }
        .success {
            background: rgba(34, 197, 94, 0.25);
            border: 1px solid rgba(34, 197, 94, 0.5);
            color: #bbf7d0;
        }

        .link {
            margin-top: 25px;
            font-size: 0.95rem;
            color: rgba(255, 255, 255, 0.85);
        }
        .link a {
            color: #a8d8ff;
            text-decoration: none;
            font-weight: 700;
            transition: all 0.3s;
        }
        .link a:hover {
            color: #ffffff;
        }
    </style>
</head>
<body>
    <div class="register-card">
        <h2>📝 Create an Account</h2>
        <p class="subtitle">Join our inventory management system</p>

        <?php if ($error): ?>
            <div class="error"><?php echo e($error); ?></div>
        <?php endif; ?>
        <?php if ($success): ?>
            <div class="success"><?php echo e($success); ?></div>
        <?php endif; ?>

        <form method="POST">
            <?php echo csrfField(); ?>
            
            <div class="form-group">
                <label for="full_name">Full Name</label>
                <input type="text" id="full_name" name="full_name" value="<?php echo isset($_POST['full_name']) ? e($_POST['full_name']) : ''; ?>" placeholder="Enter your full name" required>
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" value="<?php echo isset($_POST['email']) ? e($_POST['email']) : ''; ?>" placeholder="Enter your email" required>
            </div>

            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" value="<?php echo isset($_POST['username']) ? e($_POST['username']) : ''; ?>" placeholder="Choose a username" required>
            </div>

            <div class="form-group">
                <label for="password">Password (min 8 characters)</label>
                <input type="password" id="password" name="password" placeholder="Enter a strong password" required minlength="8">
            </div>

            <div class="form-group">
                <label for="confirm">Confirm Password</label>
                <input type="password" id="confirm" name="confirm" placeholder="Confirm your password" required>
            </div>

            <button type="submit">Create Account</button>
        </form>

        <div class="link">
            Already have an account? <a href="login.php">Sign in here</a>
        </div>
    </div>
</body>
</html>
