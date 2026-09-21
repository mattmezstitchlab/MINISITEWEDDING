import { MARQUE_MAGAZINE } from '../lib/aimeMagazine';
import { PAGES_EDITION, type Edition } from '../lib/aimeMoteur';

/**
 * L'ÉDITION DE LA SEMAINE — LE NUMÉRO, OUVERT
 *
 * Une couverture, puis **vingt-quatre pages — une par heure**, et les **huit
 * rubriques** qui font trois fois le tour de la journée : le temps, la carte,
 * l'amour, le passage, les gens, vos papiers, la musique, l'archive. Le nombre de
 * pages ne change jamais — c'est ce qui fait un magazine, et non une page qui
 * s'allonge.
 *
 * Ce qui change, c'est **ce qu'il y a dedans** : vos coches, votre rôle, votre
 * univers, la semaine, et le temps (passé, présent, futur).
 */

export default function EditionSemaine({ edition }: { edition: Edition }) {
  const { carte, saison } = edition;

  return (
    <article
      className="overflow-hidden rounded-[24px] border border-black/10 bg-white"
      aria-label={`${MARQUE_MAGAZINE} ${edition.titre}`}
    >
      {/* Le bandeau de l'édition : le fond de sa saison, sa carte, sa date. */}
      <header
        className="flex flex-wrap items-end justify-between gap-4 px-5 py-5 sm:px-7"
        style={{ background: carte.fond, color: carte.encre }}
      >
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-75">
            {MARQUE_MAGAZINE} · {PAGES_EDITION} pages, une par heure
          </div>
          <h3 className="vp-title mt-2 text-[22px] sm:text-[27px]" style={{ lineHeight: 1.05 }}>
            {edition.titre}
          </h3>
          <p className="mt-1.5 text-[12.5px] opacity-85">{edition.sousTitre}</p>
        </div>
        <div className="text-right text-[11.5px] leading-relaxed opacity-85">
          <div className="font-mono uppercase tracking-[0.16em]">
            {edition.temps === 'passe' ? 'Relu au passé' : edition.temps === 'futur' ? 'Lu au futur' : 'Cette semaine'}
          </div>
          <div>
            {edition.du.toLocaleDateString('fr-FR')} — {edition.fin.toLocaleDateString('fr-FR')}
          </div>
          <div className="font-mono">{saison.nom}</div>
        </div>
      </header>

      {/* Les vingt-quatre heures, dans l'ordre : les huit rubriques trois fois. */}
      <ol className="grid gap-px bg-black/8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {edition.pages.map((page) => (
          <li key={page.heure} className="bg-white px-5 py-5 sm:px-6">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[10px] tabular-nums text-black/35">
                {String(page.heure).padStart(2, '0')} h
              </span>
              <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-black/45">
                {page.rubrique}
              </span>
            </div>
            <div className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-black/35">
              {page.nomDeLHeure} — {page.lumiere}
            </div>
            <h4 className="mt-2 text-[15px] font-bold leading-snug text-[#0B0C12]">{page.titre}</h4>
            <p className="mt-2 text-[13px] leading-relaxed text-black/60">{page.texte}</p>
            <div className="mt-3 font-mono text-[9.5px] uppercase tracking-[0.14em] text-black/35">
              {page.source}
            </div>
          </li>
        ))}
      </ol>

      <footer className="border-t border-black/8 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-black/40 sm:px-7">
        {PAGES_EDITION} pages · une par heure · même sommaire chaque jour · la composition suit vos choix
      </footer>
    </article>
  );
}
