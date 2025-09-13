"use client";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { buyerUpdateSchema, BHK, City, Purpose, PropertyType, Source, Status, Timeline, mapTimelineFromPrisma, mapBhkFromPrisma } from '@/lib/schemas';
import { z } from 'zod';
import { useState } from 'react';

type FormValues = z.infer<typeof buyerUpdateSchema>;

export default function EditForm({ buyer }: { buyer: any }) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    // cast to avoid type mismatches between package versions
    resolver: zodResolver(buyerUpdateSchema) as any,
    defaultValues: {
      id: buyer.id,
      fullName: buyer.fullName,
      email: buyer.email ?? undefined,
      phone: buyer.phone,
      city: buyer.city,
      propertyType: buyer.propertyType,
      bhk: mapBhkFromPrisma(buyer.bhk as any),
      purpose: buyer.purpose,
      budgetMin: buyer.budgetMin,
      budgetMax: buyer.budgetMax,
      timeline: mapTimelineFromPrisma(buyer.timeline as any) as any,
      source: buyer.source,
      status: buyer.status,
      notes: buyer.notes ?? undefined,
      tags: (buyer.tags as string[]) ?? [],
      updatedAt: buyer.updatedAt.toISOString(),
    },
  });
  const pt = form.watch('propertyType');
  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    const res = await fetch(`/api/buyers/${buyer.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
    if (res.status === 409) { setSubmitError('This record was updated by someone else. Reload the page and try again.'); return; }
    if (!res.ok) { setSubmitError(await res.text()); return; }
    location.reload();
  }
  return (
  <form onSubmit={form.handleSubmit(onSubmit as any)} aria-describedby={submitError ? 'form-error' : undefined}>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
        <div>
          <label className="label" htmlFor="fullName">Full name</label>
          <input id="fullName" className="input" {...form.register('fullName')} />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input id="phone" className="input" {...form.register('phone')} />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" className="input" type="email" {...form.register('email')} />
        </div>
        <div>
          <label className="label" htmlFor="city">City</label>
          <select id="city" className="select" {...form.register('city')}>
            {City.options.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="propertyType">Property Type</label>
          <select id="propertyType" className="select" {...form.register('propertyType')}>
            {PropertyType.options.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
        </div>
        {(pt === 'Apartment' || pt === 'Villa') && (
          <div>
            <label className="label" htmlFor="bhk">BHK</label>
            <select id="bhk" className="select" {...form.register('bhk')}>
              <option value="">Select</option>
              {BHK.options.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
        )}
        <div>
          <label className="label" htmlFor="purpose">Purpose</label>
          <select id="purpose" className="select" {...form.register('purpose')}>
            {Purpose.options.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="budgetMin">Budget Min</label>
          <input id="budgetMin" className="input" type="number" {...form.register('budgetMin', { valueAsNumber: true })} />
        </div>
        <div>
          <label className="label" htmlFor="budgetMax">Budget Max</label>
          <input id="budgetMax" className="input" type="number" {...form.register('budgetMax', { valueAsNumber: true })} />
        </div>
        <div>
          <label className="label" htmlFor="timeline">Timeline</label>
          <select id="timeline" className="select" {...form.register('timeline')}>
            {Timeline.options.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="source">Source</label>
          <select id="source" className="select" {...form.register('source')}>
            {Source.options.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="status">Status</label>
          <select id="status" className="select" {...form.register('status')}>
            {Status.options.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label className="label" htmlFor="notes">Notes</label>
          <textarea id="notes" className="textarea" rows={4} {...form.register('notes')} />
        </div>
      </div>
      <div style={{ height: 12 }} />
      {submitError && <div id="form-error" className="error" role="alert">{submitError}</div>}
      <button className="btn-primary" disabled={form.formState.isSubmitting} aria-busy={form.formState.isSubmitting}>Save</button>
    </form>
  );
}
