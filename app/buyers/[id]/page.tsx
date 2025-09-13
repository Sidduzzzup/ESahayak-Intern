import { mockData } from '@/lib/mockData';
import { notFound } from 'next/navigation';
import EditForm from '@/app/buyers/[id]/EditForm';

export default async function BuyerDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const buyer = mockData.getBuyer(id);
  if (!buyer) return notFound();
  
  return (
    <div>
      <h1>{buyer.fullName}</h1>
      <EditForm buyer={buyer as any} />
      <div style={{ height: 20 }} />
      <h2>Recent Changes</h2>
      <p>No history available in demo mode.</p>
    </div>
  );
}
