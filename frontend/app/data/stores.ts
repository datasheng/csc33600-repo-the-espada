// --------------------
// Interfaces
// --------------------

export interface Store {
  storeID: number;      // Matches INT AUTO_INCREMENT PRIMARY KEY
  ownerID: number;      // Matches INT NOT NULL
  store_name: string;   // Matches VARCHAR(50) NOT NULL
  rating: number;       // Matches DECIMAL(3,2)
  rating_count: number; // Changed from ratingCount
  address: string;      // Matches TEXT NOT NULL
  latitude: number;     // Matches DECIMAL(10,7) NOT NULL
  longitude: number;    // Matches DECIMAL(10,7) NOT NULL
  phone: string;        // Matches VARCHAR(20)
  email: string;        // Matches VARCHAR(100)
}

export interface Product {
  productID: number;        // Changed from productId to match database
  storeID: number;         // Changed from storeId to match database
  chain_type: string;      // Already matches
  chain_purity: string;    // Already matches
  chain_thickness: number; // Already matches
  chain_length: number;    // Already matches
  chain_color: string;     // Already matches
  chain_weight: number;    // Already matches
  set_price: number;       // Already matches
}

export interface StoreHours {
  storeHourID: number;  // Added to match database
  storeID: number;      // Added to match database
  daysOpen: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';  // Changed from 'day'
  openTime: string;     // Matches TIME
  closeTime: string;    // Matches TIME
}

export interface StoreStatus {
  isOpen: boolean;
  nextChange: string;
}

export interface PriceHistory {
  full_name: string;
  latest_price: number;
  purchase_date: string;
}

export interface RatingDistribution {
  [key: number]: number;  // Add index signature
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
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

export const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 
  'Friday', 'Saturday', 'Sunday'
] as const;

// --------------------
// Functions
// --------------------

export const getFormattedProductName = (product: Product): string => {
  return `${product.chain_purity} ${product.chain_color} Gold ${product.chain_type} Chain • ${product.chain_thickness} mm & ${product.chain_length} in`.trim();
};

export const getStoreStatus = (hours: StoreHours[]): StoreStatus => {
  const now = new Date();
  const day = now.toLocaleString('en-US', { weekday: 'long' });
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Updated to use daysOpen instead of day
  const todayHours = hours.find(h => h.daysOpen === day);

  // If this day isn't listed in hours or times are 'CLOSED', store is closed
  if (!todayHours || todayHours.openTime === 'CLOSED' || todayHours.closeTime === 'CLOSED') {
    return { isOpen: false, nextChange: 'Closed on ' + day };
  }

  const openTime = parseTimeString(todayHours.openTime);
  const closeTime = parseTimeString(todayHours.closeTime);
  const currentTime = currentHour * 60 + currentMinute;

  const isOpen = currentTime >= openTime && currentTime < closeTime;
  const nextChange = isOpen 
    ? `Closes at ${todayHours.closeTime}` 
    : currentTime < openTime 
      ? `Opens at ${todayHours.openTime}`
      : 'Currently Closed';

  return { isOpen, nextChange };
};

// Helper function to parse time strings
const parseTimeString = (timeStr: string): number => {
  if (timeStr === 'CLOSED') return -1;
  
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

export async function fetchStores(): Promise<Store[]> {
  try {
    const response = await fetch('http://localhost:5000/api/stores');
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch stores');
    }
    
    const stores = await response.json();
    return stores.map((store: any) => ({
      storeID: parseInt(store.storeID),
      ownerID: parseInt(store.ownerID),
      store_name: store.store_name,
      rating: parseFloat(store.rating),
      rating_count: parseInt(store.rating_count),
      address: store.address,
      latitude: parseFloat(store.latitude),
      longitude: parseFloat(store.longitude),
      phone: store.phone,
      email: store.email
    }));
  } catch (error) {
    console.error('Error fetching stores:', error);
    throw error;
  }
}

export async function fetchStoreHours(storeID: number): Promise<StoreHours[]> {
  try {
    // Change from store-hours to stores/[id]/hours to match backend route
    const response = await fetch(`http://localhost:5000/api/stores/${storeID}/hours`);
    if (!response.ok) throw new Error('Failed to fetch store hours');
    
    const hours = await response.json();
    return hours.map((hour: any) => ({
      storeHourID: hour.storeHourID,
      storeID: hour.storeID,
      daysOpen: hour.daysOpen,
      openTime: hour.openTime,
      closeTime: hour.closeTime
    }));
  } catch (error) {
    console.error('Error fetching store hours:', error);
    return [];
  }
}

export async function fetchProducts(storeID?: number): Promise<Product[]> {
  try {
    const url = storeID 
      ? `http://localhost:5000/api/products?storeID=${storeID}`
      : 'http://localhost:5000/api/products';
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch products');
    }
    
    const products = await response.json();
    return products.map((product: any) => ({
      productID: parseInt(product.productID),
      storeID: parseInt(product.storeID),
      chain_type: product.chain_type,
      chain_purity: product.chain_purity,
      chain_thickness: parseFloat(product.chain_thickness),
      chain_length: parseFloat(product.chain_length),
      chain_color: product.chain_color,
      chain_weight: parseFloat(product.chain_weight),
      set_price: parseFloat(product.set_price)
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; // Re-throw to handle in components
  }
}

export async function submitRating(
  storeID: number, 
  productID: number, 
  userID: number, 
  rating: number
): Promise<void> {
  try {
    const response = await fetch(`http://localhost:5000/api/ratings/${storeID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userID,
        productID,
        rating
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit rating');
    }
  } catch (error) {
    console.error('Error submitting rating:', error);
    throw error;
  }
}

export async function fetchUserRating(storeID: number, userID: number): Promise<number> {
  try {
    const url = `http://localhost:5000/api/ratings/${storeID}/user/${userID}`;
    console.log('🔍 [fetchUserRating] Making request:', { storeID, userID, url });
    
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    });

    console.log('📥 [fetchUserRating] Response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('📦 [fetchUserRating] Response data:', data);
    
    if (typeof data.rating !== 'number') {
      return 0;
    }

    return data.rating;
  } catch (error) {
    console.error('❌ [fetchUserRating] Error:', error);
    return 0;
  }
}

export async function fetchPriceHistory(productID: number): Promise<PriceHistory[]> {
  try {
    const response = await fetch(`http://localhost:5000/api/products/${productID}`);
    if (!response.ok) {
      throw new Error('Failed to fetch price history');
    }
    const data = await response.json();
    return data.purchases || [];
  } catch (error) {
    console.error('Error fetching price history:', error);
    return [];
  }
}

export async function fetchRatingDistribution(storeID: number): Promise<RatingDistribution> {
  try {
    const response = await fetch(`http://localhost:5000/api/ratings/${storeID}/distribution`);
    if (!response.ok) {
      throw new Error('Failed to fetch rating distribution');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching rating distribution:', error);
    return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  }
}