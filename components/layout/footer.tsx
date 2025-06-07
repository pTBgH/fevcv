"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export function Footer() {
  const { locale } = useLanguage()
  const pathname = usePathname()

  // Don't show footer on dashboard pages
  if (pathname.startsWith("/dashboard")) {
    return null
  }

  return (
    <footer className="bg-[#1e2530] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo */}
          <div>
            <Link href="/" className="text-3xl font-bold text-blue-400">
              VietCV
            </Link>
          </div>

          {/* About Links */}
          <div>
            <h4 className="font-medium mb-4">{locale === "vi" ? "Về chúng tôi" : "About"}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  {locale === "vi" ? "Công ty" : "Companies"}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  {locale === "vi" ? "Bảng giá" : "Pricing"}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  {locale === "vi" ? "Điều khoản" : "Terms"}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  {locale === "vi" ? "Tư vấn" : "Advice"}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  {locale === "vi" ? "Chính sách bảo mật" : "Privacy Policy"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-medium mb-4">{locale === "vi" ? "Tài nguyên" : "Resources"}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  {locale === "vi" ? "Tài liệu hướng dẫn" : "Help Docs"}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  {locale === "vi" ? "Hướng dẫn" : "Guide"}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  {locale === "vi" ? "Cập nhật" : "Updates"}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  {locale === "vi" ? "Liên hệ" : "Contact Us"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-medium mb-4">
              {locale === "vi" ? "Nhận thông báo việc làm" : "Get job notifications"}
            </h4>
            <p className="text-gray-400 mb-4 text-sm">
              {locale === "vi"
                ? "Tin tức việc làm mới nhất, bài viết được gửi đến hộp thư của bạn hàng tuần."
                : "The latest job news, articles, sent to your inbox weekly."}
            </p>
            <div className="flex gap-2">
              <Input
                placeholder={locale === "vi" ? "Địa chỉ email" : "Email Address"}
                className="bg-white text-gray-800"
              />
              <Button className="bg-indigo-600 hover:bg-indigo-700">{locale === "vi" ? "Đăng ký" : "Subscribe"}</Button>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="flex justify-end mt-8 pt-8 border-t border-gray-800">
          <div className="flex space-x-4">
            <Link href="#" className="text-gray-400 hover:text-white">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
              <Instagram className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
