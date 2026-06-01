export default function Loading() {
  return (
    <div className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="p-8">
                <div className="flex flex-col items-center">
                  <div className="h-6 w-64 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex justify-between">
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-5 w-28 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-28 bg-gray-200 rounded animate-pulse"></div>
                </div>

                <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

