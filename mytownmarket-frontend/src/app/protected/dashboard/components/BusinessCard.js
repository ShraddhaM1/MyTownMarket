"use client";
import { useRouter } from "next/navigation";

export default function BusinessCard({ business }) {
  const router = useRouter();

  return (
    <div className="bg-white shadow rounded-lg p-5 relative">
      <h3 className="text-xl font-bold">{business.name}</h3>
      <p className="text-gray-600">{business.category}</p>
      <p className="text-sm text-gray-500">{business.address}</p>

      {/* Edit Button */}
      <button
        onClick={() =>
          router.push(`/protected/admin/business/${business._id}`)
        }
        className="absolute top-3 right-3 text-sm text-blue-600 hover:underline"
      >
        ✏️ Edit
      </button>
    </div>
  );
}