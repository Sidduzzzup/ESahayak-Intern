import { NextResponse } from 'next/server';
import { mockData } from '@/lib/mockData';
import { buyerCreateSchema } from '@/lib/schemas';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || '1');
  const take = 10, skip = (page - 1) * take;
  
  const q = searchParams.get('q') || undefined;
  const city = searchParams.get('city') || undefined;
  const propertyType = searchParams.get('propertyType') || undefined;
  const status = searchParams.get('status') || undefined;
  const timeline = searchParams.get('timeline') || undefined;

  const filters = { search: q, city, propertyType, status, timeline };
  const allItems = mockData.getBuyers(filters);
  const total = allItems.length;
  const items = allItems.slice(skip, skip + take);

  return NextResponse.json({ total, items });
}

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = buyerCreateSchema.safeParse(json);
  if (!parsed.success) {
    return new NextResponse(parsed.error.message, { status: 400 });
  }
  const created = mockData.addBuyer(parsed.data);
  return NextResponse.json(created);
}
