import { NextResponse } from 'next/server';
import { createServerAnonClient } from '@/services/supabaseServer';

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

  const supabase = createServerAnonClient();
  let query = supabase.from('product_full').select(MATVIEW_SELECT);
  let countQuery = supabase.from('product_full').select('id', { count: 'exact' });

  if (featured) {
    query = query.not('featured_position', 'is', null);
    countQuery = countQuery.not('featured_position', 'is', null);
  }

  if (category) {
    const categoriesArr = category.split(',').map(c => c.trim()).filter(Boolean);
    query = query.overlaps('category_names', categoriesArr);
    countQuery = countQuery.overlaps('category_names', categoriesArr);
  }

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

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    countQuery = countQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

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

  const rating = Number(url.searchParams.get('rating')) || 0;
  if (rating > 0) {
    const floorRating = Math.floor(rating);
    query = query.gte('ratings->average', floorRating);
    countQuery = countQuery.gte('ratings->average', floorRating);
  }

  const { count: totalCount, error: countError } = await countQuery;
  if (countError) {
    console.error('Count query error:', countError);
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  switch (sortBy) {
    case 'featured':
      query = query.order('featured_position', { ascending: true }).order('id', { ascending: true });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false }).order('id', { ascending: true });
      break;
    case 'price-asc':
      query = query.order('best_vendor->price', { ascending: true }).order('id', { ascending: true });
      break;
    case 'price-desc':
      query = query.order('best_vendor->price', { ascending: false }).order('id', { ascending: true });
      break;
    case 'rating':
      query = query.order('ratings->average', { ascending: false }).order('id', { ascending: true });
      break;
    case 'popularity':
      query = query.order('ratings->count', { ascending: false }).order('id', { ascending: true });
      break;
    default:
      query = query.order('created_at', { ascending: false }).order('id', { ascending: true });
  }

  const { data, error } = await query.range(offset, offset + limit - 1);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const finalProducts = data || [];
  const totalItems = totalCount || 0;
  const newOffset = offset + limit;
  const hasMore = newOffset < totalItems;

  return NextResponse.json({
    products: finalProducts,
    hasMore,
    total: totalItems,
    nextOffset: newOffset,
  }, {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
    }
  });
}
