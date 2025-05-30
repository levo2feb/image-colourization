import ImageColorizer from "./components/image-colorizer"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <ImageColorizer />
    </main>
  )
}

