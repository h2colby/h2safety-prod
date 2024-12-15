import { ReactNode, useState } from 'react'

interface TooltipProps {
  children: ReactNode
  content: string
}

export function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative"
         onMouseEnter={() => setIsVisible(true)}
         onMouseLeave={() => setIsVisible(false)}>
      {children}
      {isVisible && (
        <div className="absolute z-10 p-2 bg-gray-800 text-white text-sm rounded shadow-lg 
                      -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full
                      whitespace-nowrap">
          {content}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 
                        rotate-45 w-2 h-2 bg-gray-800"></div>
        </div>
      )}
    </div>
  )
} 