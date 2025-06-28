import type React from "react"
import { VideoBackground } from "./video-background"

interface PageBackgroundProps {
  children: React.ReactNode
  overlay?: boolean
  overlayOpacity?: number
}

export function PageBackground({ children, overlay = true, overlayOpacity = 0.1 }: PageBackgroundProps) {
  // You can add your video file here
  // For example: const videoSrc = "/videos/wedding-flowers.mp4"
  const videoSrc = undefined // Set to your video file path when available

  return (
    <VideoBackground
      videoSrc={videoSrc}
      fallbackImage="/images/back.png"
      overlay={overlay}
      overlayOpacity={overlayOpacity}
    >
      {children}
    </VideoBackground>
  )
}
