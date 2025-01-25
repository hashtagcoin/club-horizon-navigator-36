import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react'
import { toast } from "sonner"
import { LocationButton } from "./location/LocationButton"
import { LocationModalContent } from "./location/LocationModalContent"
import { CitySelect } from "./location/CitySelect"

interface LocationControlsProps {
  currentCountry: string
  currentState: string
  currentCity: string
  onCountryChange: (value: string) => void
  onStateChange: (value: string) => void
  onCityChange: (value: string) => void
}

export function LocationControls({
  currentCountry,
  currentState,
  currentCity,
  onCountryChange,
  onStateChange,
  onCityChange
}: LocationControlsProps) {
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [showGlobalLocationModal, setShowGlobalLocationModal] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [cities] = useState<string[]>([])

  useEffect(() => {
    // Get user's location when component mounts
    getCurrentLocation()
  }, [])

  const getCurrentLocation = () => {
    setIsLoadingLocation(true)
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser")
      setIsLoadingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyC6Z3hNhhdT0Fqy_AXYl07JBRczMiTg8_0`
          )
          const data = await response.json()
          
          if (data.results && data.results.length > 0) {
            const addressComponents = data.results[0].address_components
            let city = '', state = '', country = ''
            
            for (const component of addressComponents) {
              if (component.types.includes('locality') || component.types.includes('sublocality')) {
                city = component.long_name
              } else if (component.types.includes('administrative_area_level_1')) {
                state = component.long_name
              } else if (component.types.includes('country')) {
                country = component.long_name
              }
            }

            if (city && state && country) {
              onCountryChange(country)
              onStateChange(state)
              onCityChange(city)
              toast.success(`Location updated to ${city}`)
              handleCloseModals()
            } else {
              toast.error("Couldn't determine your exact location")
            }
          }
        } catch (error) {
          console.error('Error fetching location details:', error)
          toast.error("Error determining your location")
        } finally {
          setIsLoadingLocation(false)
        }
      },
      (error) => {
        console.error('Error getting location:', error)
        toast.error("Error accessing your location")
        setIsLoadingLocation(false)
      }
    )
  }

  const handleCloseModals = () => {
    setShowLocationModal(false)
    setShowGlobalLocationModal(false)
  }

  return (
    <div className="space-y-2">
      <Dialog open={showLocationModal} onOpenChange={setShowLocationModal}>
        <DialogTrigger asChild>
          <div className="flex items-center gap-2">
            <LocationButton
              isLoadingLocation={isLoadingLocation}
              currentCity={currentCity}
            />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select City</DialogTitle>
          </DialogHeader>
          <LocationModalContent
            currentCity={currentCity}
            cities={cities}
            onCityChange={onCityChange}
            onClose={handleCloseModals}
            onLocationUpdate={getCurrentLocation}
            onGlobalLocationOpen={() => setShowGlobalLocationModal(true)}
            isLoadingLocation={isLoadingLocation}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showGlobalLocationModal} onOpenChange={setShowGlobalLocationModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Location</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <CitySelect
              currentCity={currentCity}
              cities={cities}
              onCityChange={onCityChange}
            />
          </div>
          <Button onClick={handleCloseModals}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}