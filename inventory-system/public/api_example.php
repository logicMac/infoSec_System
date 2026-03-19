<?php
/**
 * Example API Endpoint with Security Features
 * This demonstrates how to create a secure API endpoint
 */

require_once '../inc/api_protection.php';
require_once '../db/db_connect.php';

// Protect this endpoint
// Parameters: endpoint_name, allowed_methods, require_auth, rate_limit_type
secureAPIEndpoint('products_api', ['GET', 'POST'], true, 'read');

// Validate origin
validateOrigin();

// Handle GET request - List products
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? min((int)$_GET['limit'], 100) : 20;
        $offset = ($page - 1) * $limit;
        
        // Get total count
        $totalStmt = $pdo->query("SELECT COUNT(*) FROM item");
        $total = $totalStmt->fetchColumn();
        
        // Get products
        $stmt = $pdo->prepare("
            SELECT i.*, c.category_name, s.supplier_name 
            FROM item i
            LEFT JOIN category c ON i.category_id = c.category_id
            LEFT JOIN supplier s ON i.supplier_id = s.supplier_id
            ORDER BY i.item_id DESC
            LIMIT ? OFFSET ?
        ");
        $stmt->execute([$limit, $offset]);
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        sendJSONResponse([
            'success' => true,
            'data' => $products,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => ceil($total / $limit)
            ]
        ], 200);
        
    } catch (PDOException $e) {
        sendJSONResponse([
            'success' => false,
            'error' => 'Database error occurred'
        ], 500);
    }
}

// Handle POST request - Create product
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get JSON input
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Sanitize input
        $input = sanitizeAPIInput($input);
        
        // Validate required fields
        $required = ['item_name', 'category_id', 'supplier_id', 'stock', 'price'];
        foreach ($required as $field) {
            if (!isset($input[$field]) || $input[$field] === '') {
                sendJSONResponse([
                    'success' => false,
                    'error' => "Missing required field: {$field}"
                ], 400);
            }
        }
        
        // Insert product
        $stmt = $pdo->prepare("
            INSERT INTO item (item_name, category_id, supplier_id, stock, price)
            VALUES (?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $input['item_name'],
            $input['category_id'],
            $input['supplier_id'],
            $input['stock'],
            $input['price']
        ]);
        
        $productId = $pdo->lastInsertId();
        
        sendJSONResponse([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => ['item_id' => $productId]
        ], 201);
        
    } catch (PDOException $e) {
        sendJSONResponse([
            'success' => false,
            'error' => 'Failed to create product'
        ], 500);
    }
}
?>
