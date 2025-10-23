"use client";

import React from 'react';
import { useOptimizedSupabase } from '@/hooks/useOptimizedSupabase';
import { getSampleData } from '@/lib/sample-data';

const TestDataPage = () => {
  const { 
    featuredProducts, 
    newArrivals, 
    bestSellers, 
    youWillLove,
    isLoading,
    error,
    getDataFromSupabase 
  } = useOptimizedSupabase();

  const sampleData = getSampleData();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Data Loading Test</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Hook Data</h2>
          <div className="space-y-2 text-sm">
            <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
            <div>Error: {error || 'None'}</div>
            <div>Featured Products: {featuredProducts?.length || 0}</div>
            <div>New Arrivals: {newArrivals?.length || 0}</div>
            <div>Best Sellers: {bestSellers?.length || 0}</div>
            <div>You Will Love: {youWillLove?.length || 0}</div>
          </div>
          <button 
            onClick={() => getDataFromSupabase(true)}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Data
          </button>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Sample Data</h2>
          <div className="space-y-2 text-sm">
            <div>Featured Products: {sampleData.featuredProducts.length}</div>
            <div>New Arrivals: {sampleData.newArrivals.length}</div>
            <div>Best Sellers: {sampleData.bestSellers.length}</div>
            <div>You Will Love: {sampleData.youWillLove.length}</div>
          </div>
        </div>

        {featuredProducts && featuredProducts.length > 0 && (
          <div className="bg-green-100 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">First Product</h2>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(featuredProducts[0], null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestDataPage;





