"use client";
import { useDebouncedCallback } from 'use-debounce';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export default function DebouncedSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams as any);
    if (term) { params.set('q', term); params.set('page', '1'); } else { params.delete('q'); }
    replace(`${pathname}?${params.toString()}`);
  }, 400);

  return (
    <input
      className="input"
      placeholder="Search name/phone/email"
      defaultValue={searchParams.get('q') ?? ''}
      onChange={(e) => handleSearch(e.target.value)}
      aria-label="Search"
    />
  );
}
