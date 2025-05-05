-- Enable Row Level Security (RLS) on tables
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_products ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access on all tables
CREATE POLICY "Allow public read access for vendors" 
ON vendors FOR SELECT USING (true);

CREATE POLICY "Allow public read access for categories" 
ON categories FOR SELECT USING (true);

CREATE POLICY "Allow public read access for products" 
ON products FOR SELECT USING (true);

CREATE POLICY "Allow public read access for product_categories" 
ON product_categories FOR SELECT USING (true);

CREATE POLICY "Allow public read access for vendor_products" 
ON vendor_products FOR SELECT USING (true);

CREATE POLICY "Allow public read access for product_images" 
ON product_images FOR SELECT USING (true);

CREATE POLICY "Allow public read access for product_attributes" 
ON product_attributes FOR SELECT USING (true);

CREATE POLICY "Allow public read access for featured_products" 
ON featured_products FOR SELECT USING (true);