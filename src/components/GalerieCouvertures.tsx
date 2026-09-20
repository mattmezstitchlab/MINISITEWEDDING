import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CouvertureJour from './CouvertureJour';
import { MOIS, couverturesDeLAnnee, couverturesDuMois, type CouvertureJour as Couverture } from '../lib/couvertureDuJour';
import { etatDeLAnnee } from '../lib/fichesAnnee';
import { semaineDeLAnnee } from '../lib/jeuDeCartes';
import MagazineSemaine from './MagazineSemaine';
import { CHAPITRES } from '../lib/chapitres';
import { MAGAZINES, NOMBRE_DE_MAGAZINES, SAISONS_DE_LA_COLLECTION } from '../lib/semaines';
import { VISUELS_LIVRES } from '../lib/bibliothequeMagazine';
import { IMAGES_ATTENDUES } from '../lib/semaines';

/**
 * LE KIOSQUE — LES 54 MAGAZINES, PUIS LES 365 JOURS
 *
 * Deux étagères, dans cet ordre, parce que c'est l'ordre du modèle :
 *
 * 1. **les 54 magazines** — les portes d'entrée. Chacun annonce son titre, son
 *    style, sa saison, et ses sept chapitres écrits sur la couverture ;
 * 2. **les 365 jours** — la navigation temporelle, mois par mois : le même
 *    dessin pour tous, ce que le jour y ajoute (la saison, la lumière, les clés).
 *
 * Une couverture de magazine non livrée n'emprunte **jamais** le visuel d'une
 * autre semaine : elle affiche sa vignette éditoriale, et le dit.
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

  /** Le magazine ouvert : celui de la date regardée. */
  /** Le magazine du moment : celui de la semaine où l'on est. */
  const semaineCourante = semaineDeLAnnee(new Date());
  const duMoment = MAGAZINES.filter((m) => m.semaine === semaineCourante);

  return (
    <section id="couvertures" className="border-t border-black/8 py-14">
      <div className="vp-page">
        {/* ————————————— L'ÉTAGÈRE DES 54 MAGAZINES ————————————— */}
        <span id="collection" className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45">
          La collection
        </span>
        <h2 className="vp-title mt-2 text-[22px] sm:text-[28px]">
          Les {NOMBRE_DE_MAGAZINES} magazines de l’année
        </h2>
        <p className="mt-3 max-w-[760px] text-[13.5px] leading-relaxed text-black/55">
          Un magazine par semaine, et <strong className="font-bold text-black/75">sept chapitres par magazine</strong> —
          {' '}les sept mêmes univers chaque semaine, traités chaque fois autrement. Les 365 dates ne sont plus 365
          magazines : elles sont <strong className="font-bold text-black/75">{NOMBRE_DE_MAGAZINES} portes d’entrée</strong>,
          et chaque jour ouvre l’un des sept chapitres de sa semaine. La bibliothèque compte{' '}
          {IMAGES_ATTENDUES} images — {NOMBRE_DE_MAGAZINES} couvertures et {NOMBRE_DE_MAGAZINES * CHAPITRES.length}{' '}
          chapitres ; {VISUELS_LIVRES} sont livrées à ce jour, et ce qui manque garde sa vignette éditoriale.
        </p>

        {SAISONS_DE_LA_COLLECTION.map((saison) => {
          const siens = MAGAZINES.filter((m) => m.saison.id === saison.id);
          return (
            <div key={saison.id} className="mt-8">
              <div className="flex flex-wrap items-baseline gap-3 border-b border-black/10 pb-2">
                <h3 className="text-[15.5px] font-bold tracking-tight">
                  {saison.symbole} {saison.nom}
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/45">
                  {siens.length} magazines · semaine {saison.semaines[0]} à {saison.semaines[1]}
                </span>
              </div>
              <div className="no-scrollbar mt-4 flex items-start gap-4 overflow-x-auto pb-3">
                {siens.map((m) => (
                  <MagazineSemaine
                    key={m.numero}
                    magazine={m}
                    taille="petite"
                    facteur={duMoment.some((d) => d.numero === m.numero) ? 1 : 0.25}
                    active={duMoment.some((d) => d.numero === m.numero)}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* ————————————— L'ÉTAGÈRE DES 365 JOURS ————————————— */}
        <div className="mt-12 border-t border-black/10 pt-8">
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

        {/* — LES COUVERTURES, JOUR PAR JOUR — */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {affichees.map((couverture) => (
            <figure key={couverture.id} className="group">
              <div className="overflow-hidden rounded-[6px] shadow-[0_16px_34px_-24px_rgba(0,0,0,0.7)] transition group-hover:shadow-[0_22px_44px_-24px_rgba(0,0,0,0.75)]">
                <CouvertureJour couverture={couverture} largeur={220} vignette fond="chapitre" className="w-full" />
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
      </div>
    </section>
  );
}
