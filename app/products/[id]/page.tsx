import { notFound } from 'next/navigation';
import { fetchProductBySlugOrId } from '@/lib/products';
import { generateProductMetadata } from '@/lib/seo';
import { ProductStructuredData, BreadcrumbStructuredData } from '@/lib/structured-data';
import ProductDetailPage from '@/component/ProductDetailPage';
import type { Metadata } from 'next';


interface ProductPageProps {
  params: Promise<{ id: string | number }> ;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string | number }> ;
}): Promise<Metadata> {
  const { id } = await params;
  if (!id) {
    return {
      title: 'Product Not Found | Favee',
      description: 'The requested product could not be found.',
    };
  }
  const product = await fetchProductBySlugOrId({ id });
  if (!product) {
    return {
      title: 'Product Not Found | Favee',
      description: 'The requested product could not be found.',
    };
  }
  return generateProductMetadata(product);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  console.log('ProductPage id:', id); // Debug: log id
  if (!id) {
    notFound();
    return null;
  }
  const product = await fetchProductBySlugOrId({ id });
  console.log('Fetched product:', product); // Debug: log product

  if (!product) {
    // Optionally show a user-friendly message instead of just notFound()
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <p>The requested product could not be found.</p>
      </div>
    );
    // Or just use: notFound();
  }

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/collection' },
    { name: product.category, url: `/categories/${product.category.toLowerCase()}` },
    { name: product.title, url: `/products/${product.slug || product.id}` },
  ];

  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <ProductStructuredData product={product} />
      <ProductDetailPage product={product} />
    </>
  );
}