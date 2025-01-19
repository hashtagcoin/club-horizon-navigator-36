import { useState } from "react";

interface AddressComponents {
  streetAddress: string;
  suburb: string;
  state: string;
  country: string;
}

interface HourEntry {
  open: string;
  close: string;
  status: string;
}

export interface VenueFormState {
  name: string;
  addressComponents: AddressComponents;
  genres: Record<string, string>;
  hours: Record<string, HourEntry>;
}

export const useVenueForm = (initialState?: Partial<VenueFormState>) => {
  const [name, setName] = useState(initialState?.name || "");
  const [addressComponents, setAddressComponents] = useState<AddressComponents>(
    initialState?.addressComponents || {
      streetAddress: "",
      suburb: "",
      state: "",
      country: ""
    }
  );
  const [genres, setGenres] = useState<Record<string, string>>(
    initialState?.genres || {}
  );
  const [hours, setHours] = useState<Record<string, HourEntry>>(
    initialState?.hours || {}
  );

  const handleHoursChange = (day: string, type: 'open' | 'close' | 'status', value: string) => {
    setHours(prev => ({
      ...prev,
      [day.toLowerCase()]: {
        ...prev[day.toLowerCase()],
        [type]: value,
        ...(type === 'status' && value !== 'open' ? { open: '', close: '' } : {})
      }
    }));
  };

  const handleGenreChange = (day: string, value: string) => {
    setGenres(prev => ({ ...prev, [day.toLowerCase()]: value }));
  };

  return {
    name,
    setName,
    addressComponents,
    setAddressComponents,
    genres,
    setGenres,
    hours,
    setHours,
    handleHoursChange,
    handleGenreChange
  };
};