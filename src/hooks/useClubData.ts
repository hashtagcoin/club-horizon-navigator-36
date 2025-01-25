import { useQuery } from "@tanstack/react-query";
import { Club } from "@/types/club";

export const useClubData = (currentCity?: string) => {
  return useQuery({
    queryKey: ['clubs', currentCity],
    queryFn: async () => {
      // Return empty array since we removed the database connection
      return [] as Club[];
    }
  });
};