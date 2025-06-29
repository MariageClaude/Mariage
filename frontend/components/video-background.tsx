"use client"

import React from "react"

interface VideoBackgroundProps {
  videoSrc?: string
  fallbackImage: string
  overlay?: boolean
  overlayOpacity?: number
  children: React.ReactNode
}

export function VideoBackground({
  videoSrc,
  fallbackImage,
  overlay = true,
  overlayOpacity = 0.1,
  children,
}: VideoBackgroundProps) {
  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('${fallbackImage}')`,
      }}
    >
      {overlay && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: `rgba(0,0,0,${overlayOpacity})`,
            pointerEvents: "none",
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
