import { mockData } from '@/lib/mockData';
import { filterSchema } from '@/lib/schemas';
import Link from 'next/link';
import DebouncedSearch from './DebouncedSearch';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 10;

function Filters({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const sp = new URLSearchParams(searchParams as any);
  return (
    <form method="get" role="search" aria-label="Filters" style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' }}>
      <input className="input" name="q" placeholder="Search name/phone/email" defaultValue={sp.get('q') ?? ''} />
      <select className="select" name="city" defaultValue={sp.get('city') ?? ''}>
        <option value="">City</option>
        {['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other'].map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <select className="select" name="propertyType" defaultValue={sp.get('propertyType') ?? ''}>
        <option value="">Property Type</option>
        {['Apartment', 'Villa', 'Plot', 'Office', 'Retail'].map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <select className="select" name="status" defaultValue={sp.get('status') ?? ''}>
        <option value="">Status</option>
        {['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped'].map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <select className="select" name="timeline" defaultValue={sp.get('timeline') ?? ''}>
        <option value="">Timeline</option>
        {['0-3m', '3-6m', '>6m', 'Exploring'].map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <button className="btn">Apply</button>
    </form>
  );
}

export default async function BuyersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const parsed = filterSchema.safeParse({ ...sp, page: sp.page ?? '1' });
  if (!parsed.success) return <div>Invalid filters</div>;
  const { q, city, propertyType, status, timeline, page } = parsed.data;

  const filters = { search: q, city, propertyType, status, timeline };
  const allItems = mockData.getBuyers(filters);
  const total = allItems.length;
  const items = allItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h1>Buyers</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <a className="btn" href={`/api/buyers/export?${new URLSearchParams(sp as any).toString()}`}>Export CSV</a>
          <Link className="btn-primary" href="/buyers/new">New Buyer</Link>
          <Link className="btn" href="/buyers/import">Import</Link>
        </div>
      </div>
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' }}>
        <DebouncedSearch />
        <Filters searchParams={sp} />
      </div>
      <div style={{ height: 8 }} />
      {items.length === 0 ? (
        <div role="status" aria-live="polite">No buyers found.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Name', 'Phone', 'Email', 'City', 'Type', 'Timeline', 'Status', 'Updated'].map((h) => (
                <th key={h} style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: '8px 6px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((b: any) => (
              <tr key={b.id}>
                <td style={{ padding: '8px 6px' }}><Link href={`/buyers/${b.id}`}>{b.fullName}</Link></td>
                <td style={{ padding: '8px 6px' }}>{b.phone}</td>
                <td style={{ padding: '8px 6px' }}>{b.email}</td>
                <td style={{ padding: '8px 6px' }}>{b.city}</td>
                <td style={{ padding: '8px 6px' }}>{b.propertyType}</td>
                <td style={{ padding: '8px 6px' }}>{b.timeline}</td>
                <td style={{ padding: '8px 6px' }}>{b.status}</td>
                <td style={{ padding: '8px 6px' }}>{b.updatedAt.toISOString().slice(0, 19).replace('T', ' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
        <span>
          Page {page} of {totalPages} ({total} total)
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {page > 1 && (
            <Link className="btn" href={{ pathname: '/buyers', query: { ...sp, page: page - 1 } }}>Prev</Link>
          )}
          {page < totalPages && (
            <Link className="btn" href={{ pathname: '/buyers', query: { ...sp, page: page + 1 } }}>Next</Link>
          )}
        </div>
      </div>
    </div>
  );
}
