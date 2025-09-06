-- EcoFinds Complete Database Schema
-- Execute this script to create a clean database structure

-- Create database (uncomment if needed)
-- CREATE DATABASE IF NOT EXISTS ecofinds;
-- USE ecofinds;

-- Drop existing tables to avoid conflicts
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS purchases;
DROP TABLE IF EXISTS purchase_items;
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- Users table for authentication
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    display_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    profile_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_display_name (display_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User sessions table (optional, for session management)
CREATE TABLE user_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session_token (session_token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products table for marketplace listings
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    condition_type VARCHAR(20),
    brand VARCHAR(50),
    model VARCHAR(50),
    year_manufactured INT,
    dimensions VARCHAR(100),
    weight DECIMAL(8,2),
    material VARCHAR(50),
    color VARCHAR(30),
    original_packaging BOOLEAN DEFAULT FALSE,
    manual_included BOOLEAN DEFAULT FALSE,
    working_condition TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_sold BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    seller_id BIGINT NOT NULL,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_category (category),
    INDEX idx_seller_id (seller_id),
    INDEX idx_is_active (is_active),
    INDEX idx_is_sold (is_sold),
    INDEX idx_created_at (created_at),
    INDEX idx_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data for testing
-- Password: "password123" (hashed with bcrypt)
INSERT INTO users (display_name, email, password_hash) VALUES 
('Eco User', 'test@ecofinds.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi'),
('Green Shopper', 'green@ecofinds.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi'),
('Test User', 'test@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi');

-- Cart items table for shopping cart functionality
CREATE TABLE cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Purchases table for order history
CREATE TABLE purchases (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'completed',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_purchase_date (purchase_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Purchase items table for individual items in purchases
CREATE TABLE purchase_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    purchase_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_purchase_id (purchase_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample products for testing
INSERT INTO products (title, description, category, price, quantity, condition_type, brand, seller_id) VALUES 
('Vintage Wooden Chair', 'Beautiful vintage wooden chair in excellent condition. Perfect for dining room or study.', 'Furniture', 45.00, 1, 'Good', 'Vintage', 1),
('iPhone 12 Pro', 'iPhone 12 Pro in excellent condition. No scratches, comes with original charger.', 'Electronics', 650.00, 1, 'Like New', 'Apple', 2),
('Designer Handbag', 'Luxury designer handbag, barely used. Original packaging included.', 'Clothing', 120.00, 1, 'Like New', 'Gucci', 1),
('Programming Books Bundle', 'Collection of 5 programming books: Java, Python, JavaScript, React, and Node.js', 'Books', 35.00, 1, 'Good', 'Various', 3),
('Yoga Mat', 'Eco-friendly yoga mat made from natural rubber. Used only a few times.', 'Sports', 25.00, 1, 'Like New', 'EcoYoga', 2);

-- Verify table structures
SHOW TABLES;
DESCRIBE users;
DESCRIBE user_sessions;
DESCRIBE products;
DESCRIBE cart_items;
DESCRIBE purchases;
DESCRIBE purchase_items;

-- Show sample data
SELECT id, display_name, email, created_at, is_active FROM users;
SELECT id, title, category, price, seller_id, created_at FROM products;
