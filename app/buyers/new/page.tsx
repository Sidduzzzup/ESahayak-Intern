"use client";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { buyerCreateSchema, BHK, City, Purpose, PropertyType, Source, Status, Timeline } from '@/lib/schemas';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type FormValues = z.infer<typeof buyerCreateSchema>;

export default function NewBuyerPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(buyerCreateSchema) as any, defaultValues: { status: 'New' } });

  const propertyType = watch('propertyType');

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    const res = await fetch('/api/buyers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
    if (!res.ok) {
      const t = await res.text();
      setSubmitError(t || 'Failed to create');
      return;
    }
    const created = await res.json();
    router.push(`/buyers/${created.id}`);
  }

  return (
    <div>
      <h1>New Buyer</h1>
  <form onSubmit={handleSubmit(onSubmit as any)} aria-describedby={submitError ? 'form-error' : undefined}>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
          <div>
            <label className="label" htmlFor="fullName">Full name</label>
            <input id="fullName" className="input" {...register('fullName')} aria-invalid={!!errors.fullName} />
            {errors.fullName && <div className="error" role="alert">{errors.fullName.message}</div>}
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone</label>
            <input id="phone" className="input" {...register('phone')} aria-invalid={!!errors.phone} />
            {errors.phone && <div className="error" role="alert">{errors.phone.message}</div>}
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" className="input" type="email" {...register('email')} aria-invalid={!!errors.email} />
            {errors.email && <div className="error" role="alert">{errors.email.message}</div>}
          </div>
          <div>
            <label className="label" htmlFor="city">City</label>
            <select id="city" className="select" {...register('city')}>
              {City.options.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="propertyType">Property Type</label>
            <select id="propertyType" className="select" {...register('propertyType')}>
              {PropertyType.options.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {(propertyType === 'Apartment' || propertyType === 'Villa') && (
            <div>
              <label className="label" htmlFor="bhk">BHK</label>
              <select id="bhk" className="select" {...register('bhk')}>
                <option value="">Select</option>
                {BHK.options.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.bhk && <div className="error" role="alert">{errors.bhk.message}</div>}
            </div>
          )}
          <div>
            <label className="label" htmlFor="purpose">Purpose</label>
            <select id="purpose" className="select" {...register('purpose')}>
              {Purpose.options.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="budgetMin">Budget Min</label>
            <input id="budgetMin" className="input" type="number" {...register('budgetMin')} />
          </div>
          <div>
            <label className="label" htmlFor="budgetMax">Budget Max</label>
            <input id="budgetMax" className="input" type="number" {...register('budgetMax')} aria-invalid={!!errors.budgetMax} />
            {errors.budgetMax && <div className="error" role="alert">{errors.budgetMax.message}</div>}
          </div>
          <div>
            <label className="label" htmlFor="timeline">Timeline</label>
            <select id="timeline" className="select" {...register('timeline')}>
              {Timeline.options.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="source">Source</label>
            <select id="source" className="select" {...register('source')}>
              {Source.options.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="status">Status</label>
            <select id="status" className="select" {...register('status')}>
              {Status.options.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="label" htmlFor="notes">Notes</label>
            <textarea id="notes" className="textarea" rows={4} {...register('notes')} />
          </div>
        </div>
        <div style={{ height: 12 }} />
        {submitError && <div id="form-error" className="error" role="alert">{submitError}</div>}
        <button className="btn-primary" disabled={isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Create'}
        </button>
      </form>
    </div>
  );
}
