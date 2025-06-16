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

console.log("KEYCLOAK_ISSUER:", process.env.KEYCLOAK_ISSUER);
console.log("KEYCLOAK_CLIENT_ID:", process.env.KEYCLOAK_CLIENT_ID);
console.log("KEYCLOAK_CLIENT_SECRET:", process.env.KEYCLOAK_CLIENT_SECRET);
console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET);
console.log("NEXT_PUBLIC_KEYCLOAK_ISSUER:", process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER);
console.log("NEXT_PUBLIC_KEYCLOAK_CLIENT_ID:", process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID);
console.log("NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET:", process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET);