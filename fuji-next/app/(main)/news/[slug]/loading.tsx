export default function Loading() {
  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex mb-6">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="mx-2">/</div>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="mx-2">/</div>
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Article Header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="h-[400px] w-full bg-gray-200 animate-pulse"></div>
            <div className="p-6">
              <div className="flex items-center mb-3">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="mx-2">•</div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse mr-3"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="space-y-4">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Tags */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex flex-wrap items-center">
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse mr-3"></div>
                <div className="h-8 w-16 bg-gray-200 rounded-full animate-pulse mr-2"></div>
                <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse mr-2"></div>
                <div className="h-8 w-16 bg-gray-200 rounded-full animate-pulse mr-2"></div>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item}>
                  <div className="h-48 w-full bg-gray-200 rounded animate-pulse mb-3"></div>
                  <div className="h-5 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

