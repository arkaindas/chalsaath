import { Timestamp } from 'firebase/firestore';

export interface City {
  id: string;
  name: string;
  nameHi: string;
  state: string;
  isActive: boolean;
  adminUids: string[];
  totalRides: number;
  createdAt: Timestamp;
}
