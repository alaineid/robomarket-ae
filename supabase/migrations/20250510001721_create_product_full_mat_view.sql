-- Create the materialized view for product_full_mat
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

  -- featured position & since
  fp.position     AS featured_position,
  fp.featured_since

FROM products p
LEFT JOIN product_ratings pr ON pr.product_id = p.id
LEFT JOIN featured_products fp ON fp.product_id = p.id;

 GRANT SELECT ON product_full_mat TO anon;