"use client"

import { Badge } from "@/components/ui/badge"

interface SuggestedTagProps {
  tag: string
}

export function SuggestedTag({ tag }: SuggestedTagProps) {
  return (
    <Badge variant="outline" className="bg-blue-50 hover:bg-blue-100 text-blue-600">
      {tag}
    </Badge>
  )
}
