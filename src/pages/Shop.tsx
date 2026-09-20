import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Gift, Handshake, Search, ShoppingBag, Tag, Truck } from 'lucide-react';
import {
  SHOP_CATEGORIES,
  SHOP_HERO,
  SHOP_HERO_REPLI,
  SHOP_MODES,
  SHOP_PRODUCTS,
  modeLabel,
  type ShopMode,
} from '../lib/shopData';
import ShopImage from '../components/ShopImage';
import BandeDuHero from '../components/BandeDuHero';
import { cartesDesProduits, PRODUITS_POUR_BANDE } from '../lib/cartesVivantes';
import { phraseShopDuRole, piecesPourRole, roleDuneAdresse } from '../lib/personaSuites';
import { enregistrerNavVerticale } from '../lib/navVerticale';
import { NAV_SHOP } from '../lib/navDesPages';

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
  /** Le grand filtre : ce que l'on cherche, en toutes lettres. */
  const [requete, setRequete] = useState('');
  /** Les pièces cochées : elles remplissent le ticket, à côté. */
  const [coches, setCoches] = useState<string[]>([]);

  /** Cocher une pièce : elle monte sur le ticket ; recocher la redescend. */
  const basculerCoche = (slug: string) =>
    setCoches((liste) => (liste.includes(slug) ? liste.filter((s) => s !== slug) : [...liste, slug]));

  /**
   * LE SHOP D'UN RÔLE
   *
   * « ?role=fleuriste » : le shop ne montre plus que les pièces qui concernent
   * ce rôle — plus de tri à faire, c'est le rôle qui trie. Les catégories et les
   * modes restent là pour affiner ce qu'on regarde, jamais pour se perdre.
   */
  const [params] = useSearchParams();
  const role = roleDuneAdresse(params.get('role'));

  // La nav de droite : les pièces, les modes, le magazine.
  useEffect(() => {
    enregistrerNavVerticale(NAV_SHOP);
    return () => enregistrerNavVerticale(null);
  }, []);

  const piecesDuRole = useMemo(() => (role ? piecesPourRole(role.id) : null), [role]);

  const produits = useMemo(() => {
    const dansLeRole = piecesDuRole ?? SHOP_PRODUCTS;
    const parCategorie = categorie === 'tout'
      ? dansLeRole
      : dansLeRole.filter((p) => p.category === categorie);
    const parMode = modeActif ? parCategorie.filter((p) => p.modes.includes(modeActif)) : parCategorie;
    const q = requete.trim().toLowerCase();
    return q
      ? parMode.filter((p) => `${p.name} ${p.tagline} ${p.category}`.toLowerCase().includes(q))
      : parMode;
  }, [categorie, modeActif, piecesDuRole, requete]);

  /** La bande du hero : les pièces mises en avant, en cartes vivantes. */
  const cartesDuShop = useMemo(() => cartesDesProduits(PRODUITS_POUR_BANDE), []);

  /** Les pièces du shop ouvert : celles du rôle, ou tout le catalogue. */
  const produitsParRole = role ? piecesDuRole! : SHOP_PRODUCTS;

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

        <div className="vp-page relative w-full pb-40 sm:pb-44">
          <span className="vp-eyebrow !text-white/70">
            {role ? `Le Shop de ${role.nom}` : 'SUPER SHOP — tout ce qui se vend, classé'}
          </span>
          <h1
            className="vp-title mt-4 max-w-3xl text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
            style={{ fontSize: 'clamp(2.2rem, 5.2vw, 4rem)', lineHeight: 1.05 }}
          >
            {role
              ? `${piecesDuRole!.length} pièces, choisies pour ce rôle.`
              : 'Tout ce qui se vend, classé, coché, sur un ticket.'}
          </h1>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/75">
            {role
              ? `${phraseShopDuRole(role.id)} Le shop entier reste à un clic, et les catégories sont là pour affiner.`
              : `${SHOP_PRODUCTS.length} pièces à louer, acheter, emprunter ou recevoir : mobilier, vaisselle, décor, lumière, tenues, papeterie — et quelques objets qu’on ne trouve nulle part ailleurs. Le mobilier est livré, monté et repris ; ce qui ne sert plus est prêté ou donné.`}
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {[
              { label: 'Pièces', value: String(role ? piecesDuRole!.length : SHOP_PRODUCTS.length) },
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

      {/* Le rôle qui a ouvert ce shop : on peut revenir au shop entier. */}
      {role && (
        <div className="vp-page -mt-6 pb-2 pt-4">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-[12.5px] font-semibold text-black/70 no-underline transition hover:border-black/35 hover:text-black"
          >
            Tout le shop <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {/* Les quatre modes */}
      <section id="modes" className="pb-8 pt-10 sm:pt-14">
        <div className="vp-page">
          <div className="flex flex-wrap gap-2">
            {SHOP_MODES.map((mode) => {
              const Icone = ICONES_MODE[mode.id];
              const actif = modeActif === mode.id;
              const nombre = (piecesDuRole ?? SHOP_PRODUCTS).filter((p) => p.modes.includes(mode.id)).length;
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
          <div className="flex shrink-0 items-center gap-2 rounded-full border border-black/12 bg-white px-3 py-1.5">
            <Search size={13} className="text-black/40" />
            <input
              value={requete}
              onChange={(e) => setRequete(e.target.value)}
              placeholder="Chercher une pièce"
              aria-label="Chercher une pièce dans le shop"
              className="w-[130px] bg-transparent text-[12px] text-[#0B0C12] placeholder:text-black/35 focus:outline-none sm:w-[190px]"
            />
          </div>
          <button
            type="button"
            onClick={() => setCategorie('tout')}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition ${
              categorie === 'tout' ? 'bg-black text-white' : 'bg-black/5 text-[#0B0C12] hover:bg-black/10'
            }`}
          >
            Tout ({produitsParRole.length})
          </button>
          {SHOP_CATEGORIES.map((cat) => {
            const nombre = produitsParRole.filter((p) => p.category === cat.id).length;
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

      {/* La grille de produits, et le ticket des pièces cochées */}
      <section id="pieces" className="py-12">
        <div className="vp-page grid gap-10 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
        <div>
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
                const coche = coches.includes(produit.slug);
                return (
                  <motion.div key={produit.slug} {...fadeUp} transition={{ duration: 0.4, delay: (i % 6) * 0.04 }} className="relative">
                    {/* Cocher la pièce : elle monte sur le ticket. */}
                    <button
                      type="button"
                      onClick={() => basculerCoche(produit.slug)}
                      aria-label={coche ? `Retirer ${produit.name} du ticket` : `Cocher ${produit.name} sur le ticket`}
                      aria-pressed={coche}
                      className={`absolute right-4 bottom-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border transition ${
                        coche
                          ? 'border-transparent bg-black text-white'
                          : 'border-black/15 bg-white/95 text-black/50 hover:border-black/50 hover:text-black'
                      }`}
                    >
                      <Check size={14} />
                    </button>
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
                          <span aria-hidden="true" className="w-8" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* ——— LE TICKET DU SHOP : les pièces cochées, comme un reçu ——— */}
        <aside aria-label="Le ticket du shop" className="lg:sticky lg:top-24">
          <div className="rounded-t-[10px] bg-[#171717] px-4 py-2">
            <div className="mx-auto h-1 w-24 rounded-full bg-black/60" />
          </div>
          <div className="bg-[#FFFEF7] p-5 font-mono text-[11.5px] leading-relaxed text-black shadow-[0_25px_60px_rgba(0,0,0,0.22)]">
            <div className="text-center font-black tracking-[0.18em]">SUPER SHOP</div>
            <div className="mt-1 text-center text-[9.5px] uppercase tracking-[0.14em] text-black/45">
              les pièces cochées · {role ? role.nom : 'tout le shop'}
            </div>
            <div className="my-3 border-y border-dashed border-black/20 py-2 text-center text-[9.5px]">
              {coches.length} pièce{coches.length > 1 ? 's' : ''} sur le ticket
            </div>

            {coches.length === 0 ? (
              <p className="py-2 text-center text-black/50">
                Cochez des pièces : le ticket se remplit tout seul.
              </p>
            ) : (
              coches.map((slug) => {
                const piece = SHOP_PRODUCTS.find((x) => x.slug === slug);
                if (!piece) return null;
                return (
                  <div key={slug} className="border-b border-dotted border-black/15 py-2">
                    <div className="flex justify-between gap-3">
                      <span className="font-bold">{piece.name}</span>
                      <span className="shrink-0 text-[10px] uppercase tracking-wider text-black/45">
                        {modeLabel(piece.mode)}
                      </span>
                    </div>
                    <div className="mt-0.5 text-[10.5px] text-black/55">{piece.price} · {piece.unit}</div>
                  </div>
                );
              })
            )}

            <div className="mt-3 flex items-baseline justify-between border-t-2 border-black pt-2">
              <span className="text-[12px] font-black">VOTRE TICKET</span>
              <span className="text-[14px] font-black tabular-nums">
                {coches.length} pièce{coches.length > 1 ? 's' : ''}
              </span>
            </div>
            {coches.length > 0 && (
              <button
                type="button"
                onClick={() => setCoches([])}
                className="mt-2 w-full rounded-full border border-black/20 py-1.5 text-[10px] uppercase tracking-widest text-black/60 transition hover:border-black/50"
              >
                Vider le ticket
              </button>
            )}
            <div className="mt-2 text-[9px] uppercase tracking-widest text-black/40">
              Rien n’est réservé tant que vous ne l’avez pas voulu
            </div>
          </div>
          <div className="h-3 rotate-180 bg-[radial-gradient(circle_at_6px_0px,_transparent_6px,_#FFFEF7_6px)] bg-[length:12px_12px] bg-repeat-x" />
        </aside>
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
