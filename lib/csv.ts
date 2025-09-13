import Papa, { ParseResult } from 'papaparse';
import { csvHeaders, csvRowSchema } from './schemas';
import type { ZodIssue } from 'zod';

export type CsvRow = Record<string, string>;

export function parseCsv(content: string) {
  const parsed: ParseResult<CsvRow> = Papa.parse<CsvRow>(content, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h: string) => h.trim(),
  });
  const rows = (parsed.data || []).map((r: CsvRow) =>
    Object.fromEntries(Object.entries(r).map(([k, v]) => [k.trim(), String(v ?? '').trim()])) as CsvRow,
  );
  const errors: { index: number; errors: string[] }[] = [];
  const valid: any[] = [];
  rows.forEach((row: CsvRow, i: number) => {
    const missing = csvHeaders.filter((h) => !(h in row));
    if (missing.length) {
      errors.push({ index: i, errors: [`Missing headers: ${missing.join(', ')}`] });
      return;
    }
    const parsed = csvRowSchema.safeParse(row);
    if (!parsed.success) {
      errors.push({ index: i, errors: parsed.error.issues.map((e: ZodIssue) => `${e.path.join('.')}: ${e.message}`) });
    } else {
      valid.push(parsed.data);
    }
  });
  return { valid, errors };
}

export function toCsv(rows: any[]) {
  return Papa.unparse({ fields: csvHeaders, data: rows.map((r) => csvHeaders.map((h) => (h === 'tags' ? (r.tags || []).join(',') : r[h] ?? ''))) });
}
