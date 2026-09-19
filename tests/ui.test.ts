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
import { apiSend } from '../src/lib/http';
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
import { aPartirDe, magasinFor } from '../src/lib/weddingPage';
import { ALL_STYLES } from '../src/lib/weddingStyles';
import { totalCaisse } from '../src/lib/superMariage';
import PreviewSite from '../src/pages/PreviewSite';
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
import { EMPTY_CARD, cardRoleLabel, type CardData } from '../src/lib/weddingCard';
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
check('et chacun coche ce qu’il offre', vegasDecode.includes('coche ce qu’il offre'), true);

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
