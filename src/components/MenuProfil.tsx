import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, ChevronRight, CircleHelp, Contrast, Download, House, Inbox,
  LogOut, Settings, User, Users,
} from 'lucide-react';
import { AIDE_PROFIL, MENU_PROFIL, SORTIE_PROFIL, type ItemDeMenu } from '../lib/menuProfil';
import { definirPersonaCourant, usePersonaCourante } from '../lib/personaCourant';

/**
 * LE BOUTON PROFIL — TOUT PART DE LÀ
 *
 * À droite de la barre, une seule chose : **le profil**. C'est lui qui ouvre le
 * menu du site — le vôtre. On a simplifié : le « voir en tant que » est parti,
 * le temps de trouver le bon mécanisme final — le composeur porte l'essentiel.
 *
 * Les portes du Shop et du Magazine, elles, ne sont plus dans la barre : la nav
 * verticale les porte, sur toutes les pages, et elles suivent le rôle survolé.
 */

/** Les pictos du menu, par leur nom. */
const PICTOS: Record<string, typeof User> = {
  profil: User,
  boite: Inbox,
  reglages: Settings,
  apparence: Contrast,
  aide: CircleHelp,
  doc: BookOpen,
  communaute: Users,
  telecharger: Download,
  accueil: House,
  sortie: LogOut,
};

export default function MenuProfil() {
  const moi = usePersonaCourante();
  const [ouvert, setOuvert] = useState(false);
  const boite = useRef<HTMLDivElement>(null);

  /** On ferme en cliquant à côté, ou avec Échap : un menu, pas une page. */
  useEffect(() => {
    if (!ouvert) return;
    const surClic = (e: MouseEvent) => {
      if (!boite.current?.contains(e.target as Node)) setOuvert(false);
    };
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOuvert(false);
    };
    document.addEventListener('mousedown', surClic);
    document.addEventListener('keydown', surTouche);
    return () => {
      document.removeEventListener('mousedown', surClic);
      document.removeEventListener('keydown', surTouche);
    };
  }, [ouvert]);

  return (
    <div ref={boite} className="relative">
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={ouvert}
        aria-label={`Profil — ${moi.nom}`}
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/40 bg-black/40 text-white shadow-[0_6px_18px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:scale-105"
      >
        <img src={moi.image} alt="" className="h-full w-full object-cover" />
      </button>

      {ouvert && (
        <div
          role="menu"
          className="absolute right-0 top-11 max-h-[74vh] w-[292px] overflow-y-auto rounded-[18px] border border-white/10 bg-[#1F1F1E]/97 text-white shadow-[0_28px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl"
        >
          {/* Qui est là : son visage, son nom, et le rôle qu'il tient. */}
          <div className="flex items-center gap-3 px-4 py-3.5">
            <img src={moi.image} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
            <div className="min-w-0">
              <div className="truncate text-[14px] font-semibold">{moi.nom}</div>
              <div className="truncate text-[11px] text-white/50">{moi.titre}</div>
            </div>
          </div>

          {/* Le « voir en tant que » est retiré : on simplifie, le temps de
              trouver le bon mécanisme final. */}
          <Separateur />

          {MENU_PROFIL.map((item) => (
            <Lien key={item.label} item={item} onSuivre={() => setOuvert(false)} />
          ))}

          <Separateur />

          {AIDE_PROFIL.map((item) => (
            <Lien key={item.label} item={item} onSuivre={() => setOuvert(false)} />
          ))}

          <Separateur />

          <Link
            to={SORTIE_PROFIL.to}
            role="menuitem"
            onClick={() => {
              definirPersonaCourant('maries');
              setOuvert(false);
            }}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13.5px] text-white/85 no-underline transition hover:bg-white/8"
          >
            <LogOut size={16} className="text-white/55" />
            {SORTIE_PROFIL.label}
          </Link>
        </div>
      )}
    </div>
  );
}

function Separateur() {
  return <div className="h-px bg-white/10" />;
}

/** Une ligne du menu : son picto, son mot, et ce qu'elle annonce à droite. */
function Lien({ item, onSuivre }: { item: ItemDeMenu; onSuivre: () => void }) {
  const Icone = PICTOS[item.icone] ?? ChevronRight;
  return (
    <Link
      role="menuitem"
      to={item.to}
      onClick={onSuivre}
      className="flex items-center gap-3 px-4 py-2.5 text-[13.5px] text-white/85 no-underline transition hover:bg-white/8"
    >
      <Icone size={16} className="text-white/55" />
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8C3A3A] px-1.5 font-mono text-[10.5px] font-bold text-white">
          {item.badge}
        </span>
      )}
      {item.raccourci && <span className="font-mono text-[11px] text-white/40">{item.raccourci}</span>}
      {item.fleche && <ChevronRight size={15} className="text-white/40" />}
    </Link>
  );
}
