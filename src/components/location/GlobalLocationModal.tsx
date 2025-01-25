import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { locations } from '@/data/locations'

interface GlobalLocationModalProps {
  showGlobalLocationModal: boolean
  setShowGlobalLocationModal: (show: boolean) => void
  currentCountry: string
  setCurrentCountry: (country: string) => void
  currentState: string
  setCurrentState: (state: string) => void
  currentSuburb: string
  setCurrentSuburb: (suburb: string) => void
  suburbs: string[]
}

export function GlobalLocationModal({
  showGlobalLocationModal,
  setShowGlobalLocationModal,
  currentCountry,
  setCurrentCountry,
  currentState,
  setCurrentState,
  currentSuburb,
  setCurrentSuburb,
  suburbs
}: GlobalLocationModalProps) {
  return (
    <Dialog open={showGlobalLocationModal} onOpenChange={setShowGlobalLocationModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Location</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select value={currentCountry} onValueChange={setCurrentCountry}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(locations).map((country) => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={currentState} onValueChange={setCurrentState}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {locations[currentCountry] && Object.keys(locations[currentCountry]).map((state) => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={currentSuburb} onValueChange={setCurrentSuburb}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select suburb" />
            </SelectTrigger>
            <SelectContent>
              {suburbs.map((suburb) => (
                <SelectItem key={suburb} value={suburb}>{suburb}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setShowGlobalLocationModal(false)}>Close</Button>
      </DialogContent>
    </Dialog>
  )
}