import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Club } from "@/types/club";

const transformClubData = (data: any[]): Club[] => {
  return data.map((club) => ({
    id: club.id,
    name: club.name || 'Unknown Club',
    address: club.address || 'Address not available',
    traffic: club.traffic || 'Low',
    openingHours: {
      Monday: club.monday_hours || 'Closed',
      Tuesday: club.tuesday_hours || 'Closed',
      Wednesday: club.wednesday_hours || 'Closed',
      Thursday: club.thursday_hours || 'Closed',
      Friday: club.friday_hours || 'Closed',
      Saturday: club.saturday_hours || 'Closed',
      Sunday: club.sunday_hours || 'Closed'
    },
    position: {
      lat: club.latitude || -33.8688,
      lng: club.longitude || 151.2093
    },
    usersAtClub: Math.floor(Math.random() * 100), // Random number since not in DB
    hasSpecial: Math.random() < 0.3, // 30% chance of special
    genre: club.venue_type || 'Various'
  }));
};

export const useClubData = () => {
  return useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('club_cards')
        .select('*');
      
      if (error) throw error;
      return transformClubData(data || []);
    }
  });
};