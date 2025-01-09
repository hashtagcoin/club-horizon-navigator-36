import { Building, Music, Beer, Coffee, Cocktail } from 'lucide-react';
import { Club } from '@/types/club';

interface VenueMarkerProps {
  club: Club;
  isSelected: boolean;
  onClick: () => void;
}

const getVenueIcon = (venueType: string) => {
  switch (venueType?.toLowerCase()) {
    case 'nightclub':
      return Music;
    case 'bar':
      return Beer;
    case 'lounge':
      return Cocktail;
    case 'pub':
      return Beer;
    case 'cafe':
      return Coffee;
    default:
      return Building;
  }
};

export const VenueMarker = ({ club, isSelected, onClick }: VenueMarkerProps) => {
  const Icon = getVenueIcon(club.genre);
  
  return (
    <div 
      className={`p-2 rounded-full cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'bg-yellow-400 shadow-lg scale-125' 
          : 'bg-white shadow hover:bg-gray-100'
      }`}
      onClick={onClick}
      style={{
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Icon 
        size={20} 
        className={isSelected ? 'text-black' : 'text-primary'} 
      />
    </div>
  );
};