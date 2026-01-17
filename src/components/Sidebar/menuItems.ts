import { Description, Group, Dashboard, Flight, EventNote } from '@mui/icons-material';

export const menuItems = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: Dashboard
  },
  {
    title: 'Bookings',
    path: '/booking',
    icon: Flight
  },
  {
    title: 'Itinerary',
    path: '/itinerary',
    icon: Description
  },
  // ... other menu items
]; 