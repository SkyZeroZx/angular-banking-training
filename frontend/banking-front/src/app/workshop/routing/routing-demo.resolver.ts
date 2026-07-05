import { ResolveFn } from '@angular/router';

export const routingDemoNameResolver: ResolveFn<string> = (route) => {
  const id = route.paramMap.get('id') ?? 'sin-id';
  return `Cliente demo ${id}`;
};
