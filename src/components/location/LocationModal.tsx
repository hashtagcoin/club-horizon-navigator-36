import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Globe, Loader2 } from 'lucide-react'

interface LocationModalProps {
  showLocationModal: boolean
  setShowLocationModal: (show: boolean) => void
  currentSuburb: string
  onSuburbChange: (value: string) => void
  suburbs: string[]
  isLoadingLocation: boolean
  getCurrentLocation: () => void
  setShowGlobalLocationModal: (show: boolean) => void
}

export function LocationModal({
  showLocationModal,
  setShowLocationModal,
  currentSuburb,
  onSuburbChange,
  suburbs,
  isLoadingLocation,
  getCurrentLocation,
  setShowGlobalLocationModal
}: LocationModalProps) {
  return (
    <Dialog open={showLocationModal} onOpenChange={setShowLocationModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Suburb</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select value={currentSuburb} onValueChange={onSuburbChange}>
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
        <div className="flex justify-between items-center">
          <Button onClick={() => setShowLocationModal(false)}>Close</Button>
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
  )
}