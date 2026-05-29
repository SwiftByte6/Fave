import type { Metadata } from 'next';
import { fetchProducts } from '@/lib/products';
import RazorpayShiprocketDemoClient from './RazorpayShiprocketDemoClient';

export const metadata: Metadata = {
  title: 'Razorpay to Shiprocket Demo | Favee',
  description: 'End-to-end demo of order creation, Razorpay payment, payment verification, and Shiprocket fulfillment.',
};

export default async function RazorpayShiprocketDemoPage() {
  const { products } = await fetchProducts({ page: 1, pageSize: 12 });

  return <RazorpayShiprocketDemoClient products={products} />;
}
