"use client";
import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCarad';

interface Props {
  products: any[];
  addToCartItem: (product: any) => void;
}

const DeferredProductsGrid: React.FC<Props> = ({ products, addToCartItem }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onIdle = () => setReady(true);

    // Prefer idle time after full page load
    const onLoad = () => {
      if (typeof (window as any).requestIdleCallback === 'function') {
        (window as any).requestIdleCallback(onIdle, { timeout: 2000 });
      } else {
        // Fallback: defer a bit to let main content settle
        setTimeout(onIdle, 1500);
      }
    };

    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad, { once: true });
      return () => window.removeEventListener('load', onLoad as any);
    }
  }, []);

  return (
    <section className="py-16 flex flex-col items-center gap-8 bg-linear-to-br from-fav-off-white via-fav-beige/30 to-fav-blush/20" aria-labelledby="all-products-heading">
      <div className="relative">
        <div className="px-8 py-4 rounded-2xl bg-fav-gold-gradient shadow-xl">
          <h2 id="all-products-heading" className="dancing text-[2.5rem] md:text-[4rem] text-fav-off-white font-bold">Our Collection</h2>
        </div>
        <div className="absolute inset-0 bg-fav-gold-gradient rounded-2xl blur-xl opacity-30 -z-10"></div>
      </div>
      <p className="text-center text-fav-charcoal max-w-4xl text-lg font-medium leading-relaxed px-4">
        Explore our complete collection of premium ethnic wear, handpicked for their timeless beauty and exceptional craftsmanship.
      </p>

      {!ready ? (
        <div className="w-full max-w-[1200px] grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-4" role="list">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="animate-pulse bg-white/70 border border-fav-blush rounded-xl h-48" />
          ))}
        </div>
      ) : (
        <div className="w-full max-w-[1200px] grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-4" role="list">
          {products.map((p: any) => (
            <ProductCard
              key={p.id}
              data={p}
              variant="bestseller"
              showCategoryBadge={true}
              showAddToCart={true}
              addToCartItem={addToCartItem}
              currencySymbol="₹"
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default DeferredProductsGrid;
