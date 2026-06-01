export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
        <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mx-auto"></div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse mr-2"></div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

