"use client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
      <h1
        onClick={() => router.push("/protected/dashboard")}
        className="text-xl font-bold text-teal-600 cursor-pointer"
      >
        🏪 MyTownMarket
      </h1>

      <div className="flex gap-6 text-gray-700 font-medium">
        <button
          onClick={() => router.push("/protected/dashboard")}
          className="hover:text-teal-600"
        >
          Home
        </button>

        <button className="hover:text-teal-600">
          Sectors
        </button>

        <button
  onClick={() => router.push("/protected/orders")}
  className="text-white"
>
Orders
</button>

        <button
          onClick={() => router.push("/protected/admin")}
          className="hover:text-teal-600"
        >
          Admin
        </button>

        <button
          onClick={() => {
            localStorage.clear();
            router.push("/login");
          }}
          className="text-red-500 hover:text-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}