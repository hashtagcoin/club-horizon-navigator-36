export type TrafficLevel = 'Low' | 'Medium' | 'High';

export interface Club {
  id: number;
  name: string;
  address: string;
  position: {
    lat: number;
    lng: number;
  };
  traffic: TrafficLevel;
  openingHours: {
    [key: string]: string;
  };
  genre: string;
  usersAtClub: number;
  hasSpecial: boolean;
  isUserAdded?: boolean;
}

export interface Event {
  id: number;
  title: string;
  image: string;
  description: string;
  date: string;
  price: string;
}

export interface ChatMessage {
  sender: string;
  text: string;
  timestamp: number;
  clubId: number | string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
}

export interface ChatMessages {
  [key: string | number]: ChatMessage[];
  general: ChatMessage[];
}