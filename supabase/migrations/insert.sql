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

-- Create test customers for reviews
INSERT INTO customers (id, email, first_name, last_name, is_guest) 
VALUES
  ('11111111-1111-1111-1111-111111111111', 'alex.johnson@example.com', 'Alex', 'Johnson', FALSE),
  ('22222222-2222-2222-2222-222222222222', 'maya.patel@example.com', 'Maya', 'Patel', FALSE),
  ('33333333-3333-3333-3333-333333333333', 'carlos.rodriguez@example.com', 'Carlos', 'Rodriguez', FALSE),
  ('44444444-4444-4444-4444-444444444444', 'sarah.williams@example.com', 'Sarah', 'Williams', FALSE),
  ('55555555-5555-5555-5555-555555555555', 'james.peterson@example.com', 'James', 'Peterson', FALSE),
  ('66666666-6666-6666-6666-666666666666', 'emma.chen@example.com', 'Emma', 'Chen', FALSE),
  ('77777777-7777-7777-7777-777777777777', 'robert.chen@example.com', 'Robert', 'Chen', FALSE),
  ('88888888-8888-8888-8888-888888888888', 'lisa.montgomery@example.com', 'Lisa', 'Montgomery', FALSE),
  ('99999999-9999-9999-9999-999999999999', 'guest.user@example.com', 'Guest', 'User', TRUE);

-- Add product ratings - one entry per product
INSERT INTO product_ratings (product_id, average_rating, rating_count, one_star_count, two_star_count, three_star_count, four_star_count, five_star_count)
VALUES
  (1, 4.8, 7, 0, 0, 0, 1, 6),  -- Syntho X-2000
  (2, 4.3, 4, 0, 0, 1, 1, 2),  -- HomeBot Pro
  (3, 4.9, 8, 0, 0, 0, 1, 7),  -- EduMate
  (4, 4.7, 5, 0, 0, 0, 2, 3),  -- Guardian
  (5, 5.0, 6, 0, 0, 0, 0, 6),  -- MediCare
  (6, 4.6, 5, 0, 0, 1, 0, 4);  -- IndustriBot

-- Add reviews for Syntho X-2000
INSERT INTO product_reviews (product_id, customer_id, rating, title, comment, helpful_votes, verified_purchase, status)
VALUES
  (1, '11111111-1111-1111-1111-111111111111', 5, 'Absolutely Amazing Assistant', 'The X-2000 has completely transformed how I manage my home office. The assistance with scheduling and communications alone is worth the investment!', 12, TRUE, 'approved'),
  (1, '22222222-2222-2222-2222-222222222222', 4, 'Great But Battery Could Be Better', 'Impressive AI capabilities and very human-like interactions. Battery life could be better, but otherwise it''s been a great addition to our family.', 8, TRUE, 'approved'),
  (1, '33333333-3333-3333-3333-333333333333', 5, 'Perfect Companion', 'My elderly father has found a new companion in the X-2000. The robot has been helping him with medication reminders and keeping him engaged with conversation and games.', 15, TRUE, 'approved');

-- Add reviews for HomeBot Pro
INSERT INTO product_reviews (product_id, customer_id, rating, title, comment, helpful_votes, verified_purchase, status)
VALUES
  (2, '44444444-4444-4444-4444-444444444444', 5, 'Home Transformation Complete', 'The HomeBot Pro completely transformed our home. It handles cleaning, helps me cook, and manages all our smart devices seamlessly.', 7, TRUE, 'approved'),
  (2, '55555555-5555-5555-5555-555555555555', 3, 'Kitchen Features Need Work', 'Good utility robot overall, but the kitchen assistance features need improvement. Sometimes struggles with identifying ingredients correctly.', 4, TRUE, 'approved'),
  (2, '66666666-6666-6666-6666-666666666666', 4, 'Security Features Are Great', 'Very reliable for home management. The security features give me peace of mind when I''m away, and it integrates well with all my existing smart devices.', 9, TRUE, 'approved');

-- Add reviews for EduMate
INSERT INTO product_reviews (product_id, customer_id, rating, title, comment, helpful_votes, verified_purchase, status)
VALUES
  (3, '77777777-7777-7777-7777-777777777777', 5, 'Revolutionary Learning Tool', 'As an educator for 20 years, I''m impressed by EduMate''s ability to adapt to different learning styles. The personalization capabilities are far beyond what a single human teacher can provide.', 18, TRUE, 'approved'),
  (3, '88888888-8888-8888-8888-888888888888', 5, 'My Kids Love Learning Now', 'My children have shown remarkable improvement in math and science since we got the EduMate. The way it presents complex concepts visually is incredible.', 11, TRUE, 'approved'),
  (3, '99999999-9999-9999-9999-999999999999', 4, 'Great for Schools', 'We''ve deployed five EduMates in our elementary school. Test scores have improved by 28% on average, and student engagement is noticeably higher. Would give 5 stars but there are occasional connectivity issues.', 14, FALSE, 'approved');

-- Add reviews for Guardian Security Bot
INSERT INTO product_reviews (product_id, customer_id, rating, title, comment, helpful_votes, verified_purchase, status)
VALUES
  (4, '11111111-1111-1111-1111-111111111111', 5, 'Enterprise Security Excellence', 'Deployed across our corporate campus, the Guardian bots have significantly improved our security posture. The threat detection is impressively accurate with minimal false alarms.', 6, TRUE, 'approved'),
  (4, '44444444-4444-4444-4444-444444444444', 4, 'Great for Large Properties', 'Excellent perimeter security and the integration with our existing systems was seamless. Only wish it had better battery life for our large facility.', 3, TRUE, 'approved'),
  (4, '66666666-6666-6666-6666-666666666666', 5, 'Perfect for Estate Security', 'We''ve implemented three Guardians across our client''s 15-acre estate. The coordination between units is impressive, and the mobile app control gives us complete oversight.', 9, TRUE, 'approved');

-- Add reviews for MediCare
INSERT INTO product_reviews (product_id, customer_id, rating, title, comment, helpful_votes, verified_purchase, status)
VALUES
  (5, '22222222-2222-2222-2222-222222222222', 5, 'Revolutionary Healthcare Robot', 'The MediCare robots have transformed our nursing home. Staff are now able to focus on higher-level care while the robots handle routine monitoring and assistance. Patient satisfaction has increased dramatically.', 16, TRUE, 'approved'),
  (5, '33333333-3333-3333-3333-333333333333', 5, 'Perfect for Home Care', 'I''ve prescribed MediCare robots to several elderly patients living independently. The combination of medical monitoring and companionship features has allowed many to safely remain in their homes longer.', 12, TRUE, 'approved'),
  (5, '55555555-5555-5555-5555-555555555555', 5, 'Excellent for Rehabilitation', 'Excellent for patient monitoring and consistent therapy reminders. The mobility assistance features are particularly valuable for our recovering stroke patients.', 8, TRUE, 'approved');

-- Add reviews for IndustriBot
INSERT INTO product_reviews (product_id, customer_id, rating, title, comment, helpful_votes, verified_purchase, status)
VALUES
  (6, '77777777-7777-7777-7777-777777777777', 5, 'Manufacturing Game Changer', 'We''ve integrated six IndustriBots into our production line and seen a 35% increase in efficiency. The ability to work continuously alongside human workers without safety incidents has been impressive.', 7, TRUE, 'approved'),
  (6, '88888888-8888-8888-8888-888888888888', 4, 'Great for High Volume', 'Great for our high-volume warehouse. The autonomous navigation is excellent even in our constantly changing environment. Only drawback is the initial programming complexity.', 5, TRUE, 'approved'),
  (6, '99999999-9999-9999-9999-999999999999', 5, 'Worth Every Penny', 'The IndustriBot has revolutionized how we handle heavy materials on our construction sites. Workplace injuries are down and we''re completing projects ahead of schedule.', 11, FALSE, 'approved');

-- Add some review images
INSERT INTO review_images (review_id, url, caption, position)
VALUES
  (1, 'https://qkfqyhipifcronawvjkl.supabase.co/storage/v1/object/public/review-images/synx2000-review.jpg', 'My Syntho X-2000 helping with office tasks', 1),
  (7, 'https://qkfqyhipifcronawvjkl.supabase.co/storage/v1/object/public/review-images/edumate-classroom.jpg', 'EduMate teaching in our classroom', 1),
  (10, 'https://qkfqyhipifcronawvjkl.supabase.co/storage/v1/object/public/review-images/medicare-monitoring.jpg', 'MediCare monitoring vitals', 1),
  (13, 'https://qkfqyhipifcronawvjkl.supabase.co/storage/v1/object/public/review-images/industribot-warehouse.jpg', 'IndustriBot in our warehouse', 1);