import { ClubProvider } from '@/contexts/ClubContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { MainLayout } from './layout/MainLayout';
import { useClubData } from '@/hooks/useClubData';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';

const libraries: Libraries = ['places', 'geometry'];

export default function ClubPilot() {
  const { data: clubs = [], isLoading: isLoadingClubs } = useClubData();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyC6Z3hNhhdT0Fqy_AXYl07JBRczMiTg8_0",
    libraries
  });

  return (
    <ClubProvider>
      <LocationProvider>
        <MainLayout
          clubs={clubs}
          isLoading={isLoadingClubs}
          isLoaded={isLoaded}
        />
      </LocationProvider>
    </ClubProvider>
  );
}