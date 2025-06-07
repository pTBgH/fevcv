import { HomeClient } from "@/components/home/home-client"
import type { Metadata } from "next"

// Add metadata for SEO
export const metadata: Metadata = {
  title: "VietCV - Nền tảng tìm kiếm việc làm hàng đầu",
  description: "Tìm kiếm công việc mơ ước, quản lý hồ sơ và theo dõi ứng tuyển của bạn một cách dễ dàng.",
  keywords: "việc làm, tìm việc, CV, hồ sơ, ứng tuyển, nghề nghiệp",
}

export default function HomePage() {
  return <HomeClient />
}
