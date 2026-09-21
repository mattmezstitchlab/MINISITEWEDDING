/**
 * Moteur temporel & structure de données universelle de la Timeline Miroir
 * Intègre les autorisations d'accès strictes (Invités / Mariés / Prestataires)
 * et le coffre-fort documentaire scellé (devis, contrats, factures, fiches techniques).
 */

export type TimelineMode = 'jour-j' | 'calendar' | 'archives';
export type ViewerPerspective = 'guest' | 'couple' | 'vendor';

export interface TimelineDocument {
  id: string;
  name: string;
  type: 'devis' | 'facture' | 'contrat' | 'brief' | 'plan_technique' | 'menu';
  fileSize: string;
  status: 'signe_scelle' | 'en_attente' | 'regle';
  accessLevels: ViewerPerspective[]; // Qui a le droit de voir ce document
  uploadedBy: 'couple' | 'vendor';
  timestamp: string;
}

export interface TimelineTrackItem {
  id: string;
  mode: TimelineMode;
  chapter: string;
  title: string;
  subtitle: string;
  startTime: string; // '17:30'
  durationMinutes: number;
  startMinuteOfDay: number; // Minutes depuis 06:00
  colorAccent?: string;
  themeStyleId?: string;
  category: 'ceremony' | 'cocktail' | 'dinner' | 'party' | 'vendor' | 'doc' | 'milestone';
  
  // Alignement du rôle & Mini-site prestataire
  alignedRole?: string; // ex: 'Saxophoniste Live', 'Photographe Argentique'
  audioPreviewUrl?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'audio' | 'video' | 'doc';
  description?: string;
  
  // Autorisations d'accès (qui voit ce moment sur son écran)
  visibility: ViewerPerspective[]; // ex: ['guest', 'couple', 'vendor'] ou seulement ['couple', 'vendor']
  
  // Données de coordination en miroir (Zéro réclamation / Vérité partagée)
  coupleNote?: string; // Repère et exigences posés par les mariés
  vendorConfirmation?: {
    confirmed: boolean;
    confirmedAt?: string;
    technicalRequirements?: string;
  };

  // Coffre-fort documentaire scellé sur ce créneau horaire
  attachedDocs: TimelineDocument[];
  docBadge?: string; // Rétrocompatibilité d'affichage studio

  /**
   * **Ce que le bloc annonce à la place des minutes** — sur la collection, un
   * magazine ne dure pas « 24 m » : il porte **7 chapitres**.
   */
  mesure?: string;
  /** Les sept chapitres du magazine, quand le bloc en est un. */
  sousTitres?: string[];

  // Métriques studio
  targetBpm?: number;
  solarConstraint?: 'golden_hour' | 'sunset' | 'night';
  isLocked?: boolean;
}

// 06:00 du matin à 04:00 le lendemain = 22 heures = 1320 minutes
export const TIMELINE_START_HOUR = 6;
export const TIMELINE_TOTAL_HOURS = 22;
export const TIMELINE_TOTAL_MINUTES = TIMELINE_TOTAL_HOURS * 60;

export function timeToMinutesFromStart(timeStr: string): number {
  const parts = timeStr.replace('h', ':').split(':');
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1] || '0', 10);
  
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
    title: 'Arrivée Régie & Habillage Mariés',
    subtitle: 'Suite nuptiale & salon des témoins',
    startTime: '14:30',
    durationMinutes: 75,
    startMinuteOfDay: timeToMinutesFromStart('14:30'),
    category: 'vendor',
    alignedRole: 'Photographe Argentique',
    mediaUrl: '/images/chateau.jpg',
    mediaType: 'image',
    description: 'Capture des détails, parfums, boutonnières et sourires discrets.',
    visibility: ['couple', 'vendor'], // Masqué aux invités pour préserver l'intimité
    coupleNote: 'Robe suspendue dans la chambre rose. Clichés avec les témoins à 15h15 pile.',
    vendorConfirmation: {
      confirmed: true,
      confirmedAt: 'Validé il y a 2h',
      technicalRequirements: '2 boîtiers Leica chargés, 8 pellicules 35mm prêtes',
    },
    attachedDocs: [
      {
        id: 'doc-1',
        name: 'Contrat & Acompte Photographe.pdf',
        type: 'contrat',
        fileSize: '1.8 Mo',
        status: 'signe_scelle',
        accessLevels: ['couple', 'vendor'],
        uploadedBy: 'vendor',
        timestamp: 'Signé électroniquement',
      },
    ],
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
    mediaUrl: '/images/brutal.jpg',
    mediaType: 'image',
    description: 'Entrée des mariés, discours des témoins clés, échange des anneaux et sortie.',
    visibility: ['guest', 'couple', 'vendor'], // Visible de TOUS
    coupleNote: 'Pas de téléphones pendant l’échange des alliances (mentionné par le célébrant).',
    vendorConfirmation: {
      confirmed: true,
      confirmedAt: 'Calé',
      technicalRequirements: 'Micro cravate sans fil + sonorisation acoustique prête',
    },
    attachedDocs: [
      {
        id: 'doc-2',
        name: 'Livret de Cérémonie & Musiques.pdf',
        type: 'brief',
        fileSize: '840 Ko',
        status: 'signe_scelle',
        accessLevels: ['guest', 'couple', 'vendor'], // Même les invités y ont accès !
        uploadedBy: 'couple',
        timestamp: 'Mis à disposition',
      },
    ],
  },
  {
    id: 'jj-3',
    mode: 'jour-j',
    chapter: 'Cocktail & Golden Hour',
    title: 'Set Saxophone Live & Dégustation Champagne',
    subtitle: 'Terrasse haute face au couchant',
    startTime: '17:30',
    durationMinutes: 105,
    startMinuteOfDay: timeToMinutesFromStart('17:30'),
    category: 'cocktail',
    alignedRole: 'Saxophoniste Live & Traiteur',
    audioPreviewUrl: 'https://cdn.freesound.org/previews/415/415511_5121236-lq.mp3',
    mediaUrl: '/images/noir-blanc.jpg',
    mediaType: 'audio',
    description: 'Accords acoustiques lounge et deep-house au coucher du soleil (Golden Hour à 18h45).',
    solarConstraint: 'golden_hour',
    targetBpm: 104,
    visibility: ['guest', 'couple', 'vendor'],
    coupleNote: 'Repère Mariés : Solo saxo précis au moment du lancer du bouquet à 18h30.',
    vendorConfirmation: {
      confirmed: true,
      confirmedAt: 'Régie alignée',
      technicalRequirements: 'Émetteur HF sans fil saxo testé, portée 80m terrasse',
    },
    attachedDocs: [
      {
        id: 'doc-3a',
        name: 'Fiche Technique Régie Son Saxophone.pdf',
        type: 'plan_technique',
        fileSize: '620 Ko',
        status: 'signe_scelle',
        accessLevels: ['couple', 'vendor'],
        uploadedBy: 'vendor',
        timestamp: 'Validé par régisseur',
      },
      {
        id: 'doc-3b',
        name: 'Devis Signé & Facture Acompte.pdf',
        type: 'facture',
        fileSize: '1.2 Mo',
        status: 'regle',
        accessLevels: ['couple', 'vendor'],
        uploadedBy: 'vendor',
        timestamp: 'Réglé le 12/04/2026',
      },
    ],
  },
  {
    id: 'jj-4',
    mode: 'jour-j',
    chapter: 'Banquet & Toasts',
    title: 'Dîner Gastronomique & Discours Témoins',
    subtitle: 'Grande nef lumineuse & chandeliers',
    startTime: '20:00',
    durationMinutes: 135,
    startMinuteOfDay: timeToMinutesFromStart('20:00'),
    category: 'dinner',
    alignedRole: 'Chef Traiteur Étoilé',
    mediaUrl: '/images/table-noir.jpg',
    mediaType: 'image',
    description: 'Service à l’assiette cadencé, interventions brèves et émotionnelles entre les plats.',
    targetBpm: 92,
    visibility: ['guest', 'couple', 'vendor'],
    coupleNote: 'Discours max 4 minutes chacun pour ne pas refroidir les plats chauds.',
    vendorConfirmation: {
      confirmed: true,
      technicalRequirements: 'Envoi des plats chauds coordonné à la seconde avec le DJ',
    },
    attachedDocs: [
      {
        id: 'doc-4a',
        name: 'Plan de Table & Régimes Invités.pdf',
        type: 'plan_technique',
        fileSize: '2.4 Mo',
        status: 'signe_scelle',
        accessLevels: ['couple', 'vendor'],
        uploadedBy: 'couple',
        timestamp: 'Scellé sans erreur',
      },
      {
        id: 'doc-4b',
        name: 'Menu & Accords Mets Vins.pdf',
        type: 'menu',
        fileSize: '950 Ko',
        status: 'signe_scelle',
        accessLevels: ['guest', 'couple', 'vendor'],
        uploadedBy: 'vendor',
        timestamp: 'Visible par les invités',
      },
    ],
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
    mediaUrl: '/images/club-amour.jpg',
    mediaType: 'audio',
    description: 'Transition progressive du slow émotionnel vers la transe festive jusqu’au petit matin.',
    targetBpm: 128,
    visibility: ['guest', 'couple', 'vendor'],
    coupleNote: 'Entrée dans la brume à 22h45 avec le saxophoniste live.',
    vendorConfirmation: {
      confirmed: true,
      technicalRequirements: 'Machine à brouillard lourd & stroboscopes vérifiés',
    },
    attachedDocs: [
      {
        id: 'doc-5',
        name: 'Contrat Clôture Nocturne 05h00.pdf',
        type: 'contrat',
        fileSize: '1.4 Mo',
        status: 'signe_scelle',
        accessLevels: ['couple', 'vendor'],
        uploadedBy: 'vendor',
        timestamp: 'Autorisation municipale jointe',
      },
    ],
  },
];
