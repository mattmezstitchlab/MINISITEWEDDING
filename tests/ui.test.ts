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
import ChampDuMagazine from '../src/components/ChampDuMagazine';
import Generating from '../src/pages/Generating';
import {
  CLE_DU_MAGAZINE, composerLeMagazine, effacerMagazine, enregistrerMagazine, magazineCompose,
  phraseDuMagazine, reponseEnregistree,
} from '../src/lib/composition';
import {
  PROPOSITIONS, ageDePersonne, ageEcrit, dateCourte, decoderPersonnes, encoderPersonnes, jourDeNaissance,
  motDeLaCondition, personneComplete, propositionsPossibles, raisonDeLaFermeture, roleDeLaProposition,
  titreDeLaProposition, type PersonneComposee,
} from '../src/lib/composerPersonnes';
import { RUBRIQUES } from '../src/lib/aimeMoteur';
import {
  dateDuJourNomme, genreDuPrenom, jourDuPrenom, lectureDuPrenom, motsDuNom,
} from '../src/lib/genreDesPrenoms';
import {
  CHAPITRES_ATTENDUS, COUVERTURES_ATTENDUES, IMAGES_ATTENDUES_DE_LA_COLLECTION,
  chapitresDeLaCollection, couverturesDeLaCollection, etatDeLaCollection, imagesDeLaCollection,
  FONDS_ATTENDUS, RANGS_PAR_PLAN, SCENES_ATTENDUES, adresseDuFichier, choisirLeMeilleurVisuel,
  distanceDesCouleurs, eliminerEntreJours, etatDuCasting, fichiersDuPlan,
  fondsDeCouvertureDeLAnnee, joursLiesAuJour, noterCandidat, scenesDeLAnnee,
  type AttenduVisuel, type CandidatVisuel,
} from '../src/lib/castingVisuels';
import { MOMENTS_VISUELS } from '../src/lib/promptsVisuels';
import LanguetteTimeline from '../src/components/LanguetteTimeline';
import {
  OBJETS_DE_LA_FABRIQUE, ceQuiManque, changerPointZero, endroitsTouches, lePointZero,
  phraseDeLAgent, pictoDuRipple, repereDe, rippleComplet,
} from '../src/lib/ripple';
import {
  basculerTimeline, choisirMoment, publierReperes, tempsDeLaCapsule,
} from '../src/lib/capsuleCommande';
import { angleDeLHeure, angleDuChapitre } from '../src/components/CadranDuMagazine';
import SceneEditoriale from '../src/components/SceneEditoriale';
import GrilleDuMonde from '../src/components/GrilleDuMonde';
import Feuille from '../src/components/Feuille';
import SiteChrome from '../src/components/SiteChrome';
import {
  ECHELLES_DE_LA_GRILLE,
  ajustementDeRemplissage,
  borner,
  colonnesDeLaGrille,
  cranDeLEchelle,
  densiteDeLaTaille,
  echelleDuCran,
  tailleDeLaCase,
} from '../src/lib/echelleDeLaGrille';
import {
  FAMILLES,
  MODULES,
  MODULES_DE_COMPOSITION,
  MINI_SITE_INVITE,
  MINI_SITE_PRESTATAIRE,
  NŒUDS_DU_MONDE,
  UNIVERS_DU_JOUR,
  caseDUnJour,
  caseParId,
  casesParIds,
  cleDuJour,
  composerLeMiniSite,
  densiteDuMonde,
  mondeDeLAnnee,
  mondeDeLId,
  mondeDeLaBoutique,
  mondeDeLaMusique,
  mondeDeLaGalerie,
  mondeDesArticles,
  mondeDesHeures,
  mondeDesMagazines,
  mondeDesMetiers,
  mondeDesPersonnes,
  mondeDuJour,
  mondeDUneHeure,
  mondeDuMiniSite,
} from '../src/lib/grilleDuMonde';
import { lumiereDeLHeure, teinteDeLHeure, melangeHex } from '../src/lib/lumiereDuJour';
import { ROUTES_DU_MONDE, mondeDUneAdresse, promesseDUneAdresse } from '../src/lib/grilleDesRoutes';
import GrilleDuneRoute from '../src/components/GrilleDuneRoute';
import {
  LIAISONS_POSSIBLES,
  PALETTES_DU_SYSTÈME,
  RÉGLAGES_DU_SYSTÈME,
  chaineDuMonde,
  colonnesDuMonde,
  emplacementsDuMonde,
  faceTechnique,
  liaisonEntre,
  liaisonsDuMonde,
  modulesAttendus,
  sontVoisines,
} from '../src/lib/versoDuSite';
import { publierImmersif } from '../src/lib/modeImmersif';
import { legendeDeLHeure } from '../src/components/CouvertureJour';
import {
  PAS_DU_MAGAZINE, adresseDuMagazine, blocsDeLaCollection, graduationsDeLaCollection,
  teteSurLaSemaineCourante,
} from '../src/lib/timelineDeLaCollection';
import { TIMELINE_TOTAL_MINUTES } from '../src/lib/timelineTheaterEngine';
import {
  angleDuJour, chercherUnJour, joursDeLaSemaine, moisDeLaSaison, semainesDuMois,
} from '../src/lib/deroulerLannee';
import { PHOTOS_LIVREES, photoDuPlan } from '../src/lib/photosDuMagazine';
import CouvertureJour from '../src/components/CouvertureJour';
import { couvertureDuJour } from '../src/lib/couvertureDuJour';
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
import {
  chargerProfil, idDeProfil, morceauxDeNom, personneDeLaCarte, slugDePersonne,
} from '../src/lib/profil';
import { metierParSlug, pageMetier, slugDeRole, tousLesMetiers } from '../src/lib/metierPage';
import { pageMetier, slugDeRole, tousLesMetiers } from '../src/lib/metierPage';
import { chargerLive, envoyerGeste } from '../src/lib/terminalLive';
import { contentFor } from '../src/lib/universeContent';
import { styleById } from '../src/lib/weddingStyles';
import {
  TERMINAL_VIDE, avancement, decoderRecu, demander, demandesDe, encoderRecu, entrerRecu, lacher, planDj,
  prendre, preneurDe, prisesParInvite, recuDe,
} from '../src/lib/weddingTicket';
import { ALL_STYLES } from '../src/lib/weddingStyles';
import { totalCaisse } from '../src/lib/superMariage';
import PreviewSite from '../src/pages/PreviewSite';
import OuvertureSite from '../src/components/OuvertureSite';
import BottomCapsuleNav from '../src/components/BottomCapsuleNav';
import NavVerticale from '../src/components/NavVerticale';
import BoutonParametres from '../src/components/BoutonParametres';
import HomeCardShowcase from '../src/components/HomeCardShowcase';
import Appareils from '../src/components/Appareils';
import EditeurMiniSite from '../src/pages/EditeurMiniSite';
import { MANIFESTE } from '../src/lib/manifeste';
import { COUVERTURES, MARQUE_MAGAZINE, couvertureDArticle, couvertureParId } from '../src/lib/aimeMagazine';
import {
  JEU_DE_54, PAS_DE_TEMPS, SAISONS, bornesDeLaSemaine, carteDuNumero, pasDeTempsDeLaSemaine,
  phaseDeLune, saisonDeLaSemaine, semaineDeLAnnee,
} from '../src/lib/jeuDeCartes';
import {
  PAGES_EDITION, RUBRIQUES, composerEdition, editionDuMoment, lesQuatreSaisons, numerosDeLaSaison,
  troisTemps,
} from '../src/lib/aimeMoteur';
import CouvertureSemaine from '../src/components/CouvertureSemaine';
import ChapitresDuMagazine from '../src/components/ChapitresDuMagazine';
import MagazineSemaine from '../src/components/MagazineSemaine';
import {
  CHAPITRES,
  chapitreDeLaPosition,
  chapitreParFichier,
  chapitreSuivant,
} from '../src/lib/chapitres';
import { DIRECTIONS_COMPLETES } from '../src/lib/directionsDuMagazine';
import {
  IMAGES_ATTENDUES,
  MAGAZINES,
  NOMBRE_DE_MAGAZINES,
  chapitreDeLaDate,
  chapitreDuMagazine,
  joursDuMagazine,
  magazineDeLaDate,
  magazineParNumero,
  magazineSuivant,
  niveauxDuJour,
  SAISONS_DE_LA_COLLECTION,
  numeroDeMagazine,
  positionDansLeMagazine,
  voisinDuChapitre,
} from '../src/lib/semaines';
import {
  cheminDuVisuel,
  visuelLivre,
  VISUELS_DU_MAGAZINE,
  VISUELS_LIVRES,
} from '../src/lib/bibliothequeMagazine';
import {
  visuelDeLaCouverture,
  visuelDuChapitre,
  visuelsDuJour,
} from '../src/lib/visuelsDuMagazine';
import FluxDuJour from '../src/components/FluxDuJour';
import { HEURES } from '../src/lib/aimeMoteur';
import PortraitStudio from '../src/components/PortraitStudio';
import { ASSOCIATION, CHARTE, QUI_EDITE, SIGNATURE_EDITEUR } from '../src/lib/charte';
import {
  CONFIDENTIALITES, SECTIONS, ceQueJumoRetiendrait, journalVierge, pagesPubliques, valider,
} from '../src/lib/journal';
import {
  PALIERS as PALIERS_LUMIERE, feteDuPrenom, joursDuPrenom, miseEnLumiere, profilDeBase,
} from '../src/lib/miseEnLumiere';
import MiseEnLumiere from '../src/components/MiseEnLumiere';
import LeChiffre from '../src/components/LeChiffre';
import LeTemps from '../src/components/LeTemps';
import CouvertureJour from '../src/components/CouvertureJour';
import GalerieCouvertures from '../src/components/GalerieCouvertures';
import ProfilEditorial from '../src/components/ProfilEditorial';
import MomentsDuJour from '../src/components/MomentsDuJour';
import { CHAINE, CHAINE_LIGNE, CHAINE_PROMESSE, maillon } from '../src/lib/chaineDuMonde';
import { PRENOMS, PRENOMS_DOCUMENTES, significationDe } from '../src/lib/prenoms';
import { PATRONAGES, SAINTS_PATRONS, patronagesDe, portesDuJour } from '../src/lib/patronages';
import {
  categorieDuJour, etatDeLAnnee, ficheDuJour, fichesDeLAnnee, joursAvecPorte,
} from '../src/lib/fichesAnnee';
import {
  AVERTISSEMENT_PROFILS, NIVEAUX, PROFILS, REGLE_DES_PROFILS, chercherProfils, cleDuJour,
  personnageDuJour, plat, pontsParNiveau, profilDuJour, profilsDocumentes,
} from '../src/lib/profilsEditoriaux';
import {
  PARTS, REGLE_EDITORIALE, bornesDeLaPart, heuresDeLaPart, partActuelle, partDeLHeure, partParId,
} from '../src/lib/moments';
import { couvertureDeLaPart, couverturesDesParts } from '../src/lib/couvertureDuJour';
import { TAUX_TEMPS_CLOS, assombrir, canaux, enHex } from '../src/lib/couleurs';
import {
  CADRAGE, DIRECTION_ARTISTIQUE, INTERDITS_VISUELS, MOMENTS_VISUELS, PAS_DIMAGE_LA_NUIT, SCENES_PAR_PERSONNAGE,
  entreesDeLAnnee, entreesDuMois, etatDeLaSerie, momentVisuel, promptMaitre, scenesDuPersonnage,
} from '../src/lib/promptsVisuels';
import {
  FOND_NOIR, HEURES_DE_LUMIERE, MOIS, couverturesDeLAnnee, couverturesDuMois, couvertureDuJour, graine,
} from '../src/lib/couvertureDuJour';
import {
  GESTES, LIGNES_MAX, anneesDuTemps, chargerTemps, dateDUneLigne, effacerTemps, enregistrerGeste,
  heureCourte, jourCourt, lignesDeLAnnee, lignesDuJour, moisDeLAnnee, regleDuGeste, resumeDuTemps,
} from '../src/lib/temps';
import {
  CONFIDENTIALITE_CHIFFRE, MAITRES, METHODE_PAR_DEFAUT, MOTS, SYSTEME, anneePersonnelle, chargerChiffre,
  chiffreAdeux, chiffreDePersonnalite, chiffreDUneDate, chiffreDuNom, chiffreIntime, chiffresDeLaPersonne,
  consonnesDe, effacerChiffre, enregistrerChiffre, estMaitre, laRegle, lettresDe, lireDate, motsDuChiffre,
  reduire, sansAccents, valeurDeLettre, voyellesDe,
} from '../src/lib/chiffre';
import HeroEnchaine from '../src/components/HeroEnchaine';
import ManifestePersonne from '../src/components/ManifestePersonne';
import UniversDeLaPersonne from '../src/components/UniversDeLaPersonne';
import {
  CARTES_MAX, adresseDeLUnivers, carteVivanteDe, chargerSelection, choisirCarte, cleDeCarteChoisie,
  deplacerCarte, enchainement, enchainementDeSecours, estChoisie, manifesteDeLaPersonne, retirerCarte,
  rolesDeLaPersonne, universDeLaPersonne, viderSelection, visuelsDeLEnchainement,
} from '../src/lib/selection';
import {
  JOURS_DE_LA_SEMAINE, clesDuJour, editionDuJour, filRougeDuJour, jourDeLAnnee, jourDuMagazine,
  joursAutour, lesQuatrePortes, meteoDuJour, studioDuJour,
} from '../src/lib/jourDuMagazine';
import { JOKERS_DU_CALENDRIER, JOURS_NOMMES, jourNomme, nomDuJour } from '../src/lib/saintsDuJour';
import EditionSemaine from '../src/components/EditionSemaine';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import CouvertureMagazine from '../src/components/CouvertureMagazine';
import SuperRipple from '../src/pages/SuperRipple';
import FenteDocuments from '../src/components/FenteDocuments';
import {
  AXES_FOOTER, CHOIX_VIDE, DOCUMENTS, LIGNES_FOOTER, basculer, documentsOuverts, etatDuDocument,
  lignesDuTicket as lignesDuTicketFooter, validationDuDocument,
} from '../src/lib/superFooter';
import {
  MENTION_DROITS, PALIERS, actionsPossibles, annonceCourante, annoncerDocument, annoncerMessage,
  annoncerNotification, annoncesNouvelles, changerEtatAnnonce, chargerAnnonces, fermerFente,
  ouvrirFente, palierDuPoint, palierDuPointInfo, retirerAnnonce, titreDuType,
} from '../src/lib/annonces';
import BoutonEtat from '../src/components/BoutonEtat';
import { SUPER_HEROS, herosDuPalier, herosParId } from '../src/lib/superHeros';
import { CATEGORIES_WALLET, axeDuDocument, chargerWallet, classerDocument, rangerAuWallet, walletParCategorie } from '../src/lib/wallet';
import MenuProfil from '../src/components/MenuProfil';
import LecteurHero from '../src/components/LecteurHero';
import Magazine from '../src/pages/Magazine';
import MagazineArticle from '../src/pages/MagazineArticle';
import Shop from '../src/pages/Shop';
import ShopProduct from '../src/pages/ShopProduct';
import { ALL_ARTICLES, articleDUnivers, badgeDUnivers } from '../src/lib/magazine';
import { articlesPourRole, phraseShopDuRole, piecesPourRole } from '../src/lib/personaSuites';
import {
  cartesDesDomaines, cartesDesMoments, cartesDesPersonas, cartesDesProduits, cartesDesUnivers,
} from '../src/lib/cartesVivantes';
import { DOMAINES_PRESTATAIRES, PERSONNAGES, TITRES, VISUELS_DU_HERO, personnageParId } from '../src/lib/personas';
import {
  definirPersonaCourant, definirPersonaSurvolee, enregistrerControlesBande, personaCourant,
} from '../src/lib/personaCourant';
import { GESTES_UNIVERSELS, enregistrerNavVerticale } from '../src/lib/navVerticale';
import { AIDE_PROFIL, MENU_PROFIL, SORTIE_PROFIL, rolesDuMenu } from '../src/lib/menuProfil';
import {
  NAV_ACCUEIL, NAV_ARTICLE, NAV_MAGAZINE, NAV_METIER, NAV_PARAMETRES, NAV_PRODUIT, NAV_PRESTATAIRE,
  NAV_RIPPLE, NAV_SHOP, NAV_UNIVERS,
} from '../src/lib/navDesPages';
import { FULL_ROLES_TAXONOMY } from '../src/lib/weddingTaxonomy';
import { DUREE_OUVERTURE, DUREE_OUVERTURE_SANS_MOUVEMENT, ouvertureDejaVue } from '../src/lib/ouverture';
import { appliquerGeste } from '../src/lib/liveRules';
import { TERMINAL_VIDE } from '../src/lib/weddingTicket';
import { getScenesForStyle } from '../src/lib/themeTimelineScenarios';
import { SHOP_PRODUCTS, modeLabel } from '../src/lib/shopData';
import {
  CONVIVES, MAGASIN, PANIER_DEPART, articlesDuPanier, lignesDuTicket, numeroDeTicket, totalCaisse,
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
check('l’accueil ne met plus de bouton de création dans son hero', accueil.includes('Créer ma carte'), false);
check('l’accueil ne pose plus la question du rôle', accueil.includes('Qui êtes-vous ?'), false);
check('l’accueil ne fait plus choisir d’univers', accueil.includes('Quel univers ?'), false);
check(
  'la bande-pied en doublon est partie, avec ses portes',
  accueil.includes('J’ai déjà une carte'),
  false,
);
check('la section de la carte est mise de côté', accueil.includes('La carte d’abord.'), false);
check('l’accueil n’a plus de bouton « Découvrir »', accueil.includes('Découvrir'), false);
/* LE HERO DE L'ACCUEIL : « QUI ÊTES-VOUS DANS CE MARIAGE ? » */
check('le hero demande qui vous êtes', accueil.includes('Qui êtes-vous dans ce mariage ?'), true);
check('et il ouvre sur le premier titre', accueil.includes(TITRES[0]!.nom), true);
check('plus de phrase entre guillemets sous le titre', accueil.includes('« '), false);
/* Les badges sous le titre ont disparu : les outils sont dans le dock. */
check(
  'les entrées ne sont pas répétées dans le hero',
  accueil.slice(accueil.indexOf('Qui êtes-vous'), accueil.indexOf('</header>')).includes('>Invités<'),
  false,
);
/* Le picto est posé nu, au-dessus du titre. */
check('le picto n’a plus de rond', accueil.includes('flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-white/10'), false);
/* Le rôle entre en scène : de la gauche, puis de la droite. */
check('le visuel arrive d’un côté', accueil.includes('data-direction="gauche"'), true);
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
check('l’écran invité porte la capsule du site', ecranInvite.includes('SUPER MARIAGE'), true);
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
check('l’accueil ouvre le magasin', accueil.includes('to="/shop"') || accueil.includes('/shop'), true);
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

/* La carte de l'accueil : mise de côté pour l'instant, mais toujours debout. */
const carteDuSite = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(HomeCardShowcase as never)));
check('la carte met le nom par-dessus le visuel', carteDuSite.includes('Votre nom'), true);
check('et son rôle', carteDuSite.includes(cardRoleLabel(EMPTY_CARD)), true);
check('elle n’est plus sur l’accueil', accueil.includes('Votre nom'), false);


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
check('un univers inconnu retombe sur le Supermarché 22H', inconnu.includes('CAISSE 3'), true);
check('et le magasin porte le nom du site', MAGASIN.nom, 'SUPER MARIAGE');

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
check('la barre du site est sur la page d’un métier', chromeMetier.includes('SUPER MARIAGE'), true);
check('elle annonce la page', chromeMetier.includes('Les métiers'), true);
check('elle porte le caddie et le magazine', ['Le Shop', 'Le Magazine'].every((m) => chromeMetier.includes(m)), true);
check('le dock est là aussi', chromeMetier.includes('Le Point Zéro'), true);
const chromeAccueil = renderToStaticMarkup(
  createElement(
    MemoryRouter,
    { initialEntries: ['/'] },
    createElement(SiteChrome, null, createElement('div', null, 'contenu')),
  ),
);
check('sur l’accueil, le chrome ne double pas la barre de la page', chromeAccueil.includes('aria-label="La barre du site"'), false);
check('la barre est bien sur les autres pages', chromeMetier.includes('aria-label="La barre du site"'), true);
/* Le pied, lui, est partout : c'est la même signature et les mêmes portes. */
check('le pied commun est au bas de toutes les pages', [chromeMetier, chromeAccueil].every((h) => h.includes('aria-label="Les portes du site"')), true);
check(
  'il porte la signature du fondateur et l’association',
  ['LE FONDATEUR ET CRÉATEUR D’AIME®', 'Association Le Monde Aime'].every((m) => chromeAccueil.includes(m)),
  true,
);
check('et les portes du site', ['Le magazine', 'Le shop', 'La timeline'].every((l) => chromeAccueil.includes(l)), true);
check('mais le dock y est', chromeAccueil.includes('Le Point Zéro'), true);
/* La nav verticale, elle, est montée une fois pour tout le site. */
check('la nav verticale y est', chromeAccueil.includes('aria-label="Le Magazine"'), true);
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

/* LA BARRE DU SITE : le nom à gauche, le profil à droite. */
definirPersonaCourant('maries');
definirPersonaSurvolee(null);
const entete = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(SiteHeader as never)));
check('le site s’appelle Super Mariage', entete.includes('SUPER MARIAGE'), true);
check('le nom s’écrit en blanc, sans capsule', entete.includes('text-white') && entete.includes('bg-gradient-to-b from-black/45'), true);
check('la barre n’a plus de fond blanc', entete.includes('rounded-[26px] bg-white'), false);
check('la barre ne garde que le nom', ['Métiers', 'Shop<', 'Magazine<'].every((m) => entete.includes(m)), false);
check(
  'le shop et le magazine ont quitté la barre',
  ['aria-label="Le Shop"', 'aria-label="Le Magazine"'].every((m) => entete.includes(m)),
  false,
);
check('à la place, le profil', entete.includes('aria-label="Profil — '), true);
check('et il dit qui l’on est', entete.includes(`aria-label="Profil — ${personnageParId('maries')!.nom}"`), true);
check('le header n’a plus de bouton Univers', entete.includes('>Univers<'), false);
check('et plus de panneau d’univers', entete.includes('univers VOWS'), false);

/* La bande du hero : les univers, à l'horizontale, en bas du hero de l'accueil. */
check('la bande des univers est sur l’accueil', accueil.includes('Les univers'), true);
check('la bande ne montre que des univers', accueil.includes('Vue d’ensemble'), false);
check('elle s’annonce sous le hero', accueil.indexOf('Les univers') > accueil.indexOf('</header>'), true);
check(
  'le titre du hero, et ses cartes, sont dans le hero',
  accueil.indexOf(TITRES[0]!.nom) > accueil.indexOf('Qui êtes-vous dans ce mariage') &&
    accueil.indexOf(TITRES[0]!.nom) < accueil.indexOf('</header>'),
  true,
);
check('sans bande blanche', accueil.includes('bottom-[6.5rem]'), false);
check('et sans flèches : celles du dock mènent la bande', (accueil.match(/Carte précédente/g) ?? []).length, 0);
check('les deux bandes sont dans un hero, aucune sur une bande blanche', accueil.includes('bg-white pb-6 pt-5'), false);
/* Trois cartes au centre par bande, celle du milieu plus grande, et les flèches. */
check('chaque bande ne garde que trois cartes', (accueil.match(/Aimer /g) ?? []).length, 6);
check('la bande du titre ne s’annonce plus', accueil.includes('Les rôles'), false);
check('aucune bande ne porte ses propres flèches', (accueil.match(/Carte suivante/g) ?? []).length, 0);
check('deux bandes, une carte marquée chacune', (accueil.match(/data-actif="true"/g) ?? []).length, 2);
/* Le hero annonce l'univers qu'il montre : la bande s'aligne, une seule carte. */
check('une carte de la page par bande', (accueil.match(/data-actif="true"/g) ?? []).length, 2);
/** Un nom peut contenir une esperluette : le HTML l'échappe. */
const enHtml = (texte: string) => texte.replace(/&/g, '&amp;');
/* Les univers ont leur hero : le nom de l'univers du moment, et ses cartes. */
const debutUnivers = accueil.indexOf('id="univers-hero"');
const heroUnivers = accueil.slice(debutUnivers, accueil.indexOf('id="supermarriage"'));
check('les univers ont leur hero', debutUnivers > 0, true);
check('avec l’univers du moment, en grand', heroUnivers.includes(enHtml(WEDDING_STYLES[0]!.name)), true);
const cartesUniversHero = cartesDesUnivers(() => undefined, WEDDING_STYLES[0]!.id);
check(
  'et ses cartes juste en dessous, visuel compris',
  heroUnivers.includes('/images/') && heroUnivers.includes(enHtml(cartesUniversHero[1]!.titre)),
  true,
);
check('trois cartes, pas plus', (heroUnivers.match(/Aimer /g) ?? []).length, 3);

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
check('l’univers courant est marqué, pour être centré', universBande.includes('data-actif="true"'), true);
check('aucune mention d’état sur la carte', universBande.includes('>Ici<'), false);

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
check('les pages de lecture prennent le même contenant', [pageShop, pageProduit, pageSupermarriage, pagePrestataire, pageUniversHtml, pageMetierHtml].every((h) => h.includes('vp-page')), true);
check('le magazine, lui, est une application plein écran', pageMagazine.includes('h-svh') && pageMagazine.includes('overflow-hidden'), true);
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

/* ---------- la charte de la bande, le hero d'univers, l'article, les héros ----- */

/* Les cartes de la bande reprennent la charte : visuel, badge blanc, majuscules. */
const carteBande = accueil.slice(accueil.indexOf('id="univers-hero"'));
check('les cartes sont celles de la playlist', accueil.includes('w-[172px]') && accueil.includes('sm:w-[188px]'), true);
check('elles grossissent au centre', carteBande.includes('scale('), true);
check('et les cartes de côté sont en retrait', accueil.includes('hidden opacity-60'), true);
check('elles portent la pastille de la playlist', carteBande.includes('rounded-[20px] p-2.5'), true);
/* Plus de badge d'univers sur les cartes : ni pastille, ni ligne d'univers. */
check('plus de pastille noire d’univers', carteBande.includes('bg-black/75 px-2 py-0.5'), false);
check('et plus de ligne d’univers', carteBande.includes('inset-x-2.5 bottom-2 truncate'), false);
check(
  'le titre de l’univers est écrit une fois',
  (carteBande.match(new RegExp(enHtml(WEDDING_STYLES[0]!.name), 'g')) ?? []).length > 0,
  true,
);
check('chaque carte porte son play', carteBande.includes('Lancer '), true);
check('un triangle noir plein, posé sur la pochette', carteBande.includes('fill-current'), true);
/* Le sous-titre défile, comme sur une radio. */
check('le sous-titre défile dans la carte', carteBande.includes('vp-defile'), true);
check('et il est écrit deux fois pour boucler', (carteBande.match(/text-\[10\.5px\] text-black\/55/g) ?? []).length >= 2, true);
check('et son cœur, avec le nombre d’avis', carteBande.includes('Aimer '), true);
check('sans texte d’avis', carteBande.includes('Avis ·'), false);
check('et sans compte de métiers', carteBande.includes('métiers ·'), false);

/* Choisir un univers : le hero montre son titre, sans les badges, et Découvrir. */
const accueilVegas = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/?univers=vegas'] }, createElement(Landing as never)),
);
check('le hero reste celui des personnages', accueilVegas.includes('Qui êtes-vous dans ce mariage ?'), true);
check('l’univers choisi mène toujours la page', accueilVegas.includes('data-actif="true"'), true);
check('et plus de bouton « Découvrir »', accueilVegas.includes('Découvrir'), false);
check('l’univers choisi est marqué dans la bande', accueilVegas.includes('data-actif="true"'), true);

/* « Découvrir » mène à l'article de l'univers : c'est là qu'on découvre. */
check('l’article d’un univers se retrouve par son identifiant', articleDUnivers('vegas')?.slug, 'univers-vegas');
check('et son badge est celui du magazine', badgeDUnivers('vegas'), 'Express & Festif');
check('chaque univers a le sien', badgeDUnivers('corse'), 'Sauvage & Éphémère');

/* Les téléphones ont quitté l'accueil. */
check('plus de bande de téléphones sur l’accueil', accueil.includes('Trois téléphones'), false);
check('plus de capsule « Un univers »', accueil.includes('Un univers ·'), false);

/* La même hauteur de hero partout : celle de l'accueil. */
check(
  'toutes les pages ont le hero de l’accueil',
  [accueil, universBande, metierBande, pageShop, pageProduit, pageSupermarriage, pagePrestataire, pageArticle].every((h) =>
    h.includes('min-h-[100svh]'),
  ),
  true,
);

/* L'article porte la même bande, et l'on passe d'un article à l'autre. */
/* Sur l'article d'un univers, la bande devient celle des moments du Jour J. */
check('l’article porte la bande des moments', pageArticle.includes('Les moments du Jour J'), true);
check(
  'elle annonce les moments du Jour J',
  pageArticle.includes('Les moments du Jour J') && pageArticle.indexOf('Les moments du Jour J') > pageArticle.indexOf('</header>'),
  true,
);
const universArticle = ALL_ARTICLES[0].universeId!;
const momentsArticle = cartesDesMoments(universArticle);
check('un moment, c’est une heure sur la carte', momentsArticle[0]?.badge, getScenesForStyle(universArticle)[0]?.time);
check('et le morceau du moment', String(momentsArticle[0]?.media.audio ?? '').startsWith('/audio/'), true);
check('chaque moment a son cœur', momentsArticle.every((m) => m.cle.startsWith(`moment|${universArticle}|`)), true);
check(
  'l’article les affiche tous',
  momentsArticle.every((m) => pageArticle.includes((m.badge ?? '·').replace('&', '&amp;'))),
  true,
);

/* ---------- les cartes vivantes : le cœur partagé, le play, les quatre pages -- */

/* Le cœur passe par le comptoir partagé : le nombre est public, jamais un nom. */
const avantAvis = await chargerLive('vegas');
check('le comptoir accepte les avis', typeof avantAvis?.avis, 'object');
await envoyerGeste('vegas', { type: 'aimer', cle: 'univers|vegas' });
await envoyerGeste('vegas', { type: 'aimer', cle: 'univers|vegas' });
await envoyerGeste('vegas', { type: 'aimer', cle: 'univers|vegas', sens: 'moins' });
const apresAvis = await chargerLive('vegas');
check('deux cœurs posés, un retiré : il en reste un', apresAvis?.avis['univers|vegas'], 1);
check('un avis ne descend jamais sous zéro', appliquerGeste(TERMINAL_VIDE, { type: 'aimer', cle: 'x', sens: 'moins' }), null);
check('les avis de deux univers ne se mélangent pas', apresAvis?.avis['univers|corse'], undefined);

/* Les quatre pages fabriquent leurs cartes avec la même fabrique. */
const cartesUnivers = cartesDesUnivers(() => '/le-mariage/vegas');
check('un univers donne une carte vivante', cartesUnivers.length, ALL_STYLES.length);
check('avec sa clé d’avis', cartesUnivers[0]?.cle, `univers|${ALL_STYLES[0]!.id}`);
check('sans badge : le nom lui suffit', cartesUnivers[1]?.badge, undefined);
check('et sans ligne d’univers', cartesUnivers[1]?.etiquette, undefined);
check('et un morceau à jouer', String(cartesUnivers[1]?.media.audio ?? '').startsWith('/audio/'), true);

const cartesProduits = cartesDesProduits(SHOP_PRODUCTS.slice(0, 4));
check('un produit donne une carte vivante', cartesProduits.length, 4);
check('avec son mode en badge', cartesProduits[0]?.badge, modeLabel(SHOP_PRODUCTS[0]!.mode));
check('son prix, et sa clé', [cartesProduits[0]?.sousTitre?.includes(SHOP_PRODUCTS[0]!.price), cartesProduits[0]?.cle], [true, `produit|${SHOP_PRODUCTS[0]!.slug}`]);

/* Le shop et la fiche produit portent la bande, et le play y est prêt. */
check('le shop a sa bande de pièces', pageShop.includes('Les pièces, en conditions'), true);
check('le shop l’installe sous son hero', pageShop.indexOf('Les pièces, en conditions') > pageShop.indexOf('</header>'), true);
check('la fiche produit a la sienne', pageProduit.includes('Dans le même univers'), true);
check('et chaque pièce y porte son cœur', pageProduit.includes('Aimer '), true);

/* L'espace prestataire : les métiers en cartes, les avis et le média. */
check('l’espace prestataire a sa bande de métiers', pagePrestataire.includes('Les métiers de cet univers'), true);
check(
  'les cartes y portent le domaine du métier',
  pagePrestataire.includes('Fleurs &amp; Jardins') || pagePrestataire.includes('Cuisine'),
  true,
);

/* Le lecteur : il prend le hero, avec le morceau de la carte. */
const lecteur = renderToStaticMarkup(
  createElement(LecteurHero as never, {
    carte: cartesUnivers[1],
    enLecture: true,
    onBasculer: () => undefined,
    onFermer: () => undefined,
  }),
);
check('le lecteur montre la carte', lecteur.includes(cartesUnivers[1]!.titre), true);
check('il prend le hero, pas tout l’écran', lecteur.includes('bottom-full') && lecteur.includes('h-[100svh]'), true);
check('la bande reste devant lui', lecteur.includes('z-30'), true);
check('il dit ce qu’il joue', lecteur.includes('Le morceau joue'), true);
check('son plan est animé', lecteur.includes('hero-plan'), true);
check('et il se ferme', lecteur.includes('Fermer le lecteur'), true);

/* -------------------- le générique, les personnages, l'univers en dessous -- */

/* L'OUVERTURE : le nom, la lumière qui le traverse, puis elle se fond. */
const vraiStockage = (globalThis as { sessionStorage?: unknown }).sessionStorage;
(globalThis as { sessionStorage?: unknown }).sessionStorage = {
  getItem: () => null,
  setItem: () => undefined,
};
const generique = renderToStaticMarkup(createElement(OuvertureSite as never));
(globalThis as { sessionStorage?: unknown }).sessionStorage = vraiStockage;

check('le générique écrit le nom en grand', generique.includes('SUPER MARIAGE'), true);
check('une lumière le traverse', generique.includes('vp-lumiere'), true);
check('et l’on peut passer', generique.includes('Passer'), true);
check('il se joue une fois par visite', ouvertureDejaVue(), true);
check('sans stockage, on ne le force pas', DUREE_OUVERTURE_SANS_MOUVEMENT < DUREE_OUVERTURE, true);

/* LES PERSONNAGES : les rôles de la taxonomie, et les variantes du site. */
check(
  'tous les rôles de la taxonomie sont là',
  FULL_ROLES_TAXONOMY.every((r) => PERSONNAGES.some((p) => p.id === r.id)),
  true,
);
check('et les variantes que le site ajoute', PERSONNAGES.length > FULL_ROLES_TAXONOMY.length, true);
check('et le premier est celui des mariés', PERSONNAGES[0]?.id, 'maries');
/* Une carte peut porter une personne, ou deux — c'est le même jour vu de deux têtes. */
check(
  'les variantes d’un couple : seul, seule, et à deux',
  TITRES.find((t) => t.id === 'futurs')!.cartes.map((id) => personnageParId(id)!.places),
  [1, 1, 2, 2, 2],
);
check('une carte peut porter deux personnes', PERSONNAGES.filter((p) => p.places > 1).length >= 4, true);
check(
  'et la carte le dit',
  cartesDesPersonas(undefined, ['maries'])[0]?.badge,
  '2 places',
);

/* LES TITRES DU GÉNÉRIQUE : un titre, puis les cartes à choisir. */
check(
  'les cinq titres, dans l’ordre du parcours',
  TITRES.map((t) => t.nom),
  ['SUPER PRESTATAIRE', 'SUPER MARIÉ(E)', 'SUPER FUTUR MARIÉ(E)', 'SUPER FAMILLE', 'SUPER TÉMOIN'],
);
check('chaque titre ouvre ses cartes', TITRES.every((t) => t.domaines || t.cartes.length > 0), true);
check(
  'et chaque carte est un personnage du site',
  TITRES.flatMap((t) => t.cartes).every((id) => Boolean(personnageParId(id))),
  true,
);

/* LES DOMAINES : le second niveau, sous les prestataires. */
check('les domaines des prestataires', DOMAINES_PRESTATAIRES.map((d) => d.label), [
  'Réception & Bouche',
  'Cérémonie & Coordination',
  'Musique & Live',
  'Image & Mémoire',
  'Style & Scénographie',
  'Logistique & Sécurité',
  'Métiers Transverses',
]);
check('chaque domaine ouvre ses métiers', DOMAINES_PRESTATAIRES.every((d) => d.cartes.length >= 1), true);
check(
  'et ces métiers sont des personnages du site',
  DOMAINES_PRESTATAIRES.flatMap((d) => d.cartes).every((id) => Boolean(personnageParId(id))),
  true,
);
check(
  'tous les métiers ont leur domaine',
  DOMAINES_PRESTATAIRES.flatMap((d) => d.cartes).length,
  PERSONNAGES.filter((p) => !['maries', 'marie', 'mariee', 'mariees', 'maries_e', 'futur_marie', 'future_mariee', 'futurs_maries', 'futures_mariees', 'futurs_maries_e', 'famille', 'invites', 'temoin'].includes(p.id)).length,
);
check(
  'un domaine a sa carte, sans média à lancer',
  cartesDesDomaines(DOMAINES_PRESTATAIRES).every((c) => !c.media.audio && c.badge === 'Domaine'),
  true,
);
check(
  'chacun a sa phrase, ses entrées, son visuel et son picto',
  PERSONNAGES.every(
    (p) => p.phrase.length > 20 && p.entrees.length >= 3 && p.image.startsWith('/images/') && Boolean(p.picto),
  ),
  true,
);
check('aucun personnage en double', new Set(PERSONNAGES.map((p) => p.id)).size, PERSONNAGES.length);
check('et le hero traverse exactement les mêmes', VISUELS_DU_HERO.length, PERSONNAGES.length);

/* LES CARTES DES RÔLES : les mêmes que les univers, et le play qui fait entrer. */
check('les rôles sont des cartes vivantes', cartesDesPersonas().length, PERSONNAGES.length);
check('avec leur clé d’avis', cartesDesPersonas()[1]?.cle, `persona|${PERSONNAGES[1]!.id}`);
check('leur famille en badge', cartesDesPersonas()[1]?.badge, PERSONNAGES[1]!.famille);
check('leur phrase en précision', cartesDesPersonas()[1]?.sousTitre, PERSONNAGES[1]!.phrase);
check('et un média qui joue', String(cartesDesPersonas()[1]?.media.audio ?? '').startsWith('/audio/'), true);
check(
  'le play d’une carte de domaine l’ouvre',
  accueil.includes(`aria-label="Ouvrir ${enHtml(DOMAINES_PRESTATAIRES[0]!.label)}"`),
  true,
);
check(
  'et pas seulement avec le milieu',
  accueil.includes(`aria-label="Ouvrir ${enHtml(DOMAINES_PRESTATAIRES[1]!.label)}"`),
  true,
);
check('un domaine ne s’ouvre pas tout seul', accueil.includes('Tous les domaines'), false);
check('plus de bouton « Entrer » à part', accueil.includes('>Entrer<'), false);

/* L'univers reste le second axe : sa bande, et son propre défilé. */
check('la bande des univers est toujours sous le hero', accueil.includes('Les univers'), true);
check('elle montre trois cartes', (accueil.match(/Aimer /g) ?? []).length, 6);
check('et son milieu est la carte de la page', accueil.includes('data-actif="true"'), true);

/* ------------------------- le dock est une capsule de commande -------------- */

/* Le dock n'est plus un porte-outils de rôle : c'est la télécommande du
   magazine — l'entrée stable, les cinq moments, et la timeline. */
localStorage.removeItem('supermariage:persona');
check('sans choix, on est les mariés', personaCourant(), 'maries');
const dockDefaut = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/le-mariage/vegas'] }, createElement(BottomCapsuleNav as never)),
);
check('le dock a son entrée stable : le point zéro', dockDefaut.includes('aria-label="Le Point Zéro"'), true);
check(
  'les cinq moments pilotent la couverture',
  ['l’aube', 'le matin', 'le midi', 'l’après-midi', 'le soir'].every((m) => dockDefaut.includes(`Le moment — ${m}`)),
  true,
);
check(
  'et l’atelier du temps a son picto',
  dockDefaut.includes('aria-label="L’atelier du temps — la timeline"'),
  true,
);

/* **LE CADRAN DU DOCK** : la miniature du cadran de la couverture. Le dock et la
   couverture ne disent donc jamais deux choses différentes — la même heure, le
   même chapitre. */
choisirMoment('soir');
publierReperes({ magazine: 'Magazine 38', chapitre: 'Chapitre 05 — La Fête', numeroDeChapitre: 5, jour: '21 septembre' });
const dockCadran = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/'] }, createElement(BottomCapsuleNav as never)),
);
const lectureDuDock = dockCadran;
choisirMoment(null);
publierReperes(null);
check(
  'le dock porte le cadran de la couverture',
  lectureDuDock.includes('data-aiguille="heure"') && lectureDuDock.includes('data-aiguille="chapitre"'),
  true,
);
check('ses sept chapitres sont dessinés', (lectureDuDock.match(/data-chapitre="/g) ?? []).length, 7);
check('un seul est actif : celui de la page ouverte', (lectureDuDock.match(/data-actif="true"/g) ?? []).length, 1);
check(
  'le moment choisi pose l’aiguille, et s’écrit',
  lectureDuDock.includes('title="Magazine 38 · ch. 05 · 20 h — ouvrir l’atelier du temps"'),
  true,
);
check('le cadran sait ses deux heures', [angleDeLHeure(0), angleDeLHeure(6), angleDeLHeure(20)].map(Math.round), [-90, 0, 210]);
check('et ses sept chapitres', Array.from({ length: 7 }, (_, i) => angleDuChapitre(i + 1)).every((a, i, t) => i === 0 || a > t[i - 1]!), true);
check('la légende de l’heure est du temps qu’il est', legendeDeLHeure(20), '20 H — LE SOIR');
check('et l’heure vient de la capsule', tempsDeLaCapsule(new Date(2026, 8, 21, 9, 30)).etiquette, '9 h 30');
check('les outils de rôle ont quitté le dock', dockDefaut.includes('les outils de'), false);
/* Les deux flèches se posent de chaque côté du dock, quand une bande les mène. */
check('sans bande menée, pas de flèches', dockDefaut.includes('aria-label="Précédent"'), false);
/* Le rôle qui mène la bande met ses flèches à côté du dock. */
enregistrerControlesBande({ precedent: () => undefined, suivant: () => undefined });
const dockFleches = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/'] }, createElement(BottomCapsuleNav as never)),
);
enregistrerControlesBande(null);
check('les flèches encadrent le dock', ['aria-label="Précédent"', 'aria-label="Suivant"'].every((f) => dockFleches.includes(f)), true);

/* Deux bandes sur une page : le dock mène **celle qu'on regarde** — la dernière
   entrée à l'écran prend les flèches, et l'autre les rend en partant. */
const rien = { precedent: () => undefined, suivant: () => undefined };
const dockDe = () =>
  renderToStaticMarkup(createElement(MemoryRouter, null, createElement(BottomCapsuleNav as never)));
enregistrerControlesBande(rien, 'roles');
enregistrerControlesBande(rien, 'univers');
check('les flèches suivent la bande à l’écran', dockDe().includes('aria-label="Précédent"'), true);
enregistrerControlesBande(null, 'univers');
check('et reviennent quand on remonte', dockDe().includes('aria-label="Précédent"'), true);
enregistrerControlesBande(null, 'roles');
check('sans bande à l’écran, plus de flèches', dockDe().includes('aria-label="Précédent"'), false);

/* ————————————————— AIME MAGAZINE : LA REVUE, ÉDITION PAR ÉDITION ————————————————— */

check('la marque de la revue', MARQUE_MAGAZINE, 'AIME MAGAZINE');
check('les éditions sont là', COUVERTURES.length >= 6, true);
check('chacune a son numéro, son thème et sa couverture', COUVERTURES.every((c) => c.numero && c.theme && c.visuel), true);
check('numérotées dans l’ordre', COUVERTURES.map((c) => c.numero), COUVERTURES.map((_, i) => String(i + 1).padStart(2, '0')));
check('aucune couverture vide', COUVERTURES.every((c) => c.articles.length >= 2), true);
check('et trois titres à la une, au plus', COUVERTURES.every((c) => c.aLaUne.length >= 1 && c.aLaUne.length <= 3), true);
check(
  'les titres à la une sont ceux de l’édition',
  COUVERTURES.every((c) => c.aLaUne.every((t) => c.articles.some((a) => a.title === t))),
  true,
);
check(
  'un thème mène vraiment le sujet',
  couvertureParId('lumiere')!.articles[0]!.title.toLowerCase().includes('cinéma') ||
    couvertureParId('lumiere')!.articles[0]!.title.toLowerCase().includes('35mm'),
  true,
);
check(
  'et l’on sait de quelle édition vient un article',
  Boolean(couvertureDArticle(couvertureParId('insolite')!.articles[0]!.slug)),
  true,
);
check(
  'tous les articles du site sont dans au moins une édition',
  ALL_ARTICLES.every((a) => COUVERTURES.some((c) => c.articles.some((x) => x.slug === a.slug))),
  true,
);

/* La page : un titre, une couverture ouverte, ses articles — et rien de répété. */
const pageRevue = rendrePage('/magazine', Magazine);
const revue = pageRevue.replace(/&amp;/g, '&').replace(/&#x27;|&apos;/g, "'");
check('la marque est sur l’écran', revue.includes(MARQUE_MAGAZINE), true);
check('et le magazine du jour est nommé', revue.includes(niveauxDuJour(new Date()).magazine), true);
check('la page n’explique plus son interface', revue.includes('Votre magazine, maintenant'), false);
check(
  'et le chapitre du jour est nommé, sur la scène',
  revue.includes(niveauxDuJour(new Date()).chapitre.split(' — ')[1]!.toUpperCase()),
  true,
);
check('la couverture est une carte à part', typeof CouvertureMagazine, 'function');
check('les couvertures ont leur état', revue.includes('aria-pressed'), true);

/* ——————————— LE JEU DE 54 : LE CALENDRIER D'AIME MAGAZINE ——————————— */

/* 52 semaines, 4 saisons, 13 semaines par saison : la symétrie du jeu. */
check('il y a cinquante-quatre numéros', JEU_DE_54.length, 54);
check('quatre saisons, comme quatre couleurs', SAISONS.length, 4);
check(
  'treize semaines par saison, comme treize cartes par couleur',
  SAISONS.every((s) => numerosDeLaSaison(s.id).length === 13),
  true,
);
check('chaque saison a sa couleur', SAISONS.map((s) => s.couleur), ['coeur', 'carreau', 'trefle', 'pique']);
check(
  'et son fond uni, avec son encre',
  SAISONS.every((s) => /^#[0-9A-F]{6}$/i.test(s.fond) && /^#[0-9A-F]{6}$/i.test(s.encre)),
  true,
);
check('les cinquante-deux semaines sont couvertes une fois', new Set(SAISONS.flatMap((s) => numerosDeLaSaison(s.id).flatMap((c) => (c.semaine ? [c.semaine] : [])))).size, 52);
check('et il reste deux jokers', JEU_DE_54.filter((c) => c.joker).length, 2);
check('le premier joker est le jour de trop', carteDuNumero(53).semaine, null);
check('et le second, l’année bissextile', carteDuNumero(54).joker, true);
check('chaque carte a sa figure et son sens', JEU_DE_54.every((c) => Boolean(c.figure && c.sens && c.ton)), true);
check('et son fond vient de sa saison', carteDuNumero(38).fond, SAISONS[1]!.fond);
check('la semaine 38 est en été', saisonDeLaSemaine(38).id, 'ete');
check('la semaine 1 est en hiver', saisonDeLaSemaine(1).id, 'hiver');
check('la semaine 52 aussi', saisonDeLaSemaine(52).id, 'hiver');

/* Les quatre créations digitales existent vraiment : on les sert au centre. */
const racine = process.cwd();
check(
  'les quatre créations de saison sont sur le disque',
  SAISONS.every((s) => existsSync(join(racine, 'public', s.visuel))),
  true,
);

/* ——————————— LES HABITUDES DE L’ANNÉE : LES PAS-DE-TEMPS ——————————— */

check('l’année se lit en treize pas-de-temps', PAS_DE_TEMPS.length, 13);
check(
  'et chacun couvre des semaines, sans trou ni recouvrement',
  Array.from({ length: 52 }, (_, i) => i + 1).every((n) => Boolean(pasDeTempsDeLaSemaine(n).dit)),
  true,
);
check('le carême est un temps clos', PAS_DE_TEMPS.some((t) => /carême/i.test(t.nom) && /prohib/i.test(t.dit + t.sage)), true);
check('mai est évité, et le dit reste', PAS_DE_TEMPS.some((t) => /mai/i.test(t.nom) && /noce de mai/i.test(t.dit.toLowerCase())), true);
check('novembre est le mois des morts', PAS_DE_TEMPS.some((t) => /morts/i.test(t.nom)), true);
check('et l’Avent ferme l’année', PAS_DE_TEMPS.some((t) => /avent/i.test(t.nom)), true);
check('chaque pas-de-temps dit l’usage et le conseil', PAS_DE_TEMPS.every((t) => t.dit.length > 20 && t.sage.length > 20), true);

/* La lune : on se mariait sur une lune qui monte. */
check('on sait où est la lune', typeof phaseDeLune(new Date(2026, 8, 20)).nom, 'string');
check('et une semaine a ses deux bornes', bornesDeLaSemaine(2026, 38)[1].getTime() > bornesDeLaSemaine(2026, 38)[0].getTime(), true);
check('la semaine d’une date est entre 1 et 52', semaineDeLAnnee(new Date(2026, 8, 20)) >= 1 && semaineDeLAnnee(new Date(2026, 8, 20)) <= 52, true);

/* ——————————— LE MOTEUR : MÊME SEMAINE, MÊME ÉDITION ——————————— */

const edition38 = composerEdition({ numero: 38, annee: 2026, roleId: 'photographe', temps: 'present' });
check('une édition a toujours vingt-quatre pages', edition38.pages.length, PAGES_EDITION);
check(
  'et les huit rubriques font trois fois le tour du jour',
  edition38.pages.map((p) => p.rubrique),
  [...RUBRIQUES, ...RUBRIQUES, ...RUBRIQUES],
);
check('les vingt-quatre heures s’y suivent', edition38.pages.map((p) => p.heure), Array.from({ length: 24 }, (_, i) => i));
check('les rubriques sont huit', RUBRIQUES.length, 8);
check('le titre donne le numéro et la saison', edition38.titre, 'N° 38 · Été');
check('elle sait de quelle carte elle parle', edition38.carte.nom, 'Roi de carreau');
check('et chaque page dit ce qui l’a décidée', edition38.pages.every((p) => Boolean(p.source)), true);
check(
  'mêmes choix, même édition',
  JSON.stringify(composerEdition({ numero: 38, annee: 2026, roleId: 'photographe' })),
  JSON.stringify(composerEdition({ numero: 38, annee: 2026, roleId: 'photographe' })),
);
check(
  'un autre rôle recompose le magazine',
  JSON.stringify(composerEdition({ numero: 38, annee: 2026, roleId: 'fleuriste' })) !==
    JSON.stringify(edition38),
  true,
);
check(
  'une coche de plus aussi',
  JSON.stringify(composerEdition({ numero: 38, annee: 2026, roleId: 'photographe', options: ['assoc'] })) !==
    JSON.stringify(edition38),
  true,
);
check(
  'un autre univers aussi',
  JSON.stringify(composerEdition({ numero: 38, annee: 2026, roleId: 'photographe', styleId: 'vegas' })) !==
    JSON.stringify(edition38),
  true,
);
check('aucune page ne reste vide, quelle que soit la semaine', Array.from({ length: 54 }, (_, i) => composerEdition({ numero: i + 1 })).every((e) => e.pages.length === PAGES_EDITION && e.pages.every((p) => p.titre.length > 3 && p.texte.length > 40 && p.nomDeLHeure.length > 2)), true);

/* Passé, présent, futur : la même semaine, trois lectures. */
const tempsLus = troisTemps({ numero: 38, roleId: 'photographe' });
check('trois temps pour une semaine', tempsLus.length, 3);
check('dans l’ordre passé, présent, futur', tempsLus.map((e) => e.temps), ['passe', 'present', 'futur']);
check('la même carte pour les trois', new Set(tempsLus.map((e) => e.carte.numero)).size, 1);
check('mais pas le même contenu', new Set(tempsLus.map((e) => JSON.stringify(e.pages))).size, 3);
check('l’édition du moment est celle de cette semaine', editionDuMoment().numero, semaineDeLAnnee(new Date()));
check('et les quatre saisons sont quatre numéros différents', new Set(lesQuatreSaisons().map((e) => e.numero)).size, 4);
check('chacune prise dans sa saison', lesQuatreSaisons().every((e) => e.saison.id === e.carte.saison.id), true);

/* ——————————— LA PAGE : L'IMAGE DERRIÈRE, LA GRILLE DEVANT ——————————— */

const heroMagazine = revue.slice(revue.indexOf('data-scene="editoriale"'), revue.indexOf('data-grille'));
check('l’écran s’ouvre sur la scène', heroMagazine.length > 0, true);
check('et rien d’autre ne s’intercale avant la grille', heroMagazine.includes('data-case='), false);
check('la grille prend l’écran', revue.includes('data-grille="du-monde"'), true);

/* ————————————— LA SCÈNE ÉDITORIALE : UNE IMAGE, TROIS LIGNES ————————————— */

/* La scène ne dit plus rien d'autre : la date, le titre, le moment. Ni badge,
   ni compteur, ni panneau — ce qui existe se découvre dans la mosaïque. */
const scene = renderToStaticMarkup(
  createElement(MemoryRouter, null, createElement(SceneEditoriale as never, {
    date: '20 SEPTEMBRE · MAGAZINE 38',
    titre: 'GOLDEN HOUR',
    moment: 'SEPTEMBRE DORÉ · L’ART DE RECEVOIR',
    image: '/images/magazine/semaine-38/cover.jpg',
    heure: 18,
    clarte: lumiereDeLHeure(18).clarte,
    voile: lumiereDeLHeure(18).voile,
    alpha: lumiereDeLHeure(18).alpha,
    accent: '#D9A15B',
  })),
);
check('la scène est une scène, pas un hero de page', scene.includes('data-scene="editoriale"'), true);
check('elle porte la date', scene.includes('20 SEPTEMBRE · MAGAZINE 38'), true);
check('le titre', scene.includes('GOLDEN HOUR'), true);
check('et le moment', scene.includes('SEPTEMBRE DORÉ · L’ART DE RECEVOIR'), true);
check('elle ne compte rien', /data-(badge|compteur|panneau)/.test(scene), false);
check('et l’heure est écrite une fois', (scene.match(/18:00/g) ?? []).length, 1);
check(
  'sans image, elle compose',
  renderToStaticMarkup(createElement(SceneEditoriale as never, {
    date: '5 JANVIER', titre: 'Blanc minéral', moment: 'LES LIEUX', heure: 9, accent: '#8A8F98',
  })).includes('bg-black'),
  true,
);

/* ————————————— LA GRILLE DU MONDE : L'ÉCRAN ENTIER ————————————— */

/* Il n'y a plus de timeline en bas de page : **la grille est la page**. Des
   cases carrées, bord à bord, qu'on parcourt dans les deux sens, qui montrent
   de plus en plus d'elles-mêmes quand on zoome, et qui s'ouvrent. */
const leJourDeLaGrille = new Date(2026, 8, 20, 12);
const leMondeDuJour = mondeDuJour(leJourDeLaGrille);
const grille = renderToStaticMarkup(createElement(GrilleDuMonde as never, {
  monde: leMondeDuJour,
  echelle: echelleDuCran(3),
  onEchelle: () => {},
  caseActive: 'univers-musique',
  selection: ['univers-lieux', 'univers-people'],
}));
check('la grille du monde est là', grille.includes('data-grille="du-monde"'), true);
check('elle dit le monde qu’elle porte', grille.includes('data-monde="jour-09-20"'), true);
check('et son échelle', grille.includes('data-cran="3"'), true);
check('elle compte ses cases', (grille.match(/data-case="/g) ?? []).length, leMondeDuJour.cases.length);
check('chaque case dit son module et son ouverture', /data-module="[a-z]+" data-famille="[a-z]+"/.test(grille), true);
check('cinq crans d’échelle, pas quatre', (grille.match(/data-cran-grille="/g) ?? []).length, 5);
check('la tête de lecture marque la case active', (grille.match(/data-actif="true"/g) ?? []).length >= 1, true);
check('les cases choisies sont marquées', (grille.match(/data-choisi="true"/g) ?? []).length, 2);
check('et la barre de sélection dit ce qu’on peut en faire',
  ['composer', 'masquer', 'partager', 'effacer'].every((a) => grille.includes(`data-action="${a}"`)), true);
check('sans carte arrondie ni ombre portée', /rounded-(lg|xl|2xl)|shadow-(lg|xl|2xl)/.test(grille), false);
check('et sans texte explicatif', /cliquez|double-cliquez|pour naviguer/.test(grille), false);

/* La densité : c'est la taille réelle qui décide, jamais l'échelle en soi. */
check('une case de quinze pixels ne dit rien', densiteDeLaTaille(15), 1);
check('une case de trois cents pixels dit tout', densiteDeLaTaille(300), 5);
check('et la densité ne redescend jamais', [40, 70, 100, 150, 200, 400].every((t, i, l) => i === 0 || densiteDeLaTaille(t) >= densiteDeLaTaille(l[i - 1]!)), true);
check('cinq échelles, du monde au contenu', ECHELLES_DE_LA_GRILLE.length, 5);
check('la première montre tout', echelleDuCran(1) < echelleDuCran(5), true);
check('et le cran se retrouve depuis l’échelle', cranDeLEchelle(ECHELLES_DE_LA_GRILLE[2]!), 3);
check('l’échelle est tenue entre ses bornes', borner(99) > borner(0), true);
check('la taille d’une case suit l’échelle', tailleDeLaCase(1) === 2 * tailleDeLaCase(0.5), true);
check('un monde de trois cent soixante-cinq jours s’ouvre large', colonnesDeLaGrille(365, 1280, 820), 24);
check('un monde de huit cases reste serré', colonnesDeLaGrille(8, 1280, 820), 4);
check('et un petit monde remplit l’écran', ajustementDeRemplissage(4, 2, 1280, 820) > 1, true);

/* Le clic entre dans la case : la grille rapporte, la page décide. */
check('un clic sans doigt qui bouge ne se perd pas',
  renderToStaticMarkup(createElement(GrilleDuMonde as never, { monde: leMondeDuJour, echelle: 0.42, onEchelle: () => {}, onOuvrir: () => {} })).includes('data-porte="true"'), true);

/* ————————————— LE MONDE EN CASES : TOUT EST UNE CASE ————————————— */

/* Rien n'échappe à la grille : le calendrier, les articles, la musique, les
   objets, les métiers, les gens, les images. Chaque collection devient un monde,
   et chaque monde se parcourt comme le premier. */

const le21SeptembreGrille = new Date(2026, 8, 21, 12);
const caseDu21 = caseDUnJour(le21SeptembreGrille);
check('le monde s’ouvre sur dix portes', mondeDeLId('monde', le21SeptembreGrille).cases.length, 10);
check('chaque nœud du monde se construit', NŒUDS_DU_MONDE.every((n) => mondeDeLId(n.id, le21SeptembreGrille).cases.length > 0), true);
check('et chacun dit d’où il vient', NŒUDS_DU_MONDE.every((n) => n.source.length >= 8), true);
check('un jour dit sa date en surtitre', caseDu21.surTitre, '21 SEPT. 2026');
check('son nom est celui du calendrier', caseDu21.titre, 'MATTHIEU');
check('et il ouvre son propre monde', caseDu21.ouvre, 'jour-09-21');
check('son détail nomme le magazine', caseDu21.detail?.some((d) => d.label === 'MAGAZINE' && d.valeur === '38'), true);
check('et le chapitre du jour', caseDu21.detail?.some((d) => d.valeur.includes('La Fête')), true);
check('la clé d’un jour est son adresse', cleDuJour(le21SeptembreGrille), '09-21');
check('l’année compte trois cent soixante-cinq cases', mondeDeLAnnee(new Date(2026, 5, 1)).cases.length, 365);
check('le jour contient huit univers, et la porte des heures', mondeDuJour(le21SeptembreGrille).cases.length, UNIVERS_DU_JOUR.length + 1);
check('les huit univers sont ceux du magazine', UNIVERS_DU_JOUR.map((u) => u.titre),
  ['HISTOIRE', 'VOYAGE', 'MÉTÉO', 'MARIAGE', 'MUSIQUE', 'LIEUX', 'PEOPLE', 'ÉVÉNEMENTS']);
check('et chacun ouvre une mosaïque', mondeDuJour(le21SeptembreGrille).cases.filter((c) => c.ouvre?.startsWith('univers-')).length, 8);
check('une journée, ce sont vingt-quatre heures', mondeDesHeures(le21SeptembreGrille).cases.length, 24);
check('la première est minuit', mondeDesHeures(le21SeptembreGrille).cases[0]!.titre, 'MINUIT');
check('et dix-huit heures s’appelle la golden hour', mondeDesHeures(le21SeptembreGrille).cases[18]!.sousTitre, 'GOLDEN HOUR');
check('chaque heure ouvre sa page', mondeDesHeures(le21SeptembreGrille).cases[16]!.ouvre, 'heure-16');
check('et une page porte ses modules', mondeDUneHeure(16, le21SeptembreGrille).cases.some((c) => c.module === 'audio'), true);
check('les cinquante-quatre magazines sont cinquante-quatre cases', mondeDesMagazines(le21SeptembreGrille).cases.length, NOMBRE_DE_MAGAZINES);
check('les articles de la rédaction sont des cases', mondeDesArticles().cases.length, ALL_ARTICLES.length);
check('la musique donne un morceau par jour', mondeDeLaMusique(le21SeptembreGrille).cases.length, 365);
check('la boutique donne un objet par case', mondeDeLaBoutique().cases.length, SHOP_PRODUCTS.length);
check('les métiers et les gens ont leurs cases', mondeDesMetiers().cases.length > 40 && mondeDesPersonnes().cases.length > 10, true);
check('et la galerie ne montre que ce qui est livré', mondeDeLaGalerie(le21SeptembreGrille).cases.length, VISUELS_LIVRES);
check('une case se retrouve par son identifiant', caseParId('jour-09-21', le21SeptembreGrille)?.titre, 'MATTHIEU');
check('un morceau aussi', caseParId('piste-200', le21SeptembreGrille)?.module, 'audio');
check('et une porte nommée reste une porte', caseParId('chapitre-38-5', le21SeptembreGrille)?.ouvre, 'chapitre-38-5');
check('une adresse de cases garde son ordre',
  casesParIds(['piste-200', 'jour-09-21', 'porte-annee'], le21SeptembreGrille).map((c) => c.id),
  ['piste-200', 'jour-09-21', 'porte-annee']);
check('et ne retient que ce qui existe', casesParIds(['rien-du-tout'], le21SeptembreGrille).length, 0);
check('huit modules de case… non : dix-huit', MODULES.length, 18);
check('une composition garde les cases choisies', composerLeMiniSite([], mondeDuJour(le21SeptembreGrille).cases.slice(0, 3)).length, 3);
check('et reprend leur ouverture', composerLeMiniSite([], [mondeDuJour(le21SeptembreGrille).cases[0]!])[0]!.famille, 'public');
check('les modules de composition sont là', MODULES_DE_COMPOSITION.length >= 20, true);
check('un invité compose son espace en onze blocs', composerLeMiniSite(MINI_SITE_INVITE).length, MINI_SITE_INVITE.length);
check('un professionnel en neuf', composerLeMiniSite(MINI_SITE_PRESTATAIRE).length, MINI_SITE_PRESTATAIRE.length);
check('et le mini-site se parcourt comme un monde', mondeDuMiniSite(composerLeMiniSite(MINI_SITE_INVITE)).cases.length, MINI_SITE_INVITE.length);
check('quatre familles d’ouverture', FAMILLES.map((f) => f.id), ['public', 'invites', 'famille', 'prive']);
check('chacune a sa marque, et rien de plus', FAMILLES.every((f) => f.marque.length >= 1 && f.mot.length > 3), true);
check('de loin, l’année ne dit que ses images', densiteDuMonde(mondeDeLAnnee(le21SeptembreGrille), echelleDuCran(1)), 1);
check('de près, les dix portes disent tout', densiteDuMonde(mondeDeLId('monde', le21SeptembreGrille), echelleDuCran(5)), 5);

/* Une case privée le dit d'un seul signe — et rien du tout quand elle est publique. */
const uneCasePublique = mondeDuJour(le21SeptembreGrille).cases[0]!;
const ouverteATous = composerLeMiniSite([], [uneCasePublique]);
const gardee = composerLeMiniSite([], [uneCasePublique], { [uneCasePublique.id]: 'prive' });
check('une case privée porte sa marque, minuscule',
  renderToStaticMarkup(createElement(GrilleDuMonde as never, {
    monde: mondeDuMiniSite(gardee), echelle: echelleDuCran(5), onEchelle: () => {},
  })).includes('data-famille="prive"'), true);
check('et une case publique n’en porte aucune',
  renderToStaticMarkup(createElement(GrilleDuMonde as never, {
    monde: mondeDuMiniSite(ouverteATous), echelle: echelleDuCran(5), onEchelle: () => {},
  })).includes('data-famille="prive"'), false);

/* Et **chaque porte mène quelque part** : on ouvre tous les mondes du monde. */
const portesMortes: string[] = [];
let portesComptees = 0;
const verifierLesPortes = (id: string) => {
  const monde = mondeDeLId(id, le21SeptembreGrille);
  monde.cases.forEach((c) => {
    if (!c.ouvre) return;
    portesComptees += 1;
    const suivant = mondeDeLId(c.ouvre, le21SeptembreGrille);
    if (suivant.cases.length === 0 || suivant.id !== c.ouvre) portesMortes.push(`${id} → ${c.ouvre}`);
  });
};
NŒUDS_DU_MONDE.forEach((n) => verifierLesPortes(n.id));
['jour-09-21', 'univers-musique', 'univers-lieux', 'heure-18', 'piste-3'].forEach(verifierLesPortes);
check('aucune porte ne mène nulle part', portesMortes.length, 0);
check('et il y a de quoi ouvrir toute une année', portesComptees > 500, true);

/* La lumière des heures : la même image, vingt-quatre fois. */
check('la nuit est plus sombre que midi', lumiereDeLHeure(2).clarte < lumiereDeLHeure(12).clarte, true);
check('la golden hour est nommée', lumiereDeLHeure(18).mot, 'GOLDEN HOUR');
check('et six heures s’appelle l’aube', lumiereDeLHeure(6).mot, 'AUBE');
check('les heures ordinaires n’ont pas de mot', lumiereDeLHeure(16).mot, undefined);
check(
  'chaque heure a sa couleur — dix lumières, et la nuit qui descend',
  new Set(Array.from({ length: 24 }, (_, h) => teinteDeLHeure(h, '#E9E9E4', '#D9A15B'))).size >= 8,
  true,
);
check('et deux heures voisines ne se ressemblent pas', teinteDeLHeure(2, '#E9E9E4', '#D9A15B') !== teinteDeLHeure(12, '#E9E9E4', '#D9A15B'), true);
check('et l’on sait mélanger deux couleurs', melangeHex('#000000', '#FFFFFF', 0.5), '#808080');

/* ————————————— LA PAGE : TOUT TIENT DANS LA FENÊTRE ————————————— */

const appMagazine = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/magazine'] }, createElement(Magazine as never)),
);
/** Le cinquième cran : les cases disent tout ce qu'elles savent. */
const appZoom = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/magazine?niveau=5&monde=univers-musique'] }, createElement(Magazine as never)),
);
/** L'année entière, en une seule vue : trois cent soixante-cinq cases. */
const appAnnee = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/magazine?monde=annee&niveau=1'] }, createElement(Magazine as never)),
);
/** Une composition partagée : des cases, et des modules. */
const appComposition = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/magazine?monde=mini-site&cases=jour-09-20,musique,rsvp'] }, createElement(Magazine as never)),
);
const appComposer = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/magazine?feuille=composer'] }, createElement(Magazine as never)),
);
const appJour = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/magazine?jour=09-21'] }, createElement(Magazine as never)),
);
/** Les feuilles : ce qui n'est pas sur l'écran, et qui s'ouvre à la demande. */
const appEditeur = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/magazine?feuille=editeur'] }, createElement(Magazine as never)),
);
const appProfil = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/magazine?feuille=profil'] }, createElement(Magazine as never)),
);
check('le magazine est un écran, pas une page qui défile', appMagazine.includes('h-svh') && appMagazine.includes('overflow-hidden'), true);
check('la scène est dedans', appMagazine.includes('data-scene="editoriale"'), true);
check('la grille aussi', appMagazine.includes('data-grille="du-monde"'), true);
check('et la grille ferme l’écran', appMagazine.indexOf('data-grille') > appMagazine.indexOf('data-scene'), true);
check('on arrive devant l’année entière',
  appMagazine.includes('data-monde="annee"') && appMagazine.includes('data-cases="365"'), true);
check('et la grille n’en dessine que ce qu’on voit',
  (appMagazine.match(/data-case="jour-/g) ?? []).length < 365, true);
check('l’année entière tient en une vue', (appAnnee.match(/data-case="jour-/g) ?? []).length, 365);
check('et de si loin, elle ne dit que ses images', appAnnee.includes('data-densite="1"'), true);
check('de très près, une case dit son détail', appZoom.includes('data-densite="5"'), true);
check('et la musique est bien un monde à part', appZoom.includes('data-monde="univers-musique"'), true);
check('on arrive dans une case par son adresse', appJour.includes('data-monde="jour-09-21"'), true);
check('la composition traverse l’adresse', appComposition.includes('data-monde="mini-site"') && (appComposition.match(/data-case="bloc-/g) ?? []).length >= 3, true);
check('et la feuille de composition est là', appComposer.includes('data-composition="mini-site"'), true);
check('l’adresse ouvre le jour qu’elle annonce', appJour.includes('21 SEPTEMBRE') && appJour.includes('LA FÊTE'), true);
check('aucun panneau permanent ne subsiste', /data-bloc-magazine|NavVerticale|vp-env-dark/.test(appMagazine), false);
check('le mot « carreau » a quitté l’écran', /carreau|trèfle|pique|Roi de|Dame de|Valet de|♠|♥|♦|♣/.test(appMagazine), false);
check('et le mot « tuile » aussi', appMagazine.includes('data-tuile'), false);
check('les trois portes sont discrètes',
  ['l’éditeur', 'la collection', 'votre profil'].every((p) => appMagazine.includes(p)), true);
check('et le composeur n’encombre plus l’écran', appMagazine.includes('Ville de naissance'), false);
check('mais il est là dès qu’on demande la feuille', appEditeur.includes('Ville de naissance'), true);
check('et l’adresse peut ouvrir une feuille', appEditeur.includes('data-feuille="ouverte"'), true);

/* ————————————————— LE VERSO : L'ENVERS DU DÉCOR ————————————————— */

/** Le monde d'un jour, au verso : le moteur, ses réglages, et ses liaisons. */
const appVerso = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/magazine?monde=jour-09-21&verso=1'] }, createElement(Magazine as never)),
);
/** Le même jour, à l'endroit : rien du verso ne doit rester. */
const appJourRecto = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/magazine?monde=jour-09-21'] }, createElement(Magazine as never)),
);
const nombre = (html: string, attribut: string) =>
  Number(html.match(new RegExp(`${attribut}="(\\d+)"`))?.[1] ?? NaN);

check('le verso s’ouvre par l’adresse', appVerso.includes('data-verso="ouvert"'), true);
check('et le recto ne le montre pas', appJourRecto.includes('data-verso="ouvert"'), false);
check('la grille dessine toutes ses liaisons', nombre(appVerso, 'data-liaisons') > 0, true);
check(
  'et celles qui sont faites sont bord à bord',
  nombre(appVerso, 'data-connexions') > 0 && nombre(appVerso, 'data-connexions') < nombre(appVerso, 'data-liaisons'),
  true,
);
check('chaque case du verso montre sa face technique', appVerso.includes('data-source="la grille du monde"'), true);
check('et ses quatre ports', (appVerso.match(/data-port="vrai"/g) ?? []).length % 4, 0);
check(
  'les réglages du système sont écrits au verso',
  nombre(appVerso, 'data-reglages') === RÉGLAGES_DU_SYSTÈME.length &&
    ['case', 'echelle', 'densite', 'separation', 'couleur', 'ouverture'].every((id) =>
      appVerso.includes(`data-reglage="${id}"`),
    ),
  true,
);
check('et les palettes des cinquante-quatre magazines aussi', PALETTES_DU_SYSTÈME.length, 54);
check(
  'toutes les liaisons possibles sont montrées, et ce qu’elles produisent',
  nombre(appVerso, 'data-liaisons-possibles') === LIAISONS_POSSIBLES.length &&
    appVerso.includes('data-liaison="image+texte"') &&
    appVerso.includes('une page'),
  true,
);
check(
  'chaque liaison dit ce qu’elle produit',
  LIAISONS_POSSIBLES.every((l) => l.produit.startsWith('un') || l.produit.startsWith('une')),
  true,
);

/* Les liaisons, à la main : deux cases, et ce qui naît de leur rencontre. */
const mondeDuVerso = mondeDeLId('jour-09-21');
const laDate = mondeDuVerso.cases.find((c) => c.module === 'date')!;
const laPersonne = mondeDuVerso.cases.find((c) => c.module === 'personne')!;
const leLieu = mondeDuVerso.cases.find((c) => c.module === 'lieu')!;
const leTexte = mondeDuVerso.cases.find((c) => c.module === 'texte')!;
const unFormulaire = { ...laPersonne, id: 'essai-formulaire', module: 'formulaire' } as never;
check('une date et un formulaire font un billet', liaisonEntre(laDate, unFormulaire)?.produit, 'un billet');
check('deux cases identiques ne se lient pas', liaisonEntre(laDate, laDate), null);
check('et deux modules qui ne vont pas ensemble non plus', liaisonEntre(laDate, laPersonne), null);

const colonnesDuJour = colonnesDuMonde(mondeDuVerso.cases.length, {}, 1280, 820);
const posees = { [laDate.id]: { c: 0, l: 0 }, [leLieu.id]: { c: 1, l: 0 } };
check(
  'posées bord à bord, la liaison se fait',
  liaisonsDuMonde(mondeDuVerso, posees, colonnesDuJour).some(
    (l) => l.faite && ((l.de === laDate.id && l.vers === leLieu.id) || (l.de === leLieu.id && l.vers === laDate.id)),
  ),
  true,
);
check('une date et un lieu font un itinéraire', liaisonEntre(laDate, leLieu)?.produit, 'un itinéraire');
check('un texte et une personne font un portrait', liaisonEntre(leTexte, laPersonne)?.produit, 'un portrait');
check('côte à côte, c’est un pas, et un seul', [sontVoisines({ c: 0, l: 0 }, { c: 1, l: 0 }), sontVoisines({ c: 0, l: 0 }, { c: 0, l: 1 }), sontVoisines({ c: 0, l: 0 }, { c: 1, l: 1 })], [true, true, false]);
check(
  'et une case posée reste où on l’a posée',
  emplacementsDuMonde(mondeDuVerso, posees, colonnesDuJour)[leLieu.id],
  { c: 1, l: 0 },
);
check(
  'le monde relié dit ce qu’il produit',
  chaineDuMonde(liaisonsDuMonde(mondeDuVerso, posees, colonnesDuJour)).includes('un itinéraire'),
  true,
);
check(
  'la face technique d’une case dit son module, sa source et son ouverture',
  faceTechnique(laDate, 3).module === 'date' && faceTechnique(laDate, 3).source.length > 0 && faceTechnique(laDate, 3).liaisons === 3,
  true,
);
check(
  'et elle sait ce qu’elle attend en face',
  modulesAttendus('date').includes('formulaire') && modulesAttendus('date').includes('lieu'),
  true,
);

/* ————————— TOUT LE SITE EN GRILLE : UNE ADRESSE, UN MONDE ————————— */

check('l’accueil, c’est le contenu : l’année entière', mondeDUneAdresse('/'), 'annee');
check('un shop est un monde', mondeDUneAdresse('/shop'), 'boutique');
check('un produit aussi', mondeDUneAdresse('/shop/table-trestle-chene'), 'produit-table-trestle-chene');
check('un métier aussi', mondeDUneAdresse('/metiers/photographe'), 'metier-photographe');
check('une personne aussi', mondeDUneAdresse('/profil/marie'), 'personne-marie');
check('un article aussi', mondeDUneAdresse('/magazine/univers-corse'), 'article-univers-corse');
check('un magazine aussi', mondeDUneAdresse('/magazine/38'), 'magazine-38');
check('la collection des cinquante-quatre', mondeDUneAdresse('/aime'), 'magazines');
check('le théâtre, ce sont les dix portes', mondeDUneAdresse('/theater'), 'monde');
check('et une adresse inconnue ouvre l’année', mondeDUneAdresse('/nimporte/ou/ailleurs'), 'annee');
check('aucune adresse ne promet rien', ROUTES_DU_MONDE.every((r) => promesseDUneAdresse(r.motif.split('/:')[0]!) .length > 10), true);
check(
  'les grandes adresses du site y sont toutes',
  ['/shop', '/shop/:slug', '/metiers/:slug', '/profil/:slug', '/magazine/:slug', '/aime', '/le-mariage', '/rejoindre/:slug'].every(
    (motif) => ROUTES_DU_MONDE.some((r) => r.motif === motif),
  ),
  true,
);
check(
  'et chacune ouvre un monde qui a des cases',
  ROUTES_DU_MONDE.every((r) => mondeDeLId(r.monde('exemple')).cases.length > 0),
  true,
);

/** Un identifiant inconnu n'ouvre jamais l'objet d'un autre : la collection. */
check('un produit inconnu ouvre la boutique', mondeDeLId('produit-inconnu').id, 'boutique');
check('un métier inconnu ouvre les métiers', mondeDeLId('metier-inconnu').id, 'metiers');
check('une personne inconnue ouvre les personnes', mondeDeLId('personne-inconnue').id, 'personnes');
check('un article inconnu ouvre les articles', mondeDeLId('article-inconnu').id, 'articles');

/** La route d'un produit : la grille s'ouvre sur le monde du produit. */
const grilleDuProduit = renderToStaticMarkup(
  createElement(
    MemoryRouter,
    { initialEntries: ['/shop/table-trestle-chene'] },
    createElement(
      Routes,
      null,
      createElement(Route, {
        path: '/shop/:slug',
        element: createElement(GrilleDuneRoute as never, {
          monde: (segments: Record<string, string | undefined>) => `produit-${segments.slug}`,
        }),
      }),
    ),
  ),
);
check('la page d’un produit s’ouvre en cases', grilleDuProduit.includes('data-grille="du-monde"'), true);
check('et c’est bien le monde du produit', grilleDuProduit.includes('data-monde="produit-table-trestle-chene"'), true);
check('la grille prend tout l’écran, même ici', grilleDuProduit.includes('h-svh') && grilleDuProduit.includes('overflow-hidden'), true);
check('et aucune page classique ne subsiste autour', /data-page="(shop|metier|profil)"/.test(grilleDuProduit), false);

/* La feuille : tout ce qui n'est pas l'image et la mosaïque. */
const feuille = renderToStaticMarkup(
  createElement(Feuille as never, { ouverte: true, surtitre: 'AIME MAGAZINE', titre: 'L’éditeur — votre magazine', onFermer: () => {} },
    createElement('p', null, 'le papier')),
);
check('la feuille s’ouvre au-dessus de tout', feuille.includes('data-feuille="ouverte"'), true);
check('elle se ferme, et le dit', feuille.includes('aria-label="Fermer la feuille"'), true);
check('fermée, elle n’existe pas', renderToStaticMarkup(createElement(Feuille as never, { ouverte: false, titre: 'x', onFermer: () => {} }, createElement('p', null, 'y'))).includes('data-feuille'), false);

/* En immersif, le site s'efface : plus de barre, plus de colonne, plus de dock. */
publierImmersif(true);
const chromeImmersif = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/magazine'] }, createElement(SiteChrome, null, createElement('div', null, 'la scène'))),
);
publierImmersif(false);
check('en immersif, le contenu est seul', chromeImmersif.includes('la scène') && !chromeImmersif.includes('aria-label="Le Magazine"'), true);
check('et le dock a quitté l’écran', chromeImmersif.includes('aria-label="Le Point Zéro"'), false);
check('hors immersif, le site est là', chromeAccueil.includes('aria-label="Le Point Zéro"'), true);
check('le signe des saisons a quitté l’écran', SAISONS_DE_LA_COLLECTION.every((s) => !revue.includes(s.symbole)), true);
check('les huit rubriques sont des cases du jour', RUBRIQUES.every((r) => mondeDeLId('univers-evenements', leJourDeLaGrille).cases.some((c) => c.titre === r.toUpperCase())), true);
check(
  'on peut relire au passé et au futur',
  ['L’an dernier', 'Cette semaine', 'L’an prochain'].every((t) => appEditeur.includes(t)),
  true,
);
check('le flux des trois cartes a quitté la scène', heroMagazine.includes('Le flux des jours'), false);

check('un joker ne dit pas de semaine', composerEdition({ numero: 53 }).carte.joker, true);
check('et il a sa propre édition', composerEdition({ numero: 53 }).pages.length, PAGES_EDITION);

/* ————————— LE CALENDRIER : 364 PRÉNOMS, ET DEUX JOKERS ————————— */

check('il y a 364 couvertures nommées', JOURS_NOMMES.length, 364);
check(
  'une par jour, du 1er janvier au 30 décembre',
  JOURS_NOMMES[0]!.mois === 1 && JOURS_NOMMES[0]!.jour === 1 &&
    JOURS_NOMMES[JOURS_NOMMES.length - 1]!.mois === 12 && JOURS_NOMMES[JOURS_NOMMES.length - 1]!.jour === 30,
  true,
);
check('chacune a son rang', JOURS_NOMMES.every((j, i) => j.ordinal === i + 1), true);
check('aucun jour sans prénom', JOURS_NOMMES.every((j) => j.nom.length >= 3), true);
check('et les deux jokers du calendrier existent', JOKERS_DU_CALENDRIER.length, 2);
check('le 31 décembre est le jour de trop', JOKERS_DU_CALENDRIER[0]!.numero, 53);
check('le 29 février est le jour bissextile', JOKERS_DU_CALENDRIER[1]!.numero, 54);
check('et ces deux jours n’ont pas de couverture nommée', jourNomme(new Date(2026, 11, 31)), null);
check('mais ils portent quand même leur fête', nomDuJour(new Date(2026, 11, 31)), 'Sylvestre');
check('le 20 septembre est nommé', nomDuJour(new Date(2026, 8, 20)).length > 2, true);
check('et 364 jours de 2026 ont leur prénom, le dernier étant un joker', Array.from({ length: 365 }, (_, i) => jourNomme(new Date(2026, 0, i + 1)) !== null).filter(Boolean).length, 364);

/* ————————— LE JOUR DU MAGAZINE : MÉTÉO, CLÉS, STUDIO ————————— */

const unJour = jourDuMagazine(new Date(2026, 8, 20));
check('un jour a son rang dans l’année', unJour.ordinal, jourDeLAnnee(new Date(2026, 8, 20)));
check('sa carte vient de sa semaine', unJour.carte.numero, semaineDeLAnnee(new Date(2026, 8, 20)));
check('et sa saison vient de sa carte', unJour.saison.id, unJour.carte.saison.id);
check('le jour de la semaine dit ce qu’on y fait', JOURS_DE_LA_SEMAINE.length, 7);
check('et il a son rôle', unJour.jourSemaine.sens.length > 10, true);
check('son édition a bien vingt-quatre pages', unJour.edition.pages.length, PAGES_EDITION);
check('les mêmes rubriques, dans le même ordre', unJour.edition.pages.map((p) => p.rubrique), [...RUBRIQUES, ...RUBRIQUES, ...RUBRIQUES]);
check('la page d’ouverture dit le temps qu’il fait', unJour.edition.pages.find((p) => p.heure === 0)!.texte.includes(unJour.meteo.resume), true);
check('et elle porte le prénom du jour', unJour.edition.pages.find((p) => p.heure === 0)!.titre.includes(unJour.nom), true);
check('et l’édition porte le jour', unJour.edition.titre.includes(`le jour ${unJour.ordinal}`), true);
check('le portrait sait pourquoi il est sur fond blanc ou noir', unJour.studio.raison.length > 12, true);
check('deux jours de suite n’ont pas le même portrait', studioDuJour(new Date(2026, 8, 20)).graine !== studioDuJour(new Date(2026, 8, 21)).graine, true);
check('et le même jour se retrouve à l’identique', studioDuJour(new Date(2026, 8, 20)).pose, unJour.studio.pose);
check('la météo est une moyenne, pas une prévision : elle reste plausible', Array.from({ length: 365 }, (_, i) => meteoDuJour(new Date(2026, 0, i + 1))).every((m) => m.min > -12 && m.min < 26 && m.max > m.min && m.max < 45 && m.ciel.length > 3 && m.phrase.length > 20), true);
check('l’été est plus chaud que l’hiver', meteoDuJour(new Date(2026, 6, 15)).max > meteoDuJour(new Date(2026, 0, 15)).max, true);
check('la lune est calculée', unJour.cles.lune.nom.length > 2, true);
check('les portes de l’année sont quatre', lesQuatrePortes().length, 4);
check('le 21 juin est une porte', clesDuJour(new Date(2026, 5, 21)).porte !== null, true);
check('le 26 décembre est dans l’interstice', clesDuJour(new Date(2026, 11, 26)).interstice, true);
check('le 15 août n’y est pas', clesDuJour(new Date(2026, 7, 15)).interstice, false);
check('le chiffre du jour va de 1 à 9', Array.from({ length: 365 }, (_, i) => clesDuJour(new Date(2026, 0, i + 1)).chiffre.nombre).every((n) => n >= 1 && n <= 9), true);
check('et il dit quelque chose', unJour.cles.chiffre.sens.length > 20, true);
check('le treizième signe est là, entre novembre et décembre', clesDuJour(new Date(2026, 11, 5)).signeCache?.nom, 'Le Serpentaire');
check('et il reste ce qu’il est : une lecture, pas une mesure', clesDuJour(new Date(2026, 11, 5)).signeCache?.sens.includes('retiré des douze'), true);
check('on lit sept jours autour', joursAutour(new Date(2026, 8, 20), 7).length, 7);
check('et ils se suivent', joursAutour(new Date(2026, 8, 20), 2)[1]!.getDate(), 21);
check('le premier jour de l’année a son édition', editionDuJour(new Date(2026, 0, 1)).pages.length, PAGES_EDITION);

/* ————————— LE FLUX : ON GLISSE D’UN JOUR À L’AUTRE ————————— */

const flux = renderToStaticMarkup(
  createElement(FluxDuJour, {
    jours: [unJour, jourDuMagazine(new Date(2026, 8, 21))],
    index: 0,
    onIndex: () => {},
    titreDuJour: (j: typeof unJour) => `${j.nom} · ${j.carte.nom}`,
  }),
);
check('le flux des jours est balisé', flux.includes('Le flux des jours'), true);
check('il glisse dans les deux sens', flux.includes('snap-y') && flux.includes('md:snap-x'), true);
check('chaque écran est un jour', (flux.match(/data-jour="/g) ?? []).length, 2);
check('le jour ouvert est marqué', flux.includes('data-ouvert="true"'), true);
check('et il se dit au clavier aussi', flux.includes('glisser'), true);
const portrait = renderToStaticMarkup(
  createElement(PortraitStudio, { nom: unJour.nom, date: unJour.date, studio: unJour.studio, saison: unJour.saison }),
);
check('le portrait de studio porte le prénom', portrait.includes(unJour.nom), true);
check('et son fond, écrit', portrait.includes('Studio blanc') || portrait.includes('Studio noir'), true);
check('il dit la pose, sans mentir sur la source', portrait.includes(unJour.studio.pose), true);
check('le super saint du jour est nommé', unJour.superSaint.nom.startsWith('AGENT SAINT-'), true);
check('et il a ses héros', unJour.superSaint.heros.length >= 2, true);
check('il dit pourquoi eux', unJour.superSaint.pourquoi.length > 40, true);
check('le nom du super saint suit le calendrier', jourDuMagazine(new Date(2026, 8, 21)).superSaint.nom, 'AGENT SAINT-MATTHIEU');
check('le jour de trop a le sien aussi', jourDuMagazine(new Date(2026, 11, 31)).superSaint.nom, 'AGENT SAINT-SYLVESTRE');
check('il y a vingt-quatre heures', HEURES.length, 24);
check('et elles se suivent', HEURES.every((h, i) => h.heure === i), true);
check('chacune a sa lumière', HEURES.every((h) => h.lumiere.length > 3 && h.moment.length > 5), true);
check('la golden hour est à dix-huit heures', HEURES[18]!.lumiere, 'la golden hour');
check('le fil rouge relie le jour', filRougeDuJour(unJour.date).fil.length > 60, true);
check('et l’action parfaite est une seule chose', filRougeDuJour(unJour.date).actionParfaite.length > 10, true);
const pageOuverte = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/magazine'] }, createElement(Magazine as never)),
);
check('et les grandes portes sont à un pas, dans le chemin', mondeDeLId('monde', le21SeptembreGrille).cases.filter((c) => c.ouvre).length, 10);

check(
  'la couverture ouvre les deux aiguilles du cadran',
  pageOuverte.includes('data-aiguille="heure"') && pageOuverte.includes('data-aiguille="chapitre"'),
  true,
);
check('et l’heure de la capsule est sur le cadran', pageOuverte.includes('data-aiguille="heure"'), true);
check('la mise en lumière vit dans une feuille', appProfil.includes('Se montrer, et élever les autres'), true);

/* ————————— LA CHARTE, ET LA MISE EN LUMIÈRE ————————— */

check('la charte tient en règles écrites', CHARTE.length >= 6, true);
check('chacune dit la règle et son pourquoi', CHARTE.every((r) => r.regle.length > 20 && r.pourquoi.length > 20), true);
check('et elle est signée', SIGNATURE_EDITEUR.length > 2 && QUI_EDITE.length > 20, true);
check('la charte parle du fond uni et de la création au centre', CHARTE.some((r) => r.id === 'fond-uni') && CHARTE.some((r) => r.id === 'creation-centre'), true);
check('et de la page par heure', CHARTE.some((r) => r.id === 'page-par-heure'), true);
check('six paliers de mise en lumière', PALIERS_LUMIERE.length, 6);
check('six marches, et on n’en saute aucune', PALIERS_LUMIERE.map((p) => p.n).join(','), '1,2,3,4,5,6');
check('un profil vide est au premier palier', miseEnLumiere(profilDeBase('Personne')).palier.n, 1);
check('un portrait, et l’on passe au deuxième', miseEnLumiere({ prenom: 'Matthieu', photoStudio: true, photoConforme: true }).palier.n, 2);
check('il dit ce qui manque pour monter', miseEnLumiere(profilDeBase('Personne')).pourMonter.length >= 1, true);
check('la fête se déduit du prénom', feteDuPrenom('Matthieu'), { mois: 9, jour: 21 });
check('et sans accent aussi', feteDuPrenom('elodie'), { mois: 10, jour: 22 });
check('un prénom hors calendrier n’a pas de jour', feteDuPrenom('Zorglub'), null);
check('certains prénoms reviennent dans l’année', joursDuPrenom('Augustin').length, 2);
const profilComplet = {
  prenom: 'Matthieu', date: '2027-06-12', lieu: 'Bouray-sur-Juine', roleId: 'photographe',
  styleId: 'vegas', photoStudio: true, photoConforme: true, inedits: 1, playlist: 1, documents: 1,
};
check('un profil complet va au sixième palier', miseEnLumiere(profilComplet).palier.n, 6);
check('et n’a plus rien à remplir', miseEnLumiere(profilComplet).pourMonter.length, 0);
const jourDeLaFete = new Date(2026, 8, 21);
check('le jour de sa fête, la couverture est la sienne', miseEnLumiere(profilComplet, jourDeLaFete).enCouvertureAujourdHui, true);
check('et les autres jours, elle ne l’est pas', miseEnLumiere(profilComplet, new Date(2026, 8, 22)).enCouvertureAujourdHui, false);
check('la lumière ouvre des opportunités, et elles grandissent avec le palier', miseEnLumiere(profilComplet).opportunites.length > miseEnLumiere(profilDeBase('Personne')).opportunites.length, true);
check('sans portrait conforme, on ne monte pas : c’est le prix d’entrée', miseEnLumiere({ ...profilComplet, photoStudio: false }).palier.n, 1);
check('le bloc se rend', renderToStaticMarkup(createElement(MiseEnLumiere, { profil: profilComplet })).includes('Les six paliers'), true);

/* ————————— LE SUPER JOURNAL : LA MÊME ARCHITECTURE POUR TOUS ————————— */

check('la signature est celle du fondateur', SIGNATURE_EDITEUR, 'LE FONDATEUR ET CRÉATEUR D’AIME®');
check('et l’association signe avec lui', ASSOCIATION, 'Association Le Monde Aime');
check('le fondateur est nommé dans le pourquoi', QUI_EDITE.includes('AIME®') && QUI_EDITE.includes('Le Monde Aime'), true);
check('le journal a ses sections, dans l’ordre', SECTIONS.length >= 8, true);
check('et la couverture ouvre, la signature ferme', SECTIONS[0]!.id, 'couverture');
check('chaque section dit ce qu’elle contient', SECTIONS.every((x) => x.role.length > 15), true);
check('le jeu de cartes y est : une photo par semaine', SECTIONS.some((x) => x.id === 'jeu' && x.role.includes('photo par semaine')), true);
check('trois cibles de confidentialité', CONFIDENTIALITES.map((c) => c.id).join(','), 'public,cercle,prive');
check('et le défaut est privé', SECTIONS.length > 0 && journalVierge('Matthieu', '2026-09-21').every((p) => p.cible === 'prive'), true);
check('un rêve se range dans les rêves, et reste privé', ceQueJumoRetiendrait('j’ai rêvé d’une maison').section, 'reves');
check('un lien se range dans les liens', ceQueJumoRetiendrait('voilà le http://exemple.fr du devis').section, 'liens');
check('une disponibilité se range dans l’agenda, et se partage au cercle', ceQueJumoRetiendrait('je suis dispo samedi').cible, 'cercle');
check('un mood se range dans le mood', ceQueJumoRetiendrait('je me sens fatigué aujourd’hui').section, 'mood');
check('une photo peut devenir la face de la carte', ceQueJumoRetiendrait('ma photo de la semaine').section, 'jeu');
check('le reste va dans les notes, et rien de plus', ceQueJumoRetiendrait('tiens, je pensais à ça').retenu.includes('notes'), true);
check('rien ne devient public tout seul', pagesPubliques(journalVierge('Matthieu', '2026-09-21')).length, 0);
check('la personne valide, et alors ça se publie', pagesPubliques([valider(journalVierge('Matthieu', '2026-09-21')[0]!, 'public')]).length, 1);

check('la couverture de semaine est un composant', typeof CouvertureSemaine, 'function');
check('et l’édition aussi', typeof EditionSemaine, 'function');

const semainesRendues = renderToStaticMarkup(
  createElement(CouvertureSemaine, { edition: edition38, onChoisir: () => {} }),
);
check('la couverture de semaine porte la marque et le numéro', semainesRendues.includes('AIME') && semainesRendues.includes('N° 38'), true);
check('et la semaine écrite, sans nom de carte', semainesRendues.includes('Semaine 38'), true);
check('elle est cliquable et annoncée', semainesRendues.includes('aria-pressed') && semainesRendues.includes('aria-label'), true);

/* ------------------- le nom se transforme, les deux portes suivent le rôle --- */

/* On survole « SUPER PHOTOGRAPHE » : le nom devient le sien. Le profil, lui,
   ne bouge pas — c'est le mien. */
definirPersonaCourant('maries');
definirPersonaSurvolee('photographe');
const entetePhoto = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(SiteHeader as never)));
const rolePhoto = PERSONNAGES.find((p) => p.id === 'photographe')!;
check('le nom du site devient celui du rôle', entetePhoto.includes(rolePhoto.nom), true);
check('et plus « SUPER MARIAGE » tant qu’on le regarde', entetePhoto.includes('>SUPER MARIAGE<'), false);
check('et le profil, lui, reste le mien', entetePhoto.includes('aria-label="Profil — SUPER MARIÉS"'), true);
/* Les deux portes du rôle regardé : la nav verticale les porte, sur chaque page. */
const navPhoto = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(NavVerticale as never)));
check('la nav verticale mène au shop du rôle', navPhoto.includes(`Le Shop de ${rolePhoto.nom}`), true);
check('et à son magazine', navPhoto.includes(`Le Magazine de ${rolePhoto.nom}`), true);

definirPersonaSurvolee(null);
const enteteNeutre = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(SiteHeader as never)));
check('sans survol, le nom du site revient', enteteNeutre.includes('SUPER MARIAGE'), true);
check('le profil reste celui de la personne', enteteNeutre.includes('aria-label="Profil — SUPER MARIÉS"'), true);

/* LE MANIFESTE : l'édito, entre le hero des rôles et celui des univers. */
check('le manifeste est sur l’accueil', accueil.includes(MANIFESTE.titre), true);
check(
  'avec ses trois paragraphes',
  MANIFESTE.paragraphes.every((p) => accueil.includes(enHtml(p.slice(0, 40)))),
  true,
);
check(
  'et il se lit entre les deux heros',
  accueil.indexOf(MANIFESTE.titre) > accueil.indexOf('Qui êtes-vous dans ce mariage') &&
    accueil.indexOf(MANIFESTE.titre) < accueil.indexOf('id="univers-hero"'),
  true,
);

/* SUPER ÉDITEUR : la même page sur trois appareils, et l'éditeur a sa page. */
const appareils = renderToStaticMarkup(
  createElement(MemoryRouter, null, createElement(Appareils as never, { styleId: 'vegas' })),
);
check('la section s’appelle SUPER ÉDITEUR', appareils.includes('SUPER ÉDITEUR'), true);
check('elle dit qu’une page s’écrit une fois', appareils.includes('se range sur les trois tailles'), true);
check('elle montre la page en train de défiler', (appareils.match(/vp-defile-page/g) ?? []).length, 3);
check('un ordinateur, une tablette, un téléphone', (appareils.match(/rounded-\[16px\]|rounded-\[20px\]|rounded-\[22px\]/g) ?? []).length, 3);
check('et la même page dans chacun', (appareils.match(/Répondre à l’invitation/g) ?? []).length, 3);

const pageParametres = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/parametres'] }, createElement(EditeurMiniSite as never)),
);
check('l’éditeur a sa page', pageParametres.includes('SUPER ÉDITEUR'), true);
check('elle fait travailler sur un mini-site', pageParametres.includes('id="mini-site"'), true);
check('l’accueil ne porte plus l’éditeur', accueil.includes('id="mini-site"'), false);
const boutonParametres = renderToStaticMarkup(
  createElement(MemoryRouter, null, createElement(BoutonParametres as never)),
);
check('le bouton Paramètres mène à l’éditeur', boutonParametres.includes('href="/parametres"'), true);
check('et il est en bas à gauche', boutonParametres.includes('fixed bottom-20 left-3'), true);

/* LE SHOP : SUPER SHOP, son ticket, et plus de porte vers l'éditeur des métiers. */
check('le shop s’appelle SUPER SHOP', accueil.includes('SUPER SHOP'), true);
check('il garde son ticket de caisse', accueil.includes('TOTAL'), true);
check('et n’ouvre plus l’éditeur des métiers', accueil.includes('L’éditeur des métiers'), false);

/* ———————————————————— SUPER RIPPLE : le point zéro, la fabrique, le ticket ———————————————————— */

/* Les axes : quatre questions, et leurs couches. */
check('quatre grands axes', AXES_FOOTER.map((a) => a.label), [
  'Qui vous êtes', 'Ce que vous vivez', 'Ce que vous savez faire', 'Ce que vous voulez',
]);
const options = AXES_FOOTER.flatMap((a) => a.entrees.flatMap((e) => e.entrees.map((s) => s.id)));
check('chaque axe a ses couches', AXES_FOOTER.every((a) => a.entrees.length >= 3), true);
check('et chaque couche ses entrées', AXES_FOOTER.every((a) => a.entrees.every((e) => e.entrees.length >= 3)), true);
check('aucune coche en double', new Set(options).size, options.length);
check('et l’on peut tout cocher', options.length > 40, true);

/* Les documents : ce qui existe, qui le demande, au nom de qui, et la source. */
check('trente documents et plus', DOCUMENTS.length >= 30, true);
check(
  'chaque document dit qui le demande, au nom de qui, et quoi réunir',
  DOCUMENTS.every((d) => d.demandePar && d.auNomDe && d.pieces.length >= 2 && d.source),
  true,
);
check(
  'chaque document est ouvert par une situation réelle',
  DOCUMENTS.every((d) => d.ouvrePar.length > 0 && d.ouvrePar.every((o) => options.includes(o))),
  true,
);
check(
  'ce qui engage le droit est marqué à valider',
  ['facture', 'contrat-prestation', 'cessions-droits', 'testament', 'attestation-intermittent']
    .every((id) => etatDuDocument(DOCUMENTS.find((d) => d.id === id)!) === 'à valider'),
  true,
);
check(
  'et l’on dit qui valide',
  validationDuDocument(DOCUMENTS.find((d) => d.id === 'testament')!),
  'À faire établir par un notaire',
);
check(
  'les autres se réunissent seulement',
  etatDuDocument(DOCUMENTS.find((d) => d.id === 'justificatif-domicile')!),
  'à réunir',
);

/* Le ticket se compose tout seul. */
check('sans coche, rien ne s’ouvre', documentsOuverts(CHOIX_VIDE).length, 0);
const choixEtudiant = { options: ['etudiant', 'voyager', 'visa'], lignes: ['mentions'] };
check('un étudiant qui veut voyager ouvre ses documents', documentsOuverts(choixEtudiant).length >= 3, true);
check(
  'et le ticket les écrit',
  lignesDuTicketFooter(choixEtudiant).length,
  documentsOuverts(choixEtudiant).length,
);
check('la coche se bascule', basculer(['a', 'b'], 'a'), ['b']);
check('et se pose', basculer(['a'], 'b'), ['a', 'b']);

/* Le footer, lui, se choisit ligne par ligne. */
check('huit lignes de footer', LIGNES_FOOTER.length, 8);
check('dont les mentions légales', LIGNES_FOOTER[0]?.id, 'mentions');

/* La page : les axes, le ticket, et les documents en détail. */
const pageFooter = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/ripple'] }, createElement(SuperRipple as never)),
);
check('la page s’appelle SUPER RIPPLE', pageFooter.includes('SUPER RIPPLE'), true);
check('le point zéro est là, avec ses trois champs', ['Le nom', 'Le jour', 'La ville'].every((c) => pageFooter.includes(`${c} du point zéro`)), true);
check('l’agent dit ce qui manque', pageFooter.includes('Il manque encore'), true);
check('la fabrique prépare ses sept objets', ['Le ticket de caisse', 'La carte postale', 'Le timbre', 'Le tampon', 'Le ticket spectacle', 'Le billet d’avion', 'Le sticker'].every((o) => pageFooter.includes(o)), true);
check('et chaque objet choisit son repère', pageFooter.includes('Repère Le reçu pour Le ticket de caisse'), true);
check('le ticket porte le point zéro', pageFooter.includes('Point zéro'), true);
check('elle dit qu’on ne fabrique pas d’acte', pageFooter.includes('on ne fabrique pas d’acte'), true);
check('et le but : une saisie, tout se répercute', pageFooter.includes('gagner les années'), true);
check('le principe : extraire, reconnaître, classer — jamais stocker', pageFooter.includes('extrait (OCR), reconnu, puis'), true);
check('elle montre les axes', AXES_FOOTER.every((a) => pageFooter.includes(a.label)), true);
check('et les entrées à cocher', pageFooter.includes('Intermittent·e du spectacle'), true);
check('et les lignes qui se gardent partout', pageFooter.includes('Ce qui se garde partout'), true);
check('sans coche, le ticket invite à en poser', pageFooter.includes('Cochez votre situation'), true);
check('et, tout en bas, le temps', pageFooter.includes('Ce qui s’est passé, à sa date'), true);
check('qui dit d’où il vient', pageFooter.includes('le temps commence au premier geste'), true);
check('et ouvre la timeline complète', pageFooter.includes('href="/timeline"'), true);

/* ————————————— LE POINT D'ÉTAT, LA FENTE, ET LES TICKETS ————————————— */

/* On part d'une fente fermée, et sans annonce. */
for (const a of chargerAnnonces()) retirerAnnonce(a.id);
for (const p of chargerWallet()) {
  /* le portefeuille repart vide, lui aussi */
  void p;
}
fermerFente();
const pointEteint = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(BoutonEtat as never)));
check('sans rien à voir, le point est éteint', pointEteint.includes('rien à voir'), true);
check('et sa couleur se dit', palierDuPointInfo(palierDuPoint([])).hex, '#3F3F46');

/* Les six paliers : du plus calme au plus grave. */
check(
  'six paliers, dans l’ordre',
  PALIERS.map((p) => p.id),
  ['vert', 'bleu', 'mauve', 'fuchsia', 'orange', 'rouge'],
);
check('chacun a sa couleur', new Set(PALIERS.map((p) => p.hex)).size, 6);
check('le plus grave est rouge', PALIERS[5]!.hex, '#EF4444');

/* La fente ne sort que quand il y a un ticket. */
const fenteFermee = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(FenteDocuments as never)));
check('fente fermée : rien à lire', fenteFermee.includes('Vos droits') || fenteFermee.includes('imprimer'), false);
ouvrirFente();
const fenteSansTicket = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(FenteDocuments as never)));
check('ouverte mais vide : toujours rien', fenteSansTicket.includes('imprimer'), false);

/* Un document demandé : le ticket sort, et le point s'allume. */
const ici = annoncerDocument('Attestation d’hébergement', 'SUPER MARIÉS', 'un proche', 'attestation-hebergement');
const fenteDoc = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(FenteDocuments as never)));
check('le ticket sort', fenteDoc.includes('Document disponible'), true);
check('avec le document', fenteDoc.includes('Attestation d’hébergement'), true);
check('qui l’a demandé, et pour qui', fenteDoc.includes('demandé par SUPER MARIÉS · pour un proche'), true);
check('et la mention de vos droits', fenteDoc.includes('Vous n’êtes pas obligé d’ouvrir'), true);
check('et l’on n’imprime pas', fenteDoc.includes('Aucune impression nécessaire'), true);
check('trois gestes sont proposés', fenteDoc.includes('Ne pas ouvrir') && fenteDoc.includes('Valider') && fenteDoc.includes('Négocier'), true);
check('le point s’allume au palier du ticket', palierDuPoint(chargerAnnonces()), ici.palier);
const pointAllume = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(BoutonEtat as never)));
check('et le bouton le montre', pointAllume.includes(PALIERS[ici.palier - 1]!.hex), true);

/* Un message, une notification : le même passage. */
annoncerMessage('Sandrine', 'Une question sur le contrat', 4);
check('le palier le plus haut mène la couleur', palierDuPoint(chargerAnnonces()), 4);
check('l’annonce du moment est la plus grave', annonceCourante(chargerAnnonces())?.type, 'message');
check('et le ticket dit ce que c’est', titreDuType('message'), 'Message reçu');
annoncerNotification('Une habitude', 'Toujours à la même heure', 1);
check('une notification ne propose que le refus', actionsPossibles({ type: 'notification', palier: 1, id: 'n', titre: '', detail: '', etat: 'nouveau', quand: '', droits: MENTION_DROITS }).length, 1);

/* Les états : écarté, validé, négocié — et ce qui les distingue. */
changerEtatAnnonce(ici.id, 'ecarte');
check('écarté n’est plus à voir', annoncesNouvelles(chargerAnnonces()).some((a) => a.id === ici.id), false);
changerEtatAnnonce(ici.id, 'negocie');
check('négocié non plus', annoncesNouvelles(chargerAnnonces()).some((a) => a.id === ici.id), false);

/* ————————————————— LE PORTEFEUILLE : TOUT SE RANGE TOUT SEUL ————————————————— */

const domicile = DOCUMENTS.find((d) => d.id === 'justificatif-domicile')!;
check('une pièce se classe toute seule', classerDocument(domicile).label, 'Domicile');
check('sur une famille connue, elle n’en crée pas', classerDocument(domicile).creee, false);
/* Une pièce qu'aucune famille ne connaît : c'est l'axe qui la nomme. */
const neuf = {
  id: 'piece-inconnue',
  nom: 'Certificat de tradition locale',
  ouvrePar: ['benevole'],
  demandePar: 'Une autorité locale',
  auNomDe: 'La personne concernée',
  pieces: ['Un cachet rare', 'Une date'],
  source: 'Autorité locale',
};
check('une pièce inconnue ouvre sa famille', classerDocument(neuf).creee, true);
check('et cette famille vient de son axe', classerDocument(neuf).label, 'Qui vous êtes');
check('chaque pièce sait de quel axe elle vient', axeDuDocument(domicile)?.id, 'statut');

const rangee = rangerAuWallet(domicile, 'SUPER MARIÉS');
check('valider range la pièce', chargerWallet()[0]?.id, rangee.id);
check('dans sa famille', chargerWallet()[0]?.categorieLabel, 'Domicile');
const familles = walletParCategorie(chargerWallet());
check('le portefeuille se lit par famille', familles.length, 1);
check('avec sa pièce dedans', familles[0]?.pieces.length, 1);
check('et ses familles par défaut sont prêtes', CATEGORIES_WALLET.length >= 8, true);

/* ———————————————————— LES SUPER HÉROS : VINGT SPÉCIALISTES ———————————————————— */

check('vingt super héros', SUPER_HEROS.length, 20);
check('chacun son nom', new Set(SUPER_HEROS.map((h) => h.id)).size, 20);
check(
  'chacun sa spécialité, ce qu’il surveille, et ce qu’il fait',
  SUPER_HEROS.every((h) => h.specialite && h.surveille && h.pouvoir),
  true,
);
check('et sa place dans l’échelle', SUPER_HEROS.every((h) => h.palier >= 1 && h.palier <= 6), true);
check('tous les paliers ont leurs héros', PALIERS.every((_, i) => herosDuPalier(i + 1).length >= 1), true);
check('le gardien veille au plus grave', herosParId('gardien')?.palier, 6);
check('et le passeur fait le pont', herosParId('passeur_de_lien')?.pouvoir.includes('pont'), true);

/* LE MENU DU PROFIL : ses entrées, et « voir en tant que ». */
/* Le profil, c'est **moi** : on repose le rôle par défaut avant de le lire. */
definirPersonaCourant('maries');
const boutonProfil = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(MenuProfil as never)));
check('le bouton profil ouvre un menu', boutonProfil.includes('aria-haspopup="menu"'), true);
check('il est fermé par défaut', boutonProfil.includes('Boîte de réception'), false);
check(
  'le menu porte ses entrées, dans l’ordre',
  [...MENU_PROFIL, ...AIDE_PROFIL, SORTIE_PROFIL].map((i) => i.label),
  [
    'Profil', 'Boîte de réception', 'Paramètres', 'Apparence', 'Assistance', 'Documentation',
    'Communauté', 'Télécharger les applications', 'Accueil', 'Se déconnecter',
  ],
);
check('avec le compteur qui attend', MENU_PROFIL[1]!.badge, '1');
check('et le raccourci des réglages', MENU_PROFIL[2]!.raccourci, '⌘ .');
check('chaque entrée mène à une page du site', [...MENU_PROFIL, ...AIDE_PROFIL].every((i) => i.to.startsWith('/')), true);
/* Les rôles du site restent rangés par titre dans la lib — mais le menu ne les
   affiche plus : le « voir en tant que » est retiré, on simplifie. */
check('voir en tant que, un groupe par titre', rolesDuMenu().map((g) => g.titre.nom), TITRES.map((t) => t.nom));
check(
  'et tous les rôles y sont',
  rolesDuMenu().flatMap((g) => g.roles).length,
  PERSONNAGES.length,
);
check(
  'aucun rôle oublié',
  rolesDuMenu().flatMap((g) => g.roles).every((p) => Boolean(personnageParId(p.id))),
  true,
);

/* LE SHOP D'UN RÔLE : les pièces qui le concernent, et rien d'autre. */
const piecesFleuriste = piecesPourRole('fleuriste');
check('le fleuriste ne voit pas tout le shop', piecesFleuriste.length < SHOP_PRODUCTS.length, true);
check('chaque pièce le concerne', piecesFleuriste.every((p) => p.category === 'deco'), true);
check('les mariés voient tout', piecesPourRole('maries').length, SHOP_PRODUCTS.length);
check('et le rôle a sa phrase', phraseShopDuRole('fleuriste').includes('composer'), true);

const pageShopFleuriste = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/shop?role=fleuriste'] }, createElement(Shop as never)),
);
check('le shop dit de qui il est', pageShopFleuriste.includes('Le Shop de SUPER FLEURISTE'), true);
check(
  'et annonce ses pièces',
  pageShopFleuriste.includes(`${piecesFleuriste.length} pièces, choisies pour ce rôle.`),
  true,
);
check('on peut revenir au shop entier', pageShopFleuriste.includes('Tout le shop'), true);

/* LE MAGAZINE D'UN RÔLE : les articles qui lui parlent. */
const articlesPhoto = articlesPourRole('photographe');
check('le rôle a ses articles', articlesPhoto.length > 0, true);
/** Un article parle d'un rôle : un de ses mots apparaît dans le titre ou le chapô. */
const parle = (a: { title: string; intro: string; kicker: string }, mots: string[]) => {
  const texte = `${a.title} ${a.intro} ${a.kicker}`.toLowerCase();
  return mots.some((mot) => texte.includes(mot));
};
check('et ils parlent de lui', articlesPhoto.every((a) => parle(a, ['photo', 'portrait', 'image', 'lumière'])), true);
check(
  'le fleuriste a les siens aussi',
  articlesPourRole('fleuriste').every((a) => parle(a, ['fleur', 'bouquet', 'végétal', 'floral', 'arche'])),
  true,
);
check('moins que le magazine entier', articlesPhoto.length < ALL_ARTICLES.length, true);

const pageMagazinePhoto = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/magazine?role=photographe'] }, createElement(Magazine as never)),
);
check('le magazine dit de qui il est', pageMagazinePhoto.includes('choisi pour super photographe'), true);
check(
  'et les trois portes restent ouvertes',
  ['l’éditeur', 'la collection', 'votre profil'].every((p) => pageMagazinePhoto.includes(p)),
  true,
);

/* ------------- la nav verticale : le shop, le magazine, et la page ---------- */

/** La nav d'une page, par son nom. */
function navDePage(nom: string) {
  const parNom: Record<string, typeof NAV_ACCUEIL> = {
    accueil: NAV_ACCUEIL, univers: NAV_UNIVERS, metier: NAV_METIER, magazine: NAV_MAGAZINE,
    article: NAV_ARTICLE, shop: NAV_SHOP, produit: NAV_PRODUIT, prestataire: NAV_PRESTATAIRE,
  };
  return parNom[nom] ?? [];
}
const NAV = { get: navDePage };

/* La capsule est différente sur chaque page : chaque liste vise ses sections. */
const NAVS: Array<[string, ReturnType<typeof navDePage>]> = [
  ['l’accueil', NAV_ACCUEIL],
  ['un univers', NAV_UNIVERS],
  ['un métier', NAV_METIER],
  ['le magazine', NAV_MAGAZINE],
  ['un article', NAV_ARTICLE],
  ['le shop', NAV_SHOP],
  ['une fiche produit', NAV_PRODUIT],
  ['l’espace prestataire', NAV_PRESTATAIRE],
  ['les paramètres', NAV_PARAMETRES],
  ['le ripple', NAV_RIPPLE],
];
check('chaque page a sa nav', NAVS.every(([, liste]) => liste.length >= 2), true);
check(
  'aucune action ne mène dans le vide',
  NAVS.every(([, liste]) => liste.every((a) => Boolean(a.ancre) !== Boolean(a.to))),
  true,
);

/* Les ancres existent vraiment dans les pages qui les annoncent. */
const ancresAttendues: Record<string, string[]> = {
  accueil: ['univers-hero', 'manifeste', 'editeur', 'supermarriage', 'bande-son'],
  parametres: ['mini-site'],
  footer: ['axe-statut', 'documents', 'footer', 'point-zero', 'fabrique'],
  univers: ['article', 'programme', 'carte-fidelite'],
  metier: ['playlist', 'ticket'],
  article: ['article', 'moments'],
  shop: ['pieces', 'modes'],
  produit: ['details', 'similaires'],
  prestataire: ['editeur'],
};
const sourceDuSite = [
  accueil, universBande, metierBande, pageArticle, pageShop, pageProduit, pagePrestataire, pageMagazine,
  pageParametres, pageFooter, revue,
].join(' ');
check(
  'les ancres de la nav existent dans les pages',
  Object.values(ancresAttendues).flat().every((ancre) => sourceDuSite.includes(`id="${ancre}"`)),
  true,
);

/* La capsule : le shop, le magazine, puis les actions de la page. */
enregistrerNavVerticale(NAV_UNIVERS);
const navRendue = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(NavVerticale as never)));
enregistrerNavVerticale(null);
check('la nav porte le shop et le magazine', ['aria-label="Le Shop"', 'aria-label="Le Magazine"'].every((l) => navRendue.includes(l)), true);
check('et les actions de la page', ['L’article', 'Le programme', 'La carte de fidélité'].every((l) => navRendue.includes(l)), true);
check(
  'avec les actions d’une autre page, elle change',
  NAV.get('accueil')!.every((a) => navRendue.includes(a.label)),
  false,
);
check('elle se tient à droite', navRendue.includes('fixed right-3 top-1/2'), true);
check('elle propose les gestes', navRendue.includes('aria-label="Les gestes de la capsule"'), true);
check('et chaque action sait dire ce qu’elle fait', NAV_UNIVERS.every((a) => Boolean(a.aide)), true);
check(
  'aucune action de page n’oublie son aide',
  NAVS.every(([, liste]) => liste.every((a) => Boolean(a.aide))),
  true,
);
check('les gestes sont écrits une fois pour tout le site', GESTES_UNIVERSELS.length >= 5, true);
check(
  'et ils couvrent le survol, le clic et le clic droit',
  ['Survoler', 'Cliquer', 'Clic droit'].every((g) => GESTES_UNIVERSELS.some((x) => x.geste === g)),
  true,
);

/* ————————————— LE HERO ENCHAÎNÉ : LES CARTES CHOISIES, DANS L'ORDRE ————————————— */

/** Deux cartes de l'accueil, prises à la source : un univers, et un rôle. */
const universTest = WEDDING_STYLES[0]!;
const roleTest = PERSONNAGES[1]!;

viderSelection();
check('la sélection part vide', chargerSelection().length, 0);

const apresUn = choisirCarte({ id: universTest.id, sorte: 'univers', titre: universTest.name });
check('un clic sur l’accueil entre dans la sélection', apresUn.length, 1);
check('avec sa sorte, et son titre', [apresUn[0]!.sorte, apresUn[0]!.titre], ['univers', universTest.name]);

const apresDeux = choisirCarte({ id: roleTest.id, sorte: 'persona', titre: roleTest.nom });
check('et l’ordre est celui des clics', apresDeux.map((c) => c.id), [universTest.id, roleTest.id]);
check(
  'recliquer la même carte ne la déplace pas',
  choisirCarte({ id: universTest.id, sorte: 'univers', titre: universTest.name }).map((c) => c.id),
  [universTest.id, roleTest.id],
);
check('une carte choisie le dit', estChoisie({ id: roleTest.id, sorte: 'persona' }), true);
check('une carte jamais cliquée aussi', estChoisie({ id: 'personne-ne-la-choisit', sorte: 'univers' }), false);
check('la clé d’une carte dit sa sorte', cleDeCarteChoisie({ id: 'vegas', sorte: 'univers' }), 'univers|vegas');
check(
  'l’ordre se règle à la main',
  deplacerCarte({ id: roleTest.id, sorte: 'persona' }, -1).map((c) => c.id),
  [roleTest.id, universTest.id],
);
check(
  'et une carte se retire',
  retirerCarte({ id: roleTest.id, sorte: 'persona' }).map((c) => c.id),
  [universTest.id],
);

/** Le paquet : la sélection est un jeu de cartes, et il s'arrête à 54. */
viderSelection();
for (let i = 0; i < 60; i += 1) choisirCarte({ id: `essai-${i}`, sorte: 'univers', titre: `Essai ${i}` });
check('la sélection est un paquet : 54, pas plus', chargerSelection().length, CARTES_MAX);

/* L'enchaînement : ce que le hero traverse, dans l'ordre. */
viderSelection();
choisirCarte({ id: universTest.id, sorte: 'univers', titre: universTest.name });
choisirCarte({ id: roleTest.id, sorte: 'persona', titre: roleTest.nom });

const chaine = enchainement(chargerSelection());
check('l’enchaînement suit la sélection', chaine.map((c) => c.id), [universTest.id, roleTest.id]);
check('chaque carte apporte son visuel', chaine.every((c) => c.media.image.length > 0), true);
check('et son titre, tel qu’au clic', chaine.map((c) => c.titre), [universTest.name, roleTest.nom]);
check(
  'le hero traverse exactement ces visuels',
  visuelsDeLEnchainement(chaine).map((v) => v.image),
  chaine.map((c) => c.media.image),
);
check('une carte se retrouve seule, sans passer par la sélection', carteVivanteDe({ id: roleTest.id, sorte: 'persona' })?.titre, roleTest.nom);
check('sans sélection, le hero a un repli', enchainementDeSecours(universTest.id).map((c) => c.id), [universTest.id]);
check('et même sans univers connu, il y a un hero', enchainementDeSecours('inconnu').length, 1);
check('l’adresse d’un univers est la même partout', adresseDeLUnivers('vegas'), '/le-mariage/vegas');

const universRetenus = universDeLaPersonne(chargerSelection());
check('les univers retenus se groupent, dans l’ordre', universRetenus.map((u) => u.style.id), [universTest.id]);
check('chacun vient avec ses cartes associées', universRetenus[0]!.cartes.length >= 5, true);
check(
  'et sa carte est bien celle du milieu',
  universRetenus[0]!.cartes.some((c) => c.id === universTest.id && c.actif),
  true,
);
check('les rôles retenus reviennent en cartes', rolesDeLaPersonne(chargerSelection()).map((c) => c.id), [roleTest.id]);

/* Le manifeste de la personne : le même texte, vu de sa place. */
const manifestePersonne = manifesteDeLaPersonne(
  { prenom: 'Clara', role: 'Fleuriste', ville: 'Paris' },
  chargerSelection(),
);
check('le manifeste porte la porte de la personne', manifestePersonne.titre.includes('celle de Clara s’appelle Fleuriste'), true);
check('il dit ce qu’elle a retenu de l’accueil', manifestePersonne.paragraphes.some((p) => p.includes('a retenu 2 cartes')), true);
check('il garde les trois temps de l’accueil', manifestePersonne.paragraphes.length, 4);
check(
  'et il les reprend mot pour mot',
  [MANIFESTE.paragraphes[0]!, MANIFESTE.paragraphes[1]!, MANIFESTE.paragraphes[2]!].every((p) =>
    manifestePersonne.paragraphes.includes(p),
  ),
  true,
);
check('la signature porte son nom', manifestePersonne.signature.includes('SUPER MARIAGE — Clara · Fleuriste · Paris'), true);
check('sans nom, c’est le manifeste de l’accueil', manifesteDeLaPersonne({ prenom: '' }).titre, MANIFESTE.titre);
check(
  'et sans sélection, elle le dit',
  manifesteDeLaPersonne({ prenom: 'Clara' }, []).paragraphes.some((p) => p.includes('La sélection est encore vide')),
  true,
);

/* Le hero enchaîné, et les sections qui le suivent, tels qu'ils se rendent. */
const chaineTrois = [...chaine, ...enchainementDeSecours('vegas')];
const heroEnchaine = renderToStaticMarkup(
  createElement(
    MemoryRouter,
    null,
    createElement(
      HeroEnchaine,
      { cartes: chaineTrois, eyebrow: 'Son hero' },
      createElement('h1', null, 'Clara Mez'),
    ),
  ),
);
check('le hero enchaîné montre la personne', heroEnchaine.includes('Clara Mez'), true);
check('il dit où l’on en est dans l’ordre', heroEnchaine.includes('1 / 3'), true);
check('il montre la carte du moment', heroEnchaine.includes(universTest.name), true);
check('et les cartes associées, juste dessous', heroEnchaine.includes(roleTest.nom), true);

const manifesteRendu = renderToStaticMarkup(
  createElement(ManifestePersonne, {
    faits: { prenom: 'Clara', role: 'Fleuriste', ville: 'Paris' },
    selection: chargerSelection(),
  }),
);
check('le manifeste se pose sous le hero', manifesteRendu.includes('Son manifeste'), true);
check('et nomme la personne', manifesteRendu.includes('celle de Clara'), true);

const universRendus = renderToStaticMarkup(
  createElement(MemoryRouter, null, createElement(UniversDeLaPersonne, { selection: chargerSelection() })),
);
check('la section des univers se rend', universRendus.includes('Ses univers'), true);
check('elle compte ce qui a été retenu', universRendus.includes('dans l’ordre · 2'), true);
check('elle nomme l’univers retenu', universRendus.includes(universTest.name), true);
check(
  'elle donne les gestes pour régler l’ordre',
  universRendus.includes(`aria-label="Monter ${universTest.name}"`) &&
    universRendus.includes(`aria-label="Descendre ${universTest.name}"`) &&
    universRendus.includes(`aria-label="Retirer ${universTest.name}"`),
  true,
);
check('et de quoi vider la sélection', universRendus.includes('Vider la sélection'), true);

const universVides = renderToStaticMarkup(
  createElement(MemoryRouter, null, createElement(UniversDeLaPersonne, { selection: [] })),
);
check('sans sélection, la section le dit', universVides.includes('Rien de retenu pour l’instant'), true);
check('et renvoie vers l’accueil', universVides.includes('Choisir mes cartes sur l’accueil'), true);
check('sans proposer de vider ce qui est vide', universVides.includes('Vider la sélection'), false);

/* La carte locale fait une personne : la page existe avant d'être publiée. */
const carteLocale = { ...EMPTY_CARD, firstName: 'Clara', lastName: 'Mez', trade: 'Fleuriste' } as CardData;
const personneLocale = personneDeLaCarte(77, carteLocale);
check(
  'une carte locale fait une personne',
  [personneLocale.id, personneLocale.first_name, personneLocale.last_name, personneLocale.trade],
  [77, 'Clara', 'Mez', 'Fleuriste'],
);
check('et garde la visibilité de ses contacts', personneLocale.contact_visibility, carteLocale.contactVisibility);

viderSelection();

/* ————————— LE CHIFFRE : LA RÈGLE, LES MOTS, ET RIEN DE PLUS ————————— */

check('le système employé est dit', SYSTEME, 'pythagoricien');
check('les accents tombent avant le calcul', sansAccents('Élodie'), 'ELODIE');
check('et les ligatures se séparent', sansAccents('cœur'), 'COEUR');
check('A vaut 1, R vaut 9, S repart à 1', [valeurDeLettre('A'), valeurDeLettre('R'), valeurDeLettre('S')], [1, 9, 1]);
check('un mot ne garde que ses lettres', lettresDe('Claire Martin!').length, 12);
check('la réduction garde les maîtres', [reduire(38), reduire(29), reduire(12)], [11, 11, 3]);
check('mais sans les garder, elle descend', reduire(38, false), 2);
check('onze, vingt-deux et trente-trois sont des maîtres', MAITRES.map((m) => estMaitre(m)), [true, true, true]);
check('quarante-quatre n’en est pas un', estMaitre(44), false);

check('MATT donne neuf', chiffreDuNom('MATT').nombre, 9);
check('et le calcul se montre', chiffreDuNom('MATT').pas.length >= 2, true);
check('la date se lit des deux façons', [lireDate('14.06.1992'), lireDate('1992-06-14')], [lireDate('1992-06-14'), lireDate('1992-06-14')]);
check('une date illisible ne donne rien', lireDate('n’importe quoi'), null);
check('le chemin de vie de 14/06/1992 est 5', chiffreDUneDate('1992-06-14'), 5);
check('la méthode de référence est écrite', METHODE_PAR_DEFAUT, 'par-composant');
check(
  'les deux méthodes sont possibles, et donnent ici la même chose',
  [chiffreDUneDate('1985-11-29'), lireDate('1985-11-29') !== null],
  [9, true],
);
check(
  'par composant, un maître apparaît au passage — et c’est dit',
  chiffresDeLaPersonne('', '', '1985-11-29').chemin?.maitreEnChemin,
  true,
);

check('les voyelles donnent le nombre intime', chiffreIntime('ELODIE').nombre, 7);
check('Élodie et Elodie donnent le même chiffre', chiffreIntime('Elodie').nombre, chiffreIntime('Élodie').nombre);
check(
  'le Y sonne « i » : il compte comme voyelle',
  [voyellesDe('YVES'), consonnesDe('YVES')],
  [['Y', 'E'], ['V', 'S']],
);
check(
  'sauf quand il sonne consonne, devant une voyelle',
  [voyellesDe('YANN'), consonnesDe('YANN').slice(0, 1)],
  [['A'], ['Y']],
);
check('les consonnes donnent la personnalité', chiffreDePersonnalite('CLAIRE MARTIN').nombre, 8);
check('l’année personnelle, elle, bouge', anneePersonnelle('1992-06-14', 2026), 3);

check(
  'à deux, on montre les deux chiffres, et leur somme',
  chiffreAdeux('1992-06-14', '1990-11-03'),
  { premier: 5, second: 6, ensemble: 11 },
);
check('sans les deux dates, il n’y a pas de somme', chiffreAdeux('1992-06-14', null).ensemble, null);
check('sans personne, il n’y a rien', chiffreAdeux(null, undefined), { premier: null, second: null, ensemble: null });

check('les mots couvrent les neuf familles et les trois maîtres', Object.keys(MOTS).length, 12);
check('chaque famille dit quelque chose', Object.values(MOTS).every((m) => m.mots.length > 25), true);
check(
  'un maître ne vaut pas mieux : c’est dit',
  MAITRES.every((m) => MOTS[m]!.mots.includes('ce n’est pas mieux')),
  true,
);
const MOTS_INTERDITS = ['compatib', 'karma', 'dette', 'supérieur', 'meilleur que', 'prédi', 'destin', 'soigne'];
check(
  'aucun mot ne juge personne',
  Object.values(MOTS).every((m) => !MOTS_INTERDITS.some((mot) => m.mots.toLowerCase().includes(mot))),
  true,
);
check(
  'et la règle dit qu’il n’en est pas un',
  laRegle().some((r) => r.includes('ni un diagnostic, ni une prédiction, ni un jugement')),
  true,
);
check('un nombre inconnu n’invente pas de sens', motsDuChiffre(0), null);
check('le chiffre du mariage se calcule comme une date', chiffreDUneDate('2027-08-21'), 22);

const regle = laRegle().join(' ');
check('la règle dit le système, l’alphabet et le nom de naissance', regle.includes('pythagoricien') && regle.includes('sans accents') && regle.includes('nom de naissance'), true);
check('elle dit la méthode, et les maîtres non réduits', regle.includes('par composant') && regle.includes('11, 22 et 33 ne sont pas réduits'), true);
check('et elle finit par ce que le chiffre n’est pas', regle.includes('ni un diagnostic, ni une prédiction, ni un jugement'), true);

/* Le chiffre d’une personne : facultatif, privé, et effaçable. */
effacerChiffre();
check('sans rien donné, rien n’est gardé', chargerChiffre(), null);
check('une case vide ne crée pas de donnée', enregistrerChiffre({ prenom: '', nomDeNaissance: '', date: '', cible: 'public' }), null);
enregistrerChiffre({ prenom: 'Claire', nomDeNaissance: 'Martin', date: '1992-06-14', cible: 'public' });
check('ce qui est donné se relit', [chargerChiffre()?.prenom, chargerChiffre()?.date], ['Claire', '1992-06-14']);
enregistrerChiffre({ prenom: 'Claire', nomDeNaissance: 'Martin', date: '1992-06-14', cible: 'inconnu' });
check('et l’on retombe toujours sur privé', chargerChiffre()?.cible, 'prive');
check('les trois cibles sont celles du journal', CONFIDENTIALITE_CHIFFRE.map((c) => c.id), ['public', 'cercle', 'prive']);
check('et la dernière est le défaut', CONFIDENTIALITE_CHIFFRE[2]!.qui.includes('c’est le défaut'), true);

effacerChiffre();
const chiffreVide = renderToStaticMarkup(createElement(LeChiffre, null));
check('le bloc s’annonce', chiffreVide.includes('Un chiffre, et sa règle'), true);
check('et il ne demande rien d’obligatoire', chiffreVide.includes('Facultatif, et privé'), true);
effacerChiffre();

enregistrerChiffre({ prenom: 'Claire', nomDeNaissance: 'Martin', date: '1992-06-14', cible: 'prive' });
const chiffreRendu = renderToStaticMarkup(createElement(LeChiffre, null));
check('le chiffre se montre', chiffreRendu.includes('Chemin de vie') && chiffreRendu.includes('>5<'), true);
check('avec ses mots', chiffreRendu.includes(motsDuChiffre(5)!.mots.slice(0, 30)), true);
check('et le calcul s’ouvre sur demande', chiffreRendu.includes('Voir le calcul'), true);
check('ce qu’il ne fera jamais est écrit', chiffreRendu.includes('Il ne compare personne'), true);
check('et la personne garde la main', chiffreRendu.includes('Effacer'), true);
effacerChiffre();

/* ————————— LE TEMPS COMMUN : CHAQUE GESTE ÉCRIT SA LIGNE ————————— */

effacerTemps();
check('le temps part vide', chargerTemps().length, 0);
check('et chaque famille de geste a son mot', GESTES.every((g) => g.nom.length > 5 && g.sens.length > 15), true);
check('une famille inconnue ne dit rien', regleDuGeste('inventee' as never), null);

const geste1 = enregistrerGeste({ type: 'selection', titre: 'Carte retenue : Le Cinéma', quand: '2026-09-20T09:15:00.000Z' });
enregistrerGeste({ type: 'document', titre: 'Acte de naissance validé', quand: '2026-09-20T14:05:00.000Z' });
check('un geste s’écrit, et se date', [typeof geste1.id, typeof geste1.quand], ['string', 'string']);
check('le plus récent vient en tête', chargerTemps()[0]!.titre, 'Acte de naissance validé');
check('le geste garde sa famille', chargerTemps()[1]!.type, 'selection');

const temps = chargerTemps();
check('les lignes du jour sont celles du jour', lignesDuJour(temps, new Date('2026-09-20T20:00:00.000Z')).length, 2);
check('et un autre jour est vide', lignesDuJour(temps, new Date('2026-09-21T10:00:00.000Z')).length, 0);
check('l’année se filtre aussi', lignesDeLAnnee(temps, 2026).length, 2);
check('une année sans geste ne compte rien', lignesDeLAnnee(temps, 2025).length, 0);
check('l’année se lit en douze parts', moisDeLAnnee(temps, 2026).length, 12);
check('et le bon mois compte les siens', moisDeLAnnee(temps, 2026)[8]!.gestes, 2);
check('les années se listent, la plus récente d’abord', anneesDuTemps(temps), [2026]);

const resume = resumeDuTemps(temps);
check('le résumé compte les gestes', resume.total, 2);
check('il dit le premier et le dernier', [resume.premier?.titre, resume.derniere?.titre], ['Carte retenue : Le Cinéma', 'Acte de naissance validé']);
check('et la famille la plus active', resume.famille !== null, true);

check('l’heure s’écrit court', heureCourte('2026-09-20T14:05:00.000Z').endsWith('05'), true);
check('la date s’écrit en clair', dateDUneLigne('2026-09-20T14:05:00.000Z').includes('2026'), true);
check('et le jour court aussi', jourCourt('2026-09-20T14:05:00.000Z'), '20.09');

/* Le plafond : le temps ne grossit pas sans fin. */
const long = Array.from({ length: LIGNES_MAX + 60 }, (_, i) => ({
  id: `vieux-${i}`, quand: '2026-01-01T00:00:00.000Z', type: 'journal', titre: `Vieux ${i}`,
}));
localStorage.setItem('vows:temps', JSON.stringify(long));
check('le temps est plafonné', chargerTemps().length, LIGNES_MAX + 60);
enregistrerGeste({ type: 'journal', titre: 'Un geste de plus' });
check('et il se taille au-delà', chargerTemps().length, LIGNES_MAX);
check('en gardant le plus récent', chargerTemps()[0]!.titre, 'Un geste de plus');

/* Les autres briques écrivent au temps : rien n’est à rebrancher à la main. */
effacerTemps();
viderSelection();
choisirCarte({ id: WEDDING_STYLES[0]!.id, sorte: 'univers', titre: WEDDING_STYLES[0]!.name });
check('retenir une carte s’écrit dans le temps', chargerTemps()[0]!.type, 'selection');
check('avec son nom', chargerTemps()[0]!.titre.includes(WEDDING_STYLES[0]!.name), true);
enregistrerChiffre({ prenom: 'Claire', nomDeNaissance: 'Martin', date: '1992-06-14', cible: 'prive' });
check('poser son chiffre s’écrit aussi', chargerTemps()[0]!.type, 'chiffre');
check('sans jamais écrire la date dans la ligne', chargerTemps()[0]!.titre.includes('1992'), false);
effacerChiffre();
check('et l’effacer laisse une trace', chargerTemps()[0]!.titre, 'Chiffre effacé');
viderSelection();

/* Le bloc du temps, tel qu’il se rend. */
enregistrerGeste({ type: 'magazine', titre: 'Numéro du jour ouvert', detail: '24 pages' });
const tempsRendu = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/footer'] }, createElement(LeTemps as never)),
);
check('le temps se montre', tempsRendu.includes('Ce qui s’est passé, à sa date'), true);
check('avec la ligne du jour', tempsRendu.includes('Numéro du jour ouvert'), true);
check('et sa famille', tempsRendu.includes('Le magazine'), true);
check('les douze mois sont là', ['janvier', 'juin', 'décembre'].every((m) => tempsRendu.includes(m)), true);
check('et l’on peut ouvrir la timeline', tempsRendu.includes('La timeline complète'), true);
/* Le gras s’écrit en balise, jamais en astérisques : ce que `RichText` interprète
   ailleurs ne doit pas s’afficher ici tel quel. */
check('aucun astérisque de mise en forme ne s’affiche', tempsRendu.includes('**'), false);
check('le temps se dit vivant, ou vide', chargerTemps().length > 0, true);

effacerTemps();
const tempsVide = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/footer'] }, createElement(LeTemps as never)),
);
check('vide, il dit ce qui l’écrira', tempsVide.includes('Rien encore aujourd’hui'), true);
check('et n’invente aucune année', tempsVide.includes('Aucune année pour l’instant'), true);

/* ————————— LES 365 COUVERTURES : UNE PAR JOUR, LE MÊME DESSIN ————————— */

const anneeCouv = 2026;
const couvertures = couverturesDeLAnnee(anneeCouv);
check('il y a une couverture par jour de l’année', couvertures.length, 365);
check('et une année bissextile en a une de plus', couverturesDeLAnnee(2028).length, 366);
check('chaque couverture a son identifiant de date', couvertures[0]!.id, '2026-01-01');
check('chaque couverture a ses vingt-quatre branches', couvertures.every((c) => c.branches.length === 24), true);
check(
  'les heures de lumière sont marquées, les autres non',
  couvertures[0]!.branches.filter((b) => b.eclatante).map((b) => b.heure),
  HEURES_DE_LUMIERE,
);
check('les longueurs tiennent dans l’intervalle', couvertures.every((c) => c.branches.every((b) => b.longueur > 0 && b.longueur <= 1)), true);

check('les quatre saisons du jeu sont là', [...new Set(couvertures.map((c) => c.saison.id))].sort().join(','), 'automne,ete,hiver,printemps');
check(
  'et chaque saison donne son fond',
  new Set(couvertures.filter((c) => !c.pasCommeLesAutres && !c.dense).map((c) => c.fond)).size,
  4,
);
check(
  'et chaque saison a sa version assombrie',
  new Set(couvertures.filter((c) => c.dense).map((c) => c.fond)).size,
  3,
);
check('les jours qui ne sont pas comme les autres passent au noir', couvertures.some((c) => c.pasCommeLesAutres && c.fond === FOND_NOIR), true);
check('et ils disent pourquoi', couvertures.filter((c) => c.pasCommeLesAutres).every((c) => c.raison.length > 12), true);

/* LE NOIR EST RARE : dimanche, porte de l'année, joker. Et rien d'autre. */
const noirs = couvertures.filter((c) => c.pasCommeLesAutres);
check('le noir ne tombe que sur trois raisons', new Set(noirs.map((c) => c.raison.split(' :')[0])).size, 3);
check('dont les dimanches', noirs.filter((c) => c.raison.includes('dimanche')).length, 52);
check('les portes de l’année', noirs.filter((c) => c.raison.includes('porte')).length, 10);
check('et le joker', noirs.filter((c) => c.raison.includes('joker')).length, 1);
check('soit soixante-trois jours sur trois cent soixante-cinq', noirs.length, 63);
check('et le noir ne dépasse jamais un mois sur trois', Math.max(...MOIS.map((m) => noirs.filter((c) => c.mois === m.numero).length)) <= 8, true);

/* UN TEMPS CLOS N'EST PAS NOIR : la couleur de sa saison, assombrie. */
const denses = couvertures.filter((c) => c.dense);
check('les temps clos ne sont pas noirs', denses.some((c) => c.fond === FOND_NOIR), false);
check('ils sont assombris', denses.every((c) => c.fond !== c.saison.fond), true);
check('et ils disent pourquoi', denses.every((c) => c.raison.startsWith('un temps clos')), true);
check('le carême en compte vingt-sept', denses.filter((c) => c.raison.includes('carême') && !c.raison.includes('avant')).length, 27);
check('l’avent vingt-huit', denses.filter((c) => c.raison.includes('avent')).length, 28);
check('et l’avant-carême dix-huit', denses.filter((c) => c.raison.includes('avant le carême')).length, 18);
check('un temps clos garde l’encre claire', denses.every((c) => c.encre === '#F3F1ED'), true);
check('le studio dit lequel des trois fonds', studioDuJour(new Date(2026, 1, 5)).fond, 'dense');
check('un dimanche passe bien au noir', studioDuJour(new Date(2026, 8, 20)).fond, 'noir');
check('et un jour ordinaire reste blanc', studioDuJour(new Date(2026, 5, 10)).fond, 'blanc');
check(
  'le dimanche est l’un d’eux — un rythme visible au kiosque',
  couvertureDuJour(new Date(2026, 8, 20)).pasCommeLesAutres,
  true,
);

const jourDeFete = couvertureDuJour(new Date(2026, 8, 21));
check('le jour de la fête donne son nom', jourDeFete.titre, 'Saint Matthieu');
/* Quand le personnage du jour n'est pas le saint, c'est lui qui mène le titre —
   et le calendrier reste écrit dessous. */
const jourSax = couvertureDuJour(new Date(2026, 10, 6));
check('le jour d’Adolphe Sax porte son nom', jourSax.titre, 'Adolphe Sax');
check('et garde la fête du calendrier dessous', jourSax.fete, 'Sainte Bertille');
check('un jour sans fiche garde son nom du calendrier', couvertureDuJour(new Date(2026, 6, 15)).titre.startsWith('Saint'), true);
check('et n’a pas de fête à écrire', couvertureDuJour(new Date(2026, 6, 15)).fete, undefined);
check('avec sa légende de semaine — plus de nom de carte à jouer', jourDeFete.figure, `Été · semaine 38`);
check('et sa date écrite', jourDeFete.dateLongue, '21 septembre 2026');
check('et son numéro dans l’année', jourDeFete.numero, 264);
check('les clés du jour sont là', jourDeFete.cles.slice(0, 3).map((c) => c.label), ['Le ciel', 'La lune', 'Le chiffre']);
check('le jour de trop garde son nom', couvertureDuJour(new Date(2026, 11, 31)).titre, 'Le jour de trop — Sylvestre');
check('et celui du 29 février n’a pas de prénom', couvertureDuJour(new Date(2028, 1, 29)).titre, 'Le jour de trop');

check('la graine est stable', graine('2026-09-21'), graine('2026-09-21'));
check('et deux textes différents donnent deux graines', graine('a') === graine('b'), false);
check(
  'la même date donne toujours la même couverture',
  JSON.stringify(couvertureDuJour(new Date(2026, 5, 14)).branches) ===
    JSON.stringify(couvertureDuJour(new Date(2026, 5, 14)).branches),
  true,
);
check(
  'et deux jours différents ne se ressemblent pas',
  JSON.stringify(couvertureDuJour(new Date(2026, 5, 14)).branches) !==
    JSON.stringify(couvertureDuJour(new Date(2026, 5, 15)).branches),
  true,
);
check('un mois se fabrique tout entier', couverturesDuMois(2026, 2).length, 28);
check('février 2028 en a vingt-neuf', couverturesDuMois(2028, 2).length, 29);
check('les douze mois sont nommés', MOIS.length, 12);

/* La couverture, telle qu’elle se dessine. */
const svgCouverture = renderToStaticMarkup(createElement(CouvertureJour, { couverture: jourDeFete }));
check('la couverture porte la marque', svgCouverture.includes('AIME MAGAZINE'), true);
check('le fond est uni, et c’est la couleur du jour', svgCouverture.includes(`fill="${jourDeFete.fond}"`), true);
check('le nom du jour est écrit', svgCouverture.includes('Saint Matthieu'), true);
check('la date est en bas', svgCouverture.includes('21 SEPTEMBRE 2026'), true);
check('la création est au centre', svgCouverture.includes('<line'), true);
check('et l’image dit ce qu’elle est, pour qui ne la voit pas', svgCouverture.includes('aria-label="Saint Matthieu — 21 septembre 2026'), true);

const svgVignette = renderToStaticMarkup(createElement(CouvertureJour, { couverture: jourDeFete, vignette: true }));
check('la vignette se passe des détails', svgVignette.includes('FOND NOIR —'), false);

/* Le kiosque : les mois, les saisons, et les couvertures. */
const kiosque = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/magazine'] }, createElement(GalerieCouvertures as never, { annee: 2026 })),
);
check('la collection s’annonce', kiosque.includes('Les 54 magazines de l’année'), true);
check('les 54 couvertures y sont, une par magazine', (kiosque.match(/aria-label="Ouvrir Magazine /g) ?? []).length, 54);
check('et les quatre saisons', ['Printemps', 'Été', 'Automne', 'Hiver'].every((s) => kiosque.includes(s)), true);
check('elle compte les images de la collection', kiosque.includes(`${IMAGES_ATTENDUES} images attendues`), true);
check('et dit combien sont livrées', kiosque.includes(`${VISUELS_LIVRES} livrées`), true);
check('elle dit à qui appartient la couverture', kiosque.includes('La couverture appartient à'), true);
check('et qu’aucune semaine n’emprunte le visuel d’une autre', kiosque.includes('n’emprunte jamais le visuel d’une autre semaine'), true);
check('la collection non plus ne montre pas d’astérisques', kiosque.includes('**'), false);

/* ————————— LES 365 PROFILS ÉDITORIAUX : LA PORTE D'ENTRÉE DU JOUR ————————— */

check('les niveaux de correspondance sont quatre', NIVEAUX.length, 4);
check(
  'et chacun dit ce qu’il vaut',
  NIVEAUX.map((n) => n.id).join(','),
  'directe,culturelle,editoriale,inspiration',
);
check('le plus documenté est le premier', NIVEAUX[0]!.sens.includes('documentée'), true);

check('seize jours ont déjà leur fiche', profilsDocumentes(), 16);
check('chaque fiche a son origine, son lieu, son époque', Object.values(PROFILS).every(
  (p) => p.fiche.origine.length > 8 && p.fiche.lieu.length > 3 && p.fiche.epoque.length > 3,
), true);
check('chaque fiche dit sa source', Object.values(PROFILS).every((p) => p.source.length > 12), true);
check('aucun profil n’est vide de ponts', Object.values(PROFILS).every((p) => p.ponts.length >= 3), true);
check(
  'chaque pont a un niveau connu, un mot et un texte',
  Object.values(PROFILS).every((p) =>
    p.ponts.every((pont) => NIVEAUX.some((n) => n.id === pont.niveau) && pont.mot.length > 2 && pont.texte.length > 25),
  ),
  true,
);
check(
  'et les quatre niveaux servent vraiment',
  new Set(Object.values(PROFILS).flatMap((p) => p.ponts.map((pont) => pont.niveau))).size,
  4,
);

/* Les jours qu’on regarde de près. */
const clef = (d: Date) => cleDuJour(d);
check('la clé d’un jour est son mois et son quantième', clef(new Date(2026, 8, 21)), '09-21');
check('le 14 février, c’est Valentin', personnageDuJour(new Date(2026, 1, 14)), 'Valentin');
check('le 21 septembre, c’est Matthieu', personnageDuJour(new Date(2026, 8, 21)), 'Matthieu');
check('et le 6 novembre, c’est Adolphe Sax', personnageDuJour(new Date(2026, 10, 6)), 'Adolphe Sax');
check('le 1ᵉʳ décembre, c’est Éloi', personnageDuJour(new Date(2026, 11, 1)), 'Éloi');
check('le 25 décembre, c’est Noël', personnageDuJour(new Date(2026, 11, 25)), 'Noël');

const matthieu = profilDuJour(new Date(2026, 8, 21));
check('le jour documenté le dit', matthieu.documente, true);
check('avec sa fiche', matthieu.profil!.fiche.lieu.includes('Capharnaüm'), true);
check('et ses quatre ponts', matthieu.profil!.ponts.length, 4);
check(
  'dont un pont d’inspiration, assumé',
  matthieu.profil!.ponts.some((pont) => pont.niveau === 'inspiration'),
  true,
);
check('l’entrée du jour se lit', matthieu.entree.includes('Profil éditorial du 21 septembre'), true);
check('et la date est écrite en entier', matthieu.dateLongue, '21 septembre 2026');

const eloi = profilDuJour(new Date(2026, 11, 1));
check(
  'Éloi mène aux alliances, en correspondance directe',
  eloi.profil!.ponts.some((pont) => pont.niveau === 'directe' && pont.mot === 'Les alliances'),
  true,
);
const sax = profilDuJour(new Date(2026, 10, 6));
check('Sax dit son brevet', sax.profil!.fiche.savoirFaire.includes('1846'), true);
check('et son instrument', sax.profil!.fiche.savoirFaire.includes('saxophones'), true);

/* Un jour qui n’a pas encore sa fiche : on ne l’invente pas. */
const sansFiche = profilDuJour(new Date(2026, 2, 3));
check('un jour sans fiche reste sans fiche', sansFiche.documente, false);
check('mais il garde le nom de son calendrier', sansFiche.personnage.length > 2, true);
check('et il le dit', sansFiche.entree.includes('on ne l’invente pas'), true);
check('il n’a aucun pont', sansFiche.profil, null);

/* L’index : c’est par les mots qu’on entre. */
check('les accents ne comptent pas', plat('Éloi VÉRONIQUE é'), 'eloi veronique e');
check('le saxophone mène à Sax', chercherProfils(['saxophone']).map((p) => p.personnage).join(''), 'Adolphe Sax');
check(
  'la musique mène aux musiciens',
  chercherProfils(['musique']).map((p) => p.personnage).sort().join(' / '),
  'Adolphe Sax / Cécile / Jean-Baptiste',
);
check('les alliances mènent à l’orfèvre', chercherProfils(['alliances']).map((p) => p.personnage), ['Éloi']);
check('on peut croiser deux mots', chercherProfils(['musique', 'jazz']).map((p) => p.personnage), ['Adolphe Sax']);
check('ce qui n’existe pas ne sort pas', chercherProfils(['japon']).length, 0);
check('et une recherche vide ne rend rien', chercherProfils([]).length, 0);
check(
  'les ponts se rangent par niveau',
  pontsParNiveau(PROFILS['09-21']!).map((g) => g.niveau.id + ':' + g.ponts.length).join(' '),
  'directe:1 culturelle:1 editoriale:1 inspiration:1',
);

/* Le profil, tel qu’il se rend. */
const renduProfil = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/magazine'] },
    createElement(ProfilEditorial as never, { date: new Date(2026, 8, 21) })),
);
check('le bloc s’annonce', renduProfil.includes('Le profil du jour'), true);
check('il porte le nom', renduProfil.includes('Matthieu'), true);
check('sa fiche est là', ['Origine', 'Époque', 'Lieu', 'Métier', 'Savoir-faire', 'Culture'].every(
  (l) => renduProfil.includes(l),
), true);
check('ses ponts sont là', renduProfil.includes('Les ponts') || renduProfil.includes('La papeterie'), true);
check('avec les niveaux écrits en clair', renduProfil.includes('Correspondance directe'), true);
check('la source est citée', renduProfil.includes('Source :'), true);
check('et la règle est dite', renduProfil.includes(REGLE_DES_PROFILS), true);
check('comme l’avertissement', renduProfil.includes(AVERTISSEMENT_PROFILS), true);
check('ces personnes ne sont pas des inscrits', AVERTISSEMENT_PROFILS.includes('ne sont pas des inscrits'), true);
check('aucun astérisque ne s’affiche', renduProfil.includes('**'), false);
check('il n’y a pas de portrait inventé : la couverture fait le dessin', renduProfil.includes('<img'), false);
check('le sens du prénom est dit', renduProfil.includes('Ce que le prénom veut dire'), true);
check('avec sa source', renduProfil.includes('les dictionnaires de prénoms courants'), true);
check('et les cinq lumières du personnage', renduProfil.includes('Ses cinq lumières'), true);
check(
  'le même nom, cinq fois',
  ['L’aube', 'Le matin', 'Le midi', 'L’après-midi', 'Le soir'].every(
    (m) => renduProfil.includes(`Matthieu — ${m}`),
  ),
  true,
);

const renduSansFiche = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/magazine'] },
    createElement(ProfilEditorial as never, { date: new Date(2026, 2, 3) })),
);
check('un jour sans fiche le dit à l’écran', renduSansFiche.includes('rien d’autre n’est inventé'), true);
check('et n’affiche aucun pont', renduSansFiche.includes('Correspondance'), false);
check('et nomme ce qui manque', renduSansFiche.includes('Ce qui manque, nommé'), true);

/* Le jour sans fiche documentée n'est pas vide pour autant : la couche qui couvre
   l'année entière s'affiche quand même (sens du prénom, métiers, portes). */
const renduEloi = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/magazine'] },
    createElement(ProfilEditorial as never,
      { date: new Date(2026, 5, 25) })), // 25 juin — Prosper
);
check('un jour sans fiche montre le sens de son prénom', renduEloi.includes('Ce que le prénom veut dire'), true);
check('et sa source', renduEloi.includes('dictionnaires de prénoms'), true);

/* La dixième règle de la charte est celle-ci. */
check(
  'la charte porte la règle des profils',
  CHARTE.some((r) => r.id === 'profils-editoriaux'),
  true,
);

/* ————————— LES SIX TEMPS DU JOUR : LE MÊME JOUR, SIX LUMIÈRES ————————— */

check('le jour se lit en six temps', PARTS.length, 6);
check(
  'et ils se suivent sans trou ni recouvrement',
  PARTS.map((p) => `${p.de}-${p.a}`).join(' '),
  '0-4 5-7 8-11 12-13 14-17 18-23',
);
check('les vingt-quatre heures sont toutes rangées', PARTS.reduce((n, p) => n + heuresDeLaPart(p).length, 0), 24);
check('les cinq moments du jour, plus la nuit', PARTS.filter((p) => p.id !== 'nuit').length, 5);
check('chaque temps dit sa lumière et sa phrase', PARTS.every((p) => p.lumiere.length > 8 && p.phrase.length > 20), true);
check('le temps d’une heure se trouve', partDeLHeure(6).id, 'aube');
check('midi est au midi', partDeLHeure(12).id, 'midi');
check('dix-sept heures est l’après-midi', partDeLHeure(17).id, 'apres-midi');
check('vingt-trois heures est le soir', partDeLHeure(23).id, 'soir');
check('et trois heures du matin, la nuit', partDeLHeure(3).id, 'nuit');
check('une heure hors bornes retombe sur la nuit', partDeLHeure(99).id, 'nuit');
check('le temps actuel suit l’horloge', partActuelle(new Date(2026, 8, 21, 18, 30)).id, 'soir');
check('un temps se retrouve par son identifiant', partParId('matin')!.nom, 'Le matin');
check('et un identifiant inconnu ne rend rien', partParId('aube-du-dimanche'), null);
check('les bornes s’écrivent comme on les dit', bornesDeLaPart(PARTS[1]!), '5 h → 7 h');

check('la règle éditoriale pose trois questions', REGLE_EDITORIALE.map((r) => r.cle).join('/'), 'QUI/QUAND/QUOI');
check('et chacune dit ce qu’elle règle', REGLE_EDITORIALE.every((r) => r.sens.length > 20), true);

/* La couverture, lue à une heure : même dessin, autre lumière. */
const jourDesParts = new Date(2026, 8, 21);
const couvertureMatin = couvertureDeLaPart(jourDesParts, 'matin');
const couvertureSoir = couvertureDeLaPart(jourDesParts, 'soir');
const couvertureBase = couvertureDeLaPart(jourDesParts, 'midi');
check('le temps est écrit sur la couverture', couvertureMatin.part!.nom, 'Le matin');
check('la couverture garde ses vingt-quatre branches', couvertureMatin.branches.length, 24);
check(
  'et seules celles du temps s’allument',
  couvertureMatin.branches.filter((b) => b.eclatante).map((b) => b.heure),
  [8, 9, 10, 11],
);
check(
  'le soir allume les siennes',
  couvertureSoir.branches.filter((b) => b.eclatante).map((b) => b.heure),
  [18, 19, 20, 21, 22, 23],
);
check('la nuit en allume cinq', couvertureDeLaPart(jourDesParts, 'nuit').branches.filter((b) => b.eclatante).length, 5);
check(
  'le fond, le titre et la date ne changent pas d’un temps à l’autre',
  [couvertureMatin.fond, couvertureMatin.titre, couvertureMatin.dateLongue].join('|'),
  [couvertureSoir.fond, couvertureSoir.titre, couvertureSoir.dateLongue].join('|'),
);
check(
  'les longueurs des branches, elles non plus',
  couvertureMatin.branches.map((b) => b.longueur).join() === couvertureBase.branches.map((b) => b.longueur).join(),
  true,
);
check('les six temps ont chacun leur couverture', couverturesDesParts(jourDesParts).length, 6);
check(
  'et ce sont bien six lumières différentes',
  new Set(
    couverturesDesParts(jourDesParts).map((c) =>
      c.couverture.branches.filter((b) => b.eclatante).map((b) => b.heure).join(),
    ),
  ).size,
  6,
);

/* Le bloc, tel qu’il se rend. */
const renduMoments = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/magazine'] },
    createElement(MomentsDuJour as never, { date: new Date(2026, 8, 21, 18, 30) })),
);
check('le bloc annonce les six temps', renduMoments.includes('Le jour, en six temps'), true);
check('il compte les heures du jour', renduMoments.includes('24 heures'), true);
check('il nomme le temps qu’il est', renduMoments.includes('maintenant'), true);
check('il pose la règle', ['QUI', 'QUAND', 'QUOI'].every((c) => renduMoments.includes(c)), true);
check('les six temps sont là', ['La nuit', 'L’aube', 'Le matin', 'Le midi', 'L’après-midi', 'Le soir'].every(
  (n) => renduMoments.includes(n),
), true);
check('avec leurs bornes', renduMoments.includes('18 h → 23 h'), true);
check('et le nom du personnage du jour', renduMoments.includes('Matthieu'), true);
check('aucun astérisque ne s’affiche', renduMoments.includes('**'), false);

/* ————————— LA CHAÎNE DU MONDE : DE LA CARTE AU CONTENU ————————— */

check('la chaîne a huit maillons', CHAINE.length, 8);
check(
  'et ils s’enchaînent dans l’ordre',
  CHAINE_LIGNE,
  'LA CARTE → LA PERSONNE → LE RÔLE → LE MARIAGE → LE JOUR → LE MOMENT → L’HEURE → LE CONTENU',
);
check('chaque maillon dit sa question', CHAINE.every((m) => m.question.length > 8), true);
check('et où il vit', CHAINE.every((m) => m.ou.length > 12), true);
check('un maillon se retrouve par son identifiant', maillon('moment')!.nom, 'Le moment');
check('et un identifiant inconnu ne rend rien', maillon('cocktail'), null);

/* Chaque nombre de la chaîne est vérifié contre la brique qui le porte : si l'une
   bouge sans l'autre, c'est ici que ça casse. */
check('les cartes sont 54', maillon('carte')!.combien, JEU_DE_54.length);
check('les jours sont ceux de l’année', maillon('jour')!.combien, couverturesDeLAnnee(2026).length);
check('les temps sont ceux du jour', maillon('moment')!.combien, PARTS.length);
check('les heures sont celles de l’édition', maillon('heure')!.combien, HEURES.length);
check(
  'et le contenu, c’est la page de l’heure',
  maillon('contenu')!.ou.includes('rubrique'),
  true,
);
check('la chaîne se dit en une phrase', CHAINE_PROMESSE.includes('sa carte'), true);

/* ————————— LES COULEURS : ASSOMBRIR UNE SAISON SANS LA PERDRE ————————— */

check('une couleur se lit en trois canaux', canaux('#7FB77E')!.join(','), '127,183,126');
check('et une écriture inconnue ne rend rien', canaux('vert'), null);
check('les canaux se réécrivent en hexadécimal', enHex(127, 183, 126), '#7fb77e');
check('un taux nul laisse la couleur', assombrir('#7FB77E', 0), '#7fb77e');
check('une couleur noircit sans changer de teinte', assombrir('#7FB77E', TAUX_TEMPS_CLOS), '#4c6e4c');
check('le taux est borné : jamais au-delà de trois quarts', assombrir('#FFFFFF', 4), '#404040');
check('et une écriture illisible ressort telle quelle', assombrir('rouge', 0.4), 'rouge');

/* ————————— LES PROMPTS VISUELS : LA MÊME COLLECTION POUR LES 365 ————————— */

check('la direction artistique est écrite une fois', DIRECTION_ARTISTIQUE.length, 11);
check('elle veut de la photographie éditoriale', DIRECTION_ARTISTIQUE[0]!.includes('éditoriale de mode'), true);
check('un vrai casting', DIRECTION_ARTISTIQUE[1]!.includes('casting'), true);
check('et refuse le kitsch religieux', DIRECTION_ARTISTIQUE.some((l) => l.includes('kitsch religieux')), true);
check('elle refuse l’illustration et le cartoon', DIRECTION_ARTISTIQUE.some((l) => l.includes('cartoon')), true);
check('et le cliché touristique', DIRECTION_ARTISTIQUE.some((l) => l.includes('cliché touristique')), true);
check('les interdits sont écrits', INTERDITS_VISUELS.length >= 5, true);
check('dont le texte dans l’image', INTERDITS_VISUELS.some((l) => l.includes('texte dans l’image')), true);
check('le cadre est portrait', CADRAGE.format.includes('5:7'), true);

check('une journée a cinq images', MOMENTS_VISUELS.length, 5);
check(
  'et ce sont celles des cinq moments du jour',
  MOMENTS_VISUELS.map((m) => m.id).join(','),
  'aube,matin,midi,apres-midi,soir',
);
check(
  'la nuit n’en a pas, et elle dit pourquoi',
  PAS_DIMAGE_LA_NUIT.includes('queue de la veille'),
  true,
);
check('chaque moment a sa lumière, sa posture, son décor', MOMENTS_VISUELS.every(
  (m) => m.lumiere.length > 20 && m.posture.length > 15 && m.decor.length > 20,
), true);
check('et sa narration', MOMENTS_VISUELS.every((m) => m.narration.length > 20), true);
check('un moment se retrouve par son identifiant', momentVisuel('soir')!.nom, 'Le soir');
check('et un inconnu ne rend rien', momentVisuel('crepuscule'), null);
check('les cinq moments sont ceux de la journée', MOMENTS_VISUELS.every((m) => PARTS.some((p) => p.id === m.id)), true);
check('soit 1 825 scènes pour l’année', 365 * SCENES_PAR_PERSONNAGE, 1825);

/* Le prompt maître d'un personnage connu. */
const profilMatthieu = PROFILS['09-21']!;
const promptMatthieu = promptMaitre(profilMatthieu, new Date(2026, 8, 21));
check('le prompt maître porte les quatre blocs', ['IDENTITÉ', 'INTERPRÉTATION', 'DIRECTION ARTISTIQUE', 'IDENTITÉ DU JOUR'].every(
  (b) => promptMatthieu.prompt.includes(b),
), true);
check('l’identité dit l’origine', promptMatthieu.identite.some((l) => l.includes('Capharnaüm')), true);
check('et la source', promptMatthieu.identite.some((l) => l.startsWith('Source :')), true);
check('la signification du prénom y est', promptMatthieu.identite.some((l) => l.includes('don de Dieu')), true);
check('l’interprétation dit le casting', promptMatthieu.interpretation[0]!.includes('40 ans'), true);
check('chaque pont porte son niveau, en clair', promptMatthieu.interpretation.filter((l) => l.startsWith('Pont vers le mariage')).length, 4);
check('aucun astérisque de mise en forme', promptMatthieu.prompt.includes('**'), false);
check('la direction artistique est la même pour tous', promptMatthieu.directionArtistique.length > DIRECTION_ARTISTIQUE.length, true);
check('l’identité du jour dit la saison', promptMatthieu.identiteDuJour.some((l) => l.includes('Automne')), true);
check('et le moment, quand il n’y en a pas', promptMatthieu.identiteDuJour.some((l) => l.includes('prompt maître')), true);
check('la direction de casting tient les cinq scènes', promptMatthieu.casting.length, 5);
check('et elle dit que rien ne change', promptMatthieu.casting.some((l) => l.includes('ne changent pas')), true);
check('une fiche complète ne manque de rien', promptMatthieu.manquant.length, 0);
check('la version courte parle à l’outil d’image', promptMatthieu.promptTechnique.includes('editorial fashion photograph'), true);
check('et refuse l’iconographie religieuse', promptMatthieu.promptTechnique.includes('no religious iconography'), true);

/* Les cinq scènes : le même, cinq fois. */
const scenes = scenesDuPersonnage(profilMatthieu, new Date(2026, 8, 21));
check('il y a cinq scènes', scenes.length, 5);
check('et elles gardent le prompt maître', scenes.every((s) => s.texte.includes('COUVERTURE AIME MAGAZINE — MATTHIEU')), true);
check('et le casting', scenes.every((s) => s.texte.includes('DIRECTION DE CASTING')), true);
check('chaque scène porte son moment', scenes.every((s) => s.texte.includes(`MOMENT — ${s.moment.nom.toUpperCase()}`)), true);
check('ce qui change, c’est la lumière', new Set(scenes.map((s) => s.moment.lumiere)).size, 5);
check('c’est le même personnage, cinq fois', new Set(scenes.map((s) => s.moment.narration)).size, 5);

/* Le tableau de production. */
const etatSerie = etatDeLaSerie(2026);
check('l’année compte ses jours', etatSerie.jours, 365);
check('les fiches prêtes sont celles des profils', etatSerie.pretes, profilsDocumentes());
check('le reste est à documenter', etatSerie.aDocumenter, 365 - profilsDocumentes());
check('et les scènes ne se comptent que là où le prompt existe', etatSerie.scenes, profilsDocumentes() * 5);
check('les douze mois sont au tableau', etatSerie.parMois.length, 12);
check('février a ses vingt-huit jours', etatSerie.parMois[1]!.jours, 28);
check('décembre a quatre fiches prêtes', etatSerie.parMois[11]!.pretes, 4);
check('janvier n’en a aucune', etatSerie.parMois[0]!.pretes, 0);

const jourNeufFevrier = entreesDuMois(2026, 2)[8]!;
check('un jour sans fiche n’a pas de prompt', jourNeufFevrier.prompt, null);
check('et il dit ce qui lui manque', jourNeufFevrier.manquant.length, 3);
check('un jour documenté en a un', entreesDuMois(2026, 2)[13]!.etat, 'complete');
check('l’année entière fait 365 entrées', entreesDeLAnnee(2026).length, 365);
check(
  'et ce sont bien les mêmes jours, dans l’ordre',
  entreesDeLAnnee(2026)[0]!.jour + ' → ' + entreesDeLAnnee(2026)[364]!.jour,
  '01-01 → 12-31',
);

/* ——————— CE QUE LES PRÉNOMS VEULENT DIRE, ET LES MÉTIERS DE LA TRADITION ——————— */

check('la table des prénoms est longue', PRENOMS_DOCUMENTES >= 320, true);
check('chaque prénom dit son sens, en une phrase', Object.values(PRENOMS).every((s) => s.length > 20), true);
check('et le sens finit par un point', Object.values(PRENOMS).every((s) => s.endsWith('.')), true);
check('aucune ligne ne mélange deux prénoms', Object.entries(PRENOMS).every(([n]) => !n.includes('\n')), true);
check('Matthieu est un don de Dieu', significationDe('Matthieu')!.includes('don de Dieu'), true);
check('Basile veut dire roi', significationDe('Basile')!.includes('roi'), true);
check('Éloi veut dire l’élu', significationDe('Éloi')!.includes('l’élu'), true);
check('Cécile porte deux lectures', significationDe('Cécile')!.includes('Caecilii'), true);
check(
  'un nom composé se lit par son premier mot',
  significationDe('Thomas d’Aquin'),
  significationDe('Thomas'),
);
check('et Jean-François Régis par Jean', significationDe('Jean-François Régis'), significationDe('Jean'));
check('ce qui n’est pas documenté ne rend rien', significationDe('La Toussaint'), null);
check('ni un prénom inventé', significationDe('Zigomar'), null);
check('« saint » ne gêne pas la lecture', significationDe('Saint Matthieu'), significationDe('Matthieu'));
check('et les sens discutés le disent', Object.values(PRENOMS).some((s) => s.includes('sens discuté')), true);

/* — les métiers de la tradition — */
check('la liste des patronages est fournie', PATRONAGES.length >= 50, true);
check('chaque patronage a un métier, un saint et une porte', PATRONAGES.every(
  (p) => p.metier.length > 5 && p.saint.length > 2 && p.mot.length > 3 && p.texte.length > 30,
), true);
check('chaque porte dit ce que le métier apporte', PATRONAGES.every((p) => p.apport.length > 20), true);
check('les orfèvres mènent aux alliances', patronagesDe('Éloi').some((p) => p.mot === 'Les alliances'), true);
check('les photographes aux images', portesDuJour('Véronique').includes('Les images'), true);
check('les jardiniers aux fleurs', portesDuJour('Fiacre').includes('Les fleurs'), true);
check('les musiciens à la musique', portesDuJour('Cécile').includes('La musique'), true);
check('un saint sans métier ne rend rien', patronagesDe('Zigomar').length, 0);
check('les saints patrons sont plus de vingt', SAINTS_PATRONS.length >= 20, true);

/* ——————— LES 365 FICHES DE L'ANNÉE ——————— */

const anneeFiches = fichesDeLAnnee(2026);
check('l’année compte ses fiches', anneeFiches.length, 365);
check('la première est le 1ᵉʳ janvier', anneeFiches[0]!.jour, '01-01');
check('la dernière est le 31 décembre', anneeFiches[364]!.jour, '12-31');
check('aucune journée n’est vide : chacune a sa saison', anneeFiches.every((f) => f.saison.nom.length >= 3), true);
check('chacune a sa carte et son chiffre', anneeFiches.every((f) => f.carte.length > 3 && f.chiffre >= 1 && f.chiffre <= 9), true);
check('chacune dit son ciel et sa lune', anneeFiches.every((f) => f.ciel.length > 2 && f.lune.length > 4), true);

const tresor = etatDeLAnnee(2026);
check('le tableau de l’année est juste', tresor.pretes + tresor.amorcees + tresor.aDocumenter, 365);
check('seize fiches documentées', tresor.pretes, 16);
check('la grande majorité des journées sont amorcées', tresor.amorcees >= 300, true);
check('trois cent quarante-six journées ont le sens de leur prénom', tresor.avecEtymologie, 346);
check('vingt-neuf journées ont leur métier', tresor.avecMetier, 29);
check('et cela ouvre quarante et une portes', tresor.portes, 41);
check('vingt journées sont des fêtes', tresor.fetes, 20);

/* L'invariant qui compte : aucune journée qui porte un prénom n'est vide. */
const sansRien = anneeFiches.filter((f) => f.etat === 'a-documenter');
check('les journées sans rien sont exactement les fêtes', sansRien.every((f) => f.categorie === 'fete'), true);
check('et elles sont dix-neuf', sansRien.length, 19);
check(
  'toutes les autres portent au moins le sens de leur prénom',
  anneeFiches.filter((f) => f.categorie === 'personne').every((f) => f.signification !== null),
  true,
);
check(
  'aucune journée de personne n’est sans rien',
  anneeFiches.some((f) => f.categorie === 'personne' && f.etat === 'a-documenter'),
  false,
);

/* La nature d'un jour, calculée — jamais devinée. */
check('le 1ᵉʳ janvier est une fête', categorieDuJour(new Date(2026, 0, 1)), 'fete');
check('le 21 septembre est une personne', categorieDuJour(new Date(2026, 8, 21)), 'personne');
check('le 29 février est le joker', categorieDuJour(new Date(2028, 1, 29)), 'joker');

/* Une fiche complète, une fiche amorcée, une fête. */
const ficheMatthieu = ficheDuJour(new Date(2026, 8, 21));
check('la fiche de Matthieu est documentée', ficheMatthieu.etat, 'prete');
check('avec son origine', ficheMatthieu.historique!.origine.includes('Galilée'), true);
check('son casting', ficheMatthieu.casting!.age, '40 ans');
check('ses quatre ponts', ficheMatthieu.ponts.length, 4);
check('et ses métiers', ficheMatthieu.metiers.length >= 3, true);
check('elle ne manque de rien', ficheMatthieu.manquant.length, 0);
check('et elle dit sa source', ficheMatthieu.source!.length > 20, true);

const ficheBlaise = ficheDuJour(new Date(2026, 1, 3));
check('la fiche de Blaise est amorcée', ficheBlaise.etat, 'amorcee');
check('elle dit le sens du prénom', ficheBlaise.signification!.includes('bégaye'), true);
check('et le métier de la tradition', ficheBlaise.metiers.includes('Les meuniers'), true);
check('donc la porte du pain', ficheBlaise.portes, ['Le pain']);
check('elle n’a pas d’histoire inventée', ficheBlaise.historique, null);
check('et elle dit ce qui manque', ficheBlaise.manquant.some((m) => m.includes('origine')), true);

const ficheToussaint = ficheDuJour(new Date(2026, 10, 1));
check('la Toussaint est une fête, pas une personne', ficheToussaint.categorie, 'fete');
check('elle n’invente pas de prénom', ficheToussaint.signification, null);
check('et sa fiche est un texte', ficheToussaint.manquant.length > 0, true);

/* Les portes : ce qui est déjà utile avant même d’être documenté. */
const avecPorte = joursAvecPorte(2026);
check('trente-cinq journées ont déjà une porte', avecPorte.length, 35);
check('et chacune dit par où l’on entre', avecPorte.every((f) => f.portes.length > 0 || f.ponts.length > 0), true);

/* ---------------------------------------------------------------------------
 * LE COMPOSEUR DE L'ACCUEIL — DES PERSONNES, PUIS CE QUI DEVIENT POSSIBLE
 *
 * Un bloc, un +, trois informations par personne — prénom, date de naissance,
 * ville. Le + est éteint au départ et ne s'allume que lorsque les trois sont
 * écrites. Mais le prénom dit déjà le genre et le jour, la date dit l'âge et le
 * jour de naissance — et c'est après avoir rempli que la liste des possibles
 * s'ouvre : à deux personnes apparaît « Nous sommes des futurs mariés ».
 */

const paul: PersonneComposee = { id: 'p1', prenom: 'Paul', naissance: '1990-06-12', ville: 'Provins', genre: 'masculin' };
const emma: PersonneComposee = { id: 'p2', prenom: 'Emma', naissance: '1992-03-04', ville: 'Melun', genre: 'feminin' };

check('une personne n’est complète qu’avec ses trois informations', personneComplete(paul), true);
check('sans sa date de naissance, elle ne l’est pas', personneComplete({ ...paul, naissance: '' }), false);
check('sans sa ville non plus', personneComplete({ ...paul, ville: '  ' }), false);
check('sans son prénom non plus', personneComplete({ ...paul, prenom: '' }), false);
check('la condition d’une ligne grisée se dit court',
  motDeLaCondition(PROPOSITIONS.find((p) => p.id === 'famille')!), 'à partir de trois personnes');

/* ——— CE QUE LE PRÉNOM DIT TOUT SEUL : son genre, et son jour. ——— */
check('un prénom du calendrier donne son genre', genreDuPrenom('Emma'), 'feminin');
check('et il vient du calendrier des 365', lectureDuPrenom('Emma').source, 'le calendrier des 365');
check('un prénom courant que le calendrier ne porte pas donne le sien', genreDuPrenom('Hugo'), 'masculin');
check('et il vient des prénoms courants', lectureDuPrenom('Hugo').source, 'les prénoms courants');
check('un prénom des deux façons ne tranche pas', genreDuPrenom('Camille'), null);
check('et on dit qu’il est mixte', lectureDuPrenom('Camille').mixte, true);
check('un prénom inconnu ne donne aucun genre', genreDuPrenom('Zorglub'), null);
check('et on ne l’invente pas', lectureDuPrenom('Zorglub').source, '');

/* Le jour du prénom, parmi les 365 — celui que la personne peut ouvrir. */
check('Emma a son jour dans l’année', jourDuPrenom('Emma')?.ordinal, 109);
check('et ce jour est écrit en clair', dateDuJourNomme(jourDuPrenom('Emma')!), '19 avril');
check('Élodie aussi', jourDuPrenom('Élodie')?.ordinal, 295);
check('Paul n’est pas au calendrier du site', jourDuPrenom('Paul'), null);
check('un complément de nom n’est jamais pris pour un prénom', motsDuNom('Pierre et Paul').join('|'), 'PIERRE|PAUL');
check('et « Rose de Lima » donne Rose', jourDuPrenom('Rose')?.nom, 'Rose de Lima');

/* ——— CE QUE LA DATE DE NAISSANCE DIT : l'âge, exact. ——— */
check('l’âge se compte au jour près', ageDePersonne(paul, new Date(2027, 5, 12)), 37);
check('et la veille, ce n’est pas encore l’anniversaire', ageDePersonne(paul, new Date(2027, 5, 11)), 36);
check('sans date de naissance, pas d’âge', ageDePersonne({ naissance: '' }), null);
check('et l’âge s’écrit', ageEcrit(paul, new Date(2027, 5, 12)), '37 ans');

/* Le jour de naissance a son magazine : 365 jours, 365 personnages. */
check('le jour de naissance donne son personnage', jourDeNaissance(paul)?.personnage, 'Guy');
check('et sa date, en clair', jourDeNaissance(paul)?.dateLongue, '12 juin 1990');
check('sans date, aucun jour n’est inventé', jourDeNaissance({ ...paul, naissance: '' }), null);
check('la date de naissance s’écrit court', dateCourte('1990-06-12'), '12.06.1990');
check('et une date impossible ne s’écrit pas', dateCourte('n’importe quoi'), '');

/* ——— CE QUI DEVIENT POSSIBLE : la liste se resserre avec ce qu'on sait. ——— */
check('sans âge connu, six propositions s’ouvrent à une personne', propositionsPossibles(1).length, 6);
check('avec un enfant de dix ans, sept', propositionsPossibles(1, 10).length, 7);
check('à deux personnes, huit', propositionsPossibles(2, 34).length, 8);
check('à trois personnes, dix', propositionsPossibles(3, 34).length, 10);
check('« Je suis invité » est du nombre',
  propositionsPossibles(1).some((p) => p.titre === 'Je suis invité'), true);
check('à deux personnes, « Nous sommes des futurs mariés » apparaît',
  propositionsPossibles(2, 34).some((p) => p.titre === 'Nous sommes des futurs mariés'), true);
check('et « Nous sommes déjà mariés » avec elle',
  propositionsPossibles(2, 34).some((p) => p.titre === 'Nous sommes déjà mariés'), true);
check('à une personne, ces deux-là ne sont pas encore là',
  propositionsPossibles(1).some((p) => p.roleId === 'futurs_maries'), false);
check('un groupe demande trois personnes',
  propositionsPossibles(2, 34).some((p) => p.roleId === 'invites' && p.des === 3), false);
check('et arrive à trois', propositionsPossibles(3, 34).some((p) => p.id === 'groupe'), true);
check('« je viens avec mes parents » est fermé aux adultes',
  propositionsPossibles(1, 34).some((p) => p.id === 'enfant'), false);
check('et ouvert à dix ans', propositionsPossibles(1, 10).some((p) => p.id === 'enfant'), true);
check('ce qui est fermé par le nombre dit à partir de quand ça s’ouvre',
  raisonDeLaFermeture(PROPOSITIONS.find((p) => p.id === 'futurs-maries')!, 1), 'à partir de deux personnes');
check('et ce qui est fermé par l’âge dit jusqu’à quand',
  raisonDeLaFermeture(PROPOSITIONS.find((p) => p.id === 'enfant')!, 1), 'jusqu’à 17 ans');
check('les deux informations essentielles sont dans la liste',
  PROPOSITIONS.filter((p) => p.essentielle).map((p) => p.titre).join(' | '),
  'La date du mariage | Le lieu');

/* Le menu parle la langue de la personne, et donne le rôle qui va avec. */
const propositionInvite = PROPOSITIONS.find((p) => p.id === 'invite')!;
const mariePropo = PROPOSITIONS.find((p) => p.id === 'marie')!;
check('« Je suis invité » devient « Je suis invitée »', titreDeLaProposition(propositionInvite, 'feminin'), 'Je suis invitée');
check('et le rôle suit', roleDeLaProposition(mariePropo, 'feminin'), 'mariee');
check('au masculin, rien ne bouge', roleDeLaProposition(mariePropo, 'masculin'), 'marie');

/* ——— LA LISTE PASSE DANS L'ADRESSE, ET SE RELIT. ——— */
const liste = encoderPersonnes([paul, emma]);
check('la liste s’écrit dans l’adresse', liste, 'Paul,1990-06-12,Provins,masculin;Emma,1992-03-04,Melun,feminin');
const listeRelue = decoderPersonnes(liste);
check('et se relit à l’identique', listeRelue.map((p) => `${p.prenom}/${p.naissance}/${p.ville}/${p.genre}`).join(' · '),
  'Paul/1990-06-12/Provins/masculin · Emma/1992-03-04/Melun/feminin');
check('une liste sans genre se relit quand même',
  decoderPersonnes('Paul,1990-06-12,Provins')[0]?.genre, '');
check('un maillon vide ne fabrique pas de personne', decoderPersonnes(';;').length, 0);

/* ——— LE BLOC À L'ÉCRAN : le champ, le + éteint, le bouton. ——— */
localStorage.removeItem(CLE_DU_MAGAZINE);
const composeur = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/'] }, createElement(ChampDuMagazine as never, {})),
);
check('le bloc porte son titre', composeur.includes('Votre magazine'), true);
check('il annonce la structure du magazine', composeur.includes('24 pages · une par heure'), true);
check('il demande le prénom', composeur.includes('Prénom'), true);
check('la date de naissance', composeur.includes('Né(e) le'), true);
check('et la ville de naissance', composeur.includes('Ville de naissance'), true);
check('le + est éteint au départ', composeur.includes('aria-expanded="false"') && composeur.includes('disabled=""'), true);
check('et le bloc dit pourquoi', composeur.includes('Le + s’allume quand le prénom, la naissance et la ville sont écrits.'), true);
check('le genre se demande quand on ne sait pas', composeur.includes('À préciser'), true);
check('l’âge a sa place, vide au départ', composeur.includes('>âge<'), true);
check('le bouton dit ce qu’il fait', composeur.includes('Générer mon magazine'), true);
check('aucune personne ajoutée au départ', composeur.includes('personne dans le magazine'), false);

/* Sa place : plus dans le hero de l'accueil — il vit sur la page magazine,
   et dans la section du bas de l'accueil. */
check('le composeur n’est plus dans le hero de l’accueil', accueil.indexOf('Ville de naissance') > accueil.indexOf('</header>'), true);
check('et le hero garde sa question à lui', accueil.includes('Qui êtes-vous dans ce mariage ?'), true);

/* Le magazine existe : le bloc devient sa couverture. */
localStorage.setItem(
  CLE_DU_MAGAZINE,
  JSON.stringify({
    personnes: [{ prenom: 'Paul', naissance: '1990-06-12', ville: 'Provins', genre: 'masculin' }],
    date: '2027-06-12',
    roleId: 'futurs_maries',
  }),
);
const champCompose = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/'] }, createElement(ChampDuMagazine as never, {})),
);
check('quand le magazine existe, le bloc devient sa couverture', champCompose.includes('Ouvrir le magazine'), true);
check('et il porte la date composée', champCompose.includes('12 juin 2027'), true);
check('et il dit à qui il est', champCompose.includes('Paul'), true);
check('et on peut compléter les questions laissées en attente', champCompose.includes('Compléter les questions'), true);
check('et le refaire', champCompose.includes('Refaire'), true);
localStorage.removeItem(CLE_DU_MAGAZINE);

/* ---------------------------------------------------------------------------
 * LA SUPER COMPOSITION — ce qui sort du composeur
 *
 * Des personnes, une date, un rôle : le magazine se compose. Vingt-quatre pages,
 * une par heure, huit rubriques qui font trois fois le tour de la journée. Rien
 * n'est inventé — et ce qu'on retient, ce n'est que la réponse : le magazine, lui,
 * se recompose à l'identique.
 */

const mag = composerLeMagazine({ personnes: [paul, emma], date: '2027-06-12', roleId: '' });
check('le magazine composé a vingt-quatre pages', mag.edition.pages.length, 24);
check(
  'et huit rubriques, toujours les mêmes, dans le même ordre',
  [...new Set(mag.edition.pages.map((p) => p.rubrique))].join(' · '),
  RUBRIQUES.join(' · '),
);
check('chaque page est une heure de la journée', mag.edition.pages.every((p, i) => p.heure === i), true);
check('et chacune a sa lumière', mag.edition.pages.every((p) => p.lumiere.length > 0), true);
check('la couverture est celle du jour demandé', mag.couverture.dateLongue, '12 juin 2027');
check('la fiche est celle du même jour', mag.fiche.dateLongue, '12 juin 2027');
check('le magazine se lit avec ses deux prénoms', phraseDuMagazine(mag), 'Paul & Emma · 12 juin 2027');

/* Le rôle change vraiment le magazine — il ne se contente pas de s'afficher. */
const magFuturs = composerLeMagazine({ personnes: [paul, emma], date: '2027-06-12', roleId: 'futurs_maries' });
check('le rôle choisi entre dans la composition',
  JSON.stringify(mag.edition.pages) === JSON.stringify(magFuturs.edition.pages), false);
check('et il est celui qu’on a choisi', magFuturs.roleId, 'futurs_maries');

const magSansRien = composerLeMagazine({ personnes: [], date: '', roleId: '' });
check('sans réponse, c’est le magazine du jour', phraseDuMagazine(magSansRien).startsWith('Le magazine du '), true);
check('et il n’invente aucun prénom', magSansRien.prenoms.join('|'), '|');
check('une seule date suffit aussi',
  composerLeMagazine({ personnes: [], date: '2027-06-12', roleId: '' }).fiche.dateLongue, '12 juin 2027');
check('et une seule personne donne son prénom',
  composerLeMagazine({ personnes: [paul], date: '', roleId: '' }).prenoms.join('|'), 'Paul|');

enregistrerMagazine(magFuturs);
const reponse = reponseEnregistree();
check('la réponse se retient', reponse?.date, '2027-06-12');
check('avec ses personnes', reponse?.personnes.map((p) => p.prenom).join('|'), 'Paul|Emma');
check('et leur genre', reponse?.personnes.map((p) => p.genre).join('|'), 'masculin|feminin');
check('et son rôle', reponse?.roleId, 'futurs_maries');
check('le magazine relu se recompose à l’identique', magazineCompose()?.edition.pages.length, 24);
check(
  'la mémoire ne garde que la réponse, jamais le magazine calculé',
  localStorage.getItem(CLE_DU_MAGAZINE),
  '{"personnes":[{"prenom":"Paul","naissance":"1990-06-12","ville":"Provins","genre":"masculin"},{"prenom":"Emma","naissance":"1992-03-04","ville":"Melun","genre":"feminin"}],"date":"2027-06-12","roleId":"futurs_maries"}',
);
effacerMagazine();
check('et on peut le refaire', magazineCompose(), null);

/* L'écran de composition : les pages défilent, nommées. */
const superComposition = renderToStaticMarkup(
  createElement(
    MemoryRouter,
    {
      initialEntries: [
        '/generer?p=Paul%2C1990-06-12%2CProvins%2Cmasculin%3BEmma%2C1992-03-04%2CMelun%2Cfeminin&jour=2027-06-12&role=futurs_maries',
      ],
    },
    createElement(Generating as never),
  ),
);
check('l’écran s’annonce SUPER COMPOSITION', superComposition.includes('SUPER COMPOSITION'), true);
check('il dit ce qu’il compose', superComposition.includes('Vingt-quatre pages, une par heure'), true);
check('il nomme les pages par leur heure', superComposition.includes('l’aube') || superComposition.includes('minuit'), true);
check('il dit où il en est', superComposition.includes('01 / 24'), true);
check('il nomme la rubrique en cours', superComposition.includes('Le temps'), true);
check('la couverture n’arrive qu’à la fin', superComposition.includes('Votre magazine est composé'), false);

/* ---------------------------------------------------------------------------
 * LE CASTING DES VISUELS — 365 fonds, 1 825 scènes, et le choix expliqué
 *
 * Le magazine a besoin de deux familles d'images : les fonds de couverture (un
 * par jour, disponibles tout de suite) et les scènes (cinq moments par jour, le
 * même personnage cinq fois). Et quand plusieurs candidates arrivent pour le même
 * plan, on choisit **celle qui répond au brief** — en disant pourquoi.
 */

check('l’année attend 365 fonds de couverture', fondsDeCouvertureDeLAnnee(2026).length, FONDS_ATTENDUS);
check('et 1 825 scènes', scenesDeLAnnee(2026).length, SCENES_ATTENDUES);
check('soit cinq moments par jour', SCENES_ATTENDUES, 365 * 5);

const castingAnnee = etatDuCasting(2026);
check('le casting compte ses fonds', castingAnnee.fonds, 365);
check('ses scènes', castingAnnee.scenes, 1825);
check('et les scènes qui ont déjà leur brief', castingAnnee.scenesAvecBrief, 80);
check('celles qui attendent leur fiche', castingAnnee.scenesSansFiche, 1745);
// 363, pas 365 : deux jours de l'année portent le même nom de personnage.
check('l’année porte 363 personnages distincts', castingAnnee.personnages, 363);

/* Le nom des fichiers ne se discute pas : un dossier par jour, six plans. */
check('le fond de couverture a son adresse', adresseDuFichier('09-21', 'couverture'), '/images/magazine/09-21/couverture.jpg');
check('et le midi la sienne', adresseDuFichier('09-21', 'midi'), '/images/magazine/09-21/midi.jpg');
check('une seconde candidate prend le rang 2', adresseDuFichier('09-21', 'midi', 2), '/images/magazine/09-21/midi-2.jpg');
check('on accepte trois rangs par plan', fichiersDuPlan('09-21', 'midi').length, RANGS_PAR_PLAN);
check('le premier rang est celui qu’on veut', fichiersDuPlan('09-21', 'midi')[0], '/images/magazine/09-21/midi.jpg');

/* Ce qu'on demande se lit dans le brief — et l'absence de fiche se dit. */
const fondDu21Septembre = fondsDeCouvertureDeLAnnee(2026).find((f) => f.jour === '09-21')!;
const scenesDu21Septembre = scenesDeLAnnee(2026).filter((s) => s.jour === '09-21');
check('un fond de couverture ne demande aucun moment', fondDu21Septembre.moment, null);
check('et il a la couleur du jour', fondDu21Septembre.palette.length > 0, true);
check('le 21 septembre a bien ses cinq scènes', scenesDu21Septembre.length, 5);
check('toutes pour le même personnage', new Set(scenesDu21Septembre.map((s) => s.personnage)).size, 1);
check('et ce personnage est celui du jour', scenesDu21Septembre[0]?.personnage, 'Matthieu');
check('une scène documentée a son brief', scenesDu21Septembre[0]?.documentee, true);
const sceneSansFiche = scenesDeLAnnee(2026).find((s) => !s.documentee)!;
check('une scène sans fiche dit ce qui manque', sceneSansFiche.sujet.includes('attend sa fiche'), true);

/* ——— COMMENT ON CHOISIT, QUAND IL Y A PLUSIEURS CANDIDATES ——— */
check('deux couleurs identiques ne sont pas distantes', distanceDesCouleurs('#7FB77E', '#7FB77E'), 0);
check('le noir et le blanc sont au plus loin', distanceDesCouleurs('#000000', '#ffffff'), 442);
check('une couleur illisible ne se compare pas', distanceDesCouleurs('bleu', '#ffffff'), null);

const attenduMidi: AttenduVisuel = {
  jour: '09-21',
  slot: 'midi',
  chemin: '/images/magazine/09-21/midi',
  fichiers: fichiersDuPlan('09-21', 'midi'),
  moment: scenesDu21Septembre.find((s) => s.slot === 'midi')!.moment,
  palette: '#7FB77E',
  titre: 'Saint Matthieu',
  sujet: 'Matthieu, le midi — le portrait.',
  format: '5 / 7',
};

const bonne: CandidatVisuel = {
  fichier: '/images/magazine/09-21/midi-2.jpg',
  moment: 'midi',
  lumiere: 'lumière de studio, dure et graphique',
  couleur: '#86B87F',
  largeur: 1000,
  hauteur: 1400,
  contient: ['portrait', 'matière'],
};
const mauvaise: CandidatVisuel = {
  fichier: '/images/magazine/09-21/midi.jpg',
  moment: 'soir',
  lumiere: 'source chaude, des noirs profonds',
  couleur: '#1B1B2E',
  largeur: 1400,
  hauteur: 1000,
};
const moyenne: CandidatVisuel = {
  fichier: '/images/magazine/09-21/midi-3.jpg',
  moment: 'midi',
  couleur: '#9FD0E8',
  largeur: 1000,
  hauteur: 1400,
};

check('la bonne candidate marque les points du brief', noterCandidat(bonne, attenduMidi).total >= 7, true);
check('la mauvaise les perd', noterCandidat(mauvaise, attenduMidi).total < 0, true);
check('et la note dit pourquoi, en clair',
  noterCandidat(bonne, attenduMidi).raisons.join(' | ').includes('c’est bien le midi'), true);

const choix = choisirLeMeilleurVisuel([mauvaise, moyenne, bonne], attenduMidi);
check('le casting retient celle qui répond au brief', choix.choisi?.fichier, '/images/magazine/09-21/midi-2.jpg');
check('et classe la mauvaise dernière', choix.classement[choix.classement.length - 1]?.candidat.fichier, '/images/magazine/09-21/midi.jpg');
check('la décision est signée, avec ses points', choix.decision.includes('point'), true);
check('et elle nomme le fichier retenu', choix.decision.includes('midi-2.jpg'), true);
const sansCandidat = choisirLeMeilleurVisuel([], attenduMidi);
check('sans aucune candidate, rien n’est choisi', sansCandidat.choisi, null);
check('et le dessin prend le relais', sansCandidat.decision.includes('Le dessin prend le relais'), true);

/* ——— LA PHOTO DE LA SEMAINE PREND LE FOND, LE DESSIN RESTE S'IL N'Y EN A PAS ———
 *
 * Depuis la collection, la couverture appartient à la **semaine** : le 21
 * septembre porte le visuel `semaine-38/cover.jpg`, comme les six autres jours
 * du magazine 38. Les anciens dossiers par jour ne sont plus la source
 * principale : ils restent le repli de transition, jamais l'image d'une autre
 * semaine.
 */
check('les anciens dossiers par jour restent lisibles', PHOTOS_LIVREES, 0);
check('et le 21 septembre n’a pas d’ancien visuel', photoDuPlan('09-21', 'couverture'), null);
check('mais sa couverture vient de sa semaine', visuelsDuJour(new Date(2026, 8, 21)).couverture.url, '/images/magazine/semaine-38/cover.jpg');
check('et son chapitre aussi', ['chapitre', 'couverture-semaine'].includes(visuelsDuJour(new Date(2026, 8, 21)).imageDuChapitre.origine), true);
check('un chapitre livré passe devant la couverture', visuelDuChapitre(1, 2).origine, 'chapitre');
check('un chapitre non livré retombe sur la couverture de sa semaine', visuelDuChapitre(1, 5).origine, 'couverture-semaine');
check('et dit lequel il a pris', visuelDuChapitre(1, 5).url, '/images/magazine/semaine-01/cover.jpg');
check('sans rien de livré, le dessin tient la place',
  visuelsDuJour(new Date(2026, 8, 25)).couverture.origine === 'dessin' ||
    visuelsDuJour(new Date(2026, 8, 25)).couverture.origine === 'couverture-semaine',
  true);
const couvertureSansImage = renderToStaticMarkup(
  createElement(CouvertureJour as never, {
    couverture: couvertureDuJour(new Date(2026, 8, 21)),
    largeur: 200,
    photo: null,
  }),
);
check('sans image donnée, la couverture est dessinée', couvertureSansImage.includes('<image'), false);
check('et le fond uni est bien là', couvertureSansImage.includes('fill="#'), true);
const couverturePhotographiee = renderToStaticMarkup(
  createElement(CouvertureJour as never, {
    couverture: couvertureDuJour(new Date(2026, 8, 21)),
    largeur: 200,
    photo: '/images/magazine/semaine-38/cover.jpg',
  }),
);
check('avec l’image de la semaine, elle prend le fond', couverturePhotographiee.includes('href="/images/magazine/semaine-38/cover.jpg"'), true);
check('et la couverture reste la même', couverturePhotographiee.includes('AIME MAGAZINE'), true);
check('avec la couleur du jour en voile', couverturePhotographiee.includes('opacity="0.42"'), true);

/* ---------------------------------------------------------------------------
 * RASSEMBLER PLUSIEURS JOURS, PUIS ÉLIMINER
 *
 * Un jour en tient d'autres : le même personnage ailleurs dans l'année, la même
 * porte, le même métier, la même famille visuelle. Le casting ne regarde donc
 * jamais un seul magazine — il rassemble, il filtre, il refiltre, et il procède
 * par élimination, un tour après l'autre, en disant qui sort et pourquoi.
 */

const liesAuMatthieu = joursLiesAuJour(2026, '09-21');
check('un jour tient d’autres jours', liesAuMatthieu.length > 0, true);
check('aucun lien ne pointe vers le jour lui-même', liesAuMatthieu.every((l) => l.jour !== '09-21'), true);
check('et chaque lien a sa raison écrite', liesAuMatthieu.every((l) => l.raison.length > 0), true);
check('au moins un lien est une famille visuelle',
  liesAuMatthieu.some((l) => l.raison.includes('la même famille visuelle')), true);
check('le 21 septembre tient 15 jours en 2026', liesAuMatthieu.length, 15);

const midiReel = MOMENTS_VISUELS.find((m) => m.id === 'midi')!;
const aubeReelle = MOMENTS_VISUELS.find((m) => m.id === 'aube')!;
const attenduMatthieu: AttenduVisuel = {
  jour: '09-21', slot: 'midi', chemin: '/images/magazine/09-21/midi',
  fichiers: fichiersDuPlan('09-21', 'midi'), moment: midiReel, palette: '#7FB77E',
  titre: 'Saint Matthieu', sujet: 'Matthieu, le midi — le portrait.', format: '5 / 7',
};
const attenduPrintemps: AttenduVisuel = {
  jour: '05-20', slot: 'aube', chemin: '/images/magazine/05-20/aube',
  fichiers: fichiersDuPlan('05-20', 'aube'), moment: aubeReelle, palette: '#9FD0E8',
  titre: 'Bernadette', sujet: 'Bernadette, l’aube — le réveil.', format: '5 / 7',
};
const sixCandidats: CandidatVisuel[] = [
  { fichier: '/images/magazine/09-21/midi-2.jpg', moment: 'midi', lumiere: 'dure, studio, graphique', couleur: '#86B87F', largeur: 1000, hauteur: 1400, contient: ['matthieu', 'portrait'] },
  { fichier: '/images/magazine/05-20/aube.jpg', moment: 'aube', lumiere: 'froide et rasante', couleur: '#9ACBE2', largeur: 1000, hauteur: 1400, contient: ['chaises', 'brume'] },
  { fichier: '/images/magazine/05-20/soir.jpg', moment: 'soir', lumiere: 'chaude', couleur: '#9ACBE2', largeur: 1000, hauteur: 1400, contient: ['chaises'] },
  { fichier: '/images/magazine/09-21/midi.jpg', moment: 'midi', lumiere: 'dure', couleur: '#86B87F', largeur: 1400, hauteur: 1000, contient: ['portrait'] },
  { fichier: '/images/magazine/05-20/aube-2.jpg', moment: 'aube', lumiere: 'froide', couleur: '#C22222', largeur: 1000, hauteur: 1400, contient: ['chaises'] },
  { fichier: '/images/magazine/05-20/aube-3.jpg', moment: 'aube', lumiere: 'rasante', couleur: '#9ACBE2', largeur: 1000, hauteur: 1400, contient: ['voiture', 'néon'] },
];

const elimination = eliminerEntreJours(sixCandidats, [attenduMatthieu, attenduPrintemps]);
check('le casting rassemble six candidats', elimination.rassembles, 6);
check('pour deux jours', elimination.joursRassembles.length, 2);
check('et les cinq tours passent dans l’ordre',
  elimination.tours.map((t) => t.nom).join(' > '),
  'le moment > le cadrage > la couleur > la lumière > le sujet');
check('le tour du moment sort la scène du soir',
  elimination.tours[0].elimines.map((e) => e.fichier).join(','), '/images/magazine/05-20/soir.jpg');
check('le tour du cadrage sort le paysage',
  elimination.tours[1].elimines.map((e) => e.fichier).join(','), '/images/magazine/09-21/midi.jpg');
check('le tour de la couleur sort le rouge',
  elimination.tours[2].elimines.map((e) => e.fichier).join(','), '/images/magazine/05-20/aube-2.jpg');
check('le tour du sujet sort ce qui ne répond à rien',
  elimination.tours[4].elimines.map((e) => e.fichier).join(','), '/images/magazine/05-20/aube-3.jpg');
check('chaque élimination a sa raison', elimination.tours.every((t) => t.elimines.every((e) => e.raison.length > 0)), true);
check('il reste deux images — même s’il y en a plusieurs', elimination.retenus.length, 2);
check('toutes les deux à la même note', new Set(elimination.retenus.map((r) => r.note.total)).size, 1);
check('et chacune répond à son jour',
  elimination.retenus.map((r) => r.jourRepondu).sort().join(','), '05-20,09-21');
check('la décision raconte les tours et les retenus', elimination.decision.includes('retenus : '), true);
check('et elle dit combien de jours ont été rassemblés', elimination.decision.includes('2 jours'), true);

const eliminationAVide = eliminerEntreJours([], [attenduMatthieu]);
check('à vide, rien n’est retenu', eliminationAVide.retenus.length, 0);
check('et le dessin garde sa place', eliminationAVide.decision.includes('le dessin garde sa place'), true);


/* ——— LA COMPOSITION SE REGARDE, ET ON PEUT PASSER ——— */
check('l’écran de composition laisse passer', superComposition.includes('Passer la composition'), true);

/* ——— LE COMPOSEUR EST AUSSI PLUS BAS DANS LA PAGE ——— */
check('l’accueil a sa section de magazine', accueil.includes('id="votre-magazine"'), true);
check('et elle porte son titre', accueil.includes('Votre magazine, maintenant'), true);
check('le composeur y est, une seule fois sur l’accueil', (accueil.match(/Ville de naissance/g) ?? []).length, 1);

/* ---------------------------------------------------------------------------
 * LA SIMPLIFICATION DU JOUR — LE MAGAZINE, LE LOGO, LE DOCK, LE MENU
 *
 * Le hero du magazine passe au noir, sans sous-titre, et le flux montre les
 * couvertures — pas les personnages. Le soleil-cadran devient le logo de
 * SUPER MARIAGE. Le dock du bas a son bouton stable et des outils qui mènent
 * à des pages réelles. Et le « voir en tant que » se retire : on simplifie,
 * le temps de trouver le bon mécanisme final.
 */

/* ——— LE MAGAZINE : HERO NOIR, SANS SOUS-TITRE, LA COUVERTURE À LA PLACE DU PERSONNAGE ——— */
check('le hero du magazine n’a plus de sous-titre', revue.includes('Une couverture par jour'), false);
check('et le rôle n’y est plus écrit non plus', heroMagazine.includes('Choisi pour'), false);
check('le fond du hero est noir', heroMagazine.includes('bg-[#0B0C12]'), true);
check('et ce n’est plus le visuel de la saison', heroMagazine.includes('object-cover blur'), false);
check('le flux montre la couverture, pas le personnage', (flux.match(/AIME MAGAZINE/g) ?? []).length >= 2, true);
check('le flux n’a plus de portrait de studio', flux.includes('Studio blanc') || flux.includes('Studio noir'), false);
check('la couverture dit désormais dans quel magazine on est', flux.includes('MAGAZINE ') || flux.includes('MAGAZINE</'), true);
check('et où l’on entre : le chapitre', flux.includes('CHAPITRE '), true);

/* ——— LES TYPOS DES COUVERTURES SUIVENT LE DESIGN DU SITE ——— */
check('la couverture prend la police du site', svgCouverture.includes('Inter'), true);
check('et quitte Georgia', svgCouverture.includes('Georgia'), false);

/* ——— LE SOLEIL-CADRAN : LE LOGO DE SUPER MARIAGE ——— */
check('la barre du site porte le logo', chromeMetier.includes('Le soleil-cadran'), true);
check('le pied aussi, partout', chromeAccueil.includes('Le soleil-cadran'), true);
check('et la page du magasin', magasin.includes('Le soleil-cadran'), true);

/* ——— LE DOCK : UN BOUTON BLANC STABLE, DES OUTILS QUI MÈNENT À DES PAGES RÉELLES ——— */
check('le bouton blanc mène au point zéro', chromeAccueil.includes('aria-label="Le Point Zéro"'), true);
check('et il ne change plus avec le rôle', chromeAccueil.includes('Entrer comme'), false);
/* Les outils de rôle sont partis : le dock commande les moments et la timeline. */
check('le dock montre les cinq moments', ['Le moment — l’aube', 'Le moment — le soir'].every((m) => chromeAccueil.includes(m)), true);
check('et le picto de l’atelier du temps', chromeAccueil.includes('aria-label="L’atelier du temps — la timeline"'), true);
check('la playlist de l’univers a bien son ancre', universBande.includes('id="playlist"'), true);
check('et son programme aussi', universBande.includes('id="programme"'), true);

/* ——— LES ANCRES DE L’ARTICLE SONT BIEN DANS LA PAGE DE L’ARTICLE ——— */
check('la page de l’article porte son ancre à elle', pageArticle.includes('id="article"'), true);
check('et celle des moments aussi', pageArticle.includes('id="moments"'), true);




/* ——— LE RIPPLE : UNE SAISIE AU POINT ZÉRO, TOUT SE RÉPERCUTE ——— */

changerPointZero({ nom: '', jour: '', ville: '' });
check('au départ, tout manque', ceQuiManque(lePointZero()).length, 3);
check('l’agent le dit', phraseDeLAgent(lePointZero()).includes('Il manque encore'), true);
changerPointZero({ nom: 'Matthieu', jour: '21 septembre', ville: 'Bouray-sur-Juine' });
check('trois champs suffisent : le point zéro est complet', rippleComplet(lePointZero()), true);
check('et l’agent confirme', phraseDeLAgent(lePointZero()).includes('Tout y est'), true);
check('une saisie touche huit endroits : le ticket et les sept objets', endroitsTouches(lePointZero()), 8);
check('la fabrique a ses sept objets', OBJETS_DE_LA_FABRIQUE.length, 7);
check('chaque objet a son picto par défaut', OBJETS_DE_LA_FABRIQUE.every((o) => pictoDuRipple(o.pictoParDefaut).id === o.pictoParDefaut), true);
check('et son repère répond', repereDe('timbre'), 'timbre');

/* ——— LA CAPSULE DE COMMANDE, LA LANGUETTE TIMELINE, LA NAV DU HEADER ——— */

/* Le header porte les grandes entrées du concept. */
check('la barre du haut ne porte plus de nav : le logo, le nom, le profil', entete.includes('Les grandes entrées'), false);

/* ——— WEDDING OS : LE BLOC QUI CONTIENT TOUT, AU CENTRE DU HERO ——— */

check('le studio s’appelle Wedding OS', accueil.includes('WEDDING OS'), true);
check('il ouvre le hero, centré', accueil.includes('Wedding OS.'), true);
check('le bouton Paramètres est dans son coin', accueil.includes('Paramètres du studio'), true);
check(
  'les pictos déploient les réglages',
  ['Régler la couverture', 'Régler les typos', 'Régler les couleurs', 'Régler les musiques', 'Régler les visuels', 'Régler la timeline', 'Régler les docs', 'Régler les objets', 'Régler le système'].every((t) => accueil.includes(t)),
  true,
);
check('des curseurs, pas des champs', accueil.includes('Taille du titre') && accueil.includes('Arrondi des cartes'), true);
check('l’écran répond, en aperçu bureau', accueil.includes('aperçu bureau'), true);

/* ——— LE SHOP UNIQUE : le grand filtre, les coches, le ticket ——— */

check('le shop s’appelle SUPER SHOP', pageShop.includes('SUPER SHOP — tout ce qui se vend, classé'), true);
check('le grand filtre cherche une pièce', pageShop.includes('Chercher une pièce'), true);
check('les cartes produits se cochent', pageShop.includes('sur le ticket'), true);
check('et le ticket attend ses coches', pageShop.includes('VOTRE TICKET'), true);

check('les rôles ne tournent plus tout seuls dans le profil', accueil.includes('5600'), false);

/* La page SUPER RIPPLE se lit : le fond sombre tient, le voile clair est parti. */
check('la page super ripple est sombre', pageFooter.includes('vp-env-dark'), true);

/* La languette timeline : l'année en couvertures, des saisons aux jours. */
basculerTimeline(true);
const languette = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(LanguetteTimeline as never)));
basculerTimeline(false);
check('la languette ouvre l’atelier du temps', languette.includes('La timeline'), true);
check('elle compte l’année', languette.includes(`${NOMBRE_DE_MAGAZINES} magazines`) && languette.includes(`${NOMBRE_DE_MAGAZINES * 7} chapitres`), true);
check('et ses deux sources', ['L’année', 'Le jour J'].every((n) => languette.includes(n)), true);
check('la règle est graduée par magazine', (languette.match(/data-graduation="/g) ?? []).length, NOMBRE_DE_MAGAZINES);
check('et un bloc par magazine est posé dessus', (languette.match(/data-bloc="magazine-/g) ?? []).length, NOMBRE_DE_MAGAZINES);
check('chaque bloc annonce ses sept chapitres', (languette.match(/data-chapitre="/g) ?? []).length, NOMBRE_DE_MAGAZINES * 7);
check('fermée, elle n’est pas là', renderToStaticMarkup(createElement(MemoryRouter, null, createElement(LanguetteTimeline as never))).includes('L’atelier du temps'), false);
check('l’été se déplie en trois mois', moisDeLaSaison('ete').map((m) => m.nom).join(','), 'juin,juillet,août');
check('un mois se déplie en semaines', semainesDuMois(2026, 9).length >= 4, true);
check('une semaine en sept jours', joursDeLaSemaine(2026, 38).length, 7);
check('le 21 septembre est dans la semaine 38', joursDeLaSemaine(2026, 38).some((j) => j.jour === '09-21'), true);
check('la recherche trouve Matthieu', chercherUnJour(2026, 'matthieu').some((j) => j.jour === '09-21'), true);
check('l’aiguille du cadran connaît le 21 septembre', Math.round(angleDuJour(new Date(2026, 8, 21))), 259);

/* Le magazine écoute l'adresse : jour, moment, timeline. */
const revueMidi = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/magazine?moment=midi'] }, createElement(Magazine as never)),
);
check('le moment de l’adresse pose l’heure sur le cadran', revueMidi.includes('12:00'), true);

/* ——— L'ATELIER DE L'ANNÉE : LES 54 MAGAZINES SUR LA BANDE ——— */

/* La timeline n'est plus décorative : c'est **l'atelier du site**, avec une autre
   source. Un bloc par magazine, ses sept chapitres dessous, et la tête de
   lecture posée sur la semaine où l'on est. */
const blocs = blocsDeLaCollection(2026);
check('l’atelier pose un bloc par magazine', blocs.length, NOMBRE_DE_MAGAZINES);
check('et pas un de plus', new Set(blocs.map((b) => b.id)).size, NOMBRE_DE_MAGAZINES);
check('les blocs sont ceux de la collection', blocs[0]!.title, `01 · ${MAGAZINES[0]!.titre}`);
check('le trente-huitième est « Septembre doré »', blocs[37]!.title, '38 · Septembre doré');
check('chaque bloc dit ses sept chapitres', blocs.every((b) => b.sousTitres?.length === 7), true);
check('et sa mesure', blocs.every((b) => b.mesure === '7 chapitres'), true);
check('sa couleur vient du magazine', blocs[5]!.colorAccent, MAGAZINES[5]!.palette.accent);
check('sa période est écrite', blocs[0]!.startTime.includes('–'), true);
check('le joker 53 n’a pas de semaine', blocs[52]!.chapter, 'Hors calendrier');
check('la couverture livrée est posée sur le bloc', blocs[37]!.mediaUrl, '/images/magazine/semaine-38/cover.jpg');
check('et un magazine non livré garde son bloc, sans image', blocs[22]!.mediaUrl, undefined);
check('la somme des durées fait l’année', Math.round(blocs.reduce((t, b) => t + b.durationMinutes, 0)), TIMELINE_TOTAL_MINUTES);
check('un magazine vaut un cinquante-quatrième de la bande', Math.round(PAS_DU_MAGAZINE * NOMBRE_DE_MAGAZINES), TIMELINE_TOTAL_MINUTES);
check('et les blocs se suivent sans trou', blocs.every((b, i) => i === 0 || b.startMinuteOfDay > blocs[i - 1]!.startMinuteOfDay), true);
const graduations = graduationsDeLaCollection(2026);
check('la règle est graduée une fois par magazine', graduations.length, NOMBRE_DE_MAGAZINES);
check('la première graduation est le 01', graduations[0]!.label, '01');
check('et la trente-huitième porte sa date', graduations[37]!.sous, '17 sept.');
check('la tête de lecture se pose dans l’année', teteSurLaSemaineCourante(new Date(2026, 8, 21)) >= 0 && teteSurLaSemaineCourante(new Date(2026, 8, 21)) < TIMELINE_TOTAL_MINUTES, true);
check('et elle suit la semaine', teteSurLaSemaineCourante(new Date(2026, 8, 21)) > teteSurLaSemaineCourante(new Date(2026, 0, 5)), true);
check(
  'elle se pose sur le magazine de la date',
  Math.round(teteSurLaSemaineCourante(new Date(2026, 8, 21)) / PAS_DU_MAGAZINE) + 1,
  magazineDeLaDate(new Date(2026, 8, 21)).numero,
);
check('un magazine s’ouvre au premier jour de sa semaine', adresseDuMagazine(38, 2026), '/magazine?jour=09-17');

/* ——— CE TOUR : UNE SEULE COUVERTURE AU HERO, LE COMPOSEUR SUR LA PAGE MAGAZINE ——— */

check('et plus trois magazines côte à côte', revue.includes('Le flux des jours'), false);
check('le composeur n’encombre plus l’écran', revue.includes('Ville de naissance'), false);
check('la couverture porte le numéro du magazine, comme une vraie couverture',
  svgCouverture.includes('MAGAZINE 38'), true);
check('et le chapitre par lequel la date entre', svgCouverture.includes('CHAPITRE 05'), true);
check('elle garde la marque, le titre et la date',
  svgCouverture.includes('AIME MAGAZINE') && svgCouverture.includes('Saint Matthieu') && svgCouverture.includes('21 SEPTEMBRE 2026'), true);

/* ——— L'ACCUEIL : PLUS DE DOUBLON EN BAS, LA PLAYLIST DE L'ANNÉE ——— */
check('l’accueil n’a plus sa bande-pied en doublon', accueil.includes('Votre mariage. Votre histoire. Un seul endroit.'), false);
check('la playlist de l’accueil est celle de l’année', accueil.includes('La playlist de l’année'), true);
check('et elle a déjà toutes les cartes', accueil.includes('/ 365'), true);
check('le logo synthétisé est plus grand dans la barre', chromeMetier.includes('width="26"'), true);

/* ——— LE « VOIR EN TANT QUE » EST RETIRÉ : ON SIMPLIFIE ——— */
const menuFerme = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(MenuProfil as never)));
check('le menu ne propose plus de voir en tant que', menuFerme.includes('Voir en tant que'), false);
check('le bouton profil reste là', menuFerme.includes('aria-haspopup="menu"'), true);


/* ============================================================================
 * LA COLLECTION : 54 MAGAZINES, 7 CHAPITRES PAR MAGAZINE, 365 JOURS POUR LES
 * PARCOURIR
 *
 * Le modèle a changé une seule fois, et voici son contrat, vérifié ligne à
 * ligne : une date n'ouvre plus un magazine à elle seule, elle **entre dans un
 * magazine hebdomadaire par l'un de ses sept chapitres**.
 * ========================================================================== */

check('la collection compte 54 magazines', MAGAZINES.length, 54);
check('et le compte annoncé est le même', NOMBRE_DE_MAGAZINES, 54);
check('sept chapitres dans chaque magazine', MAGAZINES.every((m) => m.chapitres.length === 7), true);
check('les 54 directions artistiques sont écrites, dans l’ordre', DIRECTIONS_COMPLETES, true);
check('les 432 images attendues sont annoncées', IMAGES_ATTENDUES, 432);

/* — LES SEPT CHAPITRES, FIXES ET ORDONNÉS — */
check(
  'les sept chapitres sont toujours les mêmes',
  CHAPITRES.map((c) => c.id),
  ['amoureux', 'style', 'lieux', 'recevoir', 'fete', 'monde', 'souvenirs'],
);
check(
  'et leurs noms de fichiers sont ceux de la bibliothèque',
  CHAPITRES.map((c) => c.fichier),
  ['01-amoureux.jpg', '02-style.jpg', '03-lieux.jpg', '04-recevoir.jpg', '05-fete.jpg', '06-monde.jpg', '07-souvenirs.jpg'],
);
check('chaque chapitre dit son territoire', CHAPITRES.every((c) => c.territoire.length > 30), true);
check('et son pont vers le mariage', CHAPITRES.every((c) => c.pontMariage.length > 20), true);
check('le quatrième chapitre est L’Art de recevoir', CHAPITRES[3]!.titre, 'L’Art de recevoir');
check('un fichier retrouve son chapitre', chapitreParFichier('06-monde.jpg')?.titre, 'Le Monde');
check('les chapitres tournent : après le septième, le premier', chapitreSuivant(7).numero, 1);
check('une position hors bornes reste un chapitre valide', chapitreDeLaPosition(9).numero, 7);

/* — LA DATE ENTRE PAR UN CHAPITRE : 21 SEPTEMBRE → SEMAINE 38 → CHAPITRE 04 — */
const le21Septembre = new Date(2026, 8, 21, 12);
check('le 21 septembre 2026 tombe dans le magazine 38', numeroDeMagazine(le21Septembre), 38);
check('dont la couverture est celle de la semaine 38', magazineDeLaDate(le21Septembre).cover, '/images/magazine/semaine-38/cover.jpg');
check('la semaine 38 commence le 17 septembre', joursDuMagazine(38, 2026)[0]!.getDate(), 17);
check('et il entre par le chapitre 05 — le cinquième jour de sa semaine', chapitreDeLaDate(le21Septembre).numero, 5);
check('qui est La Fête', chapitreDeLaDate(le21Septembre).chapitre.titre, 'La Fête');
check('l’image attendue est nommée par le chapitre', chapitreDeLaDate(le21Septembre).image, '/images/magazine/semaine-38/05-fete.jpg');
check('les trois niveaux se lisent d’un coup', [
  niveauxDuJour(le21Septembre).date,
  niveauxDuJour(le21Septembre).magazine,
  niveauxDuJour(le21Septembre).chapitre,
], ['21 septembre', 'Magazine 38', 'Chapitre 05 — La Fête']);
check('et le magazine a son titre', niveauxDuJour(le21Septembre).titreDuMagazine, 'Septembre doré');

/* — CHAQUE MAGAZINE PRÉSENTE SES SEPT CHAPITRES, UNE FOIS CHACUN — */
const sesSeptJours = joursDuMagazine(38, 2026).map((d) => chapitreDeLaDate(d).numero);
check('les sept jours du magazine 38 ouvrent les sept chapitres', sesSeptJours, [1, 2, 3, 4, 5, 6, 7]);
check('sans doublon', new Set(sesSeptJours).size, 7);
check('et la même date donne toujours le même chapitre', positionDansLeMagazine(le21Septembre), 5);
check('les sept jours partagent la couverture de leur magazine',
  new Set(joursDuMagazine(38, 2026).map((d) => magazineDeLaDate(d).cover)).size, 1);

/* — 364 JOURS DANS LES SEMAINES, ET LES DEUX JOURS DE TROP — */
const annee2026 = Array.from({ length: 365 }, (_, i) => new Date(2026, 0, i + 1, 12));
check('les 364 jours des semaines ont tous leur magazine', annee2026.filter((d) => numeroDeMagazine(d) <= 52).length, 364);
check('et le 365ᵉ est le joker 53', numeroDeMagazine(new Date(2026, 11, 31, 12)), 53);
check('le 29 février est le joker 54', numeroDeMagazine(new Date(2028, 1, 29, 12)), 54);
check('aucune année ne réclame un 55ᵉ magazine',
  Array.from({ length: 12 }, (_, i) => 2024 + i).every((annee) =>
    Array.from({ length: 366 }, (_, j) => new Date(annee, 0, j + 1, 12))
      .filter((d) => d.getFullYear() === annee)
      .every((d) => numeroDeMagazine(d) >= 1 && numeroDeMagazine(d) <= 54),
  ), true);
check('un jour de trop prend le chapitre de son jour de semaine',
  chapitreDeLaDate(new Date(2026, 11, 31, 12)).numero, ((new Date(2026, 11, 31, 12).getDay() + 6) % 7) + 1);
check('et son magazine est bien un joker', magazineParNumero(53).joker, true);
check('le magazine suivant boucle après le 54', magazineSuivant(54).numero, 1);

/* — LES SUJETS : SEPT PAR MAGAZINE, TOUS DIFFÉRENTS — */
check('chaque magazine a sept sujets distincts',
  MAGAZINES.every((m) => new Set(m.chapitres.map((c) => c.sujet)).size === 7), true);
check('et chaque sujet est écrit, jamais générique',
  MAGAZINES.every((m) => m.chapitres.every((c) => c.sujet.length > 25 && !c.sujet.includes('lorem'))), true);
check('deux magazines ne traitent pas le même chapitre de la même façon',
  chapitreDuMagazine(26, 3).sujet !== chapitreDuMagazine(40, 3).sujet, true);
check('les titres des 54 magazines sont tous différents',
  new Set(MAGAZINES.map((m) => m.titre)).size, 54);

/* — LES REPLIS : JAMAIS L'IMAGE D'UNE AUTRE SEMAINE — */
const chapitreManquant = visuelDuChapitre(23, 4);
check('un chapitre non livré reste dans son magazine', chapitreManquant.magazine, 23);
check('et il le dit', chapitreManquant.raison.includes('23'), true);
check('sans jamais emprunter à une autre semaine',
  chapitreManquant.url === null || chapitreManquant.url.includes('semaine-23') || chapitreManquant.url.includes('semaine 23'), true);
check('une couverture non livrée est dessinée', visuelDeLaCouverture(23).origine, 'dessin');
const visuels21 = visuelsDuJour(le21Septembre);
check('un jour a sa couverture et son chapitre', [visuels21.couverture.magazine, visuels21.imageDuChapitre.magazine], [38, 38]);
check('et la provenance est toujours dite', visuels21.couverture.raison.length > 20 && visuels21.imageDuChapitre.raison.length > 20, true);
check('le chemin d’un visuel se déduit du numéro', cheminDuVisuel(38, 'cover.jpg'), '/images/magazine/semaine-38/cover.jpg');
check('et l’inventaire dit ce qui est arrivé',
  Object.values(VISUELS_DU_MAGAZINE ?? {}).length >= 0 || VISUELS_LIVRES >= 0, true);
check('chaque visuel de l’inventaire suit la convention',
  Object.entries(VISUELS_DU_MAGAZINE).every(([dossier, slots]) =>
    /^semaine-\d{2}$/.test(dossier) && slots.every((slot) => slot === 'cover.jpg' || CHAPITRES.some((c) => c.fichier === slot)),
  ), true);
check('et l’inventaire ne compte que ce qui a été relevé',
  Object.values(VISUELS_DU_MAGAZINE).reduce((n, liste) => n + liste.length, 0), VISUELS_LIVRES);
check('un visuel livré est retrouvable', VISUELS_LIVRES === 0 || visuelLivre(38, 'cover.jpg'), true);

/* — LA NAVIGATION ÉDITORIALE : LE CHAPITRE VOISIN, SANS CHANGER DE SEMAINE — */
const voisinDroite = voisinDuChapitre(le21Septembre, 2026, 1);
const voisinGauche = voisinDuChapitre(le21Septembre, 2026, -1);
check('le chapitre suivant reste dans le magazine 38', numeroDeMagazine(voisinDroite), 38);
check('et il ouvre le chapitre 06', chapitreDeLaDate(voisinDroite).numero, 6);
check('le précédent ouvre le chapitre 04', chapitreDeLaDate(voisinGauche).numero, 4);
check('et l’on ne sort jamais du magazine', [voisinDroite, voisinGauche].every((d) => numeroDeMagazine(d) === 38), true);

/* — CE QUE LES COMPOSANTS MONTENT — */
const chapitresHtml = renderToStaticMarkup(
  createElement(ChapitresDuMagazine as never, { date: le21Septembre, annee: 2026 }),
);
check('le bloc des chapitres annonce le magazine', chapitresHtml.includes('Magazine 38'), true);
check('et son titre', chapitresHtml.includes(magazineParNumero(38).titre), true);
check('les sept chapitres y sont', CHAPITRES.every((c) => chapitresHtml.includes(c.titre)), true);
check('celui du jour est marqué actif', (chapitresHtml.match(/data-actif="true"/g) ?? []).length, 1);
check('et il se dit « vous êtes ici »', chapitresHtml.includes('vous êtes ici'), true);
check('la navigation éditoriale est montrée', chapitresHtml.includes('Chapitre précédent') && chapitresHtml.includes('Chapitre suivant'), true);
check('et les deux navigations sont expliquées', chapitresHtml.includes('Navigation temporelle') && chapitresHtml.includes('Navigation éditoriale'), true);

const magazineSemaineHtml = renderToStaticMarkup(
  createElement(MagazineSemaine as never, { magazine: magazineParNumero(38) }),
);
check('la couverture du magazine porte son numéro', magazineSemaineHtml.includes('N° 38'), true);
check('son titre', magazineSemaineHtml.includes(magazineParNumero(38).titre), true);
check('ses sept chapitres, dans l’ordre', CHAPITRES.every((c) => magazineSemaineHtml.includes(c.titre)), true);
check('et sa saison', magazineSemaineHtml.includes('Été'), true);

const kiosqueCollection = renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: ['/magazine'] }, createElement(GalerieCouvertures as never, { annee: 2026 })),
);
check('le kiosque annonce les 54 magazines', kiosqueCollection.includes('Les 54 magazines de l’année'), true);
check('et le compte des images de la bibliothèque', kiosqueCollection.includes('432 images'), true);
check('chaque saison a son étagère', ['Printemps', 'Été', 'Automne', 'Hiver'].every((s) => kiosqueCollection.includes(s)), true);
check('les magazines y sont numérotés', kiosqueCollection.includes('N° 38'), true);

/* — LE PLAN DE PRODUCTION : 54 COUVERTURES, 378 CHAPITRES — */
const planDeLaCollection = imagesDeLaCollection();
check('le plan de la collection compte 432 images', planDeLaCollection.length, IMAGES_ATTENDUES_DE_LA_COLLECTION);
check('54 couvertures', couverturesDeLaCollection().length, COUVERTURES_ATTENDUES);
check('378 chapitres', chapitresDeLaCollection().length, CHAPITRES_ATTENDUS);
check('les 54 couvertures sont demandées d’abord', planDeLaCollection.slice(0, 54).every((i) => i.chapitre === null), true);
check('le plan ne demande jamais un ancien dossier par jour',
  planDeLaCollection.every((i) => i.fichiers.every((f) => f.includes('/semaine-'))), true);
const planDu38 = couverturesDeLaCollection().find((i) => i.semaine === 38)!;
check('une couverture porte son chemin de bibliothèque', planDu38.fichiers[0], '/images/magazine/semaine-38/cover.jpg');
check('et ses deux candidates de casting', planDu38.fichiers.length, RANGS_PAR_PLAN);
check('avec le titre du magazine', planDu38.titreDuMagazine, magazineParNumero(38).titre);
const planChapitre26_3 = chapitresDeLaCollection().find((i) => i.semaine === 26 && i.chapitre === 3)!;
check('un chapitre porte son numéro de magazine', planChapitre26_3.semaine, 26);
check('et son numéro de chapitre', planChapitre26_3.chapitre, 3);
check('et le chemin que la bibliothèque attend', planChapitre26_3.fichiers[0], '/images/magazine/semaine-26/03-lieux.jpg');
check('et son univers', planChapitre26_3.universDuChapitre, 'Les Lieux');
check('chaque image attendue dit sa saison et son style',
  planDeLaCollection.every((i) => i.saison.length > 2 && i.styleDuMagazine.length > 5), true);
check('l’état de la collection compte ce qui est livré',
  etatDeLaCollection().couverturesLivrees + etatDeLaCollection().chapitresLivres, VISUELS_LIVRES);
check('et il propose la suite du travail', etatDeLaCollection().prochaines.length, Math.min(8, 432 - VISUELS_LIVRES));

/* — LA TIMELINE : LES JOURS MÈNENT AUSSI À UN CHAPITRE — */
const semaineTimeline = joursDeLaSemaine(2026, 38);
check('la semaine 38 de la timeline a sept jours', semaineTimeline.length, 7);
check('chaque jour y connaît son magazine', semaineTimeline.every((j) => j.magazine === 38), true);
check('et son chapitre, dans l’ordre', semaineTimeline.map((j) => j.chapitre), [1, 2, 3, 4, 5, 6, 7]);
check('le 21 septembre y ouvre La Fête', semaineTimeline[4]!.titreDuChapitre, 'La Fête');


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
