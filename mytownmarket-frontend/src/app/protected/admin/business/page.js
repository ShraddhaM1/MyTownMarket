"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddBusinessPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    category: "",
    description: "",
    upi: "",
    qrImage: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/businesses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        sector: form.category,
        description: form.description,
        phone: form.phone,
        address: form.address,
        upi: form.upi,
        qrImage: form.qrImage,
        owner: "697738ba3df841f294ba720a",
      }),
    });

    if (res.ok) {
      alert("Business added successfully 🚀");

      setForm({
        name: "",
        phone: "",
        address: "",
        category: "",
        description: "",
        upi: "",
        qrImage: "",
      });

      router.push("/protected/dashboard");
    } else {
      alert("Failed to add business ❌");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg relative">

      {/* Close Button */}
      <button
        onClick={() => router.push("/protected/dashboard")}
        className="absolute top-6 right-6 text-gray-500 hover:text-red-500 text-xl"
      >
        ✕
      </button>

      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Add Business
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Business Name */}
        <input
          name="name"
          placeholder="Business Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-3 rounded text-black"
          required
        />

        {/* Phone */}
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-3 rounded text-black"
        />

        {/* Address */}
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full border p-3 rounded text-black"
        />

        {/* Category */}
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-3 rounded text-black"
          required
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Business Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-3 rounded text-black"
          rows="4"
        />

        {/* UPI ID */}
        <input
          name="upi"
          placeholder="UPI ID (example: shop@upi)"
          value={form.upi}
          onChange={handleChange}
          className="w-full border p-3 rounded text-black"
        />

        {/* QR Code Image */}
        <input
          name="qrImage"
          placeholder="QR Code Image URL"
          value={form.qrImage}
          onChange={handleChange}
          className="w-full border p-3 rounded text-black"
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-3 rounded hover:bg-teal-700 transition"
        >
          Add Business
        </button>

      </form>
    </div>
  );
}