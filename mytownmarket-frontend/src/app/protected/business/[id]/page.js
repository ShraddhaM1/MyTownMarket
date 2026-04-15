"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function BusinessProductsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const businessRes = await fetch(
          `http://localhost:5000/api/businesses/${id}`
        );
        const businessData = await businessRes.json();

        const productRes = await fetch(
          `http://localhost:5000/api/products/by-business/${id}`
        );
        const productData = await productRes.json();

        if (businessRes.ok) setBusiness(businessData);
        if (productRes.ok) setProducts(productData);
      } catch (err) {
        console.error("Error loading products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find(
      (item) => item.productId === product._id
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        productId: product._id,
        businessId: business._id,
        name: product.name,
        price: product.price,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Added to cart 🛒");
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">

      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.push("/protected/dashboard")}
          className="text-red-500 font-semibold"
        >
          ← Back
        </button>

        <button
          onClick={() => router.push("/protected/cart")}
          className="bg-black text-white px-4 py-2 rounded"
        >
          View Cart 🛒
        </button>
      </div>

      {/* Business Header */}
      <div className="mb-10">

        {business?.images?.[0] && (
          <div className="relative w-full h-56 mb-4">
            <Image
              src={business.images[0]}
              alt={business.name}
              fill
              unoptimized
              className="object-cover rounded-lg"
            />
          </div>
        )}

        {/* FIXED TEXT VISIBILITY */}
        <div className="bg-white text-black p-6 rounded-lg shadow">

          <h1 className="text-3xl font-bold mb-2">
            {business?.name}
          </h1>

          {business?.sector && (
            <p>
              <strong>Sector:</strong> {business.sector}
            </p>
          )}

          {business?.address && (
            <p>
              <strong>Address:</strong> {business.address}
            </p>
          )}

          {business?.phone && (
            <p>
              <strong>Phone:</strong> {business.phone}
            </p>
          )}

          {business?.upi && (
            <p>
              <strong>UPI:</strong> {business.upi}
            </p>
          )}

          {business?.description && (
            <p className="mt-3 text-gray-700">
              {business.description}
            </p>
          )}

        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">
        Products
      </h2>

      {products.length === 0 && (
        <p className="text-gray-500">No products available.</p>
      )}

      <div className="grid md:grid-cols-3 gap-6">

        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
          >

            {product.images?.[0] && (
              <div className="relative h-40 w-full mb-3">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  unoptimized
                  className="object-cover rounded"
                />
              </div>
            )}

            <h3 className="font-bold text-lg">
              {product.name}
            </h3>

            <p className="text-gray-600 text-sm mt-1">
              {product.description}
            </p>

            <p className="font-semibold mt-2">
              ₹ {product.price}
            </p>

            <button
              onClick={() => handleAddToCart(product)}
              className="bg-teal-600 text-white px-4 py-2 rounded w-full mt-3 hover:bg-teal-700"
            >
              Add to Cart
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}