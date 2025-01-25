import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState, useEffect } from 'react'
import { toast } from "sonner"
import { LocationButton } from "./LocationButton"
import { LocationModalContent } from "./LocationModalContent"
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
  const [cities, setCities] = useState<string[]>([])
  const [states, setStates] = useState<string[]>([])

  useEffect(() => {
    fetchCities()
    fetchStates()
    // Set default location to Sydney if no city is set
    if (!currentCity) {
      setDefaultSydneyLocation()
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

  const fetchStates = () => {
    const australianStates = [
      'NSW',
      'VIC',
      'QLD',
      'WA',
      'SA',
      'TAS',
      'ACT',
      'NT'
    ]
    setStates(australianStates)
  }

  const setDefaultSydneyLocation = () => {
    console.log('Setting default location to Sydney')
    onCountryChange('Australia')
    onStateChange('NSW')
    onCityChange('Sydney')
    toast.success('Location set to Sydney')
  }

  return (
    <div className="space-y-2">
      <div onClick={() => setShowLocationModal(true)} className="cursor-pointer">
        <LocationButton currentCity={currentCity || 'Select Location'} />
      </div>

      <Dialog open={showLocationModal} onOpenChange={setShowLocationModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Location</DialogTitle>
          </DialogHeader>
          <LocationModalContent
            currentCountry={currentCountry}
            currentState={currentState}
            currentCity={currentCity}
            states={states}
            cities={cities}
            onStateChange={onStateChange}
            onCityChange={onCityChange}
            onClose={() => setShowLocationModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}