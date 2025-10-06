-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 06, 2025 at 10:33 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.1.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `car`
--

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `image`, `created_at`) VALUES
(7, 'NISSAN', '/uploads/brands/1759761530897.png', '2025-10-06 14:38:50'),
(8, 'HONDA', '/uploads/brands/1759761551939.png', '2025-10-06 14:39:11'),
(9, 'TOYOTA', '/uploads/brands/1759761622446.png', '2025-10-06 14:40:22');

-- --------------------------------------------------------

--
-- Table structure for table `models`
--

CREATE TABLE `models` (
  `id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `models`
--

INSERT INTO `models` (`id`, `brand_id`, `name`, `image`, `price`, `created_at`) VALUES
(8, 9, 'Yaris Ativ', '/uploads/models/1759761777856.png', 1200.00, '2025-10-06 14:42:57'),
(9, 9, 'Yaris Cross', '/uploads/models/1759761998209.png', 2000.00, '2025-10-06 14:46:38'),
(10, 9, 'Camry', '/uploads/models/1759762109386.png', 2500.00, '2025-10-06 14:48:29'),
(11, 9, 'Fortuner', '/uploads/models/1759762190500.webp', 2800.00, '2025-10-06 14:49:50'),
(12, 8, 'City', '/uploads/models/1759762400257.jpg', 1200.00, '2025-10-06 14:50:31'),
(13, 8, 'Civic', '/uploads/models/1759762262240.png', 2300.00, '2025-10-06 14:51:02'),
(14, 8, 'Accord', '/uploads/models/1759762579265.jpg', 3000.00, '2025-10-06 14:54:24'),
(15, 8, 'HR-V', '/uploads/models/1759762848937.webp', 3000.00, '2025-10-06 14:58:09'),
(16, 7, 'Almera', '/uploads/models/1759763071550.avif', 1200.00, '2025-10-06 15:01:53'),
(17, 7, 'Teana', '/uploads/models/1759763258818.jpg', 2500.00, '2025-10-06 15:07:38'),
(18, 7, 'Terra', '/uploads/models/1759763410184.webp', 3000.00, '2025-10-06 15:10:10');

-- --------------------------------------------------------

--
-- Table structure for table `rentals`
--

CREATE TABLE `rentals` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `brand` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `status` varchar(50) DEFAULT 'รออนุมัติ',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rentals`
--

INSERT INTO `rentals` (`id`, `user_id`, `brand`, `model`, `start_date`, `end_date`, `price`, `status`, `created_at`) VALUES
(1, 2, 'TOYOTA', 'Yaris Ativ', '2025-10-07', '2025-10-09', 3600.00, 'ปฏิเสธ', '2025-10-06 17:58:40'),
(2, 2, 'HONDA', 'City', '2025-10-07', '2025-10-09', 3600.00, 'อนุมัติ', '2025-10-06 18:27:12'),
(3, 2, 'TOYOTA', 'Yaris Ativ', '2025-10-08', '2025-10-09', 2400.00, 'อนุมัติ', '2025-10-06 18:40:39'),
(4, 3, 'HONDA', 'HR-V', '2025-10-08', '2025-10-10', 9000.00, 'อนุมัติ', '2025-10-06 20:08:42');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','student') DEFAULT 'student',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullname`, `email`, `age`, `password`, `role`, `created_at`) VALUES
(1, 'Admin', 'admin@gmail.com', 26, '1111', 'admin', '2025-10-06 09:08:30'),
(2, 'james', '1@gmail.com', 20, '1111', 'student', '2025-10-06 09:08:30'),
(3, 'bonds', '2@gmail.com', 19, '1111', 'student', '2025-10-06 09:08:30'),
(4, 'jj', '3@gmail.com', NULL, '1111', 'student', '2025-10-06 20:11:38');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `models`
--
ALTER TABLE `models`
  ADD PRIMARY KEY (`id`),
  ADD KEY `brand_id` (`brand_id`);

--
-- Indexes for table `rentals`
--
ALTER TABLE `rentals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `models`
--
ALTER TABLE `models`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `rentals`
--
ALTER TABLE `rentals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `models`
--
ALTER TABLE `models`
  ADD CONSTRAINT `models_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rentals`
--
ALTER TABLE `rentals`
  ADD CONSTRAINT `rentals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
