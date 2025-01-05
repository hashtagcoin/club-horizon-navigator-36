import { useState, useEffect } from 'react';
import { Club } from '@/types/club';
import { sortClubs } from '@/utils/sortClubs';

export function useClubFilters() {
  const [sortBy, setSortBy] = useState("closest");
  const [filterGenre, setFilterGenre] = useState<string[]>([]);  // Changed to array
  const [searchQuery, setSearchQuery] = useState("");
  const [showHighTraffic, setShowHighTraffic] = useState(false);
  const [sortByOpenLate, setSortByOpenLate] = useState(false);
  const [showSpecials, setShowSpecials] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');

  useEffect(() => {
    const today = new Date().toLocaleString('en-us', {weekday: 'long'});
    setSelectedDay(today);
  }, []);

  const filterAndSortClubs = (clubs: Club[], userLocation?: { lat: number; lng: number }) => {
    let filtered = [...clubs];

    // Apply filters
    if (filterGenre.length > 0) {
      filtered = filtered.filter(club => filterGenre.includes(club.genre));
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(club => 
        club.name.toLowerCase().includes(query)
      );
    }
    
    if (showHighTraffic) {
      filtered = filtered.filter(club => club.traffic === "High");
    }
    
    if (showSpecials) {
      filtered = filtered.filter(club => club.hasSpecial);
    }
    
    if (sortByOpenLate) {
      filtered = filtered.filter(club => {
        const hours = club.openingHours[selectedDay];
        if (!hours || hours === "Closed") return false;
        const closingTime = hours.split(" - ")[1];
        if (!closingTime) return false;
        const [hourStr] = closingTime.split(":");
        const hour = parseInt(hourStr);
        return hour < 6 || hour >= 22;
      });
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