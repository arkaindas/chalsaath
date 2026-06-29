import { Timestamp } from 'firebase/firestore';

export interface Route {
  id: string;
  cityId: string;
  from: string;
  to: string;
  fromHi: string;
  toHi: string;
  status: 'approved' | 'pending' | 'rejected';
  submittedBy: string | null;
  submittedByName: string | null;
  distance: string;
  estimatedTime: string;
  suggestedFareMin: number;
  suggestedFareMax: number;
  isActive: boolean;
  rideCount: number;
  pairId?: string;
  createdAt: Timestamp;
}
