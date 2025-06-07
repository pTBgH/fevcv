import { MapPin, GraduationCap, Clock } from "lucide-react"

interface JobCardDetailsProps {
  company: {
    name: string
    logo: string
  }
  category: string
  title: string
  city: string
  jobType: string
  salaryDisplay: string
  daysLeft: number
}

export function JobCardDetails({
  company,
  category,
  title,
  city,
  jobType,
  salaryDisplay,
  daysLeft,
}: JobCardDetailsProps) {
  return (
    <>
      {/* Top black section */}
      <div className="bg-black p-5 text-white rounded-t-xl">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-white flex items-center justify-center rounded-lg mr-3 overflow-hidden flex-shrink-0">
            {company.logo ? (
              <img
                src={company.logo || "/placeholder.svg"}
                alt={`${company.name} logo`}
                className="object-contain w-full h-full"
              />
            ) : (
              <span className="text-black text-xl font-bold">{company.name.charAt(0)}</span>
            )}
          </div>
          <div className="overflow-hidden">
            <div className="font-semibold text-lg truncate">{company.name}</div>
            <div className="text-sm text-gray-400 truncate">{category || "Uncategorized"}</div>
          </div>
        </div>

        <h3 className="font-bold text-2xl mb-4 leading-tight truncate">{title}</h3>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs hover:bg-gray-600 transition-colors">
            <MapPin className="h-4 w-4 mr-1.5" />
            {city || "Remote"}
          </span>
          <span className="inline-flex items-center px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs hover:bg-gray-600 transition-colors">
            <GraduationCap className="h-4 w-4 mr-1.5" />
            {category || "Any level"}
          </span>
          <span className="inline-flex items-center px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs hover:bg-gray-600 transition-colors">
            <Clock className="h-4 w-4 mr-1.5" />
            {jobType || "Full-time"}
          </span>
        </div>
      </div>

      {/* Bottom white section */}
      <div className="bg-white p-3 flex justify-between items-center rounded-b-xl">
        <div className="flex items-center text-gray-500 text-sm">
          <Clock className="h-4 w-4 mr-1.5" />
          <span>
            {daysLeft} {daysLeft > 1 ? "days" : "day"} left
          </span>
        </div>
        <div className="font-semibold text-lg text-black">{salaryDisplay}</div>
      </div>
    </>
  )
}
