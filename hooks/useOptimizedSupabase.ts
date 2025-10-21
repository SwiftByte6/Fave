import { supabase } from "@/lib/supabase/products";
import { useState, useCallback, useMemo } from "react";

// Cache for storing fetched data
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Cache TTL in milliseconds (5 minutes for products, 1 hour for static data)
const CACHE_TTL = {
  PRODUCTS: 5 * 60 * 1000, // 5 minutes
  STATIC: 60 * 60 * 1000,  // 1 hour
};

const isCacheValid = (key: string): boolean => {
  const cached = cache.get(key);
  if (!cached) return false;
  return Date.now() - cached.timestamp < cached.ttl;
};

const setCache = (key: string, data: any, ttl: number) => {
  cache.set(key, { data, timestamp: Date.now(), ttl });
};

const getCache = (key: string) => {
  return cache.get(key)?.data;
};

export const useOptimizedSupabase = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filterData, setFilterData] = useState<any[]>([]);
  const [filterId, setFilterId] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized product processing functions
  const processedProducts = useMemo(() => {
    if (!products.length) return [];
    
    return products.map((p: any) => ({
      ...p,
      _createdAt: p.created_at ? new Date(p.created_at).getTime() : 0,
      _popularity: p.sales || p.orders || 0,
    }));
  }, [products]);

  const getDataFromSupabase = useCallback(async (forceRefresh = false) => {
    const cacheKey = 'products';
    
    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && isCacheValid(cacheKey)) {
      const cachedData = getCache(cacheKey);
      if (cachedData) {
        setProducts(cachedData);
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('product')
        .select('id, title, price, images, category, description, created_at, sales, orders')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data) {
        setProducts(data);
        setCache(cacheKey, data, CACHE_TTL.PRODUCTS);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getFilteredData = useCallback(async (query: string) => {
    if (!query.trim()) {
      setFilterData([]);
      return;
    }

    const cacheKey = `search_${query.toLowerCase()}`;
    
    if (isCacheValid(cacheKey)) {
      const cachedData = getCache(cacheKey);
      if (cachedData) {
        setFilterData(cachedData);
        return;
      }
    }

    try {
      const { data, error } = await supabase
        .from('product')
        .select('id, title, price, images, category, description, created_at')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(20); // Limit search results for performance

      if (error) throw error;
      
      if (data) {
        setFilterData(data);
        setCache(cacheKey, data, CACHE_TTL.PRODUCTS);
      }
    } catch (err) {
      console.error('Error searching products:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
    }
  }, []);

  const getProductById = useCallback(async (id: number) => {
    const cacheKey = `product_${id}`;
    
    if (isCacheValid(cacheKey)) {
      const cachedData = getCache(cacheKey);
      if (cachedData) {
        setFilterId(cachedData);
        return;
      }
    }

    try {
      const { data, error } = await supabase
        .from('product')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (data) {
        setFilterId(data);
        setCache(cacheKey, data, CACHE_TTL.STATIC);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch product');
    }
  }, []);

  const getRelatedProducts = useCallback(async (currentProduct: any, limit: number = 4) => {
    if (!currentProduct) return;

    const cacheKey = `related_${currentProduct.id}_${limit}`;
    
    if (isCacheValid(cacheKey)) {
      const cachedData = getCache(cacheKey);
      if (cachedData) {
        setRelatedProducts(cachedData);
        return;
      }
    }

    try {
      let related: any[] = [];

      // Get products with same category
      const { data: categoryProducts, error: categoryError } = await supabase
        .from('product')
        .select('id, title, price, images, category, description')
        .eq('category', currentProduct.category)
        .neq('id', currentProduct.id)
        .limit(limit);

      if (!categoryError && categoryProducts) {
        related = [...categoryProducts];
      }

      // Fill remaining slots with random products if needed
      if (related.length < limit) {
        const { data: randomProducts, error: randomError } = await supabase
          .from('product')
          .select('id, title, price, images, category, description')
          .neq('id', currentProduct.id)
          .limit(limit - related.length);

        if (!randomError && randomProducts) {
          const existingIds = related.map((p: any) => p.id);
          const newProducts = randomProducts.filter((p: any) => !existingIds.includes(p.id));
          related = [...related, ...newProducts];
        }
      }

      const finalRelated = related.slice(0, limit);
      setRelatedProducts(finalRelated);
      setCache(cacheKey, finalRelated, CACHE_TTL.STATIC);
    } catch (err) {
      console.error('Error fetching related products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch related products');
    }
  }, []);

  // Memoized computed values for better performance
  const featuredProducts = useMemo(() => 
    processedProducts.slice(0, 8), 
    [processedProducts]
  );

  const newArrivals = useMemo(() => 
    [...processedProducts]
      .sort((a, b) => b._createdAt - a._createdAt)
      .slice(0, 6),
    [processedProducts]
  );

  const bestSellers = useMemo(() => 
    [...processedProducts]
      .sort((a, b) => (b._popularity - a._popularity) || (b._createdAt - a._createdAt))
      .slice(0, 4),
    [processedProducts]
  );

  const youWillLove = useMemo(() => 
    processedProducts.slice(6, 12),
    [processedProducts]
  );

  return {
    products: processedProducts,
    featuredProducts,
    newArrivals,
    bestSellers,
    youWillLove,
    filterData,
    filterId,
    relatedProducts,
    isLoading,
    error,
    getDataFromSupabase,
    getFilteredData,
    getProductById,
    getRelatedProducts,
  };
};
