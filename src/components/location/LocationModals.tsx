import { LocationControls } from "@/components/LocationControls"

interface LocationModalsProps {
  currentCountry: string
  currentState: string
  currentSuburb: string
  setCurrentCountry: (country: string) => void
  setCurrentState: (state: string) => void
  setCurrentSuburb: (suburb: string) => void
}

export function LocationModals({
  currentCountry,
  currentState,
  currentSuburb,
  setCurrentCountry,
  setCurrentState,
  setCurrentSuburb
}: LocationModalsProps) {
  return (
    <LocationControls
      currentCountry={currentCountry}
      currentState={currentState}
      currentSuburb={currentSuburb}
      onCountryChange={setCurrentCountry}
      onStateChange={setCurrentState}
      onSuburbChange={setCurrentSuburb}
    />
  )
}