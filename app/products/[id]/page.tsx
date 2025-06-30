'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductDetailPage from '@/component/ProductDetailPage';
import { useSupabase } from '@/hooks/useSupabase';

const Page = () => {
  const { id } = useParams(); // id is string | string[]
  const { getProductById } = useSupabase();
  const [filterId, setFilterId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof id === 'string') {
      const numericId = parseInt(id, 10);
      if (!isNaN(numericId)) {
        setFilterId(numericId);
        getProductById(numericId);
      }
    }
  }, [id]);

  return (
    <div>
      <ProductDetailPage filterId={filterId} />
    </div>
  );
};

export default Page;
