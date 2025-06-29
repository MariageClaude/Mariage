'use client'
import type React from "react"
import { VideoBackground } from "./video-background"
import { usePathname } from "next/navigation"

interface PageBackgroundProps {
  children: React.ReactNode
  overlay?: boolean
  overlayOpacity?: number
}

export function PageBackground({ children, overlay = true, overlayOpacity = 0.1 }: PageBackgroundProps) {
  // You can add your video file here
  // For example: const videoSrc = "/videos/wedding-flowers.mp4"
  const backgroundTabs=["/images/back3.png","/images/back1.png","/images/back2.png"]
  const pathname : string= usePathname()
  const background=()=>{
    if (pathname==='/guest/validation') return backgroundTabs[0]
    if (pathname==='/guest/validationdot') return backgroundTabs[1]
    if (pathname==='/guest/validationNuxiale') return backgroundTabs[2]
    return "/images/back.png"
  }
  const videoSrc = undefined // Set to your video file path when available

  return (
    <VideoBackground
      videoSrc={videoSrc}
      fallbackImage={background()}
      overlay={overlay}
      overlayOpacity={overlayOpacity}
    >
      {children}
    </VideoBackground>
  )
}
