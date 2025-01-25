import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { LocationModal } from './location/LocationModal'
import { GlobalLocationModal } from './location/GlobalLocationModal'
import { useLocationData } from '@/hooks/useLocationData'

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
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [showGlobalLocationModal, setShowGlobalLocationModal] = useState(false)
  const { suburbs, isLoadingLocation, getCurrentLocation } = useLocationData()

  useEffect(() => {
    if (!currentSuburb && suburbs.length > 0) {
      onSuburbChange(suburbs[0])
    }
  }, [suburbs, currentSuburb, onSuburbChange])

  const handleGetCurrentLocation = () => {
    getCurrentLocation(onCountryChange, onStateChange, onSuburbChange)
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
                currentSuburb
              )}
            </h2>
          </div>
        </DialogTrigger>
      </Dialog>

      <LocationModal
        showLocationModal={showLocationModal}
        setShowLocationModal={setShowLocationModal}
        currentSuburb={currentSuburb}
        onSuburbChange={onSuburbChange}
        suburbs={suburbs}
        isLoadingLocation={isLoadingLocation}
        getCurrentLocation={handleGetCurrentLocation}
        setShowGlobalLocationModal={setShowGlobalLocationModal}
      />

      <GlobalLocationModal
        showGlobalLocationModal={showGlobalLocationModal}
        setShowGlobalLocationModal={setShowGlobalLocationModal}
        currentCountry={currentCountry}
        setCurrentCountry={onCountryChange}
        currentState={currentState}
        setCurrentState={onStateChange}
        currentSuburb={currentSuburb}
        setCurrentSuburb={onSuburbChange}
        suburbs={suburbs}
      />
    </div>
  )
}