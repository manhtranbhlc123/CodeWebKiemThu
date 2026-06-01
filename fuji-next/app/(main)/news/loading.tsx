export default function Loading() {
  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="h-10 w-40 bg-gray-200 rounded animate-pulse mb-8"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="md:flex">
                    <div className="md:flex-shrink-0 md:w-48">
                      <div className="h-48 w-full bg-gray-200 animate-pulse"></div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center mb-2">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="mx-2">•</div>
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse mb-4"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex justify-between items-center">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex space-x-3">
                    <div className="w-16 h-16 bg-gray-200 rounded animate-pulse"></div>
                    <div>
                      <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

