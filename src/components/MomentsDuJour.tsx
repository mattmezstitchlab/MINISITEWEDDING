import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CouvertureJourVue from './CouvertureJour';
import { couverturesDesParts } from '../lib/couvertureDuJour';
import { editionDuJour } from '../lib/jourDuMagazine';
import { REGLE_EDITORIALE, bornesDeLaPart, heuresDeLaPart, partActuelle } from '../lib/moments';
import { profilDuJour } from '../lib/profilsEditoriaux';

/**
 * LES SIX TEMPS DU JOUR — LE MÊME JOUR, SIX LUMIÈRES
 *
 * Vingt-quatre heures, six temps, **une seule couverture** : le cadran garde ses
 * branches, et celles du temps qu'on regarde s'allument. Sous chaque temps, ce
 * qui s'y passe vraiment — la page que l'édition du jour lui consacre.
 *
 * La règle tient en trois questions, et elle est écrite en haut du bloc :
 * **QUI** ouvre le numéro, **QUAND** on le regarde, **QUOI** s'y passe.
 */
export default function MomentsDuJour({ date = new Date() }: { date?: Date }) {
  const edition = editionDuJour(date);
  const personnage = profilDuJour(date).personnage;
  const maintenant = partActuelle(date);
  const couvertures = couverturesDesParts(date);

  const pageDuTemps = (de: number, a: number) => edition.pages[Math.floor((de + a) / 2)];
  const heureActuelle = date.getHours();
  const pageMaintenant = edition.pages[heureActuelle];

  return (
    <section id="moments" className="border-t border-black/8 bg-[#0B0C12] py-14 text-white">
      <div className="vp-page">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">Le jour, en six temps</span>
        <h2 className="vp-title mt-2 text-[22px] sm:text-[28px]">
          Le même jour, {edition.pages.length} heures, six lumières
        </h2>
        <p className="mt-3 max-w-[820px] text-[13.5px] leading-relaxed text-white/60">
          La couverture ne change pas de dessin : elle <strong className="font-bold text-white/85">s’éclaire autrement</strong>.
          Le cadran garde ses vingt-quatre branches, et celles du temps qu’on regarde s’allument. Un jour, six fois —
          et sous chacune, ce qui s’y passe vraiment.
        </p>

        {/* — LA RÈGLE, EN TROIS QUESTIONS — */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {REGLE_EDITORIALE.map((r, i) => (
            <div key={r.cle} className="rounded-[16px] border border-white/12 bg-white/5 px-4 py-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">{r.cle}</span>
              <p className="mt-1 text-[13px] font-semibold tracking-tight text-white/85">{r.question}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-white/50">
                {i === 0 ? `${personnage} — ${r.sens}` : i === 1 ? `il est ${heureActuelle} h, ${maintenant.nom.toLowerCase()} — ${r.sens}` : (pageMaintenant?.titre ?? r.sens)}
              </p>
            </div>
          ))}
        </div>

        {/* — LES SIX TEMPS, CHACUN SA COUVERTURE — */}
        <div className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3">
          {couvertures.map(({ part, couverture }) => {
            const page = pageDuTemps(part.de, part.a);
            const heures = heuresDeLaPart(part);
            const actuel = part.id === maintenant.id;
            return (
              <figure
                key={part.id}
                data-part={part.id}
                data-actuelle={actuel ? 'true' : 'false'}
                className={`w-[196px] shrink-0 snap-start rounded-[18px] border p-3 transition ${
                  actuel ? 'border-white/45 bg-white/10' : 'border-white/10 bg-white/[0.03]'
                }`}
              >
                <CouvertureJourVue couverture={couverture} largeur={168} vignette />
                <figcaption className="mt-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[14px] font-bold tracking-tight">{part.nom}</span>
                    {actuel && (
                      <span className="rounded-full bg-white/15 px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.16em] text-white/80">
                        maintenant
                      </span>
                    )}
                  </div>
                  <span className="mt-0.5 block font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/45">
                    {bornesDeLaPart(part)} · {heures.length} pages
                  </span>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-white/60">{part.phrase}</p>
                  {page && (
                    <p className="mt-2 border-t border-white/10 pt-2 text-[12px] leading-relaxed text-white/50">
                      <span className="font-semibold text-white/70">{page.nomDeLHeure}</span> — {page.titre}
                    </p>
                  )}
                </figcaption>
              </figure>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 rounded-[18px] border border-white/12 bg-white/5 px-5 py-4">
          <p className="min-w-[280px] flex-1 text-[13px] leading-relaxed text-white/60">
            Le personnage donne l’identité, le temps donne la structure, le mariage donne le contenu. Le système ne
            change pas : seul le monde qu’on construit à l’intérieur change.
          </p>
          {/* LE BOUTON MAGIQUE : ce qu’on vient de regarder devient la première
              matière du projet — on ne repart pas de zéro. */}
          <Link to="/creer" className="vp-btn vp-press bg-white text-[#0B0C12]">
            Créer ce mariage <ArrowRight size={14} />
          </Link>
          <Link to="/timeline" className="vp-btn vp-btn-glass vp-press">
            La timeline <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
