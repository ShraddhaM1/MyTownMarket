"use client";
import { useParams } from "next/navigation";

export default function ProductDetailsPage() {
  const { id } = useParams();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Product Details</h1>

      <p className="mb-2"><strong>Product ID:</strong> {id}</p>

      <p>This is a temporary mock details page.</p>

      <button
        onClick={() => alert("Added to cart (mock)")}
        className="mt-4 bg-teal-600 text-white px-6 py-3 rounded"
      >
        Add to Cart
      </button>
    </div>
  );
}