import { mockData } from '@/lib/mockData';
import { toCsv } from '@/lib/csv';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || undefined;
  const city = searchParams.get('city') || undefined;
  const propertyType = searchParams.get('propertyType') || undefined;
  const status = searchParams.get('status') || undefined;
  const timeline = searchParams.get('timeline') || undefined;

  const filters = { search: q, city, propertyType, status, timeline };
  const items = mockData.getBuyers(filters);
  const csv = toCsv(items);
  return new Response(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="buyers.csv"' } });
}
