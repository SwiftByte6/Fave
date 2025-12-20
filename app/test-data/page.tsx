"use client";

import React from 'react';
import { getSampleData } from '@/lib/sample-data';


const TestDataPage = () => {
  // Use only sampleData for test display
  const sampleData = getSampleData();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Data Loading Test</h1>
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Sample Data</h2>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(sampleData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TestDataPage;





