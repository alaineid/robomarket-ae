-- Drop dimension columns from products table
ALTER TABLE products
DROP COLUMN weight,
DROP COLUMN length,
DROP COLUMN width,
DROP COLUMN height;
