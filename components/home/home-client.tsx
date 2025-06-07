"use client"

import { CVUploadSection } from "./cv-upload-section"
import { QuickGuideSection } from "./quick-guide-section"
import { OurServicesSection } from "./our-services-section"
import { MinimalNav } from "./minimal-nav"
import { MinimalFooter } from "./minimal-footer"

export function HomeClient() {
  return (
    <div className="min-h-screen flex flex-col">
      <MinimalNav />

      <main className="flex-grow">
        {/* Hero Section with CV Upload */}
        <section className="bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <CVUploadSection />
          </div>
        </section>

        {/* Quick Guide Section */}
        <QuickGuideSection />

        {/* Our Services Section */}
        <OurServicesSection />
      </main>

      <MinimalFooter />
    </div>
  )
}
