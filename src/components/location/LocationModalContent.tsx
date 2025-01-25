import { Button } from "@/components/ui/button"
import { Globe, Loader2 } from 'lucide-react'
import { CitySelect } from "./CitySelect"

interface LocationModalContentProps {
  currentCity: string
  cities: string[]
  onCityChange: (value: string) => void
  onClose: () => void
  onLocationUpdate: () => void
  onGlobalLocationOpen: () => void
  isLoadingLocation: boolean
}

export function LocationModalContent({
  currentCity,
  cities,
  onCityChange,
  onClose,
  onLocationUpdate,
  onGlobalLocationOpen,
  isLoadingLocation
}: LocationModalContentProps) {
  return (
    <div>
      <div className="grid gap-4 py-4">
        <CitySelect
          currentCity={currentCity}
          cities={cities}
          onCityChange={onCityChange}
        />
      </div>
      <div className="flex justify-between items-center">
        <Button onClick={onClose}>Close</Button>
        <div className="flex gap-2">
          <Button 
            onClick={onLocationUpdate} 
            variant="outline"
            disabled={isLoadingLocation}
          >
            {isLoadingLocation && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Update Location
          </Button>
          <Button onClick={onGlobalLocationOpen} variant="outline">
            <Globe className="h-4 w-4 mr-2" />
            Change Location
          </Button>
        </div>
      </div>
    </div>
  )
}