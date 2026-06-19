"use client";
import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/products";
import PaymentStatus from "@/component/PaymentStatus";
import OrderTracking from "@/component/OrderTracking";
import Image from "next/image";

export const dynamic = 'force-dynamic';

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  images?: string[];
  size?: string;
}

interface OrderRow {
  id: string;
  created_at?: string;
  total_amount: number;
  discount_amount?: number;
  shipping_cost?: number;
  tax_amount?: number;
  notes?: string;
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
  items: OrderItem[];
  // Shiprocket fields
  shipping_status?: string;
  awb_code?: string;
  courier_name?: string;
  tracking_url?: string;
  expected_delivery_date?: string;
  actual_delivery_date?: string;
}

const OrdersPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'history'>('orders');

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(data?.user ?? null);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      mounted = false;
      sub?.subscription.unsubscribe();
    };
  }, []);

  const fetchOrders = useCallback(async () => {
      if (!user?.id) return;
      setIsLoading(true);
      const { data: orderRows, error } = await supabase
        .from("orders")
        .select("id, created_at, total_amount, discount_amount, shipping_cost, tax_amount, notes, status, name, email, phone, address, city, pincode, country, payment_id, payment_method, razorpay_order_id, items, shipping_status, awb_code, courier_name, tracking_url, expected_delivery_date, actual_delivery_date")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setIsLoading(false);
        return;
      }

      setOrders(orderRows || []);
      setIsLoading(false);
    }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    fetchOrders();

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

    const interval = setInterval(() => {
      fetchOrders();
    }, 15000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchOrders]);

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

  const getProgressBarWidth = (status: string) => {
    const statuses = ['pending', 'processing', 'shipped', 'delivered'];
    let index = statuses.indexOf(status);
    if (status === 'success') index = 3;
    if (index === -1) index = 0;
    return `${((index + 1) / 4) * 100}%`;
  };

  const ordersContent = isLoading ? (
    <div className="bg-fav-off-white/90 shadow-sm rounded-2xl p-8 text-center border border-fav-beige max-w-2xl mx-auto mt-10">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-fav-maroon mx-auto mb-4"></div>
      <p className="text-fav-warm-gray font-medium text-lg">Loading your orders...</p>
    </div>
  ) : (
    <>
      {/* Current Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {currentOrders.length === 0 ? (
            <div className="bg-fav-off-white shadow-md rounded-2xl p-10 text-center border border-fav-blush/30">
              <div className="text-6xl mb-4 opacity-80">🛍️</div>
              <h3 className="text-2xl font-bold text-fav-charcoal mb-2">No Active Orders</h3>
              <p className="text-fav-warm-gray max-w-md mx-auto">You don't have any pending orders at the moment. Browse our collection to find something you love!</p>
              <button 
                onClick={() => window.location.href = '/collection'} 
                className="mt-6 bg-fav-primary text-fav-off-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                Shop Now
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {currentOrders.map((order) => (
                <div key={order.id} className="bg-fav-off-white/95 backdrop-blur-sm shadow-lg rounded-2xl p-6 md:p-8 border border-fav-blush/40 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-fav-beige">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-fav-charcoal font-sans">Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(order.status || 'pending')}`}>
                          <span className="mr-1.5">{getStatusIcon(order.status || 'pending')}</span>
                          {order.status || 'pending'}
                        </div>
                      </div>
                      <p className="text-sm text-fav-warm-gray font-medium">
                        Placed on {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : ''}
                      </p>
                    </div>
                    <div className="text-left md:text-right bg-fav-beige/30 p-3 rounded-xl border border-fav-blush/20">
                      <p className="text-xs text-fav-warm-gray uppercase tracking-wider font-semibold mb-1">Total Amount</p>
                      <p className="text-2xl font-black text-fav-maroon">₹ {order.total_amount?.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <PaymentStatus 
                      status={order.status || 'pending'} 
                      paymentId={order.payment_id}
                      paymentMethod={order.payment_method}
                    />
                  </div>

                  {order.status !== 'cancelled' && (
                    <div className="mb-8 bg-white p-5 rounded-xl border border-fav-beige shadow-sm">
                      <h4 className="font-semibold text-fav-charcoal mb-4 flex items-center gap-2">
                        <span className="text-xl">📍</span> Order Status
                      </h4>
                      <div className="w-full bg-fav-beige h-2.5 rounded-full overflow-hidden mb-3">
                        <div
                          className="bg-fav-primary h-full rounded-full transition-all duration-1000 ease-out relative"
                          style={{ width: getProgressBarWidth(order.status || 'pending') }}
                        >
                          <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm font-medium text-fav-warm-gray mt-2 px-1">
                        <span className={order.status === 'pending' ? 'text-fav-maroon font-bold' : ''}>Confirmed</span>
                        <span className={order.status === 'processing' ? 'text-fav-maroon font-bold text-center' : 'text-center'}>Processing</span>
                        <span className={order.status === 'shipped' ? 'text-fav-maroon font-bold text-center' : 'text-center'}>Shipped</span>
                        <span className={order.status === 'delivered' || order.status === 'success' ? 'text-fav-maroon font-bold text-right' : 'text-right'}>Delivered</span>
                      </div>
                    </div>
                  )}

                  {(order.shipping_status && order.shipping_status !== 'pending') ? (
                    <div className="mb-8">
                      <OrderTracking order={{
                        id: order.id,
                        shipping_status: order.shipping_status,
                        awb_code: order.awb_code,
                        courier_name: order.courier_name,
                        tracking_url: order.tracking_url,
                        expected_delivery_date: order.expected_delivery_date,
                        actual_delivery_date: order.actual_delivery_date
                      }} />
                    </div>
                  ) : (
                    <div className="bg-fav-beige/40 rounded-xl p-5 border border-fav-blush/40 mb-8 flex items-start gap-4">
                      <div className="text-3xl mt-1">
                        {order.status === 'pending' && '⏳'}
                        {order.status === 'processing' && '🛠️'}
                        {order.status === 'shipped' && '🚚'}
                        {order.status === 'delivered' && '🎉'}
                        {order.status === 'cancelled' && '🚫'}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-fav-charcoal mb-1 text-lg">Tracking Information</h4>
                        <p className="text-sm text-fav-warm-gray leading-relaxed">
                          {order.status === 'pending' && 'Your order has been received and is waiting to be processed. We will notify you once it moves to the next step.'}
                          {order.status === 'processing' && 'We are currently preparing your items for shipment. You will receive a tracking link soon.'}
                          {order.status === 'shipped' && 'Good news! Your order is on its way. Detailed tracking will be updated shortly.'}
                          {order.status === 'delivered' && 'This order has been successfully delivered. Enjoy your purchase!'}
                          {order.status === 'cancelled' && 'This order has been cancelled.'}
                        </p>
                        {order.status !== 'pending' && order.status !== 'cancelled' && (
                          <div className="mt-3 pt-3 border-t border-fav-blush/40">
                            <p className="text-xs font-medium text-fav-maroon flex items-center gap-1.5">
                              <span>💡</span> For detailed inquiries, contact support with Order ID: #{order.id.slice(0,8).toUpperCase()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-8 mb-6">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-bold text-fav-charcoal mb-4 flex items-center gap-2 border-b border-fav-beige pb-2">
                        <span className="text-xl">🛍️</span> Items Ordered
                      </h4>
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {order.items.map((item, idx) => (
                          <div key={`${item.id}-${idx}`} className="flex items-start gap-4 bg-white p-3 rounded-xl border border-fav-beige shadow-sm hover:border-fav-blush transition-colors">
                            <div className="w-16 h-16 bg-fav-beige rounded-lg overflow-hidden flex-shrink-0 relative border border-fav-blush/30">
                              {item.images && item.images[0] ? (
                                <Image src={item.images[0]} alt={item.title} fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xl text-fav-warm-gray">👕</div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-fav-charcoal font-semibold text-sm line-clamp-2 leading-tight mb-1">{item.title}</h5>
                              <div className="flex items-center gap-3 text-xs">
                                <span className="text-fav-warm-gray bg-fav-off-white px-2 py-0.5 rounded-md border border-fav-beige">Qty: <strong>{item.quantity}</strong></span>
                                {item.size && (
                                  <span className="text-fav-warm-gray bg-fav-off-white px-2 py-0.5 rounded-md border border-fav-beige">Size: <strong>{item.size}</strong></span>
                                )}
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-fav-charcoal font-bold text-sm">₹ {(item.price * item.quantity).toLocaleString()}</p>
                              <p className="text-xs text-fav-warm-gray line-through opacity-70">₹ {Math.round(item.price * item.quantity * 1.2).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary & Shipping */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-bold text-fav-charcoal mb-4 flex items-center gap-2 border-b border-fav-beige pb-2">
                          <span className="text-xl">🧾</span> Order Summary
                        </h4>
                        <div className="bg-white p-5 rounded-xl border border-fav-beige shadow-sm space-y-3">
                          <div className="flex justify-between text-sm text-fav-warm-gray">
                            <span>Subtotal</span>
                            <span className="font-medium text-fav-charcoal">₹ {order.total_amount?.toLocaleString()}</span>
                          </div>
                          {(order.shipping_cost || 0) > 0 && (
                            <div className="flex justify-between text-sm text-fav-warm-gray">
                              <span>Shipping</span>
                              <span className="font-medium text-fav-charcoal">₹ {order.shipping_cost}</span>
                            </div>
                          )}
                          {(order.discount_amount || 0) > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                              <span>Discount</span>
                              <span className="font-medium">- ₹ {order.discount_amount}</span>
                            </div>
                          )}
                          <div className="border-t border-fav-beige pt-3 flex justify-between items-center">
                            <span className="font-bold text-fav-charcoal">Grand Total</span>
                            <span className="text-xl font-black text-fav-maroon">₹ {order.total_amount?.toLocaleString()}</span>
                          </div>
                          {order.payment_method && (
                            <div className="mt-2 text-xs text-center text-fav-warm-gray bg-fav-off-white py-1.5 rounded-md border border-fav-beige">
                              Paid via <strong className="uppercase">{order.payment_method}</strong>
                            </div>
                          )}
                        </div>
                      </div>

                      {order.address && (
                        <div>
                          <h4 className="font-bold text-fav-charcoal mb-4 flex items-center gap-2 border-b border-fav-beige pb-2">
                            <span className="text-xl">🏠</span> Shipping Address
                          </h4>
                          <div className="bg-white p-5 rounded-xl border border-fav-beige shadow-sm">
                            <p className="font-bold text-fav-charcoal text-base mb-1">{order.name}</p>
                            <p className="text-sm text-fav-warm-gray leading-relaxed mb-2">
                              {order.address}<br />
                              {order.city}, {order.pincode}<br />
                              {order.country || 'India'}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-fav-warm-gray bg-fav-off-white p-2 rounded-lg border border-fav-beige">
                              <span className="text-fav-maroon">📞</span>
                              <span className="font-medium">{order.phone}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {order.notes && (
                    <div className="mb-6 bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-sm">
                      <strong className="text-yellow-800 flex items-center gap-2 mb-1"><span className="text-lg">📝</span> Order Notes:</strong>
                      <p className="text-yellow-700">{order.notes}</p>
                    </div>
                  )}

                  <div className="border-t border-fav-beige pt-6">
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => window.location.href = `/orders?track=${order.id}`}
                        className="text-sm px-5 py-2.5 bg-fav-primary text-fav-off-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-semibold flex items-center gap-2 transform hover:-translate-y-0.5"
                      >
                        📍 Track Order
                      </button>
                      {order.awb_code && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(order.awb_code || '');
                            alert('AWB Code copied to clipboard!');
                          }}
                          className="text-sm px-5 py-2.5 bg-fav-beige text-fav-charcoal border border-fav-blush rounded-xl hover:bg-fav-blush/50 transition-all duration-300 font-semibold flex items-center gap-2"
                        >
                          📋 Copy AWB: <span className="text-fav-maroon">{order.awb_code}</span>
                        </button>
                      )}
                      <a
                        href={`mailto:support@favee.com?subject=Order Inquiry - #${order.id.slice(0,8)}&body=Hi Favee Support,%0D%0A%0D%0AI have a question regarding my order #${order.id}.%0D%0A%0D%0A`}
                        className="text-sm px-5 py-2.5 bg-white text-fav-charcoal border border-fav-beige rounded-xl hover:bg-fav-off-white hover:border-fav-maroon transition-all duration-300 font-semibold flex items-center gap-2 ml-auto"
                      >
                        ✉️ Contact Support
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Order History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {historyOrders.length === 0 ? (
            <div className="bg-fav-off-white shadow-md rounded-2xl p-10 text-center border border-fav-blush/30">
              <div className="text-6xl mb-4 opacity-80">📚</div>
              <h3 className="text-2xl font-bold text-fav-charcoal mb-2">No Order History</h3>
              <p className="text-fav-warm-gray max-w-md mx-auto">Your completed and delivered orders will appear here for your records.</p>
            </div>
          ) : (
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-fav-beige">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-fav-beige">
                  <thead className="bg-fav-off-white border-b border-fav-beige">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-fav-charcoal uppercase tracking-wider">
                        Order Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-fav-charcoal uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-fav-charcoal uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-fav-charcoal uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-fav-charcoal uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-fav-beige">
                    {historyOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-fav-off-white/50 transition-colors">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-bold text-fav-charcoal">#{order.id.slice(0,8).toUpperCase()}</div>
                            {order.name && (
                              <div className="text-xs text-fav-warm-gray mt-1 font-medium">{order.name}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm text-fav-charcoal font-medium">
                            {order.items.slice(0, 2).map((item, index) => (
                              <div key={`${item.id}-${index}`} className="mb-1.5 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-fav-maroon/50 inline-block"></span>
                                <span className="line-clamp-1 flex-1" title={item.title}>{item.title}</span> 
                                <span className="text-fav-warm-gray text-xs bg-fav-beige px-1.5 rounded">x{item.quantity}</span>
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <div className="text-fav-maroon text-xs font-semibold mt-2 bg-fav-blush/30 inline-block px-2 py-0.5 rounded-md">
                                +{order.items.length - 2} more items
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-black text-fav-charcoal">
                            ₹ {order.total_amount?.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm text-fav-warm-gray font-medium">
                            {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) : ''}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(order.status || 'success')}`}>
                            <span className="mr-1.5">{getStatusIcon(order.status || 'success')}</span>
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
  );

  return (
    <div className="min-h-screen bg-fav-off-white/30 pt-10 pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="inline-block px-8 py-3 rounded-2xl bg-fav-blush/20 border border-fav-blush/40 shadow-sm backdrop-blur-sm mb-4">
            <h1 className="dancing text-5xl md:text-6xl text-fav-maroon font-bold text-center tracking-wide">Your Orders</h1>
          </div>
          <p className="text-fav-warm-gray text-center max-w-lg font-medium">Track your recent purchases, view order details, and check your complete shopping history.</p>
        </div>

        {/* Quick Tracking Info */}
        <div className="bg-gradient-to-r from-fav-blush/40 via-fav-beige to-fav-off-white rounded-2xl p-6 md:p-8 mb-10 border border-fav-blush/50 shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="text-5xl bg-white p-4 rounded-full shadow-sm border border-fav-beige hidden md:block">🚚</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-fav-charcoal mb-4 flex items-center gap-2">
                <span className="md:hidden">🚚</span> Order Tracking & Support
              </h2>
              <div className="grid sm:grid-cols-3 gap-6 text-sm text-fav-warm-gray">
                <div className="bg-white/60 p-4 rounded-xl border border-fav-beige/50 backdrop-blur-sm">
                  <p className="font-bold text-fav-charcoal text-base mb-1 flex items-center gap-2"><span className="text-fav-maroon">⚡</span> Live Updates</p>
                  <p className="leading-relaxed">Your order status refreshes automatically to keep you informed in real-time.</p>
                </div>
                <div className="bg-white/60 p-4 rounded-xl border border-fav-beige/50 backdrop-blur-sm">
                  <p className="font-bold text-fav-charcoal text-base mb-1 flex items-center gap-2"><span className="text-fav-maroon">📦</span> Trusted Delivery</p>
                  <p className="leading-relaxed">Track your package every step of the way with our reliable courier partners.</p>
                </div>
                <div className="bg-white/60 p-4 rounded-xl border border-fav-beige/50 backdrop-blur-sm">
                  <p className="font-bold text-fav-charcoal text-base mb-1 flex items-center gap-2"><span className="text-fav-maroon">💬</span> 24/7 Support</p>
                  <p className="leading-relaxed">Need assistance? Contact our team at <a href="mailto:support@favee.com" className="text-fav-maroon hover:underline font-semibold">support@favee.com</a>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {!user && !isLoading && (
          <div className="bg-white shadow-lg rounded-2xl p-10 text-center border border-fav-beige max-w-md mx-auto">
            <div className="text-5xl mb-4">🔐</div>
            <h3 className="text-2xl font-bold text-fav-charcoal mb-3">Sign In Required</h3>
            <p className="mb-6 text-fav-warm-gray">Please sign in to your account to view your orders, track shipments, and see your history.</p>
            <button 
              onClick={() => window.location.href = '/signin'} 
              className="w-full text-base font-semibold px-6 py-3.5 rounded-xl bg-fav-primary text-fav-off-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Sign In to Continue
            </button>
          </div>
        )}

        {user ? (
          <>
          <div className="flex justify-center mb-8">
            <div className="inline-flex space-x-2 bg-fav-beige/50 p-1.5 rounded-xl border border-fav-blush/30 shadow-sm backdrop-blur-sm w-full md:w-auto">
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 md:flex-none py-2.5 px-6 md:px-10 rounded-lg text-sm md:text-base font-bold transition-all duration-300 ${
                  activeTab === 'orders'
                    ? 'bg-white text-fav-maroon shadow-sm border border-fav-blush/20'
                    : 'text-fav-warm-gray hover:text-fav-charcoal hover:bg-fav-off-white/50'
                }`}
              >
                Current Orders <span className={`ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs ${activeTab === 'orders' ? 'bg-fav-blush/50 text-fav-maroon' : 'bg-gray-200 text-gray-600'}`}>{currentOrders.length}</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 md:flex-none py-2.5 px-6 md:px-10 rounded-lg text-sm md:text-base font-bold transition-all duration-300 ${
                  activeTab === 'history'
                    ? 'bg-white text-fav-maroon shadow-sm border border-fav-blush/20'
                    : 'text-fav-warm-gray hover:text-fav-charcoal hover:bg-fav-off-white/50'
                }`}
              >
                Order History <span className={`ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs ${activeTab === 'history' ? 'bg-fav-blush/50 text-fav-maroon' : 'bg-gray-200 text-gray-600'}`}>{historyOrders.length}</span>
              </button>
            </div>
          </div>
          <div className="animate-fadeIn">
            {ordersContent}
          </div>
          </>
        ) : null}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--fav-off-white);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--fav-blush);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--fav-beige);
        }
      `}} />
    </div>
  );
};

export default OrdersPage;
