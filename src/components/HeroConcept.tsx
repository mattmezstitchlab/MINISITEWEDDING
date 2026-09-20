import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PICTOS_DU_RIPPLE, pictoDuRipple, usePointZero, changerPointZero } from '../lib/ripple';
import LogoSuperMariage from './LogoSuperMariage';

/**
 * LE HERO DU CONCEPT — UN SEUL OBJET QUI RÉUNIT TOUT
 *
 * Le visuel le plus représentatif du concept en fond : le soleil-cadran au
 * centre, et les couvertures qui tournent autour, aux couleurs des quatre
 * saisons. Devant, **un seul bloc**, dans le style de la page Ripple :
 * l'objet unique. Il prend la forme qu'on lui donne — ticket de caisse,
 * carte postale, timbre, tampon, ticket spectacle, billet d'avion, sticker —
 * et il porte le point zéro, en direct. Un nom, un jour : tout le reste suit.
 */

export default function HeroConcept() {
  const point = usePointZero();
  /** La forme que prend l'objet unique, en ce moment. */
  const [forme, setForme] = useState('recu');
  const Picto = pictoDuRipple(forme).Icone;
  const nomAffiche = point.nom.trim() || 'Vos prénoms';

  return (
    <section aria-label="Le concept en un objet" className="vp-env vp-env-dark relative overflow-hidden bg-[#07080C] text-white">
      {/* Le visuel du concept : le cadran au centre, les couvertures autour. */}
      <img
        src="/images/concept-super-mariage.jpg"
        alt="Le soleil-cadran au centre, entouré des couvertures du magazine, aux couleurs des quatre saisons"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[radial-gradient(72%_72%_at_50%_42%,rgba(7,8,12,0.12),rgba(7,8,12,0.9))]" aria-hidden="true" />

      <div className="vp-page relative flex min-h-[92svh] flex-col items-center justify-center gap-10 py-24 lg:flex-row lg:items-center lg:gap-16">
        {/* Le nom du concept, au-dessus de l'objet. */}
        <div className="max-w-[520px] text-center lg:text-left">
          <div className="flex items-center justify-center gap-3 lg:justify-start">
            <LogoSuperMariage taille={30} />
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/60">
              Le concept, en un objet
            </span>
          </div>
          <h1
            className="mt-5 font-black leading-[1.02] tracking-[-0.03em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
            style={{ fontSize: 'clamp(2.1rem, 4.6vw, 3.6rem)' }}
          >
            Un seul objet, qui réunit tout.
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-white/75">
            Le ticket de caisse, la carte postale, le timbre, le tampon, le ticket spectacle, le
            billet d'avion, le sticker : <strong className="text-white">un seul objet qui les
            réunit tous</strong>. Donnez-lui un nom et un jour — il porte tout votre mariage, et une
            seule saisie se répercute partout.
          </p>
        </div>

        {/* L'OBJET UNIQUE : le bloc Ripple, en direct. */}
        <div className="w-full max-w-[430px] rounded-[22px] border border-white/14 bg-black/55 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          {/* L'objet, tel qu'il est maintenant. */}
          <div className="rounded-[12px] border border-dashed border-white/25 bg-[#FFFEF7] p-4 font-mono text-[11px] leading-snug text-black">
            <div className="flex items-center justify-between">
              <span className="font-black uppercase tracking-[0.14em]">{pictoDuRipple(forme).nom}</span>
              <Picto size={15} />
            </div>
            <div className="mt-2 border-t border-dotted border-black/25 pt-2">
              {nomAffiche}
              {point.jour.trim() && <> · {point.jour.trim()}</>}
            </div>
            {point.ville.trim() && <div className="text-black/55">{point.ville.trim()}</div>}
            <div className="mt-2 text-[9px] uppercase tracking-widest text-black/40">
              Un seul objet · toutes les formes
            </div>
          </div>

          {/* Les formes : l'objet unique prend celle qu'on lui donne. */}
          <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label="Les formes de l'objet unique">
            {PICTOS_DU_RIPPLE.map((picto) => {
              const Icone = picto.Icone;
              const pris = forme === picto.id;
              return (
                <button
                  key={picto.id}
                  type="button"
                  onClick={() => setForme(picto.id)}
                  aria-label={`Prendre la forme ${picto.nom}`}
                  aria-pressed={pris}
                  title={picto.nom}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                    pris
                      ? 'border-transparent bg-[#00FF88] text-black'
                      : 'border-white/15 text-white/60 hover:border-white/50 hover:text-white'
                  }`}
                >
                  <Icone size={15} />
                </button>
              );
            })}
          </div>

          {/* Le point zéro, en deux champs : tout le reste suit. */}
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <label className="block">
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/50">Le nom</span>
              <input
                value={point.nom}
                onChange={(e) => changerPointZero({ nom: e.target.value })}
                placeholder="Prénoms"
                aria-label="Le nom du point zéro"
                className="mt-1 w-full rounded-[10px] border border-white/15 bg-white/[0.05] px-3 py-2 text-[13px] text-white placeholder:text-white/30 focus:border-[#00FF88]/60 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/50">Le jour</span>
              <input
                value={point.jour}
                onChange={(e) => changerPointZero({ jour: e.target.value })}
                placeholder="La date"
                aria-label="Le jour du point zéro"
                className="mt-1 w-full rounded-[10px] border border-white/15 bg-white/[0.05] px-3 py-2 text-[13px] text-white placeholder:text-white/30 focus:border-[#00FF88]/60 focus:outline-none"
              />
            </label>
          </div>

          <Link
            to="/ripple"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#00FF88] px-4 py-2 text-[12.5px] font-semibold text-black no-underline transition hover:brightness-110"
          >
            Entrer dans SUPER RIPPLE <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
