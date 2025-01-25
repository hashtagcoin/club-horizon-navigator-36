import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Club, TrafficLevel } from "@/types/club";

interface ClubData {
  id: number;
  name: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  traffic: TrafficLevel | null;
  monday_hours_open: string | null;
  monday_hours_close: string | null;
  tuesday_hours_open: string | null;
  tuesday_hours_close: string | null;
  wednesday_hours_open: string | null;
  wednesday_hours_close: string | null;
  thursday_hours_open: string | null;
  thursday_hours_close: string | null;
  friday_hours_open: string | null;
  friday_hours_close: string | null;
  saturday_hours_open: string | null;
  saturday_hours_close: string | null;
  sunday_hours_open: string | null;
  sunday_hours_close: string | null;
  venue_type: string | null;
  city: string | null;
}

const transformClubData = (data: ClubData[]): Club[] => {
  console.log('Raw data from Supabase:', data);
  
  const transformed = data.map((club) => {
    const transformedClub: Club = {
      id: club.id || Math.random(),
      name: club.name || 'Unknown Club',
      address: club.address || 'Address not available',
      traffic: (club.traffic || 'Low') as TrafficLevel,
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
      genre: club.venue_type || 'Various',
      isUserAdded: false
    };
    console.log('Transformed club:', transformedClub);
    return transformedClub;
  });

  console.log('Final transformed data:', transformed);
  return transformed;
};

export const useClubData = (currentCity?: string) => {
  return useQuery({
    queryKey: ['clubs', currentCity],
    queryFn: async () => {
      console.log('Fetching clubs from Supabase for city:', currentCity);
      let query = supabase
        .from('Clublist_Australia')
        .select('*')
      
      if (currentCity) {
        query = query.eq('city', currentCity);
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