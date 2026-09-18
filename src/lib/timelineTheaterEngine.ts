/**
 * Moteur temporel & structure de données universelle Timeline Theater
 * Déclinaison multi-mode : Jour J (Régie micro), Calendrier (Futurs events) et Archives (Mémoire & Docs)
 */

export type TimelineMode = 'jour-j' | 'calendar' | 'archives';

export interface TimelineTrackItem {
  id: string;
  mode: TimelineMode;
  chapter: string; // ex: 'Matin & Préparatifs', 'Cérémonie & Émotion', 'Festivités'
  title: string;
  subtitle: string;
  startTime: string; // '17:00' ou date ISO '2026-06-20'
  durationMinutes: number; // Durée en minutes (ex: 90)
  startMinuteOfDay: number; // Minutes depuis 06:00 (0 = 06:00, 60 = 07:00, etc.)
  colorAccent?: string;
  themeStyleId?: string;
  category: 'ceremony' | 'cocktail' | 'dinner' | 'party' | 'vendor' | 'doc' | 'milestone';
  
  // Alignement & Mini-sites associés
  alignedRole?: string; // ex: 'Saxophoniste Live', 'Photographe Argentique'
  audioPreviewUrl?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'audio' | 'video' | 'doc';
  docBadge?: string; // ex: 'Contrat signé', 'Plan de table v3', 'Brief sonore'
  description?: string;
  
  // Métriques studio
  targetBpm?: number;
  solarConstraint?: 'golden_hour' | 'sunset' | 'night';
  isLocked?: boolean;
}

// 06:00 du matin à 04:00 le lendemain = 22 heures = 1320 minutes
export const TIMELINE_START_HOUR = 6;
export const TIMELINE_TOTAL_HOURS = 22; // de 06h à 04h J+1
export const TIMELINE_TOTAL_MINUTES = TIMELINE_TOTAL_HOURS * 60; // 1320 min

export function timeToMinutesFromStart(timeStr: string): number {
  const parts = timeStr.replace('h', ':').split(':');
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1] || '0', 10);
  
  // Si h >= 6, c'est le jour J (6h à 23h59)
  // Si h < 6, c'est le lendemain (00h à 04h)
  const normalizedHour = h >= TIMELINE_START_HOUR ? h - TIMELINE_START_HOUR : h + (24 - TIMELINE_START_HOUR);
  return normalizedHour * 60 + m;
}

export function minutesToTimeString(minutesFromStart: number): string {
  const clamped = Math.max(0, Math.min(TIMELINE_TOTAL_MINUTES, minutesFromStart));
  const rawHours = Math.floor(clamped / 60) + TIMELINE_START_HOUR;
  const hours = rawHours >= 24 ? rawHours - 24 : rawHours;
  const mins = Math.floor(clamped % 60);
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export const INITIAL_TIMELINE_ITEMS: TimelineTrackItem[] = [
  // --- MODE JOUR J ---
  {
    id: 'jj-1',
    mode: 'jour-j',
    chapter: 'Arrivée & Préparatifs',
    title: 'Habillage & Clichés Intimes',
    subtitle: 'Suite nuptiale & salon des témoins',
    startTime: '14:30',
    durationMinutes: 75,
    startMinuteOfDay: timeToMinutesFromStart('14:30'),
    category: 'vendor',
    alignedRole: 'Photographe Argentique',
    mediaUrl: '/images/mariage-chateau-contemporain.jpg',
    mediaType: 'image',
    docBadge: 'Moodboard validé',
    description: 'Capture des détails, parfums, boutonnières et sourires discrets avant la frénésie.',
    targetBpm: 70,
  },
  {
    id: 'jj-2',
    mode: 'jour-j',
    chapter: 'Cérémonie & Émotion',
    title: 'Échange des Vœux & Alliances',
    subtitle: 'Nave centrale sous verrière contemporaine',
    startTime: '16:00',
    durationMinutes: 60,
    startMinuteOfDay: timeToMinutesFromStart('16:00'),
    category: 'ceremony',
    alignedRole: 'Célébrant & Quatuor',
    mediaUrl: '/images/mariage-chapelle-brutaliste.jpg',
    mediaType: 'image',
    docBadge: 'Texte des vœux secret',
    description: 'Entrée des mariés, discours des témoins clés, échange des anneaux et sortie sous pétales.',
    targetBpm: 68,
  },
  {
    id: 'jj-3',
    mode: 'jour-j',
    chapter: 'Cocktail & Golden Hour',
    title: 'Set Saxophone & Dégustation Champagne',
    subtitle: 'Terrasse haute face au couchant',
    startTime: '17:30',
    durationMinutes: 105,
    startMinuteOfDay: timeToMinutesFromStart('17:30'),
    category: 'cocktail',
    alignedRole: 'Saxophoniste Live & Traiteur',
    audioPreviewUrl: 'https://cdn.freesound.org/previews/415/415511_5121236-lq.mp3',
    mediaUrl: '/images/mariage-black-tie-minimaliste.jpg',
    mediaType: 'audio',
    docBadge: 'Pièces cocktail 12 passages',
    description: 'Accords acoustiques lounge et deep-house au coucher du soleil (Golden Hour à 18h45).',
    solarConstraint: 'golden_hour',
    targetBpm: 104,
  },
  {
    id: 'jj-4',
    mode: 'jour-j',
    chapter: 'Banquet & Toasts',
    title: 'Dîner Gastronomique & Discours',
    subtitle: 'Grande nef lumineuse & chandeliers',
    startTime: '20:00',
    durationMinutes: 135,
    startMinuteOfDay: timeToMinutesFromStart('20:00'),
    category: 'dinner',
    alignedRole: 'Chef Traiteur Étoilé',
    mediaUrl: '/images/table-noir.jpg',
    mediaType: 'image',
    docBadge: 'Plan de table dynamique v4',
    description: 'Service à l’assiette cadencé, interventions brèves et émotionnelles entre les plats.',
    targetBpm: 92,
  },
  {
    id: 'jj-5',
    mode: 'jour-j',
    chapter: 'Nuit & Climax',
    title: 'Ouverture du Bal & Session Club Live',
    subtitle: 'Dancefloor verrière & set progressif',
    startTime: '22:45',
    durationMinutes: 240,
    startMinuteOfDay: timeToMinutesFromStart('22:45'),
    category: 'party',
    alignedRole: 'DJ Sound Engineer & Sax Live',
    audioPreviewUrl: 'https://cdn.freesound.org/previews/612/612644_5674468-lq.mp3',
    mediaUrl: '/images/mariage-techno-berlinois.jpg',
    mediaType: 'audio',
    docBadge: 'Rider technique son & light',
    description: 'Transition progressive du slow émotionnel vers la transe festive jusqu’au petit matin.',
    targetBpm: 128,
  },

  // --- MODE CALENDRIER / FUTURS EVENTS ---
  {
    id: 'cal-1',
    mode: 'calendar',
    chapter: 'J-180 · Définition Artistique',
    title: 'Validation Scénographique & Choix du Thème',
    subtitle: 'Direction artistique & typographie VOWS',
    startTime: '10:00',
    durationMinutes: 180,
    startMinuteOfDay: timeToMinutesFromStart('10:00'),
    category: 'milestone',
    alignedRole: 'Directeur Artistique',
    mediaUrl: '/images/mariage-white-editorial.jpg',
    mediaType: 'image',
    docBadge: 'Charte graphique validée',
    description: 'Arrêt définitif de la palette, des faire-part numériques et de l’identité visuelle.',
  },
  {
    id: 'cal-2',
    mode: 'calendar',
    chapter: 'J-90 · Dégustation & Sons',
    title: 'Dégustation Traiteur & Répétition Sax',
    subtitle: 'Session privée au domaine',
    startTime: '13:00',
    durationMinutes: 120,
    startMinuteOfDay: timeToMinutesFromStart('13:00'),
    category: 'vendor',
    alignedRole: 'Chef Traiteur & Saxophoniste',
    docBadge: 'Menu 5 temps arrêté',
    description: 'Sélection des accords mets & vins, calage des transitions musicales de chaque moment.',
  },
  {
    id: 'cal-3',
    mode: 'calendar',
    chapter: 'J-15 · Synchronisation Régie',
    title: 'Répétition Générale & Brief Prestataires',
    subtitle: 'Visioconférence Talkie-Walkie Event OS',
    startTime: '19:00',
    durationMinutes: 90,
    startMinuteOfDay: timeToMinutesFromStart('19:00'),
    category: 'milestone',
    alignedRole: 'Orchestrateur VOWS',
    docBadge: 'Conducteur d’antenne final',
    description: 'Vérification des canaux audio chiffrés, des marges de repli pluie et des accès livraisons.',
  },

  // --- MODE ARCHIVES & MÉMOIRE DOC ---
  {
    id: 'arc-1',
    mode: 'archives',
    chapter: 'Documents Légaux & Administratifs',
    title: 'Contrats Prestataires & Assurances Site',
    subtitle: 'Fichiers certifiés scellés',
    startTime: '09:00',
    durationMinutes: 60,
    startMinuteOfDay: timeToMinutesFromStart('09:00'),
    category: 'doc',
    alignedRole: 'Notaire & Régisseur',
    docBadge: 'Coffre-fort numérique PDF',
    description: 'Centralisation de l’ensemble des signatures électroniques, devis et autorisations préfectorales.',
  },
  {
    id: 'arc-2',
    mode: 'archives',
    chapter: 'Rushes & Master Audio',
    title: 'Master Enregistrement Live Station Radio',
    subtitle: 'Flux WAV 24-bit 48kHz multipiste',
    startTime: '12:00',
    durationMinutes: 300,
    startMinuteOfDay: timeToMinutesFromStart('12:00'),
    category: 'doc',
    alignedRole: 'Ingénieur du Son VOWS',
    audioPreviewUrl: 'https://cdn.freesound.org/previews/415/415511_5121236-lq.mp3',
    docBadge: 'Archive Master 8.4 Go',
    description: 'Intégralité des vœux murmurés, discours des proches et captation live du saxo et du bal.',
  },
];
