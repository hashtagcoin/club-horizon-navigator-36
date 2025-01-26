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
  
  const transformed = data.map((club) => {
    const transformedClub: Club = {
      id: club.id || Math.random(),
      name: club.name || 'Unknown Club',
      address: club.address || 'Address not available',
      traffic: getRandomTraffic(),
      openingHours: {
        Monday: club.monday_hours_open && club.monday_hours_close 
          ? `${club.monday_hours_open} - ${club.monday_hours_close}`
          : 'Closed',
        Tuesday: club.tuesday_hours_open && club.tuesday_hours_close
          ? `${club.tuesday_hours_open} - ${club.tuesday_hours_close}`
          : 'Closed',
        Wednesday: club.wednesday_hours_open && club.wednesday_hours_close
          ? `${club.wednesday_hours_open} - ${club.wednesday_hours_close}`
          : 'Closed',
        Thursday: club.thursday_hours_open && club.thursday_hours_close
          ? `${club.thursday_hours_open} - ${club.thursday_hours_close}`
          : 'Closed',
        Friday: club.friday_hours_open && club.friday_hours_close
          ? `${club.friday_hours_open} - ${club.friday_hours_close}`
          : 'Closed',
        Saturday: club.saturday_hours_open && club.saturday_hours_close
          ? `${club.saturday_hours_open} - ${club.saturday_hours_close}`
          : 'Closed',
        Sunday: club.sunday_hours_open && club.sunday_hours_close
          ? `${club.sunday_hours_open} - ${club.sunday_hours_close}`
          : 'Closed'
      },
      position: {
        lat: club.latitude || -33.8688,
        lng: club.longitude || 151.2093
      },
      usersAtClub: Math.floor(Math.random() * 100),
      hasSpecial: Math.random() < 0.3,
      genre: {
        Monday: club.music_Mon || 'Various',
        Tuesday: club.music_Tues || 'Various',
        Wednesday: club.music_Wed || 'Various',
        Thursday: club.music_Thurs || 'Various',
        Friday: club.music_Fri || 'Various',
        Saturday: club.music_Sat || 'Various',
        Sunday: club.music_Sun || 'Various'
      },
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