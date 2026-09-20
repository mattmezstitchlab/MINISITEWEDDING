import { WEDDING_STYLES, type WeddingStyle } from './weddingStyles';
import { getThemeConfig } from './themeConfigs';

export interface MissingFields {
  names: boolean;
  date: boolean;
  venue: boolean;
}

export interface AgentProposal {
  style: WeddingStyle;
  partner1: string;
  partner2: string;
  wedding_date: string;
  formattedDate: string;
  venue: string;
  city: string;
  budget?: string;
  guestCount?: string;
  toneResponse: string;
  accentColor: string;
  suggestedModules: string[];
  missingFields: MissingFields;
}

// Mois français avec gestion des variantes & fautes de frappe courantes
const MONTH_MAP: Record<string, { num: string; label: string }> = {
  janvier: { num: '01', label: 'janvier' },
  fevrier: { num: '02', label: 'février' },
  février: { num: '02', label: 'février' },
  mars: { num: '03', label: 'mars' },
  avril: { num: '04', label: 'avril' },
  mai: { num: '05', label: 'mai' },
  juin: { num: '06', label: 'juin' },
  juillet: { num: '07', label: 'juillet' },
  juilelt: { num: '07', label: 'juillet' },
  juill: { num: '07', label: 'juillet' },
  aout: { num: '08', label: 'août' },
  août: { num: '08', label: 'août' },
  septembre: { num: '09', label: 'septembre' },
  octobre: { num: '10', label: 'octobre' },
  novembre: { num: '11', label: 'novembre' },
  decembre: { num: '12', label: 'décembre' },
  décembre: { num: '12', label: 'décembre' },
};

/**
 * Analyse sémantique précise :
 * - Détecte rigoureusement la présence réelle ou l'absence de prénoms, budget, invités, lieu.
 * - Ne remplit pas de faux prénoms ou de faux chiffres si rien n'a été spécifié.
 * - Signale les informations manquantes pour que l'utilisateur puisse les compléter en 1 clic.
 */
export function analyzeWeddingPrompt(prompt: string): AgentProposal {
  const p = prompt.toLowerCase();
  const missingFields: MissingFields = {
    names: false,
    date: false,
    venue: false,
  };

  // 1. EXTRACTION DES PRÉNOMS
  let partner1 = '';
  let partner2 = '';

  const selfIntroMatch = prompt.match(/(?:nous sommes|on est|moi c'est|je suis)\s+([A-Za-zÀ-ÖØ-öø-ÿ]+)\s+(?:et|&|\+)\s+([A-Za-zÀ-ÖØ-öø-ÿ]+)/i);
  if (selfIntroMatch) {
    partner1 = capitalize(selfIntroMatch[1]);
    partner2 = capitalize(selfIntroMatch[2]);
  } else {
    // Vérifier les couples de mots (ex: "Matt & Cerise", "Léa et Thomas")
    const wordsMatch = prompt.match(/\b([A-Za-zÀ-ÖØ-öø-ÿ]{2,})\s*(?:&|et|\+)\s*([A-Za-zÀ-ÖØ-öø-ÿ]{2,})\b/i);
    if (wordsMatch) {
      const w1 = wordsMatch[1].toLowerCase();
      const w2 = wordsMatch[2].toLowerCase();
      // Liste de mots trompeurs
      const blacklist = [
        'on', 'se', 'marie', 'marier', 'mariage', 'dans', 'pour', 'avec', 'sans', 'noir',
        'blanc', 'jour', 'nuit', 'fleurs', 'champagne', 'château', 'chateau', 'robe', 'costume', 'new', 'york'
      ];
      if (!blacklist.includes(w1) && !blacklist.includes(w2)) {
        partner1 = capitalize(wordsMatch[1]);
        partner2 = capitalize(wordsMatch[2]);
      }
    }
  }

  if (!partner1 || !partner2) {
    missingFields.names = true;
    partner1 = 'Les Mariés';
    partner2 = '';
  }

  // 2. EXTRACTION DE LA DATE
  let year = '';
  const yearMatch = prompt.match(/\b(202[4-9]|203[0-5])\b/);
  if (yearMatch) year = yearMatch[1];

  let day = '';
  let monthNum = '';
  let monthLabel = '';

  // Chercher un jour + mois (ex: "28 Aout", "18 juillet")
  const dayMatch = prompt.match(/\b([1-9]|[12][0-9]|3[01])\s*(?:er)?\s+([a-zéèêû]+)/i);
  if (dayMatch) {
    const rawMonthWord = dayMatch[2].toLowerCase();
    for (const [key, val] of Object.entries(MONTH_MAP)) {
      if (rawMonthWord.startsWith(key) || key.startsWith(rawMonthWord)) {
        day = dayMatch[1].padStart(2, '0');
        monthNum = val.num;
        monthLabel = val.label;
        break;
      }
    }
  }

  if (!monthNum) {
    // Chercher au moins le mois
    for (const [key, val] of Object.entries(MONTH_MAP)) {
      if (p.includes(key)) {
        monthNum = val.num;
        monthLabel = val.label;
        break;
      }
    }
  }

  let wedding_date = '';
  let formattedDate = '';

  if (monthNum && year) {
    const effectiveDay = day || '15';
    wedding_date = `${year}-${monthNum}-${effectiveDay}`;
    formattedDate = day ? `${parseInt(day, 10)} ${monthLabel} ${year}` : `${monthLabel} ${year}`;
  } else if (year) {
    wedding_date = `${year}-06-20`;
    formattedDate = `Courant ${year}`;
  } else {
    missingFields.date = true;
    wedding_date = '2028-06-24';
    formattedDate = 'Date à définir';
  }

  // 3. EXTRACTION DU LIEU & DE LA VILLE
  let venue = '';
  let city = '';

  if (p.includes('central park')) {
    venue = 'Central Park';
    city = 'New York, USA';
  } else if (p.includes('madison square')) {
    venue = 'Madison Square Garden';
    city = 'New York, USA';
  } else if (p.includes('new york') || p.includes('ny') || p.includes('manhattan')) {
    venue = 'The Glasshouse';
    city = 'New York, USA';
  } else if (p.includes('paris') || p.includes('rooftop')) {
    venue = 'Rooftop Paris';
    city = 'Paris, France';
  } else if (p.includes('toscane') || p.includes('italie')) {
    venue = 'Villa di Geggiano';
    city = 'Sienne, Italie';
  } else if (p.includes('provence') || p.includes('sud') || p.includes('olivier')) {
    venue = 'Bastide des Oliviers';
    city = 'Provence, France';
  } else if (p.includes('chateau') || p.includes('château') || p.includes('domaine')) {
    venue = 'Le Domaine';
    city = 'France';
  } else {
    // Essayer de capturer "à [Lieu]" ou "dans [Lieu]"
    const placeMatch = prompt.match(/(?:à|dans|au|en)\s+([A-ZÀ-ÖØ-öø-ÿ0-9\s'-]+?)(?:le|\d|\.|\,|$)/i);
    if (placeMatch && placeMatch[1].trim().length > 2) {
      venue = placeMatch[1].trim();
      city = 'Destination mariage';
    } else {
      missingFields.venue = true;
      venue = 'Lieu à préciser';
      city = 'Destination';
    }
  }

  // 4. INVITÉS (Uniquement si explicitement mentionnés)
  let guestCount: string | undefined = undefined;
  if (p.includes('centaine')) {
    guestCount = '100 invités';
  } else {
    const guestMatch = prompt.match(/(\d+)\s*(?:personnes|invités|invites|guests|pax)/i);
    if (guestMatch) guestCount = `${guestMatch[1]} invités`;
  }

  // 5. BUDGET (Uniquement si explicitement mentionné)
  let budget: string | undefined = undefined;
  const budgetMatch = prompt.match(/(\d+[\s.]?\d*)\s*(?:k€|k|€|euros|euro)/i);
  if (budgetMatch) {
    let raw = budgetMatch[1].replace(/\s/g, '');
    if (budgetMatch[0].toLowerCase().includes('k')) {
      raw = `${parseInt(raw, 10) * 1000}`;
    }
    budget = `${new Intl.NumberFormat('fr-FR').format(parseInt(raw, 10))} €`;
  }

  // 6. STYLE ET SCÉNOGRAPHIE ADAPTÉE
  let chosenId = 'garden-party';
  let toneResponse = '';

  const coupleTitle = partner2 ? `${partner1} & ${partner2}` : partner1;

  if (p.includes('central park')) {
    // Célébration dans Central Park : alliance végétale et skyline de New York
    chosenId = 'garden-party';
    toneResponse = `Cérémonie magique dans Central Park à New York. Super Mariage conçoit une esthétique botanique sous la skyline : vœux sous les frondaisons, garden cocktail décontracté et vue sur les gratte-ciels pour ${coupleTitle}.`;
  } else if (p.includes('madison square') || p.includes('rooftop') || p.includes('hype')) {
    chosenId = 'rooftop-paris';
    toneResponse = `Ambiance skyline ultra-hype. Super Mariage orchestre pour ${coupleTitle} une expérience électrisante : sunset cocktails, vue panoramique et fête mémorable à ${venue}.`;
  } else if (p.includes('noir') || p.includes('blanc') || p.includes('vogue') || p.includes('haute couture') || p.includes('chic')) {
    chosenId = 'noir-blanc';
    toneResponse = `L'élégance absolue. Une ligne haute couture en noir & blanc, sans le moindre bruit visuel, taillée au millimètre pour ${coupleTitle}.`;
  } else if (p.includes('béton') || p.includes('brut') || p.includes('anti-château') || p.includes('bunker')) {
    chosenId = 'brutal';
    toneResponse = `Radical et sans compromis. L'anti-château absolu : lumière zénithale, béton brut et scénographie percutante.`;
  } else if (p.includes('château') || p.includes('chateau') || p.includes('domaine')) {
    chosenId = 'chateau-moderne';
    toneResponse = `L'esprit des grands domaines réinventé avec modernité. Pierre blonde, coupes de champagne et verrière lumineuse.`;
  } else if (p.includes('lin') || p.includes('minimal') || p.includes('doux') || p.includes('terracotta')) {
    chosenId = 'minimalist-warm';
    toneResponse = `La sérénité d'un minimalisme sensoriel : teintes lin chaud, lumière dorée et typographies légères pour ${coupleTitle}.`;
  } else {
    chosenId = 'rooftop-paris';
    toneResponse = `Une scénographie contemporaine et vibrante pensée sur-mesure pour votre mariage à ${city}.`;
  }

  const style = WEDDING_STYLES.find((s) => s.id === chosenId) || WEDDING_STYLES[0];
  const config = getThemeConfig(style.id);

  const rawSections = config?.sections || [];
  const cleanModules = rawSections
    .filter((s) => s.key !== 'hero' && s.key !== 'footer' && s.title.trim().length > 0)
    .map((s) => s.title)
    .slice(0, 4);

  const suggestedModules = cleanModules.length > 0 ? cleanModules : [
    'Programme Jour J',
    'RSVP interactif',
    'Lieux & Plans',
    'Galerie photos',
  ];

  return {
    style,
    partner1,
    partner2,
    wedding_date,
    formattedDate,
    venue,
    city,
    budget,
    guestCount,
    toneResponse,
    accentColor: style.accent,
    suggestedModules,
    missingFields,
  };
}

function capitalize(s: string): string {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
