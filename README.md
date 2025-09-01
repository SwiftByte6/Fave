This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


Variant	Height	Use Case	Features
default	550px-700px	HomePage, Favourites, New Arrivals	Full features, standard layout
search	500px-650px	Search Results	Category badge, search-optimized
compact	400px-500px	Space-constrained layouts	Smaller, efficient design
⚙️ Configurable Props
Prop	Type	Default	Description
data	ProductData	Required	Product information
variant	string	'default'	Card variant type
showCategoryBadge	boolean	false	Show category overlay
showWishlist	boolean	true	Show wishlist heart
showAddToCart	boolean	true	Show add to cart button
addToCartItem	function	optional	Cart function
className	string	''	Additional CSS classes
// Default product card (HomePage, Favourites)
<ProductCard 
  data={product} 
  variant="default"
  addToCartItem={addToCartItem}
/>

// Search results card with category badge
<ProductCard 
  data={product} 
  variant="search"
  showCategoryBadge={true}
  addToCartItem={addToCartItem}
/>

// Compact card without add to cart
<ProductCard 
  data={product} 
  variant="compact"
  showAddToCart={false}
/>