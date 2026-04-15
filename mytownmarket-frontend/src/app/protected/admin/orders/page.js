"use client";

import { Suspense } from "react";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function OrdersPageContent() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const businessId = searchParams.get("business");

  useEffect(() => {
    const fetchOrders = async () => {
      try {

        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:5000/api/orders?business=${businessId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (res.ok) {
          setOrders(data);
        }

      } catch (err) {
        console.error("Error fetching orders", err);
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      fetchOrders();
    }

  }, [businessId]);

  if (loading) {
    return <div className="p-10 text-white">Loading orders...</div>;
  }

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold text-white mb-6">
        Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-400">
          No orders yet.
        </p>
      ) : (

        <table className="w-full border border-gray-600 text-white">

          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 border">Order ID</th>
              <th className="p-3 border">Customer</th>
              <th className="p-3 border">Total</th>
            </tr>
          </thead>

          <tbody>

            {orders.map((order) => (
              <tr key={order._id}>

                <td className="p-3 border">
                  {order._id}
                </td>

                <td className="p-3 border">
                  Customer
                </td>

                <td className="p-3 border">
                  ₹{order.totalAmount}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      )}

    </div>
  );
}
export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrdersPageContent />
    </Suspense>
  );
}