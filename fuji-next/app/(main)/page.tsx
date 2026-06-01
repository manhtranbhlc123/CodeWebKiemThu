"use client"

import Image from "next/image"

export default function Home() {
  return (
    <>
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(6,95,70,0.22),transparent_35%)]" />
        <div className="container mx-auto px-4 py-14 lg:py-20 relative z-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <Image
                src="/images/logo.png"
                alt="Fuji Fruit Logo"
                width={200}
                height={80}
                className="rounded-3xl border border-white/20 bg-white/10 p-2 shadow-lg shadow-black/10"
              />
              <div>
                <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">VỊ NGON MÁT LẠNH</h2>
                <h1 className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl">MÙA HÈ SẢNG KHOÁI</h1>
              </div>
              <p className="max-w-2xl text-base sm:text-lg text-slate-100/90">
                Đặt trải nghiệm mua trái cây tươi sạch, an toàn và giao nhanh. Fuji Fruit phục vụ mỗi khách hàng như người thân trong gia đình.
              </p>
              <button className="inline-flex rounded-full bg-white px-8 py-3 text-sm font-semibold text-emerald-700 shadow-xl shadow-emerald-700/20 transition hover:scale-[1.02]">
                ĐẶT HÀNG NGAY
              </button>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-2xl rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <Image
                  src="/images/hero-banner.jpg"
                  alt="Fruits splash"
                  width={1000}
                  height={600}
                  className="rounded-[1.75rem] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-6 top-1/2 z-20 -translate-y-1/2 text-center">
          <Image
            src="/images/qr-code.png"
            alt="QR Code"
            width={120}
            height={120}
            className="rounded-3xl bg-white p-2 shadow-lg shadow-black/20"
          />
          <p className="mt-3 text-xs font-medium text-white/90">NHẬN THÊM ƯU ĐÃI</p>
        </div>
      </div>

      {/* 3 Reasons Section */}
      <div className="py-14 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 sm:text-4xl">3 LÝ DO MUA HOA QUẢ TẠI FUJI</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-900/5">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">HOA QUẢ TƯƠI SẠCH</h3>
              <p className="mt-3 text-slate-600">Quy trình nhập hàng, vận chuyển, bảo quản chuyên nghiệp.</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-900/5">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">ĐỔI TRẢ MIỄN PHÍ</h3>
              <p className="mt-3 text-slate-600">Đổi trả miễn phí trong 24h khi khách hàng không hài lòng.</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-900/5">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">GIÁ CẢ CẠNH TRANH</h3>
              <p className="mt-3 text-slate-600">Fuji Fruit luôn đặt lợi ích cho người tiêu dùng lên hàng đầu.</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Fuji Section */}
      <div className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-emerald-700 sm:text-4xl">ĐÔI NÉT VỀ FUJI</h2>
              <div className="mt-6 space-y-4 text-slate-600">
                <p>
                  Với tôn chỉ "Mang đến cho khách hàng những gì là những sản phẩm trái cây tươi ngon, chất lượng cao, mà kèm theo đó là những dịch vụ tiện ích thân thiện. Công ty CP xuất nhập khẩu Fuji" - đơn vị chuyên nhập khẩu các loại trái cây tươi từ các nước trên thế giới đang từng bước phát triển và chiếm được lòng tin của người tiêu dùng Việt Nam.
                </p>
                <p>
                  Hiện tại, công ty có hệ thống các cửa hàng mang thương hiệu Hoa quả sạch Fuji được phân bố rộng khắp trên địa bàn các tỉnh phía Bắc phục vụ đủ nhu cầu cho mọi khách hàng. Bằng những nỗ lực không ngừng theo thời gian, hệ thống Hoa quả sạch Fuji từng ngày hoàn thiện hơn về tất cả mọi mặt.
                </p>
              </div>
            </div>
            <div className="rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-900/10">
              <Image
                src="/images/about-fuji.jpg"
                alt="Fruit collage"
                width={500}
                height={400}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Product Categories */}
      <div className="py-14 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-emerald-700 sm:text-4xl">DANH MỤC SẢN PHẨM</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Giỏ quà tặng", image: "/images/categories/gift-basket.jpg" },
              { name: "Đặc sản vùng miền", image: "/images/categories/local-specialties.jpg" },
              { name: "Hoa quả bốc sẵn", image: "/images/categories/fresh-fruits.jpg" },
              { name: "Táo nhập khẩu", image: "/images/categories/imported-apples.jpg" },
              { name: "Nho nhập khẩu", image: "/images/categories/imported-grapes.jpg" },
              { name: "Cherry", image: "/images/categories/cherry.jpg" },
              { name: "Kiwi", image: "/images/categories/kiwi.jpg" },
              { name: "Việt quất", image: "/images/categories/blueberry.jpg" },
              { name: "Hoa quả khác", image: "/images/categories/other-fruits.jpg" },
            ].map((category, index) => (
              <div key={index} className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-2xl">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="border-t border-slate-200 px-6 py-5">
                  <span className="text-base font-semibold text-slate-900">{category.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

