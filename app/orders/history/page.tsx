"use client";
import React, { useCallback, useEffect, useState } from "react";
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
  status?: string;
  name?: string;
}

const OrderHistoryPage: React.FC = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState<Array<OrderRow & { items: OrderItem[] }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);

    const { data: orderRows, error } = await supabase
      .from("orders")
      .select("id, created_at, total_amount, status, name")
      .eq("user_id", user.id)
      .in("status", ["delivered", "success"]) // history only
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

    if (itemsError) console.error(itemsError);

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
  }, [user?.id, fetchOrders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Order History</h1>

      <SignedOut>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="mb-4 text-gray-600">Please sign in to view your order history.</p>
          <SignInButton>
            <button className="text-sm font-medium px-4 py-2 rounded-full bg-pink-600 text-white hover:bg-pink-700 transition">
              Sign In
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        {isLoading ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading history...</p>
          </div>
        ) : orders.length === 0 ? (
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                        {order.name && <div className="text-sm text-gray-500">{order.name}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.items.slice(0, 2).map((item) => (
                            <div key={item.id} className="mb-1">{item.title} x{item.quantity}</div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-gray-500 text-xs">+{order.items.length - 2} more items</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">₹ {order.total_amount?.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status || 'success')}`}>
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
      </SignedIn>
    </div>
  );
};

export default OrderHistoryPage;


