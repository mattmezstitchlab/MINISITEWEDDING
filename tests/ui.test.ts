/**
 * Lot « interface » : ce que l’invité et les mariés voient réellement.
 *
 * Les composants de `src/` sont rendus tels quels (rendu statique React), sans
 * aucune base distante : c’est le mode de fonctionnement par défaut du projet
 * (`VITE_DATA_SOURCE=local` dans le lanceur). On vérifie donc que
 *   - le mini-site complet se compose à partir des données locales ;
 *   - le formulaire RSVP propose bien un envoi direct aux mariés quand aucune
 *     base ne peut recevoir les réponses — et redevient un envoi classique dès
 *     qu’une base est déclarée ;
 *   - le panneau de partage expose la publication par fichier.
 */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import PublicSiteView from '../src/components/PublicSiteView';
import SharePanel from '../src/components/SharePanel';
import { forgetPersonToken, setActiveToken } from '../src/lib/auth';
import { apiSend } from '../src/lib/http';
import { seedSite } from '../src/lib/defaults';
import { loadSiteData } from '../src/lib/siteData';
import { setRemote } from '../src/lib/dataSource';
import { resetDb } from '../src/lib/localStore';
import { MemStorage } from './memStorage';
import WeddingCard from '../src/components/WeddingCard';
import GuestPhoneScreen from '../src/components/phone/GuestPhoneScreen';
import Landing from '../src/pages/Landing';
import { contentFor } from '../src/lib/universeContent';
import { styleById } from '../src/lib/weddingStyles';
import { EMPTY_CARD, type CardData } from '../src/lib/weddingCard';
import {
  adoptPersonKey,
  createCard,
  hasPersonKey,
  joinWedding,
  listMyMemberships,
  listWeddingPeople,
  loadMyCard,
  personToCard,
} from '../src/lib/people';

let pass = 0;
const failures: string[] = [];
function check(label: string, actual: unknown, expected: unknown) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) pass++;
  else failures.push(`${label}\n     attendu: ${JSON.stringify(expected)}\n     reçu   : ${JSON.stringify(actual)}`);
}

const mem = new MemStorage();
(globalThis as { localStorage?: unknown }).localStorage = mem;

/* --------------------------------------------------- un site, sans Supabase */

resetDb();
setActiveToken(null);

const created = await seedSite({
  partner1: 'Sarah', partner2: 'Gabriel', wedding_date: '2027-06-12',
  venue: 'Château de Larris', city: 'Paris', style: 'cinema',
});
setActiveToken(created.editToken);
await apiSend('/api/wedding-sites', 'PUT', {
  id: created.site.id, contact_phone: '+33 6 12 34 56 78', contact_email: 'sarah.et.gabriel@mail.fr',
});

const { data, degraded } = await loadSiteData({ slug: created.site.slug });

check('mini-site local : il se compose entièrement', degraded, false);
check('mini-site local : les mariés sont les bons', [data.site.partner1, data.site.partner2], ['Sarah', 'Gabriel']);

/** Le pied de page contient des liens de navigation : un routeur est requis. */
const rendre = (element: Parameters<typeof createElement>[1], props: Record<string, unknown>) =>
  renderToStaticMarkup(createElement(MemoryRouter, null, createElement(element as never, props)));

const invite = rendre(PublicSiteView, { data });

check('mini-site local : le rendu est complet', invite.length > 20_000, true);
check('mini-site local : la date du mariage est présente', invite.includes('2027'), true);
check('mini-site local : les sections ont leurs ancres', invite.includes('id="sec-programme"') && invite.includes('id="sec-rsvp"'), true);
check('mini-site local : la porte de l’invité est dans le pied de page', invite.includes(`/rejoindre/${created.site.slug}`), true);

/* ------------------------------------------- RSVP sans serveur intermédiaire */

check('RSVP autonome : la réponse part en WhatsApp', invite.includes('https://wa.me/33612345678'), true);
check('RSVP autonome : le numéro français est normalisé', invite.includes('wa.me/0'), false);
check('RSVP autonome : la réponse part aussi par e-mail', invite.includes('mailto:sarah.et.gabriel@mail.fr'), true);
check('RSVP autonome : l’invité peut copier sa réponse', invite.includes('Copier ma réponse'), true);
check('RSVP autonome : rien n’est annoncé comme suspendu', invite.includes('Réponses suspendues'), false);
check('RSVP autonome : aucun envoi vers une base absente', invite.includes('Envoyer ma réponse'), false);

setRemote(true);
const distant = rendre(PublicSiteView, { data });
check('RSVP avec base : l’envoi classique revient', distant.includes('Envoyer ma réponse'), true);
check('RSVP avec base : plus de relais WhatsApp', distant.includes('wa.me/'), false);
setRemote(false);

/* ------------------------------------------------------ publier pour partager */

const partage = rendre(SharePanel, { site: data.site, data, onPublishedChange: () => undefined });

check('Partage : la publication est expliquée', partage.includes('Publier pour vos invités'), true);
check('Partage : le dossier de dépôt est indiqué', partage.includes('public/sites/'), true);
check('Partage : le nom de fichier attendu est donné', partage.includes(`${created.site.slug}.json`), true);
check('Partage : le lien est présenté comme l’invitation', partage.includes('c’est l’invitation'), true);

/* -------------------------------------- la carte et le réseau, base du navigateur */

/**
 * Le même parcours que sur l'API, mais sur la base du navigateur : publier sa
 * carte, la relire, rejoindre un mariage, et vérifier que la liste ne laisse
 * pas fuiter ce qui est réservé. Les deux chemins doivent être indiscernables.
 */
forgetPersonToken();

const maCarte: CardData = {
  ...EMPTY_CARD,
  firstName: 'Test',
  lastName: 'Personne',
  homeCity: 'Auxerre',
  trade: 'Fleuriste',
  email: 'test@exemple.fr',
  from: '18:30',
  to: '23:00',
  diet: ['Végétarien'],
  allergens: ['Gluten'],
  iban: 'FR7630006000011234567890189',
};

check('sans clé, il n’y a pas de carte en ligne', hasPersonKey(), false);
check('sans clé, ma carte est introuvable', await loadMyCard(), null);

const { key: maCle } = await createCard(maCarte);
check('publier sa carte donne une clé', hasPersonKey(), true);

const relue = await loadMyCard();
check('ma carte se relit avec son prénom', relue?.first_name, 'Test');
check('ma carte garde sa ville', relue?.home_city, 'Auxerre');
check('le verso garde l’IBAN pour son propriétaire', (relue?.card as { iban?: string })?.iban, 'FR7630006000011234567890189');

const reconstruite = personToCard(relue ?? ({} as never), EMPTY_CARD);
check('la carte se reconstruit à l’identique', [reconstruite.firstName, reconstruite.from, reconstruite.to], ['Test', '18:30', '23:00']);
check('et son régime la suit', reconstruite.diet, ['Végétarien']);

const place = await joinWedding({ slug: created.site.slug }, 'fleuriste');
check('rejoindre un mariage depuis la base locale', place.role_id, 'fleuriste');
check('la place se retrouve dans mes mariages', (await listMyMemberships()).length, 1);

const enCollection = await listWeddingPeople({ slug: created.site.slug });
check('la collection rend une carte', enCollection.length, 1);
check(
  'le propriétaire retrouve son IBAN dans sa propre collection',
  (enCollection[0].card as { iban?: string })?.iban,
  'FR7630006000011234567890189',
);

/* — le même mariage, lu par quelqu’un qui n’a pas de clé */
forgetPersonToken();
const anonyme = await listWeddingPeople({ slug: created.site.slug });
check('la collection reste lisible quand le mariage est publié', anonyme.length, 1);
check('la collection rend une carte', anonyme[0].trade, 'Fleuriste');
check('l’IBAN ne sort pas vers un lecteur qui n’y a pas droit', 'iban' in (anonyme[0].card ?? {}), false);
check('les pièces non plus', 'documents' in (anonyme[0].card ?? {}), false);
check('les coordonnées « participants » non plus', anonyme[0].email, '');
adoptPersonKey(maCle);
check('la clé se reprend ailleurs', hasPersonKey(), true);

/* — ce que la carte affiche quand une donnée a été retirée par le serveur */
const masquee = renderToStaticMarkup(
  createElement(
    MemoryRouter,
    null,
    createElement(WeddingCard, { card: reconstruite, redacted: { contacts: true, prive: true } } as never),
  ),
);
check('une carte masquée le dit au lieu de mentir', masquee.includes('Coordonnées réservées'), true);
check('les pièces masquées aussi', masquee.includes('Pièces et IBAN réservés'), true);
check('aucun IBAN, même tronqué, n’apparaît', masquee.includes('FR76'), false);

/* ------------------------------------------------- la refonte : carte & écrans */

/*
 * L'accueil ne demande plus d'univers et n'a plus de formulaire : un bouton,
 * « Créer ma carte », qui mène à la page de création. L'univers se découvre sur
 * le mini-site — et se change dans l'éditeur, jamais avant.
 */
const accueil = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/'] }, createElement(Landing as never)),
);
check('l’accueil met le bouton de création dans son hero', accueil.includes('Créer ma carte'), true);
check('l’accueil ne pose plus la question du rôle', accueil.includes('Qui êtes-vous ?'), false);
check('l’accueil ne fait plus choisir d’univers', accueil.includes('Quel univers ?'), false);
check(
  'l’accueil garde la porte de la carte',
  accueil.includes('J’ai déjà une carte'),
  true,
);

/* L'écran invité parle la langue du mini-site : capsule du site, hero du site,
   accent du thème, sections du site. */
const styleCorse = styleById('corse');
const ecranInvite = renderToStaticMarkup(
  createElement(GuestPhoneScreen as never, { style: styleCorse, content: contentFor(styleCorse) }),
);
check('l’écran invité porte la capsule du site', ecranInvite.includes('VOWS'), true);
check('l’écran invité garde l’étiquette du rôle', ecranInvite.includes('Invitation privée'), true);
check('l’écran invité ouvre sur la réponse', ecranInvite.includes('Répondre à l’invitation'), true);
check('l’écran invité prend l’accent de l’univers', ecranInvite.includes(styleCorse.accent), true);
check(
  'l’écran invité n’a plus de vert de cagnotte',
  ecranInvite.includes('bg-emerald-500'),
  false,
);

/* Le verso de la carte ne parle que du rôle tenu. */
const carteInvite = renderToStaticMarkup(
  createElement(
    MemoryRouter,
    null,
    createElement(WeddingCard as never, {
      card: { ...EMPTY_CARD, roleId: 'invites', firstName: 'Claire' } as CardData,
    }),
  ),
);
check('le recto de la carte est un grand visuel', carteInvite.includes('vp-live-frame'), true);
check('la carte d’un invité n’affiche pas de tarif', carteInvite.includes('Tarif'), false);

const cartePresta = renderToStaticMarkup(
  createElement(
    MemoryRouter,
    null,
    createElement(WeddingCard as never, {
      card: { ...EMPTY_CARD, roleId: 'photographe', firstName: 'Marc' } as CardData,
    }),
  ),
);
check('la carte d’un prestataire affiche son tarif', cartePresta.includes('Tarif'), true);
check('la carte d’un prestataire ignore le repas', cartePresta.includes('Rien de particulier'), false);

/* ------------------------------------------------------------------- bilan */

if (failures.length > 0) {
  console.error(`\n✗ Interface — ${failures.length} échec(s) :\n`);
  for (const f of failures) console.error(`   • ${f}\n`);
  process.exitCode = 1;
} else {
  console.log(`\n✓ Interface — ${pass} vérifications réussies, 0 échec(s)\n`);
}

// framer-motion laisse une boucle d’animation ouverte après un rendu serveur :
// sans cela, Node attendrait un handle qui ne se referme jamais.
process.exit(failures.length > 0 ? 1 : 0);
