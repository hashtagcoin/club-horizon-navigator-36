import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Club } from "@/types/club";

const getRandomTraffic = (): 'Low' | 'Medium' | 'High' => {
  const random = Math.random();
  if (random < 0.33) return 'Low';
  if (random < 0.66) return 'Medium';
  return 'High';
};

const transformClubData = (data: any[]): Club[] => {
  console.log('Raw data from Supabase:', data);
  
  const transformed = data.map((club): Club => {
    const transformedClub: Club = {
      id: club.id || Math.random(),
      name: club.name || 'Unknown Club',
      address: club.address || 'Address not available',
      position: {
        lat: club.latitude || -33.8688,
        lng: club.longitude || 151.2093
      },
      traffic: getRandomTraffic(),
      openingHours: {
        Monday: `${club.monday_hours_open || '23:59'} - ${club.monday_hours_close || '23:59'}`,
        Tuesday: `${club.tuesday_hours_open || '23:59'} - ${club.tuesday_hours_close || '23:59'}`,
        Wednesday: `${club.wednesday_hours_open || '23:59'} - ${club.wednesday_hours_close || '23:59'}`,
        Thursday: `${club.thursday_hours_open || '23:59'} - ${club.thursday_hours_close || '23:59'}`,
        Friday: `${club.friday_hours_open || '23:59'} - ${club.friday_hours_close || '23:59'}`,
        Saturday: `${club.saturday_hours_open || '23:59'} - ${club.saturday_hours_close || '23:59'}`,
        Sunday: `${club.sunday_hours_open || '23:59'} - ${club.sunday_hours_close || '23:59'}`
      },
      genre: {
        Monday: String(club.music_Mon || 'Various'),
        Tuesday: String(club.music_Tues || 'Various'),
        Wednesday: String(club.music_Wed || 'Various'),
        Thursday: String(club.music_Thurs || 'Various'),
        Friday: String(club.music_Fri || 'Various'),
        Saturday: String(club.music_Sat || 'Various'),
        Sunday: String(club.music_Sun || 'Various')
      },
      usersAtClub: Math.floor(Math.random() * 100),
      hasSpecial: Math.random() < 0.3,
      isUserAdded: false
    };
    console.log('Transformed club:', transformedClub);
    return transformedClub;
  });

  console.log('Final transformed data:', transformed);
  return transformed;
};

export const useClubData = () => {
  return useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      console.log('Fetching clubs from Supabase...');
      const { data, error } = await supabase
        .from('Clublist_Australia')
        .select('*');
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Supabase response:', data);
      return transformClubData(data || []);
    }
  });
};

// Update the useGenres function to fetch genres for the current day
export const useGenres = () => {
  const currentDay = new Date().toLocaleString('en-us', { weekday: 'long' });
  const columnMap: { [key: string]: string } = {
    'Monday': 'music_Mon',
    'Tuesday': 'music_Tues',
    'Wednesday': 'music_Wed',
    'Thursday': 'music_Thurs',
    'Friday': 'music_Fri',
    'Saturday': 'music_Sat',
    'Sunday': 'music_Sun'
  };

  return useQuery({
    queryKey: ['genres', currentDay],
    queryFn: async () => {
      const column = columnMap[currentDay];
      const { data, error } = await supabase
        .from('Clublist_Australia')
        .select(column)
        .not(column, 'is', null);
      
      if (error) {
        console.error('Supabase error fetching genres:', error);
        throw error;
      }

      // Get unique genres and filter out null/empty values
      const uniqueGenres = [...new Set(data.map(item => item[column]))]
        .filter(genre => genre && genre.trim());

      console.log('Unique genres from database:', uniqueGenres);
      return uniqueGenres;
    }
  });
};