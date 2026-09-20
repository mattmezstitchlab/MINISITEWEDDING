import { Link } from 'react-router-dom';
import { ArrowRight, Clock3, History } from 'lucide-react';
import {
  GESTES, anneesDuTemps, dateDUneLigne, heureCourte, jourCourt, lignesDeLAnnee, lignesDuJour,
  moisDeLAnnee, regleDuGeste, resumeDuTemps, useTemps, type Ligne,
} from '../lib/temps';

/**
 * LE TEMPS — LA TIMELINE, TOUT EN BAS DU FOOTER
 *
 * Le footer est le dernier endroit du site : c'est là que le temps se lit.
 * **Trois échelles**, les mêmes partout ailleurs : le jour (ce qui vient de se
 * passer), l'année (les douze mois, ce que le cadran dessinera), et depuis le
 * début (les années, avec leurs gestes).
 *
 * Chaque ligne dit **ce qui s'est passé, son heure et sa famille** — la source
 * est toujours dite. Le lien ouvre la **timeline complète** (`/timeline`), qui
 * existe déjà : elle n'était simplement branchée nulle part.
 */

function LigneDuTemps({ ligne }: { ligne: Ligne }) {
  const regle = regleDuGeste(ligne.type);
  return (
    <li className="flex items-baseline gap-3 border-b border-white/8 py-2.5 last:border-0">
      <span className="w-14 shrink-0 font-mono text-[11px] text-white/45">{heureCourte(ligne.quand)}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] leading-snug text-white/85">{ligne.titre}</span>
        <span className="mt-0.5 block text-[11.5px] text-white/45">
          {regle?.nom}
          {ligne.detail ? ` · ${ligne.detail}` : ''}
          {ligne.ou ? ` · ${ligne.ou}` : ''}
        </span>
      </span>
    </li>
  );
}

export default function LeTemps() {
  const lignes = useTemps();
  const maintenant = new Date();
  const annee = maintenant.getFullYear();
  const duJour = lignesDuJour(lignes);
  const deLAnnee = lignesDeLAnnee(lignes, annee);
  const mois = moisDeLAnnee(lignes, annee);
  const annees = anneesDuTemps(lignes);
  const resume = resumeDuTemps(lignes);
  const maximum = Math.max(1, ...mois.map((m) => m.gestes));

  return (
    <section id="temps" className="vp-page mt-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
            Le temps
          </span>
          <h2 className="vp-title mt-2 text-[clamp(1.4rem,3vw,2rem)] text-white">
            Ce qui s’est passé, à sa date
          </h2>
          <p className="mt-2 max-w-[680px] text-[13.5px] leading-relaxed text-white/55">
            Chaque geste du site s’écrit ici, une ligne à la fois : la carte retenue, le chiffre posé, le
            document validé, la page ouverte. Rien n’est réécrit — et c’est pour ça qu’on peut{' '}
            <strong className="font-bold text-white/80">rejouer</strong> un jour, un mois, une année.
          </p>
        </div>
        <Link to="/timeline" className="vp-btn vp-btn-glass vp-press">
          <History size={14} /> La timeline complète
        </Link>
      </div>

      {/* — L'ÉTAT DU TEMPS, EN UNE LIGNE — */}
      <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
        <span>{resume.total} geste{resume.total > 1 ? 's' : ''}</span>
        {resume.premier && <span>depuis le {dateDUneLigne(resume.premier.quand)}</span>}
        {resume.derniere && <span>dernier : {dateDUneLigne(resume.derniere.quand)}</span>}
        {resume.famille && <span>le plus souvent : {resume.famille.nom.toLowerCase()}</span>}
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* — LE JOUR — */}
        <div className="rounded-[18px] border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center gap-2">
            <Clock3 size={13} className="text-white/45" />
            <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.2em] text-white/50">
              Aujourd’hui · {jourCourt(maintenant.toISOString())}
            </span>
          </div>
          {duJour.length === 0 ? (
            <p className="mt-3 text-[13px] leading-relaxed text-white/45">
              Rien encore aujourd’hui. Le premier geste de la journée s’écrira ici, avec son heure.
            </p>
          ) : (
            <ul className="mt-3">
              {duJour.map((ligne) => (
                <LigneDuTemps key={ligne.id} ligne={ligne} />
              ))}
            </ul>
          )}
        </div>

        {/* — L'ANNÉE, EN DOUZE PARTS : la première lecture du cadran — */}
        <div className="rounded-[18px] border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.2em] text-white/50">
              L’année {annee}
            </span>
            <span className="font-mono text-[11px] text-white/40">{deLAnnee.length} gestes</span>
          </div>
          <ul className="mt-4 space-y-1.5">
            {mois.map((m) => (
              <li key={m.nom} className="flex items-center gap-3">
                <span className="w-16 shrink-0 text-[11.5px] capitalize text-white/50">{m.nom}</span>
                <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/10">
                  <span
                    className="block h-full rounded-full bg-white/70"
                    style={{ width: `${Math.round((m.gestes / maximum) * 100)}%` }}
                  />
                </span>
                <span className="w-6 shrink-0 text-right font-mono text-[11px] text-white/45">{m.gestes}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[11.5px] leading-relaxed text-white/40">
            La même année, en cadran : l’angle pour le jour, le rayon pour ce qui s’est passé, la couleur
            pour l’année. C’est le dessin que la passe suivante apportera.
          </p>
        </div>
      </div>

      {/* — DEPUIS LE DÉBUT : les années, et leurs familles de gestes — */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {annees.length === 0 ? (
          <span className="text-[12.5px] text-white/40">
            Aucune année pour l’instant : le temps commence au premier geste.
          </span>
        ) : (
          annees.map((a) => (
            <span
              key={a}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-1.5 text-[12px] text-white/65"
            >
              {a}
              <span className="font-mono text-[10.5px] text-white/40">
                {lignesDeLAnnee(lignes, a).length}
              </span>
            </span>
          ))
        )}
      </div>

      {/* — LES FAMILLES : ce que le temps sait écrire — */}
      <div className="mt-6 flex flex-wrap gap-2">
        {GESTES.map((geste) => (
          <span
            key={geste.id}
            title={geste.sens}
            className="rounded-full border border-white/10 px-3 py-1 text-[11.5px] text-white/50"
          >
            {geste.nom}
          </span>
        ))}
      </div>

      <p className="mt-6 flex flex-wrap items-center gap-2 text-[12px] text-white/40">
        La timeline du mariage et des archives existe déjà, et elle est ouverte :
        <Link to="/timeline" className="inline-flex items-center gap-1 text-white/70 underline-offset-4 hover:underline">
          l’ouvrir <ArrowRight size={12} />
        </Link>
      </p>
    </section>
  );
}
