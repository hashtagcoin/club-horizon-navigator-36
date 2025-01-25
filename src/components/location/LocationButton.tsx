import { Loader2 } from 'lucide-react'

interface LocationButtonProps {
  isLoadingLocation: boolean
  currentCity: string
}

export function LocationButton({ isLoadingLocation, currentCity }: LocationButtonProps) {
  return (
    <h2 className="text-2xl font-bold text-white bg-black cursor-pointer rounded-lg px-3 py-1 shadow-sm inline-block hover:bg-black/90 transition-colors border-4 border-white">
      {isLoadingLocation ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          Locating...
        </div>
      ) : (
        currentCity || 'Select Location'
      )}
    </h2>
  )
}