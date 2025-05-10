-- Migration to add reviews to the product_full_mat materialized view
-- Migration timestamp: 20250509000000

-- Drop the existing materialized view
DROP MATERIALIZED VIEW IF EXISTS product_full_mat;

-- Recreate the materialized view with reviews included
CREATE MATERIALIZED VIEW product_full_mat AS
SELECT
  p.id,
  p.sku,
  p.name,
  p.description,
  p.brand,
  p.created_at,
  p.updated_at,

  -- ratings as nested JSON
  json_build_object(
    'average', pr.average_rating,
    'count', pr.rating_count
  ) AS ratings,

  -- categories array
  (SELECT json_agg(json_build_object('id', c.id, 'name', c.name))
   FROM product_categories pc
   JOIN categories c ON c.id = pc.category_id
   WHERE pc.product_id = p.id
  ) AS categories,

  -- images array
  (SELECT json_agg(json_build_object(
      'url', pi.url,
      'alt_text', pi.alt_text,
      'position', pi.position
    ) ORDER BY pi.position)
   FROM product_images pi
   WHERE pi.product_id = p.id
  ) AS images,

  -- attributes array
  (SELECT json_agg(json_build_object(
      'key', pa.key,
      'value', pa.value
    ))
   FROM product_attributes pa
   WHERE pa.product_id = p.id
  ) AS attributes,

  -- vendor_products array
  (SELECT json_agg(json_build_object(
      'vendor', json_build_object(
          'id', v.id,
          'name', v.name,
          'email', v.email,
          'phone', v.phone,
          'website', v.website
        ),
      'vendor_sku', vp.vendor_sku,
      'price', vp.price,
      'stock', vp.stock
    ))
   FROM vendor_products vp
   JOIN vendors v ON v.id = vp.vendor_id
   WHERE vp.product_id = p.id
  ) AS vendor_products,

  -- best_vendor object
  (SELECT json_build_object(
      'vendor', json_build_object(
         'id', v2.id,
         'name', v2.name,
         'email', v2.email,
         'phone', v2.phone,
         'website', v2.website
      ),
      'vendor_sku', vp2.vendor_sku,
      'price', vp2.price,
      'stock', vp2.stock
    )
   FROM vendor_products vp2
   JOIN vendors v2 ON v2.id = vp2.vendor_id
   WHERE vp2.product_id = p.id AND vp2.stock > 0
   ORDER BY vp2.price
   LIMIT 1
  ) AS best_vendor,

  -- reviews array (new addition)
  (SELECT json_agg(json_build_object(
      'id', rev.id,
      'customer_id', rev.customer_id,
      'rating', rev.rating,
      'title', rev.title,
      'comment', rev.comment,
      'helpful_votes', rev.helpful_votes,
      'verified_purchase', rev.verified_purchase,
      'created_at', rev.created_at,
      'customer_name', COALESCE(c.first_name || ' ' || c.last_name, 'Anonymous'),
      'images', (
        SELECT json_agg(json_build_object(
          'url', ri.url,
          'caption', ri.caption
        ))
        FROM review_images ri
        WHERE ri.review_id = rev.id
      )
    ))
   FROM product_reviews rev
   LEFT JOIN customers c ON c.id = rev.customer_id
   WHERE rev.product_id = p.id AND rev.status = 'approved'
  ) AS reviews,

  -- featured position & since
  fp.position     AS featured_position,
  fp.featured_since

FROM products p
LEFT JOIN product_ratings pr ON pr.product_id = p.id
LEFT JOIN featured_products fp ON fp.product_id = p.id;

-- Grant SELECT permission to anonymous users
GRANT SELECT ON product_full_mat TO anon;

-- Create an index on product id for better performance
CREATE INDEX IF NOT EXISTS idx_product_full_mat_id ON product_full_mat(id);