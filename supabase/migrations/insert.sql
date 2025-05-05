-- First, insert the categories
INSERT INTO categories (name) VALUES
('Companion'),
('Utility'),
('Security'),
('Education'),
('Healthcare'),
('Industrial');

-- Insert brands as vendors
INSERT INTO vendors (name, website) VALUES
('RoboTech', 'https://robotech.example.com'),
('AIMasters', 'https://aimasters.example.com'),
('Synthia', 'https://synthia.example.com'),
('MechWorks', 'https://mechworks.example.com'),
('QuantumBots', 'https://quantumbots.example.com');

-- Insert the products
INSERT INTO products (sku, name, description, brand, weight, created_at) VALUES
('SYNX2000', 'Syntho X-2000 Humanoid Assistant', 'The Syntho X-2000 is our most advanced humanoid assistant robot, designed to seamlessly integrate into your home or office environment. With advanced AI capabilities, natural language processing, and fluid movement, the X-2000 can assist with daily tasks, provide companionship, and serve as a personal assistant.', 'RoboTech', 75.0, NOW()),
('HOMEBOTPRO', 'HomeBot Pro', 'Meet HomeBot Pro, your ultimate smart home management system. This compact utility robot integrates with all your smart devices and provides physical assistance around the house, from cleaning to cooking assistance and security monitoring.', 'MechWorks', 38.5, NOW()),
('EDUMATE', 'EduMate Teaching Assistant', 'The EduMate Teaching Assistant is designed to revolutionize education with personalized learning experiences. Using advanced AI, it adapts to each student''s learning style and pace, providing custom lessons, interactive demonstrations, and real-time feedback.', 'Synthia', 41.0, NOW()),
('GUARDIAN', 'Guardian Security Bot', 'The Guardian Security Bot provides enterprise-grade security with 24/7 autonomous patrol, advanced threat detection, and immediate response protocols. Ideal for businesses, large properties, and high-security environments requiring constant vigilance.', 'QuantumBots', 100.0, NOW()),
('MEDICARE', 'MediCare Assistance Robot', 'The MediCare Assistance Robot is designed for healthcare facilities and home care, providing patient monitoring, medication management, mobility assistance, and companionship. Its advanced medical sensors and gentle handling capabilities make it ideal for elderly and recovering patients.', 'AIMasters', 63.5, NOW()),
('INDUSBOT', 'IndustriBot Heavy Lifter', 'The IndustriBot Heavy Lifter is engineered for manufacturing, warehousing, and construction environments, capable of safely lifting and transporting up to 2000 lbs while navigating complex workspaces autonomously. Its modular design allows for customization based on specific industrial needs.', 'MechWorks', 250.0, NOW());

-- Link products to categories (assuming the IDs match the order of insertion)
INSERT INTO product_categories (product_id, category_id)
VALUES
(1, 1), -- Syntho X-2000 in Companion
(2, 2), -- HomeBot Pro in Utility
(3, 4), -- EduMate in Education
(4, 3), -- Guardian in Security
(5, 5), -- MediCare in Healthcare
(6, 6); -- IndustriBot in Industrial

-- Add product images with bucket URLs
INSERT INTO product_images (product_id, url, alt_text, position)
VALUES
(1, 'https://supabase.example.com/storage/v1/object/public/product-images/robot1.png', 'Syntho X-2000 Humanoid Assistant', 1),
(2, 'https://supabase.example.com/storage/v1/object/public/product-images/robot2.png', 'HomeBot Pro', 1),
(3, 'https://supabase.example.com/storage/v1/object/public/product-images/robot3.png', 'EduMate Teaching Assistant', 1),
(4, 'https://supabase.example.com/storage/v1/object/public/product-images/robot4.png', 'Guardian Security Bot', 1),
(5, 'https://supabase.example.com/storage/v1/object/public/product-images/robot5.png', 'MediCare Assistance Robot', 1),
(6, 'https://supabase.example.com/storage/v1/object/public/product-images/robot6.png', 'IndustriBot Heavy Lifter', 1);

-- Add product attributes (specifications)
INSERT INTO product_attributes (product_id, key, value)
VALUES
-- Syntho X-2000 specs
(1, 'height', '5''7" (170 cm)'),
(1, 'weight', '165 lbs (75 kg)'),
(1, 'battery', 'Lithium-ion, 16 hours operation'),
(1, 'processor', 'Quantum Neural Processor X12'),
(1, 'memory', '1 TB solid state'),
(1, 'connectivity', 'Wi-Fi 6, Bluetooth 5.2, 5G'),
(1, 'sensors', 'LiDAR, infrared, temperature, pressure, audio array'),

-- HomeBot Pro specs
(2, 'height', '3''6" (107 cm)'),
(2, 'weight', '85 lbs (38.5 kg)'),
(2, 'battery', 'Dual lithium polymer, 20 hours operation'),
(2, 'processor', 'HomeCore H3 Neural Engine'),
(2, 'memory', '512 GB solid state'),
(2, 'connectivity', 'Wi-Fi 6E, Bluetooth 5.3, Zigbee, Matter'),
(2, 'sensors', '360° LiDAR, thermal imaging, proximity array, microphone array'),

-- EduMate specs
(3, 'height', '4''2" (127 cm)'),
(3, 'weight', '90 lbs (41 kg)'),
(3, 'battery', 'Advanced lithium-ion, 12 hours teaching time'),
(3, 'processor', 'Synthia Education Neural Core'),
(3, 'memory', '2 TB knowledge database'),
(3, 'connectivity', 'Wi-Fi 6, Bluetooth 5.2, NFC, educational network protocols'),
(3, 'sensors', '360° classroom awareness, emotional response detection, attention tracking'),

-- Guardian specs
(4, 'height', '5''10" (178 cm)'),
(4, 'weight', '220 lbs (100 kg)'),
(4, 'battery', 'Military-grade power cells, 72 hour operation'),
(4, 'processor', 'Quantum Security Processing Unit'),
(4, 'memory', '1 TB encrypted solid state'),
(4, 'connectivity', 'Secure Wi-Fi, private LTE, satellite backup'),
(4, 'sensors', 'Thermal imaging, night vision, motion detection, audio analytics, chemical sensors'),

-- MediCare specs
(5, 'height', '5''4" (163 cm)'),
(5, 'weight', '140 lbs (63.5 kg)'),
(5, 'battery', 'Medical-grade power system, 16 hours operation'),
(5, 'processor', 'AIMasters Medical Neural Processor'),
(5, 'memory', '2 TB medical database and patient records'),
(5, 'connectivity', 'HIPAA-compliant secure networks, emergency services integration'),
(5, 'sensors', 'Medical-grade vitals monitoring, position tracking, environment assessment'),

-- IndustriBot specs
(6, 'height', '6''2" (188 cm) - extendable to 8'''),
(6, 'weight', '550 lbs (250 kg) base configuration'),
(6, 'battery', 'Industrial power system, hot-swappable for 24/7 operation'),
(6, 'processor', 'MechWorks Industrial Logic Engine'),
(6, 'memory', '1 TB industrial operations database'),
(6, 'connectivity', 'Industrial IoT protocols, secure facility network integration'),
(6, 'sensors', 'Weight distribution, structural integrity, human presence detection, environmental hazard detection');

-- Add vendor-specific product listings with prices and stock
INSERT INTO vendor_products (vendor_id, product_id, price, stock)
VALUES
-- Assuming vendor_id matches the order of insertion above
(1, 1, 4999.99, 12), -- RoboTech selling Syntho X-2000
(4, 2, 3299.99, 8),  -- MechWorks selling HomeBot Pro
(3, 3, 3799.99, 15), -- Synthia selling EduMate
(5, 4, 4599.99, 6),  -- QuantumBots selling Guardian
(2, 5, 5299.99, 9),  -- AIMasters selling MediCare
(4, 6, 7999.99, 4);  -- MechWorks selling IndustriBot

-- Set featured products for homepage
INSERT INTO featured_products (product_id, vendor_id, position)
VALUES
(1, 1, 1),
(3, 3, 2),
(5, 2, 3),
(4, 5, 4),
(6, 4, 5),
(2, 4, 6);