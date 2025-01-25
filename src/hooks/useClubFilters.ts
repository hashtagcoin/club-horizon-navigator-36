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
  const [selectedDay, setSelectedDay] = useState('Monday');

  useEffect(() => {
    const today = new Date().toLocaleString('en-us', {weekday: 'long'});
    setSelectedDay(today);
  }, []);

  const getClosingHour = (club: Club, day: string) => {
    const hours = club.openingHours[day];
    if (!hours || hours === "Closed") return -1;
    const closingTime = hours.split(" - ")[1];
    if (!closingTime) return -1;
    const [hourStr] = closingTime.split(":");
    const hour = parseInt(hourStr);
    // Convert early morning hours (1am-6am) to 25-30 for proper sorting
    return hour < 6 ? hour + 24 : hour;
  };

  const filterAndSortClubs = (clubs: Club[], userLocation?: { lat: number; lng: number }) => {
    let filtered = [...clubs];

    // Apply filters
    if (filterGenre.length > 0) {
      filtered = filtered.filter(club => {
        const clubGenre = club.genre[selectedDay as keyof typeof club.genre];
        return filterGenre.includes(clubGenre);
      });
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(club => 
        club.name.toLowerCase().includes(query)
      );
    }
    
    if (showHighTraffic) {
      filtered = filtered.filter(club => club.traffic === "High");
      const trafficOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      filtered.sort((a, b) => 
        (trafficOrder[b.traffic as keyof typeof trafficOrder] || 0) - 
        (trafficOrder[a.traffic as keyof typeof trafficOrder] || 0)
      );
      return filtered;
    }
    
    if (showSpecials) {
      filtered = filtered.filter(club => club.hasSpecial);
    }

    if (sortByOpenLate) {
      filtered.sort((a, b) => {
        const aClosingHour = getClosingHour(a, selectedDay);
        const bClosingHour = getClosingHour(b, selectedDay);
        return bClosingHour - aClosingHour;
      });
      return filtered;
    }
    
    return sortClubs(filtered, sortBy, userLocation, selectedDay);
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