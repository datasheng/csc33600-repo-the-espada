-- DROP DATABASE goldLinks;
-- CREATE DATABASE goldLinks;
-- USE goldLinks;

-- Step 1: Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Step 2: Drop all tables
DROP TABLE IF EXISTS user_update;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS store_hours;
DROP TABLE IF EXISTS store;
DROP TABLE IF EXISTS store_owners;
DROP TABLE IF EXISTS users;

-- Step 3: Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
CREATE TABLE users (
    userID INTEGER AUTO_INCREMENT PRIMARY KEY,
    -- username VARCHAR(50), (No longer using this here since we
decided to use first and last names instead of usernames)
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    user_password VARCHAR(255),
    email VARCHAR(50) UNIQUE
);

CREATE TABLE store_owners (
    ownerID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
);

CREATE TABLE store (
    storeID INT AUTO_INCREMENT PRIMARY KEY,
    ownerID INT NOT NULL,
    store_name VARCHAR(50) NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0.00,
    address TEXT NOT NULL,
    latitude DECIMAL(10,7) NOT NULL,
    longitude DECIMAL(10,7) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    FOREIGN KEY (ownerID) REFERENCES store_owners(ownerID) ON DELETE CASCADE
);

CREATE TABLE product (
    productID INT AUTO_INCREMENT PRIMARY KEY,
    storeID INT NOT NULL,
    chain_type VARCHAR(50),
    chain_purity VARCHAR(50),
    chain_thickness DECIMAL(6,2) CHECK (chain_thickness > 0),
    chain_length DECIMAL(5,2) CHECK (chain_length > 0),
    chain_color VARCHAR(50),
    chain_weight DECIMAL(6,2) CHECK (chain_weight > 0),
    set_price DECIMAL(10,2) CHECK (set_price >= 0),
    FOREIGN KEY (storeID) REFERENCES store(storeID) ON DELETE CASCADE
);

CREATE TABLE subscriptions (
    subscriptionID INT AUTO_INCREMENT PRIMARY KEY,
    storeID INT NOT NULL,
    transactionID VARCHAR(100),
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_date DATETIME NOT NULL,
    join_fee DECIMAL(10,2),
    FOREIGN KEY (storeID) REFERENCES store(storeID) ON DELETE CASCADE
);

CREATE TABLE store_hours (
    storeHourID INT AUTO_INCREMENT PRIMARY KEY,
    storeID INT NOT NULL,
    daysOpen ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday',
'Friday', 'Saturday', 'Sunday') NOT NULL,
    openTime TIME,
    closeTime TIME,
    FOREIGN KEY (storeID) REFERENCES store(storeID) ON DELETE CASCADE
);

CREATE TABLE user_update (
    updateID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    productID INT NOT NULL,
    storeID INT NOT NULL,
    -- latest_price DECIMAL(10,2), (No longer using this here)
    rating INT CHECK (rating BETWEEN 1 AND 5),
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE,
    FOREIGN KEY (productID) REFERENCES product(productID) ON DELETE CASCADE,
    FOREIGN KEY (storeID) REFERENCES store(storeID) ON DELETE CASCADE
);

CREATE TABLE price_history (
    historyID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    productID INT NOT NULL,
    storeID INT NOT NULL,
    latest_price DECIMAL(10,2) NOT NULL,
    purchase_date DATETIME NOT NULL,
    FOREIGN KEY (userID) REFERENCES users(userID),
    FOREIGN KEY (productID) REFERENCES product(productID),
    FOREIGN KEY (storeID) REFERENCES store(storeID)
);


