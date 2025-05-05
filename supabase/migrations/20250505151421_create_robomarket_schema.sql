-- ROBOMARKET DATABASE SCHEMA
-- Migration timestamp: 20250505151421

-- Vendors (resellers)
CREATE TABLE vendors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    website TEXT,
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Categories (robot types, with optional hierarchy)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    parent_id INT REFERENCES categories(id) ON DELETE SET NULL
);

-- Products (robot catalog)
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    brand VARCHAR(100),
    weight DECIMAL(10, 2),
    length DECIMAL(10, 2),
    width DECIMAL(10, 2),
    height DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Product-Category (many-to-many)
CREATE TABLE product_categories (
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

-- Vendor-specific listings (price + stock per vendor)
CREATE TABLE vendor_products (
    id SERIAL PRIMARY KEY,
    vendor_id INT REFERENCES vendors(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    vendor_sku VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    UNIQUE (vendor_id, product_id)
);

-- Product images
CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text VARCHAR(255),
    position INT DEFAULT 0
);

-- Product attributes (flexible key-value pairs)
CREATE TABLE product_attributes (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    key VARCHAR(100) NOT NULL,
    value VARCHAR(255) NOT NULL
);

-- Featured products (for homepage display)
CREATE TABLE featured_products (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    vendor_id INT REFERENCES vendors(id) ON DELETE CASCADE,
    position INT DEFAULT 0,  -- lower = higher priority on front page
    featured_since TIMESTAMP DEFAULT NOW(),
    UNIQUE (product_id, vendor_id)
);

CREATE INDEX idx_product_categories_category ON product_categories (category_id);
CREATE INDEX idx_vendor_products_vendor ON vendor_products (vendor_id);
CREATE INDEX idx_featured_products_position ON featured_products (position);