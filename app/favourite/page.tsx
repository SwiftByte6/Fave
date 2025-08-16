'use client'

import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import ProductCard from "@/component/ProductCarad"; // adjust path
// import { Heart } from "lucide-react";

const FavouritesPage = () => {
  const favourites = useSelector((state: RootState) => state.favourites.favourites);

  // cart function placeholder (you already have logic for cart slice)
  const addToCartItem = (product: any) => {
    console.log("Add to cart from favourites:", product);
    // dispatch(addToCart(product)) if needed
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
        <div className="grid md:grid-cols-3 gap-6">
          {favourites.map((product) => (
            <ProductCard
              key={product.id}
              data={product}
              addToCartItem={addToCartItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouritesPage;
