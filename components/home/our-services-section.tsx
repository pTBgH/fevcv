"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Service {
  id: number;
  title: string;
  description: string;
  youtubeUrl: string;
}

export function OurServicesSection() {
  const [activeService, setActiveService] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  const services: Service[] = [
    {
      id: 1,
      title: "Resume Editor",
      description:
        "Our AI-powered resume editor helps you create a professional resume that stands out to employers. Get real-time feedback and suggestions to improve your resume.",
      youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      id: 2,
      title: "Job Matching",
      description:
        "Our advanced algorithm matches your skills and experience with relevant job opportunities. Get personalized job recommendations based on your profile.",
      youtubeUrl: "https://www.youtube.com/embed/Xgi4Mc-nKgY",
    },
    {
      id: 3,
      title: "Career Analytics",
      description:
        "Track your job search progress and get insights into your application performance. See which skills are in demand and how you compare to other candidates.",
      youtubeUrl: "https://www.youtube.com/embed/9u5OG5vJVTI",
    },
    {
      id: 4,
      title: "Quick Apply",
      description:
        "Apply to multiple jobs with a single click. Our system automatically fills in application forms based on your resume, saving you time and effort.",
      youtubeUrl: "https://www.youtube.com/embed/mKYpA1-5NNs",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!servicesRef.current) return;

      const serviceElements =
        servicesRef.current.querySelectorAll(".service-card");
      let currentService = 0;

      let minDistance = Infinity;
      serviceElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(
          rect.top - window.innerHeight / 2 + rect.height / 2
        );
        if (distance < minDistance) {
          minDistance = distance;
          currentService = index;
        }
      });
      setActiveService(currentService);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={sectionRef} className="relative py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:gap-x-12">
          <div
            className={cn(
              "lg:w-1/3 mb-10 lg:mb-0 lg:sticky lg:top-24 lg:self-start pb-64"
            )}
          >
            <h2 className="text-5xl font-bold mb-8 tracking-tight">
              OUR
              <br />
              SERVICES
            </h2>
            <div className="min-h-[100px] relative">
              {services.map((service, idx) => (
                <p
                  key={service.id}
                  className={cn(
                    "text-gray-600 dark:text-gray-300 transition-all duration-500 absolute inset-0",
                    activeService === idx
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4 pointer-events-none"
                  )}
                >
                  {service.description}
                </p>
              ))}
            </div>
          </div>

          <div ref={servicesRef} className="lg:w-2/3">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={cn(
                  "service-card mb-24 bg-brand-cream dark:bg-gray-800 rounded-lg p-8 transition-all duration-500",
                  "min-h-[300px]",
                  activeService === index
                    ? "scale-100 opacity-100"
                    : "scale-[0.98] opacity-90"
                )}
                id={`service-${service.id}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-medium">{service.title}</h3>
                  <Button
                    variant="ghost"
                    className="text-sm flex items-center gap-1 transition-all duration-300 hover:gap-2"
                  >
                    LEARN MORE <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="rounded-lg h-[400px] flex items-center justify-center overflow-hidden relative aspect-w-16 aspect-h-9">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={service.youtubeUrl}
                    title={service.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy" // Thêm để cải thiện hiệu suất
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}