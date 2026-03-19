-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 17, 2025 at 04:11 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `inventory_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`category_id`, `category_name`, `description`, `created_at`) VALUES
(1, 'Electronics', 'Electronic devices and accessories', '2025-11-04 19:39:37'),
(2, 'Office Supplies', 'Items used in offices', '2025-11-04 19:39:37'),
(3, 'Furniture', 'Office and home furniture', '2025-11-04 19:39:37'),
(4, 'Food & Beverage', 'Consumable products', '2025-11-04 19:39:37'),
(5, 'Cleaning Supplies', 'Janitorial and cleaning products', '2025-11-04 19:39:37'),
(6, 'Stationery', 'Writing materials and related items', '2025-11-05 11:02:33'),
(7, 'Hardware', 'Tools and maintenance equipment', '2025-11-05 11:02:33'),
(8, 'Kitchen Supplies', 'Utensils and kitchen equipment', '2025-11-05 11:02:33'),
(9, 'Personal Care', 'Hygiene and grooming items', '2025-11-05 11:02:33'),
(10, 'Lighting', 'Bulbs and lighting fixtures', '2025-11-05 11:02:33');

-- --------------------------------------------------------

--
-- Table structure for table `item`
--

CREATE TABLE `item` (
  `item_id` int(11) NOT NULL,
  `item_name` varchar(150) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `price` decimal(10,2) DEFAULT 0.00,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item`
--

INSERT INTO `item` (`item_id`, `item_name`, `category_id`, `supplier_id`, `stock`, `price`, `created_at`) VALUES
(1, 'Laptop', 1, 1, 10, 45000.00, '2025-11-04 19:39:37'),
(2, 'Wireless Mouse', 1, 1, 50, 500.00, '2025-11-04 19:39:37'),
(3, 'Office Chair', 3, 3, 15, 2500.00, '2025-11-04 19:39:37'),
(4, 'Printer Ink', 1, 1, 30, 700.00, '2025-11-04 19:39:37'),
(5, 'Paper Ream A4', 2, 2, 100, 250.00, '2025-11-04 19:39:37'),
(6, 'Coffee 3-in-1', 4, 2, 80, 8.00, '2025-11-04 19:39:37'),
(7, 'Broom', 5, 2, 25, 100.00, '2025-11-04 19:39:37'),
(8, 'Dishwashing Liquid', 5, 2, 20, 120.00, '2025-11-04 19:39:37'),
(9, 'Desk Table', 3, 3, 8, 3200.00, '2025-11-04 19:39:37'),
(10, 'Monitor 24-inch', 1, 1, 12, 6000.00, '2025-11-04 19:39:37'),
(11, 'Ceiling Light LED', 10, 10, 25, 350.00, '2025-11-05 11:02:33'),
(12, 'Electric Fan 16-inch', 1, 7, 15, 1500.00, '2025-11-05 11:02:33'),
(13, 'Hand Soap 500ml', 9, 8, 60, 75.00, '2025-11-05 11:02:33'),
(14, 'Tool Set 12pcs', 7, 6, 10, 1200.00, '2025-11-05 11:02:33'),
(15, 'Stapler Heavy Duty', 6, 3, 40, 180.00, '2025-11-05 11:02:33');

-- --------------------------------------------------------

--
-- Table structure for table `item_detail`
--

CREATE TABLE `item_detail` (
  `detail_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item_detail`
--

INSERT INTO `item_detail` (`detail_id`, `item_id`, `description`, `created_at`) VALUES
(1, 1, '15-inch laptop with 8GB RAM and 512GB SSD', '2025-11-04 19:39:37'),
(2, 2, 'Ergonomic wireless mouse, USB receiver included', '2025-11-04 19:39:37'),
(3, 3, 'Adjustable office chair with wheels', '2025-11-04 19:39:37'),
(4, 4, 'Black printer ink cartridge for HP models', '2025-11-04 19:39:37'),
(5, 5, 'A4 size 500 sheets per ream', '2025-11-04 19:39:37'),
(6, 6, 'Instant coffee mix 3-in-1 pack', '2025-11-04 19:39:37'),
(7, 7, 'Eco broom made from native materials', '2025-11-04 19:39:37'),
(8, 8, 'Lemon-scent dishwashing liquid, 1L', '2025-11-04 19:39:37'),
(9, 9, 'Wooden office desk with drawers', '2025-11-04 19:39:37'),
(10, 10, 'LED monitor, 24-inch widescreen', '2025-11-04 19:39:37'),
(11, 11, 'LED ceiling light 18W daylight', '2025-11-05 11:02:33'),
(12, 12, '16-inch oscillating electric fan', '2025-11-05 11:02:33'),
(13, 13, 'Antibacterial liquid hand soap', '2025-11-05 11:02:33'),
(14, 14, '12-piece stainless steel tool set', '2025-11-05 11:02:33'),
(15, 15, 'Heavy duty stapler for thick documents', '2025-11-05 11:02:33');

-- --------------------------------------------------------

--
-- Table structure for table `purchase`
--

CREATE TABLE `purchase` (
  `purchase_id` int(11) NOT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `purchase_date` date NOT NULL,
  `total_amount` decimal(12,2) DEFAULT NULL,
  `status` enum('pending','completed','cancelled') DEFAULT 'pending',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase`
--

INSERT INTO `purchase` (`purchase_id`, `supplier_id`, `user_id`, `purchase_date`, `total_amount`, `status`, `created_at`) VALUES
(4, 1, 1, '2025-02-10', 45000.00, 'completed', '2025-11-05 11:02:33'),
(5, 2, 3, '2025-03-15', 15000.00, 'completed', '2025-11-05 11:02:33'),
(6, 3, 1, '2025-04-05', 8000.00, 'completed', '2025-11-05 11:02:33'),
(7, 4, 3, '2025-05-12', 12000.00, 'completed', '2025-11-05 11:02:33'),
(8, 5, 1, '2025-06-01', 9500.00, 'completed', '2025-11-05 11:02:33'),
(9, 6, 3, '2025-07-20', 10000.00, 'completed', '2025-11-05 11:02:33'),
(10, 7, 1, '2025-08-15', 22000.00, 'completed', '2025-11-05 11:02:33'),
(11, 8, 3, '2025-09-05', 17000.00, 'completed', '2025-11-05 11:02:33'),
(12, 9, 1, '2025-10-03', 11000.00, 'completed', '2025-11-05 11:02:33'),
(13, 10, 3, '2025-10-25', 13000.00, 'completed', '2025-11-05 11:02:33'),
(14, 1, 1, '2025-11-13', 10000.00, 'pending', '2025-11-13 21:24:52');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_item`
--

CREATE TABLE `purchase_item` (
  `purchase_item_id` int(11) NOT NULL,
  `purchase_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `cost_price` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(12,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_item`
--

INSERT INTO `purchase_item` (`purchase_item_id`, `purchase_id`, `item_id`, `quantity`, `cost_price`, `subtotal`) VALUES
(1, 4, 1, 2, 42000.00, 84000.00),
(2, 5, 2, 10, 450.00, 4500.00),
(3, 6, 3, 5, 2400.00, 12000.00),
(4, 7, 4, 8, 650.00, 5200.00),
(5, 8, 5, 15, 200.00, 3000.00),
(6, 9, 6, 20, 7.00, 140.00),
(7, 10, 7, 5, 90.00, 450.00),
(8, 4, 8, 10, 110.00, 1100.00),
(9, 5, 9, 3, 3000.00, 9000.00),
(10, 6, 10, 2, 5500.00, 11000.00);

-- --------------------------------------------------------

--
-- Table structure for table `report`
--

CREATE TABLE `report` (
  `report_id` int(11) NOT NULL,
  `report_type` enum('sale','purchase') NOT NULL,
  `sale_id` int(11) DEFAULT NULL,
  `purchase_id` int(11) DEFAULT NULL,
  `reference_date` date NOT NULL,
  `subject` varchar(150) DEFAULT NULL,
  `total_amount` decimal(12,2) DEFAULT NULL,
  `generated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `report`
--

INSERT INTO `report` (`report_id`, `report_type`, `sale_id`, `purchase_id`, `reference_date`, `subject`, `total_amount`, `generated_by`) VALUES
(1, 'sale', 1, NULL, '2025-02-11', 'Carlos Lim', 1000.00, 1),
(2, 'sale', 2, NULL, '2025-03-16', 'Mia Santos', 2500.00, 3),
(3, 'sale', 3, NULL, '2025-04-06', 'Rico Chan', 45000.00, 1),
(4, 'sale', 4, NULL, '2025-05-13', 'Anna Dela Cruz', 3500.00, 3),
(5, 'sale', 5, NULL, '2025-06-02', 'Jomar Reyes', 5000.00, 1),
(6, 'sale', 6, NULL, '2025-07-21', 'Liza Morales', 160.00, 3),
(7, 'sale', 7, NULL, '2025-08-16', 'Paolo Ramos', 1200.00, 1),
(8, 'sale', 8, NULL, '2025-09-06', 'Grace Uy', 3200.00, 3),
(9, 'sale', 9, NULL, '2025-10-04', 'Kevin Tan', 12000.00, 1),
(10, 'sale', 10, NULL, '2025-10-26', 'Sofia Garcia', 1400.00, 3),
(16, 'purchase', NULL, 4, '2025-02-10', 'TechWorld Inc.', 85100.00, 1),
(17, 'purchase', NULL, 5, '2025-03-15', 'OfficePro Supplies', 13500.00, 3),
(18, 'purchase', NULL, 6, '2025-04-05', 'HomeStyle Furnishings', 23000.00, 1),
(19, 'purchase', NULL, 7, '2025-05-12', 'BrightLight Co.', 5200.00, 3),
(20, 'purchase', NULL, 8, '2025-06-01', 'HandyTools PH', 3000.00, 1),
(21, 'purchase', NULL, 9, '2025-07-20', 'PaperMart', 140.00, 3),
(22, 'purchase', NULL, 10, '2025-08-15', 'Brew & Co.', 450.00, 1);

-- --------------------------------------------------------

--
-- Table structure for table `sale`
--

CREATE TABLE `sale` (
  `sale_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `sale_date` date NOT NULL,
  `customer_name` varchar(150) DEFAULT NULL,
  `total_amount` decimal(12,2) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sale`
--

INSERT INTO `sale` (`sale_id`, `user_id`, `sale_date`, `customer_name`, `total_amount`, `created_at`) VALUES
(1, 1, '2025-02-11', 'Carlos Lim', 1200.00, '2025-11-05 11:02:33'),
(2, 3, '2025-03-16', 'Mia Santos', 2500.00, '2025-11-05 11:02:33'),
(3, 1, '2025-04-06', 'Rico Chan', 8000.00, '2025-11-05 11:02:33'),
(4, 3, '2025-05-13', 'Anna Dela Cruz', 9500.00, '2025-11-05 11:02:33'),
(5, 1, '2025-06-02', 'Jomar Reyes', 7200.00, '2025-11-05 11:02:33'),
(6, 3, '2025-07-21', 'Liza Morales', 3000.00, '2025-11-05 11:02:33'),
(7, 1, '2025-08-16', 'Paolo Ramos', 5000.00, '2025-11-05 11:02:33'),
(8, 3, '2025-09-06', 'Grace Uy', 15000.00, '2025-11-05 11:02:33'),
(9, 1, '2025-10-04', 'Kevin Tan', 11000.00, '2025-11-05 11:02:33'),
(10, 3, '2025-10-26', 'Sofia Garcia', 13000.00, '2025-11-05 11:02:33'),
(11, 1, '2025-11-16', 'Carlos Yulo', 10000.00, '2025-11-16 23:00:29'),
(12, 1, '2025-11-16', 'Carlos Yulo', 1000.00, '2025-11-16 23:06:22');

-- --------------------------------------------------------

--
-- Table structure for table `sale_item`
--

CREATE TABLE `sale_item` (
  `sale_item_id` int(11) NOT NULL,
  `sale_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(12,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sale_item`
--

INSERT INTO `sale_item` (`sale_item_id`, `sale_id`, `item_id`, `quantity`, `price`, `subtotal`) VALUES
(1, 1, 2, 2, 500.00, 1000.00),
(2, 2, 5, 10, 250.00, 2500.00),
(3, 3, 1, 1, 45000.00, 45000.00),
(4, 4, 4, 5, 700.00, 3500.00),
(5, 5, 3, 2, 2500.00, 5000.00),
(6, 6, 6, 20, 8.00, 160.00),
(7, 7, 8, 10, 120.00, 1200.00),
(8, 8, 9, 1, 3200.00, 3200.00),
(9, 9, 10, 2, 6000.00, 12000.00),
(10, 10, 11, 4, 350.00, 1400.00);

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE `supplier` (
  `supplier_id` int(11) NOT NULL,
  `supplier_name` varchar(150) NOT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supplier`
--

INSERT INTO `supplier` (`supplier_id`, `supplier_name`, `contact_person`, `phone`, `email`, `address`, `created_at`) VALUES
(1, 'TechWorld Inc.', 'Anna Reyes', '09171234567', 'anna@techworld.com', 'Makati City', '2025-11-04 19:39:37'),
(2, 'OfficePro Supplies', 'Carlos Dela Cruz', '09182345678', 'carlos@officepro.com', 'Quezon City', '2025-11-04 19:39:37'),
(3, 'HomeStyle Furnishings', 'Maria Gomez', '09203456789', 'maria@homestyle.com', 'Pasig City', '2025-11-04 19:39:37'),
(4, 'BrightLight Co.', 'Jose Ramirez', '09181234567', 'jose@brightlight.com', 'Cebu City', '2025-11-05 11:02:33'),
(5, 'HandyTools PH', 'Rico Santos', '09193334455', 'rico@handytools.ph', 'Davao City', '2025-11-05 11:02:33'),
(6, 'PaperMart', 'Angela Torres', '09228889999', 'angela@papermart.com', 'Taguig City', '2025-11-05 11:02:33'),
(7, 'Brew & Co.', 'Liza Mendoza', '09351112233', 'liza@brewco.com', 'Mandaluyong City', '2025-11-05 11:02:33'),
(8, 'HygieCorp', 'Mario Cruz', '09190002211', 'mario@hygiecorp.com', 'Caloocan City', '2025-11-05 11:02:33'),
(9, 'FixIt Supply', 'Nestor Dizon', '09214443322', 'nestor@fixit.com', 'Antipolo City', '2025-11-05 11:02:33'),
(10, 'SparkElectro', 'Patricia Ong', '09175557777', 'patricia@sparkelectro.com', 'Pasay City', '2025-11-05 11:02:33'),
(12, 'Mac', 'poultry', '09518235942', 'efrelyn63@gmail.com', 'polomolok', '2025-11-16 23:07:56');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','staff') DEFAULT 'staff',
  `full_name` varchar(150) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `username`, `password`, `role`, `full_name`, `email`, `created_at`) VALUES
(1, 'admin', '$2y$10$8jyLn80BSyy1QKL9..ULoeUP1d2h3qHbOm3ETi93sITBicybgTLhS', 'admin', 'Juan Dela Cruz', 'sample@email.com', '2025-11-04 19:44:00'),
(3, 'staff', '$2y$10$xbfQn5rIFwV.gXguMbhz8uuv9soigAXpVUZhEpSoDPVdoHOeno30.', 'staff', 'Maria Santos', 'maria@email.com', '2025-11-04 19:56:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `category_name` (`category_name`);

--
-- Indexes for table `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `supplier_id` (`supplier_id`);

--
-- Indexes for table `item_detail`
--
ALTER TABLE `item_detail`
  ADD PRIMARY KEY (`detail_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `purchase`
--
ALTER TABLE `purchase`
  ADD PRIMARY KEY (`purchase_id`),
  ADD KEY `supplier_id` (`supplier_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `purchase_item`
--
ALTER TABLE `purchase_item`
  ADD PRIMARY KEY (`purchase_item_id`),
  ADD KEY `purchase_id` (`purchase_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `sale_id` (`sale_id`),
  ADD KEY `purchase_id` (`purchase_id`),
  ADD KEY `generated_by` (`generated_by`);

--
-- Indexes for table `sale`
--
ALTER TABLE `sale`
  ADD PRIMARY KEY (`sale_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `sale_item`
--
ALTER TABLE `sale_item`
  ADD PRIMARY KEY (`sale_item_id`),
  ADD KEY `sale_id` (`sale_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`supplier_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `item`
--
ALTER TABLE `item`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `item_detail`
--
ALTER TABLE `item_detail`
  MODIFY `detail_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `purchase`
--
ALTER TABLE `purchase`
  MODIFY `purchase_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `purchase_item`
--
ALTER TABLE `purchase_item`
  MODIFY `purchase_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `report`
--
ALTER TABLE `report`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `sale`
--
ALTER TABLE `sale`
  MODIFY `sale_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `sale_item`
--
ALTER TABLE `sale_item`
  MODIFY `sale_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `supplier_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `item`
--
ALTER TABLE `item`
  ADD CONSTRAINT `item_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `item_ibfk_2` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`supplier_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `item_detail`
--
ALTER TABLE `item_detail`
  ADD CONSTRAINT `item_detail_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase`
--
ALTER TABLE `purchase`
  ADD CONSTRAINT `purchase_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`supplier_id`),
  ADD CONSTRAINT `purchase_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `purchase_item`
--
ALTER TABLE `purchase_item`
  ADD CONSTRAINT `purchase_item_ibfk_1` FOREIGN KEY (`purchase_id`) REFERENCES `purchase` (`purchase_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_item_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`) ON DELETE CASCADE;

--
-- Constraints for table `report`
--
ALTER TABLE `report`
  ADD CONSTRAINT `report_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sale` (`sale_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `report_ibfk_2` FOREIGN KEY (`purchase_id`) REFERENCES `purchase` (`purchase_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `report_ibfk_3` FOREIGN KEY (`generated_by`) REFERENCES `user` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `sale`
--
ALTER TABLE `sale`
  ADD CONSTRAINT `sale_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `sale_item`
--
ALTER TABLE `sale_item`
  ADD CONSTRAINT `sale_item_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sale` (`sale_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sale_item_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
