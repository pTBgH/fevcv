"use client"

import { useEffect, useRef, useState } from "react"
import { Upload, Search, CheckCircle } from "lucide-react"

export function QuickGuideSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isInView, setIsInView] = useState(false)

  const steps = [
    {
      number: 1,
      title: "Upload a resume",
      description: "Upload your resume in PDF, DOC, or DOCX format",
      icon: <Upload className="h-12 w-12 text-gray-600" />,
    },
    {
      number: 2,
      title: "Get matched with jobs",
      description: "Our AI analyzes your skills and matches you with relevant job opportunities",
      icon: <Search className="h-12 w-12 text-gray-600" />,
    },
    {
      number: 3,
      title: "Apply with one click",
      description: "Apply to jobs with a single click and track your applications",
      icon: <CheckCircle className="h-12 w-12 text-gray-600" />,
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting)
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const scrollToStep = (index: number) => {
    if (sliderRef.current) {
      const stepWidth = sliderRef.current.scrollWidth / steps.length
      sliderRef.current.scrollTo({
        left: stepWidth * index,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
        const stepWidth = scrollWidth / steps.length
        const newActiveIndex = Math.round(scrollLeft / stepWidth)

        if (newActiveIndex !== activeIndex) {
          setActiveIndex(newActiveIndex)
        }
      }
    }

    if (sliderRef.current) {
      sliderRef.current.addEventListener("scroll", handleScroll, { passive: true })
    }

    return () => {
      if (sliderRef.current) {
        sliderRef.current.removeEventListener("scroll", handleScroll)
      }
    }
  }, [activeIndex])

  return (
    <section ref={sectionRef} className="relative bg-gray-100 py-20 overflow-hidden" style={{ minHeight: "100vh" }}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Fixed title */}
          <div className="w-full md:w-1/3 md:sticky md:top-0 md:h-screen md:flex md:flex-col md:justify-center pr-8">
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              Simple
              <br />
              guide
            </h2>
            <p className="text-xl text-gray-600 mb-8 md:mb-12">Get job recommendations with a few simple steps</p>

            {/* Step indicators */}
            <div className="hidden md:flex flex-col space-y-4 mt-8">
              {steps.map((step, index) => (
                <button
                  key={index}
                  className={`flex items-center text-left transition-all duration-300 ${
                    index === activeIndex ? "opacity-100" : "opacity-50"
                  }`}
                  onClick={() => scrollToStep(index)}
                >
                  <div
                    className={`w-3 h-3 rounded-full mr-3 transition-all duration-300 ${
                      index === activeIndex ? "bg-black scale-125" : "bg-gray-400"
                    }`}
                  />
                  <span className="text-sm font-medium">Step {index + 1}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right side - Scrollable steps */}
          <div
            ref={sliderRef}
            className="w-full md:w-2/3 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <div className="flex">
              {steps.map((step, index) => (
                <div key={index} className="min-w-full snap-center px-4">
                  <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 h-full">
                    <div className="mb-6">
                      <h3 className="text-2xl font-semibold mb-2">Step {step.number}</h3>
                      <h4 className="text-3xl md:text-4xl font-bold mb-6">{step.title}</h4>
                      <p className="text-lg text-gray-600 mb-8">{step.description}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                        {step.icon}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile step indicators */}
        <div className="flex justify-center mt-8 space-x-4 md:hidden">
          {steps.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex ? "bg-black scale-125" : "bg-gray-400"
              }`}
              onClick={() => scrollToStep(index)}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
