import { Club } from '@/types/club';

export const sortClubs = (clubs: Club[], sortBy: string) => {
  const clubsCopy = [...clubs];

  switch (sortBy) {
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