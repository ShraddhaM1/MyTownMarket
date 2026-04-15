"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function BusinessDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingBusiness, setEditingBusiness] = useState(false);
  const [businessForm, setBusinessForm] = useState({});
  const [businessImages, setBusinessImages] = useState([]);
  const [qrImage, setQrImage] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
  });

  const [images, setImages] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchData = async () => {
    try {
      const businessRes = await fetch(
        `https://mytownmarket.onrender.com/api/businesses/${id}`,
      );
      const businessData = await businessRes.json();

      const productRes = await fetch(
        `https://mytownmarket.onrender.com/api/products/by-business/${id}`,
      );
      const productData = await productRes.json();

      if (businessRes.ok) {
        setBusiness(businessData);
        setBusinessForm(businessData);
      }

      if (productRes.ok) setProducts(productData);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleBusinessChange = (e) => {
    setBusinessForm({
      ...businessForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleBusinessImageChange = (e) => {
    setBusinessImages([...e.target.files]);
  };

  const handleBusinessUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      Object.keys(businessForm).forEach((key) => {
        if (businessForm[key]) {
          formData.append(key, businessForm[key]);
        }
      });

      // upload business images
      businessImages.forEach((img) => {
        formData.append("images", img);
      });

      // ⭐ upload QR image separately
      if (qrImage) {
        formData.append("qrImage", qrImage);
      }

      const res = await fetch(
        `https://mytownmarket.onrender.com/api/businesses/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!res.ok) {
        alert("Update failed");
        return;
      }

      alert("Business updated ✅");
      setEditingBusiness(false);
      fetchData();
    } catch (err) {
      alert("Server error");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("business", id);

      images.forEach((img) => {
        formData.append("images", img);
      });

      const url = editingProduct
        ? `https://mytownmarket.onrender.com/api/products/${editingProduct._id}`
        : "https://mytownmarket.onrender.com/api/products";

      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        alert("Operation failed");
        return;
      }

      alert(editingProduct ? "Product updated ✅" : "Product added ✅");

      setForm({ name: "", description: "", price: "" });
      setImages([]);
      setEditingProduct(null);
      fetchData();
    } catch (err) {
      alert("Server error");
    }
  };

  const handleDelete = async (productId) => {
    const token = localStorage.getItem("token");

    await fetch(`https://mytownmarket.onrender.com/api/products/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchData();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
    });
  };

  if (loading) return <div className="p-10">Loading...</div>;
  if (!business) return <div className="p-10">Business not found</div>;

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-8">
      <button
        onClick={() => router.push("/protected/admin")}
        className="text-red-500 font-semibold"
      >
        ← Back
      </button>

      {/* BUSINESS CARD */}
      <div className="bg-white p-6 rounded-xl shadow space-y-5">
        {!editingBusiness ? (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-black">{business.name}</h1>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditingBusiness(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Edit Business
                </button>

                <button
                  onClick={() =>
                    router.push(
                      `/protected/admin/orders?business=${business._id}`,
                    )
                  }
                  className="bg-purple-600 text-white px-4 py-2 rounded"
                >
                  View Orders
                </button>
              </div>
            </div>

            {business.images?.[0] && (
              <div className="relative h-64 w-full">
                <Image
                  src={business.images[0]}
                  alt={business.name}
                  fill
                  unoptimized
                  className="object-cover rounded-lg"
                />
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4 text-black">
              <p>
                <strong>Sector:</strong> {business.sector}
              </p>
              <p>
                <strong>Phone:</strong> {business.phone}
              </p>
              <p>
                <strong>Email:</strong> {business.email}
              </p>
              <p>
                <strong>Address:</strong> {business.address}
              </p>
              <p>
                <strong>UPI ID:</strong> {business.upi}
              </p>
              <p>
                <strong>QR Code:</strong> {business.qrImage}
              </p>
            </div>

            <p className="text-gray-700">{business.description}</p>
          </>
        ) : (
          <form onSubmit={handleBusinessUpdate} className="space-y-3">
            <input
              name="name"
              value={businessForm.name || ""}
              onChange={handleBusinessChange}
              className="w-full border p-2 rounded bg-white text-black"
            />

            <input
              name="sector"
              value={businessForm.sector || ""}
              onChange={handleBusinessChange}
              className="w-full border p-2 rounded bg-white text-black"
            />

            <input
              name="address"
              value={businessForm.address || ""}
              onChange={handleBusinessChange}
              className="w-full border p-2 rounded bg-white text-black"
            />

            <input
              name="phone"
              value={businessForm.phone || ""}
              onChange={handleBusinessChange}
              className="w-full border p-2 rounded bg-white text-black"
            />

            <input
              name="email"
              value={businessForm.email || ""}
              onChange={handleBusinessChange}
              className="w-full border p-2 rounded bg-white text-black"
            />
            <input
              name="upi"
              placeholder="UPI ID (example: shop@upi)"
              value={businessForm.upi || ""}
              onChange={handleBusinessChange}
              className="w-full border p-2 rounded bg-white text-black"
            />

            <div>
              <label className="block mb-1 font-semibold">Upload QR Code</label>

              <input
                type="file"
                name="qrImage"
                accept="image/*"
                onChange={(e) => setQrImage(e.target.files[0])}
                className="w-full border p-2 rounded bg-white text-black"
              />
            </div>

            <textarea
              name="description"
              value={businessForm.description || ""}
              onChange={handleBusinessChange}
              className="w-full border p-2 rounded bg-white text-black"
            />

            <div>
              <label className="block mb-1 font-semibold">
                Upload Business Images
              </label>

              <input
                type="file"
                multiple
                onChange={handleBusinessImageChange}
                className="w-full border p-2 rounded bg-white text-black"
              />
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded">
              Save Changes
            </button>
          </form>
        )}
      </div>

      {/* PRODUCT FORM */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4 text-black">
          {editingProduct ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded bg-white text-black"
            required
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full border p-2 rounded bg-white text-black"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded bg-white text-black"
          />

          <input type="file" multiple onChange={handleImageChange} />

          <button className="bg-teal-600 text-white px-4 py-2 rounded">
            {editingProduct ? "Update Product" : "Add Product"}
          </button>
        </form>

        <div className="bg-white p-6 rounded shadow mt-6">
          <h2 className="text-xl font-bold mb-4">Existing Products</h2>

          {products.length === 0 && (
            <p className="text-gray-500">No products added yet.</p>
          )}

          <div className="grid md:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product._id} className="border rounded p-4">
                <h3 className="font-bold text-lg">{product.name}</h3>

                <p className="text-gray-600">₹ {product.price}</p>

                <p className="text-sm text-gray-500">{product.description}</p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
