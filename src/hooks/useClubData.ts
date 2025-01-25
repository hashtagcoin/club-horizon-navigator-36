import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Club } from "@/types/club";

const transformClubData = (data: any[]): Club[] => {
  console.log('Raw data from Supabase:', data);
  
  const transformed = data.map((club) => {
    const transformedClub = {
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
      genre: club.venue_type || 'Various'
    };
    console.log('Transformed club:', transformedClub);
    return transformedClub;
  });

  console.log('Final transformed data:', transformed);
  return transformed;
};

export const useClubData = (currentSuburb: string) => {
  return useQuery({
    queryKey: ['clubs', currentSuburb],
    queryFn: async () => {
      console.log('Fetching clubs from Supabase for suburb:', currentSuburb);
      
      // First try to get clubs from Clublist_Australia
      let { data: australiaData, error: australiaError } = await supabase
        .from('Clublist_Australia')
        .select('*')
        .eq('area', currentSuburb);
      
      if (australiaError) {
        console.error('Supabase error:', australiaError);
        throw australiaError;
      }

      // Then get user added venues for the same suburb
      const { data: userAddedData, error: userAddedError } = await supabase
        .from('user_added_venues')
        .select('*')
        .eq('area', currentSuburb);

      if (userAddedError) {
        console.error('Supabase error:', userAddedError);
        throw userAddedError;
      }

      // Combine both datasets
      const combinedData = [
        ...(australiaData || []),
        ...(userAddedData || []).map(venue => ({
          ...venue,
          isUserAdded: true
        }))
      ];
      
      console.log('Combined Supabase response:', combinedData);
      return transformClubData(combinedData || []);
    }
  });
};