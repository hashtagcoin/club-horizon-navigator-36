export interface Club {
  id: number;
  name: string;
  address: string;
  traffic: "Low" | "Medium" | "High";
  openingHours: {
    [key: string]: string;
  };
  position: {
    lat: number;
    lng: number;
  };
  usersAtClub: number;
  hasSpecial: boolean;
  genre: string;
  isUserAdded?: boolean;
}

export interface ChatMessage {
  sender: string;
  text: string;
  timestamp: number;
  clubId: number | 'general';
}

export interface ChatMessages {
  [key: string | number]: ChatMessage[];
  general?: ChatMessage[];
}