export default function Loading() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#D5FC51]"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    </div>
  );
}
