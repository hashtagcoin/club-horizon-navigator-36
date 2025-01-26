import { useState, useEffect, useMemo } from 'react';
import { Club } from '@/types/club';
import debounce from 'lodash/debounce';

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
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
    () => debounce((clubs: Club[], query: string) => {
      return clubs.filter(club => 
        club.name.toLowerCase().includes(query.toLowerCase())
      );
    }, 300),
    []
  );

  // Memoized sorting function
  const sortClubs = useMemo(() => {
    return (clubs: Club[], sortType: string, userLocation?: { lat: number; lng: number }) => {
      const clubsCopy = [...clubs];

      switch (sortType) {
        case 'closest':
          if (!userLocation) return clubsCopy;
          return clubsCopy.sort((a, b) => {
            const distanceA = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              a.position.lat,
              a.position.lng
            );
            const distanceB = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              b.position.lat,
              b.position.lng
            );
            return distanceA - distanceB;
          });

        case 'alphabetical':
          return clubsCopy.sort((a, b) => a.name.localeCompare(b.name));
        
        case 'traffic':
          const trafficOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return clubsCopy.sort((a, b) => 
            (trafficOrder[b.traffic as keyof typeof trafficOrder] || 0) - 
            (trafficOrder[a.traffic as keyof typeof trafficOrder] || 0)
          );
        
        case 'usersAtClub':
          return clubsCopy.sort((a, b) => b.usersAtClub - a.usersAtClub);
        
        case 'genre':
          return clubsCopy.sort((a, b) => a.genre.localeCompare(b.genre));
        
        default:
          return clubsCopy;
      }
    };
  }, []);

  const filterAndSortClubs = (clubs: Club[], userLocation?: { lat: number; lng: number }) => {
    let filtered = [...clubs];

    // Apply distance filter if user location exists
    if (userLocation) {
      filtered = filtered.filter(club => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          club.position.lat,
          club.position.lng
        );
        return distance <= 40; // Only show clubs within 40km
      });
    }

    // Apply genre filter
    if (filterGenre.length > 0) {
      filtered = filtered.filter(club => filterGenre.includes(club.genre));
    }
    
    // Apply search filter with debouncing
    if (searchQuery) {
      filtered = debouncedFilter(filtered, searchQuery);
    }
    
    if (showHighTraffic) {
      filtered = filtered.filter(club => club.traffic === "High");
    }
    
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
    
    return sortClubs(filtered, sortBy, userLocation);
  };

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedFilter.cancel();
    };
  }, [debouncedFilter]);

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
