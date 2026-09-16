export interface WeddingSite {
  id: number;
  slug: string;
  partner1: string;
  partner2: string;
  wedding_date: string;
  venue: string;
  city: string;
  style: string;
  phase: string;
  typography: string;
  accent_color: string;
  button_style: string;
  shape: string;
  layout: string;
  animation_level: string;
  hero_photo: string;
  hero_title: string;
  hero_subtitle: string;
  story_title: string;
  story_text: string;
  story_photo: string;
  announcement: string;
  contact_email: string;
  contact_phone: string;
  published: boolean;
  created_at?: string;
}

export interface SiteSection {
  id: number;
  site_id: number;
  section_key: string;
  title: string;
  visible: boolean;
  position: number;
  settings?: Record<string, unknown> | null;
}

export interface ProgrammeEvent {
  id: number;
  site_id: number;
  event_time: string;
  title: string;
  description: string;
  place: string;
  icon: string;
  position: number;
}

export interface InfoPratique {
  id: number;
  site_id: number;
  category: string;
  title: string;
  detail: string;
  event_time: string;
  link_label: string;
  position: number;
}

export interface GalleryPhoto {
  id: number;
  site_id: number;
  url: string;
  caption: string;
  position: number;
  is_private: boolean;
}

export interface Faq {
  id: number;
  site_id: number;
  question: string;
  answer: string;
  position: number;
}

export interface RsvpEvent {
  id: number;
  site_id: number;
  name: string;
  description: string;
  position: number;
}

export interface RsvpResponse {
  id: number;
  site_id: number;
  first_name: string;
  last_name: string;
  email: string;
  attending: boolean;
  guests_count: number;
  children_count: number;
  allergies: string;
  diet: string;
  housing: string;
  transport: string;
  message: string;
  events: string[] | null;
  created_at?: string;
}

export interface GiftOption {
  id: number;
  site_id: number;
  gift_type: string;
  title: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  position: number;
}

export interface MediaAsset {
  id: number;
  category: string;
  title: string;
  url: string;
  collection: string;
  kind: string;
  orientation: string;
}

export interface PublicSiteData {
  site: WeddingSite;
  sections: SiteSection[];
  programme: ProgrammeEvent[];
  infos: InfoPratique[];
  gallery: GalleryPhoto[];
  faqs: Faq[];
  rsvpEvents: RsvpEvent[];
  gifts: GiftOption[];
}
