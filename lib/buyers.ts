import { prisma } from './prisma';
import { mapBhkToPrisma, mapTimelineToPrisma } from './schemas';

export async function createBuyer(input: any, ownerId: string) {
  const data = {
    ...input,
    bhk: mapBhkToPrisma(input.bhk),
    timeline: mapTimelineToPrisma(input.timeline),
    tags: input.tags ?? [],
    ownerId,
  };
  const buyer = await prisma.buyer.create({ data });
  await prisma.buyerHistory.create({
    data: { buyerId: buyer.id, changedBy: ownerId, diff: { type: 'create', after: buyer } },
  });
  return buyer;
}

export async function updateBuyer(id: string, input: any, changedBy: string, expectedUpdatedAt: string) {
  const current = await prisma.buyer.findUnique({ where: { id } });
  if (!current) throw new Error('Not found');
  if (current.updatedAt.toISOString() !== expectedUpdatedAt) {
    const err: any = new Error('Conflict');
    err.code = 'CONFLICT';
    throw err;
  }
  const data = {
    ...input,
    bhk: mapBhkToPrisma(input.bhk),
    timeline: mapTimelineToPrisma(input.timeline),
    tags: input.tags ?? [],
  };
  const updated = await prisma.buyer.update({ where: { id }, data });
  const diff = diffObjects(current, updated);
  await prisma.buyerHistory.create({ data: { buyerId: id, changedBy, diff } });
  return updated;
}

export function diffObjects(before: any, after: any) {
  const changed: Record<string, { before: any; after: any }> = {};
  for (const k of Object.keys(after)) {
    if (['updatedAt'].includes(k)) continue;
    if (JSON.stringify((before as any)[k]) !== JSON.stringify((after as any)[k])) {
      changed[k] = { before: (before as any)[k], after: (after as any)[k] };
    }
  }
  return changed;
}
