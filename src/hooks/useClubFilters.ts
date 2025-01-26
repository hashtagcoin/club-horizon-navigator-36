import { useState, useMemo } from "react";
import { Club } from "@/types/club";
import debounce from "lodash/debounce";

// Calculate distance between two points using Haversine formula
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getClosingHour = (timeString: string): number => {
  if (!timeString || timeString === 'Closed') return -1;
  
  const [opening, closing] = timeString.split(' - ').map(time => time.trim());
  
  // Handle special cases
  if (opening === '23:59' || !closing) return -1; // Closed
  if (opening === '23:58') return 24; // 24HR
  if (opening === '23:57' || closing === '23:57') return -1; // TBC
  
  // Parse regular closing time
  if (closing) {
    const [hours] = closing.split(':').map(Number);
    // If closing time is before 6 AM, add 24 to make it sortable
    return hours < 6 ? hours + 24 : hours;
  }
  
  return -1;
};

export function useClubFilters() {
  const [sortBy, setSortBy] = useState("closest");
  const [filterGenre, setFilterGenre] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showHighTraffic, setShowHighTraffic] = useState(false);
  const [sortByOpenLate, setSortByOpenLate] = useState(false);
  const [showSpecials, setShowSpecials] = useState(false);
  const [selectedDay, setSelectedDay] = useState(() => {
    return new Date().toLocaleString('en-us', {weekday: 'long'});
  });

  // Debounced filter function
  const debouncedFilter = useMemo(
    () =>
      debounce((query: string) => {
        setSearchQuery(query);
      }, 300),
    []
  );

  const filterAndSortClubs = (clubs: Club[], userLocation: { lat: number; lng: number }) => {
    if (!clubs) return [];

    let filtered = [...clubs];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        club =>
          club.name.toLowerCase().includes(query) ||
          club.address.toLowerCase().includes(query) ||
          club.genre.toLowerCase().includes(query)
      );
    }

    // Apply genre filter
    if (filterGenre.length > 0) {
      filtered = filtered.filter(club =>
        filterGenre.some(genre =>
          club.genre.toLowerCase().includes(genre.toLowerCase())
        )
      );
    }

    // Apply traffic filter
    if (showHighTraffic) {
      filtered = filtered.filter(club => club.traffic === "High");
    }

    // Apply specials filter
    if (showSpecials) {
      filtered = filtered.filter(club => club.hasSpecial);
    }

    // Sort by closing time if sortByOpenLate is true
    if (sortByOpenLate) {
      filtered.sort((a, b) => {
        const aClosingHour = getClosingHour(a.openingHours[selectedDay]);
        const bClosingHour = getClosingHour(b.openingHours[selectedDay]);
        return bClosingHour - aClosingHour;
      });
      return filtered;
    }

    // Apply sorting
    switch (sortBy) {
      case "closest":
        return filtered.sort((a, b) => {
          const distA = getDistance(
            userLocation.lat,
            userLocation.lng,
            a.position.lat,
            a.position.lng
          );
          const distB = getDistance(
            userLocation.lat,
            userLocation.lng,
            b.position.lat,
            b.position.lng
          );
          return distA - distB;
        });
      case "alphabetical":
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return filtered;
    }
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