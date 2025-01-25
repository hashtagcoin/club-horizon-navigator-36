import { useQuery } from "@tanstack/react-query";
import { Club } from "@/types/club";
import { supabase } from "@/integrations/supabase/client";

export const useClubData = (currentCity?: string) => {
  return useQuery({
    queryKey: ['clubs', currentCity],
    queryFn: async () => {
      console.log('Fetching clubs data...');
      const { data: clubs, error } = await supabase
        .from('Clublist_Australia')
        .select('*');

      if (error) {
        console.error('Error fetching clubs:', error);
        throw error;
      }

      console.log('Received clubs data:', clubs);

      return clubs.map((club): Club => ({
        id: parseInt(club.place_id, 36), // Convert place_id to a number
        name: club.name || 'Unknown Venue',
        address: club.address || '',
        position: {
          lat: club.latitude || -33.8688,
          lng: club.longitude || 151.2093,
        },
        traffic: 'Low',
        openingHours: {
          Monday: `${club.monday_hours_open || 'Closed'} - ${club.monday_hours_close || 'Closed'}`,
          Tuesday: `${club.tuesday_hours_open || 'Closed'} - ${club.tuesday_hours_close || 'Closed'}`,
          Wednesday: `${club.wednesday_hours_open || 'Closed'} - ${club.wednesday_hours_close || 'Closed'}`,
          Thursday: `${club.thursday_hours_open || 'Closed'} - ${club.thursday_hours_close || 'Closed'}`,
          Friday: `${club.friday_hours_open || 'Closed'} - ${club.friday_hours_close || 'Closed'}`,
          Saturday: `${club.saturday_hours_open || 'Closed'} - ${club.saturday_hours_close || 'Closed'}`,
          Sunday: `${club.sunday_hours_open || 'Closed'} - ${club.sunday_hours_close || 'Closed'}`
        },
        genre: club[`music_${new Date().toLocaleString('en-us', { weekday: 'short' })}` as keyof typeof club] as string || 'Various',
        usersAtClub: Math.floor(Math.random() * 50),
        hasSpecial: Math.random() > 0.7,
        isUserAdded: false
      }));
    }
  });
};