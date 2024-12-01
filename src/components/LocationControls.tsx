import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { locations } from '@/data/locations'
import { useState } from 'react'

interface LocationControlsProps {
  currentCountry: string
  currentState: string
  currentSuburb: string
  onCountryChange: (value: string) => void
  onStateChange: (value: string) => void
  onSuburbChange: (value: string) => void
}

export function LocationControls({
  currentCountry,
  currentState,
  currentSuburb,
  onCountryChange,
  onStateChange,
  onSuburbChange
}: LocationControlsProps) {
  const [showControls, setShowControls] = useState(false)

  return (
    <div className="space-y-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setShowControls(!showControls)}
        className="mb-2"
      >
        {currentSuburb} - Change Location
      </Button>

      {showControls && (
        <div className="space-y-2">
          <Select value={currentCountry} onValueChange={onCountryChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(locations).map((country) => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={currentState} onValueChange={onStateChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {locations[currentCountry] && Object.keys(locations[currentCountry]).map((state) => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Select value={currentSuburb} onValueChange={onSuburbChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select suburb" />
        </SelectTrigger>
        <SelectContent>
          {locations[currentCountry] && locations[currentCountry][currentState] && 
            Object.keys(locations[currentCountry][currentState]).map((suburb) => (
              <SelectItem key={suburb} value={suburb}>{suburb}</SelectItem>
            ))
          }
        </SelectContent>
      </Select>
    </div>
  )
}