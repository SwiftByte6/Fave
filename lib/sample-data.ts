// Sample data for testing when Supabase is unavailable
export const sampleProducts = [
  {
    id: 1,
    title: "Elegant Floral Dress",
    price: 1299,
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop&q=80"],
    category: "Dresses",
    description: "Beautiful floral dress perfect for any occasion",
    created_at: new Date().toISOString(),
    sales: 25,
    orders: 30
  },
  {
    id: 2,
    title: "Classic White Shirt",
    price: 899,
    images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop&q=80"],
    category: "Shirts",
    description: "Timeless white shirt for professional look",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    sales: 15,
    orders: 20
  },
  {
    id: 3,
    title: "Denim Jeans",
    price: 1599,
    images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&q=80"],
    category: "Jeans",
    description: "Comfortable and stylish denim jeans",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    sales: 40,
    orders: 45
  },
  {
    id: 4,
    title: "Summer Blouse",
    price: 799,
    images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&q=80"],
    category: "Blouses",
    description: "Light and airy summer blouse",
    created_at: new Date(Date.now() - 259200000).toISOString(),
    sales: 20,
    orders: 25
  },
  {
    id: 5,
    title: "Black Leather Jacket",
    price: 2999,
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&q=80"],
    category: "Jackets",
    description: "Stylish black leather jacket",
    created_at: new Date(Date.now() - 345600000).toISOString(),
    sales: 10,
    orders: 12
  },
  {
    id: 6,
    title: "Casual T-Shirt",
    price: 599,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&q=80"],
    category: "T-Shirts",
    description: "Comfortable casual t-shirt",
    created_at: new Date(Date.now() - 432000000).toISOString(),
    sales: 35,
    orders: 40
  },
  {
    id: 7,
    title: "Vintage Denim Jacket",
    price: 1899,
    images: ["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&q=80"],
    category: "Jackets",
    description: "Classic vintage denim jacket",
    created_at: new Date(Date.now() - 518400000).toISOString(),
    sales: 18,
    orders: 22
  },
  {
    id: 8,
    title: "Silk Scarf",
    price: 499,
    images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&q=80"],
    category: "Accessories",
    description: "Elegant silk scarf for any outfit",
    created_at: new Date(Date.now() - 604800000).toISOString(),
    sales: 30,
    orders: 35
  }
];

export const getSampleData = () => {
  return {
    featuredProducts: sampleProducts.slice(0, 8),
    newArrivals: sampleProducts
      .map(p => ({ ...p, _createdAt: new Date(p.created_at).getTime() }))
      .sort((a, b) => b._createdAt - a._createdAt)
      .slice(0, 6),
    bestSellers: sampleProducts
      .map(p => ({ ...p, _popularity: p.sales || p.orders || 0, _createdAt: new Date(p.created_at).getTime() }))
      .sort((a, b) => (b._popularity - a._popularity) || (b._createdAt - a._createdAt))
      .slice(0, 4),
    youWillLove: sampleProducts.slice(6, 12)
  };
};
