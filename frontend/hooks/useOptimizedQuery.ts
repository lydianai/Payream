import { useQuery, UseQueryOptions } from "@tanstack/react-query";

interface OptimizedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  // Cache strategy options
  cacheStrategy?: 'default' | 'aggressive' | 'minimal' | 'realtime';
  // Background refetch interval in minutes
  backgroundRefetch?: number;
}

export function useOptimizedQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options: OptimizedQueryOptions<T> = {}
) {
  const {
    cacheStrategy = 'default',
    backgroundRefetch,
    ...restOptions
  } = options;

  // Define cache strategies
  const getCacheConfig = (strategy: string) => {
    switch (strategy) {
      case 'aggressive':
        return {
          staleTime: 15 * 60 * 1000, // 15 minutes
          gcTime: 30 * 60 * 1000, // 30 minutes
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
        };
      case 'minimal':
        return {
          staleTime: 1 * 60 * 1000, // 1 minute
          gcTime: 2 * 60 * 1000, // 2 minutes
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
        };
      case 'realtime':
        return {
          staleTime: 0, // Always stale
          gcTime: 1 * 60 * 1000, // 1 minute
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
          refetchInterval: 30 * 1000, // 30 seconds
        };
      default: // 'default'
        return {
          staleTime: 5 * 60 * 1000, // 5 minutes
          gcTime: 10 * 60 * 1000, // 10 minutes
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
        };
    }
  };

  const cacheConfig = getCacheConfig(cacheStrategy);

  // Add background refetch if specified
  const refetchInterval = backgroundRefetch 
    ? backgroundRefetch * 60 * 1000 
    : cacheConfig.refetchInterval;

  return useQuery({
    queryKey,
    queryFn,
    ...cacheConfig,
    refetchInterval,
    ...restOptions,
  });
}

// Specialized hooks for different data types
export function useNewsQuery(params: any) {
  return useOptimizedQuery(
    ['news', params],
    () => import('~backend/client').then(m => m.default.news.getNews(params)),
    { cacheStrategy: 'default', backgroundRefetch: 10 } // Refetch every 10 minutes
  );
}

export function useSearchQuery(params: any) {
  return useOptimizedQuery(
    ['search', params],
    () => import('~backend/client').then(m => m.default.pos.search(params)),
    { cacheStrategy: 'minimal' } // Fresh data for search results
  );
}

export function useCategoriesQuery() {
  return useOptimizedQuery(
    ['categories'],
    () => import('~backend/client').then(m => m.default.pos.getCategories()),
    { cacheStrategy: 'aggressive' } // Categories don't change often
  );
}

export function useChatQuery(message: string, context?: string) {
  return useOptimizedQuery(
    ['chat', message, context],
    () => import('~backend/client').then(m => m.default.chat.chat({ message, context })),
    { 
      cacheStrategy: 'minimal',
      enabled: !!message.trim(),
      retry: 1 // Don't retry chat requests aggressively
    }
  );
}
