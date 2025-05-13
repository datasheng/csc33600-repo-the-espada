-- Insert sample users
INSERT INTO users (username, user_password, email, account_type) VALUES
('john_doe', 'hashed_password_1', 'john@example.com', 'business'),
('jane_smith', 'hashed_password_2', 'jane@example.com', 'business'),
('mike_wilson', 'hashed_password_3', 'mike@example.com', 'consumer');

-- Insert store owners
INSERT INTO store_owners (userID) VALUES
(1), -- john_doe
(2); -- jane_smith

-- Insert stores
INSERT INTO store (ownerID, store_name, rating, address, latitude, longitude, phone, email) VALUES
(1, 'Golden Treasures', 4.5, '123 Main St, New York, NY 10001', 40.7128, -74.0060, '212-555-0101', 'contact@goldentreasures.com'),
(2, 'Luxury Gold Emporium', 4.8, '456 Park Ave, New York, NY 10022', 40.7589, -73.9692, '212-555-0202', 'info@luxurygold.com');

-- Insert store hours
INSERT INTO store_hours (storeID, day, openTime, closeTime) VALUES
(1, 'Monday', '09:00:00', '18:00:00'),
(1, 'Tuesday', '09:00:00', '18:00:00'),
(1, 'Wednesday', '09:00:00', '18:00:00'),
(1, 'Thursday', '09:00:00', '18:00:00'),
(1, 'Friday', '09:00:00', '18:00:00'),
(1, 'Saturday', '10:00:00', '16:00:00'),
(2, 'Monday', '10:00:00', '19:00:00'),
(2, 'Tuesday', '10:00:00', '19:00:00'),
(2, 'Wednesday', '10:00:00', '19:00:00'),
(2, 'Thursday', '10:00:00', '19:00:00'),
(2, 'Friday', '10:00:00', '19:00:00'),
(2, 'Saturday', '11:00:00', '17:00:00');

-- Insert products (gold chains)
INSERT INTO product (storeID, chain_type, chain_purity, chain_thickness, chain_length, chain_color, chain_weight, set_price) VALUES
-- Golden Treasures products
(1, 'Cuban Link', '24K', 5.00, 20.00, 'Yellow Gold', 50.00, 3500.00),
(1, 'Rope Chain', '18K', 3.50, 24.00, 'Yellow Gold', 35.00, 2800.00),
(1, 'Box Chain', '14K', 2.00, 18.00, 'White Gold', 15.00, 1200.00),
(1, 'Franco Chain', '22K', 4.50, 22.00, 'Yellow Gold', 45.00, 3200.00),

-- Luxury Gold Emporium products
(2, 'Cuban Link', '24K', 6.00, 22.00, 'Yellow Gold', 65.00, 4500.00),
(2, 'Rope Chain', '18K', 4.00, 24.00, 'Rose Gold', 40.00, 3200.00),
(2, 'Box Chain', '14K', 2.50, 20.00, 'White Gold', 20.00, 1500.00),
(2, 'Franco Chain', '22K', 5.00, 24.00, 'Yellow Gold', 55.00, 3800.00);

-- Insert some user updates (ratings and price updates)
INSERT INTO user_update (userID, productID, storeID, latest_price, rating, submitted_at) VALUES
(3, 1, 1, 3400.00, 5, NOW()),
(3, 2, 1, 2750.00, 4, NOW()),
(1, 5, 2, 4400.00, 5, NOW()),
(2, 6, 2, 3150.00, 4, NOW()); 