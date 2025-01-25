import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Club } from "@/types/club";

const getDaySpecificMusic = (club: any, day: string): string => {
  const musicMap: { [key: string]: string } = {
    'Monday': club.music_Mon,
    'Tuesday': club.music_Tues,
    'Wednesday': club.music_Wed,
    'Thursday': club.music_Thurs,
    'Friday': club.music_Fri,
    'Saturday': club.music_Sat,
    'Sunday': club.music_Sun
  };

  return musicMap[day] || club.music_type || 'Various';
};

const transformClubData = (data: any[]): Club[] => {
  console.log('Raw data from Supabase:', data);
  
  const transformed = data.map((club) => {
    const transformedClub: Club = {
      id: club.id || Math.random(),
      name: club.name || 'Unknown Club',
      address: club.address || 'Address not available',
      traffic: club.traffic || 'Low',
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
        Monday: getDaySpecificMusic(club, 'Monday'),
        Tuesday: getDaySpecificMusic(club, 'Tuesday'),
        Wednesday: getDaySpecificMusic(club, 'Wednesday'),
        Thursday: getDaySpecificMusic(club, 'Thursday'),
        Friday: getDaySpecificMusic(club, 'Friday'),
        Saturday: getDaySpecificMusic(club, 'Saturday'),
        Sunday: getDaySpecificMusic(club, 'Sunday')
      }
    };
    console.log('Transformed club:', transformedClub);
    return transformedClub;
  });

  console.log('Final transformed data:', transformed);
  return transformed;
};

export const useClubData = (selectedCity?: string) => {
  return useQuery({
    queryKey: ['clubs', selectedCity],
    queryFn: async () => {
      console.log('Fetching clubs from Supabase...');
      
      let query = supabase
        .from('Clublist_Australia')
        .select('*');
      
      if (selectedCity) {
        query = query.eq('city', selectedCity);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Supabase response:', data);
      return transformClubData(data || []);
    }
  });
};