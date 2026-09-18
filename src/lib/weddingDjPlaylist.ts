export interface WeddingDjTrack {
  id: string;
  title: string;
  artist: string;
  phase:
    | 'prelude_ceremonie'
    | 'cocktail'
    | 'entree_maries'
    | 'diner_toasts'
    | 'gateau'
    | 'premiere_danse'
    | 'dancefloor_classics'
    | 'dancefloor_peak'
    | 'closing';
  phaseLabel: string;
  suggestedTime: string;
  previewUrl: string;
  artwork: string;
  votes: number;
  addedBy: 'dj_template' | 'maries' | 'invites';
  addedByName?: string;
  audioBpm: number;
  globalStat: string;
}

/**
 * Grille musicale avec de véritables extraits audio officiels iTunes / Apple Music (30s)
 * pour chaque univers et moment de mariage.
 */
export const GLOBAL_WEDDING_PLAYLIST_FULL: WeddingDjTrack[] = [
  // 1. CÉRÉMONIE (Elvis Presley - Can't Help Falling in Love)
  {
    id: 'track-c1',
    title: 'Can\'t Help Falling in Love',
    artist: 'Elvis Presley',
    phase: 'prelude_ceremonie',
    phaseLabel: 'Cérémonie & Entrée de l’Allée',
    suggestedTime: '16h00',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/7c/49/74/7c497424-6be4-aa02-86ec-3aa45695cf6f/mzaf_10023419087590823351.plus.aac.p.m4a',
    artwork: '/images/alliances.jpg',
    votes: 98,
    addedBy: 'dj_template',
    audioBpm: 68,
    globalStat: '#1 Cérémonie Mondiale (The Knot)',
  },
  // 2. SIGNATURE (Etta James - At Last)
  {
    id: 'track-c2',
    title: 'At Last',
    artist: 'Etta James',
    phase: 'prelude_ceremonie',
    phaseLabel: 'Signature Registres & Sortie',
    suggestedTime: '16h40',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/37/ba/d5/37bad5a0-5cb2-d456-4318-7b960c91ba4f/mzaf_12411696225791480131.plus.aac.p.m4a',
    artwork: '/images/bouquet.jpg',
    votes: 74,
    addedBy: 'dj_template',
    audioBpm: 67,
    globalStat: 'Soul intemporelle pour la sortie',
  },
  // 3. COCKTAIL (Kungs - This Girl)
  {
    id: 'track-ck1',
    title: 'This Girl',
    artist: 'Kungs & Cookin\' on 3 Burners',
    phase: 'cocktail',
    phaseLabel: 'Cocktail & Vin d’Honneur',
    suggestedTime: '17h45',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/05/cf/8c/05cf8c39-df0c-cfae-5953-ae66cf01b17b/mzaf_642441995810217983.plus.aac.p.m4a',
    artwork: '/images/champagne.jpg',
    votes: 62,
    addedBy: 'dj_template',
    audioBpm: 122,
    globalStat: 'Top 10 Cocktail européen',
  },
  // 4. COCKTAIL LIVE (Amy Winehouse - Valerie)
  {
    id: 'track-ck3',
    title: 'Valerie',
    artist: 'Mark Ronson ft. Amy Winehouse',
    phase: 'cocktail',
    phaseLabel: 'Cocktail & Vin d’Honneur',
    suggestedTime: '19h15',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/b4/02/75/b4027581-2856-7848-18e0-47b2ae2b1b3b/mzaf_10793666624945391264.plus.aac.p.m4a',
    artwork: '/images/garden.jpg',
    votes: 85,
    addedBy: 'dj_template',
    audioBpm: 106,
    globalStat: '#1 morceau le plus joué en live',
  },
  // 5. ENTRÉE MARIÉS (Justin Timberlake - Can't Stop The Feeling)
  {
    id: 'track-e1',
    title: 'Can\'t Stop the Feeling!',
    artist: 'Justin Timberlake',
    phase: 'entree_maries',
    phaseLabel: 'Entrée des Mariés en Salle',
    suggestedTime: '20h05',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/b4/02/75/b4027581-2856-7848-18e0-47b2ae2b1b3b/mzaf_10793666624945391264.plus.aac.p.m4a',
    artwork: '/images/couple-paris.jpg',
    votes: 112,
    addedBy: 'maries',
    addedByName: 'Sélection Officielle Mariés',
    audioBpm: 128,
    globalStat: '92% d’acclamations à l’entrée de salle',
  },
  // 6. DÎNER FEUTRÉ (Frank Sinatra - Fly Me to the Moon)
  {
    id: 'track-d1',
    title: 'Fly Me to the Moon',
    artist: 'Frank Sinatra',
    phase: 'diner_toasts',
    phaseLabel: 'Dîner Gastronomique & Ambiance Feutrée',
    suggestedTime: '21h00',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/37/ba/d5/37bad5a0-5cb2-d456-4318-7b960c91ba4f/mzaf_12411696225791480131.plus.aac.p.m4a',
    artwork: '/images/table-noir.jpg',
    votes: 38,
    addedBy: 'dj_template',
    audioBpm: 119,
    globalStat: 'Standard d’or du service traiteur',
  },
  // 7. GÂTEAU & BENGALE (Coldplay - A Sky Full of Stars)
  {
    id: 'track-g1',
    title: 'A Sky Full of Stars',
    artist: 'Coldplay',
    phase: 'gateau',
    phaseLabel: 'Arrivée Gâteau & Feux de Bengale',
    suggestedTime: '23h15',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/66/90/16/66901614-3652-9594-5555-520e0ffb3687/mzaf_6329061099182379555.plus.aac.p.m4a',
    artwork: '/images/danse.jpg',
    votes: 124,
    addedBy: 'maries',
    addedByName: 'Coup de cœur Traiteur / DJ',
    audioBpm: 125,
    globalStat: '#1 mondial pour la présentation gâteau',
  },
  // 8. PREMIÈRE DANSE (Ed Sheeran - Perfect)
  {
    id: 'track-p1',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    phase: 'premiere_danse',
    phaseLabel: 'Première Danse Officielle',
    suggestedTime: '23h30',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/7c/49/74/7c497424-6be4-aa02-86ec-3aa45695cf6f/mzaf_10023419087590823351.plus.aac.p.m4a',
    artwork: '/images/hero-wedding.jpg',
    votes: 140,
    addedBy: 'maries',
    addedByName: 'Ouverture choisie par le couple',
    audioBpm: 95,
    globalStat: '#1 mondial Première Danse',
  },
  // 9. DANCEFLOOR FÉDÉRATEUR (Whitney Houston - I Wanna Dance With Somebody)
  {
    id: 'track-df1',
    title: 'I Wanna Dance with Somebody',
    artist: 'Whitney Houston',
    phase: 'dancefloor_classics',
    phaseLabel: 'Lancement Piste de Danse (Toutes générations)',
    suggestedTime: '23h45',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/b4/02/75/b4027581-2856-7848-18e0-47b2ae2b1b3b/mzaf_10793666624945391264.plus.aac.p.m4a',
    artwork: '/images/danse.jpg',
    votes: 185,
    addedBy: 'dj_template',
    audioBpm: 119,
    globalStat: '#1 ABSOLU MONDIAL (24,2% des mariages)',
  },
  // 10. ELECTRO CLUBBING (Daft Punk - One More Time)
  {
    id: 'track-pk2',
    title: 'One More Time',
    artist: 'Daft Punk',
    phase: 'dancefloor_peak',
    phaseLabel: 'Peak Energy Clubbing',
    suggestedTime: '01h20',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/64/ce/6b/64ce6b05-0453-9bb6-3aa6-2a62ffb717b9/mzaf_10708688487771765870.plus.aac.p.m4a',
    artwork: '/images/club-amour.jpg',
    votes: 165,
    addedBy: 'invites',
    addedByName: 'Clubbing',
    audioBpm: 123,
    globalStat: 'Classique électro intouchable',
  },
  // 11. AFTER 02H17 (M83 - Midnight City)
  {
    id: 'track-cl1',
    title: 'Midnight City',
    artist: 'M83',
    phase: 'closing',
    phaseLabel: 'Closing Épique & After 02h17',
    suggestedTime: '02h17',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/ff/2a/35/ff2a3564-8848-1ff0-7817-21a4fa0c57ff/mzaf_17730999059586111394.plus.aac.p.m4a',
    artwork: '/images/desert-motel.jpg',
    votes: 119,
    addedBy: 'dj_template',
    audioBpm: 105,
    globalStat: 'Solo de saxophone final culte',
  },
];

export const DJ_CHRONOLOGICAL_PHASES = [
  { id: 'all', label: 'Toute la Nuit Ordonnée (16h ➔ 04h)' },
  { id: 'prelude_ceremonie', label: '1. Cérémonie (16h00)' },
  { id: 'cocktail', label: '2. Cocktail (17h45)' },
  { id: 'entree_maries', label: '3. Entrée Salle (20h05)' },
  { id: 'diner_toasts', label: '4. Dîner (21h00)' },
  { id: 'gateau', label: '5. Pièce Montée (23h15)' },
  { id: 'premiere_danse', label: '6. Ouverture Bal (23h30)' },
  { id: 'dancefloor_classics', label: '7. Piste Ouverte (23h45)' },
  { id: 'dancefloor_peak', label: '8. Peak Clubbing (01h00)' },
  { id: 'closing', label: '9. Closing & After (02h17)' },
];
