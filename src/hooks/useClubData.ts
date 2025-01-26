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
    const transformedClub = {
      id: club.id || Math.random(), // Fallback since Clublist_Australia might not have id
      name: club.name || 'Unknown Club',
      address: club.address || 'Address not available',
      traffic: getRandomTraffic(), // Randomly assign traffic level
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
      usersAtClub: Math.floor(Math.random() * 100), // Random number since not in DB
      hasSpecial: Math.random() < 0.3, // 30% chance of special
      genre: club.venue_type || 'Various'
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