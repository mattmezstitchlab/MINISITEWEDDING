import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, HelpCircle, ShoppingCart, X } from 'lucide-react';
import { GESTES_UNIVERSELS, useNavVerticale, type ActionNav } from '../lib/navVerticale';
import { usePersonaSurvolee } from '../lib/personaCourant';

/**
 * LA NAV VERTICALE — À DROITE, ET DIFFÉRENTE SUR CHAQUE PAGE
 *
 * Une capsule verticale, à droite de l'écran : **le Shop et le Magazine** en
 * haut (les deux portes du site, en blanc), puis **ce que la page propose** —
 * son article, son programme, sa playlist, ses pièces, de quoi créer sa carte.
 *
 * Chaque page pose ses actions (`enregistrerNavVerticale`), la capsule les
 * affiche. Le nom des actions s'écrit au survol, à gauche de la capsule ; un clic
 * descend vers la section, ou ouvre la page.
 *
 * **Les gestes sont les mêmes partout** : le survol nomme, le clic y va, le clic
 * droit (ou l'appui long) explique ce que ça fait — et le point d'interrogation,
 * en bas de la capsule, relit les gestes à tout moment. C'est ce qui la rend
 * universelle : on apprend une fois, on s'en sert partout.
 */

export default function NavVerticale() {
  const navigate = useNavigate();
  const actions = useNavVerticale();
  const survole = usePersonaSurvolee();
  const suite = survole ? `?role=${survole.id}` : '';
  /** Ce que le clic droit vient d'ouvrir : le détail d'une action, ou les gestes. */
  const [detail, setDetail] = useState<ActionNav | null>(null);
  const [gestes, setGestes] = useState(false);

  /** Une action : on descend vers son ancre, ou l'on va à sa page. */
  const agir = (action: ActionNav) => {
    if (action.ancre) {
      const el = document.getElementById(action.ancre);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    if (action.to) navigate(action.to);
  };

  return (
    <div className="pointer-events-none fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 sm:block">
      <div className="pointer-events-auto flex flex-col items-center gap-1 rounded-full border border-white/12 bg-[#0B0C12]/95 p-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        {/* Les deux portes du site — **au même dessin que les autres** : un
            rond blanc se lirait comme un état choisi, pas comme une porte. */}
        <Pastille label={survole ? `Le Shop de ${survole.nom}` : 'Le Shop'} icone={ShoppingCart} onClick={() => navigate(`/shop${suite}`)} />
        <Pastille label={survole ? `Le Magazine de ${survole.nom}` : 'Le Magazine'} icone={BookOpen} onClick={() => navigate(`/magazine${suite}`)} />

        {/* Ce que la page propose : sa nav à elle, et rien d'autre. */}
        {actions.length > 0 && <span className="my-0.5 h-px w-5 bg-white/15" aria-hidden="true" />}
        {actions.map((action) => {
          const Icone = action.icone;
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => agir(action)}
              onContextMenu={(e) => {
                e.preventDefault();
                setDetail((d) => (d?.id === action.id ? null : action));
              }}
              aria-label={action.label}
              className="group relative flex h-9 w-9 items-center justify-center rounded-full text-white/65 transition hover:bg-white/12 hover:text-white sm:h-10 sm:w-10"
            >
              <Icone size={16} />
              <span className="pointer-events-none absolute right-12 whitespace-nowrap rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0B0C12] opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                {action.label}
              </span>
            </button>
          );
        })}

        {/* Les gestes : un coup d'œil, et l'on sait comment tout se tient. */}
        {actions.length > 0 && <span className="my-0.5 h-px w-5 bg-white/15" aria-hidden="true" />}
        <button
          type="button"
          onClick={() => setGestes((g) => !g)}
          aria-label="Les gestes de la capsule"
          className="flex h-9 w-9 items-center justify-center rounded-full text-white/45 transition hover:bg-white/12 hover:text-white"
        >
          <HelpCircle size={15} />
        </button>
      </div>

      {/* LE DÉTAIL : ce que fait une action, dit en une phrase. */}
      {detail && (
        <div className="pointer-events-auto mt-2 w-[240px] rounded-[14px] border border-white/12 bg-[#0B0C12]/97 p-3 text-white shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[12.5px] font-semibold">{detail.label}</span>
            <button
              type="button"
              onClick={() => setDetail(null)}
              aria-label="Fermer le détail"
              className="text-white/40 transition hover:text-white"
            >
              <X size={13} />
            </button>
          </div>
          <p className="mt-1.5 text-[11.5px] leading-relaxed text-white/60">
            {detail.aide ?? 'Cette action mène à sa section, ou à sa page.'}
          </p>
          <p className="mt-2 font-mono text-[9.5px] uppercase tracking-wider text-white/35">
            {detail.ancre ? `Descend vers « ${detail.ancre} »` : 'Ouvre une page'}
          </p>
        </div>
      )}

      {/* LES GESTES : les mêmes sur tout le site. */}
      {gestes && (
        <div className="pointer-events-auto mt-2 w-[240px] rounded-[14px] border border-white/12 bg-[#0B0C12]/97 p-3 text-white shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[12.5px] font-semibold">Les gestes</span>
            <button
              type="button"
              onClick={() => setGestes(false)}
              aria-label="Fermer les gestes"
              className="text-white/40 transition hover:text-white"
            >
              <X size={13} />
            </button>
          </div>
          <dl className="mt-2 grid gap-1.5">
            {GESTES_UNIVERSELS.map((g) => (
              <div key={g.geste} className="flex gap-2">
                <dt className="w-[74px] shrink-0 font-mono text-[9.5px] uppercase tracking-wider text-white/40">
                  {g.geste}
                </dt>
                <dd className="text-[11.5px] leading-snug text-white/70">{g.fait}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}

/** Une pastille ronde de la capsule : un picto, et son nom au survol. */
function Pastille({
  label,
  icone: Icone,
  onClick,
}: {
  label: string;
  icone: typeof ShoppingCart;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group relative flex h-9 w-9 items-center justify-center rounded-full text-white/65 transition hover:bg-white/12 hover:text-white sm:h-10 sm:w-10"
    >
      <Icone size={16} />
      <span className="pointer-events-none absolute right-12 whitespace-nowrap rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0B0C12] opacity-0 shadow-md transition-opacity group-hover:opacity-100">
        {label}
      </span>
    </button>
  );
}
