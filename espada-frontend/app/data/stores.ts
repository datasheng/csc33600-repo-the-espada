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
  productId: string;
  storeId: string;
  price: number;
  purity: number;
  style: string;
  thickness: string;
  length: string;
  color: string;
  weight: number;
  productUrl?: string;  // Optional URL for online product listing
}

export interface StoreHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
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
      { day: 'Monday', open: '10:00 AM', close: '6:00 PM', isClosed: false },
      { day: 'Tuesday', open: '10:00 AM', close: '6:00 PM', isClosed: false },
      { day: 'Wednesday', open: '10:00 AM', close: '6:00 PM', isClosed: false },
      { day: 'Thursday', open: '10:00 AM', close: '6:00 PM', isClosed: false },
      { day: 'Friday', open: '10:00 AM', close: '6:00 PM', isClosed: false },
      { day: 'Saturday', open: '10:00 AM', close: '6:00 PM', isClosed: false },
      { day: 'Sunday', open: '', close: '', isClosed: true }
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
      { day: 'Monday', open: '9:00 AM', close: '7:00 PM', isClosed: false },
      { day: 'Tuesday', open: '9:00 AM', close: '7:00 PM', isClosed: false },
      { day: 'Wednesday', open: '9:00 AM', close: '7:00 PM', isClosed: false },
      { day: 'Thursday', open: '9:00 AM', close: '7:00 PM', isClosed: false },
      { day: 'Friday', open: '9:00 AM', close: '7:00 PM', isClosed: false },
      { day: 'Saturday', open: '10:00 AM', close: '6:00 PM', isClosed: false },
      { day: 'Sunday', open: '11:00 AM', close: '5:00 PM', isClosed: false }
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
      { day: 'Monday', open: '11:00 AM', close: '8:00 PM', isClosed: false },
      { day: 'Tuesday', open: '11:00 AM', close: '8:00 PM', isClosed: false },
      { day: 'Wednesday', open: '11:00 AM', close: '8:00 PM', isClosed: false },
      { day: 'Thursday', open: '11:00 AM', close: '8:00 PM', isClosed: false },
      { day: 'Friday', open: '11:00 AM', close: '8:00 PM', isClosed: false },
      { day: 'Saturday', open: '11:00 AM', close: '8:00 PM', isClosed: false },
      { day: 'Sunday', open: '', close: '', isClosed: true }
    ]
  }
];

export const products: Product[] = [
  // Store 1 Products (Gold & Diamond District)
  {
    productId: '1',
    storeId: '1',
    price: 1299.99,
    purity: 18,
    style: "Cable",
    thickness: "2 mm",
    length: "20 in",
    color: "Yellow",
    weight: 12.5
  },
  {
    productId: '4',
    storeId: '1',
    price: 899.99,
    purity: 14,
    style: "Rope",
    thickness: "2.5 mm",
    length: "22 in",
    color: "White",
    weight: 15.8
  },
  {
    productId: '5',
    storeId: '1',
    price: 2199.99,
    purity: 22,
    style: "Byzantine",
    thickness: "3.5 mm",
    length: "24 in",
    color: "Yellow",
    weight: 20.3
  },

  // Store 2 Products (Empire Gold Exchange)
  {
    productId: '2',
    storeId: '2',
    price: 2499.99,
    purity: 14,
    style: "Miami Cuban",
    thickness: "4 mm",
    length: "24 in",
    color: "Rose",
    weight: 25.7,
    productUrl: "https://empiregoldexchange.com/products/miami-cuban-rose-gold"
  },
  {
    productId: '6',
    storeId: '2',
    price: 1599.99,
    purity: 18,
    style: "Franco",
    thickness: "3 mm",
    length: "20 in",
    color: "Two-Color",
    weight: 18.2
  },
  {
    productId: '7',
    storeId: '2',
    price: 3499.99,
    purity: 22,
    style: "Box",
    thickness: "5 mm",
    length: "26 in",
    color: "Yellow",
    weight: 30.5
  },

  // Store 3 Products (Royal Gold & Jewelry)
  {
    productId: '3',
    storeId: '3',
    price: 1899.99,
    purity: 22,
    style: "Franco",
    thickness: "3 mm",
    length: "18 in",
    color: "Two-Color",
    weight: 17.4,
    productUrl: "https://royalgoldnyc.com/products/franco-two-tone-chain"
  },
  {
    productId: '8',
    storeId: '3',
    price: 799.99,
    purity: 10,
    style: "Figaro",
    thickness: "2 mm",
    length: "20 in",
    color: "Yellow",
    weight: 10.1
  },
  {
    productId: '9',
    storeId: '3',
    price: 2899.99,
    purity: 24,
    style: "Mariner",
    thickness: "4 mm",
    length: "22 in",
    color: "Rose",
    weight: 27.8
  },

  // Additional products for Store 3 (Royal Gold & Jewelry)
  {
    productId: '10',
    storeId: '3',
    price: 1499.99,
    purity: 18,
    style: "Herringbone",
    thickness: "3 mm",
    length: "20 in",
    color: "White",
    weight: 16.3
  },
  {
    productId: '11',
    storeId: '3',
    price: 2299.99,
    purity: 14,
    style: "Miami Cuban",
    thickness: "4.5 mm",
    length: "24 in",
    color: "Two-Color",
    weight: 28.4
  }
];

// --------------------
// Functions
// --------------------

export const getFormattedProductName = (product: Product): string => {
  return `${product.purity}K ${product.color} Gold ${product.style} Chain • ${product.thickness} & ${product.length}`.trim();
};

export const getStoreStatus = (hours: StoreHours[]): StoreStatus => {
  const now = new Date();
  const day = now.toLocaleString('en-US', { weekday: 'long' });
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const todayHours = hours.find(h => h.day === day);
  if (!todayHours || todayHours.isClosed) {
    return { isOpen: false, nextChange: 'Currently Closed' };
  }

  const openTime = parseTimeString(todayHours.open);
  const closeTime = parseTimeString(todayHours.close);
  const currentTime = currentHour * 60 + currentMinute;

  const isOpen = currentTime >= openTime && currentTime < closeTime;
  const nextChange = isOpen 
    ? `Closes at ${todayHours.close}` 
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