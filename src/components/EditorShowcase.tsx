import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ArrowRight, Sliders, Type, Palette, Layout, Smartphone, Monitor, MousePointerClick } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SECTION_DEFAULTS } from '../lib/defaults';
import { TYPO_OPTIONS } from '../lib/weddingStyles';
import { previewPath } from '../lib/previewSite';

/**
 * LE MINI-SITE COMPLET
 *
 * Ce n'est pas une maquette : c'est le vrai site du mariage, monté dans une
 * fenêtre à part avec un mariage d'exemple, et réglé en direct — couleur
 * signature, typographie, ordre des sections. Ce que l'on voit ici est
 * exactement ce que verront les invités, dans le style du site.
 */

/** Les sections réellement composées dans un mini-site VOWS. */
const SITE_SECTIONS = SECTION_DEFAULTS.map((section) => ({ key: section.key, title: section.title }));

const ACCENT_COLORS = [
  { name: 'Or Riviera', hex: '#C5A059' },
  { name: 'Noir Pur', hex: '#111111' },
  { name: 'Terre cuite', hex: '#B88258' },
  { name: 'Vert forêt', hex: '#2F6F4E' },
  { name: 'Bleu nuit', hex: '#0EA5E9' },
  { name: 'Magenta', hex: '#FF00E5' },
];

/** La cadence du site : ce que l'on choisit ici se voit immédiatement. */
const TYPOS = TYPO_OPTIONS.filter((t) => ['spatial', 'editorial', 'serif', 'modern'].includes(t.id));

export default function EditorShowcase({ styleId }: { styleId: string }) {
  const [typo, setTypo] = useState('spatial');
  const [couleur, setCouleur] = useState(ACCENT_COLORS[0]);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [onglet, setOnglet] = useState<'style' | 'sections'>('style');
  const [scale, setScale] = useState(0.6);
  const cadre = useRef<HTMLDivElement>(null);

  const src = useMemo(
    () => previewPath({ styleId, typography: typo, accent: couleur.hex, buttonStyle: 'pill' }),
    [styleId, typo, couleur],
  );

  /**
   * L'aperçu bureau est rendu à 1280 px puis réduit pour tenir dans le cadre :
   * la mise en page du site est donc exactement celle d'un vrai écran.
   */
  useEffect(() => {
    const el = cadre.current;
    if (!el) return;
    const mesurer = () => setScale(Math.min(1, el.clientWidth / 1280));
    mesurer();
    const observer = new ResizeObserver(mesurer);
    observer.observe(el);
    return () => observer.disconnect();
  }, [device]);

  return (
    <section className="relative overflow-hidden bg-white px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="vp-eyebrow">Après l’onboarding</div>
          <h2 className="vp-h2 mt-4" style={{ fontSize: 'clamp(2rem, 4.4vw, 3.2rem)' }}>
            Votre mini-site complet,<br />
            dans le style du site.
          </h2>
          <p className="vp-body mt-4 mx-auto max-w-xl">
            Dès que votre carte est créée, les {SITE_SECTIONS.length} sections sont déjà écrites avec votre univers :
            le programme heure par heure, les lieux, les informations pratiques, le RSVP, la cagnotte, la galerie, la
            FAQ. Vous réglez la couleur signature et la typographie, et le site change en direct.
          </p>
        </div>

        {/* Le cadriciel : réglages à gauche, vrai site à droite */}
        <div className="mt-14 overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-[0_24px_70px_-20px_rgba(0,0,0,0.12)] ring-1 ring-black/5">
          {/* La barre de l'éditeur, en capsule comme le reste du site */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2.5">
              <span className="vp-title text-[15px] font-bold italic tracking-wider text-[#0B0C12]">VOWS</span>
              <span className="hidden text-[12px] font-semibold uppercase tracking-[0.18em] text-black/35 sm:inline">
                Éditeur de site
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 rounded-full border border-black/10 bg-white p-1 shadow-sm">
                {(['desktop', 'mobile'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setDevice(mode)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold transition ${
                      device === mode ? 'bg-[#0B0C12] text-white' : 'text-black/50 hover:text-[#0B0C12]'
                    }`}
                  >
                    {mode === 'desktop' ? <Monitor size={13} /> : <Smartphone size={13} />}
                    <span className="hidden sm:inline">{mode === 'desktop' ? 'Bureau' : 'Mobile'}</span>
                  </button>
                ))}
              </div>

              <Link to="/creer" className="vp-btn vp-press !px-4 !py-1.5 !text-[12.5px]">
                Créer notre site <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-12">
            {/* Les réglages */}
            <div className="space-y-6 border-b border-black/5 p-6 lg:col-span-4 lg:border-b-0 lg:border-r">
              <div className="flex rounded-full bg-black/[0.04] p-1">
                {(['style', 'sections'] as const).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setOnglet(id)}
                    className={`flex-1 rounded-full py-1.5 text-[12.5px] font-semibold transition ${
                      onglet === id ? 'bg-white text-[#0B0C12] shadow-sm' : 'text-black/45'
                    }`}
                  >
                    {id === 'style' ? 'Apparence' : 'Sections'}
                  </button>
                ))}
              </div>

              {onglet === 'style' ? (
                <>
                  <div>
                    <div className="mb-3 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-black/40">
                      <Palette size={14} /> Couleur signature
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {ACCENT_COLORS.map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => setCouleur(c)}
                          title={c.name}
                          aria-label={c.name}
                          className={`flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-black/10 transition hover:scale-105 ${
                            couleur.hex === c.hex ? 'ring-2 ring-[#0B0C12]' : ''
                          }`}
                          style={{ background: c.hex }}
                        >
                          {couleur.hex === c.hex && <Check size={14} className="text-white" strokeWidth={3} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-black/40">
                      <Type size={14} /> Typographie des titres
                    </div>
                    <div className="space-y-2">
                      {TYPOS.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTypo(t.id)}
                          className={`flex w-full items-center justify-between gap-3 rounded-[16px] border px-4 py-3 text-left transition ${
                            typo === t.id ? 'border-[#0B0C12] bg-white' : 'border-black/10 bg-white/60 hover:border-black/30'
                          }`}
                        >
                          <span>
                            <span className="block text-[16px] text-[#0B0C12]" style={{ fontFamily: t.heading }}>
                              Sarah &amp; Gabriel
                            </span>
                            <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-black/40">
                              {t.name} · {t.hint}
                            </span>
                          </span>
                          {typo === t.id && <Check size={14} className="shrink-0 text-emerald-600" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <div className="mb-3 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-black/40">
                    <Layout size={14} /> Sections du site
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SITE_SECTIONS.map((section) => (
                      <span
                        key={section.key}
                        className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[12.5px] font-semibold text-[#0B0C12]"
                      >
                        <Check size={12} className="text-emerald-600" />
                        {section.title}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-[12.5px] leading-relaxed text-black/50">
                    Chaque section se réordonne, se masque et se modifie dans l’éditeur — et le changement se voit
                    immédiatement sur le site.
                  </p>
                </div>
              )}

              <p className="flex items-center gap-2 border-t border-black/6 pt-4 text-[12px] text-black/45">
                <MousePointerClick size={13} />
                L’aperçu est le vrai site : cliquez-dedans pour le parcourir.
              </p>
            </div>

            {/* Le vrai mini-site, dans sa fenêtre */}
            <div className="lg:col-span-8">
              {device === 'desktop' ? (
                <div ref={cadre} className="relative h-[560px] overflow-hidden bg-[#0B0C12]">
                  <iframe
                    key={src}
                    title="Aperçu du mini-site"
                    src={src}
                    className="border-0 bg-white"
                    style={{
                      width: 1280,
                      height: Math.round(560 / scale),
                      transform: `scale(${scale})`,
                      transformOrigin: 'top left',
                    }}
                  />
                </div>
              ) : (
                <div className="flex justify-center bg-[#0B0C12] py-8">
                  <div className="relative w-[368px] overflow-hidden rounded-[44px] border-[7px] border-black bg-black shadow-[0_30px_70px_-24px_rgba(0,0,0,0.6)]">
                    <div className="absolute left-1/2 top-2.5 z-20 h-[18px] w-[76px] -translate-x-1/2 rounded-full bg-black" />
                    <iframe
                      key={src}
                      title="Aperçu du mini-site sur téléphone"
                      src={src}
                      className="h-[640px] w-full rounded-[36px] border-0 bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/creer" className="vp-btn vp-press !px-7">
            Créer notre site <ArrowRight size={15} />
          </Link>
          <button
            type="button"
            onClick={() =>
              document.getElementById('hero-ai-container')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
            className="vp-btn vp-btn-glass vp-press !px-7"
          >
            Choisir notre univers <Sliders size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
