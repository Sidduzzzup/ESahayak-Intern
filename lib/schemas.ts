import { z } from 'zod';

export const City = z.enum(['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other']);
export const PropertyType = z.enum(['Apartment', 'Villa', 'Plot', 'Office', 'Retail']);
// client-visible BHK values
export const BHK = z.enum(['1', '2', '3', '4', 'Studio']);
export const Purpose = z.enum(['Buy', 'Rent']);
export const Timeline = z.enum(['0-3m', '3-6m', '>6m', 'Exploring']);
export const Source = z.enum(['Website', 'Referral', 'Walk-in', 'Call', 'Other']);
export const Status = z.enum(['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped']);

export const buyerBaseSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email').optional().or(z.literal('').transform(() => undefined)),
    phone: z
      .string()
      .regex(/^\d{10,15}$/u, 'Phone must be 10-15 digits'),
    city: City,
    propertyType: PropertyType,
  bhk: BHK.optional(),
    purpose: Purpose,
    budgetMin: z.coerce.number().int().nonnegative(),
    budgetMax: z.coerce.number().int().nonnegative(),
    timeline: Timeline,
    source: Source,
    status: Status.default('New'),
    notes: z.string().max(1000).optional(),
    tags: z.array(z.string()).optional(),
  })
  .refine((d) => d.budgetMax >= d.budgetMin, {
    message: 'Max budget must be >= Min budget',
    path: ['budgetMax'],
  })
  .superRefine((d, ctx) => {
    if ((d.propertyType === 'Apartment' || d.propertyType === 'Villa') && !d.bhk) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'BHK is required for Apartment/Villa', path: ['bhk'] });
    }
  });

export const buyerCreateSchema = buyerBaseSchema;

export const buyerUpdateSchema = (buyerBaseSchema as any).safeExtend({
  id: z.string().uuid(),
  // optimistic concurrency field
  updatedAt: z.string(),
});

export const filterSchema = z.object({
  q: z.string().optional(),
  city: City.optional(),
  propertyType: PropertyType.optional(),
  status: Status.optional(),
  timeline: Timeline.optional(),
  page: z.coerce.number().int().positive().default(1),
});

export const csvHeaders = [
  'fullName',
  'email',
  'phone',
  'city',
  'propertyType',
  'bhk',
  'purpose',
  'budgetMin',
  'budgetMax',
  'timeline',
  'source',
  'status',
  'notes',
  'tags',
];

export const csvRowSchema = (buyerBaseSchema as any).safeExtend({
  bhk: BHK.optional().or(z.literal('').transform(() => undefined)),
  tags: z
    .union([
      z
        .string()
        .transform((s) => (s ? s.split(',').map((t) => t.trim()).filter(Boolean) : [])),
      z.array(z.string()),
    ])
    .optional(),
});

export type BuyerCreate = z.infer<typeof buyerCreateSchema>;
export type BuyerUpdate = z.infer<typeof buyerUpdateSchema>;

// Mappers between form values and Prisma enums
export const mapBhkToPrisma = (b?: z.infer<typeof BHK>) => {
  if (!b) return undefined;
  return b === 'Studio' ? 'Studio' : (`B${b}` as const);
};
export const mapBhkFromPrisma = (b?: 'B1' | 'B2' | 'B3' | 'B4' | 'Studio' | null) => {
  if (!b) return undefined;
  return b === 'Studio' ? 'Studio' : (b.replace('B', '') as '1' | '2' | '3' | '4');
};

export const mapTimelineToPrisma = (t: z.infer<typeof Timeline>) => {
  switch (t) {
    case '0-3m':
      return 'M0_3' as const;
    case '3-6m':
      return 'M3_6' as const;
    case '>6m':
      return 'GT_6' as const;
    default:
      return 'Exploring' as const;
  }
};
export const mapTimelineFromPrisma = (t: 'M0_3' | 'M3_6' | 'GT_6' | 'Exploring') => {
  switch (t) {
    case 'M0_3':
      return '0-3m';
    case 'M3_6':
      return '3-6m';
    case 'GT_6':
      return '>6m';
    default:
      return 'Exploring';
  }
};
