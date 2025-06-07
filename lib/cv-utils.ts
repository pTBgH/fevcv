import { format } from "date-fns"

export function generateCVName(existingNames: string[]): string {
  const baseDate = format(new Date(), "MMM dd, yyyy")

  // If no CV with this date exists, return the base date
  if (!existingNames.includes(baseDate)) {
    return baseDate
  }

  // Find the highest number in parentheses for this date
  let maxNumber = 0
  existingNames.forEach((name) => {
    if (name.startsWith(baseDate)) {
      const match = name.match(/$$(\d+)$$$/)
      if (match) {
        const number = Number.parseInt(match[1], 10)
        maxNumber = Math.max(maxNumber, number)
      }
    }
  })

  // Return the date with the next number
  return `${baseDate} (${maxNumber + 1})`
}
