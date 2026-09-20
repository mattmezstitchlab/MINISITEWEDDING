import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ArrowRight, Sliders, Type, Images, Layout, Smartphone, Monitor, MousePointerClick } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SECTION_DEFAULTS } from '../lib/defaults';
import { WEDDING_STYLES } from '../lib/weddingStyles';
import { VISUAL_FAMILIES, VISUAL_COUNT } from '../lib/visualLibrary';
import { previewPath } from '../lib/previewSite';

/**
 * LES MINI-SITES
 *
 * Un mini-site complet par univers — vingt-quatre designs différents, montés en
 * vrai dans une fenêtre à part. Dans l'éditeur on ne touche ni à la police ni
 * aux couleurs : c'est le thème qui les décide. On change les textes, les
 * visuels, les sections, et on passe d'un thème à l'autre.
 */

const SITE_SECTIONS = SECTION_DEFAULTS.map((section) => ({ key: section.key, title: section.title }));

export default function EditorShowcase({ styleId }: { styleId: string }) {
  const [theme, setTheme] = useState(styleId);
  const [onglet, setOnglet] = useState<'themes' | 'textes' | 'visuels' | 'sections'>('themes');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [scale, setScale] = useState(0.6);

  const [photo, setPhoto] = useState<string | null>(null);
  const [titre, setTitre] = useState('');
  const [sousTitre, setSousTitre] = useState('');
  const [annonce, setAnnonce] = useState('');
  const [masquees, setMasquees] = useState<string[]>([]);
  const [familleVisuelle, setFamilleVisuelle] = useState(VISUAL_FAMILIES[0].id);

  const cadre = useRef<HTMLDivElement>(null);

  // L'univers de la page d'accueil commande le thème affiché : le composant est
  // remonté avec une clé quand il change (voir `Landing`), donc pas d'effet ici.

  const src = useMemo(
    () =>
      previewPath({
        styleId: theme,
        heroPhoto: photo ?? undefined,
        heroTitle: titre.trim() || undefined,
        heroSubtitle: sousTitre.trim() || undefined,
        announcement: annonce.trim() || undefined,
        hiddenSections: masquees,
      }),
    [theme, photo, titre, sousTitre, annonce, masquees],
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

  const changerTheme = (id: string) => {
    setTheme(id);
    setPhoto(null); // le visuel revient à celui du thème choisi
  };

  const basculerSection = (key: string) => {
    setMasquees((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const familleActive = VISUAL_FAMILIES.find((f) => f.id === familleVisuelle) ?? VISUAL_FAMILIES[0];
  const themeActif = WEDDING_STYLES.find((s) => s.id === theme) ?? WEDDING_STYLES[0];

  const onglets = [
    { id: 'themes' as const, label: 'Les thèmes', icon: Sliders },
    { id: 'textes' as const, label: 'Les textes', icon: Type },
    { id: 'visuels' as const, label: 'Les visuels', icon: Images },
    { id: 'sections' as const, label: 'Les sections', icon: Layout },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div className="vp-page">
        <div className="mx-auto max-w-2xl text-center">
          <div className="vp-eyebrow">Après l’onboarding</div>
          <h2 className="vp-h2 mt-4" style={{ fontSize: 'clamp(2rem, 4.4vw, 3.2rem)' }}>
            Vingt-quatre mini-sites.<br />
            Un design par univers.
          </h2>
          <p className="vp-body mt-4 mx-auto max-w-xl">
            Chaque univers donne son propre site : la mise en page, la typographie et les couleurs viennent de lui —
            on n’y touche pas. Vous changez les textes, les visuels et les sections, et vous passez d’un thème à
            l’autre en un clic. L’aperçu ci-dessous est le vrai site, pas une maquette.
          </p>
        </div>

        <div className="mt-14 overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-[0_24px_70px_-20px_rgba(0,0,0,0.12)] ring-1 ring-black/5">
          {/* La barre de l'éditeur, en capsule comme le reste du site */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="vp-title text-[15px] font-bold italic tracking-wider text-[#0B0C12]">SUPER MARIAGE</span>
              <span className="truncate text-[12px] font-semibold uppercase tracking-[0.18em] text-black/35">
                {themeActif.name}
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
            {/* Le panneau : thèmes, textes, visuels, sections */}
            <div className="flex flex-col border-b border-black/5 lg:col-span-4 lg:border-b-0 lg:border-r">
              <div className="grid grid-cols-2 gap-1 border-b border-black/5 bg-black/[0.02] p-2">
                {onglets.map((item) => {
                  const Icone = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setOnglet(item.id)}
                      className={`flex items-center justify-center gap-1.5 rounded-full py-2 text-[12px] font-semibold transition ${
                        onglet === item.id ? 'bg-white text-[#0B0C12] shadow-sm' : 'text-black/45 hover:text-black/70'
                      }`}
                    >
                      <Icone size={13} />
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div className="no-scrollbar max-h-[520px] flex-1 overflow-y-auto p-5">
                {onglet === 'themes' && (
                  <div>
                    <p className="text-[12.5px] leading-relaxed text-black/50">
                      Chaque univers est un mini-site différent : image d’ouverture, palette, typographie et rythme.
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2.5">
                      {WEDDING_STYLES.map((style) => {
                        const actif = theme === style.id;
                        return (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => changerTheme(style.id)}
                            className={`group overflow-hidden rounded-[16px] border text-left transition ${
                              actif ? 'border-[#0B0C12] ring-2 ring-[#0B0C12]' : 'border-black/10 hover:border-black/35'
                            }`}
                          >
                            <span className="relative block aspect-[16/10] w-full overflow-hidden">
                              <img
                                src={style.image}
                                alt=""
                                loading="lazy"
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                              />
                              {actif && (
                                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white">
                                  <Check size={10} className="text-black" />
                                </span>
                              )}
                            </span>
                            <span className="block px-2.5 py-2 text-[11.5px] font-bold leading-tight text-[#0B0C12]">
                              {style.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {onglet === 'textes' && (
                  <div className="space-y-4">
                    <p className="text-[12.5px] leading-relaxed text-black/50">
                      Les mots du site. La typographie, elle, appartient au thème.
                    </p>
                    <div>
                      <label className="vp-label ml-1">Titre d’ouverture</label>
                      <input
                        value={titre}
                        onChange={(e) => setTitre(e.target.value)}
                        placeholder={themeActif.id === 'vegas' ? 'Sarah & Gabriel' : 'Nos prénoms'}
                        className="vp-field"
                      />
                    </div>
                    <div>
                      <label className="vp-label ml-1">Sur-titre</label>
                      <input
                        value={sousTitre}
                        onChange={(e) => setSousTitre(e.target.value)}
                        placeholder="Nous nous marions"
                        className="vp-field"
                      />
                    </div>
                    <div>
                      <label className="vp-label ml-1">Message aux invités</label>
                      <textarea
                        value={annonce}
                        onChange={(e) => setAnnonce(e.target.value)}
                        rows={3}
                        placeholder="Nous avons hâte de vous retrouver."
                        className="vp-field resize-none"
                      />
                    </div>
                    {(titre || sousTitre || annonce) && (
                      <button
                        type="button"
                        onClick={() => {
                          setTitre('');
                          setSousTitre('');
                          setAnnonce('');
                        }}
                        className="text-[12px] font-semibold text-black/45 underline underline-offset-2 transition hover:text-black"
                      >
                        Revenir aux textes de l’univers
                      </button>
                    )}
                  </div>
                )}

                {onglet === 'visuels' && (
                  <div>
                    <p className="text-[12.5px] leading-relaxed text-black/50">
                      {VISUAL_COUNT} visuels disponibles. Celui que vous choisissez devient l’image d’ouverture du
                      site.
                    </p>
                    <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto pb-1">
                      {VISUAL_FAMILIES.map((famille) => (
                        <button
                          key={famille.id}
                          type="button"
                          onClick={() => setFamilleVisuelle(famille.id)}
                          className={`shrink-0 rounded-full border px-3 py-1 text-[11.5px] font-semibold transition ${
                            familleVisuelle === famille.id
                              ? 'border-[#0B0C12] bg-[#0B0C12] text-white'
                              : 'border-black/12 bg-white text-black/60 hover:border-black/35'
                          }`}
                        >
                          {famille.label} <span className="opacity-60">{famille.visuals.length}</span>
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {familleActive.visuals.map((visual) => {
                        const actif = photo === visual.url;
                        return (
                          <button
                            key={visual.url}
                            type="button"
                            title={visual.title}
                            onClick={() => setPhoto(actif ? null : visual.url)}
                            className={`overflow-hidden rounded-[12px] border transition ${
                              actif ? 'border-[#0B0C12] ring-2 ring-[#0B0C12]' : 'border-black/10 hover:border-black/35'
                            }`}
                          >
                            <span className="relative block aspect-[4/3] w-full overflow-hidden">
                              <img
                                src={visual.url}
                                alt=""
                                loading="lazy"
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  // Un visuel pas encore livré montre le visuel de sa catégorie.
                                  if (visual.repli && e.currentTarget.src !== location.origin + visual.repli) {
                                    e.currentTarget.src = visual.repli;
                                  }
                                }}
                              />
                              {actif && (
                                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white">
                                  <Check size={10} className="text-black" />
                                </span>
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {photo && (
                      <button
                        type="button"
                        onClick={() => setPhoto(null)}
                        className="mt-3 text-[12px] font-semibold text-black/45 underline underline-offset-2 transition hover:text-black"
                      >
                        Revenir au visuel de l’univers
                      </button>
                    )}
                  </div>
                )}

                {onglet === 'sections' && (
                  <div>
                    <p className="text-[12.5px] leading-relaxed text-black/50">
                      Les {SITE_SECTIONS.length} sections du site. Décochez ce que vous ne voulez pas montrer.
                    </p>
                    <div className="mt-4 space-y-1.5">
                      {SITE_SECTIONS.map((section) => {
                        const visible = !masquees.includes(section.key);
                        return (
                          <button
                            key={section.key}
                            type="button"
                            onClick={() => basculerSection(section.key)}
                            className="flex w-full items-center gap-3 rounded-[14px] border border-black/8 bg-white px-3.5 py-2.5 text-left transition hover:border-black/25"
                          >
                            <span
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition ${
                                visible ? 'border-[#0B0C12] bg-[#0B0C12] text-white' : 'border-black/25'
                              }`}
                            >
                              {visible && <Check size={10} />}
                            </span>
                            <span className="text-[13px] font-medium text-[#0B0C12]">{section.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <p className="flex items-center gap-2 border-t border-black/6 px-5 py-3 text-[12px] text-black/45">
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
                    title={`Aperçu du mini-site — ${themeActif.name}`}
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
