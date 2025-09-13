import { NextResponse } from 'next/server';
import { mockData } from '@/lib/mockData';
import { buyerUpdateSchema } from '@/lib/schemas';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const buyer = mockData.getBuyer(id);
  if (!buyer) return new NextResponse('Not found', { status: 404 });
  return NextResponse.json({ buyer, history: [] }); // No history for mock data
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const buyer = mockData.getBuyer(id);
  if (!buyer) return new NextResponse('Not found', { status: 404 });

  const json = await req.json();
  const parsed = buyerUpdateSchema.safeParse({ ...json, id });
  if (!parsed.success) return new NextResponse(parsed.error.message, { status: 400 });
  
  const updated = mockData.updateBuyer(id, parsed.data);
  if (!updated) return new NextResponse('Update failed', { status: 500 });
  
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const buyer = mockData.getBuyer(id);
  if (!buyer) return new NextResponse('Not found', { status: 404 });
  
  const success = mockData.deleteBuyer(id);
  if (!success) return new NextResponse('Delete failed', { status: 500 });
  
  return NextResponse.json({ ok: true });
}
