import { Club } from '@/types/club';

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const sortClubs = (
  clubs: Club[], 
  sortBy: string, 
  userLocation?: { lat: number; lng: number },
  selectedDay: string = 'Monday'
) => {
  const clubsCopy = [...clubs];

  switch (sortBy) {
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
      return clubsCopy.sort((a, b) => {
        const genreA = a.genre[selectedDay as keyof typeof a.genre] || '';
        const genreB = b.genre[selectedDay as keyof typeof b.genre] || '';
        return genreA.localeCompare(genreB);
      });
    
    case 'openingHours':
      return clubsCopy.sort((a, b) => {
        const aHours = a.openingHours[Object.keys(a.openingHours)[0]] || '';
        const bHours = b.openingHours[Object.keys(b.openingHours)[0]] || '';
        return aHours.localeCompare(bHours);
      });
    
    default:
      return clubsCopy;
  }
};