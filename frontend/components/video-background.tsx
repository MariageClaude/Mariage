"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface VideoBackgroundProps {
  children: React.ReactNode
  videoSrc?: string
  fallbackImage?: string
  overlay?: boolean
  overlayOpacity?: number
}

export function VideoBackground({
  children,
  videoSrc,
  fallbackImage = "/images/wedding-background.png",
  overlay = true,
  overlayOpacity = 0.3,
}: VideoBackgroundProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && videoSrc) {
      const video = videoRef.current

      const handleLoadedData = () => {
        setIsVideoLoaded(true)
        video.play().catch(() => {
          // Autoplay failed, but video is still loaded
          console.log("Autoplay prevented, but video is ready")
        })
      }

      const handleError = () => {
        setHasError(true)
        setIsVideoLoaded(false)
      }

      video.addEventListener("loadeddata", handleLoadedData)
      video.addEventListener("error", handleError)

      return () => {
        video.removeEventListener("loadeddata", handleLoadedData)
        video.removeEventListener("error", handleError)
      }
    }
  }, [videoSrc])

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      {videoSrc && !hasError && (
        <video
          ref={videoRef}
          className={`fixed inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${
            isVideoLoaded ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Fallback Image Background */}
      <div
        className={`fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
          isVideoLoaded && !hasError ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundImage: `url(${fallbackImage})`,
          opacity: 0.6, // ajuste l’opacité ici si besoin
          backgroundSize: "800px auto", // prend tout le background
          backgroundPosition: "center",
          backgroundColor: "#f5efe6", // couleur dominante de l'image
          backgroundRepeat: "no-repeat",
          pointerEvents: "none",
        }}
      />

      {/* Overlay for better text readability */}
      {overlay && <div className="fixed inset-0 z-10 bg-white" style={{ opacity: overlayOpacity }} />}

      {/* Content */}
      <div className="relative z-20 min-h-screen">{children}</div>
    </div>
  )
}
