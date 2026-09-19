import { useState } from 'react';
import { Type, Palette, Layout, Smartphone, Monitor, Check, ArrowRight, Sliders } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SECTION_DEFAULTS } from '../lib/defaults';

/** Les sections réellement composées dans un mini-site VOWS. */
const SITE_SECTIONS = SECTION_DEFAULTS.map((section) => section.title);

const TYPO_PREVIEWS = [
  { id: 'editorial', name: 'Éditorial Serif', font: 'Georgia, serif', sample: 'Sarah & Gabriel', note: 'Magazine & haute couture' },
  { id: 'sans', name: 'Sans Contemporain', font: 'Inter, sans-serif', sample: 'Sarah & Gabriel', note: 'Net, moderne et architectural' },
  { id: 'spatial', name: 'Vision Spatiale', font: '-apple-system, sans-serif', sample: 'Sarah & Gabriel', note: 'Typographie visionOS' },
];

const ACCENT_COLORS = [
  { name: 'Noir Pur', hex: '#111111' },
  { name: 'Or Riviera', hex: '#C5A059' },
  { name: 'Terre Cuite', hex: '#B88258' },
  { name: 'Orange Feu', hex: '#FF4D00' },
  { name: 'Rose Magenta', hex: '#FF00E5' },
  { name: 'Vert Forêt', hex: '#2F6F4E' },
];

export default function EditorShowcase() {
  const [selectedTypo, setSelectedTypo] = useState(TYPO_PREVIEWS[0]);
  const [selectedColor, setSelectedColor] = useState(ACCENT_COLORS[1]);
  const [activeDevice, setActiveDevice] = useState<'mobile' | 'desktop'>('desktop');
  const [activeTab, setActiveTab] = useState<'style' | 'modules'>('style');

  return (
    <section className="relative overflow-hidden bg-white px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        {/* En-tête */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="vp-eyebrow">Après l’onboarding</div>
          <h2 className="vp-h2 mt-4" style={{ fontSize: 'clamp(2rem, 4.4vw, 3.2rem)' }}>
            Votre mini-site complet,<br />
            modifiable section par section.
          </h2>
          <p className="vp-body mt-4 max-w-xl mx-auto">
            Dès que votre carte est créée, l’éditeur s’ouvre sur le site entier : {SITE_SECTIONS.length} sections
            déjà remplies avec votre univers — le programme heure par heure, les lieux, le RSVP, la cagnotte, la
            galerie, la FAQ. Vous ajustez la typographie, la couleur signature et l’ordre des sections, et vous
            voyez le résultat instantanément, au bureau comme sur téléphone.
          </p>
        </div>

        {/* Maquette de l'Éditeur */}
        <div className="mt-14 overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-[0_24px_70px_-20px_rgba(0,0,0,0.12)] ring-1 ring-black/5">
          {/* Topbar de l'éditeur */}
          <div className="flex items-center justify-between border-b border-black/5 bg-[#FAFAFA] px-5 py-3.5 sm:px-7">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-black/12" />
              <span className="h-3 w-3 rounded-full bg-black/18" />
              <span className="h-3 w-3 rounded-full bg-black/24" />
              <span className="ml-3 hidden text-[13px] font-semibold text-[#0B0C12] sm:inline">
                Studio VOWS · Éditeur de site
              </span>
            </div>

            {/* Bascule mobile / desktop */}
            <div className="flex items-center gap-1 rounded-full border border-black/10 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveDevice('desktop')}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold transition ${
                  activeDevice === 'desktop'
                    ? 'bg-[#0B0C12] text-white shadow-sm'
                    : 'text-[var(--vp-muted)] hover:text-[#0B0C12]'
                }`}
              >
                <Monitor size={13} />
                <span className="hidden sm:inline">Bureau</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveDevice('mobile')}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold transition ${
                  activeDevice === 'mobile'
                    ? 'bg-[#0B0C12] text-white shadow-sm'
                    : 'text-[var(--vp-muted)] hover:text-[#0B0C12]'
                }`}
              >
                <Smartphone size={13} />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            <Link to="/creer" className="vp-btn vp-press !px-4 !py-1.5 !text-[12.5px]">
              Créer notre site <ArrowRight size={13} />
            </Link>
          </div>

          {/* Corps de l'Éditeur : Panneau de réglages à gauche + Prévisualisation en direct à droite */}
          <div className="grid lg:grid-cols-12 min-h-[520px]">
            {/* Panneau de réglages latéral */}
            <div className="lg:col-span-4 border-r border-black/5 p-6 space-y-6 bg-white">
              {/* Onglets de configuration */}
              <div className="flex rounded-xl bg-black/[0.04] p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('style')}
                  className={`flex-1 rounded-lg py-1.5 text-[12.5px] font-semibold transition ${
                    activeTab === 'style' ? 'bg-white shadow-sm text-[#0B0C12]' : 'text-[var(--vp-muted)]'
                  }`}
                >
                  Apparence &amp; Style
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('modules')}
                  className={`flex-1 rounded-lg py-1.5 text-[12.5px] font-semibold transition ${
                    activeTab === 'modules' ? 'bg-white shadow-sm text-[#0B0C12]' : 'text-[var(--vp-muted)]'
                  }`}
                >
                  Sections &amp; Modules
                </button>
              </div>

              {activeTab === 'style' ? (
                <>
                  {/* Choix de la couleur d'accent */}
                  <div>
                    <div className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-[var(--vp-muted)] mb-3">
                      <Palette size={14} /> Couleur signature
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {ACCENT_COLORS.map((c) => {
                        const isSelected = selectedColor.hex === c.hex;
                        return (
                          <button
                            key={c.hex}
                            type="button"
                            onClick={() => setSelectedColor(c)}
                            className="h-8 w-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
                            style={{ background: c.hex }}
                            title={c.name}
                          >
                            {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Choix de la typographie */}
                  <div>
                    <div className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-[var(--vp-muted)] mb-3">
                      <Type size={14} /> Typographie des titres
                    </div>
                    <div className="space-y-2">
                      {TYPO_PREVIEWS.map((t) => {
                        const isSelected = selectedTypo.id === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setSelectedTypo(t)}
                            className={`w-full rounded-xl border p-3 text-left transition ${
                              isSelected
                                ? 'border-[#0B0C12] bg-black/[0.03] ring-1 ring-[#0B0C12]'
                                : 'border-black/10 hover:border-black/20'
                            }`}
                          >
                            <div className="text-[16px] font-semibold leading-tight text-[#0B0C12]" style={{ fontFamily: t.font }}>
                              {t.sample}
                            </div>
                            <div className="mt-1 flex items-center justify-between text-[11px] text-[var(--vp-muted)]">
                              <span>{t.name}</span>
                              <span className="text-[10px]">{t.note}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                /* Liste des modules réorganisables */
                <div className="space-y-2">
                  <div className="text-[12px] font-bold uppercase tracking-wider text-[var(--vp-muted)] mb-3 flex items-center gap-1.5">
                    <Layout size={14} /> Structure activée
                  </div>
                  {['Hero & Titre', 'Notre Histoire', 'Programme du Jour J', 'Adresses & Itinéraires', 'RSVP en ligne', 'Cagnotte & Cadeaux', 'Galerie photos'].map((m, i) => (
                    <div key={m} className="flex items-center justify-between rounded-xl border border-black/10 bg-white p-2.5 text-[13px] font-medium text-[#0B0C12] shadow-sm">
                      <span className="flex items-center gap-2">
                        <span className="vp-num text-[11px] text-[var(--vp-muted)]">0{i + 1}</span>
                        {m}
                      </span>
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Zone de prévisualisation en direct (Canvas) */}
            <div className="lg:col-span-8 bg-[#F4F4F3] p-4 sm:p-8 flex items-center justify-center min-h-[580px]">
              {activeDevice === 'mobile' ? (
                /* Vrai iPhone interactif fidèle à la landing */
                <div className="relative">
                  {/* Lueur subtile posée sous l’iPhone */}
                  <div
                    aria-hidden="true"
                    className="absolute -inset-x-8 -bottom-6 h-20 rounded-[50%] opacity-50 blur-2xl transition-colors duration-500"
                    style={{ background: `radial-gradient(closest-side, ${selectedColor.hex}55, transparent)` }}
                  />
                  <div className="vp-perspective relative w-[295px] rounded-[48px] bg-[#0B0C12] p-[9.5px] shadow-[0_36px_90px_-24px_rgba(11,12,18,0.7)] ring-1 ring-black/20 sm:w-[315px]">
                    <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[39px] bg-[#0B0C12]">
                      {/* Îlot dynamique */}
                      <div className="absolute left-1/2 top-2 z-20 h-[20px] w-[82px] -translate-x-1/2 rounded-full bg-[#0B0C12] shadow-sm" />

                      {/* Écran scrollable de l'iPhone */}
                      <div className="no-scrollbar absolute inset-0 overflow-y-auto bg-white pt-7 text-[#0B0C12]">
                        {/* En-tête photo Hero */}
                        <div className="relative h-56 w-full overflow-hidden">
                          <img
                            src="/images/chateau.jpg"
                            alt=""
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                            <span className="text-[8.5px] font-semibold uppercase tracking-[0.22em] text-white/70">
                              Nous nous marions
                            </span>
                            <h1
                              className="mt-1 text-[24px] leading-tight drop-shadow-md"
                              style={{ fontFamily: selectedTypo.font }}
                            >
                              Sarah &amp; Gabriel
                            </h1>
                            <div className="mt-1.5 flex items-center gap-2">
                              <span className="text-[10px] text-white/80">12 Juin 2027 · Champlâtreux</span>
                              <span
                                className="rounded-full px-2 py-0.5 text-[8px] font-bold text-white shadow-sm"
                                style={{ background: selectedColor.hex }}
                              >
                                J-267
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Contenu et modules dans l'iPhone */}
                        <div className="p-4 space-y-3.5">
                          {/* Module Cérémonie & RSVP */}
                          <div className="rounded-2xl border border-black/5 bg-[#FAFAFA] p-3.5 shadow-sm">
                            <div className="text-[9px] font-bold uppercase tracking-wider text-[var(--vp-muted)]">
                              Cérémonie laïque
                            </div>
                            <div className="text-[12.5px] font-semibold text-[#0B0C12] mt-0.5">
                              Parc du domaine · 15h30
                            </div>
                            <button
                              type="button"
                              className="mt-2.5 w-full rounded-full py-2 text-[11px] font-semibold text-white shadow-sm transition"
                              style={{ background: selectedColor.hex }}
                            >
                              Confirmer ma présence (RSVP)
                            </button>
                          </div>

                          {/* Mini Galerie Photos */}
                          <div>
                            <div className="text-[9px] font-bold uppercase tracking-wider text-[var(--vp-muted)] mb-1.5">
                              Moments choisis
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                              {['/images/alliances.jpg', '/images/danse.jpg', '/images/champagne.jpg'].map((src) => (
                                <div key={src} className="overflow-hidden rounded-xl aspect-square shadow-sm">
                                  <img src={src} alt="" className="h-full w-full object-cover" />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Informations pratiques */}
                          <div className="rounded-2xl border border-black/5 bg-[#FAFAFA] p-3 text-[10.5px] space-y-1 text-[var(--vp-muted)]">
                            <div className="font-semibold text-[#0B0C12]">Accès &amp; Navettes</div>
                            <div>Navettes privées au départ de Paris toutes les 30 min.</div>
                          </div>
                        </div>

                        {/* Footer mini-site */}
                        <div className="p-4 pb-6 text-center text-[8px] uppercase tracking-widest text-[var(--vp-muted)]">
                          Sarah &amp; Gabriel · VOWS
                        </div>
                      </div>

                      {/* Barre d’accueil iPhone */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-1.5 z-20 flex justify-center">
                        <span className="h-1 w-24 rounded-full bg-black/30" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Vue Bureau (Desktop) moderne */
                <div className="w-full max-w-2xl overflow-hidden rounded-[22px] border border-black/10 bg-white shadow-xl transition-all duration-300">
                  {/* Entête du site généré */}
                  <div className="relative h-60 sm:h-68 w-full overflow-hidden">
                    <img
                      src="/images/chateau.jpg"
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                        Nous nous marions
                      </span>
                      <h1
                        className="mt-1 text-[30px] sm:text-[36px] leading-tight drop-shadow-md"
                        style={{ fontFamily: selectedTypo.font }}
                      >
                        Sarah &amp; Gabriel
                      </h1>
                      <div className="mt-2.5 flex items-center gap-2.5">
                        <span className="text-[12px] text-white/85">12 Juin 2027 · Château de Champlâtreux</span>
                        <span
                          className="rounded-full px-2.5 py-0.5 text-[9.5px] font-bold text-white shadow-sm"
                          style={{ background: selectedColor.hex }}
                        >
                          J-267
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contenu simulé Bureau */}
                  <div className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-black/5 pb-4">
                      <div>
                        <div className="text-[10.5px] font-bold uppercase tracking-wider text-[var(--vp-muted)]">Cérémonie laïque</div>
                        <div className="text-[14px] font-semibold text-[#0B0C12] mt-0.5">Parc du domaine · 15h30</div>
                      </div>
                      <button
                        type="button"
                        className="rounded-full px-4 py-1.5 text-[12px] font-semibold text-white transition shadow-sm"
                        style={{ background: selectedColor.hex }}
                      >
                        Confirmer RSVP
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 pt-1">
                      {['/images/alliances.jpg', '/images/danse.jpg', '/images/champagne.jpg'].map((src) => (
                        <div key={src} className="overflow-hidden rounded-xl aspect-square shadow-sm">
                          <img src={src} alt="" className="h-full w-full object-cover hover:scale-105 transition duration-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Les sections réellement écrites, et le passage à l'acte */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {SITE_SECTIONS.map((titre) => (
            <span
              key={titre}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-[#0B0C12]"
            >
              <Check size={12} className="text-emerald-600" />
              {titre}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/creer" className="vp-btn vp-press !px-7">
            Créer notre site <ArrowRight size={15} />
          </Link>
          <button
            type="button"
            onClick={() => document.getElementById('hero-ai-container')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
            className="vp-btn vp-btn-glass vp-press !px-7"
          >
            Choisir notre univers <Sliders size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
