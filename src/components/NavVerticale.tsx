import { useNavigate } from 'react-router-dom';
import { BookOpen, ShoppingCart } from 'lucide-react';
import { useNavVerticale, type ActionNav } from '../lib/navVerticale';
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
 */

export default function NavVerticale() {
  const navigate = useNavigate();
  const actions = useNavVerticale();
  const survole = usePersonaSurvolee();
  const suite = survole ? `?role=${survole.id}` : '';

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
        {/* Les deux portes du site, en blanc : le Shop, le Magazine. */}
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
      </div>
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
      className="group relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0B0C12] shadow-[0_6px_16px_rgba(0,0,0,0.45)] transition hover:scale-105 sm:h-10 sm:w-10"
    >
      <Icone size={16} />
      <span className="pointer-events-none absolute right-12 whitespace-nowrap rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0B0C12] opacity-0 shadow-md transition-opacity group-hover:opacity-100">
        {label}
      </span>
    </button>
  );
}
