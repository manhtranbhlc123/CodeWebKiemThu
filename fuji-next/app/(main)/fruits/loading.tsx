export default function Loading() {
  return (
    <div className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="h-40 w-full bg-gray-200 rounded animate-pulse mb-8"></div>

        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mx-auto mb-10"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center border p-4 rounded-lg">
              <div className="w-full h-48 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

