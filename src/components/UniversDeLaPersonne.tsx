import { Link, useNavigate } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUp, Trash2, X } from 'lucide-react';
import BandeDuHero from './BandeDuHero';
import {
  adresseDeLUnivers,
  deplacerCarte,
  retirerCarte,
  rolesDeLaPersonne,
  universDeLaPersonne,
  viderSelection,
  type CarteChoisie,
} from '../lib/selection';

/**
 * LES UNIVERS DE LA PERSONNE — LA SUITE DE SES CLICS
 *
 * Sous son manifeste : **ce qu'elle a retenu sur l'accueil**, dans l'ordre. Un
 * univers, ses cartes associées, et ses deux gestes — monter, descendre — plus
 * de quoi retirer. Ses rôles viennent après, en bande, comme à l'accueil : le
 * play entre avec le rôle.
 *
 * Rien n'est recopié : chaque bloc redemande ses cartes au site, si bien qu'un
 * univers qui change change ici aussi.
 */

interface UniversDeLaPersonneProps {
  selection: CarteChoisie[];
}

export default function UniversDeLaPersonne({ selection }: UniversDeLaPersonneProps) {
  const navigate = useNavigate();
  const univers = universDeLaPersonne(selection);
  const roles = rolesDeLaPersonne(selection);
  const vide = univers.length === 0 && roles.length === 0;

  return (
    <section id="univers-de-la-personne">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-black/45">
            Ses univers
          </div>
          <h2 className="vp-title mt-3 text-[clamp(1.4rem,3.2vw,2rem)]">
            {vide
              ? 'Rien de retenu pour l’instant'
              : `Ce qu’elle a retenu sur l’accueil, dans l’ordre · ${univers.length + roles.length}`}
          </h2>
        </div>
        {!vide && (
          <button
            type="button"
            onClick={() => viderSelection()}
            className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-[11.5px] font-semibold text-black/50 transition hover:border-black/30 hover:text-black/75"
          >
            <Trash2 size={12} /> Vider la sélection
          </button>
        )}
      </div>

      {vide && (
        <div className="mt-5 rounded-[18px] border border-dashed border-black/15 px-4 py-6">
          <p className="text-[13.5px] leading-relaxed text-black/60">
            Les cartes choisies sur l’accueil se rangent ici, dans l’ordre du clic — et cet ordre devient
            celui du hero, juste au-dessus.
          </p>
          <Link to="/" className="vp-btn vp-press mt-4">
            Choisir mes cartes sur l’accueil <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* LES UNIVERS, DANS L'ORDRE DU CLIC : leurs cartes associées, et l'ordre
          qui se règle à la main. */}
      {univers.map((bloc, i) => (
        <article key={bloc.style.id} className="mt-7 border-t border-black/10 pt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-black/45">
                {String(i + 1).padStart(2, '0')} · univers
              </div>
              <h3 className="vp-title mt-2 text-[clamp(1.25rem,2.8vw,1.7rem)]">
                {bloc.style.name} — {bloc.style.tagline}
              </h3>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                aria-label={`Monter ${bloc.style.name}`}
                onClick={() => deplacerCarte({ id: bloc.style.id, sorte: 'univers' }, -1)}
                disabled={i === 0}
                className="rounded-full border border-black/10 p-2 text-black/55 transition hover:border-black/30 hover:text-black disabled:opacity-30"
              >
                <ArrowUp size={13} />
              </button>
              <button
                type="button"
                aria-label={`Descendre ${bloc.style.name}`}
                onClick={() => deplacerCarte({ id: bloc.style.id, sorte: 'univers' }, 1)}
                disabled={i === univers.length - 1}
                className="rounded-full border border-black/10 p-2 text-black/55 transition hover:border-black/30 hover:text-black disabled:opacity-30"
              >
                <ArrowDown size={13} />
              </button>
              <button
                type="button"
                aria-label={`Retirer ${bloc.style.name}`}
                onClick={() => retirerCarte({ id: bloc.style.id, sorte: 'univers' })}
                className="rounded-full border border-black/10 p-2 text-black/55 transition hover:border-black/30 hover:text-black"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          <p className="mt-3 max-w-[620px] text-[14.5px] leading-relaxed text-black/70">{bloc.style.manifesto}</p>

          <div className="mt-4">
            <Link to={adresseDeLUnivers(bloc.style.id)} className="vp-btn vp-btn-glass vp-press">
              La page de l’univers <ArrowRight size={14} />
            </Link>
          </div>

          {/* LES CARTES ASSOCIÉES : les mêmes cartes que partout, cet univers au
              milieu. Un clic ouvre l'univers de la carte. */}
          <div className="mt-4">
            <BandeDuHero
              libelle="Ses cartes"
              cartes={bloc.cartes}
              styleId={bloc.style.id}
              onChoisir={(carte) => navigate(adresseDeLUnivers(carte.id))}
            />
          </div>
        </article>
      ))}

      {/* SES RÔLES : ce qu'elle a cliqué du premier niveau de l'accueil. */}
      {roles.length > 0 && (
        <article className="mt-7 border-t border-black/10 pt-6">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-black/45">
            Ses rôles · {roles.length}
          </div>
          <h3 className="vp-title mt-2 text-[clamp(1.25rem,2.8vw,1.7rem)]">
            Les portes qu’elle a prises place par place
          </h3>

          <div className="mt-4">
            <BandeDuHero
              cartes={roles}
              styleId="personas"
              libelleAction="Entrer"
              onChoisir={(carte) => navigate('/creer', { state: { roleId: carte.id } })}
              onAction={(carte) => navigate('/creer', { state: { roleId: carte.id } })}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {roles.map((role) => (
              <span
                key={role.id}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[12px] font-semibold text-black/65"
              >
                {role.titre}
                <button
                  type="button"
                  aria-label={`Retirer ${role.titre}`}
                  onClick={() => retirerCarte({ id: role.id, sorte: 'persona' })}
                  className="text-black/35 transition hover:text-black"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </article>
      )}
    </section>
  );
}
