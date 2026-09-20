import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CouvertureJour from './CouvertureJour';
import { MOIS, couverturesDeLAnnee, couverturesDuMois, type CouvertureJour as Couverture } from '../lib/couvertureDuJour';
import { etatDeLAnnee } from '../lib/fichesAnnee';

/**
 * LES 365 COUVERTURES — LE KIOSQUE DE L'ANNÉE
 *
 * Une couverture par jour, **toutes faites du même dessin** : le fond de la
 * saison, la création au centre, le nom du jour, la date. On choisit un mois, et
 * on les voit — parce qu'une promesse d'un an ne se juge pas sur un exemple.
 *
 * Ce que la galerie sert à décider : **ce qu'on met dans le magazine**. Le dessin
 * est posé, les jours sont là, les clés sont écrites — il ne reste qu'à regarder
 * et à dire ce qu'on garde.
 */

const COULEURS: Array<{ id: string; nom: string; fond: string }> = [
  { id: 'printemps', nom: 'Printemps', fond: '#7FB77E' },
  { id: 'ete', nom: 'Été', fond: '#E9B44C' },
  { id: 'automne', nom: 'Automne', fond: '#B8574A' },
  { id: 'hiver', nom: 'Hiver', fond: '#16233F' },
];

export default function GalerieCouvertures({ annee = new Date().getFullYear() }: { annee?: number }) {
  const [mois, setMois] = useState(new Date().getMonth() + 1);
  const [saison, setSaison] = useState<string | null>(null);

  const anneeEntiere: Couverture[] = couverturesDeLAnnee(annee);
  const etat = etatDeLAnnee(annee);
  const duMois = couverturesDuMois(annee, mois);
  const affichees = !saison
    ? duMois
    : saison === 'noir'
      ? duMois.filter((c) => c.pasCommeLesAutres)
      : saison === 'dense'
        ? duMois.filter((c) => c.dense)
        : duMois.filter((c) => c.saison.id === saison);
  const noirsDuMois = duMois.filter((c) => c.pasCommeLesAutres).length;
  const densesDuMois = duMois.filter((c) => c.dense).length;

  return (
    <section id="couvertures" className="border-t border-black/8 py-14">
      <div className="vp-page">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45">
          Le kiosque
        </span>
        <h2 className="vp-title mt-2 text-[22px] sm:text-[28px]">
          Les {anneeEntiere.length} couvertures de l’année
        </h2>
        <p className="mt-3 max-w-[760px] text-[13.5px] leading-relaxed text-black/55">
          Une par jour, et <strong className="font-bold text-black/75">le même dessin pour toutes</strong> :
          le fond uni de la saison — plus dense quand le temps est clos, et noir pour les seuls jours qui
          ne sont pas comme les autres : le joker, le dimanche, les portes de l’année — la marque en haut,{' '}
          <strong className="font-bold text-black/75">la création au centre</strong> — un cadran de
          vingt-quatre heures, une branche par heure de l’édition —, le nom du jour, et la date en bas.
          Chaque couverture porte ce que le jour apporte : {affichees.length > 0 ? 'le ciel, la lune, le chiffre' : 'ses clés'}.
        </p>

        {/* — LES MOIS — */}
        <div className="mt-6 flex flex-wrap gap-1.5">
          {MOIS.map((m) => {
            const nombre = couverturesDuMois(annee, m.numero).length;
            return (
              <button
                key={m.numero}
                type="button"
                onClick={() => setMois(m.numero)}
                aria-pressed={mois === m.numero}
                className={`rounded-full border px-3 py-1.5 text-[12.5px] capitalize transition ${
                  mois === m.numero
                    ? 'border-transparent bg-[#0B0C12] text-white'
                    : 'border-black/12 text-black/60 hover:border-black/40 hover:text-black'
                }`}
              >
                {m.nom}
                <span className="ml-1.5 font-mono text-[10px] opacity-60">{nombre}</span>
              </button>
            );
          })}
        </div>

        {/* — LES SAISONS, ET CE QUE LE MOIS CONTIENT — */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {COULEURS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSaison(saison === c.id ? null : c.id)}
                aria-pressed={saison === c.id}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] transition ${
                  saison === c.id ? 'border-black/60 text-black' : 'border-black/12 text-black/55 hover:border-black/40'
                }`}
              >
                <span aria-hidden="true" className="h-3 w-3 rounded-full" style={{ background: c.fond }} />
                {c.nom}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSaison('noir')}
              aria-pressed={saison === 'noir'}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] transition ${
                saison === 'noir' ? 'border-black/60 text-black' : 'border-black/12 text-black/55 hover:border-black/40'
              }`}
            >
              <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#0B0B0F]" />
              Les jours noirs
            </button>
            <button
              type="button"
              onClick={() => setSaison('dense')}
              aria-pressed={saison === 'dense'}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] transition ${
                saison === 'dense' ? 'border-black/60 text-black' : 'border-black/12 text-black/55 hover:border-black/40'
              }`}
            >
              <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#3E3E46]" />
              Les temps clos
            </button>
          </div>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-black/40">
            {affichees.length} couvertures affichées · {noirsDuMois} à fond noir · {densesDuMois} en saison assombrie
            · {etat.avecEtymologie} journées ont le sens de leur prénom · {etat.pretes} fiches documentées
          </span>
        </div>

        {/* — LES COUVERTURES — */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {affichees.map((couverture) => (
            <figure key={couverture.id} className="group">
              <div className="overflow-hidden rounded-[6px] shadow-[0_16px_34px_-24px_rgba(0,0,0,0.7)] transition group-hover:shadow-[0_22px_44px_-24px_rgba(0,0,0,0.75)]">
                <CouvertureJour couverture={couverture} largeur={220} vignette className="w-full" />
              </div>
              <figcaption className="mt-2">
                <span className="block text-[12.5px] font-semibold text-black/75">{couverture.titre}</span>
                <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-black/40">
                  {couverture.figure} · {couverture.cles[0]?.valeur ?? ''}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        {affichees.length === 0 && (
          <p className="mt-6 rounded-[16px] border border-dashed border-black/15 px-4 py-6 text-[13px] text-black/50">
            Aucune couverture dans cette saison ce mois-ci — la saison change au fil des semaines.
          </p>
        )}

        {/* — CE QUE LA GALERIE SERT À DIRE — */}
        <div className="mt-8 flex flex-wrap items-center gap-3 rounded-[18px] border border-black/8 bg-white px-5 py-4">
          <p className="min-w-[280px] flex-1 text-[13px] leading-relaxed text-black/60">
            Le décor est posé : {anneeEntiere.length} jours, {anneeEntiere.filter((c) => c.pasCommeLesAutres).length} à fond
            noir — les dimanches, les portes de l’année et le joker —, {anneeEntiere.filter((c) => c.dense).length} en
            saison assombrie les temps clos, quatre saisons du jeu, un cadran par jour. Ce qu’on décide maintenant, c’est{' '}
            <strong className="font-bold text-black/75">ce qui va dans les vingt-quatre pages</strong> — et
            c’est ce qui nourrira les mini-sites et les cartes, sans reposer la même question à personne.
          </p>
          <Link to="/le-mariage" className="vp-btn vp-btn-glass vp-press">
            Les univers <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
