import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react'
import { toast } from "sonner"
import { LocationButton } from "./LocationButton"
import { LocationModalContent } from "./LocationModalContent"
import { CitySelect } from "./CitySelect"
import { supabase } from "@/integrations/supabase/client"

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
  const [cities, setCities] = useState<string[]>([])

  useEffect(() => {
    fetchCities()
    // Set default location to Sydney if no city is set
    if (!currentCity) {
      if (navigator.geolocation) {
        getCurrentLocation()
      } else {
        // Set to Sydney if geolocation is not available
        setDefaultSydneyLocation()
      }
    }
  }, [])

  const fetchCities = async () => {
    const { data, error } = await supabase
      .from('Clublist_Australia')
      .select('city')
      .not('city', 'is', null)
    
    if (error) {
      console.error('Error fetching cities:', error)
      return
    }

    // Extract unique cities and remove nulls
    const uniqueCities = Array.from(new Set(data.map(row => row.city).filter(Boolean)))
    setCities(uniqueCities.sort())
  }

  const setDefaultSydneyLocation = () => {
    console.log('Setting default location to Sydney')
    onCountryChange('Australia')
    onStateChange('NSW')
    onCityChange('Sydney')
    toast.success('Location set to Sydney')
  }

  const getCurrentLocation = () => {
    console.log('Getting current location...')
    setIsLoadingLocation(true)
    
    // Set a timeout for geolocation
    const timeoutId = setTimeout(() => {
      console.log('Geolocation timed out, defaulting to Sydney')
      setIsLoadingLocation(false)
      setDefaultSydneyLocation()
    }, 10000) // 10 second timeout

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        clearTimeout(timeoutId)
        console.log('Got coordinates:', position.coords.latitude, position.coords.longitude)
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyC6Z3hNhhdT0Fqy_AXYl07JBRczMiTg8_0`
          )
          const data = await response.json()
          console.log('Geocoding response:', data)
          
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

            console.log('Found location:', { city, state, country })

            if (city && state && country) {
              onCountryChange(country)
              onStateChange(state)
              onCityChange(city)
              toast.success(`Location updated to ${city}`)
              handleCloseModals()
            } else {
              console.log('Could not determine exact location, defaulting to Sydney')
              setDefaultSydneyLocation()
            }
          } else {
            console.log('No results from geocoding, defaulting to Sydney')
            setDefaultSydneyLocation()
          }
        } catch (error) {
          console.error('Error fetching location details:', error)
          setDefaultSydneyLocation()
        } finally {
          setIsLoadingLocation(false)
        }
      },
      (error) => {
        clearTimeout(timeoutId)
        console.error('Error getting location:', error)
        setDefaultSydneyLocation()
        setIsLoadingLocation(false)
      }
    )
  }

  const handleCloseModals = () => {
    setShowLocationModal(false)
    setShowGlobalLocationModal(false)
  }

  console.log('Current city in LocationControls:', currentCity)

  return (
    <div className="space-y-2">
      <Dialog open={showLocationModal} onOpenChange={setShowLocationModal}>
        <DialogTrigger asChild>
          <div className="flex items-center gap-2">
            <LocationButton
              isLoadingLocation={isLoadingLocation}
              currentCity={currentCity || 'Select Location'}
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