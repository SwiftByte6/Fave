"use client";
import { useSupabase } from '@/hooks/useSupabase';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import SearchResult from '@/component/SearchResult'

const Page = () => {
  const params = useParams();
  const query = params?.query; 

  const {
    products,
    getDataFromSupabase,
    getFilteredData,
    filterData
  } = useSupabase();

  useEffect(() => {
    if (query) {
      getFilteredData(query.toString());
    }
  }, [query]);

  return (
    <div>
      <SearchResult filterData={filterData}/>
    </div>
  );
};

export default Page;
