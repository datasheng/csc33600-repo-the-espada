// --------------------
// Interfaces
// --------------------

export interface Store {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  numReviews: number;
  hours: StoreHours[];
  phone: string;
  email: string;
  website?: string;
}

export interface Product {
  productId: number;  // Changed from string to INTEGER
  storeId: string;
  set_price: number;  // Changed from price to set_price
  chain_purity: string;  // Changed from purity (number) to chain_purity (string)
  chain_type: string;  // Changed from style to chain_type
  chain_thickness: number;  // Changed from string to DECIMAL
  chain_length: number;  // Changed from string to DECIMAL
  chain_color: string;  // Changed from color to chain_color
  chain_weight: number;  // Changed from weight to chain_weight
}

export interface StoreHours {
  day: string;
  openTime: string;    // Changed from 'open'
  closeTime: string;   // Changed from 'close'
}

export interface StoreStatus {
  isOpen: boolean;
  nextChange: string;
}

// --------------------
// Constants
// --------------------

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

// --------------------
// Sample Data
// --------------------

export const stores: Store[] = [
  {
    id: '1',
    name: "Gold & Diamond District",
    address: "47 W 47th St, New York, NY 10036",
    lat: 40.7128,
    lng: -74.006,
    rating: 4.5,
    numReviews: 128,
    phone: "(212) 555-0123",
    email: "info@golddiamonddistrict.com",
    hours: [
      { day: 'Monday', openTime: '10:00 AM', closeTime: '6:00 PM' },
      { day: 'Tuesday', openTime: '10:00 AM', closeTime: '6:00 PM' },
      { day: 'Wednesday', openTime: '10:00 AM', closeTime: '6:00 PM' },
      { day: 'Thursday', openTime: '10:00 AM', closeTime: '6:00 PM' },
      { day: 'Friday', openTime: '10:00 AM', closeTime: '6:00 PM' },
      { day: 'Saturday', openTime: '10:00 AM', closeTime: '6:00 PM' }
    ]
  },
  {
    id: '2',
    name: "Empire Gold Exchange",
    address: "152 W 34th St, New York, NY 10001",
    lat: 40.7505,
    lng: -73.9934,
    rating: 4.2,
    numReviews: 86,
    phone: "(212) 555-0456",
    email: "sales@empiregoldexchange.com",
    website: "https://empiregoldexchange.com",
    hours: [
      { day: 'Monday', openTime: '9:00 AM', closeTime: '7:00 PM' },
      { day: 'Tuesday', openTime: '9:00 AM', closeTime: '7:00 PM' },
      { day: 'Wednesday', openTime: '9:00 AM', closeTime: '7:00 PM' },
      { day: 'Thursday', openTime: '9:00 AM', closeTime: '7:00 PM' },
      { day: 'Friday', openTime: '9:00 AM', closeTime: '7:00 PM' },
      { day: 'Saturday', openTime: '10:00 AM', closeTime: '6:00 PM' },
      { day: 'Sunday', openTime: '11:00 AM', closeTime: '5:00 PM' }
    ]
  },
  {
    id: '3',
    name: "Royal Gold & Jewelry",
    address: "28 E 23rd St, New York, NY 10010",
    lat: 40.7410,
    lng: -73.9867,
    rating: 4.8,
    numReviews: 234,
    phone: "(212) 555-0789",
    email: "info@royalgoldnyc.com",
    website: "https://royalgoldnyc.com",
    hours: [
      { day: 'Monday', openTime: '11:00 AM', closeTime: '8:00 PM' },
      { day: 'Tuesday', openTime: '11:00 AM', closeTime: '8:00 PM' },
      { day: 'Wednesday', openTime: '11:00 AM', closeTime: '8:00 PM' },
      { day: 'Thursday', openTime: '11:00 AM', closeTime: '8:00 PM' },
      { day: 'Friday', openTime: '11:00 AM', closeTime: '8:00 PM' },
      { day: 'Saturday', openTime: '11:00 AM', closeTime: '8:00 PM' },
    ]
  }
];

export const products: Product[] = [
  // Store 1 Products (Gold & Diamond District)
  {
    productId: 1,
    storeId: '1',
    set_price: 1299.99,
    chain_purity: "18K",
    chain_type: "Cable",
    chain_thickness: 2,
    chain_length: 20,
    chain_color: "Yellow",
    chain_weight: 12.5
  },
  {
    productId: 4,
    storeId: '1',
    set_price: 899.99,
    chain_purity: "14K",
    chain_type: "Rope",
    chain_thickness: 2.5,
    chain_length: 22,
    chain_color: "White",
    chain_weight: 15.8
  },
  {
    productId: 5,
    storeId: '1',
    set_price: 2199.99,
    chain_purity: "22K",
    chain_type: "Byzantine",
    chain_thickness: 3.5,
    chain_length: 24,
    chain_color: "Yellow",
    chain_weight: 20.3
  },

  // Store 2 Products (Empire Gold Exchange)
  {
    productId: 2,
    storeId: '2',
    set_price: 2499.99,
    chain_purity: "14K",
    chain_type: "Miami Cuban",
    chain_thickness: 4,
    chain_length: 24,
    chain_color: "Rose",
    chain_weight: 25.7
  },
  {
    productId: 6,
    storeId: '2',
    set_price: 1599.99,
    chain_purity: "18K",
    chain_type: "Franco",
    chain_thickness: 3,
    chain_length: 20,
    chain_color: "Two-Color",
    chain_weight: 18.2
  },
  {
    productId: 7,
    storeId: '2',
    set_price: 3499.99,
    chain_purity: "22K",
    chain_type: "Box",
    chain_thickness: 5,
    chain_length: 26,
    chain_color: "Yellow",
    chain_weight: 30.5
  },

  // Store 3 Products (Royal Gold & Jewelry)
  {
    productId: 3,
    storeId: '3',
    set_price: 1899.99,
    chain_purity: "22K",
    chain_type: "Franco",
    chain_thickness: 3,
    chain_length: 18,
    chain_color: "Two-Color",
    chain_weight: 17.4
  },
  {
    productId: 8,
    storeId: '3',
    set_price: 799.99,
    chain_purity: "10K",
    chain_type: "Figaro",
    chain_thickness: 2,
    chain_length: 20,
    chain_color: "Yellow",
    chain_weight: 10.1
  },
  {
    productId: 9,
    storeId: '3',
    set_price: 2899.99,
    chain_purity: "24K",
    chain_type: "Mariner",
    chain_thickness: 4,
    chain_length: 22,
    chain_color: "Rose",
    chain_weight: 27.8
  },

  // Additional products for Store 3 (Royal Gold & Jewelry)
  {
    productId: 10,
    storeId: '3',
    set_price: 1499.99,
    chain_purity: "18K",
    chain_type: "Herringbone",
    chain_thickness: 3,
    chain_length: 20,
    chain_color: "White",
    chain_weight: 16.3
  },
  {
    productId: 11,
    storeId: '3',
    set_price: 2299.99,
    chain_purity: "14K",
    chain_type: "Miami Cuban",
    chain_thickness: 4.5,
    chain_length: 24,
    chain_color: "Two-Color",
    chain_weight: 28.4
  }
];

// --------------------
// Functions
// --------------------

export const getFormattedProductName = (product: Product): string => {
  return `${product.chain_purity} ${product.chain_color} Gold ${product.chain_type} Chain • ${product.chain_thickness}mm & ${product.chain_length}in`.trim();
};

export const getStoreStatus = (hours: StoreHours[]): StoreStatus => {
  const now = new Date();
  const day = now.toLocaleString('en-US', { weekday: 'long' });
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Find if the current day exists in store hours
  const todayHours = hours.find(h => h.day === day);

  // If this day isn't listed in hours, store is closed
  if (!todayHours) {
    return { isOpen: false, nextChange: 'Closed on ' + day };
  }

  const openTime = parseTimeString(todayHours.openTime);
  const closeTime = parseTimeString(todayHours.closeTime);
  const currentTime = currentHour * 60 + currentMinute;

  const isOpen = currentTime >= openTime && currentTime < closeTime;
  const nextChange = isOpen 
    ? `Closes at ${todayHours.closeTime}` 
    : 'Currently Closed';

  return { isOpen, nextChange };
};

// Helper function to parse time strings
const parseTimeString = (timeStr: string): number => {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

export async function fetchStores(): Promise<Store[]> {
  // Will be replaced with actual API call
  return stores;
}

export async function fetchProducts(storeId?: string): Promise<Product[]> {
  // Will be replaced with actual API call
  return storeId 
    ? products.filter(p => p.storeId === storeId)
    : products;
}