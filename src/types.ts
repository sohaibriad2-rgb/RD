export type Currency = 'USD' | 'EUR' | 'GBP' | 'AED';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  rate: number; // relative to USD
}

export type MediumType = 
  | 'Oil on Archival Canvas'
  | 'Acrylic & Mixed Media'
  | 'Charcoal & Gold Leaf on Paper'
  | 'Limited Edition Fine Art Print'
  | 'Bronze & Raw Pigment'
  | 'Textile & Natural Pigments'
  | 'Impasto Oil & Bronze Powder on Linen'
  | 'Fluid Impasto Oil & 24K Gold Leaf'
  | 'Impasto Oil & Mineral Pigments on Canvas'
  | 'Heavy Palette Knife Oil on Linen'
  | 'Heavy Oil Impasto & Mineral Pigments'
  | '24K Gold Leaf & Natural Mineral Wash'
  | string;

export type SizeCategory = 'Small (under 60cm)' | 'Medium (60 - 120cm)' | 'Large (120 - 200cm)' | 'Grand Format (200cm+)';

export interface Artist {
  id: string;
  name: string;
  location: string;
  specialty: string;
  bio: string;
  philosophy: string;
  portraitUrl: string;
  selectedExhibitions: string[];
}

export interface Artwork {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  year: number;
  medium: MediumType;
  dimensions: string;
  sizeCategory: SizeCategory;
  priceUSD: number;
  isAvailable: boolean;
  editionInfo: string; // e.g. "Original 1 of 1" or "Limited Edition 3/15"
  story: string;
  provenance: string;
  tags: string[];
  colorPalette: string[];
  primaryImage: string;
  detailImages: string[];
  certificateIncluded: boolean;
  isFeatured?: boolean;
}

export interface FilterState {
  medium: string;
  size: string;
  priceMin: number;
  priceMax: number;
  availability: 'all' | 'available' | 'acquired';
  searchQuery: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'year-desc' | 'title';
}

export interface CartItem {
  artwork: Artwork;
  editionType: 'original' | 'limited_print';
  quantity: number;
  customFraming?: string;
}

export type PageView = 
  | 'home' 
  | 'gallery' 
  | 'artwork_detail' 
  | 'artists' 
  | 'artist_detail' 
  | 'about' 
  | 'contact' 
  | 'checkout';

export interface EnquiryForm {
  artworkId?: string;
  artTitle?: string;
  name: string;
  email: string;
  phone: string;
  type: 'private_viewing' | 'price_inquiry' | 'commission' | 'advisory';
  message: string;
  preferredDate?: string;
  locationPreference?: 'Casablanca Gallery' | 'Agadir Gallery' | 'Virtual Advisory' | 'Private Residence';
}
