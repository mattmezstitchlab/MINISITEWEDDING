import { useEffect, useRef, useState } from 'react';
import {
  BookOpen, CalendarRange, FileText, Image, Music2, Palette, Pause, Play, Ruler, Settings,
  Stamp, Type,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import LogoSuperMariage from './LogoSuperMariage';
import {
  GARDABLES_OS, MORCEAUX_OS, PALETTE_OS, VISUELS_OS, basculerGarderOS, contrasteWCAG,
  reglerOS, useReglagesOS,
} from '../lib/weddingOS';
import { usePointZero } from '../lib/ripple';
import { pictoDuRipple, PICTOS_DU_RIPPLE, OBJETS_DE_LA_FABRIQUE } from '../lib/ripple';
import { SAISONS } from '../lib/jeuDeCartes';

/**
 * WEDDING OS — LE BLOC QUI CONTIENT TOUT
 *
 * Un studio blanc, posé au centre du hero : des pictos, et les champs qui se
 * déplient selon ce qu'on touche. Des curseurs, une palette avec pipette, le
 * contraste affiché comme un vrai design system, et **l'écran** : l'aperçu du
 * magazine qui répond à chaque réglage, en Bureau, iPad ou Mobile. En haut à
 * droite, le bouton Paramètres : sombre ou clair, ce qu'on garde, et
 * l'accessibilité.
 */

type OngletOS =
  | 'couverture' | 'typos' | 'couleurs' | 'musiques' | 'visuels'
  | 'timeline' | 'docs' | 'objets' | 'systeme';

const ONGLETS_OS: Array<{ id: OngletOS; nom: string; Icone: LucideIcon }> = [
  { id: 'couverture', nom: 'La couverture', Icone: BookOpen },
  { id: 'typos', nom: 'Les typos', Icone: Type },
  { id: 'couleurs', nom: 'Les couleurs', Icone: Palette },
  { id: 'musiques', nom: 'Les musiques', Icone: Music2 },
  { id: 'visuels', nom: 'Les visuels', Icone: Image },
  { id: 'timeline', nom: 'La timeline', Icone: CalendarRange },
  { id: 'docs', nom: 'Les docs', Icone: FileText },
  { id: 'objets', nom: 'Les objets', Icone: Stamp },
  { id: 'systeme', nom: 'Le système', Icone: Ruler },
];

export default function WeddingOS() {
  const reglages = useReglagesOS();
  const point = usePointZero();
  const [onglet, setOnglet] = useState<OngletOS>('couverture');
  const [parametres, setParametres] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [enLecture, setEnLecture] = useState<string | null>(null);

  useEffect(() => () => audioRef.current?.pause(), []);

  const sombre = reglages.theme === 'sombre';
  /** Les tons du bloc, selon son thème. */
  const ton = {
    carte: sombre ? 'border-white/12 bg-[#0B0C12] text-white' : 'border-black/10 bg-white text-[#0B0C12]',
    sous: sombre ? 'text-white/55' : 'text-black/50',
    bord: sombre ? 'border-white/15' : 'border-black/12',
    puce: sombre ? 'bg-white/8' : 'bg-black/[0.04]',
  };

  const ecouter = (id: string, fichier: string) => {
    audioRef.current?.pause();
    if (enLecture === id) {
      setEnLecture(null);
      reglerOS({ musique: null });
      return;
    }
    const audio = new Audio(fichier);
    audioRef.current = audio;
    audio.onended = () => setEnLecture(null);
    audio.play().then(() => {
      setEnLecture(id);
      reglerOS({ musique: id });
    }).catch(() => setEnLecture(null));
  };

  const contraste = contrasteWCAG(reglages.couleurAccent, reglages.couleurFond);
  const tailleBase = reglages.grosTextes ? 14 : 12;
  const anim = reglages.sansAnimations ? 'transition-none' : 'transition';

  /** La largeur de l'écran, selon l'appareil choisi. */
  const largeurEcran =
    reglages.appareil === 'mobile' ? 'max-w-[340px]' : reglages.appareil === 'ipad' ? 'max-w-[560px]' : 'max-w-full';

  return (
    <div
      aria-label="Wedding OS — le studio du concept"
      className={`relative w-full rounded-[26px] border shadow-[0_30px_90px_rgba(11,12,18,0.18)] ${ton.carte}`}
    >
      {/* ——— LA BARRE DU HAUT : le nom, et le bouton Paramètres ——— */}
      <div className={`flex items-center gap-3 border-b px-5 py-4 ${ton.bord}`}>
        <LogoSuperMariage taille={26} />
        <div>
          <div className="vp-title text-[17px] font-black italic tracking-wider">WEDDING OS</div>
          <div className={`font-mono text-[9px] uppercase tracking-[0.2em] ${ton.sous}`}>
            le studio du concept — une seule source
          </div>
        </div>

        <button
          type="button"
          onClick={() => setParametres((p) => !p)}
          aria-label="Paramètres du studio"
          aria-pressed={parametres}
          className={`ml-auto flex h-9 w-9 items-center justify-center rounded-full border ${ton.bord} ${anim} hover:scale-105`}
        >
          <Settings size={15} />
        </button>
      </div>

      {/* ——— LE PANNEAU PARAMÈTRES : thème, appareil, ce qu'on garde, accès ——— */}
      {parametres && (
        <div className={`absolute right-4 top-16 z-30 w-[280px] rounded-[18px] border p-4 shadow-xl ${ton.carte}`}>
          <div className={`font-mono text-[9px] uppercase tracking-[0.18em] ${ton.sous}`}>Le thème du bloc</div>
          <div className="mt-2 flex gap-2">
            {(['clair', 'sombre'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => reglerOS({ theme: t })}
                aria-pressed={reglages.theme === t}
                className={`rounded-full border px-3 py-1.5 text-[11.5px] font-semibold capitalize ${ton.bord} ${
                  reglages.theme === t ? 'bg-black text-white' : ''
                } ${sombre && reglages.theme === t ? 'bg-white text-black' : ''}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className={`mt-4 font-mono text-[9px] uppercase tracking-[0.18em] ${ton.sous}`}>L'appareil de l'aperçu</div>
          <div className="mt-2 flex gap-2">
            {([['bureau', 'Bureau'], ['ipad', 'iPad'], ['mobile', 'Mobile']] as const).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => reglerOS({ appareil: id })}
                aria-label={`Aperçu ${label}`}
                aria-pressed={reglages.appareil === id}
                className={`rounded-full border px-3 py-1.5 text-[11.5px] font-semibold ${ton.bord} ${
                  reglages.appareil === id ? 'bg-black text-white' : ''
                } ${sombre && reglages.appareil === id ? 'bg-white text-black' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className={`mt-4 font-mono text-[9px] uppercase tracking-[0.18em] ${ton.sous}`}>
            Ce qu'on garde comme règle
          </div>
          <div className="mt-2 grid gap-1.5">
            {GARDABLES_OS.map((g) => (
              <label key={g.id} className="flex items-center gap-2 text-[12px]">
                <input
                  type="checkbox"
                  checked={reglages.garder.includes(g.id)}
                  onChange={() => basculerGarderOS(g.id)}
                  aria-label={`Garder ${g.label.toLowerCase()}`}
                />
                {g.label}
              </label>
            ))}
          </div>

          <div className={`mt-4 font-mono text-[9px] uppercase tracking-[0.18em] ${ton.sous}`}>Accessibilité</div>
          <div className="mt-2 grid gap-1.5">
            {([
              ['grosTextes', 'Textes plus gros', 'grosTextes'],
              ['contraste', 'Contraste renforcé', 'contraste'],
              ['sansAnimations', 'Sans animations', 'sansAnimations'],
            ] as const).map(([id, label, cle]) => (
              <label key={id} className="flex items-center gap-2 text-[12px]">
                <input
                  type="checkbox"
                  checked={reglages[cle]}
                  onChange={() => reglerOS({ [cle]: !reglages[cle] })}
                  aria-label={label}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ——— LES PICTOS : les champs se déplient selon ce qu'on touche ——— */}
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto border-b px-4 py-3" role="tablist" aria-label="Les réglages du studio">
        {ONGLETS_OS.map(({ id, nom, Icone }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={onglet === id}
            aria-label={`Régler ${nom.toLowerCase()}`}
            onClick={() => setOnglet(id)}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-[11.5px] font-semibold ${ton.bord} ${anim} ${
              onglet === id ? 'bg-black text-white' : 'hover:bg-black/5'
            } ${sombre && onglet === id ? 'bg-white text-black' : ''} ${sombre && onglet !== id ? 'hover:bg-white/10' : ''}`}
          >
            <Icone size={13} />
            {nom}
          </button>
        ))}
      </div>

      {/* ——— LE CORPS : les réglages à gauche, l'écran à droite ——— */}
      <div className="grid gap-6 p-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div style={{ fontSize: tailleBase }}>
          {onglet === 'couverture' && (
            <div className="grid gap-5">
              {([
                ['tailleTitre', 'Taille du titre', 18, 56],
                ['arrondi', 'Arrondi des cartes', 0, 28],
                ['espace', 'Espace entre les blocs', 6, 24],
              ] as const).map(([cle, label, min, max]) => (
                <label key={cle} className="block">
                  <span className={`flex justify-between font-mono text-[9.5px] uppercase tracking-[0.16em] ${ton.sous}`}>
                    {label} <span>{reglages[cle]}px</span>
                  </span>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    value={reglages[cle]}
                    aria-label={label}
                    onChange={(e) => reglerOS({ [cle]: Number(e.target.value) })}
                    className="mt-2 w-full"
                  />
                </label>
              ))}
            </div>
          )}

          {onglet === 'typos' && (
            <div className="grid gap-4">
              <div className="flex gap-2">
                {([['editoriale', 'Éditoriale'], ['moderne', 'Moderne']] as const).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => reglerOS({ police: id })}
                    aria-pressed={reglages.police === id}
                    className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold ${ton.bord} ${
                      reglages.police === id ? 'bg-black text-white' : ''
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className={`rounded-[14px] border p-4 ${ton.bord}`}>
                <div className="font-black" style={{ fontSize: 30, fontFamily: reglages.police === 'editoriale' ? 'Georgia, serif' : 'inherit' }}>Aa 56</div>
                <div className="mt-1 font-semibold" style={{ fontSize: 16 }}>Aa 18 — les titres</div>
                <div className={`mt-1 ${ton.sous}`} style={{ fontSize: 13 }}>Aa 14 — le texte qui se lit</div>
              </div>
            </div>
          )}

          {onglet === 'couleurs' && (
            <div className="grid gap-4">
              <div className="flex flex-wrap gap-1.5">
                {PALETTE_OS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => reglerOS({ couleurAccent: c.hex })}
                    aria-label={`Accent ${c.nom}`}
                    title={c.nom}
                    className={`h-8 w-8 rounded-full border ${ton.bord}`}
                    style={{ background: c.hex }}
                  />
                ))}
              </div>
              <label className="flex items-center justify-between gap-2">
                <span className={`font-mono text-[9.5px] uppercase tracking-[0.16em] ${ton.sous}`}>Pipette — accent</span>
                <input
                  type="color"
                  value={reglages.couleurAccent}
                  aria-label="Pipette — couleur d'accent"
                  onChange={(e) => reglerOS({ couleurAccent: e.target.value })}
                  className="h-8 w-12 cursor-pointer rounded border-0 bg-transparent"
                />
              </label>
              <label className="flex items-center justify-between gap-2">
                <span className={`font-mono text-[9.5px] uppercase tracking-[0.16em] ${ton.sous}`}>Pipette — fond</span>
                <input
                  type="color"
                  value={reglages.couleurFond}
                  aria-label="Pipette — couleur de fond"
                  onChange={(e) => reglerOS({ couleurFond: e.target.value })}
                  className="h-8 w-12 cursor-pointer rounded border-0 bg-transparent"
                />
              </label>
              <p className={`font-mono text-[10px] ${ton.sous}`}>
                Contraste accent/fond : <strong>{contraste.ratio}</strong>{' '}
                <span className={`rounded-full px-2 py-0.5 ${contraste.badge === 'à revoir' ? 'bg-red-500/15 text-red-600' : 'bg-emerald-500/15 text-emerald-700'}`}>
                  {contraste.badge}
                </span>
              </p>
            </div>
          )}

          {onglet === 'musiques' && (
            <div className="grid gap-1.5">
              {MORCEAUX_OS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => ecouter(m.id, m.fichier)}
                  aria-label={`Écouter ${m.nom}`}
                  className={`flex items-center gap-2 rounded-[12px] border px-3 py-2 text-left text-[12px] font-semibold ${ton.bord} ${anim} hover:bg-black/5`}
                >
                  {enLecture === m.id ? <Pause size={13} /> : <Play size={13} />}
                  {m.nom}
                </button>
              ))}
            </div>
          )}

          {onglet === 'visuels' && (
            <div className="grid grid-cols-2 gap-2">
              {VISUELS_OS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => reglerOS({ visuel: reglages.visuel === v.id ? null : v.id })}
                  aria-label={`Visuel ${v.nom}`}
                  aria-pressed={reglages.visuel === v.id}
                  className={`overflow-hidden rounded-[12px] border ${ton.bord} ${reglages.visuel === v.id ? 'ring-2 ring-black' : ''}`}
                >
                  <img src={v.fichier} alt={v.nom} className="aspect-[4/3] w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {onglet === 'timeline' && (
            <div className="grid grid-cols-2 gap-2">
              {SAISONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => reglerOS({ saison: reglages.saison === s.id ? null : s.id })}
                  aria-label={`Saison ${s.nom}`}
                  aria-pressed={reglages.saison === s.id}
                  className="rounded-[12px] p-3 text-left text-[12px] font-bold"
                  style={{ background: s.fond, color: s.encre }}
                >
                  {s.symbole} {s.nom}
                </button>
              ))}
            </div>
          )}

          {onglet === 'docs' && (
            <div className="grid gap-2">
              <p className={ton.sous}>
                Les papiers, le portefeuille, les situations : tout vit déjà dans SUPER RIPPLE — le
                studio y puise, rien n'est recopié.
              </p>
              <a href="/ripple#documents" className={`rounded-[12px] border px-3 py-2 text-[12px] font-semibold no-underline ${ton.bord}`}>
                Les documents qui existent
              </a>
              <a href="/ripple#wallet" className={`rounded-[12px] border px-3 py-2 text-[12px] font-semibold no-underline ${ton.bord}`}>
                Le portefeuille
              </a>
            </div>
          )}

          {onglet === 'objets' && (
            <div className="flex flex-wrap gap-1.5">
              {PICTOS_DU_RIPPLE.map((picto) => {
                const Icone = picto.Icone;
                const pris = reglages.objet === picto.id;
                return (
                  <button
                    key={picto.id}
                    type="button"
                    onClick={() => reglerOS({ objet: picto.id })}
                    aria-label={`Objet ${picto.nom}`}
                    aria-pressed={pris}
                    title={picto.nom}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border ${ton.bord} ${
                      pris ? 'bg-black text-white' : ''
                    }`}
                  >
                    <Icone size={15} />
                  </button>
                );
              })}
            </div>
          )}

          {onglet === 'systeme' && (
            <div className="grid gap-3">
              <p className={ton.sous}>Le design system du site, tel qu'il est : chaque couleur porte son contraste.</p>
              {PALETTE_OS.map((c) => (
                <div key={c.hex} className={`flex items-center justify-between rounded-[10px] border px-3 py-1.5 ${ton.bord}`}>
                  <span className="flex items-center gap-2 text-[12px] font-semibold">
                    <span className="h-4 w-4 rounded-full" style={{ background: c.hex }} /> {c.nom}
                  </span>
                  <span className={`font-mono text-[10px] ${ton.sous}`}>
                    {c.hex} · {contrasteWCAG(c.hex, reglages.couleurFond).ratio}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ——— L'ÉCRAN : l'aperçu qui répond à tout ——— */}
        <div className={`mx-auto w-full ${largeurEcran}`}>
          <div
            className={`overflow-hidden border ${ton.bord} shadow-inner`}
            style={{ background: reglages.couleurFond, borderRadius: reglages.arrondi, padding: reglages.espace * 1.6 }}
          >
            {reglages.visuel && (
              <img
                src={VISUELS_OS.find((v) => v.id === reglages.visuel)?.fichier}
                alt=""
                className="mb-4 w-full object-cover"
                style={{ borderRadius: Math.max(reglages.arrondi - 6, 4), maxHeight: 190 }}
              />
            )}
            <div className="flex items-baseline justify-between font-mono text-[9px] uppercase tracking-[0.18em]" style={{ color: reglages.couleurAccent }}>
              <span>AIME MAGAZINE</span>
              <span>{reglages.saison ? SAISONS.find((s) => s.id === reglages.saison)?.nom : 'le jour'}</span>
            </div>
            <div
              className="font-black leading-[1.04] tracking-[-0.02em]"
              style={{
                fontSize: reglages.tailleTitre,
                fontFamily: reglages.police === 'editoriale' ? 'Georgia, serif' : 'inherit',
                color: reglages.contraste ? '#000000' : '#0B0C12',
                marginTop: reglages.espace,
              }}
            >
              {point.nom.trim() || 'Sarah & Gabriel'}
            </div>
            <div className="mt-2 h-[3px] w-16" style={{ background: reglages.couleurAccent, borderRadius: 2 }} />
            <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.14em]" style={{ color: reglages.contraste ? '#000' : '#0B0C1299' }}>
              <span className="flex items-center gap-1">
                {(() => {
                  const Picto = pictoDuRipple(reglages.objet).Icone;
                  return <Picto size={11} />;
                })()}
                {OBJETS_DE_LA_FABRIQUE.find((o) => o.id === reglages.objet)?.nom ?? 'L’objet'}
              </span>
              {reglages.musique && <span>· {MORCEAUX_OS.find((m) => m.id === reglages.musique)?.nom}</span>}
              {point.jour.trim() && <span>· {point.jour}</span>}
            </div>
          </div>
          <div className={`mt-2 text-center font-mono text-[9px] uppercase tracking-[0.18em] ${ton.sous}`}>
            aperçu {reglages.appareil} · {reglages.garder.length} réglage{reglages.garder.length > 1 ? 's' : ''} gardé{reglages.garder.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </div>
  );
}
