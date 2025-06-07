"use client"

import type React from "react"

import { useState } from "react"
import { Send, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/context"

interface Message {
  text: string
  isBot: boolean
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello, I'm here.\nHow can I help you with?",
      isBot: true,
    },
  ])
  const [input, setInput] = useState("")
  const { t } = useLanguage()

  const sendMessage = () => {
    if (!input.trim()) return

    setMessages((prev) => [...prev, { text: input, isBot: false }])
    setInput("")

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: "Thank you for your message. I'll help you with that.", isBot: true }])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800"
        onClick={() => setIsOpen(true)}
      >
        <span className="sr-only">{t("help.contactUs")}</span>💬
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-lg flex flex-col dark:bg-gray-800 dark:border-gray-700">
      {/* Header */}
      <div className="bg-indigo-600 dark:bg-indigo-700 text-white p-3 flex items-center justify-between rounded-t-lg">
        <h3 className="font-medium">{t("help.contactOurCustomerService")}</h3>
        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
          ×
        </button>
      </div>

      {/* Messages - increased height from h-96 to h-[400px] */}
      <div className="flex-1 p-4 space-y-4 h-[400px] overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "max-w-[80%] p-3 rounded-lg",
              message.isBot
                ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                : "bg-indigo-600 dark:bg-indigo-700 text-white ml-auto",
            )}
          >
            {message.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t dark:border-gray-700 flex items-center gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={t("contact.typeYourMessageHere")}
          className="flex-1 resize-none border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={1}
        />
        <Button
          variant="ghost"
          size="icon"
          className="dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
        >
          <Smile className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </Button>
        <Button
          onClick={sendMessage}
          className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white"
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
