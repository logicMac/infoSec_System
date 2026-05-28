-- Migration to fix orders table schema
-- Run this in your MySQL database

-- Step 1: Check if customer_id column exists, if not rename user_Id to customer_id
-- Note: Adjust the column name based on what you actually have in your database

-- If your column is named 'user_Id' (with capital I), run this:
ALTER TABLE orders 
CHANGE COLUMN user_Id customer_id INT NOT NULL;

-- If your column is named 'user_id' (lowercase), run this instead:
-- ALTER TABLE orders 
-- CHANGE COLUMN user_id customer_id INT NOT NULL;

-- Step 2: Ensure the column has proper foreign key constraint
ALTER TABLE orders
ADD CONSTRAINT fk_orders_customer
FOREIGN KEY (customer_id) REFERENCES users(user_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Step 3: Verify the changes
DESCRIBE orders;

-- Step 4: Check if order_items table exists and has proper structure
DESCRIBE order_items;

-- If order_items doesn't exist, create it:
-- CREATE TABLE IF NOT EXISTS order_items (
--     item_id INT AUTO_INCREMENT PRIMARY KEY,
--     order_id INT NOT NULL,
--     product_id INT NOT NULL,
--     quantity INT NOT NULL,
--     total_price DECIMAL(10,2) NOT NULL,
--     size VARCHAR(10),
--     Vat DECIMAL(10,2) DEFAULT 0,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
--     FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
-- );
