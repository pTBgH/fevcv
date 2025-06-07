"use client"
import type React from "react"
import dynamic from "next/dynamic"

const ClientHtmlWrapperComponent = (props: {
  children: React.ReactNode
  defaultLang?: string
  className?: string
  foxified?: boolean
}) => {
  return <div>{props.children}</div>
}

export default dynamic(() => Promise.resolve(ClientHtmlWrapperComponent), {
  ssr: false,
})
