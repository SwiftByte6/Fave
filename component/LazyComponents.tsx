import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

// Loading components
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl lg:rounded-3xl border border-pink-100 shadow-sm overflow-hidden h-[420px] animate-pulse">
    <div className="h-[62%] bg-pink-50"></div>
    <div className="p-4 h-[25%] flex flex-col justify-between">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-20"></div>
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  </div>
);

const SliderSkeleton = () => (
  <div className="relative w-full max-w-6xl mx-auto py-10">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

// Lazy-loaded components with loading states
export const LazyNewArrivalsGrid = dynamic(
  () => import('@/component/Home/NewArrivalsGrid'),
  {
    loading: () => (
      <section className="pb-8 md:pb-12 min-h-screen">
        <div className="mx-auto max-w-6xl px-4 md:px-6 space-y-6">
          <div className="text-center">
            <div className="h-16 bg-gray-200 rounded w-64 mx-auto mb-5 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    ),
    ssr: false
  }
);

export const LazyThingsULike = dynamic(
  () => import('@/component/Home/ThingsULike'),
  {
    loading: () => (
      <section className="py-12 md:py-16">
        <div className="text-center mb-6 md:mb-8">
          <div className="h-16 bg-gray-200 rounded w-80 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
        </div>
        <SliderSkeleton />
      </section>
    ),
    ssr: false
  }
);

export const LazySlider = dynamic(
  () => import('@/component/SwiperMain/Slider').then(m => ({ default: m.Slider })),
  {
    loading: () => <SliderSkeleton />,
    ssr: false
  }
);

export const LazyProductCard = dynamic(
  () => import('@/component/ProductCarad'),
  {
    loading: () => <ProductCardSkeleton />,
    ssr: false
  }
);

// Higher-order component for lazy loading with intersection observer
export const LazyLoadWrapper = ({ 
  children, 
  fallback = <ProductCardSkeleton />,
  threshold = 0.1 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
  threshold?: number;
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  );
};

// Memoized product grid component
export const MemoizedProductGrid = React.memo(({ 
  products, 
  addToCartItem, 
  variant = "bestseller",
  showCategoryBadge = false,
  showAddToCart = true,
  currencySymbol = "₹"
}: {
  products: any[];
  addToCartItem: (product: any) => void;
  variant?: "default" | "search" | "compact" | "bestseller";
  showCategoryBadge?: boolean;
  showAddToCart?: boolean;
  currencySymbol?: string;
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
      {products.map((product) => (
        <LazyLoadWrapper key={product.id}>
          <LazyProductCard
            data={product}
            variant={variant}
            showCategoryBadge={showCategoryBadge}
            showAddToCart={showAddToCart}
            addToCartItem={addToCartItem}
            currencySymbol={currencySymbol}
          />
        </LazyLoadWrapper>
      ))}
    </div>
  );
});

MemoizedProductGrid.displayName = 'MemoizedProductGrid';
