import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MagazineSemaine from './MagazineSemaine';
import BlocMagazine from './BlocMagazine';
import { CHAPITRES } from '../lib/chapitres';
import { MAGAZINES, NOMBRE_DE_MAGAZINES, SAISONS_DE_LA_COLLECTION } from '../lib/semaines';
import { VISUELS_LIVRES } from '../lib/bibliothequeMagazine';
import { jourDuChapitre } from '../lib/semaines';

/**
 * LA COLLECTION — LES 54 PORTES D'ENTRÉE
 *
 * C'est le kiosque, et il tient en un bloc : **les 54 magazines**, rangés par
 * saison, chacun annonçant son numéro, son titre, son style, sa semaine et ses
 * sept chapitres. Un clic ouvre le magazine — au lundi de sa semaine, ou au
 * premier jour qui existe pour les deux jours de trop.
 *
 * Ce que ce bloc ne fait plus : les **365 couvertures jour par jour**. C'était
 * la navigation de l'ancien modèle (« 365 jours = 365 magazines »). La
 * navigation temporelle, elle, tient maintenant dans **le cadran** — qui suit
 * la capsule du bas — et dans **l'atelier du temps**. Une chose à la fois.
 */

export default function GalerieCouvertures({ annee = new Date().getFullYear() }: { annee?: number }) {
  const manquantes = MAGAZINES.length - VISUELS_LIVRES;

  return (
    <div id="couvertures">
      <BlocMagazine
        surtitre="La collection"
        titre={`Les ${NOMBRE_DE_MAGAZINES} magazines de l’année`}
        resume={
          <>
            Une année, {NOMBRE_DE_MAGAZINES} magazines, <strong className="font-semibold text-black/70">sept chapitres chacun</strong> —
            les sept mêmes univers, traités autrement chaque semaine. Les 365 dates ne sont plus 365
            magazines : elles entrent dans ces {NOMBRE_DE_MAGAZINES} numéros, par l’un de leurs sept chapitres.
          </>
        }
        aDroite={
          <>
            <span className="rounded-full border border-black/10 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-black/50">
              {NOMBRE_DE_MAGAZINES * CHAPITRES.length + NOMBRE_DE_MAGAZINES} images attendues
            </span>
            <span className="rounded-full border border-black/10 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-black/50">
              {VISUELS_LIVRES} livrées{manquantes > 0 ? ` · ${manquantes} à livrer` : ''}
            </span>
          </>
        }
      >
        <div className="space-y-7">
          {SAISONS_DE_LA_COLLECTION.map((saison) => {
            const siens = MAGAZINES.filter((m) => m.saison.id === saison.id);
            return (
              <div key={saison.id}>
                <div className="flex flex-wrap items-baseline gap-3 border-b border-black/8 pb-2">
                  <h3 className="text-[15px] font-bold tracking-tight">
                    {saison.nom}
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-black/45">
                    {siens.length} magazines
                  </span>
                </div>
                <div className="no-scrollbar mt-3.5 flex items-start gap-3.5 overflow-x-auto pb-3">
                  {siens.map((magazine) => (
                    <Link
                      key={magazine.numero}
                      to={`/magazine?jour=${adresseDuJour(magazine.numero, annee)}`}
                      className="shrink-0 no-underline"
                      aria-label={`Ouvrir ${magazine.etiquette} — ${magazine.titre}`}
                    >
                      <MagazineSemaine magazine={magazine} taille="petite" />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-[18px] border border-black/8 bg-[#F7F6F3] px-5 py-4">
          <p className="min-w-[280px] flex-1 text-[13px] leading-relaxed text-black/60">
            La couverture appartient à <strong className="font-semibold text-black/75">la semaine</strong>, pas au jour :
            les sept dates du magazine 38 partagent la même image, et chacune ouvre <strong className="font-semibold text-black/75">son</strong> chapitre.
            Une couverture non livrée n’emprunte jamais le visuel d’une autre semaine : elle porte sa vignette éditoriale.
          </p>
          <Link to="/le-mariage" className="vp-btn vp-btn-glass vp-press">
            Les univers <ArrowRight size={14} />
          </Link>
        </div>
      </BlocMagazine>
    </div>
  );
}

/** `MM-JJ` du jour qui ouvre un magazine : son lundi, ou le premier jour de trop. */
function adresseDuJour(numero: number, annee: number): string {
  const jour = jourDuChapitre(numero, 1, annee);
  return `${String(jour.getMonth() + 1).padStart(2, '0')}-${String(jour.getDate()).padStart(2, '0')}`;
}
