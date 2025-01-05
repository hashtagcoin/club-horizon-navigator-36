import { useState } from 'react';
import { Club } from '@/types/club';

interface ClubSelectionManagerProps {
  onClubSelect: (club: Club) => void;
  locationManagement: any;
}

export const useClubSelectionManager = ({ onClubSelect, locationManagement }: ClubSelectionManagerProps) => {
  const [selectedClubs, setSelectedClubs] = useState<Club[]>([]);

  const handleClubSelect = (club: Club) => {
    setSelectedClubs(prevSelected => {
      const isAlreadySelected = prevSelected.some(c => c.id === club.id);
      if (isAlreadySelected) {
        return prevSelected.filter(c => c.id !== club.id);
      } else {
        return [...prevSelected, club];
      }
    });
    onClubSelect(club);
    locationManagement.setMapCenter(club.position);
    locationManagement.setMapZoom(16);
  };

  return {
    selectedClubs,
    setSelectedClubs,
    handleClubSelect,
  };
};