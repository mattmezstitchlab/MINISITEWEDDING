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

/** Une personne du réseau : sa carte, indépendamment de tout mariage. */
export interface Person {
  id: number;
  first_name: string;
  last_name: string;
  photo: string;
  home_city: string;
  trade: string;
  bio: string;
  email: string;
  phone: string;
  website: string;
  social: string;
  contact_visibility: string;
  card?: Record<string, unknown>;
  /** Renseigné par le serveur : ce qui a été masqué pour l'appelant. */
  redacted?: { contacts: boolean; prive: boolean };
}

/** La place d'une personne dans un mariage. Le rôle ne vit que là. */
export interface WeddingMember {
  id: number;
  site_id: number;
  person_id: number;
  role_id: string;
  status: string;
  joined_at?: string | null;
  person?: Person | null;
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
