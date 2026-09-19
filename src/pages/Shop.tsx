import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Gift, Handshake, ShoppingBag, Tag, Truck } from 'lucide-react';
import {
  SHOP_CATEGORIES,
  SHOP_HERO,
  SHOP_HERO_REPLI,
  SHOP_MODES,
  SHOP_PRODUCTS,
  modeLabel,
  productsByCategory,
  type ShopMode,
} from '../lib/shopData';
import ShopImage from '../components/ShopImage';
import BandeDuHero from '../components/BandeDuHero';
import { cartesDesProduits, PRODUITS_POUR_BANDE } from '../lib/cartesVivantes';

/**
 * LE SHOP
 *
 * Tout ce qui se loue, s'achète, se prête ou se donne pour un mariage :
 * mobilier, table, décor, lumière, tenues, papeterie — et quelques objets
 * insolites. Les cartes sont faites comme celles des prestataires : une photo,
 * un nom, une localisation, un bouton.
 */

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
};

const ICONES_MODE: Record<ShopMode, typeof Tag> = {
  location: Truck,
  vente: ShoppingBag,
  pret: Handshake,
  don: Gift,
};

export default function Shop() {
  const [categorie, setCategorie] = useState<string>('tout');
  const [modeActif, setModeActif] = useState<ShopMode | null>(null);
  const [visuelHero, setVisuelHero] = useState(SHOP_HERO);

  const produits = useMemo(() => {
    const parCategorie = productsByCategory(categorie);
    return modeActif ? parCategorie.filter((p) => p.modes.includes(modeActif)) : parCategorie;
  }, [categorie, modeActif]);

  /** La bande du hero : les pièces mises en avant, en cartes vivantes. */
  const cartesDuShop = useMemo(() => cartesDesProduits(PRODUITS_POUR_BANDE), []);

  return (
    <div className="vp-env min-h-screen overflow-x-clip bg-white text-[#0B0C12]">
      {/* Le hero du shop : le visuel, puis tout ce qui s'y trouve */}
      <header className="relative flex min-h-[100svh] items-end overflow-hidden bg-[#0B0C12] pt-32 text-white">
        <img
          src={visuelHero}
          alt=""
          onError={() => setVisuelHero((actuel) => (actuel === SHOP_HERO_REPLI ? actuel : SHOP_HERO_REPLI))}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/55 to-black/35" />

        <div className="vp-page relative w-full pb-10 sm:pb-14">
          <span className="vp-eyebrow !text-white/70">Le Shop Super Mariage</span>
          <h1
            className="vp-title mt-4 max-w-3xl text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
            style={{ fontSize: 'clamp(2.2rem, 5.2vw, 4rem)', lineHeight: 1.05 }}
          >
            Tout ce qu’il faut, sans rien acheter pour une seule journée.
          </h1>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/75">
            {SHOP_PRODUCTS.length} pièces à louer, acheter, emprunter ou recevoir : mobilier, vaisselle, décor,
            lumière, tenues, papeterie — et quelques objets qu’on ne trouve nulle part ailleurs. Le mobilier est
            livré, monté et repris ; ce qui ne sert plus est prêté ou donné.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {[
              { label: 'Pièces', value: String(SHOP_PRODUCTS.length) },
              { label: 'Modes', value: SHOP_MODES.map((m) => m.label).join(' · ') },
              { label: 'Catégories', value: String(SHOP_CATEGORIES.length) },
            ].map((fait) => (
              <span
                key={fait.label}
                className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[12px] text-white backdrop-blur-sm"
              >
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/55">{fait.label}</span>
                <span className="ml-1.5 font-semibold">{fait.value}</span>
              </span>
            ))}
          </div>

        </div>
      </header>

      {/* La bande, sous le hero : les pièces en cartes de playlist — leur mode,
          leur prix, le cœur du public, et le play qui les montre en conditions. */}
      <BandeDuHero
        libelle="Les pièces, en conditions"
        styleId="boutique"
        cartes={cartesDuShop}
      />

      {/* Les quatre modes */}
      <section className="pb-8 pt-10 sm:pt-14">
        <div className="vp-page">
          <div className="flex flex-wrap gap-2">
            {SHOP_MODES.map((mode) => {
              const Icone = ICONES_MODE[mode.id];
              const actif = modeActif === mode.id;
              const nombre = SHOP_PRODUCTS.filter((p) => p.modes.includes(mode.id)).length;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setModeActif(actif ? null : mode.id)}
                  className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-left text-[12.5px] font-semibold transition ${
                    actif ? 'border-black bg-black text-white' : 'border-black/12 bg-white hover:border-black/40'
                  }`}
                >
                  <Icone size={13} />
                  {mode.label}
                  <span className={actif ? 'text-white/60' : 'text-black/40'}>{nombre}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Les filtres de catégorie */}
      <section className="sticky top-[70px] z-30 border-y border-black/5 bg-white/95 py-3 backdrop-blur">
        <div className="vp-page flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setCategorie('tout')}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition ${
              categorie === 'tout' ? 'bg-black text-white' : 'bg-black/5 text-[#0B0C12] hover:bg-black/10'
            }`}
          >
            Tout ({SHOP_PRODUCTS.length})
          </button>
          {SHOP_CATEGORIES.map((cat) => {
            const nombre = SHOP_PRODUCTS.filter((p) => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategorie(cat.id)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition ${
                  categorie === cat.id ? 'bg-black text-white' : 'bg-black/5 text-[#0B0C12] hover:bg-black/10'
                }`}
              >
                {cat.label} ({nombre})
              </button>
            );
          })}
        </div>
      </section>

      {/* La grille de produits */}
      <section className="py-12">
        <div className="vp-page">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="vp-title text-[20px]">
              {categorie === 'tout'
                ? 'Tout le catalogue'
                : SHOP_CATEGORIES.find((c) => c.id === categorie)?.label}
              {modeActif && <span className="text-black/40"> · {modeLabel(modeActif)}</span>}
            </h2>
            <span className="text-[12.5px] text-black/50">
              {produits.length} pièce{produits.length > 1 ? 's' : ''}
              {modeActif ? ' en ' + modeLabel(modeActif).toLowerCase() : ''}
            </span>
          </div>

          {produits.length === 0 ? (
            <div className="rounded-[24px] border border-black/8 bg-[#FAFAFC] p-8 text-center text-[14px] text-black/55">
              Aucune pièce dans cette combinaison. Essayez un autre mode ou une autre catégorie.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
              {produits.map((produit, i) => {
                const Icone = ICONES_MODE[produit.mode];
                return (
                  <motion.div key={produit.slug} {...fadeUp} transition={{ duration: 0.4, delay: (i % 6) * 0.04 }}>
                    <Link
                      to={`/shop/${produit.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-black/10 bg-white p-2.5 transition-all hover:-translate-y-1 hover:border-black/20 hover:shadow-xl"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
                        <ShopImage
                          produit={produit}
                          className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.03]"
                        />
                        <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 backdrop-blur-sm">
                          <Icone size={10} className="text-white/85" />
                          <span className="font-mono text-[8px] font-bold uppercase tracking-wider text-white/85">
                            {modeLabel(produit.mode)}
                          </span>
                        </span>
                        {produit.insolite && (
                          <span className="absolute right-2 top-2 rounded-full bg-white/95 px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider text-black">
                            insolite
                          </span>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col px-1 pb-0.5 pt-3">
                        <div className="text-[13.5px] font-bold leading-tight text-[#0B0C12]">{produit.name}</div>
                        <div className="mt-1 line-clamp-2 text-[11.5px] leading-snug text-[var(--vp-muted)]">
                          {produit.tagline}
                        </div>
                        <div className="mt-auto flex items-end justify-between pt-3">
                          <div>
                            <div className="text-[15px] font-bold text-[#0B0C12]">{produit.price}</div>
                            <div className="text-[10.5px] text-black/45">{produit.unit}</div>
                          </div>
                          <span className="flex items-center gap-1 text-[11.5px] font-semibold text-[#0B0C12] transition group-hover:translate-x-0.5">
                            Voir <ArrowRight size={12} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Le bandeau de service */}
      <section className="pb-16">
        <div className="vp-page grid gap-4 rounded-[28px] bg-[#FAFAFC] p-6 sm:grid-cols-3 sm:p-8">
          {[
            { titre: 'Livré, monté, repris', texte: 'Le mobilier arrive la veille et repart le lundi. Vous ne portez rien.' },
            { titre: 'Ce qui reste circule', texte: 'Ce que nous ne stockons plus est prêté gratuitement ou donné à des associations.' },
            { titre: 'Pensé par univers', texte: 'Chaque pièce indique les ambiances auxquelles elle appartient : champêtre, béton, club, Corse…' },
          ].map((bloc) => (
            <div key={bloc.titre}>
              <div className="text-[14px] font-bold text-[#0B0C12]">{bloc.titre}</div>
              <p className="mt-1 text-[13px] leading-relaxed text-black/55">{bloc.texte}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-black/5 py-10">
        <div className="vp-page flex flex-col items-center justify-between gap-3 text-[12.5px] text-black/50 sm:flex-row">
          <span className="vp-title text-[16px] font-bold italic tracking-wider text-black/80">SUPER MARIAGE</span>
          <span>
            {SHOP_PRODUCTS.length} pièces · {SHOP_CATEGORIES.length} catégories · location, achat, prêt et don
          </span>
          <Link to="/magazine" className="underline transition hover:text-black">
            Lire le magazine
          </Link>
        </div>
      </footer>
    </div>
  );
}
