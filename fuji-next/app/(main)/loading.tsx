export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-[#269300] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Đang tải...</p>
      </div>
    </div>
  )
}

