/**
 * Moteur d'Alignement Bidirectionnel Universel VOWS
 * Résout le casse-tête : n'importe qui entre par son rôle, et tout le monde s'aligne
 * automatiquement autour de la date et de la timeline en miroir.
 */

export type UniversalRoleType =
  | 'couple'     // Mariés (Cockpit & Vœux)
  | 'guest'      // Invité (Émotion & RSVP)
  | 'temoin'     // Témoin (Discours & Surprise secrète)
  | 'officiant'  // Célébrant / Officiant (Texte des vœux & Rituel)
  | 'traiteur'   // Traiteur / Maître d'Hôtel (Envoi des plats & Allergènes)
  | 'dj_sax'     // DJ / Saxophoniste Live (Bande-son & Climax)
  | 'photo'      // Photographe / Vidéaste (Planning lumière & Rushes);

export interface UniversalRoleIdentity {
  id: UniversalRoleType;
  title: string;
  badge: string;
  iconName: string;
  defaultActionLabel: string;
  privateSpaceHint: string;
  colorAccent: string;
}

export const UNIVERSAL_ROLES: Record<UniversalRoleType, UniversalRoleIdentity> = {
  couple: {
    id: 'couple',
    title: 'Les Mariés',
    badge: 'Cockpit & Vœux',
    iconName: 'Heart',
    defaultActionLabel: 'Gérer notre célébration',
    privateSpaceHint: 'Vous posez vos repères. Tout le monde s’aligne sur vos horaires.',
    colorAccent: '#111116',
  },
  guest: {
    id: 'guest',
    title: 'Invité',
    badge: 'Émotion & RSVP',
    iconName: 'UserCheck',
    defaultActionLabel: 'Confirmer ma présence',
    privateSpaceHint: 'Accès au programme, hébergements et mot doux pour les mariés.',
    colorAccent: '#3B82F6',
  },
  temoin: {
    id: 'temoin',
    title: 'Témoin',
    badge: 'Discours & Surprises',
    iconName: 'Sparkles',
    defaultActionLabel: 'Planifier une intervention',
    privateSpaceHint: 'Canal secret masqué aux mariés pour caler discours et animations avec le DJ.',
    colorAccent: '#8B5CF6',
  },
  officiant: {
    id: 'officiant',
    title: 'Célébrant / Officiant',
    badge: 'Rituel & Vœux',
    iconName: 'BookOpen',
    defaultActionLabel: 'Déroulé de la cérémonie',
    privateSpaceHint: 'Minutage des lectures, échange des alliances et musique d’entrée.',
    colorAccent: '#F59E0B',
  },
  traiteur: {
    id: 'traiteur',
    title: 'Traiteur & Salle',
    badge: 'Banquet & Horaires',
    iconName: 'Utensils',
    defaultActionLabel: 'Conducteur de service',
    privateSpaceHint: 'Coordination à la seconde de l’envoi des plats chauds avec le DJ.',
    colorAccent: '#10B981',
  },
  dj_sax: {
    id: 'dj_sax',
    title: 'Prestataire Son & Sax',
    badge: 'Régie & Ambiance',
    iconName: 'Music',
    defaultActionLabel: 'Régie musicale Jour J',
    privateSpaceHint: 'Bande-son synchronisée, micro HF et live au coucher du soleil.',
    colorAccent: '#EC4899',
  },
  photo: {
    id: 'photo',
    title: 'Photographe / Vidéo',
    badge: 'Golden Hour & Clichés',
    iconName: 'Camera',
    defaultActionLabel: 'Timing shooting',
    privateSpaceHint: 'Lumière naturelle, photos de groupe et restitution des galeries.',
    colorAccent: '#6366F1',
  },
};

export interface BidirectionalAlignmentProposal {
  detectedRole: UniversalRoleType;
  coupleNames: string;
  weddingDate: string;
  formattedDate: string;
  venueOrCity: string;
  themeStyleId: string;
  wallpaperUrl: string;
  momentFocusId: string;
  alignedMessage: string;
}

// Analyse de l'Agent Hero : Détecte qui parle (prestataire, témoin, mariés, traiteur...)
// et génère instantanément la carte correspondante alignée avec la timeline
export function analyzeBidirectionalPrompt(promptText: string): BidirectionalAlignmentProposal {
  const p = promptText.toLowerCase();

  let detectedRole: UniversalRoleType = 'couple';
  let themeStyleId = 'noir-blanc';
  let wallpaperUrl = '/images/noir-blanc.jpg';
  let momentFocusId = 'jj-3'; // 17:30 Cocktail par défaut

  // 1. Détection du rôle
  if (p.includes('temoin') || p.includes('témoin') || p.includes('discours') || p.includes('surprise')) {
    detectedRole = 'temoin';
    momentFocusId = 'jj-4'; // Dîner & Toasts
  } else if (p.includes('officiant') || p.includes('celebrant') || p.includes('célébrant') || p.includes('ceremonie') || p.includes('voeux') || p.includes('vœux')) {
    detectedRole = 'officiant';
    momentFocusId = 'jj-2'; // Cérémonie
  } else if (p.includes('traiteur') || p.includes('chef') || p.includes('repas') || p.includes('plat') || p.includes('vin') || p.includes('banquet')) {
    detectedRole = 'traiteur';
    momentFocusId = 'jj-4'; // Dîner
  } else if (p.includes('sax') || p.includes('dj') || p.includes('musique') || p.includes('son') || p.includes('sono') || p.includes('danse')) {
    detectedRole = 'dj_sax';
    momentFocusId = 'jj-3'; // Cocktail Sax ou Bal
  } else if (p.includes('photo') || p.includes('video') || p.includes('caméra') || p.includes('cliché')) {
    detectedRole = 'photo';
    momentFocusId = 'jj-1'; // Préparatifs
  } else if (p.includes('invite') || p.includes('invité') || p.includes('rsvp') || p.includes('présence')) {
    detectedRole = 'guest';
    momentFocusId = 'jj-2';
  }

  // 2. Détection de l'ambiance visuelle (Wallpaper haute couture)
  if (p.includes('chateau') || p.includes('château') || p.includes('domaine') || p.includes('parc')) {
    themeStyleId = 'chateau-moderne';
    wallpaperUrl = '/images/chateau.jpg';
  } else if (p.includes('mer') || p.includes('plage') || p.includes('côte') || p.includes('sud') || p.includes('phare')) {
    themeStyleId = 'phare-atlantique';
    wallpaperUrl = '/images/phare-vows.jpg';
  } else if (p.includes('brut') || p.includes('beton') || p.includes('béton') || p.includes('loft') || p.includes('bunker')) {
    themeStyleId = 'brutal';
    wallpaperUrl = '/images/brutal-bunker-vows.jpg';
  } else if (p.includes('fête') || p.includes('club') || p.includes('nuit') || p.includes('techno') || p.includes('dancefloor')) {
    themeStyleId = 'club';
    wallpaperUrl = '/images/club-amour.jpg';
  } else if (p.includes('desert') || p.includes('motel') || p.includes('piscine') || p.includes('vintage')) {
    themeStyleId = 'desert';
    wallpaperUrl = '/images/desert-pool-vows.jpg';
  }

  // 3. Extraction prénoms
  let coupleNames = 'Sarah & Gabriel';
  const nameMatch = promptText.match(/\b([A-ZÀ-ÖØ-öø-ÿ]{2,})\s*(?:&|et|\+)\s*([A-ZÀ-ÖØ-öø-ÿ]{2,})\b/i);
  if (nameMatch) {
    coupleNames = `${nameMatch[1]} & ${nameMatch[2]}`;
  }

  // 4. Extraction date
  let weddingDate = '2026-09-19';
  let formattedDate = '19 Septembre 2026';
  if (p.includes('2027')) {
    weddingDate = '2027-06-12';
    formattedDate = '12 Juin 2027';
  }

  // 5. Message d'alignement fluide
  let alignedMessage = '';
  switch (detectedRole) {
    case 'temoin':
      alignedMessage = `Vous rejoignez ${coupleNames}. Votre espace secret est configuré pour caler vos interventions sans qu'ils ne le voient.`;
      break;
    case 'traiteur':
      alignedMessage = `Conducteur de service aligné pour ${coupleNames} le ${formattedDate}. Synchronisation de l'envoi des plats.`;
      break;
    case 'dj_sax':
      alignedMessage = `Régie musicale connectée. Vos temps de balances et créneaux solos sont scellés dans la timeline.`;
      break;
    case 'officiant':
      alignedMessage = `Cérémonie synchronisée pour ${coupleNames}. Le timing des alliances et vœux est calé.`;
      break;
    case 'guest':
      alignedMessage = `Bienvenue au mariage de ${coupleNames}. Votre carton d'invitation et RSVP sont prêts.`;
      break;
    default:
      alignedMessage = `Votre cockpit Jour J est créé. Partagez votre lien : témoins, traiteur et invités s’alignent automatiquement.`;
  }

  return {
    detectedRole,
    coupleNames,
    weddingDate,
    formattedDate,
    venueOrCity: 'Paris & Île-de-France',
    themeStyleId,
    wallpaperUrl,
    momentFocusId,
    alignedMessage,
  };
}
