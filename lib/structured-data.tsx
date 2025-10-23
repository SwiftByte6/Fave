import React from 'react';
import { generateBreadcrumbStructuredData, generateProductStructuredData, generateOrganizationStructuredData, generateWebsiteStructuredData, BreadcrumbItem, ProductSEOData } from './seo';

interface StructuredDataProps {
  data: any;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2),
      }}
    />
  );
}

interface BreadcrumbStructuredDataProps {
  breadcrumbs: BreadcrumbItem[];
}

export function BreadcrumbStructuredData({ breadcrumbs }: BreadcrumbStructuredDataProps) {
  const data = generateBreadcrumbStructuredData(breadcrumbs);
  return <StructuredData data={data} />;
}

interface ProductStructuredDataProps {
  product: ProductSEOData;
}

export function ProductStructuredData({ product }: ProductStructuredDataProps) {
  const data = generateProductStructuredData(product);
  return <StructuredData data={data} />;
}

export function OrganizationStructuredData() {
  const data = generateOrganizationStructuredData();
  return <StructuredData data={data} />;
}

export function WebsiteStructuredData() {
  const data = generateWebsiteStructuredData();
  return <StructuredData data={data} />;
}
