"use client";
export const dynamic = "force-dynamic";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center text-center space-y-6 px-4">

        <h1 className="text-5xl font-bold text-white">
          MyTownMarket 🚀
        </h1>

        <p className="text-lg text-gray-300 max-w-xl">
          A platform that helps local businesses like salons, hospitals,
          shops, and services get discovered easily by people in their town.
        </p>

        <div className="flex gap-4 pt-2">
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/signup")}
            className="px-6 py-3 rounded-lg border border-white text-white font-semibold hover:bg-white hover:text-black transition"
          >
            Sign Up
          </button>
        </div>

      </div>
    </main>
  );
}
