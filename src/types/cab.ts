export interface CabDetails {
  id: string;
  vehicle: {
    model: string;
    category: string;
    registrationNumber: string;
    hasAC: boolean;
    baseLocation: string;
    destinations: string[];
    seatingCapacity: number;
    luggageCapacity: string;
    pricePerKm: number;
  };
  agency?: {
    id: string;
    name: string;
  };
  drivers: Array<{
    id: string;
    name: string;
    phone: string;
    isAvailable: boolean;
  }>;
} 