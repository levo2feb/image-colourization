"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Download } from "lucide-react"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"

export default function ImageColorizer() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [colorizedImage, setColorizedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.")
      return
    }

    setError(null)
    setIsLoading(true)
    setProgress(10)
    
    // Create a temporary object URL for the original image preview
    const objectUrl = URL.createObjectURL(file)
    setOriginalImage(objectUrl)
    setColorizedImage(null)

    try {
      // Create form data to send to the API
      const formData = new FormData()
      formData.append('image', file)
      
      setProgress(30)
      
      // Send the image to our API endpoint
      const response = await fetch('/api/colorize', {
        method: 'POST',
        body: formData,
      })
      
      setProgress(80)
      
      if (!response.ok) {
        throw new Error('Failed to colorize image')
      }
      
      const result = await response.json()
      
      // Set the colorized image from the API response
      setColorizedImage(result.colorizedImage)
      setProgress(100)
    } catch (err) {
      console.error(err)
      setError("An error occurred while processing the image.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (colorizedImage) {
      const link = document.createElement("a")
      link.href = colorizedImage
      link.download = "colorized_image.jpg"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
      <h1 className="text-4xl font-bold text-center mb-8 text-purple-600">Image Colorizer</h1>

      <div className="mb-6">
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex items-center justify-center border-2 border-dashed border-purple-300 rounded-lg h-40 hover:border-purple-500 transition-colors bg-purple-50"
        >
          <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <div className="text-center">
            <Upload className="mx-auto text-purple-400 mb-2 h-10 w-10" />
            <p className="text-sm text-purple-600">Click to upload or drag and drop</p>
            <p className="text-xs text-purple-400 mt-1">Supported formats: JPG, PNG, GIF</p>
          </div>
        </label>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {isLoading && (
        <div className="text-center mb-4">
          <Progress value={progress} className="h-2 mb-2" />
          <p className="mt-2 text-purple-600">Processing image... {progress}%</p>
        </div>
      )}

      {(originalImage || colorizedImage) && (
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-6">
          {originalImage && (
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2 text-purple-600">Original</h2>
              <div className="relative w-64 h-64 border border-purple-200 rounded-lg overflow-hidden">
                <Image src={originalImage} alt="Original image" fill className="object-contain" unoptimized />
              </div>
            </div>
          )}
          {colorizedImage && (
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2 text-purple-600">Colorized</h2>
              <div className="relative w-64 h-64 border border-purple-200 rounded-lg overflow-hidden">
                <Image
                  src={colorizedImage}
                  alt="Colorized image"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
          )}
        </div>
      )}

      {colorizedImage && (
        <div className="text-center">
          <button
            onClick={handleDownload}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md inline-flex items-center transition-colors"
          >
            <Download className="mr-2" />
            Download Colorized Image
          </button>
        </div>
      )}
    </div>
  )
}

