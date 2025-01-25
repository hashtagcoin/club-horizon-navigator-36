import { Button } from "@/components/ui/button"
import { Globe, Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LocationModalContentProps {
  currentCountry: string
  currentState: string
  currentCity: string
  states: string[]
  cities: string[]
  onStateChange: (value: string) => void
  onCityChange: (value: string) => void
  onClose: () => void
  onLocationUpdate: () => void
  onGlobalLocationOpen: () => void
  isLoadingLocation: boolean
}

export function LocationModalContent({
  currentCountry,
  currentState,
  currentCity,
  states,
  cities,
  onStateChange,
  onCityChange,
  onClose,
  onLocationUpdate,
  onGlobalLocationOpen,
  isLoadingLocation
}: LocationModalContentProps) {
  return (
    <div>
      <div className="grid gap-4 py-4">
        {/* Country Select - Disabled as it's from GPS */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Country</label>
          <Select disabled value={currentCountry}>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={currentCountry}>{currentCountry}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* State Select */}
        <div className="space-y-2">
          <label className="text-sm font-medium">State</label>
          <Select value={currentState} onValueChange={onStateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* City Select */}
        <div className="space-y-2">
          <label className="text-sm font-medium">City</label>
          <Select value={currentCity} onValueChange={onCityChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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