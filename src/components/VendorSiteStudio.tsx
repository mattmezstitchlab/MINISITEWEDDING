import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BadgeEuro, Check, ExternalLink, Info, Plus, RotateCcw, Trash2,
} from 'lucide-react';
import PhoneFrame from './phone/PhoneFrame';
import VendorPhoneScreen from './phone/VendorPhoneScreen';
import { contentFor } from '../lib/universeContent';
import { styleById, type WeddingStyle } from '../lib/weddingStyles';
import { DOMAINES, domaineDe, metiersParDomaine } from '../lib/weddingVendors';
import { donneesMetier, estIntermittent, missionPourStyle } from '../lib/vendorModules';
import { previewPath } from '../lib/previewSite';
import { signatureFor } from '../lib/themeSignatures';
import {
  HEURES_INTERMITTENCE, avancementCachets, chargerDraft, draftParDefaut,
  enregistrerDraft, heuresCachets, oublierDraft, partageAvecLesMaries,
  type CachetsPlan, type VendorDraft,
} from '../lib/vendorDraft';

/**
 * L'ÉDITEUR DU PRESTATAIRE
 *
 * Le même éditeur que celui des mariés, monté pour un métier. Le hero ne bouge
 * pas — c'est le visuel de l'univers où l'on travaille — mais les modules
 * parlent la langue du métier : un chef lit « Ce qui passe en cuisine », un
 * photographe « La lumière et les lieux ».
 *
 * Rien ne se ressaisit : le programme, les régimes, les accès, les chiffres et
 * le décor viennent du site des mariés. Le prestataire n'écrit que sa part — sa
 * fiche mission, ses modules, et ses cachets quand il vit du spectacle.
 */

/** Le catalogue des métiers : il ne dépend que des univers, donc il ne bouge pas. */
const DOMAINES_METIERS = metiersParDomaine();

const CHAMP =
  'w-full rounded-[12px] border border-black/10 bg-white px-3 py-2 text-[13px] text-[#0B0C12] outline-none transition focus:border-black/35';

export default function VendorSiteStudio({
  initialRole,
  initialStyleId,
}: {
  initialRole: string;
  initialStyleId: string;
}) {
  const [role, setRole] = useState(initialRole);
  const [styleId, setStyleId] = useState(initialStyleId);
  const [ouvert, setOuvert] = useState<string | null>(null);
  const [draft, setDraft] = useState<VendorDraft>(
    () => chargerDraft(initialRole) ?? draftParDefaut(styleById(initialStyleId), initialRole),
  );

  const style = styleById(styleId);
  const content = useMemo(() => contentFor(style), [style]);
  /** Le geste de l'univers : l'aperçu du téléphone le porte aussi. */
  const signature = signatureFor(style.id);
  const mission = missionPourStyle(style, role);
  const intermittent = estIntermittent(role);

  // Le brouillon vit sur cet appareil : personne d'autre ne l'écrit, et il
  // survit au rechargement. Publier, c'est une autre étape.
  useEffect(() => {
    enregistrerDraft(draft);
  }, [draft]);

  const changerRole = (nouveau: string) => {
    setRole(nouveau);
    setDraft(chargerDraft(nouveau) ?? draftParDefaut(styleById(styleId), nouveau));
  };

  const changerStyle = (id: string) => setStyleId(id);

  const majModule = (id: string, patch: Partial<VendorDraft['modules'][number]>) =>
    setDraft((d) => ({ ...d, modules: d.modules.map((m) => (m.id === id ? { ...m, ...patch } : m)) }));

  const majLigne = (id: string, index: number, patch: { label?: string; valeur?: string }) =>
    setDraft((d) => ({
      ...d,
      modules: d.modules.map((m) =>
        m.id === id ? { ...m, lignes: m.lignes.map((l, i) => (i === index ? { ...l, ...patch } : l)) } : m,
      ),
    }));

  const ajouterLigne = (id: string) =>
    setDraft((d) => ({
      ...d,
      modules: d.modules.map((m) =>
        m.id === id ? { ...m, lignes: [...m.lignes, { label: 'Nouveau', valeur: '' }] } : m,
      ),
    }));

  const retirerLigne = (id: string, index: number) =>
    setDraft((d) => ({
      ...d,
      modules: d.modules.map((m) =>
        m.id === id ? { ...m, lignes: m.lignes.filter((_, i) => i !== index) } : m,
      ),
    }));

  const majCachets = (patch: Partial<CachetsPlan>) =>
    setDraft((d) => ({ ...d, cachets: { ...d.cachets, ...patch } }));

  const reinitialiser = () => {
    oublierDraft(role);
    setDraft(draftParDefaut(style, role));
  };

  const domaine = DOMAINES[domaineDe(role)] ?? DOMAINES.polyvalent;
  const heures = { declarees: heuresCachets(draft.cachets), seuil: HEURES_INTERMITTENCE };

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
      {/* ————————————————— l'écran, en vrai ————————————————— */}
      <div className="lg:sticky lg:top-24">
        <div className="rounded-[28px] border border-black/8 bg-[#F6F4F0] p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-black/45">
              Aperçu
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-black/50">
              <Check size={10} className="text-emerald-600" />
              Enregistré
            </span>
          </div>

          <PhoneFrame className="mx-auto w-[272px]">
            <VendorPhoneScreen
              style={style}
              content={content}
              mission={mission}
              metier={draft.modules}
              heures={heures}
              signature={signature}
            />
          </PhoneFrame>

          <p className="mt-4 text-[11.5px] leading-relaxed text-black/55">
            Le visuel est celui de l’univers <span className="font-semibold text-black/75">{style.name}</span>.
            Les modules sont les vôtres.
          </p>
        </div>

      </div>

      {/* ————————————————— l'écriture ————————————————— */}
      <div>
        <div className="rounded-[24px] border border-black/8 bg-white p-5">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="text-[14px] font-semibold text-black">{role}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/40">
              {domaine.label}
            </span>
          </div>
          <p className="mt-1 text-[12px] text-black/50">
            {signature ? `${style.name} — ${signature.nom.toLowerCase()}.` : `${style.name}.`}
          </p>

          {/* Le domaine */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-black/35">
              Domaine
            </span>
            {DOMAINES_METIERS.map((d) => (
              <button
                key={d.key}
                type="button"
                onClick={() => changerRole(d.metiers[0]?.role ?? role)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                  d.key === domaineDe(role)
                    ? 'bg-[#0B0C12] text-white'
                    : 'bg-black/5 text-black/60 hover:bg-black/10'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Le métier précis */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-black/35">
              Métier
            </span>
            {(DOMAINES_METIERS.find((d) => d.key === domaineDe(role))?.metiers ?? []).slice(0, 8).map((m) => (
              <button
                key={m.role}
                type="button"
                onClick={() => changerRole(m.role)}
                className={`rounded-full border px-3 py-1.5 text-[11px] transition ${
                  m.role === role
                    ? 'border-black bg-black text-white'
                    : 'border-black/12 text-black/65 hover:border-black/30'
                }`}
              >
                {m.short}
              </button>
            ))}
          </div>

          {/* L'univers du mariage */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-black/8 pt-3.5">
            <span className="mr-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-black/35">
              Univers
            </span>
            {universPourRole(role).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => changerStyle(s.id)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition ${
                  s.id === styleId ? 'bg-black/85 text-white' : 'bg-black/5 text-black/60 hover:bg-black/10'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* ————————————————— le volet des intermittents ————————————————— */}
        {intermittent && (
          <div className="mt-5 overflow-hidden rounded-[24px] border border-[#0B0C12]/12 bg-[#0B0C12] text-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <BadgeEuro size={16} className="text-white/70" />
                <div>
                  <div className="text-[13px] font-semibold">Intermittent du Spectacle</div>
                  <div className="text-[11px] text-white/55">
                    Vos cachets se déclarent, vos heures comptent.
                  </div>
                </div>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/70">
                Espace privé
              </span>
            </div>

            <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
              <label className="block">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/45">
                  Cachets prévus
                </span>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={draft.cachets.cachets}
                  onChange={(e) => majCachets({ cachets: Number(e.target.value) || 1 })}
                  className="mt-1.5 w-full rounded-[12px] border border-white/15 bg-white/8 px-3 py-2 text-[13px] text-white outline-none focus:border-white/40"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/45">
                  Heures par cachet
                </span>
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={draft.cachets.heuresParCachet}
                  onChange={(e) => majCachets({ heuresParCachet: Number(e.target.value) || 12 })}
                  className="mt-1.5 w-full rounded-[12px] border border-white/15 bg-white/8 px-3 py-2 text-[13px] text-white outline-none focus:border-white/40"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/45">
                  Heures déjà acquises
                </span>
                <input
                  type="number"
                  min={0}
                  max={507}
                  value={draft.cachets.heuresAcquises}
                  onChange={(e) => majCachets({ heuresAcquises: Number(e.target.value) || 0 })}
                  className="mt-1.5 w-full rounded-[12px] border border-white/15 bg-white/8 px-3 py-2 text-[13px] text-white outline-none focus:border-white/40"
                />
              </label>
              <div className="rounded-[18px] bg-white/6 p-3.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-[15px] font-bold">{heures.declarees} h</span>
                  <span className="font-mono text-[10px] text-white/50">sur {heures.seuil} h</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/12">
                  <div
                    className="h-full rounded-full bg-white"
                    style={{ width: `${avancementCachets(draft.cachets) * 100}%` }}
                  />
                </div>
                <div className="mt-2 text-[11px] leading-snug text-white/60">
                  {heures.declarees >= heures.seuil
                    ? 'Vos 507 heures sont couvertes.'
                    : `Encore ${heures.seuil - heures.declarees} h avant vos 507 heures.`}
                </div>
              </div>

              <label className="block sm:col-span-2">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/45">
                  Déclaration
                </span>
                <input
                  value={draft.cachets.declaration}
                  onChange={(e) => majCachets({ declaration: e.target.value })}
                  className="mt-1.5 w-full rounded-[12px] border border-white/15 bg-white/8 px-3 py-2 text-[13px] text-white outline-none focus:border-white/40"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/45">
                  Droits d’auteur
                </span>
                <input
                  value={draft.cachets.droits}
                  onChange={(e) => majCachets({ droits: e.target.value })}
                  className="mt-1.5 w-full rounded-[12px] border border-white/15 bg-white/8 px-3 py-2 text-[13px] text-white outline-none focus:border-white/40"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/45">
                  Défraiement
                </span>
                <input
                  value={draft.cachets.defraiement}
                  onChange={(e) => majCachets({ defraiement: e.target.value })}
                  className="mt-1.5 w-full rounded-[12px] border border-white/15 bg-white/8 px-3 py-2 text-[13px] text-white outline-none focus:border-white/40"
                />
              </label>
            </div>

            <div className="border-t border-white/10 px-5 py-3 text-[11px] leading-relaxed text-white/50">
              Ces lignes remplissent votre module « Cachets ». Elles ne partent pas sur le site
              public.
            </div>
          </div>
        )}

        {/* ————————————————— vos modules ————————————————— */}
        <div className="mt-5 space-y-3">
          {draft.modules.map((module) => {
            const ouvertIci = ouvert === module.id;
            return (
              <div key={module.id} className="overflow-hidden rounded-[22px] border border-black/8 bg-white">
                <button
                  type="button"
                  onClick={() => setOuvert(ouvertIci ? null : module.id)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <div>
                    <div className="font-mono text-[9.5px] font-bold uppercase tracking-[0.18em] text-black/40">
                      Onglet · {module.nav}
                    </div>
                    <div className="mt-0.5 text-[14px] font-semibold text-black">{module.titre}</div>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] text-black/35">
                    {module.lignes.length} lignes
                  </span>
                </button>

                {ouvertIci && (
                  <div className="space-y-3 border-t border-black/8 px-5 py-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block">
                        <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-black/40">
                          Titre au-dessus
                        </span>
                        <input
                          value={module.eyebrow}
                          onChange={(e) => majModule(module.id, { eyebrow: e.target.value })}
                          className={`mt-1.5 ${CHAMP}`}
                        />
                      </label>
                      <label className="block">
                        <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-black/40">
                          Nom de l’onglet
                        </span>
                        <input
                          value={module.nav}
                          onChange={(e) => majModule(module.id, { nav: e.target.value })}
                          className={`mt-1.5 ${CHAMP}`}
                        />
                      </label>
                    </div>

                    <label className="block">
                      <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-black/40">
                        Titre
                      </span>
                      <input
                        value={module.titre}
                        onChange={(e) => majModule(module.id, { titre: e.target.value })}
                        className={`mt-1.5 ${CHAMP}`}
                      />
                    </label>

                    <div className="space-y-2">
                      {module.lignes.map((ligne, i) => (
                        <div key={`${module.id}-${i}`} className="flex items-center gap-2">
                          <input
                            value={ligne.label}
                            onChange={(e) => majLigne(module.id, i, { label: e.target.value })}
                            className={`${CHAMP} sm:w-[38%]`}
                          />
                          <input
                            value={ligne.valeur}
                            onChange={(e) => majLigne(module.id, i, { valeur: e.target.value })}
                            className={CHAMP}
                          />
                          <button
                            type="button"
                            onClick={() => retirerLigne(module.id, i)}
                            aria-label="Retirer la ligne"
                            className="shrink-0 rounded-full p-2 text-black/35 transition hover:bg-black/5 hover:text-black"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => ajouterLigne(module.id)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1.5 text-[11.5px] font-semibold text-black/70 transition hover:bg-black/10"
                      >
                        <Plus size={12} /> Ajouter une ligne
                      </button>
                      {module.cachets && (
                        <span className="font-mono text-[10px] text-black/30">privé</span>
                      )}
                    </div>

                    <label className="block">
                      <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-black/40">
                        Phrase du bas
                      </span>
                      <textarea
                        value={module.note ?? ''}
                        onChange={(e) => majModule(module.id, { note: e.target.value })}
                        rows={2}
                        className={`mt-1.5 ${CHAMP} resize-none`}
                      />
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={reinitialiser}
            className="inline-flex items-center gap-2 rounded-full border border-black/12 px-4 py-2 text-[12px] font-semibold text-black/70 transition hover:border-black/30"
          >
            <RotateCcw size={13} /> Repartir des textes du métier
          </button>
          <span className="font-mono text-[10px] text-black/35">
            Enregistré sur cet appareil · {draft.modules.length} modules
          </span>
        </div>

        {/* ————————————————— la connexion avec le site des mariés ————————————————— */}
        <div className="mt-8 rounded-[24px] border border-black/8 bg-[#F6F4F0] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Info size={15} className="text-black/45" />
              <div>
                <div className="text-[13px] font-semibold text-black">Ce qui vient des mariés</div>
                <div className="text-[11.5px] text-black/55">Rien à ressaisir.</div>
              </div>
            </div>
            <Link
              to={previewPath({ styleId: style.id })}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[11.5px] font-semibold text-black/70 no-underline transition hover:text-black"
            >
              Leur mini-site <ExternalLink size={12} />
            </Link>
          </div>

          <div className="mt-3 divide-y divide-black/8">
            {partageAvecLesMaries(donneesMetier(style, role)).map((bloc) => (
              <div key={bloc.id} className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5 py-2.5">
                <span className="text-[12.5px] font-semibold text-black">{bloc.titre}</span>
                <span className="min-w-0 flex-1 truncate text-[11.5px] text-black/55">
                  {bloc.lignes.slice(0, 3).map((l) => l.valeur).join(' · ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Les univers où ce rôle est prévu — sinon de quoi choisir quand même. */
function universPourRole(role: string): WeddingStyle[] {
  const domaine = DOMAINES_METIERS.find((d) => d.key === domaineDe(role));
  const metier = domaine?.metiers.find((m) => m.role === role);
  const ids = metier?.universes.map((u) => u.id) ?? [];
  const styles = ids.slice(0, 8).map((id) => styleById(id));
  return styles.length > 0 ? styles : [styleById('vierge')];
}
