export interface Store {
  id: string;
  name: string;
  address: string;
  hours: string;
  lat: number;
  lng: number;
  price: number;
  purity: number;
  style: string;
  thickness: string;
  length: string;
  rating: number;
  numReviews: number;
  color: string;
}

export interface StoreSchedule {
  start: Date;
  end: Date;
}

export interface StoreStatus {
  isOpen: boolean;
  nextChange: string;
}

export interface ParsedHours {
  [key: string]: string;
}

export function parseStoreHours(hours: string): ParsedHours {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hoursMap: { [key: string]: string } = {};
  
  // Initialize all days as Closed
  days.forEach(day => {
    hoursMap[day] = 'Closed';
  });

  // Match patterns like "Mon-Sat: 10AM-6PM" or "Sun: Closed"
  const rangeRegex = /([a-zA-Z]{3})-([a-zA-Z]{3}):\s*((?:\d+(?::\d+)?[AP]M-\d+(?::\d+)?[AP]M)|Closed)/g;
  const singleRegex = /([a-zA-Z]{3}):\s*((?:\d+(?::\d+)?[AP]M-\d+(?::\d+)?[AP]M)|Closed)/g;

  let match;
  while ((match = rangeRegex.exec(hours)) !== null) {
    const [_, startDay, endDay, timeRange] = match;
    const startIdx = days.indexOf(startDay);
    const endIdx = days.indexOf(endDay);
    
    if (startIdx !== -1 && endIdx !== -1) {
      const dayIndices = startIdx <= endIdx 
        ? Array.from({ length: endIdx - startIdx + 1 }, (_, i) => startIdx + i)
        : [...Array.from({ length: days.length - startIdx }, (_, i) => startIdx + i), 
           ...Array.from({ length: endIdx + 1 }, (_, i) => i)];
      
      dayIndices.forEach(idx => {
        hoursMap[days[idx]] = timeRange;
      });
    }
  }

  hours.replace(rangeRegex, '');
  while ((match = singleRegex.exec(hours)) !== null) {
    const [_, day, timeRange] = match;
    if (days.includes(day)) {
      hoursMap[day] = timeRange;
    }
  }

  return hoursMap;
}

// Sample store data
export const stores: Store[] = [
  {
    id: '1',
    name: "Gold & Diamond District",
    address: "47 W 47th St, New York, NY 10036",
    hours: "Mon-Sat: 10AM-6PM, Sun: Closed",
    lat: 40.7128,
    lng: -74.006,
    price: 1299.99,
    purity: 18,
    style: "Cable",
    thickness: "2 mm",
    length: "20 in",
    rating: 4.5,
    numReviews: 128,
    color: "Yellow",
  },
  {
    id: '2',
    name: "Empire Gold Exchange",
    address: "152 W 34th St, New York, NY 10001",
    hours: "Mon-Fri: 9AM-7PM, Sat: 10AM-6PM, Sun: 11AM-5PM",
    lat: 40.7505,
    lng: -73.9934,
    price: 2499.99,
    purity: 14,
    style: "Miami Cuban",
    thickness: "4 mm",
    length: "24 in",
    rating: 4.2,
    numReviews: 86,
    color: "Rose",
  },
  {
    id: '3',
    name: "Royal Gold & Jewelry",
    address: "28 E 23rd St, New York, NY 10010",
    hours: "Mon-Sat: 11AM-8PM, Sun: Closed",
    lat: 40.7410,
    lng: -73.9867,
    price: 1899.99,
    purity: 22,
    style: "Franco",
    thickness: "3 mm",
    length: "18 in",
    rating: 4.8,
    numReviews: 234,
    color: "Two-Color",
  }
];

export async function fetchStores(): Promise<Store[]> {
  // This will be replaced with actual API call in the future
  return stores;
}

export function getStoreStatus(hours: string): StoreStatus {
  // Get current EST time
  const now = new Date();
  const currentTime = now.toLocaleString('en-US', { 
    timeZone: 'America/New_York', 
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: false 
  });

  // Parse store hours
  const hoursRegex = /([a-zA-Z]+)-([a-zA-Z]+):\s*(\d+(?::\d+)?[AP]M)-(\d+(?::\d+)?[AP]M)/g;
  let schedule: StoreSchedule[] = [];
  
  let match;
  while ((match = hoursRegex.exec(hours)) !== null) {
    const [_, startDay, endDay, startTime, endTime] = match;
    const startHour = parseInt(startTime.replace(/[APM]/g, ''));
    const endHour = parseInt(endTime.replace(/[APM]/g, ''));
    
    const start = new Date();
    start.setHours(startTime.includes('PM') ? startHour + 12 : startHour, 0);
    const end = new Date();
    end.setHours(endTime.includes('PM') ? endHour + 12 : endHour, 0);
    
    schedule.push({ start, end });
  }

  // Check if currently open
  const currentHour = parseInt(currentTime.split(':')[0]);
  const isOpen = schedule.some(({ start, end }) => 
    currentHour >= start.getHours() && currentHour < end.getHours()
  );

  // Find next change time
  let nextChange = '';
  if (isOpen) {
    const closing = schedule.find(({ end }) => currentHour < end.getHours());
    if (closing) {
      nextChange = `Closes at ${closing.end.toLocaleString('en-US', { 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true 
      })}`;
    }
  } else {
    nextChange = 'Currently Closed';
  }

  return { isOpen, nextChange };
}

export const CHAIN_TYPES = [
  { id: '', name: 'ALL TYPES', image: '/chaindisplay/all-chains.png' },
  { id: 'Anchor', name: 'ANCHOR', image: '/chaindisplay/anchor.png' },
  { id: 'Ball', name: 'BALL', image: '/chaindisplay/ball.png' },
  { id: 'Box', name: 'BOX', image: '/chaindisplay/box.png' },
  { id: 'Byzantine', name: 'BYZANTINE', image: '/chaindisplay/byzantine.png' },
  { id: 'Cable', name: 'CABLE', image: '/chaindisplay/cable.png' },
  { id: 'Figaro', name: 'FIGARO', image: '/chaindisplay/figaro.png' },
  { id: 'Figarope', name: 'FIGAROPE', image: '/chaindisplay/figarope.png' },
  { id: 'FlatCurb', name: 'FLAT CURB', image: '/chaindisplay/flat-curb.png' },
  { id: 'Franco', name: 'FRANCO', image: '/chaindisplay/franco.png' },
  { id: 'Herringbone', name: 'HERRINGBONE', image: '/chaindisplay/herringbone.png' },
  { id: 'Mariner', name: 'MARINER', image: '/chaindisplay/mariner.png' },
  { id: 'MiamiCuban', name: 'MIAMI CUBAN', image: '/chaindisplay/miami-cuban.png' },
  { id: 'MoonCut', name: 'MOON CUT', image: '/chaindisplay/moon-cut.png' },
  { id: 'Rope', name: 'ROPE', image: '/chaindisplay/rope.png' },
  { id: 'Wheat', name: 'WHEAT', image: '/chaindisplay/wheat.png' }
];

export const CHAIN_COLORS = [
  { id: '', name: 'ALL COLORS', color: 'linear-gradient(45deg, #FFD700, #FFA500, #FFFFFF)' },
  { id: 'Yellow', name: 'YELLOW GOLD', color: '#FFD700' },
  { id: 'Rose', name: 'ROSE GOLD', color: '#B76E79' },
  { id: 'White', name: 'WHITE GOLD', color: '#E8E8E8' },
  { id: 'Two-Color', name: 'TWO-TONE', color: 'linear-gradient(45deg, #FFD700 50%, #E8E8E8 50%)' },
  { id: 'Tri-Color', name: 'TRI-COLOR', color: 'linear-gradient(45deg, #FFD700 33%, #B76E79 33% 66%, #E8E8E8 66%)' }
];

export const GOLD_PURITIES = [
  { value: '', label: 'All Purities' },
  { value: '10', label: '10K Gold' },
  { value: '14', label: '14K Gold' },
  { value: '18', label: '18K Gold' },
  { value: '22', label: '22K Gold' },
  { value: '24', label: '24K Pure Gold' }
];

export const getFormattedProductName = (store: Store) => {
  return `${store.purity}K ${store.color} Gold ${store.style} Chain • ${store.thickness} & ${store.length}`.trim();
};