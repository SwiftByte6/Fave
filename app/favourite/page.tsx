'use client'

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import ProductCard from "@/component/ProductCarad";

const FavouritesPage = () => {
  const favourites = useSelector((state: RootState) => state.favourites.favourites);
  const dispatch = useDispatch();

  // cart function placeholder (you already have logic for cart slice)
  const addToCartItem = (product: any) => {
    console.log("Add to cart from favourites:", product);
    // Implement by dispatching addToCart when needed elsewhere
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-pink-600">
        Your Favourites
      </h1>

      {favourites.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-gray-600">Your favourites list is empty 💔</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {favourites.map((product) => (
            <ProductCard
              key={product.id}
              data={product}
              variant="default"
              showCategoryBadge={false}
              showWishlist={true}
              showAddToCart={true}
              addToCartItem={addToCartItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouritesPage;
