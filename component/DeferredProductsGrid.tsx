"use client";
import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCarad';

interface Props {
  products: any[];
  addToCartItem?: (product: any) => Promise<boolean | void>;
}

const LOAD_COUNT = 20;

const DeferredProductsGrid: React.FC<Props> = ({ products, addToCartItem }) => {
  const [ready, setReady] = useState(false);
  const [visibleCount, setVisibleCount] = useState(LOAD_COUNT);

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

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + LOAD_COUNT, products.length));
  };

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <section className="py-16 flex max-w-9xl mx-auto flex-col items-center gap-8 bg-linear-to-br from-fav-off-white via-fav-beige/30 to-fav-blush/20" aria-labelledby="all-products-heading">
      <div className="flex flex-col items-center justify-center mb-12">
                  <h2 className="text-4xl md:text-5xl font-black text-[#2A2A2A] tracking-wider uppercase mb-4 text-center">
                    Our Collection
                  </h2>
                  <div className="w-24 h-1 bg-[#7A1F2A]"></div>
                </div>

      {!ready ? (
        <div className="w-full max-w-[1200px] grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-4" role="list">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="animate-pulse bg-white/70 border border-fav-blush rounded-xl h-48" />
          ))}
        </div>
      ) : (
        <>
          <div className="w-full  grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-4" role="list">
            {visibleProducts.map((p: any) => (
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
          {visibleCount < products.length && (
            <button
              onClick={handleLoadMore}
              className="mt-6 px-6 py-2 rounded-lg bg-fav-gold-gradient text-white font-semibold shadow"
            >
              Load More
            </button>
          )}
        </>
      )}
    </section>
  );
};

export default DeferredProductsGrid;