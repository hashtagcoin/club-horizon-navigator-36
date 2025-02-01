import { mapStyles } from './mapStyles';

export const defaultMapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  gestureHandling: 'greedy' as const,
  streetViewControl: false,
  mapTypeControl: false,
  styles: mapStyles,
};