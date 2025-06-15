import { useRef } from 'react'

export const useAnimatedButton = () => {
  const iconRef = useRef<SVGSVGElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  const triggerAnimation = () => {
    // Animate icon - từ dưới lên
    if (iconRef.current) {
      iconRef.current.style.transform = 'translateY(-30px)'
      iconRef.current.style.opacity = '0'
      
      setTimeout(() => {
        if (iconRef.current) {
          iconRef.current.style.transition = 'none'
          iconRef.current.style.transform = 'translateY(30px)'
          iconRef.current.style.opacity = '0'
          
          setTimeout(() => {
            if (iconRef.current) {
              iconRef.current.style.transition = 'all 0.3s ease-out'
              iconRef.current.style.transform = 'translateY(0)'
              iconRef.current.style.opacity = '1'
            }
          }, 50)
        }
      }, 200)
    }

    // Animate text - từ dưới lên và về lại
    if (textRef.current) {
      textRef.current.style.transform = 'translateY(-30px)'
      textRef.current.style.opacity = '0'
      
      setTimeout(() => {
        if (textRef.current) {
          textRef.current.style.transition = 'none'
          textRef.current.style.transform = 'translateY(30px)'
          textRef.current.style.opacity = '0'
          
          setTimeout(() => {
            if (textRef.current) {
              textRef.current.style.transition = 'all 0.1s ease-out'
              textRef.current.style.transform = 'translateY(0)'
              textRef.current.style.opacity = '1'
            }
          }, 50)
        }
      }, 150)
    }
  }

  const resetAnimation = () => {
    if (iconRef.current) {
      iconRef.current.style.transform = 'translateY(0)'
      iconRef.current.style.opacity = '1'
      iconRef.current.style.transition = 'all 0.3s ease-out'
    }

    if (textRef.current) {
      textRef.current.style.transform = 'translateY(0)'
      textRef.current.style.opacity = '1'
      textRef.current.style.transition = 'all 0.3s ease-out'
    }
  }

  return {
    iconRef,
    textRef,
    triggerAnimation,
    resetAnimation
  }
}