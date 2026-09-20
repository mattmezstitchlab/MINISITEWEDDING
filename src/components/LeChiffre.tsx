import { useState } from 'react';
import { Eye, EyeOff, Eraser, Lock, RotateCcw, ScrollText } from 'lucide-react';
import {
  CONFIDENTIALITE_CHIFFRE, chiffresDeLaPersonne, anneePersonnelle, effacerChiffre, enregistrerChiffre,
  laRegle, motsDuChiffre, useChiffre, type Naissance,
} from '../lib/chiffre';

/**
 * LE CHIFFRE — LE NOMBRE, SES MOTS, ET SA RÈGLE
 *
 * Un chiffre se montre **avec sa règle** : d'où il vient, comment il est calculé,
 * et jusqu'où il ne va pas. Un clic ouvre le calcul ; un autre, la règle entière.
 *
 * **Rien n'est demandé.** La date de naissance est facultative, elle n'est pas
 * une condition d'entrée, et elle reste **privée** tant que la personne n'a pas
 * choisi autre chose — le sélecteur est là, sous ses yeux.
 *
 * L'affichage ne dit jamais qui l'on est : il dit **dans quelle famille on se
 * reconnaît**, et c'est la personne qui tranche.
 */

const CHAMP =
  'w-full rounded-[14px] border border-black/10 bg-white px-3.5 py-2.5 text-[14px] text-[#0B0C12] outline-none transition placeholder:text-black/30 focus:border-black/40';

export default function LeChiffre({ prenom: prenomPropose = '' }: { prenom?: string }) {
  const naissance = useChiffre();
  const [prenom, setPrenom] = useState(prenomPropose);
  const [nomDeNaissance, setNomDeNaissance] = useState('');
  const [date, setDate] = useState('');
  const [voirLeCalcul, setVoirLeCalcul] = useState(false);

  const chiffres = chiffresDeLaPersonne(naissance?.prenom ?? '', naissance?.nomDeNaissance ?? '', naissance?.date ?? '');
  const principal = chiffres.chemin ?? chiffres.expression;
  const mots = principal ? motsDuChiffre(principal.nombre) : null;
  const annee = naissance?.date ? anneePersonnelle(naissance.date, new Date().getFullYear()) : null;

  const poser = () => enregistrerChiffre({ prenom, nomDeNaissance, date, cible: 'prive' });
  const changerCible = (cible: Naissance['cible']) => {
    if (!naissance) return;
    enregistrerChiffre({ ...naissance, cible });
  };
  const reprendre = () => {
    setPrenom(naissance?.prenom ?? '');
    setNomDeNaissance(naissance?.nomDeNaissance ?? '');
    setDate(naissance?.date ?? '');
    effacerChiffre();
  };

  return (
    <section id="chiffre" className="vp-page py-14">
      <span className="vp-eyebrow">Le chiffre</span>
      <h2 className="vp-title mt-3 text-[clamp(1.5rem,3.2vw,2.2rem)]">
        Un chiffre, et sa règle — jamais un jugement.
      </h2>
      <p className="mt-3 max-w-[680px] text-[15px] leading-relaxed text-black/70">
        La tradition donne un nombre à une date et à un nom. Ici, ce nombre ne sert qu’à une
        chose : dire dans quelle famille on se reconnaît. Il ne dit pas qui vous êtes, il ne
        prédit rien, et si aucun mot ne vous va — c’est le mot qui a tort.
      </p>

      {/* — RIEN ENCORE : ON DEMANDE, SANS RIEN EXIGER — */}
      {!naissance && (
        <div className="mt-7 grid max-w-[720px] gap-4 rounded-[20px] border border-black/8 bg-white p-5 sm:grid-cols-3">
          <label className="block">
            <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.2em] text-black/45">Prénom</span>
            <input className={`${CHAMP} mt-2`} value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Claire" />
          </label>
          <label className="block">
            <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.2em] text-black/45">
              Nom de naissance
            </span>
            <input
              className={`${CHAMP} mt-2`}
              value={nomDeNaissance}
              onChange={(e) => setNomDeNaissance(e.target.value)}
              placeholder="celui qui ne change pas"
            />
          </label>
          <label className="block">
            <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.2em] text-black/45">
              Date de naissance
            </span>
            <input type="date" className={`${CHAMP} mt-2`} value={date} onChange={(e) => setDate(e.target.value)} />
          </label>

          <div className="sm:col-span-3">
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={poser} disabled={!prenom && !nomDeNaissance && !date} className="vp-btn vp-press">
                Calculer mon chiffre
              </button>
              <span className="inline-flex items-center gap-1.5 text-[12px] text-black/50">
                <Lock size={12} /> Facultatif, et privé : personne ne le voit sans votre accord.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* — LE CHIFFRE — */}
      {naissance && principal && mots && (
        <div className="mt-7 max-w-[900px]">
          <div className="flex flex-wrap items-end gap-6 rounded-[22px] border border-black/8 bg-white p-6">
            <div>
              <div className="font-mono text-[9.5px] font-bold uppercase tracking-[0.22em] text-black/45">
                {chiffres.chemin ? 'Chemin de vie' : 'Nombre d’expression'}
              </div>
              <div className="mt-1 text-[clamp(3.4rem,9vw,5.4rem)] font-bold leading-none">{principal.nombre}</div>
            </div>
            <div className="min-w-[220px] flex-1">
              <div className="text-[15px] font-bold">{mots.nom}</div>
              <p className="mt-1 text-[15px] leading-relaxed text-black/70">{mots.mots}.</p>
              <p className="mt-2 text-[12.5px] text-black/45">
                {naissance.prenom || 'Sans nom'} ·{' '}
                {[chiffres.expression.nombre, chiffres.intime.nombre, chiffres.personnalite.nombre].join(' · ')} — nom, voyelles, consonnes
                {annee ? ` · l’année ${new Date().getFullYear()} : ${annee}` : ''}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setVoirLeCalcul((v) => !v)}
              className="vp-btn vp-btn-glass vp-press"
              aria-expanded={voirLeCalcul}
            >
              <ScrollText size={14} /> {voirLeCalcul ? 'Masquer le calcul' : 'Voir le calcul'}
            </button>
          </div>

          {voirLeCalcul && (
            <div className="mt-4 space-y-4 rounded-[20px] border border-black/8 bg-white p-5">
              <div>
                <div className="font-mono text-[9.5px] font-bold uppercase tracking-[0.22em] text-black/45">
                  Le calcul, pas à pas
                </div>
                <ul className="mt-3 space-y-1.5">
                  {[chiffres.chemin, chiffres.expression, chiffres.intime, chiffres.personnalite]
                    .filter((d): d is NonNullable<typeof d> => Boolean(d))
                    .flatMap((d) => d.pas)
                    .map((ligne) => (
                      <li key={ligne} className="font-mono text-[12px] leading-relaxed text-black/65">
                        {ligne}
                      </li>
                    ))}
                </ul>
              </div>
              <div className="border-t border-black/10 pt-4">
                <div className="font-mono text-[9.5px] font-bold uppercase tracking-[0.22em] text-black/45">
                  La règle, entière
                </div>
                <ul className="mt-3 space-y-2">
                  {laRegle().map((r) => (
                    <li key={r} className="text-[13.5px] leading-relaxed text-black/70">
                      — {r.replace(/\*\*/g, '')}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* — QUI LE VOIT : LE CHOIX, SOUS LES YEUX — */}
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-[18px] border border-black/8 bg-white px-5 py-4">
            <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.22em] text-black/45">
              Qui peut le voir
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {CONFIDENTIALITE_CHIFFRE.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => changerCible(c.id)}
                  aria-pressed={naissance.cible === c.id}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition ${
                    naissance.cible === c.id
                      ? 'border-black bg-[#0B0C12] text-white'
                      : 'border-black/10 text-black/60 hover:border-black/40 hover:text-black'
                  }`}
                >
                  {c.id === 'prive' ? <EyeOff size={12} /> : <Eye size={12} />} {c.nom}
                </button>
              ))}
            </div>
            <span className="text-[12.5px] text-black/50">
              {CONFIDENTIALITE_CHIFFRE.find((c) => c.id === naissance.cible)?.qui}
            </span>
            <button
              type="button"
              onClick={reprendre}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-[11.5px] font-semibold text-black/50 transition hover:border-black/30 hover:text-black"
            >
              <Eraser size={12} /> Effacer
            </button>
          </div>
        </div>
      )}

      {/* — CE QUE LE CHIFFRE NE FERA JAMAIS — */}
      <ul className="mt-6 grid max-w-[900px] gap-3 sm:grid-cols-3">
        {[
          'Il ne compare personne : deux chiffres ne font pas un couple.',
          'Il ne dit ni dette, ni mieux, ni moins bien : neuf familles, à égalité.',
          'Il ne prédit rien, et jamais la santé.',
        ].map((ligne) => (
          <li key={ligne} className="flex items-start gap-2 rounded-[16px] border border-black/8 bg-white px-4 py-3 text-[13px] leading-relaxed text-black/65">
            <RotateCcw size={13} className="mt-0.5 shrink-0 text-black/35" /> {ligne}
          </li>
        ))}
      </ul>
    </section>
  );
}
