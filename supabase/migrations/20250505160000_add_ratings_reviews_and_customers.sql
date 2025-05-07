-- Combined migration for ratings, reviews, and customer management
-- Migration timestamp: 20250505160000

-- Set timezone to UTC for all timestamps
SET timezone = 'UTC';

-- Function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Product ratings table (aggregate ratings)
CREATE TABLE product_ratings (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    average_rating DECIMAL(3, 2) NOT NULL CHECK (average_rating >= 1 AND average_rating <= 5),
    rating_count INT DEFAULT 0,
    one_star_count INT DEFAULT 0,
    two_star_count INT DEFAULT 0,
    three_star_count INT DEFAULT 0,
    four_star_count INT DEFAULT 0,
    five_star_count INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (product_id)
);

-- Customer table (can be linked to auth.users or exist independently for guest checkout)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    is_guest BOOLEAN DEFAULT FALSE,
    default_shipping_address_id UUID,
    default_billing_address_id UUID,
    marketing_opt_in BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    UNIQUE (auth_user_id),
    CONSTRAINT email_unique_if_not_guest UNIQUE (email, is_guest)
);

-- Customer address table
CREATE TABLE customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    address_type VARCHAR(20) NOT NULL, -- 'billing', 'shipping', 'both'
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    is_default_shipping BOOLEAN DEFAULT FALSE,
    is_default_billing BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraints for default addresses
ALTER TABLE customers
    ADD CONSTRAINT fk_default_shipping_address
    FOREIGN KEY (default_shipping_address_id)
    REFERENCES customer_addresses(id)
    ON DELETE SET NULL;

ALTER TABLE customers
    ADD CONSTRAINT fk_default_billing_address
    FOREIGN KEY (default_billing_address_id)
    REFERENCES customer_addresses(id)
    ON DELETE SET NULL;

-- Product reviews table (individual reviews)
CREATE TABLE product_reviews (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    vendor_id INT REFERENCES vendors(id) ON DELETE SET NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    helpful_votes INT DEFAULT 0,
    verified_purchase BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Review images
CREATE TABLE review_images (
    id SERIAL PRIMARY KEY,
    review_id INT REFERENCES product_reviews(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    caption VARCHAR(255),
    position INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Review reactions (helpful/unhelpful)
CREATE TABLE review_reactions (
    id SERIAL PRIMARY KEY,
    review_id INT REFERENCES product_reviews(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) NOT NULL, -- 'helpful', 'unhelpful'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (review_id, customer_id)
);

-- Create function to automatically create a customer record when a new auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.customers (auth_user_id, email, first_name, last_name, is_guest)
    VALUES (
        NEW.id, 
        NEW.email, 
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        FALSE
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function when a new auth user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to update aggregate ratings when reviews change
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Create rating record if it doesn't exist
    INSERT INTO product_ratings (product_id, average_rating, rating_count)
    VALUES (NEW.product_id, NEW.rating, 1)
    ON CONFLICT (product_id) DO UPDATE SET
        average_rating = (
            (product_ratings.average_rating * product_ratings.rating_count + NEW.rating) / 
            (product_ratings.rating_count + 1)
        ),
        rating_count = product_ratings.rating_count + 1,
        one_star_count = CASE WHEN NEW.rating = 1 THEN product_ratings.one_star_count + 1 ELSE product_ratings.one_star_count END,
        two_star_count = CASE WHEN NEW.rating = 2 THEN product_ratings.two_star_count + 1 ELSE product_ratings.two_star_count END,
        three_star_count = CASE WHEN NEW.rating = 3 THEN product_ratings.three_star_count + 1 ELSE product_ratings.three_star_count END,
        four_star_count = CASE WHEN NEW.rating = 4 THEN product_ratings.four_star_count + 1 ELSE product_ratings.four_star_count END,
        five_star_count = CASE WHEN NEW.rating = 5 THEN product_ratings.five_star_count + 1 ELSE product_ratings.five_star_count END,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update ratings automatically
CREATE TRIGGER after_review_insert
AFTER INSERT ON product_reviews
FOR EACH ROW
WHEN (NEW.status = 'approved')
EXECUTE FUNCTION update_product_rating();

-- Create orders table for customer purchases
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    order_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
    shipping_address_id UUID REFERENCES customer_addresses(id) ON DELETE SET NULL,
    billing_address_id UUID REFERENCES customer_addresses(id) ON DELETE SET NULL,
    shipping_method VARCHAR(100),
    payment_method VARCHAR(100),
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
    subtotal DECIMAL(12, 2) NOT NULL,
    tax DECIMAL(12, 2) NOT NULL DEFAULT 0,
    shipping_cost DECIMAL(12, 2) NOT NULL DEFAULT 0,
    discount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE SET NULL,
    vendor_product_id INT REFERENCES vendor_products(id) ON DELETE SET NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for all tables
ALTER TABLE product_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for customers
CREATE POLICY "Users can view their own customer profile"
    ON customers FOR SELECT
    USING (auth_user_id = auth.uid() OR is_guest = TRUE);

CREATE POLICY "Users can update their own customer profile"
    ON customers FOR UPDATE
    USING (auth_user_id = auth.uid());

-- RLS policies for customer addresses
CREATE POLICY "Users can view their own addresses"
    ON customer_addresses FOR SELECT
    USING ((SELECT auth_user_id FROM customers WHERE id = customer_addresses.customer_id) = auth.uid() 
           OR (SELECT is_guest FROM customers WHERE id = customer_addresses.customer_id) = TRUE);

CREATE POLICY "Users can update their own addresses"
    ON customer_addresses FOR UPDATE
    USING ((SELECT auth_user_id FROM customers WHERE id = customer_addresses.customer_id) = auth.uid());

CREATE POLICY "Users can insert their own addresses"
    ON customer_addresses FOR INSERT
    WITH CHECK ((SELECT auth_user_id FROM customers WHERE id = customer_id) = auth.uid() 
                OR (SELECT is_guest FROM customers WHERE id = customer_id) = TRUE);

CREATE POLICY "Users can delete their own addresses"
    ON customer_addresses FOR DELETE
    USING ((SELECT auth_user_id FROM customers WHERE id = customer_addresses.customer_id) = auth.uid());

-- RLS policies for ratings and reviews
CREATE POLICY "Ratings are viewable by everyone"
    ON product_ratings FOR SELECT
    USING (true);

CREATE POLICY "Approved reviews are viewable by everyone"
    ON product_reviews FOR SELECT
    USING (status = 'approved');

CREATE POLICY "Users can view their own reviews regardless of status"
    ON product_reviews FOR SELECT
    USING ((SELECT auth_user_id FROM customers WHERE id = product_reviews.customer_id) = auth.uid());

CREATE POLICY "Users can insert their own reviews"
    ON product_reviews FOR INSERT
    WITH CHECK ((SELECT auth_user_id FROM customers WHERE id = customer_id) = auth.uid());

CREATE POLICY "Users can update their own reviews"
    ON product_reviews FOR UPDATE
    USING ((SELECT auth_user_id FROM customers WHERE id = customer_id) = auth.uid());

CREATE POLICY "Review images are viewable by everyone"
    ON review_images FOR SELECT
    USING (true);

-- RLS policies for orders
CREATE POLICY "Users can view their own orders"
    ON orders FOR SELECT
    USING ((SELECT auth_user_id FROM customers WHERE id = orders.customer_id) = auth.uid() 
           OR (SELECT is_guest FROM customers WHERE id = orders.customer_id) = TRUE);

CREATE POLICY "Users can create orders"
    ON orders FOR INSERT
    WITH CHECK ((SELECT auth_user_id FROM customers WHERE id = customer_id) = auth.uid()
                OR (SELECT is_guest FROM customers WHERE id = customer_id) = TRUE);

-- RLS policies for order items
CREATE POLICY "Users can view their own order items"
    ON order_items FOR SELECT
    USING ((SELECT customer_id FROM orders WHERE id = order_items.order_id) IN 
           (SELECT id FROM customers WHERE auth_user_id = auth.uid() OR is_guest = TRUE));

-- Create automatic updated_at triggers for all tables
CREATE TRIGGER update_product_ratings_updated_at BEFORE UPDATE ON product_ratings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_addresses_updated_at BEFORE UPDATE ON customer_addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE ON product_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_images_updated_at BEFORE UPDATE ON review_images
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_items_updated_at BEFORE UPDATE ON order_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_customers_auth_user_id ON customers(auth_user_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customer_addresses_customer ON customer_addresses(customer_id);
CREATE INDEX idx_product_reviews_product ON product_reviews (product_id);
CREATE INDEX idx_product_reviews_customer ON product_reviews (customer_id);
CREATE INDEX idx_product_reviews_status ON product_reviews (status);
CREATE INDEX idx_review_images_review ON review_images (review_id);
CREATE INDEX idx_review_reactions_review ON review_reactions (review_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);