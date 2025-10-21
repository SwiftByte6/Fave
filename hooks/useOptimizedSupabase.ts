import { supabase } from "@/lib/supabase/products";
import { useState, useEffect } from "react";

export const useOptimizedSupabase = () => {
  const [products, setProducts] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getDataFromSupabase = async (forceRefresh: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('product')
        .select('id, title, price, images, category, description, created_at, rating, quantity, sizes')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
        setProducts([]);
      } else {
        setProducts(data || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDataFromSupabase();
  }, []);

  // Derived data
  const featuredProducts = products.slice(0, 8);
  
  const newArrivals = [...products]
    .map((p: any) => ({ ...p, _createdAt: p.created_at ? new Date(p.created_at).getTime() : 0 }))
    .sort((a: any, b: any) => b._createdAt - a._createdAt)
    .slice(0, 6);

  const bestSellers = [...products]
    .map((p: any) => ({ ...p, _createdAt: p.created_at ? new Date(p.created_at).getTime() : 0 }))
    .sort((a: any, b: any) => b._createdAt - a._createdAt)
    .slice(0, 4);

  const youWillLove = [...products].slice(6, 12);

  return {
    products,
    featuredProducts,
    newArrivals,
    bestSellers,
    youWillLove,
    isLoading,
    error,
    getDataFromSupabase,
  };
};
