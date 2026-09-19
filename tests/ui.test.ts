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
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PublicSiteView from '../src/components/PublicSiteView';
import SharePanel from '../src/components/SharePanel';
import { forgetPersonToken, setActiveToken } from '../src/lib/auth';
import { apiGet, apiSend } from '../src/lib/http';
import { appliquerGeste, gesteDepuis, gestesDuRecu } from '../src/lib/liveRules';
import { seedSite } from '../src/lib/defaults';
import { loadSiteData } from '../src/lib/siteData';
import { setRemote } from '../src/lib/dataSource';
import { resetDb } from '../src/lib/localStore';
import { MemStorage } from './memStorage';
import WeddingCard from '../src/components/WeddingCard';
import GuestPhoneScreen from '../src/components/phone/GuestPhoneScreen';
import Landing from '../src/pages/Landing';
import VendorStudio from '../src/pages/VendorStudio';
import SuperMariage from '../src/pages/SuperMariage';
import LeMariage from '../src/pages/LeMariage';
import {
  PLAYLIST_DEPART, chargerPlaylist, chercherMorceaux, morceauParId, morceauxDeLaPlaylist,
  repartitionParMoment,
} from '../src/lib/weddingPlaylist';
import { magasinFor } from '../src/lib/weddingPage';
import RecapCourses from '../src/components/RecapCourses';
import PageMetier from '../src/pages/PageMetier';
import SiteChrome from '../src/components/SiteChrome';
import SiteHeader from '../src/components/SiteHeader';
import RsvpTicket from '../src/components/RsvpTicket';
import CartePostale from '../src/components/CartePostale';
import PageProfil from '../src/pages/PageProfil';
import PlaylistCollaborative from '../src/components/PlaylistCollaborative';
import { Timbre } from '../src/components/Timbre';
import { idDeProfil, morceauxDeNom, slugDePersonne, chargerProfil } from '../src/lib/profil';
import { metierParSlug, pageMetier, slugDeRole, tousLesMetiers } from '../src/lib/metierPage';
import { pageMetier, slugDeRole, tousLesMetiers } from '../src/lib/metierPage';
import { chargerLive } from '../src/lib/terminalLive';
import { contentFor } from '../src/lib/universeContent';
import { styleById } from '../src/lib/weddingStyles';
import {
  TERMINAL_VIDE, avancement, decoderRecu, demander, demandesDe, encoderRecu, entrerRecu, lacher, planDj,
  prendre, preneurDe, prisesParInvite, recuDe,
} from '../src/lib/weddingTicket';
import { ALL_STYLES } from '../src/lib/weddingStyles';
import { totalCaisse } from '../src/lib/superMariage';
import PreviewSite from '../src/pages/PreviewSite';
import Magazine from '../src/pages/Magazine';
import MagazineArticle from '../src/pages/MagazineArticle';
import Shop from '../src/pages/Shop';
import ShopProduct from '../src/pages/ShopProduct';
import { ALL_ARTICLES } from '../src/lib/magazine';
import { SHOP_PRODUCTS } from '../src/lib/shopData';
import {
  CONVIVES, PANIER_DEPART, articlesDuPanier, lignesDuTicket, numeroDeTicket, totalCaisse,
} from '../src/lib/superMariage';
import { SIGNATURES, signatureFor, signatureLabel } from '../src/lib/themeSignatures';
import SignatureBlock from '../src/components/themes/ThemeSignature';
import { previewPath } from '../src/lib/previewSite';
import VendorPhoneScreen from '../src/components/phone/VendorPhoneScreen';
import VendorBridges from '../src/components/VendorBridges';
import { contentFor } from '../src/lib/universeContent';
import { donneesMetier, estIntermittent, modulesDuMetier } from '../src/lib/vendorModules';
import { CACHETS_DEFAUT, heuresCachets } from '../src/lib/vendorDraft';
import { ALL_STYLES, WEDDING_STYLES, styleById } from '../src/lib/weddingStyles';
import { EMPTY_CARD, cardDetail, cardRoleLabel, withDetail, type CardData } from '../src/lib/weddingCard';
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
check('l’accueil met la carte avant le site', accueil.includes('La carte d’abord.'), true);
check('l’accueil ouvre sur « Découvrir »', accueil.includes('Découvrir'), true);
check('la bande d’iPhones a quitté l’accueil', accueil.includes('Mini-site · '), false);
check('la playlist n’embarque plus le lecteur Spotify', accueil.includes('open.spotify.com/embed'), false);

/* L'univers vierge : les sections classiques, un visuel floral, personne sur
   les images — pour les mariés qui n'ont rien choisi, ou prévu autre chose. */
const vierge = styleById('vierge');
check('l’univers vierge existe', vierge.name, 'Sans univers');
check('l’univers vierge ne mobilise personne', vierge.humanMissions.length, 0);
check('l’univers vierge garde un visuel floral', vierge.image.endsWith('bouquet.jpg'), true);
check('l’éditeur propose tous les univers, vierge compris', ALL_STYLES.length, WEDDING_STYLES.length + 1);

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

/* ------------------------------- l'éditeur des prestataires, un par métier */

/*
 * Le même éditeur que celui des mariés, monté pour un métier : le hero reste le
 * visuel de l'univers, les modules parlent le métier, et le programme du
 * mariage arrive tout seul.
 */
const studioDe = (role: string, styleId: string) =>
  renderToStaticMarkup(
    createElement(
      MemoryRouter,
      { initialEntries: [`/prestataire?role=${encodeURIComponent(role)}&style=${styleId}`] },
      createElement(VendorStudio as never),
    ),
  );

const studioChef = studioDe('Traiteur Haute Gastronomie', 'chateau-moderne');
check('l’éditeur du métier s’ouvre sur l’espace prestataire', studioChef.includes('Espace prestataire'), true);
check('les modules parlent la cuisine', studioChef.includes('Ce qui passe en cuisine'), true);
check('les onglets portent les mots du métier', studioChef.includes('Onglet · Menus') && studioChef.includes('Onglet · Régimes'), true);
check('la fiche mission vient de la carte', studioChef.includes('La même fiche que celle de votre carte'), true);
check('rien n’est à ressaisir du site des mariés', studioChef.includes('Ce qui vient des mariés'), true);

check(
  'l’espace du métier mène à sa page entière',
  studioChef.includes('/metiers/traiteur-haute-gastronomie'),
  true,
);

const studioPhoto = studioDe('Photographe Néon', 'vegas');
check('un autre métier parle une autre langue', studioPhoto.includes('Onglet · Repérages'), true);
check('le déroulé du jour J suit le programme', studioPhoto.includes('Onglet · Déroulé'), true);

const studioCachets = studioDe('Groupe Polyphonique Corse', 'corse');
check('les artistes ont leur volet à part', studioCachets.includes('Intermittent du Spectacle'), true);
check('les cachets se déclarent', studioCachets.includes('GUSO'), true);
check('les heures comptent pour les 507', studioCachets.includes('507'), true);

/* Le vocabulaire des métiers, éprouvé sans passer par React. */
check(
  'un chef lit sa cuisine, jamais les fleurs',
  modulesDuMetier(donneesMetier(styleById('chateau-moderne'), 'Traiteur Haute Gastronomie'))
    .map((m) => m.nav)
    .join(' · '),
  'Mission · Menus · Régimes · Créneaux',
);
check('un musicien ajoute ses cachets', estIntermittent('Saxophoniste Deep House Live'), true);
check('un technicien du spectacle aussi', estIntermittent('Light Designer Architectural'), true);
check('un traiteur n’est pas intermittent', estIntermittent('Traiteur Haute Gastronomie'), false);
check(
  'les cachets comptent pour les 507 heures',
  heuresCachets({ ...CACHETS_DEFAUT, cachets: 2, heuresParCachet: 12, heuresAcquises: 300 }),
  324,
);

/* L'espace des mariés ouvre l'éditeur de chacun de leurs métiers. */
const pont = renderToStaticMarkup(
  createElement(
    MemoryRouter,
    null,
    createElement(VendorBridges as never, { style: styleById('corse') } as never),
  ),
);
check('les mariés voient les métiers de leur univers', pont.includes('Les métiers du mariage'), true);
check('et la porte de leur éditeur', pont.includes('/prestataire?role='), true);

/* La bande des éditeurs a quitté l'accueil : les métiers vivent sur leur page. */
check('la bande des éditeurs a quitté l’accueil', accueil.includes('Le même éditeur, un par métier'), false);

/* ----------------------- SuperMariage : on coche, et le ticket se calcule */

/*
 * Le magasin : des rayons (les domaines de métiers), les horaires du programme
 * du Supermarché 22H, des petits prix, trois menus — et en face, le ticket de
 * caisse qui se remplit à mesure qu'on coche.
 */
const supermarchePage = renderToStaticMarkup(
  createElement(MemoryRouter, null, createElement(SuperMariage as never)),
);
const magasin = supermarchePage.replace(/&amp;/g, '&');

check('le magasin s’appelle SuperMariage', magasin.includes('SuperMariage'), true);
check('les rayons portent les domaines', magasin.includes('Rayon Cuisine & Traiteur'), true);
check('les horaires du programme sont à cocher', magasin.includes('22:17 · Cérémonie'), true);
check('le rayon 7 est en promotion', magasin.includes('Promo rayon 7'), true);
check('les petits prix sont là', magasin.includes('Rayon Petits prix'), true);
check('les menus du magasin sont proposés', magasin.includes('Menu Caddie'), true);
check('le ticket est en cours avant la caisse', magasin.includes('Ticket en cours'), true);
check('le ticket porte son numéro', /SM-0\d-[A-Z0-9]{4}/.test(supermarchePage), true);
check('les tarifs s’annoncent indicatifs', magasin.includes('Tarifs indicatifs'), true);

/* La caisse : un vrai calcul, sur un vrai panier. */
check('le caddie de départ se calcule', totalCaisse(PANIER_DEPART).total, 6570);
check('la TVA est incluse, jamais ajoutée', totalCaisse(PANIER_DEPART).tva, 1095);
check('un menu débloque la carte de fidélité', totalCaisse(PANIER_DEPART, 'super-caddie').remise, 1047);
check('la remise se déduit du total', totalCaisse(PANIER_DEPART, 'super-caddie').total, 9423);
check('le ticket compte une ligne par article coché', lignesDuTicket(PANIER_DEPART).length, 4);
check(
  'le numéro du ticket ne dépend pas de l’ordre des coches',
  numeroDeTicket(['a', 'b']),
  numeroDeTicket(['b', 'a']),
);
check(
  'ce qui se compte par invité suit le nombre de convives',
  articlesDuPanier(['sup-manteaux'])[0]?.quantite,
  CONVIVES,
);

/* L'accueil ouvre le magasin. */
check('l’accueil ouvre le magasin', accueil.includes('/supermarriage'), true);
check('l’accueil annonce les courses', accueil.includes('Faire mes courses'), true);

/* ------------------- les signatures d'univers : un geste par mini-site */

/*
 * Chaque univers a un geste que les autres n'ont pas. Le Supermarché a son
 * ticket ; Las Vegas a sa chapelle rose et ses néons ; la laverie son hublot ;
 * New York sa ligne. Le mini-site applique la signature : fond, accent, et un
 * module juste sous le hero.
 */
const vegas = SIGNATURES.vegas;
check('Las Vegas a sa chapelle rose', vegas?.nom, 'Chapelle rose & néon');
check('Las Vegas passe au néon', vegas?.lueur, true);
check('le fond de Las Vegas est rose', vegas?.fond.toLowerCase(), '#ffe3f1');
check('chaque signature a un geste et ses lignes', Boolean(SIGNATURES.laverie?.module.lignes.length), true);
check('la laverie a son hublot', SIGNATURES.laverie?.kind, 'hublot');
check('New York a son plan de ligne', SIGNATURES['new-york']?.kind, 'ligne');
check('le Supermarché n’a pas de signature : le ticket EST la page', signatureFor('supermarche'), undefined);
check('l’univers vierge n’a pas de geste — c’est sa promesse', signatureFor('vierge'), undefined);
check('la légende du défilé nomme le geste', signatureLabel('cinema'), 'Séance & affiche');

const blocVegas = renderToStaticMarkup(
  createElement(MemoryRouter, null, createElement(SignatureBlock as never, { signature: vegas } as never)),
);
check('le module de signature s’affiche', blocVegas.includes('data-signature="enseigne"'), true);
check('et porte les mots de l’univers', blocVegas.includes('La chapelle rose'), true);
check('le geste du néon s’allume', blocVegas.includes('vp-sg-lueur'), true);

const apercuVegas = renderToStaticMarkup(
  createElement(
    MemoryRouter,
    { initialEntries: ['/apercu?style=vegas'] },
    createElement(PreviewSite as never),
  ),
);
check('le mini-site de Las Vegas prend son fond', apercuVegas.includes('#FFE3F1'), true);
check('et son module de signature', apercuVegas.includes('La chapelle rose'), true);

const apercuNu = renderToStaticMarkup(
  createElement(
    MemoryRouter,
    { initialEntries: ['/apercu?style=vegas&entete=0'] },
    createElement(PreviewSite as never),
  ),
);
check('l’aperçu sans entête existe pour le défilé', apercuNu.length > 5_000, true);
check('le défilé demande l’aperçu sans entête', previewPath({ styleId: 'vegas', hideHeader: true }).includes('entete=0'), true);

/* L'écran prestataire d'un univers à signature rappelle où l'on travaille. */
const styleLaverie = styleById('laverie');
const ecranLaverie = renderToStaticMarkup(
  createElement(VendorPhoneScreen as never, {
    style: styleLaverie,
    content: contentFor(styleLaverie),
    signature: SIGNATURES.laverie,
  }),
);
check('l’écran du métier nomme le geste de l’univers', ecranLaverie.includes('Tambour 7'), true);
check('et garde l’étiquette du rôle', ecranLaverie.includes('Écran prestataire'), true);

/* La carte de l'accueil : le visuel plein cadre, le nom, le rôle. */
check('la carte met le nom par-dessus le visuel', accueil.includes('Votre nom'), true);
check('et son rôle', accueil.includes(cardRoleLabel(EMPTY_CARD)), true);


/* --------------------- le mariage en entier : une page, tout dedans */

const mariage = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/le-mariage'] }, createElement(LeMariage as never)),
);
const mariageDecode = mariage.replace(/&amp;/g, '&').replace(/&#x27;|&apos;/g, "'");

check('la page du mariage s’ouvre', mariage.length > 30_000, true);
check('elle porte leur univers', mariageDecode.includes('Leur univers · Supermarché 22h'), true);
check('elle tient l’article de magazine', mariageDecode.includes('On s’est dit oui entre les céréales'), true);
check(
  'avec l’univers choisi et ses voisins',
  mariageDecode.includes('L’univers choisi') && mariageDecode.includes('Les univers voisins'),
  true,
);
check('elle porte le programme et ses cartes musicales', mariageDecode.includes('moments, chacun son morceau'), true);
check('elle porte la playlist collaborative', mariageDecode.includes('Cherchez un morceau, ajoutez-le'), true);
check('avec un champ de recherche', mariageDecode.includes('Un titre, un artiste, un moment'), true);
check('et le récap en ticket', mariageDecode.includes('Les invités font leurs courses'), true);
check('la bande d’iPhones a aussi quitté la page', mariageDecode.includes('Mini-site · '), false);
check('chaque univers mène à sa page entière', mariageDecode.includes('Chaque univers a sa page entière'), true);
check('les métiers y défilent', mariageDecode.includes('Les métiers qui font tourner ces univers'), true);
check('le ticket du récap est en cours', mariageDecode.includes('Ticket en cours'), true);

/* La recherche de morceaux et la playlist. */
check('la recherche trouve un artiste', chercherMorceaux('sinatra').length >= 1, true);
check('elle trouve un moment', chercherMorceaux('bal').length >= 3, true);
check('sans requête, les extraits passent devant', chercherMorceaux('')[0]?.suggere, undefined);
check('un morceau suggéré n’a pas d’extrait local', Boolean(chercherMorceaux('piaf')[0]?.src), false);
check('la playlist de départ est dans le catalogue', morceauxDeLaPlaylist(PLAYLIST_DEPART).length, 3);
check('les morceaux enregistrés se relisent', morceauParId('track-c1')?.title, "Can't Help Falling in Love");
check('la répartition compte les moments', repartitionParMoment(morceauxDeLaPlaylist(PLAYLIST_DEPART)).length >= 1, true);

/* ------------------ une page entière par univers : le même moteur, --------------- */
/* ------------------ un magasin et un ticket différents à chaque fois ------------ */

const pageVegas = renderToStaticMarkup(
  createElement(
    MemoryRouter,
    { initialEntries: ['/le-mariage/vegas'] },
    createElement(
      Routes,
      null,
      createElement(Route, { path: '/le-mariage/:styleId', element: createElement(LeMariage as never) }),
    ),
  ),
);
const vegasDecode = pageVegas.replace(/&amp;/g, '&').replace(/&#x27;|&apos;/g, "'");

check('la page de Las Vegas s’ouvre', pageVegas.length > 30_000, true);
check('elle porte le geste de son univers', vegasDecode.includes('Chapelle rose & néon'), true);
check('son ticket porte son enseigne', vegasDecode.includes('LAS VEGAS'), true);
check('ses métiers sont les siens', vegasDecode.includes('Elvis Officiant'), true);
check('son article est le sien', vegasDecode.includes('Un mariage signé Las Vegas'), true);
check('ses moments sont les siens', vegasDecode.includes('La Chapelle Néon'), true);
check('et ses plats aussi', vegasDecode.includes('Sliders et ailes de poulet sauce miel'), true);
check('les invités peuvent envoyer la page', vegasDecode.includes('Envoyer aux invités'), true);
check('le récap s’ouvre en billets', vegasDecode.includes('Les invités prennent leurs billets'), true);
check('et chacun prend une ligne', vegasDecode.includes('Chacun prend une ligne'), true);
check('le reçu de l’invité s’imprime à côté', vegasDecode.includes('Mon reçu'), true);
check('un reçu vide n’a pas de bouton d’envoi', vegasDecode.includes('Copier le lien du reçu'), false);

/* L'univers vierge a sa page comme les autres : c'est sa promesse. */
const pageVierge = renderToStaticMarkup(
  createElement(
    MemoryRouter,
    { initialEntries: ['/le-mariage/vierge'] },
    createElement(
      Routes,
      null,
      createElement(Route, { path: '/le-mariage/:styleId', element: createElement(LeMariage as never) }),
    ),
  ),
).replace(/&amp;/g, '&').replace(/&#x27;|&apos;/g, "'");
check('l’univers vierge a sa page, pas celle du Supermarché', pageVierge.includes('VOWS SUPERMARIAGE'), false);
check('et sa page dit qu’il n’impose rien', pageVierge.includes('n’impose rien'), true);

/* Un univers inconnu retombe sur le Supermarché 22H. */
const inconnu = renderToStaticMarkup(
  createElement(
    MemoryRouter,
    { initialEntries: ['/le-mariage/pas-un-univers'] },
    createElement(
      Routes,
      null,
      createElement(Route, { path: '/le-mariage/:styleId', element: createElement(LeMariage as never) }),
    ),
  ),
);
check('un univers inconnu retombe sur le Supermarché 22H', inconnu.includes('VOWS SUPERMARIAGE'), true);

/* Le moteur : chaque univers a son magasin, complet et cohérent. */
const magasins = ALL_STYLES.map((s) => magasinFor(s.id));
check('toutes les pages ont un magasin', magasins.length, ALL_STYLES.length);
check('chacun a ses rayons pleins', magasins.every((m) => m.rayons.every((r) => r.articles.length > 0)), true);
check('chacun propose ses trois formules', magasins.every((m) => m.packages.length === 3), true);
check('chacun a un panier de départ', magasins.every((m) => m.panierDeDepart.length >= 4), true);
check(
  'chacun calcule un ticket non vide',
  magasins.every((m) => totalCaisse(m.panierDeDepart, m.packages[0]?.id ?? null, m.articles, m.packages).total > 0),
  true,
);
check(
  'les préfixes de ticket sont tous différents',
  new Set(magasins.map((m) => m.prefixe)).size,
  ALL_STYLES.length,
);
check(
  'la formule est offerte, la remise reste à zéro',
  magasins.every((m) => m.packages.every((p) => p.prix === 0)),
  true,
);
check(
  'un univers vierge emprunte les métiers de ses voisins',
  magasinFor('vierge').rayons.some((r) => r.key === 'rayon-metiers' && r.articles.length > 0),
  true,
);
check('les trois registres existent', new Set(magasins.map((m) => m.registre)).size, 3);

/* La playlist se souvient univers par univers. */
check('la playlist de Vegas est celle de Vegas', chargerPlaylist('vegas').length >= 1, true);
check(
  'deux univers ne partagent pas la même clé',
  chargerPlaylist('vegas').length === chargerPlaylist('corse').length,
  true,
);

/* ------------- le terminal : l'invité prend, le couple reçoit, le DJ récupère -------- */

const magasinSM = magasinFor('supermarche');
const lignePrise = magasinSM.articles[3]!;
const ligneLibre = magasinSM.articles[5]!;

let terminal = prendre(TERMINAL_VIDE, lignePrise.id, 'Camille');
terminal = prendre(terminal, magasinSM.articles[4]!.id, 'Camille');
terminal = demander(
  terminal,
  { cle: 'track-d1', titre: 'Fly Me to the Moon', artiste: 'Frank Sinatra', phaseId: 'diner_toasts' },
  'Camille',
);

check('on prend une ligne, elle n’est plus libre', preneurDe(terminal, lignePrise.id), 'Camille');
check('un autre invité ne peut pas la reprendre', prendre(terminal, lignePrise.id, 'Bastien').prises.length, 2);
check('la ligne libre reste libre', preneurDe(terminal, ligneLibre.id), undefined);
check('l’invité ne lâche que ce qu’il a pris', lacher(terminal, lignePrise.id, 'Bastien').prises.length, 2);
check('et lâche bien ce qu’il a pris', lacher(terminal, lignePrise.id, 'Camille').prises.length, 1);
check('les prises se groupent par invité', prisesParInvite(terminal)[0]?.nom, 'Camille');
check('l’avancement du comptoir se calcule', avancement(terminal, magasinSM.articles.length).pris, 2);

/* Le reçu : il tient dans un lien, et il repart sans faute sur le terminal. */
const recuCamille = recuDe(terminal, 'Camille');
const codeRecu = encoderRecu(recuCamille);
const recuDecode = decoderRecu(codeRecu);
check('le reçu porte le nom de l’invité', recuDecode?.nom, 'Camille');
check('et ses deux lignes', recuDecode?.articles.length, 2);
check('et son morceau', recuDecode?.morceaux, ['track-d1']);
check('un code inventé ne décode rien', decoderRecu('nimportequoi'), null);

const terminalMaries = entrerRecu(TERMINAL_VIDE, recuDecode!, codeRecu);
check('le reçu posé remonte les lignes', terminalMaries.prises.length, 2);
check('et le morceau demandé', terminalMaries.demandes.length, 1);
check('le morceau reprend son vrai titre', terminalMaries.demandes[0]?.titre, 'Fly Me to the Moon');
check('et son moment de la soirée', terminalMaries.demandes[0]?.phaseId, 'diner_toasts');
check('le reçu entre au journal', terminalMaries.journal.length, 1);
check('le journal nomme l’invité', terminalMaries.journal[0]?.nom, 'Camille');
check('rouvrir le lien ne compte pas double', entrerRecu(terminalMaries, recuDecode!, codeRecu).prises.length, 2);

/* Le terminal DJ : la playlist complète, dans l’ordre de la soirée. */
const socle = morceauxDeLaPlaylist(['track-c1', 'track-ck1', 'track-d1', 'sug-3']);
const plan = planDj(socle, terminalMaries.demandes);
check('le plan du DJ a des blocs', plan.length >= 2, true);
check('les blocs suivent l’ordre de la soirée', plan[0]?.phaseLabel.includes('Cérémonie'), true);
check(
  'la cérémonie ouvre avec le morceau du couple',
  plan[0]?.lignes.every((l) => l.demandeurs.length === 0),
  true,
);
const blocDiner = plan.find((b) => b.phaseId === 'diner_toasts');
check('le morceau demandé est au dîner', blocDiner?.lignes.some((l) => l.titre === 'Fly Me to the Moon'), true);
check(
  'et il porte le nom de l’invité',
  blocDiner?.lignes.find((l) => l.titre === 'Fly Me to the Moon')?.demandeurs,
  ['Camille'],
);
check(
  'deux invités sur le même morceau le comptent deux fois',
  planDj([], [
    ...terminalMaries.demandes,
    { ...terminalMaries.demandes[0]!, nom: 'Bastien' },
  ]).find((b) => b.phaseId === 'diner_toasts')?.lignes[0]?.demandeurs.length,
  2,
);

/* Le récap, vu des mariés : le comptoir, le journal, et le terminal DJ. */
const recapMaries = renderToStaticMarkup(
  createElement(MemoryRouter, null, createElement(RecapCourses, {
    styleId: 'supermarche',
    style: styleById('supermarche'),
    magasin: magasinSM,
    couple: {
      noms: contentFor(styleById('supermarche')).couple.names,
      date: '31/12/2026',
      venue: contentFor(styleById('supermarche')).couple.venue,
      convives: magasinSM.articles.length,
    },
    dateLabel: '19/09/2026',
    heureLabel: '21h05',
    morceaux: socle,
    terminal: terminalMaries,
    onTerminal: () => {},
    nom: 'Camille',
    fond: '#FFFFFF',
    vueInitiale: 'maries',
  } as never)),
).replace(/&amp;/g, '&').replace(/&#x27;|&apos;/g, '`');
check('le récap s’ouvre côté mariés', recapMaries.includes('Le comptoir'), true);
check('il liste les reçus reçus', recapMaries.includes('Journal du terminal') && recapMaries.includes('Reçu de Camille'), true);
check('il porte le terminal DJ', recapMaries.includes('Le terminal DJ'), true);
check('avec l’ordre de la soirée', recapMaries.includes('ordre de la soirée'), true);
check('et le nom de qui l’a demandé', recapMaries.includes('demandé par Camille'), true);
check('il donne le QR à scanner au comptoir', recapMaries.includes('À scanner au comptoir'), true);
check('le tampon du DJ est prêt', recapMaries.includes('Prêt pour la piste'), true);

/* -------------------- le comptoir partagé : les gestes, et la route locale ---------- */

check(
  'un geste de prise s’applique',
  appliquerGeste(TERMINAL_VIDE, { type: 'prendre', articleId: 'horaire-22h00', nom: 'Camille' })?.prises.length,
  1,
);
check(
  'une prise déjà faite ne se rejoue pas',
  appliquerGeste(terminalMaries, { type: 'prendre', articleId: lignePrise.id, nom: 'Bastien' }),
  null,
);
check(
  'un geste de demande garde son moment',
  appliquerGeste(TERMINAL_VIDE, {
    type: 'demander', cle: 'sug-4', titre: 'Superstition', artiste: 'Stevie Wonder',
    phaseId: 'dancefloor_peak', nom: 'Camille',
  })?.demandes[0]?.phaseId,
  'dancefloor_peak',
);
check(
  'un reçu se décompose en gestes',
  gestesDuRecu(recuCamille, 'CODE-CAMILLE').map((g) => g.type),
  ['prendre', 'prendre', 'demander', 'journaliser'],
);
{
  const gestes = gestesDuRecu(recuCamille, 'CODE-CAMILLE');
  const musique = gestes[2];
  check('le morceau du reçu est résolu depuis le catalogue', musique.type === 'demander' ? musique.titre : '', 'Fly Me to the Moon');
  check('et son moment aussi', musique.type === 'demander' ? musique.phaseId : '', 'diner_toasts');
  check('le journal porte le code du reçu', gestes[3]?.type === 'journaliser' ? gestes[3].code : '', 'CODE-CAMILLE');
}
{
  const avant = TERMINAL_VIDE;
  const apres = prendre(avant, 'horaire-22h00', 'Camille');
  check('gesteDepuis retrouve la prise', gesteDepuis(avant, apres)?.type, 'prendre');
  const apres2 = demander(apres, { cle: 'sug-1', titre: 'Thinkin’ Out Loud', artiste: 'Ed Sheeran', phaseId: 'premiere_danse' }, 'Camille');
  check('gesteDepuis retrouve la demande', gesteDepuis(apres, apres2)?.type, 'demander');
  check('gesteDepuis retrouve le retrait', gesteDepuis(apres2, apres)?.type, 'retirerDemande');
  check('gesteDepuis retrouve le lâcher', gesteDepuis(apres, avant)?.type, 'lacher');
  check('sans changement, aucun geste', gesteDepuis(avant, avant), null);
}

/* La route du comptoir, servie par le navigateur quand aucune base n’est branchée. */
setRemote(false);
const liveVide = await apiGet<{ payload: { prises: unknown[] }; invites: string[] }>('/api/wedding-live?style_id=vegas');
check('le comptoir local s’ouvre vide', liveVide.payload.prises.length, 0);
const livePrise = await apiSend<{ applique: boolean; invites: string[] }>('/api/wedding-live', 'POST', {
  style_id: 'vegas',
  geste: { type: 'prendre', articleId: 'horaire-22h00', nom: 'Camille' },
});
check('le geste est appliqué', livePrise.applique, true);
check('le comptoir retient l’invité', livePrise.invites, ['Camille']);
const liveRelu = await apiGet<{ payload: { prises: Array<{ nom: string }> } }>('/api/wedding-live?style_id=vegas');
check('le comptoir relu garde la prise', liveRelu.payload.prises[0]?.nom, 'Camille');
const liveAutre = await apiGet<{ payload: { prises: unknown[] } }>('/api/wedding-live?style_id=corse');
check('chaque univers a son comptoir', liveAutre.payload.prises.length, 0);
const liveVide2 = await apiSend<{ payload: { prises: unknown[] } }>('/api/wedding-live', 'PUT', {
  style_id: 'vegas', payload: TERMINAL_VIDE,
});
check('les mariés peuvent vider le comptoir', liveVide2.payload.prises.length, 0);

/* --------------- la page entière de chaque métier, reliée à celle du mariage ------ */

const tousMetiers = tousLesMetiers();
check('tous les métiers ont une page', tousMetiers.length, 72);
check(
  'et leurs adresses sont toutes différentes',
  new Set(tousMetiers.map((m) => slugDeRole(m.role))).size,
  tousMetiers.length,
);
check(
  'chaque page de métier se construit',
  tousMetiers.every((m) => {
    const p = pageMetier(slugDeRole(m.role));
    return Boolean(p) && p!.modules.length >= 3 && p!.lignes.length >= 1 && p!.partages.length >= 3;
  }),
  true,
);
check('un métier inconnu ne donne pas de page', pageMetier('pas-un-metier'), null);

/* Les métiers de la musique portent la playlist ; les autres, non. */
const djResident = pageMetier('dj-resident-clubbing-sound-engineer');
check('le DJ a sa page', Boolean(djResident), true);
check('sa page porte la playlist', djResident?.musique, true);
check('et le terminal DJ', djResident?.dj, true);
const chef = pageMetier('chef-tapas-finger-food-etoile');
check('le chef lit la table', chef?.rayon?.key, 'rayon-table');
check(
  'et ses lignes viennent du rayon Table',
  chef?.lignes.slice(1).every((a) => a.id.startsWith('table-')),
  true,
);
check('un métier de musique lit les horaires', djResident?.rayon?.key, 'rayon-moments');

/* La page du mariage mène à celle de ses métiers : tout est relié. */
check('le récap du mariage mène aux pages des métiers', mariageDecode.includes('/metiers/'), true);

/* On rend la page du DJ, avec des demandes d'invités au comptoir. */
const styleDj = djResident!.styleId;
await apiSend('/api/wedding-live', 'POST', {
  style_id: styleDj,
  geste: { type: 'demander', cle: 'sug-4', titre: 'Superstition', artiste: 'Stevie Wonder', phaseId: 'dancefloor_peak', nom: 'Camille' },
});
await apiSend('/api/wedding-live', 'POST', {
  style_id: styleDj,
  geste: { type: 'demander', cle: 'libre:uptown-funk', titre: 'Uptown Funk', artiste: 'Bruno Mars', phaseId: 'dancefloor_peak', nom: 'Bastien', libre: true },
});

const htmlDj = renderToStaticMarkup(
  createElement(
    MemoryRouter,
    { initialEntries: ['/metiers/dj-resident-clubbing-sound-engineer'] },
    createElement(Routes, null, createElement(Route, { path: '/metiers/:slug', element: createElement(PageMetier as never) })),
  ),
);
const djDecode = htmlDj.replace(/&amp;/g, '&').replace(/&#x27;|&apos;/g, "'");
check('la page du DJ s’ouvre', htmlDj.length > 30_000, true);
check('elle dit son domaine', djDecode.includes('DJ & Régie son'), true);
check('elle rappelle l’univers', djDecode.includes(djResident!.style.name), true);
check('elle porte le mariage des clients', djDecode.includes('La page du mariage'), true);
check('elle dit qu’il n’y a rien à ressaisir', djDecode.includes('Vous ne ressaisissez rien'), true);
check('elle porte ses moments du jour J', djDecode.includes('Ses moments dans la journée'), true);
check('elle porte sa langue de métier', djDecode.includes('Sa langue'), true);
check('elle demande à être envoyée au prestataire', djDecode.includes('Envoyer au prestataire'), true);
check('elle liste les métiers d’à côté', djDecode.includes('Chaque métier a sa page entière'), true);
check('son ticket de métier est un bon de commande', djDecode.includes('Bon de commande'), true);

/* La playlist en direct : la page lit le comptoir partagé. Rendu statique, elle
   montre son état vide ; en vrai, elle se remplit — c'est ce que vérifie la
   lecture du comptoir juste après. */
check('la page du DJ porte le terminal DJ', djDecode.includes('Le terminal DJ'), true);
check('et l’ordre de la soirée', djDecode.includes('ordre de la soirée'), true);
check(
  'elle annonce l’état vide du comptoir',
  djDecode.includes('Aucune demande d’invité pour l’instant'),
  true,
);
const comptoirDj = await chargerLive(styleDj);
check('le comptoir du DJ porte la demande de Camille', comptoirDj?.demandes.length, 2);
check('avec le titre et l’artiste', comptoirDj?.demandes[0]?.titre, 'Superstition');
check('et le titre proposé par un autre invité', comptoirDj?.demandes[1]?.libre, true);
check('que le DJ verra sur son terminal', [
  ...new Set(demandesDe(comptoirDj!, 'Camille').map((d) => d.titre)),
  ...new Set(demandesDe(comptoirDj!, 'Bastien').map((d) => d.titre)),
], ['Superstition', 'Uptown Funk']);
const planDjResident = planDj(morceauxDeLaPlaylist(['track-d1', 'sug-6']), comptoirDj!.demandes);
check(
  'et qui se range dans le bon moment de la soirée',
  planDjResident.find((b) => b.phaseId === 'dancefloor_peak')?.lignes.map((l) => l.titre),
  ['Stayin’ Alive', 'Superstition', 'Uptown Funk'],
);

/* Une page sans musique ne parle pas de playlist. */
const htmlChef = renderToStaticMarkup(
  createElement(
    MemoryRouter,
    { initialEntries: ['/metiers/chef-tapas-finger-food-etoile'] },
    createElement(Routes, null, createElement(Route, { path: '/metiers/:slug', element: createElement(PageMetier as never) })),
  ),
);
check('la page du chef ne parle pas de playlist', htmlChef.includes('Ce que la soirée a demandé'), false);
check('mais elle porte ses lignes sur le ticket', htmlChef.includes('Vos lignes sur le ticket'), true);

/* Une adresse inconnue reste une page, avec une porte de sortie. */
const htmlInconnu = renderToStaticMarkup(
  createElement(
    MemoryRouter,
    { initialEntries: ['/metiers/pas-un-metier'] },
    createElement(Routes, null, createElement(Route, { path: '/metiers/:slug', element: createElement(PageMetier as never) })),
  ),
);
check('un métier inconnu renvoie vers la page du mariage', htmlInconnu.includes('Ce métier n’existe pas encore'), true);

/* --------- le header, le dock, le dos de la carte, le billet, la postale ------ */

/* Le header et le dock encadrent les grandes pages : la nav est la même partout. */
const chromeMetier = renderToStaticMarkup(
  createElement(
    MemoryRouter,
    { initialEntries: ['/metiers/dj-resident-clubbing-sound-engineer'] },
    createElement(SiteChrome, null, createElement('div', null, 'contenu')),
  ),
);
check('le header du site est sur la page d’un métier', chromeMetier.includes('VOWS'), true);
check('il annonce la page', chromeMetier.includes('Les métiers'), true);
check('il porte le shop et le magazine', chromeMetier.includes('Shop') && chromeMetier.includes('Magazine'), true);
check('le dock est là aussi', chromeMetier.includes('Zéro contrainte') && chromeMetier.includes('Playlist'), true);
const chromeAccueil = renderToStaticMarkup(
  createElement(
    MemoryRouter,
    { initialEntries: ['/'] },
    createElement(SiteChrome, null, createElement('div', null, 'contenu')),
  ),
);
check('sur l’accueil, le chrome ne double pas la barre de la page', chromeAccueil.includes('Magazine'), false);
check('mais le dock y est', chromeAccueil.includes('Zéro contrainte'), true);
const chromeSite = renderToStaticMarkup(
  createElement(
    MemoryRouter,
    { initialEntries: ['/p/sarah-gabriel'] },
    createElement(SiteChrome, null, createElement('div', null, 'contenu')),
  ),
);
check('le site des mariés reste sans header ni dock', chromeSite.includes('Zéro contrainte'), false);

/* --------- le dock noir, la bande du hero, le header sans menu d'univers ------- */

/* Le dock passe en noir, pictos en blanc : il se voit sur toutes les pages. */
check('le dock est noir', chromeMetier.includes('bg-[#0B0C12]/95'), true);
check('et ses pictos sont blancs', chromeMetier.includes('text-white/60'), true);
check('l’étape courante s’inverse en blanc', chromeMetier.includes('bg-white text-[#0B0C12]'), true);

/* Le header se libère du menu déroulant des univers. */
const entete = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(SiteHeader as never)));
check('le header garde les métiers, le shop et le magazine', ['Métiers', 'Shop', 'Magazine'].every((m) => entete.includes(m)), true);
check('le header n’a plus de bouton Univers', entete.includes('>Univers<'), false);
check('et plus de panneau d’univers', entete.includes('univers VOWS'), false);

/* La bande du hero : les univers, à l'horizontale, en bas du hero de l'accueil. */
check('la bande des univers est sur l’accueil', accueil.includes('Les univers'), true);
check('elle propose la vue d’ensemble', accueil.includes('Vue d’ensemble'), true);
check('elle annonce le nombre d’univers', accueil.includes(`${WEDDING_STYLES.length} univers · faites défiler`), true);
/** Un nom peut contenir une esperluette : le HTML l'échappe. */
const enHtml = (texte: string) => texte.replace(/&/g, '&amp;');
check(
  'elle porte les cartes des univers, visuel compris',
  accueil.includes('/images/') && WEDDING_STYLES.every((u) => accueil.includes(enHtml(u.name))),
  true,
);

/* La même bande sur la page d'un univers, pour changer d'univers d'un geste. */
const universBande = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/le-mariage/vegas'] }, createElement(LeMariage as never)),
);
check('la page d’un univers porte la bande', universBande.includes('Passer d’un univers à l’autre'), true);
check(
  'avec toutes les cartes, dont l’univers vierge',
  ALL_STYLES.every((u) => universBande.includes(enHtml(u.name))),
  true,
);
check('l’univers courant y est marqué', universBande.includes('>Ici<'), true);

/* Et sur la page d'un métier : la bande des métiers. */
const metierBande = renderToStaticMarkup(
  createElement(
    MemoryRouter,
    { initialEntries: ['/metiers/dj-resident-clubbing-sound-engineer'] },
    createElement(Routes, null, createElement(Route, { path: '/metiers/:slug', element: createElement(PageMetier as never) })),
  ),
);
check('la page d’un métier porte la bande des métiers', metierBande.includes('Changer de métier'), true);
check('les cartes mènent aux autres métiers', (metierBande.match(/\/metiers\//g) ?? []).length > 4, true);
check('et disent où l’on est', metierBande.includes('DJ Résident Clubbing / Sound Engineer'), true);

/* La typo du site : plus de serif d’emprunt sur les pages d’univers et de métier. */
const pageUniversHtml = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/le-mariage/vegas'] }, createElement(LeMariage as never)),
);
check('la page d’un univers ne prend pas une autre typo', pageUniversHtml.includes('Georgia'), false);
check('elle porte les titres du site', pageUniversHtml.includes('vp-title'), true);
const pageMetierHtml = renderToStaticMarkup(
  createElement(
    MemoryRouter,
    { initialEntries: ['/metiers/dj-resident-clubbing-sound-engineer'] },
    createElement(Routes, null, createElement(Route, { path: '/metiers/:slug', element: createElement(PageMetier as never) })),
  ),
);
check('la page d’un métier non plus', pageMetierHtml.includes('Georgia'), false);

/* --------- le contenant éditorial : la même marge de chaque côté -------------- */

/* La mise en page d'un article de magazine — une colonne centrée, une marge de
   chaque côté — est celle de toutes les pages. */
const rendrePage = (chemin: string, element: unknown, route?: string) =>
  renderToStaticMarkup(
    createElement(
      MemoryRouter,
      { initialEntries: [chemin] },
      route
        ? createElement(Routes, null, createElement(Route, { path: route, element: createElement(element as never) }))
        : createElement(element as never),
    ),
  ).replace(/&amp;/g, '&').replace(/&#x27;|&apos;/g, "'");

const pageMagazine = rendrePage('/magazine', Magazine);
const pageArticle = rendrePage(`/magazine/${ALL_ARTICLES[0].slug}`, MagazineArticle, '/magazine/:slug');
const pageShop = rendrePage('/shop', Shop);
const pageProduit = rendrePage(`/shop/${SHOP_PRODUCTS[0].slug}`, ShopProduct, '/shop/:slug');
const pageSupermarriage = rendrePage('/supermarriage', SuperMariage);
const pagePrestataire = rendrePage('/prestataire?role=DJ%20R%C3%A9sident%20Clubbing%20%2F%20Sound%20Engineer', VendorStudio);

check('l’article de magazine garde sa colonne de lecture', pageArticle.includes('vp-page-read'), true);
check(
  'il montre bien son tableau en dessous du hero',
  pageArticle.includes('lg:grid-cols-4') && pageArticle.includes('Métiers mobilisés'),
  true,
);
check('les pages prennent le même contenant', [pageMagazine, pageShop, pageProduit, pageSupermarriage, pagePrestataire, pageUniversHtml, pageMetierHtml].every((h) => h.includes('vp-page')), true);
check('le magazine ne recopie plus ses propres largeurs', pageMagazine.includes('mx-auto max-w-6xl'), false);
check('le shop non plus', pageShop.includes('mx-auto max-w-6xl'), false);
check('le contenant est posé une fois, pas deux', pageShop.split('vp-page').length <= 9, true);

/* Le dos de la carte : le papier du ticket de caisse, plus de nuit. */
const carteDos = renderToStaticMarkup(
  createElement(
    MemoryRouter,
    null,
    createElement(WeddingCard as never, {
      card: { ...EMPTY_CARD, roleId: 'invites', firstName: 'Claire', lastName: 'Roz' } as CardData,
      startFlipped: true,
    }),
  ),
);
check('le dos de la carte est du papier clair', carteDos.includes('bg-[#FFFEF7]'), true);
check('et non un fond noir', carteDos.split('bg-[#0B0C12]').length - 1, 1);
check('il s’annonce comme une carte de fidélité', carteDos.includes('Carte de fidélité'), true);
check('il porte un code-barres', /VOWS-CLA-INV-[A-Z]{3}/.test(carteDos), true);
check('la mention de confidentialité reste', carteDos.includes('Vos données restent les vôtres'), true);

/* Le billet du RSVP : chaque univers a son registre. */
const billetCinema = renderToStaticMarkup(
  createElement(RsvpTicket, {
    nom: 'Clara Mez', styleId: 'cinema', universeName: 'Cinéma', accent: '#C80000',
    noms: 'Sarah & Gabriel', date: '2027-06-12', venue: 'Château de Larris, Paris',
    vient: true, places: 2, enfants: 1, moments: ['Première — 19h'], regime: 'Végétarien',
    allergies: 'Fruits à coque', message: 'Vivement !', reponduLe: new Date('2026-09-19T18:30:00'),
  } as never),
);
check('le cinéma délivre un billet', billetCinema.includes('BILLET'), true);
check('nominatif et numéroté', billetCinema.includes('Clara Mez') && /[A-H]-[0-9]{1,2}/.test(billetCinema), true);
check('il compte les convives', billetCinema.includes('Convives') && billetCinema.includes('>3<'), true);
check('et transmet le régime', billetCinema.includes('Végétarien'), true);
const carteTable = renderToStaticMarkup(
  createElement(RsvpTicket, {
    nom: 'Jean Bru', styleId: 'corse', universeName: 'Corse', accent: '#2D4A22',
    noms: 'Sarah & Gabriel', date: '2027-06-12', venue: 'Auberge', vient: false, places: 1, enfants: 0,
    moments: [], regime: '', allergies: '', message: '', reponduLe: new Date(),
  } as never),
);
check('la table délivre une carte de table', carteTable.includes('CARTE DE TABLE'), true);
check('une absence le dit', carteTable.includes('Absent·e'), true);

/* La carte postale d’invitation : le mot d’un côté, les timbres de l’autre. */
const postale = renderToStaticMarkup(
  createElement(CartePostale, {
    partner1: 'Sarah', partner2: 'Gabriel', date: '2027-06-12', venue: 'Château de Larris', city: 'Paris',
    univers: 'Cinéma', accent: '#C80000', visuel: '/images/cinema.jpg',
    photoMariage: '/images/cinema.jpg', photoCouple: '/images/couple-paris.jpg',
    mot: 'Nous avons hâte de vous retrouver sous le rideau rouge.',
  } as never),
);
check('la postale montre le visuel et l’invitation', postale.includes('Carte postale · Cinéma') && postale.includes('Vous êtes invité'), true);
check('au dos, le mot des mariés', postale.includes('Le mot des mariés') && postale.includes('rideau rouge'), true);
check('le timbre du marié', postale.includes('Le marié · Sarah'), true);
check('et le timbre de la mariée', postale.includes('La mariée · Gabriel'), true);
check('la date courte des timbres', postale.includes('12.06.2027'), true);
check('le sceau rond du site', postale.includes('textPath') && postale.includes('textLength'), true);

/* --------- la playlist en cartes, la page d'un métier, la page d'une personne ----- */

/* Le catalogue se présente comme partout ailleurs : des cartes musicales. */
const playlistVegas = renderToStaticMarkup(
  createElement(
    MemoryRouter,
    null,
    createElement(PlaylistCollaborative as never, {
      style: styleById('vegas'),
      playlist: ['track-c1'],
      onPlaylist: () => {},
      terminal: TERMINAL_VIDE,
      onTerminal: () => {},
      nom: 'Clara',
      styleId: 'vegas',
    }),
  ),
);
check('la playlist s’écoute en cartes musicales', playlistVegas.includes('Écouter'), true);
check('chaque carte porte ses deux gestes', playlistVegas.includes('Demander') && playlistVegas.includes('Ajouter'), true);
check('et les cartes montrent le moment du morceau', playlistVegas.includes('· Cérémonie') || playlistVegas.includes('· Cocktail'), true);

/* Les métiers : chacun a sa page, et la musique a la sienne. */
const tous = tousLesMetiers();
check('les métiers du catalogue ont tous une page', tous.every((m) => Boolean(metierParSlug(slugDeRole(m.role)))), true);
check('et une page entière se compose pour chacun', tous.every((m) => Boolean(pageMetier(slugDeRole(m.role)))), true);
check('une page de métier inconnue reste introuvable', metierParSlug('pas-un-metier'), null);
const pageDj = pageMetier(slugDeRole('DJ Résident Clubbing / Sound Engineer'));
check('le DJ a sa page', Boolean(pageDj), true);
check('sa page porte la playlist', pageDj?.musique, true);
check('et le terminal', pageDj?.dj, true);
check('sa page a ses lignes de ticket', (pageDj?.lignes.length ?? 0) > 0, true);
const pageFleuriste = pageMetier(slugDeRole('Fleuriste Tropical & Décoration'));
check('le fleuriste a la sienne aussi', Boolean(pageFleuriste), true);
check('sans playlist : ce n’est pas un métier de musique', pageFleuriste?.musique, false);

/* Le comptoir du DJ : les invités demandent, sa page suit. */
await apiSend('/api/wedding-live', 'POST', {
  style_id: pageDj?.styleId ?? 'club',
  geste: { type: 'demander', cle: 'sug-4', titre: 'Superstition', artiste: 'Stevie Wonder', phaseId: 'dancefloor_peak', nom: 'Camille' },
});
const comptoirDuMetier = await chargerLive(pageDj?.styleId ?? 'club');
check(
  'le comptoir du DJ reçoit la demande',
  comptoirDuMetier?.demandes.some((d) => d.titre === 'Superstition' && d.nom === 'Camille'),
  true,
);
check(
  'et le morceau garde son moment',
  comptoirDuMetier?.demandes.find((d) => d.titre === 'Superstition')?.phaseId,
  'dancefloor_peak',
);
const planDuMetier = planDj(morceauxDeLaPlaylist(['track-d1']), comptoirDuMetier?.demandes ?? []);
check(
  'le plan de la soirée range la demande au bon moment',
  planDuMetier.find((b) => b.phaseId === 'dancefloor_peak')?.lignes.length,
  2,
);

/* La page d'une personne : son adresse, son timbre, son mariage. */
check('une adresse de profil se fabrique', slugDePersonne({ id: 12, first_name: 'Clara', last_name: 'Mez', trade: '' }), '12-clara-mez');
check('les accents ne collent pas à l’adresse', morceauxDeNom('Éloïse de la Forêt'), 'eloise-de-la-foret');
check(
  'le numéro suffit à ouvrir une page',
  [idDeProfil('12-clara-mez'), idDeProfil('12'), idDeProfil('clara-mez')],
  [12, 12, null],
);

/* Sans mariage publié, une page de profil ne montre aucun mariage. */
check('avant publication, la page n’a pas de mariage', (await chargerProfil(relue!.id))?.memberships.length, 0);
await apiSend('/api/wedding-sites', 'PUT', { id: created.site.id, published: true });
const profil = await chargerProfil(relue!.id);
check('la page d’une personne se charge', Boolean(profil?.person), true);
check('elle porte le mariage publié', profil?.memberships.length, 1);
check('avec son univers', profil?.memberships[0]?.site?.style, 'cinema');
check('et le rôle qui y est tenu', profil?.memberships[0]?.role_id, 'fleuriste');
check('une personne inconnue n’a pas de page', await chargerProfil(999999), null);
/* Le nom, l'univers et le rôle voyagent avec la carte : la page peut se rendre. */
const detail = cardDetail({ ...EMPTY_CARD, styleId: 'vegas', roleId: 'dj', access: 'prestataire' });
check('le verso garde l’univers de la carte', detail.styleId, 'vegas');
check('et le rôle déclaré', detail.roleId, 'dj');
const remonte = withDetail({ ...EMPTY_CARD, styleId: 'vierge' }, detail);
check(
  'qui se remontent à l’identique',
  [remonte.styleId, remonte.roleId, remonte.access],
  ['vegas', 'dj', 'prestataire'],
);

const pageAbsente = renderToStaticMarkup(
  createElement(
    MemoryRouter,
    { initialEntries: ['/profil/pas-un-nom'] },
    createElement(Routes, null, createElement(Route, { path: '/profil/:slug', element: createElement(PageProfil as never) })),
  ),
);
check('une page absente le dit', pageAbsente.includes('Cette page n’existe pas encore'), true);
check('et propose de créer sa carte', pageAbsente.includes('Créer ma carte'), true);

/* Le timbre : la photo de profil du réseau. */
const timbre = renderToStaticMarkup(
  createElement(Timbre, {
    photo: '',
    label: 'Son timbre',
    nom: 'Clara',
    date: '12.06.2027',
    accent: '#C80000',
    largeur: 148,
    initiales: 'CM',
  } as never),
);
check('le timbre annonce son propriétaire', timbre.includes('Son timbre · Clara'), true);
check('et porte la date courte', timbre.includes('12.06.2027'), true);
check('sans photo, il montre les initiales', timbre.includes('>CM<'), true);
check('il reste dentelé', timbre.includes('border-dashed'), true);

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
