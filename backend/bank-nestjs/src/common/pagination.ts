export interface PageQuery {
  page?: string;
  size?: string;
  sort?: string;
  search?: string;
}

export interface Pageable {
  page: number;
  size: number;
  sortBy: string;
  direction: 'asc' | 'desc';
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export function parsePageable(
  query: PageQuery,
  defaultSortBy: string,
  defaultDirection: 'asc' | 'desc',
): Pageable {
  const page = positiveInt(query.page, 1);
  const size = positiveInt(query.size, 20);
  const [sortByRaw, directionRaw] = (query.sort ?? '').split(',');
  const direction = directionRaw?.toLowerCase() === 'desc' ? 'desc' : defaultDirection;

  return {
    page,
    size,
    sortBy: sortByRaw || defaultSortBy,
    direction,
  };
}

export function sortAndPaginate<T>(
  items: T[],
  pageable: Pageable,
  valueOf: (item: T, field: string) => string | number | boolean | Date | null | undefined,
): PagedResponse<T> {
  const sorted = [...items].sort((a, b) => {
    const av = normalizeSortValue(valueOf(a, pageable.sortBy));
    const bv = normalizeSortValue(valueOf(b, pageable.sortBy));
    if (av < bv) return pageable.direction === 'asc' ? -1 : 1;
    if (av > bv) return pageable.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const start = (pageable.page - 1) * pageable.size;
  const content = sorted.slice(start, start + pageable.size);
  const totalElements = sorted.length;
  const totalPages = totalElements === 0 ? 0 : Math.ceil(totalElements / pageable.size);

  return {
    content,
    page: pageable.page,
    size: pageable.size,
    totalElements,
    totalPages,
    first: pageable.page <= 1,
    last: totalPages === 0 || pageable.page >= totalPages,
  };
}

function positiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeSortValue(value: string | number | boolean | Date | null | undefined) {
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'string') return value.toLowerCase();
  if (typeof value === 'boolean') return value ? 1 : 0;
  return value ?? '';
}
