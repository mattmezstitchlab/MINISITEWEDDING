import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  AVERTISSEMENT_PROFILS, NIVEAUX, REGLE_DES_PROFILS, genreDuJour, pontsParNiveau, profilDuJour,
  type Niveau, type Pont,
} from '../lib/profilsEditoriaux';

/**
 * LE PROFIL DU JOUR — LA PORTE D'ENTRÉE
 *
 * La couverture dit le jour ; le profil dit **qui l'ouvre**. Une fiche (origine,
 * époque, lieu, métier, savoir-faire, culture), puis les **ponts vers le
 * mariage**, chacun avec son niveau : documenté, culturel, éditorial, ou
 * assumé comme une pure inspiration.
 *
 * Rien n'est inventé : un jour sans fiche **le dit**, et garde son nom du
 * calendrier.
 */

const STYLE_NIVEAU: Record<Niveau, string> = {
  directe: 'bg-[#0B0C12] text-white',
  culturelle: 'border border-black/25 text-black/70',
  editoriale: 'border border-dashed border-black/30 text-black/60',
  inspiration: 'bg-black/5 italic text-black/55',
};

function ChipNiveau({ niveau }: { niveau: Niveau }) {
  const def = NIVEAUX.find((n) => n.id === niveau)!;
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.16em] ${STYLE_NIVEAU[niveau]}`}
      title={def.sens}
    >
      {def.nom}
    </span>
  );
}

function Ponts({ ponts }: { ponts: Pont[] }) {
  return (
    <ul className="mt-5 grid gap-3">
      {ponts.map((pont) => (
        <li key={`${pont.niveau}-${pont.mot}`} className="rounded-[16px] border border-black/8 bg-white px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <ChipNiveau niveau={pont.niveau} />
            <span className="text-[14px] font-bold tracking-tight">{pont.mot}</span>
          </div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-black/60">
            {pont.texte}
            {pont.vers && (
              <Link to={pont.vers} className="ml-2 inline-flex items-center gap-1 font-semibold text-black/75 no-underline hover:text-black">
                voir <ArrowRight size={12} />
              </Link>
            )}
          </p>
        </li>
      ))}
    </ul>
  );
}

const LIGNES_FICHE: Array<{ cle: 'origine' | 'epoque' | 'lieu' | 'metier' | 'savoirFaire' | 'culture'; label: string }> = [
  { cle: 'origine', label: 'Origine' },
  { cle: 'epoque', label: 'Époque' },
  { cle: 'lieu', label: 'Lieu' },
  { cle: 'metier', label: 'Métier' },
  { cle: 'savoirFaire', label: 'Savoir-faire' },
  { cle: 'culture', label: 'Culture' },
];

export default function ProfilEditorial({ date = new Date() }: { date?: Date }) {
  const jour = profilDuJour(date);
  const genre = genreDuJour(date);
  const groupe = jour.profil ? pontsParNiveau(jour.profil) : [];
  const mot = genre === 'sainte' ? 'Sainte' : genre === 'fete' ? 'Le jour des' : 'Saint';

  return (
    <section id="profil" className="border-t border-black/8 bg-[#F7F6F3] py-14">
      <div className="vp-page">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45">Le profil du jour</span>
        <h2 className="vp-title mt-2 text-[26px] sm:text-[34px]">{jour.personnage}</h2>
        <p className="mt-2 max-w-[760px] font-mono text-[10.5px] uppercase tracking-[0.18em] text-black/45">
          {jour.entree}
        </p>

        {jour.profil ? (
          <>
            <p className="mt-4 max-w-[820px] text-[13.5px] leading-relaxed text-black/60">
              {mot} {jour.personnage}, {jour.profil.fiche.epoque.toLowerCase()} — {jour.dateLongue}. La couverture du
              jour porte son nom ; voici sa fiche, et par où elle touche le mariage.
            </p>

            <div className="mt-6 grid gap-x-8 gap-y-4 border-y border-black/10 py-6 sm:grid-cols-2 lg:grid-cols-3">
              {LIGNES_FICHE.map(({ cle, label }) => (
                <div key={cle}>
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-black/40">{label}</span>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-black/75">{jour.profil!.fiche[cle]}</p>
                </div>
              ))}
            </div>

            {groupe.map(({ niveau, ponts }) => (
              <div key={niveau.id} className="mt-8">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h3 className="text-[15px] font-bold tracking-tight">{niveau.nom}</h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/40">{niveau.sens}</span>
                </div>
                <Ponts ponts={ponts} />
              </div>
            ))}

            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-black/40">
              Source : {jour.profil.source}.
            </p>
          </>
        ) : (
          <>
            <p className="mt-4 max-w-[820px] text-[13.5px] leading-relaxed text-black/60">
              {mot} {jour.personnage} — {jour.dateLongue}. Sa fiche n’est pas encore documentée : le jour garde son nom
              du calendrier, sa couverture, sa carte et sa lumière, et{' '}
              <strong className="font-bold text-black/75">rien d’autre n’est écrit</strong>.
            </p>
            <p className="mt-6 rounded-[16px] border border-dashed border-black/15 px-4 py-5 text-[13px] leading-relaxed text-black/50">
              Un profil s’écrit à partir de sources, jamais de mémoire. Les jours qui attendent leur fiche sont la
              réserve de travail du magazine : ils s’ouvriront quand on aura vérifié, pas avant.
            </p>
          </>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3 rounded-[18px] border border-black/8 bg-white px-5 py-4">
          <p className="min-w-[280px] flex-1 text-[13px] leading-relaxed text-black/60">
            {REGLE_DES_PROFILS} {AVERTISSEMENT_PROFILS}
          </p>
          <Link to="/le-mariage" className="vp-btn vp-btn-glass vp-press">
            Ses univers <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
