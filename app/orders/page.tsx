"use client";
import React, { useEffect, useState, useCallback } from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase/products";

interface OrderItem {
  id: string;
  order_id: string;
  title: string;
  price: number;
  quantity: number;
  images?: string[];
}

interface OrderRow {
  id: string;
  created_at?: string;
  total_amount: number;
  status?: string; // pending | processing | shipped | delivered | success | cancelled
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  pincode?: string;
  country?: string;
}

const OrdersPage: React.FC = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState<Array<OrderRow & { items: OrderItem[] }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'history'>('orders');

  const fetchOrders = useCallback(async () => {
      if (!user?.id) return;
      setIsLoading(true);

      const { data: orderRows, error } = await supabase
        .from("orders")
        .select("id, created_at, total_amount, status, name, email, phone, address, city, pincode, country")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setIsLoading(false);
        return;
      }

      const orderIds = (orderRows || []).map((o) => o.id);
      if (orderIds.length === 0) {
        setOrders([]);
        setIsLoading(false);
        return;
      }

      const { data: itemRows, error: itemsError } = await supabase
        .from("order_items")
        .select("id, order_id, title, price, quantity, images")
        .in("order_id", orderIds);

      if (itemsError) {
        console.error(itemsError);
      }

      const itemsByOrderId: Record<string, OrderItem[]> = {};
      (itemRows || []).forEach((it) => {
        if (!itemsByOrderId[it.order_id]) itemsByOrderId[it.order_id] = [];
        itemsByOrderId[it.order_id].push(it);
      });

      const merged = (orderRows || []).map((o) => ({
        ...o,
        items: itemsByOrderId[o.id] || [],
      }));

      setOrders(merged);
      setIsLoading(false);
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    fetchOrders();

    // Subscribe to realtime updates for this user's orders
    const channel = supabase
      .channel(`orders-changes-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${user.id}` },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    // Polling fallback every 15s
    const interval = setInterval(() => {
      fetchOrders();
    }, 15000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchOrders]);

  // Filter orders based on active tab
  const currentOrders = orders.filter(order => order.status !== 'delivered' && order.status !== 'success');
  const historyOrders = orders.filter(order => order.status === 'delivered' || order.status === 'success');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'processing': return '🔄';
      case 'shipped': return '📦';
      case 'delivered': return '✅';
      case 'success': return '✅';
      case 'cancelled': return '❌';
      default: return '❓';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Your Orders & History</h1>
      
      <SignedOut>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="mb-4 text-gray-600">Please sign in to view your orders and history.</p>
          <SignInButton>
            <button className="text-sm font-medium px-4 py-2 rounded-full bg-pink-600 text-white hover:bg-pink-700 transition">
              Sign In
            </button>
          </SignInButton>
        </div>
      </SignedOut>
      
      <SignedIn>
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              activeTab === 'orders'
                ? 'bg-white text-pink-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Current Orders ({currentOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              activeTab === 'history'
                ? 'bg-white text-pink-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Order History ({historyOrders.length})
          </button>
        </div>

        {isLoading ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : (
          <>
            {/* Current Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                {currentOrders.length === 0 ? (
                  <div className="bg-white shadow rounded-lg p-8 text-center">
                    <div className="text-4xl mb-4">📦</div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No Active Orders</h3>
                    <p className="text-gray-600">You don't have any pending orders at the moment.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentOrders.map((order) => (
                      <div key={order.id} className="bg-white shadow rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">Order #{order.id}</h3>
                            <p className="text-sm text-gray-500">
                              {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : ''}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status || 'pending')}`}>
                              <span className="mr-2">{getStatusIcon(order.status || 'pending')}</span>
                              {order.status || 'pending'}
                            </div>
                            <p className="text-lg font-bold text-gray-800 mt-1">₹ {order.total_amount?.toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Order Progress */}
                        <div className="mb-4">
                          <div className="w-full bg-gray-200 h-2 rounded-full">
                            <div
                              className="bg-pink-500 h-2 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${(['pending','processing','shipped','delivered'].indexOf((order.status||'pending'))+1)/4*100}%` 
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span className={order.status === 'pending' ? 'text-pink-600 font-medium' : ''}>Pending</span>
                            <span className={order.status === 'processing' ? 'text-pink-600 font-medium' : ''}>Processing</span>
                            <span className={order.status === 'shipped' ? 'text-pink-600 font-medium' : ''}>Shipped</span>
                            <span className={order.status === 'delivered' ? 'text-pink-600 font-medium' : ''}>Delivered</span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="border-t pt-4">
                          <h4 className="font-medium text-gray-800 mb-3">Order Items:</h4>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded">
                                <div className="flex items-center space-x-3">
                                  <div className="text-gray-700 font-medium">{item.title}</div>
                                  <span className="text-gray-500">x{item.quantity}</span>
                                </div>
                                <div className="text-gray-700 font-medium">₹ {(item.price * item.quantity).toLocaleString()}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping Details */}
                        {order.address && (
                          <div className="border-t pt-4 mt-4">
                            <h4 className="font-medium text-gray-800 mb-3">Shipping Details:</h4>
                            <div className="text-sm text-gray-600">
                              <p><strong>{order.name}</strong></p>
                              <p>{order.address}</p>
                              <p>{order.city}, {order.pincode}</p>
                              <p>{order.country}</p>
                              <p className="mt-2"><strong>Contact:</strong> {order.phone}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Order History Tab */}
            {activeTab === 'history' && (
              <div>
                {historyOrders.length === 0 ? (
                  <div className="bg-white shadow rounded-lg p-8 text-center">
                    <div className="text-4xl mb-4">📚</div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No Order History</h3>
                    <p className="text-gray-600">Your completed orders will appear here.</p>
                  </div>
                ) : (
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Order Details
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Items
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {historyOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                                  {order.name && (
                                    <div className="text-sm text-gray-500">{order.name}</div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">
                                  {order.items.slice(0, 2).map((item, index) => (
                                    <div key={item.id} className="mb-1">
                                      {item.title} x{item.quantity}
                                    </div>
                                  ))}
                                  {order.items.length > 2 && (
                                    <div className="text-gray-500 text-xs">
                                      +{order.items.length - 2} more items
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  ₹ {order.total_amount?.toLocaleString()}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  }) : ''}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status || 'success')}`}>
                                  <span className="mr-1">{getStatusIcon(order.status || 'success')}</span>
                                  {order.status || 'success'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </SignedIn>
    </div>
  );
};

export default OrdersPage;


