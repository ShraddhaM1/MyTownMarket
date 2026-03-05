export default function SearchBar() {
  return (
    <div className="flex justify-center mt-6">
      <div className="flex w-full max-w-xl">
        <input
          type="text"
          placeholder="Search for businesses..."
          className="
            w-full px-4 py-3 border border-gray-300 rounded-l-lg
            focus:outline-none focus:ring-2 focus:ring-teal-500
          "
        />
        <button className="bg-teal-600 text-white px-6 rounded-r-lg">
          🔍
        </button>
      </div>
    </div>
  );
}
