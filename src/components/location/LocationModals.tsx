import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from 'lucide-react';
import { locations } from '@/data/locations';

interface LocationModalsProps {
  currentCountry: string;
  setCurrentCountry: (value: string) => void;
  currentState: string;
  setCurrentState: (value: string) => void;
  currentSuburb: string;
  setCurrentSuburb: (value: string) => void;
  showLocationModal: boolean;
  setShowLocationModal: (value: boolean) => void;
  showGlobalLocationModal: boolean;
  setShowGlobalLocationModal: (value: boolean) => void;
}

export const LocationModals = ({
  currentCountry,
  setCurrentCountry,
  currentState,
  setCurrentState,
  currentSuburb,
  setCurrentSuburb,
  showLocationModal,
  setShowLocationModal,
  showGlobalLocationModal,
  setShowGlobalLocationModal,
}: LocationModalsProps) => {
  return (
    <>
      <Dialog open={showLocationModal} onOpenChange={setShowLocationModal}>
        <DialogTrigger asChild>
          <h2 className="text-2xl font-bold text-white bg-black cursor-pointer rounded-lg px-3 py-1 shadow-sm inline-block hover:bg-black/90 transition-colors">
            {currentSuburb}
          </h2>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Suburb</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select value={currentSuburb} onValueChange={setCurrentSuburb}>
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
          <div className="flex justify-between items-center">
            <Button onClick={() => setShowLocationModal(false)}>Close</Button>
            <Button onClick={() => setShowGlobalLocationModal(true)} variant="outline">
              <Globe className="h-4 w-4 mr-2" />
              Change Location
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
                {locations[currentCountry] && locations[currentCountry][currentState] && 
                  Object.keys(locations[currentCountry][currentState]).map((suburb) => (
                    <SelectItem key={suburb} value={suburb}>{suburb}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setShowGlobalLocationModal(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </>
  );
};