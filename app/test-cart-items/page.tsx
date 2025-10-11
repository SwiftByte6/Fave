'use client'

import { useSelector } from 'react-redux'

export default function TestCartItems() {
  const cart = useSelector((state) => state.cart.cart)

  const calculateSubtotal = () =>
    cart.reduce((total, item) => total + item.price * (item.cartQuantity || 1), 0)

  const prepareCartItems = () => {
    return cart.map((item) => ({
      id: item.id || Math.random().toString(36).substr(2, 9),
      title: item.title || item.name || 'Unknown Product',
      price: parseFloat(item.price) || 0,
      quantity: parseInt(item.cartQuantity) || 1,
      images: Array.isArray(item.images)
        ? item.images
        : (item.image ? [item.image] : (item.thumbnail ? [item.thumbnail] : [])),
      description: item.description || '',
      category: item.category || '',
      size: item.size || '',
      color: item.color || '',
      sku: item.sku || '',
      total_price: parseFloat(item.price) * (parseInt(item.cartQuantity) || 1)
    }))
  }

  const cartItems = prepareCartItems()

  return (
    <div className="min-h-screen bg-[#FBF8F6] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[#6f5a4d] mb-6 text-center">
            Cart Items Test
          </h1>

          <div className="space-y-6">
            {/* Cart Summary */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-700 mb-2">Cart Summary</h3>
              <div className="text-sm text-blue-600 space-y-1">
                <p><strong>Total Items:</strong> {cart.length}</p>
                <p><strong>Total Amount:</strong> ₹{calculateSubtotal().toFixed(2)}</p>
                <p><strong>Prepared Items:</strong> {cartItems.length}</p>
              </div>
            </div>

            {/* Raw Cart Data */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Raw Cart Data</h3>
              <div className="text-sm">
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-60">
                  {JSON.stringify(cart, null, 2)}
                </pre>
              </div>
            </div>

            {/* Prepared Items for Database */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-700 mb-2">Prepared Items for Database</h3>
              <div className="text-sm">
                <pre className="bg-green-100 p-3 rounded text-xs overflow-auto max-h-60">
                  {JSON.stringify(cartItems, null, 2)}
                </pre>
              </div>
            </div>

            {/* Item Details Table */}
            {cartItems.length > 0 && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-700 mb-2">Item Details Table</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-purple-100">
                        <th className="p-2 text-left">Title</th>
                        <th className="p-2 text-left">Price</th>
                        <th className="p-2 text-left">Quantity</th>
                        <th className="p-2 text-left">Total</th>
                        <th className="p-2 text-left">Images</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{item.title}</td>
                          <td className="p-2">₹{item.price}</td>
                          <td className="p-2">{item.quantity}</td>
                          <td className="p-2">₹{item.total_price}</td>
                          <td className="p-2">
                            {item.images.length > 0 ? (
                              <img 
                                src={item.images[0]} 
                                alt={item.title}
                                className="w-8 h-8 object-cover rounded"
                              />
                            ) : (
                              <span className="text-gray-400">No image</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-700 mb-2">Instructions</h3>
              <ul className="text-sm text-yellow-600 space-y-1">
                <li>• Add items to your cart first</li>
                <li>• This page shows how cart items will be stored in the database</li>
                <li>• Check the "Prepared Items" section to see the final structure</li>
                <li>• All items include: id, title, price, quantity, images, description, etc.</li>
                <li>• The items are stored as JSONB in the orders table</li>
              </ul>
            </div>

            {/* Database Schema Info */}
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-semibold text-indigo-700 mb-2">Database Storage</h3>
              <div className="text-sm text-indigo-600 space-y-1">
                <p><strong>Table:</strong> orders</p>
                <p><strong>Column:</strong> items (JSONB)</p>
                <p><strong>Structure:</strong> Array of item objects</p>
                <p><strong>Benefits:</strong> Flexible, queryable, no separate table needed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


