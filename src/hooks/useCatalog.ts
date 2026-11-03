import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCatalog, fetchProduct } from '../services/catalogApi';
import type { Product } from '../domain/types';

export const catalogKeys = {
  all: ['catalog'] as const,
  product: (id: number) => ['product', id] as const,
};

export function useCatalog() {
  return useQuery({
    queryKey: catalogKeys.all,
    queryFn: ({ signal }) => fetchCatalog(signal),
    staleTime: 5 * 60_000,
  });
}

/** Reutiliza el producto ya cargado en el catálogo; si no existe, lo pide a la API. */
export function useProduct(id: number) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: catalogKeys.product(id),
    queryFn: async ({ signal }) => {
      const cached = queryClient.getQueryData<Product[]>(catalogKeys.all)?.find((p) => p.id === id);
      return cached ?? fetchProduct(id, signal);
    },
    enabled: Number.isInteger(id) && id > 0,
    retry: 1,
  });
}
