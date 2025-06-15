import React from 'react'
import { useAnimatedButton } from '@/hooks/useAnimatedButton'

interface AnimatedButtonProps {
  onClick: () => void
  isLoading?: boolean
  loadingText?: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
  variant?: 'primary' | 'secondary'
  icon?: React.ReactNode // Custom icon for non-loading state
  loadingIcon?: React.ReactNode // Custom icon for loading state
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  onClick,
  isLoading = false,
  loadingText = "Đang xử lý...",
  children,
  className = "",
  disabled = false,
  variant = 'primary',
  icon,
  loadingIcon
}) => {
  const { textRef, triggerAnimation, resetAnimation } = useAnimatedButton()

  const baseClasses = "flex items-center mx-auto lg:mx-0 rounded-md px-8 py-2 transition-colors duration-300 overflow-hidden"
  
  const variantClasses = {
    primary: "bg-black text-white hover:bg-gray-800 border border-gray-300",
    secondary: "bg-white text-black hover:bg-gray-100 border border-gray-300"
  }

  // Use justify-between when icon is present, justify-center when not
  const justifyClass = icon || (isLoading && loadingIcon) ? 'justify-between' : 'justify-center'
  const buttonClasses = `${baseClasses} ${justifyClass} ${variantClasses[variant]} ${className}`

  return (
    <button 
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      onMouseEnter={triggerAnimation}
      onMouseLeave={resetAnimation}
    >
      <span 
        ref={textRef}
        className="transition-all duration-100 ease-out"
      >
        {isLoading ? loadingText : children}
      </span>
      {(icon || loadingIcon) && (
        <div className="overflow-hidden">
          {isLoading && loadingIcon ? (
            <span>{loadingIcon}</span>
          ) : icon ? (
            <>{icon}</> // No wrapper span to avoid animations on the icon's div
          ) : null}
        </div>
      )}
    </button>
  )
}