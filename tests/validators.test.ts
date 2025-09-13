import { describe, it, expect } from 'vitest';
import { buyerCreateSchema, csvRowSchema } from '../lib/schemas';

const base = {
  fullName: 'John Doe',
  phone: '1234567890',
  city: 'Mohali',
  propertyType: 'Plot',
  purpose: 'Buy',
  budgetMin: 10,
  budgetMax: 20,
  timeline: '0-3m',
  source: 'Website',
  status: 'New',
};

describe('buyerCreateSchema', () => {
  it('accepts valid data', () => {
    const res = buyerCreateSchema.safeParse(base);
    expect(res.success).toBe(true);
  });
  it('rejects budgetMax < budgetMin', () => {
    const res = buyerCreateSchema.safeParse({ ...base, budgetMax: 5 });
    expect(res.success).toBe(false);
  });
  it('requires bhk for Apartment', () => {
    const res = buyerCreateSchema.safeParse({ ...base, propertyType: 'Apartment' });
    expect(res.success).toBe(false);
  });
});

describe('csvRowSchema', () => {
  it('parses tags csv string', () => {
    const res = csvRowSchema.safeParse({ ...base, tags: 'x, y , z' });
    expect(res.success).toBe(true);
    if (res.success) expect(res.data.tags).toEqual(['x', 'y', 'z']);
  });
});
