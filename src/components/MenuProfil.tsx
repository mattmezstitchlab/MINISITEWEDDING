import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen, Check, ChevronRight, CircleHelp, Contrast, Download, Eye, House, Inbox,
  LogOut, Settings, User, Users,
} from 'lucide-react';
import { AIDE_PROFIL, MENU_PROFIL, SORTIE_PROFIL, rolesDuMenu, type ItemDeMenu } from '../lib/menuProfil';
import { definirPersonaCourant, usePersonaCourante } from '../lib/personaCourant';

/**
 * LE BOUTON PROFIL — TOUT PART DE LÀ
 *
 * À droite de la barre, une seule chose : **le profil**. C'est lui qui ouvre le
 * menu du site — le vôtre — et c'est par lui qu'on **choisit son rôle**, et
 * qu'on regarde le site **en tant que quelqu'un d'autre**.
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
  const navigate = useNavigate();
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

  /** Prendre un rôle : le site devient le sien, partout. */
  const prendreLeRole = (id: string) => {
    definirPersonaCourant(id);
    setOuvert(false);
    navigate('/');
  };

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

          <Separateur />

          {/* VOIR EN TANT QUE : on prend un rôle, et l'on devient lui. */}
          <div className="flex items-center gap-3 px-4 pb-2 pt-3">
            <Eye size={16} className="text-white/55" />
            <span className="text-[13.5px] text-white/85">Voir en tant que</span>
          </div>
          <div className="px-4 pb-3">
            {rolesDuMenu().map(({ titre, roles }) => (
              <div key={titre.id} className="mt-2 first:mt-0">
                <div className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-white/40">
                  {titre.nom}
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => prendreLeRole(role.id)}
                      aria-pressed={role.id === moi.id}
                      className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11.5px] transition ${
                        role.id === moi.id
                          ? 'border-white/60 bg-white text-[#1F1F1E]'
                          : 'border-white/12 text-white/75 hover:border-white/40 hover:text-white'
                      }`}
                    >
                      {role.id === moi.id && <Check size={11} />}
                      {role.nom.replace('SUPER ', '')}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Separateur />

          {MENU_PROFIL.map((item) => (
            <Lien key={item.label} item={item} onSuivre={() => setOuvert(false)} />
          ))}

          <Separateur />

          {AIDE_PROFIL.map((item) => (
            <Lien key={item.label} item={item} onSuivre={() => setOuvert(false)} />
          ))}

          <Separateur />

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              definirPersonaCourant('maries');
              setOuvert(false);
              navigate(SORTIE_PROFIL.to);
            }}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13.5px] text-white/85 transition hover:bg-white/8"
          >
            <LogOut size={16} className="text-white/55" />
            {SORTIE_PROFIL.label}
          </button>
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
