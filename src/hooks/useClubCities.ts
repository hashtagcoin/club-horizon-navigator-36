import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useClubCities = () => {
  return useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      console.log('Fetching cities from Supabase...');
      const { data, error } = await supabase
        .rpc('get_unique_cities');

      if (error) {
        console.error('Error fetching cities:', error);
        throw error;
      }

      // Transform the data to be an array of strings
      const cities = data.map((item: { city: string }) => item.city);
      console.log('Fetched cities:', cities);
      return cities;
    }
  });
};