"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/products';

export default function TestSupabase() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🔧 Testing Supabase connection...');
        console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
        console.log('Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
        
        const { data, error } = await supabase
          .from('product')
          .select('id, title, price, images, category, description, created_at, rating, quantity, sizes')
          .limit(5);

        if (error) {
          console.error('❌ Supabase error:', error);
          setError(error.message);
        } else {
          console.log('✅ Supabase data:', data);
          setData(data);
        }
      } catch (err) {
        console.error('❌ Connection error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Test</h1>
      <div className="mb-4">
        <p><strong>URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}</p>
        <p><strong>Key exists:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Yes' : 'No'}</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Data ({data?.length || 0} items):</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}


