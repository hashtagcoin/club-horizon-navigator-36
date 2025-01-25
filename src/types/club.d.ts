export interface Club {
  id: number;
  name: string;
  address: string;
  position: {
    lat: number;
    lng: number;
  };
  traffic: 'Low' | 'Medium' | 'High';
  openingHours: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
  genre: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
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