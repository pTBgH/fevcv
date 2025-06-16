// "use client"

// import { useEffect, useRef } from "react"
// import { useLanguage } from "@/lib/i18n/context"

// export function MapView() {
//   const mapRef = useRef<HTMLDivElement>(null)
//   const { locale } = useLanguage()

//   useEffect(() => {
//     if (!mapRef.current) return

//     // Giả lập việc vẽ bản đồ
//     const ctx = document.createElement("canvas").getContext("2d")
//     if (!ctx) return

//     // Trong ứng dụng thực tế, bạn sẽ sử dụng thư viện bản đồ như Mapbox, Google Maps, hoặc Leaflet
//     const drawMap = () => {
//       const mapElement = mapRef.current
//       if (!mapElement) return

//       // Tạo một hình ảnh giả lập bản đồ
//       const img = document.createElement("img")
//       img.src = "/placeholder.svg?height=300&width=600"
//       img.alt = locale === "vi" ? "Bản đồ Việt Nam" : "Vietnam Map"
//       img.className = "w-full h-full object-cover"

//       // Xóa nội dung cũ và thêm hình ảnh mới
//       while (mapElement.firstChild) {
//         mapElement.removeChild(mapElement.firstChild)
//       }
//       mapElement.appendChild(img)

//       // Thêm các điểm đánh dấu
//       const cities = [
//         {
//           name: locale === "vi" ? "TP. Hồ Chí Minh" : "Ho Chi Minh City",
//           x: "70%",
//           y: "80%",
//           size: 12,
//           jobs: 145,
//         },
//         {
//           name: locale === "vi" ? "Hà Nội" : "Hanoi",
//           x: "50%",
//           y: "20%",
//           size: 10,
//           jobs: 98,
//         },
//         {
//           name: locale === "vi" ? "Đà Nẵng" : "Da Nang",
//           x: "60%",
//           y: "50%",
//           size: 8,
//           jobs: 45,
//         },
//         {
//           name: locale === "vi" ? "Cần Thơ" : "Can Tho",
//           x: "65%",
//           y: "85%",
//           size: 6,
//           jobs: 23,
//         },
//         {
//           name: locale === "vi" ? "Hải Phòng" : "Hai Phong",
//           x: "55%",
//           y: "25%",
//           size: 6,
//           jobs: 19,
//         },
//       ]

//       cities.forEach((city) => {
//         const marker = document.createElement("div")
//         marker.className = "absolute rounded-full bg-indigo-600 border-2 border-white shadow-md"
//         marker.style.width = `${city.size}px`
//         marker.style.height = `${city.size}px`
//         marker.style.left = city.x
//         marker.style.top = city.y
//         marker.style.transform = "translate(-50%, -50%)"
//         marker.title = `${city.name}: ${city.jobs} ${locale === "vi" ? "việc làm" : "jobs"}`

//         mapElement.appendChild(marker)
//       })
//     }

//     drawMap()

//     // Cleanup
//     return () => {
//       const mapElement = mapRef.current
//       if (mapElement) {
//         while (mapElement.firstChild) {
//           mapElement.removeChild(mapElement.firstChild)
//         }
//       }
//     }
//   }, [locale])

//   return <div ref={mapRef} className="relative w-full h-full"></div>
// }
