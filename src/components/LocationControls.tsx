import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Globe, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"

interface LocationControlsProps {
  currentCountry: string
  currentState: string
  currentCity: string
  onCountryChange: (value: string) => void
  onStateChange: (value: string) => void
  onCityChange: (value: string) => void
}

type CityRecord = {
  city: string
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
  }, [currentCountry])

  const fetchCities = async () => {
    try {
      const { data, error } = await supabase
        .from('Clublist_Australia')
        .select('city')
        .not('city', 'is', null)
        .eq('Country', currentCountry)
        .distinct()
      
      if (error) {
        console.error('Error fetching cities:', error)
        return
      }

      const uniqueCities = Array.from(new Set(data.map(item => item.city).filter(Boolean))) as string[]
      setCities(uniqueCities)
      
      if (!currentCity && uniqueCities.length > 0) {
        onCityChange(uniqueCities[0])
      }
    } catch (error) {
      console.error('Error processing cities:', error)
    }
  }

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
            // Find the city from address components
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

            // Update location if we found valid data
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
            <h2 className="text-2xl font-bold text-white bg-black cursor-pointer rounded-lg px-3 py-1 shadow-sm inline-block hover:bg-black/90 transition-colors border-4 border-white">
              {isLoadingLocation ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Locating...
                </div>
              ) : (
                currentCity
              )}
            </h2>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select City</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select value={currentCity} onValueChange={onCityChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between items-center">
            <Button onClick={handleCloseModals}>Close</Button>
            <div className="flex gap-2">
              <Button 
                onClick={getCurrentLocation} 
                variant="outline"
                disabled={isLoadingLocation}
              >
                {isLoadingLocation && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Update Location
              </Button>
              <Button onClick={() => setShowGlobalLocationModal(true)} variant="outline">
                <Globe className="h-4 w-4 mr-2" />
                Change Location
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showGlobalLocationModal} onOpenChange={setShowGlobalLocationModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Location</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select value={currentCity} onValueChange={onCityChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleCloseModals}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}