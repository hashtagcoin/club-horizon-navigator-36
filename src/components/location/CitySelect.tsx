import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CitySelectProps {
  currentCity: string
  cities: string[]
  onCityChange: (value: string) => void
}

export function CitySelect({ currentCity, cities, onCityChange }: CitySelectProps) {
  return (
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
  )
}