"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeadlineList } from "@/components/dashboard/deadline-list"
import { useLanguage } from "@/lib/i18n/context"

// Hàm lấy số ngày trong tháng
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

// Hàm lấy ngày đầu tiên của tháng
const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay()
}

export function Calendar() {
  const { t, locale } = useLanguage()
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState(today.getDate())

  // Dữ liệu giả về các deadline
  const deadlines = [
    {
      id: 1,
      jobTitle: locale === "vi" ? "Lập trình viên Frontend" : "Frontend Developer",
      company: "Tech Solutions",
      deadline: new Date(currentYear, currentMonth, 10, 23, 59, 59),
    },
    {
      id: 2,
      jobTitle: locale === "vi" ? "Nhà thiết kế UX" : "UX Designer",
      company: "Creative Agency",
      deadline: new Date(currentYear, currentMonth, 15, 23, 59, 59),
    },
    {
      id: 3,
      jobTitle: locale === "vi" ? "Quản lý dự án" : "Project Manager",
      company: "Global Systems",
      deadline: new Date(currentYear, currentMonth, 20, 23, 59, 59),
    },
  ]

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)

  // Tên tháng theo ngôn ngữ
  const monthNames = {
    vi: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    en: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  }

  // Tên ngày trong tuần theo ngôn ngữ
  const dayNames = {
    vi: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  }

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
    setSelectedDate(1)
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
    setSelectedDate(1)
  }

  // Kiểm tra xem ngày có deadline không
  const hasDeadline = (day: number) => {
    return deadlines.some(
      (deadline) => deadline.deadline.getDate() === day && deadline.deadline.getMonth() === currentMonth,
    )
  }

  // Lọc deadline cho ngày được chọn
  const selectedDateDeadlines = deadlines.filter(
    (deadline) =>
      deadline.deadline.getDate() === selectedDate &&
      deadline.deadline.getMonth() === currentMonth &&
      deadline.deadline.getFullYear() === currentYear,
  )

  // Lấy tên tháng và ngày theo ngôn ngữ hiện tại
  const currentMonthNames = locale === "vi" ? monthNames.vi : monthNames.en
  const currentDayNames = locale === "vi" ? dayNames.vi : dayNames.en

  return (
    <div className="space-y-4">
      {/* Calendar header */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium dark:text-white">
          {currentMonthNames[currentMonth]} {currentYear}
        </h3>
        <div className="flex space-x-1">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day names */}
        {currentDayNames.map((day, index) => (
          <div key={index} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
            {day}
          </div>
        ))}

        {/* Empty cells for days before the first day of the month */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="h-8 rounded-md"></div>
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1
          const isToday =
            day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
          const isSelected = day === selectedDate
          const hasDeadlineOnDay = hasDeadline(day)

          return (
            <button
              key={day}
              className={`h-8 rounded-md flex items-center justify-center text-sm relative ${
                isToday ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium" : ""
              } ${isSelected ? "bg-indigo-600 text-white" : ""} ${!isToday && !isSelected ? "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300" : ""}`}
              onClick={() => setSelectedDate(day)}
            >
              {day}
              {hasDeadlineOnDay && !isSelected && (
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"></span>
              )}
            </button>
          )
        })}
      </div>

      {/* Deadlines for selected date */}
      <DeadlineList date={new Date(currentYear, currentMonth, selectedDate)} deadlines={selectedDateDeadlines} />
    </div>
  )
}
