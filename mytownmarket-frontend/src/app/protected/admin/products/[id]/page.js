"use client";
import { useState } from "react";
import Link from "next/link";

export default function ProductsPage() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    businessName: "",
  });

  const [products, setProducts] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      id: Date.now().toString(),
      ...formData,
      description: "This is a sample product description.",
      image: "https://via.placeholder.com/200",
    };

    setProducts([...products, newProduct]);
    setFormData({ name: "", price: "", businessName: "" });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="businessName"
          placeholder="Business Name"
          value={formData.businessName}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <button className="bg-teal-600 text-white px-6 py-3 rounded">
          Save Product
        </button>
      </form>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">All Products</h2>

        {products.map((product) => (
          <div
            key={product.id}
            className="border p-4 mb-4 rounded shadow"
          >
            <h3 className="font-bold">{product.name}</h3>
            <p>₹{product.price}</p>
            <p>{product.businessName}</p>

            <Link href={`/protected/admin/products/${product.id}`}>
              <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
                View Details
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}