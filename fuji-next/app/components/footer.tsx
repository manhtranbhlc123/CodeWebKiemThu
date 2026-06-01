"use client"

import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#269300] text-white pt-10 pb-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold uppercase mb-4">CHÍNH SÁCH</h3>
            <ul className="space-y-2 text-sm">
              <li>Chính sách bảo mật thông tin</li>
              <li>Quy định và hình thức thanh toán</li>
              <li>Chính sách vận chuyển Fuji</li>
              <li>Chính sách đổi trả</li>
              <li>Chính sách vận chuyển</li>
              <li>Câu hỏi thường gặp</li>
              <li>Liên hệ</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold uppercase mb-4">HỖ TRỢ MUA HÀNG</h3>
            <ul className="space-y-2 text-sm">
              <li>Hệ thống cửa hàng</li>
              <li>Hướng dẫn mua hàng</li>
              <li>Hóa đơn VAT</li>
            </ul>
            <div className="mt-4">
              <Image
                src="/images/certification.png"
                alt="Certification"
                width={120}
                height={60}
                className="rounded"
              />
            </div>
          </div>

          <div>
            <h3 className="font-bold uppercase mb-4">CÔNG TY CP XUẤT NHẬP KHẨU FUJI</h3>
            <ul className="space-y-2 text-sm">
              <li>Trụ sở: 352 Giải Phóng, Phương Liệt, Thanh Xuân, Hà Nội</li>
              <li>Hotline: 19002288-0989 86 89 96</li>
              <li>Website: www.hoaquafuji.com</li>
              <li>Giấy CNĐKKD: 0107875828 do Sở Kế hoạch và</li>
              <li>Đầu tư TP Hà Nội cấp ngày 09/06/2017</li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <Link href="#" className="text-white hover:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </Link>
              <Link href="#" className="text-white hover:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.917 16.083c-2.258 0-4.083-1.825-4.083-4.083s1.825-4.083 4.083-4.083c1.103 0 2.024.402 2.735 1.067l-1.107 1.068c-.304-.292-.834-.63-1.628-.63-1.394 0-2.531 1.155-2.531 2.579 0 1.424 1.138 2.579 2.531 2.579 1.616 0 2.224-1.162 2.316-1.762h-2.316v-1.4h3.855c.036.204.064.408.064.677.001 2.332-1.563 3.988-3.919 3.988zm9.917-3.5h-1.75v1.75h-1.167v-1.75h-1.75v-1.166h1.75v-1.75h1.167v1.75h1.75v1.166z" />
                </svg>
              </Link>
              <Link href="#" className="text-white hover:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </Link>
              <Link href="#" className="text-white hover:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center text-sm border-t border-white/20 pt-4">
          <p>© 2018 Hệ thống hoa quả sạch Fuji Fruit.</p>
        </div>
      </div>
    </footer>
  )
}

