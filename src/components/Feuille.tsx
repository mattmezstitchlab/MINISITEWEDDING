import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

/**
 * LA FEUILLE — CE QUI N'EST PAS SUR LA SCÈNE
 *
 * Le magazine n'a pas de panneaux : ni colonne de droite, ni barre d'outils, ni
 * sections empilées. Ce qui n'est pas l'image et la mosaïque **n'apparaît que
 * lorsqu'on le demande** — l'éditeur, la collection, une page du sommaire. Ces
 * contenus s'ouvrent dans une **feuille** : elle monte du bas sur un téléphone,
 * se pose au centre sur un grand écran, et se referme d'un geste, d'un clic
 * dehors, ou de la touche `Échap`.
 *
 * Une feuille à la fois, jamais deux : l'écran reste respirable.
 */

export default function Feuille({
  ouverte,
  surtitre,
  titre,
  onFermer,
  children,
}: {
  ouverte: boolean;
  surtitre?: string;
  titre: string;
  onFermer: () => void;
  children: ReactNode;
}) {
  /** `Échap` referme — le geste attendu, celui d'iOS. */
  useEffect(() => {
    if (!ouverte) return;
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFermer();
    };
    window.addEventListener('keydown', surTouche);
    return () => window.removeEventListener('keydown', surTouche);
  }, [ouverte, onFermer]);

  if (!ouverte) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={titre}>
      {/* Le fond : on voit la scène derrière, floutée. */}
      <button
        type="button"
        aria-label="Fermer"
        onClick={onFermer}
        className="absolute inset-0 cursor-default bg-black/72 backdrop-blur-md"
      />

      <div
        data-feuille="ouverte"
        className="relative flex max-h-[92svh] w-full max-w-[1080px] flex-col overflow-hidden bg-[#FBFAF8] text-[#0B0C12] sm:max-h-[88svh] sm:rounded-t-none"
      >
        <header className="flex items-start justify-between gap-4 border-b border-black/8 px-5 py-4 sm:px-8 sm:py-5">
          <div className="min-w-0">
            {surtitre && (
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-black/45">{surtitre}</span>
            )}
            <h2 className="vp-title mt-1 text-[20px] sm:text-[26px]">{titre}</h2>
          </div>
          <button
            type="button"
            onClick={onFermer}
            aria-label="Fermer la feuille"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-black/50 transition hover:bg-black/5 hover:text-black"
          >
            <X size={17} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-8 sm:py-7">{children}</div>
      </div>
    </div>
  );
}
