import { NextResponse } from 'next/server';
import { createServerAdminClient } from '@/utils/server/supabaseServer';

// shared SELECT on the materialized view
const MATVIEW_SELECT = '*';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get('limit') || '20'), 50);
  const offset = Math.max(Number(url.searchParams.get('offset') || '0'), 0);
  const featured = url.searchParams.get('featured') === 'true';
  const sortBy = url.searchParams.get('sort_by') || '';
  const category = url.searchParams.get('category') || '';
  const brand = url.searchParams.get('brand') || '';
  const search = url.searchParams.get('search') || '';

  const supabase = createServerAdminClient();
  let query = supabase.from('product_full').select(MATVIEW_SELECT);
  let countQuery = supabase.from('product_full').select('id', { count: 'exact' });

  // Apply featured filter
  if (featured) {
    query = query.not('featured_position', 'is', null);
    countQuery = countQuery.not('featured_position', 'is', null);
  }

  // ───────────────────────────── Category filter ──────────────────────────────
  if (category) {
    const categoriesArr = category         // "Companion,Utility" ⇒ ["Companion","Utility"]
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    // overlap (OR-semantics) → any element of array matches
    query      = query.overlaps('category_names', categoriesArr);
    countQuery = countQuery.overlaps('category_names', categoriesArr);
  }

  // Apply brand filter
  if (brand) {
    const brandsArr = brand.split(',').map(b => b.trim()).filter(Boolean);
    if (brandsArr.length === 1) {
      query = query.eq('brand', brandsArr[0]);
      countQuery = countQuery.eq('brand', brandsArr[0]);
    } else if (brandsArr.length > 1) {
      query = query.in('brand', brandsArr);
      countQuery = countQuery.in('brand', brandsArr);
    }
  }

  // Apply search filter (name, description)
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    countQuery = countQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  // Apply price filter
  const priceMin = Number(url.searchParams.get('price_min')) || 0;
  const priceMax = Number(url.searchParams.get('price_max')) || Number.MAX_SAFE_INTEGER;

  if (priceMin > 0) {
    query = query.gte('best_vendor->price', priceMin);
    countQuery = countQuery.gte('best_vendor->price', priceMin);
  }

  if (priceMax < Number.MAX_SAFE_INTEGER) {
    query = query.lte('best_vendor->price', priceMax);
    countQuery = countQuery.lte('best_vendor->price', priceMax);
  }

  // Apply rating filter
  const rating = Number(url.searchParams.get('rating')) || 0;
  if (rating > 0) {
    // The issue was here - we need to subtract a small amount from the rating value
    // to make sure we include all products with the specified rating or higher
    // For example: when rating=4, we want to include 4, 4.1, 4.2, etc.
    const floorRating = Math.floor(rating);
    query = query.gte('ratings->average', floorRating);
    countQuery = countQuery.gte('ratings->average', floorRating);
  }

  // Get total count
  const { count: totalCount, error: countError } = await countQuery;
  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  // Apply sorting
  switch (sortBy) {
    case 'featured':
      query = query.order('featured_position', { ascending: true });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'price-asc':
      query = query.order('best_vendor->price', { ascending: true });
      break;
    case 'price-desc':
      query = query.order('best_vendor->price', { ascending: false });
      break;
    case 'rating':
      query = query.order('ratings->average', { ascending: false });
      break;
    case 'popularity':
      query = query.order('ratings->count', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  // Apply pagination
  const { data, error } = await query.range(offset, offset + limit - 1);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const finalProducts = data || [];

  // Return response with metadata
  return NextResponse.json({
    products: finalProducts,
    hasMore: offset + finalProducts.length < (totalCount || 0),
    total: featured ? finalProducts.length : totalCount || 0,
  }, {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
    }
  });
}
