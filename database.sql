CREATE DATABASE IF NOT EXISTS infoSec_System;

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255),
    password VARCHAR(255),
    role ENUM('admin', 'customer','staff', 'seller'),
    phone_Number VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    address VARCHAR(255),
    street_address VARCHAR(255),
    city VARCHAR(255),
    barangay VARCHAR(255),
    province VARCHAR(255),
    postal_code VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_otps (
    otp_id INT PRIMARY_KEY AUTO_INCREMENT,
    user_id INT FOREIGN KEY,    
    otp VARCHAR(255),  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    F0REIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE 
);

CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    image VARCHAR(255),

);

CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT FOREIGN KEY,
    user_id INT FOREIGN KEY,
    total_price DECIMAL(10, 2) NOT NULL,
    address VARCHAR(255) FOREIGN KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);