import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CONVIVES,
  MAGASIN,
  PACKAGES,
  TICKET_COUPLE,
  euros,
  lignesDuTicket,
  numeroDeTicket,
  totalCaisse,
} from '../lib/superMariage';
import { FAMILLES, mondeDuMagasin, type Famille } from '../lib/grilleDuMonde';
import { heureDeLaCapsule } from '../lib/capsuleCommande';
import { lumiereDeLHeure, teinteDeLHeure } from '../lib/lumiereDuJour';
import { PLAYLIST_DEPART, morceauxDeLaPlaylist } from '../lib/weddingPlaylist';
import { planDj } from '../lib/weddingTicket';
import { formatDateLong } from '../lib/format';
import CadranDuMagazine from '../components/CadranDuMagazine';
import GrilleDuMonde from '../components/GrilleDuMonde';
import TicketCaisse, { type VarianteTicket } from '../components/TicketCaisse';

/* LA CAISSE — L'OBJET DU PRODUIT, ET LE TERRITOIRE AUTOUR
 *
 * Un seul écran, deux moitiés, et rien d'autre :
 *
 * - **le magasin** : le mariage entier en cases — chaque rayon est une porte,
 *   chaque article est une case qu'on prend d'un doigt ;
 * - **le ticket** : le papier, qui s'imprime tout seul au fur et à mesure. Le
 *   numéro, les barres, le tampon, le total : c'est un vrai calcul, pas une
 *   image.
 *
 * Trois choses font le reste, et elles existaient déjà dans le produit :
 *
 * 1. **l'heure** — la lumière de la pièce et le cadran suivent le moment du
 *    jour ; le ticket est horodaté à cette heure-là ;
 * 2. **le regard** — la même caisse donne quatre papiers différents selon qui
 *    regarde (public, invités, famille, privé). Les cases invisibles pour ce
 *    regard **disparaissent de la grille** : la grille est l'interface des
 *    droits, et le ticket n'imprime que ce qui est visible ;
 * 3. **l'adresse** — le caddie tient dans le lien. On envoie son reçu, on ouvre
 *    le même ticket. Rien d'autre n'est nécessaire.
 *
 * Enfin, le même papier porte les quatre moments du mariage : le récap du
 * couple, le reçu d'un invité, la playlist du DJ, le bon de commande d'un
 * métier. C'est **le même composant** — et c'est pour ça que le ticket est le
 * cœur du produit : c'est la seule chose que tout le monde tient dans la main.
 */

/** Les quatre papiers du même rouleau. */
const PAPIERS: Array<{ id: VarianteTicket; mot: string }> = [
  { id: 'couple', mot: 'le couple' },
  { id: 'invite', mot: 'un invité' },
  { id: 'dj', mot: 'le DJ' },
  { id: 'metier', mot: 'un métier' },
];

/** L'ordre des regards : du plus ouvert au plus fermé. */
const REGARDS: Famille[] = ['public', 'invites', 'famille', 'prive'];

/** Ce que le caddie contient, et sous quel regard on le regarde. */
function caddieDeLAdresse(valeur: string | null): string[] {
  return (valeur ?? '').split(',').map((id) => id.trim()).filter(Boolean);
}

function regardDeLAdresse(valeur: string | null): Famille {
  return REGARDS.includes(valeur as Famille) ? (valeur as Famille) : 'prive';
}

export default function LaCaisse() {
  const [params, setParams] = useSearchParams();
  const monde = mondeDuMagasin();

  /** **Le caddie, et le regard** : les deux seuls états, et ils tiennent dans l'adresse. */
  const [caddie, setCaddie] = useState<string[]>(() => caddieDeLAdresse(params.get('caddie')));
  const [regard, setRegard] = useState<Famille>(() => regardDeLAdresse(params.get('regard')));
  const [papier, setPapier] = useState<VarianteTicket>('couple');
  const [menu, setMenu] = useState<string | null>(null);
  const [echelle, setEchelle] = useState(0.62);
  /** Sur un téléphone, le papier se déplie ; sur un écran large, il est toujours là. */
  const [deplie, setDeplie] = useState(false);
  const [avis, setAvis] = useState<string | null>(null);

  /** L'heure qu'il est — la même capsule que partout ailleurs dans le produit. */
  const [heure] = useState(() => Math.floor(heureDeLaCapsule()));
  const lumiere = lumiereDeLHeure(heure);
  const accent = monde.cases.find((c) => c.id === 'caisse')?.couleur ?? '#C9A227';

  /* Le caddie et le regard écrivent dans l'adresse : le lien EST le reçu. */
  useEffect(() => {
    const suite = new URLSearchParams(params);
    suite.set('caddie', caddie.join(','));
    suite.set('regard', regard);
    setParams(suite, { replace: true });
    // On ne suit que le caddie et le regard : l'adresse est la sortie, pas l'entrée.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caddie, regard]);

  const avisUnMot = (mot: string) => {
    setAvis(mot);
    window.setTimeout(() => setAvis(null), 2200);
  };

  /* ——————————————— CE QUE LE REGARD LAISSE VOIR ——————————————— */

  const rangDuRegard = REGARDS.indexOf(regard);
  const visible = (famille: Famille) => REGARDS.indexOf(famille) <= rangDuRegard;
  /** Les lignes invisibles pour ce regard : elles quittent la grille, aussi. */
  const masquees = monde.cases.filter((c) => !visible(c.famille)).map((c) => c.id);

  /* ——————————————————— LE TICKET, CALCULÉ ——————————————————— */

  const lignes = lignesDuTicket(caddie, menu).filter((l) => visible(monde.cases.find((c) => c.id === `ligne-${l.id}`)?.famille ?? 'public'));
  const total = totalCaisse(lignes.map((l) => l.id), menu);
  const numero = numeroDeTicket(lignes.map((l) => l.id), menu);
  const morceaux = morceauxDeLaPlaylist(PLAYLIST_DEPART);
  const plan = planDj(morceaux, []);

  const prendre = (id: string) => {
    if (!id.startsWith('ligne-')) return;
    const ligne = id.replace('ligne-', '');
    setCaddie((actuel) => (actuel.includes(ligne) ? actuel.filter((a) => a !== ligne) : [...actuel, ligne]));
  };

  const adresseDuRecu = () => {
    const suite = new URLSearchParams({ caddie: caddie.join(','), regard });
    return `${window.location.origin}${window.location.pathname}?${suite.toString()}`;
  };

  const magasin = { ...MAGASIN, caisse: MAGASIN.caisse };

  return (
    <div
      data-page="caisse"
      data-magasin={MAGASIN.nom}
      data-caddie={caddie.length}
      data-regard={regard}
      data-papier={papier}
      className="fixed inset-0 overflow-hidden text-white"
      style={{ background: teinteDeLHeure(heure, '#0B0C12', accent) }}
    >
      {/* ————————————————— LE MAGASIN : LA GRILLE DES RAYONS ————————————————— */}
      <div className="absolute inset-0 z-10 md:right-[440px]" data-magasin-grille="vrai">
        <GrilleDuMonde
          monde={monde}
          echelle={echelle}
          onEchelle={setEchelle}
          onOuvrir={(kase) => prendre(kase.id)}
          selection={caddie.map((id) => `ligne-${id}`)}
          onSelection={(ids) => setCaddie(ids.map((id) => id.replace('ligne-', '')))}
          masquees={masquees}
          barreSelection={false}
        />
      </div>

      {/* ————————————————— LA LIGNE DU HAUT : L'HEURE, ET LE REGARD ————————————————— */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-3 md:pr-[456px]">
        <span className="flex items-center gap-2">
          <CadranDuMagazine
            heure={heure}
            chapitre={Math.min(7, Math.floor(heure / 3.43) + 1)}
            fond="rgba(11,12,18,0.5)"
            encre="#F3F1ED"
            accent={accent}
            vignette
            className="h-9 w-9"
          />
          <span className="flex flex-col" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/85">{MAGASIN.nom}</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/45">
              {MAGASIN.rayon} · {CONVIVES} convives · {lumiere.mot ?? `${heure} H`}
            </span>
          </span>
        </span>

        <span data-regards="vrai" className="pointer-events-auto flex items-center gap-2">
          {REGARDS.map((f) => {
            const marque = FAMILLES.find((x) => x.id === f)!;
            return (
              <button
                key={f}
                type="button"
                data-regard-mot={f}
                data-actif={regard === f ? 'true' : 'false'}
                title={marque.mot}
                onClick={() => setRegard(f)}
                className={`font-mono text-[13px] leading-none transition ${
                  regard === f ? 'text-[#7DE2B0]' : 'text-white/35 hover:text-white/80'
                }`}
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}
              >
                {marque.marque}
              </button>
            );
          })}
        </span>
      </div>

      {/* ————————————————— LE PAPIER ————————————————— */}
      <aside
        data-papier="caisse"
        className={`absolute inset-x-0 bottom-0 z-30 max-h-[86svh] overflow-y-auto overscroll-contain border-t border-white/10 bg-[#0B0C12]/85 px-4 pb-6 pt-3 backdrop-blur-md transition-transform md:inset-y-0 md:left-auto md:right-0 md:w-[440px] md:max-h-none md:translate-y-0 md:border-l md:border-t-0 ${
          deplie ? 'translate-y-0' : 'translate-y-[calc(100%-3.25rem)]'
        }`}
      >
        {/* Sur un téléphone : le ticket se déplie d'un doigt. */}
        <button
          type="button"
          onClick={() => setDeplie((d) => !d)}
          className="flex w-full items-center justify-between gap-3 pb-3 md:hidden"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/80">
            le ticket · {lignes.length} ligne{lignes.length > 1 ? 's' : ''}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#7DE2B0]">
            {euros(total.total)} {deplie ? '▾' : '▴'}
          </span>
        </button>

        {/* Les quatre papiers du même rouleau. */}
        <div data-papiers="vrai" className="mb-3 hidden flex-wrap items-center gap-2 md:flex">
          {PAPIERS.map((p) => (
            <button
              key={p.id}
              type="button"
              data-papier-mot={p.id}
              data-actif={papier === p.id ? 'true' : 'false'}
              onClick={() => setPapier(p.id)}
              className={`font-mono text-[10px] uppercase tracking-[0.18em] transition ${
                papier === p.id ? 'text-[#7DE2B0]' : 'text-white/40 hover:text-white'
              }`}
            >
              {p.mot}
            </button>
          ))}
        </div>

        <TicketCaisse
          variante={papier}
          magasin={magasin}
          couple={TICKET_COUPLE}
          numero={numero}
          dateLabel={formatDateLong(TICKET_COUPLE.date)}
          heureLabel={`${String(heure).padStart(2, '0')}:00`}
          paye={lignes.length > 0}
          lignes={lignes}
          total={total}
          nom={papier === 'invite' ? 'Un invité' : papier === 'metier' ? MAGASIN.rayon : undefined}
          sousTitre={papier === 'metier' ? 'Rayon 7' : undefined}
          plan={papier === 'dj' ? plan : []}
          nbMorceaux={papier === 'dj' ? morceaux.length : 0}
          nbDemandes={0}
        />

        {/* ——————————— LES MENUS, ET CE QU'ON FAIT DU PAPIER ——————————— */}
        <div className="mx-auto mt-4 flex w-full max-w-[420px] flex-col gap-3">
          <div data-menus="vrai" className="flex flex-wrap items-center gap-1.5">
            {PACKAGES.map((formule) => (
              <button
                key={formule.id}
                type="button"
                data-menu={formule.id}
                data-actif={menu === formule.id ? 'true' : 'false'}
                onClick={() => setMenu((m) => (m === formule.id ? null : formule.id))}
                className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                  menu === formule.id
                    ? 'border-[#7DE2B0] text-[#7DE2B0]'
                    : 'border-white/20 text-white/55 hover:border-white/50 hover:text-white'
                }`}
              >
                {formule.name} · {euros(formule.prix)}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              data-action="envoyer"
              onClick={() => {
                void navigator.clipboard?.writeText(adresseDuRecu());
                avisUnMot('le reçu est dans le lien');
              }}
              className="border border-white/20 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70 transition hover:border-white/50 hover:text-white"
            >
              envoyer le reçu
            </button>
            <button
              type="button"
              data-action="imprimer"
              onClick={() => window.print()}
              className="border border-white/20 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70 transition hover:border-white/50 hover:text-white"
            >
              imprimer
            </button>
            <button
              type="button"
              data-action="vider"
              onClick={() => {
                setCaddie([]);
                setMenu(null);
              }}
              className="border border-white/20 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40 transition hover:border-white/50 hover:text-white"
            >
              vider le caddie
            </button>
          </div>

          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/30">
            {MAGASIN.nom} · {MAGASIN.slogan} · tarifs indicatifs, aucun paiement réel
          </p>
        </div>
      </aside>

      {avis && (
        <span
          data-avis="caisse"
          className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 border border-white/15 bg-[#0B0C12]/90 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/80 backdrop-blur-md"
        >
          {avis}
        </span>
      )}
    </div>
  );
}
