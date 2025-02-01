import { createContext, useContext, useState, ReactNode } from 'react';
import { Club } from '@/types/club';

interface ClubContextType {
  selectedClub: Club | null;
  setSelectedClub: (club: Club | null) => void;
  filterGenre: string[];
  setFilterGenre: (genres: string[]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

const ClubContext = createContext<ClubContextType | undefined>(undefined);

export function ClubProvider({ children }: { children: ReactNode }) {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [filterGenre, setFilterGenre] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('closest');

  return (
    <ClubContext.Provider value={{
      selectedClub,
      setSelectedClub,
      filterGenre,
      setFilterGenre,
      sortBy,
      setSortBy,
    }}>
      {children}
    </ClubContext.Provider>
  );
}

export function useClubContext() {
  const context = useContext(ClubContext);
  if (context === undefined) {
    throw new Error('useClubContext must be used within a ClubProvider');
  }
  return context;
}