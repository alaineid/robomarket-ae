import { NextResponse } from 'next/server';
import { createServerAnonClient } from '@/services/supabaseServer';

const MATVIEW_SELECT = `*`;

export async function GET(request: Request) {
  const idParam = request.url.split('/').pop();
  const id = Number(idParam);

  if (!id || isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const supabase = createServerAnonClient();
  const { data, error } = await supabase
    .from('product_full')
    .select(MATVIEW_SELECT)
    .eq('id', id)
    .single();

  if (error) {
    console.error('GET /api/products/[id] error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}
