import { useState, useEffect } from 'react';
import { Club } from '@/types/club';
import { sortClubs } from '@/utils/sortClubs';

export function useClubFilters() {
  const [sortBy, setSortBy] = useState("closest");
  const [filterGenre, setFilterGenre] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showHighTraffic, setShowHighTraffic] = useState(false);
  const [sortByOpenLate, setSortByOpenLate] = useState(false);
  const [showSpecials, setShowSpecials] = useState(false);
  const [selectedDay, setSelectedDay] = useState("today");

  const filterAndSortClubs = (clubs: Club[], userLocation?: { lat: number; lng: number }) => {
    let filtered = [...clubs];
    
    // Only apply genre filter if some genres are deselected
    if (filterGenre.length > 0 && filterGenre.length < new Set(clubs.map(club => club.genre)).size) {
      filtered = filtered.filter(club => filterGenre.includes(club.genre));
    }
    
    if (showHighTraffic) {
      filtered = filtered.filter(club => club.traffic === 'High');
    }

    if (sortByOpenLate) {
      filtered = filtered.filter(club => {
        const hours = club[`${selectedDay.toLowerCase()}_hours` as keyof Club];
        if (typeof hours === 'string') {
          const closeTime = hours.split('-')[1];
          if (closeTime) {
            const hour = parseInt(closeTime.split(':')[0]);
            return hour < 6 || hour === 12; // Consider 12 AM to 6 AM as late
          }
        }
        return false;
      });
    }

    if (showSpecials) {
      filtered = filtered.filter(club => club.hasSpecials);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(club => 
        club.name.toLowerCase().includes(query) ||
        club.area?.toLowerCase().includes(query) ||
        club.genre?.toLowerCase().includes(query)
      );
    }

    return sortClubs(filtered, sortBy, userLocation);
  };

  return {
    sortBy,
    setSortBy,
    filterGenre,
    setFilterGenre,
    searchQuery,
    setSearchQuery,
    showHighTraffic,
    setShowHighTraffic,
    sortByOpenLate,
    setSortByOpenLate,
    showSpecials,
    setShowSpecials,
    selectedDay,
    setSelectedDay,
    filterAndSortClubs
  };
}