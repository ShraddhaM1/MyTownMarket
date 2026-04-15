"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DashboardPage() {
  const router = useRouter();

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/businesses");
        const data = await res.json();

        if (res.ok) {
          setBusinesses(data);
        }
      } catch (err) {
        console.error("Error fetching businesses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-teal-700 shadow-md px-10 py-4 flex justify-between items-center">

        <h1
          onClick={() => router.push("/protected/dashboard")}
          className="text-2xl font-bold text-white cursor-pointer"
        >
          MyTownMarket
        </h1>

        <div className="flex gap-8 items-center text-white font-semibold">

          {/* Admin */}
          <Link
            href="/protected/admin"
            className="hover:text-yellow-300 transition"
          >
            Admin
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>

        </div>
      </nav>

      {/* Content */}
      <section className="px-10 mt-10">

        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          Explore Local Businesses
        </h2>

        {loading && <p>Loading...</p>}

        {!loading && businesses.length === 0 && (
          <p>No businesses added yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {businesses.map((biz) => (

            <div
              key={biz._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
            >

              {/* Image */}
              <div className="relative w-full h-48 overflow-hidden rounded-t-xl">

                <Image
                  src={
                    biz.images?.[0] ||
                    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop"
                  }
                  alt={biz.name}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />

              </div>

              {/* Details */}
              <div className="p-5">

                <h3 className="text-xl font-semibold">
                  {biz.name}
                </h3>

                <p className="text-gray-600 mt-1">
                  {biz.sector}
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  {biz.address}
                </p>

                <Link href={`/protected/business/${biz._id}`}>
                  <button className="mt-4 w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition">
                    View Details
                  </button>
                </Link>

              </div>

            </div>

          ))}

        </div>
      </section>

    </main>
  );
}