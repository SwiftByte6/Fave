"use client";
import React, { useEffect, useState, useCallback } from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase/products";
import PaymentStatus from "@/component/PaymentStatus";
import OrderTracking from "@/component/OrderTracking";

export const dynamic = 'force-dynamic';

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  images?: string[];
  size?: string; // Added size field
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
  payment_id?: string;
  payment_method?: string;
  razorpay_order_id?: string;
  items: OrderItem[]; // Items stored directly in orders table as JSON
  // Shiprocket fields
  shipping_status?: string;
  awb_code?: string;
  courier_name?: string;
  tracking_url?: string;
  expected_delivery_date?: string;
  actual_delivery_date?: string;
}

const OrdersPage: React.FC = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'history'>('orders');

  const fetchOrders = useCallback(async () => {
      if (!user?.id) return;
      setIsLoading(true);

      const { data: orderRows, error } = await supabase
        .from("orders")
        .select("id, created_at, total_amount, status, name, email, phone, address, city, pincode, country, payment_id, payment_method, razorpay_order_id, items, shipping_status, awb_code, courier_name, tracking_url, expected_delivery_date, actual_delivery_date")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setIsLoading(false);
        return;
      }

      // Orders now contain items directly as JSON, no need for separate query
      setOrders(orderRows || []);
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
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="flex items-center justify-center mb-6">
        <div className="px-6 py-2 rounded-full bg-[#F4DCDC] shadow-sm">
          <h1 className="dancing text-[2rem] md:text-[3rem] text-[#6f5a4d] font-bold">Your Orders & History</h1>
        </div>
      </div>

      {/* Quick Tracking Info */}
      <div className="bg-gradient-to-r from-[#F4DCDC] to-[#F0E7DE] rounded-xl p-6 mb-8 border border-[#F0E7DE]">
        <div className="flex items-start space-x-4">
          <div className="text-3xl">📦</div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-[#6f5a4d] mb-2">Order Tracking Information</h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-[#8A6F5C]">
              <div>
                <p className="font-medium text-[#6f5a4d]">🎯 Real-time Updates</p>
                <p>Orders update automatically every 15 seconds</p>
              </div>
              <div>
                <p className="font-medium text-[#6f5a4d]">📱 Shiprocket Integration</p>
                <p>Full tracking once shipping starts</p>
              </div>
              <div>
                <p className="font-medium text-[#6f5a4d]">📞 Need Help?</p>
                <p>Email support@favee.com with Order ID</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <SignedOut>
        <div className="bg-white/90 shadow-sm rounded-xl p-6 border border-[#F0E7DE]">
          <p className="mb-4 text-[#8A6F5C]">Please sign in to view your orders and history.</p>
          <SignInButton mode="redirect">
            <button className="text-sm font-medium px-5 py-2.5 rounded-full bg-[#F4B7C7] text-[#3a2a24] hover:bg-[#f1aabf] transition">
              Sign In
            </button>
          </SignInButton>
        </div>
      </SignedOut>
      
      <SignedIn>
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-[#F4DCDC]/60 p-1 rounded-full mb-8 border border-[#F0E7DE]">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition ${
              activeTab === 'orders'
                ? 'bg-white text-[#6f5a4d] shadow-sm'
                : 'text-[#8A6F5C] hover:text-[#6f5a4d]'
            }`}
          >
            Current Orders ({currentOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition ${
              activeTab === 'history'
                ? 'bg-white text-[#6f5a4d] shadow-sm'
                : 'text-[#8A6F5C] hover:text-[#6f5a4d]'
            }`}
          >
            Order History ({historyOrders.length})
          </button>
        </div>

        {isLoading ? (
          <div className="bg-white/90 shadow-sm rounded-xl p-6 text-center border border-[#F0E7DE]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F4B7C7] mx-auto mb-2"></div>
            <p className="text-[#8A6F5C]">Loading orders...</p>
          </div>
        ) : (
          <>
            {/* Current Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                {currentOrders.length === 0 ? (
                  <div className="bg-white/90 shadow-sm rounded-xl p-8 text-center border border-[#F0E7DE]">
                    <div className="text-4xl mb-4">📦</div>
                    <h3 className="text-lg font-semibold text-[#6f5a4d] mb-2">No Active Orders</h3>
                    <p className="text-[#8A6F5C]">You don't have any pending orders at the moment.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentOrders.map((order) => (
                      <div key={order.id} className="bg-white/90 shadow-sm rounded-xl p-6 border border-[#F0E7DE]">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-[#6f5a4d]">Order #{order.id}</h3>
                            <p className="text-sm text-[#8A6F5C]">
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
                            <p className="text-lg font-bold text-[#6f5a4d] mt-1">₹ {order.total_amount?.toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Payment Status */}
                        <div className="mb-4">
                          <PaymentStatus 
                            status={order.status || 'pending'} 
                            paymentId={order.payment_id}
                            paymentMethod={order.payment_method}
                          />
                        </div>

                        {/* Order Progress */}
                        <div className="mb-4">
                          <div className="w-full bg-[#F7F2EE] h-2 rounded-full">
                            <div
                              className="bg-[#F4B7C7] h-2 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${(['pending','processing','shipped','delivered'].indexOf((order.status||'pending'))+1)/4*100}%` 
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-[#8A6F5C] mt-2">
                            <span className={order.status === 'pending' ? 'text-[#6f5a4d] font-medium' : ''}>Pending</span>
                            <span className={order.status === 'processing' ? 'text-[#6f5a4d] font-medium' : ''}>Processing</span>
                            <span className={order.status === 'shipped' ? 'text-[#6f5a4d] font-medium' : ''}>Shipped</span>
                            <span className={order.status === 'delivered' ? 'text-[#6f5a4d] font-medium' : ''}>Delivered</span>
                          </div>
                        </div>

                        {/* Shiprocket Tracking */}
                        {(order.shipping_status && order.shipping_status !== 'pending') ? (
                          <OrderTracking order={{
                            id: order.id,
                            shipping_status: order.shipping_status,
                            awb_code: order.awb_code,
                            courier_name: order.courier_name,
                            tracking_url: order.tracking_url,
                            expected_delivery_date: order.expected_delivery_date,
                            actual_delivery_date: order.actual_delivery_date
                          }} />
                        ) : (
                          /* Show tracking placeholder for orders without Shiprocket data */
                          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-blue-900 mb-1">Order Tracking</h4>
                                <p className="text-sm text-blue-700">
                                  {order.status === 'pending' && 'Your order is being prepared for shipment'}
                                  {order.status === 'processing' && 'Your order is being processed and will be shipped soon'}
                                  {order.status === 'shipped' && 'Your order has been shipped and is on its way'}
                                  {order.status === 'delivered' && 'Your order has been delivered successfully'}
                                </p>
                              </div>
                              <div className="text-2xl">
                                {order.status === 'pending' && '⏳'}
                                {order.status === 'processing' && '📦'}
                                {order.status === 'shipped' && '🚚'}
                                {order.status === 'delivered' && '✅'}
                              </div>
                            </div>
                            {order.status !== 'pending' && (
                              <div className="mt-3 pt-3 border-t border-blue-200">
                                <p className="text-xs text-blue-600">
                                  📞 For detailed tracking information, contact customer support with Order ID: #{order.id}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Order Items */}
                        <div className="border-t pt-4">
                          <h4 className="font-medium text-[#6f5a4d] mb-3">Order Items:</h4>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-start justify-between text-sm bg-[#F7F2EE] p-3 rounded-md">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-1">
                                    <div className="text-[#6f5a4d] font-medium">{item.title}</div>
                                    <span className="text-[#8A6F5C]">x{item.quantity}</span>
                                  </div>
                                  {item.size && (
                                    <p className="text-xs text-[#8A6F5C] ml-0">Size: {item.size}</p>
                                  )}
                                </div>
                                <div className="text-[#6f5a4d] font-medium whitespace-nowrap ml-2">₹ {(item.price * item.quantity).toLocaleString()}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tracking Actions */}
                        <div className="border-t pt-4 mt-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => window.location.href = `/orders?track=${order.id}`}
                              className="text-sm px-4 py-2 bg-[#F4DCDC] text-[#6f5a4d] rounded-lg hover:bg-[#F0E7DE] transition font-medium"
                            >
                              📍 Track This Order
                            </button>
                            {order.awb_code && (
                              <button
                                onClick={() => navigator.clipboard.writeText(order.awb_code || '')}
                                className="text-sm px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium"
                              >
                                📋 Copy AWB: {order.awb_code}
                              </button>
                            )}
                            <a
                              href={`mailto:support@favee.com?subject=Order Tracking - ${order.id}&body=Hi, I would like to track my order ${order.id}. Please provide tracking details.`}
                              className="text-sm px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-medium"
                            >
                              📧 Email Support
                            </a>
                          </div>
                        </div>

                        {/* Shipping Details */}
                        {order.address && (
                          <div className="border-t pt-4 mt-4">
                            <h4 className="font-medium text-[#6f5a4d] mb-3">Shipping Details:</h4>
                            <div className="text-sm text-[#8A6F5C]">
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
                  <div className="bg-white/90 shadow-sm rounded-xl p-8 text-center border border-[#F0E7DE]">
                    <div className="text-4xl mb-4">📚</div>
                    <h3 className="text-lg font-semibold text-[#6f5a4d] mb-2">No Order History</h3>
                    <p className="text-[#8A6F5C]">Your completed orders will appear here.</p>
                  </div>
                ) : (
                  <div className="bg-white/90 shadow-sm rounded-xl overflow-hidden border border-[#F0E7DE]">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-[#F0E7DE]">
                        <thead className="bg-[#FFF7F9]">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-[#8A6F5C] uppercase tracking-wider">
                              Order Details
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-[#8A6F5C] uppercase tracking-wider">
                              Items
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-[#8A6F5C] uppercase tracking-wider">
                              Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-[#8A6F5C] uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-[#8A6F5C] uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#F0E7DE]">
                          {historyOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-[#FFF7F9]">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-semibold text-[#6f5a4d]">#{order.id}</div>
                                  {order.name && (
                                    <div className="text-sm text-[#8A6F5C]">{order.name}</div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-[#6f5a4d]">
                                  {order.items.slice(0, 2).map((item, index) => (
                                    <div key={item.id} className="mb-1">
                                      <div>{item.title} x{item.quantity}</div>
                                      {item.size && (
                                        <div className="text-xs text-[#8A6F5C]">Size: {item.size}</div>
                                      )}
                                    </div>
                                  ))}
                                  {order.items.length > 2 && (
                                    <div className="text-[#8A6F5C] text-xs">
                                      +{order.items.length - 2} more items
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-[#6f5a4d]">
                                  ₹ {order.total_amount?.toLocaleString()}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-[#6f5a4d]">
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


