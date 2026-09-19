import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Gift, Handshake, ShoppingBag, Truck } from 'lucide-react';
import { SHOP_CATEGORIES, modeLabel, productBySlug, similarProducts, type ShopMode } from '../lib/shopData';
import ShopImage from '../components/ShopImage';
import BandeDuHero from '../components/BandeDuHero';
import { cartesDesProduits } from '../lib/cartesVivantes';
import { UNIVERSE_ARTICLES } from '../lib/magazine';
import { styleById } from '../lib/weddingStyles';

/**
 * LA PAGE D'UN PRODUIT
 *
 * Une vraie page de vente : le visuel en hero plein écran, puis ce que c'est,
 * ce que ça comprend, les caractéristiques, les ambiances auxquelles ça
 * appartient, ce qui va avec — et les articles du magazine qui racontent ces
 * univers.
 */

const ICONES_MODE: Record<ShopMode, typeof Truck> = {
  location: Truck,
  vente: ShoppingBag,
  pret: Handshake,
  don: Gift,
};

export default function ShopProduct() {
  const { slug } = useParams<{ slug: string }>();
  const produit = slug ? productBySlug(slug) : undefined;

  if (!produit) return <Navigate to="/shop" replace />;

  const categorie = SHOP_CATEGORIES.find((c) => c.id === produit.category);
  const similaires = similarProducts(produit);
  const Icone = ICONES_MODE[produit.mode];

  // Les articles du magazine qui parlent des ambiances de cette pièce
  const articles = UNIVERSE_ARTICLES.filter((article) => {
    if (!article.universeId) return false;
    const style = styleById(article.universeId);
    return produit.ambiances.some((a) => {
      const mot = a.toLowerCase();
      return (
        style.name.toLowerCase().includes(mot) ||
        (style.category ?? '').includes(mot) ||
        style.tagline.toLowerCase().includes(mot)
      );
    });
  }).slice(0, 3);

  return (
    <div className="vp-env min-h-screen overflow-x-clip bg-white text-[#0B0C12]">
      {/* Le hero : le visuel de la pièce, en plein cadre */}
      <header className="relative flex min-h-[100svh] items-end overflow-hidden bg-[#0B0C12] pt-32 text-white">
        <motion.img
          key={produit.slug}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          src={produit.image}
          alt={produit.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/50 to-black/30" />

        <span className="absolute right-3 top-24 z-10 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 backdrop-blur-sm sm:right-8 sm:top-28">
          <Icone size={12} className="text-white/90" />
          <span className="font-mono text-[9.5px] font-bold uppercase tracking-wider text-white/90">
            {modeLabel(produit.mode)}
          </span>
        </span>

        <div className="vp-page relative w-full pb-10 sm:pb-14">
          <Link
            to="/shop"
            className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/60 transition hover:text-white"
          >
            Shop · {categorie?.label}
            {produit.insolite ? ' · insolite' : ''}
          </Link>
          <h1
            className="vp-title mt-4 max-w-3xl text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
            style={{ fontSize: 'clamp(2.1rem, 5vw, 3.8rem)', lineHeight: 1.06 }}
          >
            {produit.name}
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/80">{produit.tagline}</p>

          <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-2">
            <span className="text-[30px] font-bold leading-none text-white">{produit.price}</span>
            <span className="pb-1 text-[13px] text-white/65">{produit.unit}</span>
            <span className="pb-1 text-[13px] text-white/65">
              · {produit.modes.map((mode) => modeLabel(mode)).join(' · ')}
            </span>
          </div>

        </div>
      </header>

      {/* La bande, sous le hero : les pièces du même univers. */}
      <BandeDuHero
        libelle="Dans le même univers"
        styleId="boutique"
        cartes={cartesDesProduits(similaires)}
      />

      <main className="pb-16 pt-12">
        <div className="vp-page">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
            {/* L'argumentaire */}
            <div>
              <span className="vp-eyebrow">La pièce</span>
              <p className="mt-3 text-[16px] leading-relaxed text-black/70">{produit.description}</p>

              <div className="mt-7 flex flex-wrap gap-2">
                {produit.modes.map((mode) => {
                  const IconeMode = ICONES_MODE[mode];
                  return (
                    <span
                      key={mode}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold ${
                        mode === produit.mode ? 'border-black bg-black text-white' : 'border-black/12 text-black/70'
                      }`}
                    >
                      <IconeMode size={12} />
                      {modeLabel(mode)}
                    </span>
                  );
                })}
              </div>

              <button
                type="button"
                className="mt-6 w-full rounded-full bg-black px-6 py-3.5 text-[14px] font-bold text-white transition hover:bg-neutral-800 sm:w-auto"
              >
                Réserver cette pièce
              </button>
              <p className="mt-2 text-[12px] text-black/45">
                Livraison, montage et reprise compris dans le prix indiqué.
              </p>
            </div>

            {/* Les caractéristiques */}
            <div className="rounded-[24px] border border-black/8 bg-[#FAFAFC] p-5 sm:p-6">
              <h2 className="vp-title text-[20px]">Caractéristiques</h2>
              <dl className="mt-4 space-y-3">
                {produit.specs.map((spec) => (
                  <div key={spec.label} className="border-b border-black/6 pb-2.5 last:border-none last:pb-0">
                    <dt className="font-mono text-[10.5px] uppercase tracking-wider text-black/40">{spec.label}</dt>
                    <dd className="text-[14px] leading-snug text-black">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Ce que comprend la pièce */}
          <section className="mt-14">
            <h2 className="vp-title text-[22px]">Ce que ça comprend</h2>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {produit.includes.map((item) => (
                <li key={item} className="flex items-start gap-2 rounded-[16px] bg-white px-4 py-3 ring-1 ring-black/8">
                  <Check size={14} className="mt-[3px] shrink-0 text-emerald-600" />
                  <span className="text-[14px] leading-snug text-black/75">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Les ambiances */}
          <div className="mt-12">
            <h2 className="vp-title text-[22px]">Les ambiances auxquelles ça va</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {produit.ambiances.map((ambiance) => (
                <span key={ambiance} className="rounded-full border border-black/10 px-3.5 py-1.5 text-[12.5px] text-black/70">
                  {ambiance}
                </span>
              ))}
            </div>
          </div>

          {/* Ce qui va avec */}
          <section className="mt-14 border-t border-black/8 pt-10">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="vp-title text-[22px]">Articles similaires</h2>
              <Link to="/shop" className="text-[12.5px] font-semibold text-black/55 underline transition hover:text-black">
                Tout le catalogue
              </Link>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">
              {similaires.map((item) => (
                <Link
                  key={item.slug}
                  to={`/shop/${item.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-black/10 bg-white p-2.5 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-[16px]">
                    <ShopImage
                      produit={item}
                      className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="px-1 pt-2.5">
                    <div className="text-[12.5px] font-bold leading-tight text-[#0B0C12]">{item.name}</div>
                    <div className="mt-1 text-[12px] text-black/50">
                      {item.price} <span className="text-black/35">· {item.unit}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Les articles du magazine qui racontent ces ambiances */}
          {articles.length > 0 && (
            <section className="mt-14 border-t border-black/8 pt-10">
              <h2 className="vp-title text-[22px]">Pour aller plus loin, dans le magazine</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-3">
                {articles.map((article) => (
                  <Link
                    key={article.slug}
                    to={`/magazine/${article.slug}`}
                    className="group overflow-hidden rounded-[22px] border border-black/8 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={article.cover}
                        alt={article.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="p-4">
                      <div className="text-[13.5px] font-bold leading-snug text-[#0B0C12]">{article.title}</div>
                      <div className="mt-1 font-mono text-[10.5px] uppercase tracking-wider text-black/40">
                        {article.kicker}
                      </div>
                      <span className="mt-3 flex items-center gap-1 text-[12px] font-semibold text-black/60 transition group-hover:translate-x-0.5">
                        Lire <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="border-t border-black/5 py-10">
        <div className="vp-page flex items-center justify-between text-[12.5px] text-black/50">
          <Link to="/shop" className="underline transition hover:text-black">
            Retour au shop
          </Link>
          <Link to="/magazine" className="underline transition hover:text-black">
            Le magazine
          </Link>
        </div>
      </footer>
    </div>
  );
}
