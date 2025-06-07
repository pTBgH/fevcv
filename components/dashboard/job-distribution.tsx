"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapView } from "@/components/dashboard/map-view"
import { useLanguage } from "@/lib/i18n/context"

export function JobDistribution() {
  const { t } = useLanguage()
  const [view, setView] = useState("map")

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold dark:text-white">{t("dashboard.jobDistribution")}</h2>
        <Tabs defaultValue="map" className="w-[200px]" onValueChange={setView} value={view}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map">{t("dashboard.map")}</TabsTrigger>
            <TabsTrigger value="list">{t("dashboard.list")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="h-[300px] bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
        {view === "map" ? (
          <MapView />
        ) : (
          <div className="p-4 h-full overflow-auto dark:bg-gray-800">
            <div className="space-y-3">
              {[
                { city: "Ho Chi Minh City", count: 145 },
                { city: "Hanoi", count: 98 },
                { city: "Da Nang", count: 45 },
                { city: "Can Tho", count: 23 },
                { city: "Hai Phong", count: 19 },
                { city: "Nha Trang", count: 15 },
                { city: "Vung Tau", count: 12 },
                { city: "Hue", count: 10 },
              ].map((item) => (
                <div key={item.city} className="flex items-center">
                  <div className="w-32 text-sm dark:text-gray-300">{item.city}</div>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div
                        className="h-2 bg-indigo-600 rounded-full"
                        style={{ width: `${(item.count / 145) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-right text-sm dark:text-gray-300">{item.count}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
