"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    gst: "",
    sector: "",
    address: "",
    description: "",
    phone: "",
    email: "",
    upi: "",
    qrImage: "",
  });

  const [images, setImages] = useState([]);

  const fetchOwnerBusinesses = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/businesses/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (res.ok) setBusinesses(data);
    } catch (err) {
      console.error("Error fetching businesses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerBusinesses();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
      });

      images.forEach((image) => {
        form.append("images", image);
      });

      const res = await fetch("http://localhost:5000/api/businesses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!res.ok) {
        alert("Failed to add business ❌");
        return;
      }

      alert("Business Added Successfully ✅");

      setShowForm(false);
      fetchOwnerBusinesses();

      setFormData({
        name: "",
        gst: "",
        sector: "",
        address: "",
        description: "",
        phone: "",
        email: "",
        upi: "",
        qrImage: "",
      });

      setImages([]);
    } catch (err) {
      alert("Server error");
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <main className="min-h-screen bg-gray-100 p-10 space-y-10 text-gray-800">

      {/* Top Header */}
      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold text-teal-700">
          Admin Panel
        </h1>


      </div>

      {/* Businesses */}
      {businesses.length > 0 && (
        <>
          <div className="grid md:grid-cols-3 gap-6">
            {businesses.map((biz) => (
              <div
                key={biz._id}
                onClick={() =>
                  router.push(`/protected/admin/business/${biz._id}`)
                }
                className="bg-white p-6 rounded-xl shadow-md cursor-pointer hover:shadow-xl transition"
              >
                <h2 className="text-xl font-semibold">{biz.name}</h2>
                <p className="text-gray-600 mt-2">{biz.sector}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg"
          >
            + Add New Business
          </button>
        </>
      )}

      {businesses.length === 0 && (
        <>
          <p className="text-lg text-gray-600">
            You don't have any businesses yet.
          </p>

          <button
            onClick={() => setShowForm(true)}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg"
          >
            Create Your First Business
          </button>
        </>
      )}

      {/* Create Business Form */}
      {showForm && (
        <div className="max-w-3xl bg-white p-8 rounded-xl shadow-md mt-6">

          <h2 className="text-2xl font-bold mb-6 text-teal-700">
            Add New Business
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="text"
              name="name"
              placeholder="Business Name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg"
            />

            <input
              type="text"
              name="gst"
              placeholder="GST Number"
              required
              value={formData.gst}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg"
            />

            <input
              type="text"
              name="sector"
              placeholder="Sector"
              required
              value={formData.sector}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg"
            />

            <textarea
              name="address"
              placeholder="Address"
              required
              rows={2}
              value={formData.address}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg"
            />

            <textarea
              name="description"
              placeholder="Description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg"
            />

            {/* UPI ID */}
            <input
              type="text"
              name="upi"
              placeholder="UPI ID (example: shop@upi)"
              value={formData.upi}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg"
            />

            {/* QR Code */}
            <input
              type="text"
              name="qrImage"
              placeholder="QR Code Image URL"
              value={formData.qrImage}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg"
            />

            <input
              type="file"
              multiple
              onChange={handleImageChange}
            />

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-3 rounded-lg"
            >
              Add Business
            </button>

          </form>
        </div>
      )}
    </main>
  );
}