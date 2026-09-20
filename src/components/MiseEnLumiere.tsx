import { CHARTE, QUI_EDITE, SIGNATURE_EDITEUR } from '../lib/charte';
import { PALIERS, miseEnLumiere, profilDeBase, type Profil } from '../lib/miseEnLumiere';

/**
 * LA MISE EN LUMIÈRE — LA PAGE QUI DIT CE QU'ON GAGNE À SE MONTRER
 *
 * Le magazine ne demande rien : il rend ce qu'on lui donne. Plus le profil est
 * complet, plus on est vu — et le jour de sa fête, la couverture est la sienne.
 * La charte, elle, est le prix d'entrée : c'est elle qui permet d'aligner des
 * inconnus côte à côte sans que le magazine y perde la figure.
 */
export default function MiseEnLumiere({ profil = profilDeBase() }: { profil?: Profil }) {
  const lumiere = miseEnLumiere(profil);
  const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Les six paliers. */}
      <div>
        <div className="flex flex-wrap items-baseline gap-3">
          <h3 className="text-[17px] font-bold tracking-tight">Les six paliers</h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/45">
            vous êtes au {lumiere.palier.n} — {lumiere.points} points sur {lumiere.sur}
          </span>
        </div>
        <ol className="mt-4 space-y-2">
          {PALIERS.map((p) => (
            <li
              key={p.n}
              aria-current={p.n === lumiere.palier.n ? 'step' : undefined}
              className={`rounded-[16px] border px-4 py-3 transition ${
                p.n <= lumiere.palier.n ? 'border-black/15 bg-white' : 'border-black/8 bg-white/50'
              }`}
            >
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-mono text-[10px] tabular-nums text-black/40">{String(p.n).padStart(2, '0')}</span>
                <span className="text-[14.5px] font-bold">{p.nom}</span>
                <span className="text-[12px] text-black/50">— {p.ceQuOnVoit}</span>
              </div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-black/55">{p.debloque}</p>
            </li>
          ))}
        </ol>

        {lumiere.pourMonter.length > 0 && (
          <p className="mt-4 text-[13px] text-black/60">
            Pour monter : <span className="font-semibold text-black">{lumiere.pourMonter.join(', ')}</span>.
          </p>
        )}
      </div>

      {/* Le jour de sa fête, et ce que la lumière ouvre. */}
      <div className="space-y-6">
        <div className="rounded-[18px] border border-black/12 bg-[#0B0C12] p-5 text-white">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
            Le jour de votre fête
          </span>
          {lumiere.fete ? (
            <>
              <h3 className="vp-title mt-2 text-[20px]">
                {lumiere.fete.jour} {mois[lumiere.fete.mois - 1]}
              </h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-white/70">
                {lumiere.enCouvertureAujourdHui
                  ? 'C’est aujourd’hui : la couverture du magazine est la vôtre, avec les personnes alignées autour de vous selon vos informations.'
                  : `Ce jour-là, la couverture peut être la vôtre — et le même jour, ailleurs, d’autres fêtent le même prénom : vous êtes alignés sans le savoir.`}
              </p>
              {lumiere.joursQuiPortentSonNom > 1 && (
                <p className="mt-1 text-[12px] text-white/50">
                  Votre prénom revient {lumiere.joursQuiPortentSonNom} fois dans l’année.
                </p>
              )}
            </>
          ) : (
            <p className="mt-2 text-[12.5px] leading-relaxed text-white/70">
              Votre prénom n’est pas au calendrier des 364 : vous gardez le vôtre, et vous choisissez votre jour.
            </p>
          )}
        </div>

        <div>
          <h3 className="text-[15px] font-bold tracking-tight">Ce que la lumière ouvre</h3>
          <ul className="mt-3 space-y-2">
            {lumiere.opportunites.map((o) => (
              <li key={o} className="flex gap-2 text-[13px] leading-relaxed text-black/65">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-black/40" />
                {o}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[15px] font-bold tracking-tight">La charte — le prix d’entrée</h3>
          <ul className="mt-3 space-y-2">
            {CHARTE.map((r) => (
              <li key={r.id} className="text-[12.5px] leading-relaxed text-black/60">
                <span className="font-semibold text-black">{r.regle}</span> {r.pourquoi}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[12.5px] text-black/50">
            {QUI_EDITE} — signé {SIGNATURE_EDITEUR}.
          </p>
        </div>
      </div>
    </div>
  );
}
