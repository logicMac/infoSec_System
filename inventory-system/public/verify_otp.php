<?php
require_once '../db/db_connect.php';
require_once '../inc/functions.php';
require_once '../inc/security.php';

initSecureSession();

// Redirect if already logged in
if (isset($_SESSION['user_id']) && !isset($_SESSION['otp_data'])) {
    if ($_SESSION['role'] === 'admin') {
        redirect('../admin/dashboard.php');
    } else {
        redirect('../staff/dashboard.php');
    }
}

// Redirect if no OTP session
if (!isset($_SESSION['otp_data'])) {
    redirect('login.php');
}

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Rate limiting
    if (!checkRateLimit('otp_verify', 5, 300)) {
        $cooldown = getRateLimitCooldown('otp_verify');
        $error = "Too many attempts. Please try again in " . ceil($cooldown / 60) . " minutes.";
    } else {
        $otp = trim($_POST['otp']);
        
        if (empty($otp)) {
            $error = 'Please enter the OTP code.';
        } else {
            $result = verifyOTP($otp);
            
            if ($result['success']) {
                // Get user data
                $stmt = $pdo->prepare("SELECT * FROM user WHERE user_id = ?");
                $stmt->execute([$result['user_id']]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($user) {
                    // Set session
                    $_SESSION['user_id'] = $user['user_id'];
                    $_SESSION['username'] = $user['username'];
                    $_SESSION['role'] = $user['role'];
                    $_SESSION['last_activity'] = time();
                    
                    regenerateSession();
                    
                    // Redirect by role
                    if ($user['role'] === 'admin') {
                        redirect('../admin/dashboard.php');
                    } else {
                        redirect('../staff/dashboard.php');
                    }
                }
            } else {
                $error = $result['message'];
            }
        }
    }
}

// Get remaining time
$remainingTime = 0;
if (isset($_SESSION['otp_data'])) {
    $remainingTime = max(0, $_SESSION['otp_data']['expires_at'] - time());
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Verify OTP | Inventory Management System</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
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
            height: 100vh;
            min-height: 100vh;
            overflow: hidden;
        }

        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .otp-card {
            background: rgba(255, 255, 255, 0.12);
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 50px 55px;
            border-radius: 25px;
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2);
            width: 100%;
            max-width: 420px;
            text-align: center;
            color: white;
            animation: slideUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes slideUp {
            from { 
                opacity: 0; 
                transform: translateY(40px);
            }
            to { 
                opacity: 1; 
                transform: translateY(0);
            }
        }

        .otp-card h2 {
            margin-bottom: 10px;
            font-size: 2.2rem;
            font-weight: 700;
            letter-spacing: -0.5px;
            background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .otp-card .subtitle {
            font-size: 0.95rem;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 30px;
            font-weight: 400;
            letter-spacing: 0.3px;
        }

        .timer {
            background: rgba(255, 255, 255, 0.15);
            padding: 12px;
            border-radius: 10px;
            margin-bottom: 20px;
            font-size: 1.1rem;
            font-weight: 600;
        }

        .timer.expired {
            background: rgba(239, 68, 68, 0.25);
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
            letter-spacing: 0.3px;
        }

        input {
            padding: 14px 16px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            font-size: 1.2rem;
            font-family: 'Poppins', sans-serif;
            color: #fff;
            text-align: center;
            letter-spacing: 8px;
            font-weight: 600;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        input::placeholder {
            color: rgba(255, 255, 255, 0.6);
            letter-spacing: normal;
        }

        input:focus {
            outline: none;
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.4);
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
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
            font-family: 'Poppins', sans-serif;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            letter-spacing: 0.5px;
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        button:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 30px rgba(102, 126, 234, 0.6);
        }

        .error {
            background: rgba(239, 68, 68, 0.25);
            border: 1px solid rgba(239, 68, 68, 0.5);
            color: #fecaca;
            padding: 14px 16px;
            border-radius: 12px;
            font-size: 0.9rem;
            margin-bottom: 20px;
            text-align: left;
            animation: shake 0.5s ease-in-out;
            font-weight: 500;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }

        .link {
            margin-top: 25px;
            font-size: 0.95rem;
            color: rgba(255, 255, 255, 0.85);
            font-weight: 500;
        }

        .link a {
            color: #a8d8ff;
            text-decoration: none;
            font-weight: 700;
            transition: all 0.3s ease;
        }

        .link a:hover {
            color: #ffffff;
        }
    </style>
</head>
<body>
    <div class="otp-card">
        <h2>🔐 Verify OTP</h2>
        <p class="subtitle">Enter the 6-digit code sent to your email</p>

        <div class="timer <?php echo $remainingTime <= 0 ? 'expired' : ''; ?>" id="timer">
            Time remaining: <span id="countdown"><?php echo gmdate('i:s', $remainingTime); ?></span>
        </div>

        <?php if ($error): ?>
            <div class="error"><?php echo e($error); ?></div>
        <?php endif; ?>

        <form method="POST">
            <div class="form-group">
                <label for="otp">OTP Code</label>
                <input type="text" id="otp" name="otp" maxlength="6" pattern="[0-9]{6}" required placeholder="000000" autocomplete="off">
            </div>

            <button type="submit">Verify OTP</button>
        </form>

        <div class="link">
            <a href="login.php">← Back to Login</a>
        </div>
    </div>

    <script>
        let remainingTime = <?php echo $remainingTime; ?>;
        const countdownEl = document.getElementById('countdown');
        const timerEl = document.getElementById('timer');

        const interval = setInterval(() => {
            remainingTime--;
            
            if (remainingTime <= 0) {
                clearInterval(interval);
                countdownEl.textContent = 'EXPIRED';
                timerEl.classList.add('expired');
            } else {
                const minutes = Math.floor(remainingTime / 60);
                const seconds = remainingTime % 60;
                countdownEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }
        }, 1000);

        // Auto-format OTP input
        document.getElementById('otp').addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    </script>
</body>
</html>
