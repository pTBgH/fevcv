"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/lib/i18n/context"

interface ExtractedFieldProps {
  title: string
  titleColor?: string
  content: string
  isEditing?: boolean
  onContentChange?: (newContent: string) => void
}

export default function ExtractedField({
  title,
  titleColor = "text-gray-900",
  content,
  isEditing = false,
  onContentChange,
}: ExtractedFieldProps) {
  const [editedContent, setEditedContent] = useState(content)
  const { t } = useLanguage()

  const handleChange = (value: string) => {
    setEditedContent(value)
    onContentChange?.(value)
  }

  return (
    <div className="border rounded-lg p-4 dark:border-slate-600 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-700 dark:shadow-lg dark:shadow-purple-900/10 transition-all duration-300 hover:dark:shadow-purple-900/20">
      <h3 className={`font-medium mb-2 ${titleColor} dark:drop-shadow-sm`}>{title}</h3>
      {isEditing ? (
        <Textarea
          value={editedContent}
          onChange={(e) => handleChange(e.target.value)}
          className="min-h-[100px] text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-indigo-100 focus:dark:border-indigo-500"
        />
      ) : (
        <div className="text-sm text-gray-700 dark:text-indigo-200">{content}</div>
      )}
    </div>
  )
}
