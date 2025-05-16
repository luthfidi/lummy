export type EventStatus = "available" | "limited" | "soldout";

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  available: number;
  maxPerPurchase: number;
  benefits?: string[];
}

export interface Organizer {
  id: string;
  name: string;
  imageUrl?: string;
  verified: boolean;
  description?: string;
  website?: string;
  eventsHosted?: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  venue?: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
  bannerUrl?: string;
  price: number;
  currency: string;
  category: string;
  status: EventStatus;
  organizer: Organizer;
  ticketsAvailable: number;
  ticketTiers?: TicketTier[];
  tags?: string[];
}
