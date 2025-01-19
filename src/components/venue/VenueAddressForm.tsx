import { Input } from "@/components/ui/input";

interface AddressComponents {
  streetAddress: string;
  suburb: string;
  state: string;
  country: string;
}

interface VenueAddressFormProps {
  addressComponents: AddressComponents;
  onChange: (components: AddressComponents) => void;
}

export function VenueAddressForm({ addressComponents, onChange }: VenueAddressFormProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium">Street Address</label>
        <Input
          value={addressComponents.streetAddress}
          onChange={(e) => onChange({ ...addressComponents, streetAddress: e.target.value })}
          placeholder="Street address"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Suburb</label>
        <Input
          value={addressComponents.suburb}
          onChange={(e) => onChange({ ...addressComponents, suburb: e.target.value })}
          placeholder="Suburb"
        />
      </div>
      <div>
        <label className="text-sm font-medium">State</label>
        <Input
          value={addressComponents.state}
          onChange={(e) => onChange({ ...addressComponents, state: e.target.value })}
          placeholder="State"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Country</label>
        <Input
          value={addressComponents.country}
          onChange={(e) => onChange({ ...addressComponents, country: e.target.value })}
          placeholder="Country"
        />
      </div>
    </div>
  );
}