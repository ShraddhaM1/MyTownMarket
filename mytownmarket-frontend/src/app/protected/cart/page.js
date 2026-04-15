"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();

  const [cart, setCart] = useState([]);
  const [business, setBusiness] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    // Get business QR
    if (storedCart.length > 0 && storedCart[0].businessId) {
      const businessId = storedCart[0].businessId;

      fetch(`http://localhost:5000/api/businesses/${businessId}`)
        .then((res) => res.json())
        .then((data) => setBusiness(data))
        .catch((err) => console.error("Error fetching business:", err));
    }
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Remove item
  const removeItem = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // =============================
  // CREATE ORDER FUNCTION
  // =============================
  const createOrder = async () => {
    if (cart.length === 0) return;

    try {
      const orderData = {
        businessId: cart[0].businessId,
        items: cart.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: total,
      };

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        alert("Failed to place order ❌");
        return;
      }

      alert("Order placed successfully 🎉");

      localStorage.removeItem("cart");
      setCart([]);

      router.push("/protected/dashboard");
    } catch (error) {
      console.error("Order error:", error);
      alert("Server error while placing order");
    }
  };

  // Checkout
  const handleCheckout = () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    if (paymentMethod === "cod") {
      createOrder();
    }

    if (paymentMethod === "online") {
      setShowQR(true);
    }
  };

  // Payment done
  const handlePaymentDone = () => {
    createOrder();
  };

  return (
    <div className="p-10 max-w-4xl mx-auto text-white">

      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 && (
        <p className="text-gray-300">Your cart is empty.</p>
      )}

      {/* Cart Items */}
      {cart.map((item, index) => (
        <div
          key={index}
          className="bg-white text-black p-4 mb-4 rounded shadow flex justify-between items-center"
        >
          <div>
            <h3 className="font-bold">{item.name}</h3>
            <p>₹ {item.price}</p>
            <p>Quantity: {item.quantity}</p>
          </div>

          <button
            onClick={() => removeItem(index)}
            className="text-red-500 font-semibold"
          >
            Remove
          </button>
        </div>
      ))}

      {cart.length > 0 && (
        <>
          <h2 className="text-xl font-bold mt-6">
            Total: ₹ {total}
          </h2>

          {/* Payment Box */}
          <div className="mt-6 bg-white text-black p-6 rounded shadow">

            <h3 className="font-semibold mb-3">
              Select Payment Method
            </h3>

            <label className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                name="payment"
                value="cod"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="online"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Online Payment
            </label>

          </div>

          <button
            onClick={handleCheckout}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Checkout
          </button>
        </>
      )}

      {/* QR SECTION */}
      {showQR && (
        <div className="mt-8 bg-white text-black p-6 rounded shadow text-center">

          <h3 className="text-xl font-bold mb-4">
            Scan & Pay
          </h3>

          {/* Business QR */}
          {business?.qrImage ? (
            <img
              src={business.qrImage}
              alt="Business QR"
              className="mx-auto mb-4 w-48"
            />
          ) : (
            <p className="text-red-500 mb-4">
              QR not uploaded by business
            </p>
          )}

          {/* UPI */}
          {business?.upi && (
            <p className="text-gray-700 mb-3">
              UPI: {business.upi}
            </p>
          )}

          <p className="text-gray-600 mb-4">
            After completing payment click below
          </p>

          <button
            onClick={handlePaymentDone}
            className="bg-teal-600 text-white px-6 py-2 rounded"
          >
            I Have Paid
          </button>

        </div>
      )}
    </div>
  );
}