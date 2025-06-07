"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, FileText, BarChart2, Search, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Service {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  image: string
}

export function OurServicesSection() {
  const [activeService, setActiveService] = useState(0)
  const [isSticky, setIsSticky] = useState(false)
  const [hasExitedSticky, setHasExitedSticky] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)

  const services: Service[] = [
    {
      id: 1,
      title: "Resume Editor",
      description:
        "Our AI-powered resume editor helps you create a professional resume that stands out to employers. Get real-time feedback and suggestions to improve your resume.",
      icon: <FileText className="h-10 w-10" />,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      title: "Job Matching",
      description:
        "Our advanced algorithm matches your skills and experience with relevant job opportunities. Get personalized job recommendations based on your profile.",
      icon: <Search className="h-10 w-10" />,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      title: "Career Analytics",
      description:
        "Track your job search progress and get insights into your application performance. See which skills are in demand and how you compare to other candidates.",
      icon: <BarChart2 className="h-10 w-10" />,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      title: "Quick Apply",
      description:
        "Apply to multiple jobs with a single click. Our system automatically fills in application forms based on your resume, saving you time and effort.",
      icon: <Zap className="h-10 w-10" />,
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !headingRef.current || !servicesRef.current) return

      const sectionRect = sectionRef.current.getBoundingClientRect()
      const servicesRect = servicesRef.current.getBoundingClientRect()

      // Check if section is in view
      const isSectionInView = sectionRect.top <= 0 && sectionRect.bottom > window.innerHeight

      // Check if we've scrolled past all services
      const hasScrolledPastServices = servicesRect.bottom <= window.innerHeight

      // Set sticky state
      setIsSticky(sectionRect.top <= 0 && !hasScrolledPastServices)
      setHasExitedSticky(hasScrolledPastServices)

      // Determine which service is in view
      const serviceElements = servicesRef.current.querySelectorAll(".service-card")
      serviceElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect()
        // Consider a service in view when it's in the middle of the viewport
        if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
          setActiveService(index)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    // Initial check
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div ref={sectionRef} className="relative py-24 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Sticky heading and description */}
          <div
            ref={headingRef}
            className={cn(
              "lg:w-1/3 mb-10 lg:mb-0",
              isSticky ? "lg:fixed lg:top-24 lg:max-w-[25%]" : "",
              hasExitedSticky ? "lg:absolute lg:bottom-24 lg:top-auto" : "",
            )}
          >
            <h2 className="text-5xl font-bold mb-8 tracking-tight">
              OUR
              <br />
              SERVICES
            </h2>
            <div className="min-h-[100px]">
              {services.map((service, idx) => (
                <p
                  key={service.id}
                  className={cn(
                    "text-gray-600 dark:text-gray-300 transition-opacity duration-500",
                    activeService === idx ? "opacity-100" : "opacity-0 absolute",
                  )}
                >
                  {service.description}
                </p>
              ))}
            </div>
          </div>

          {/* Right side - Services */}
          <div ref={servicesRef} className="lg:w-2/3 lg:ml-auto">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="service-card mb-24 bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm transition-all duration-300"
                id={`service-${service.id}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">{service.icon}</div>
                    <h3 className="text-2xl font-medium">{service.title}</h3>
                  </div>
                  <Button variant="ghost" className="text-sm flex items-center gap-1">
                    LEARN MORE <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center">
                  {/* Placeholder for service image/content */}
                  <span className="text-gray-400">Service preview</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
