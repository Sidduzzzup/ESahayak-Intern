import { NextResponse } from 'next/server';
import { parseCsv } from '@/lib/csv';
import { mockData } from '@/lib/mockData';

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return new NextResponse('No file', { status: 400 });
  const content = await file.text();
  const lines = content.split(/\r?\n/);
  if (lines.length > 201) return new NextResponse('Max 200 rows', { status: 400 });
  const { valid, errors } = parseCsv(content);
  if (errors.length && valid.length === 0) return NextResponse.json({ inserted: 0, errors });
  
  const created = mockData.addBuyers(valid);
  return NextResponse.json({ inserted: created, errors });
}
