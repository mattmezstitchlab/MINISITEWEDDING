import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BadgeEuro, Check, Printer, RotateCcw, ScanBarcode, ShoppingCart, Sparkles, Store,
} from 'lucide-react';
import TicketCaisse from '../components/TicketCaisse';
import {
  MAGASIN, PACKAGES, PANIER_DEPART, RAYONS, TICKET_COUPLE,
  euros, lignesDuTicket, numeroDeTicket, prixDeLArticle, totalCaisse,
} from '../lib/superMariage';

/**
 * SUPERMARIAGE — LA PAGE DU MAGASIN
 *
 * Un mariage se compose comme une liste de courses : on coche des horaires, on
 * prend des métiers (un par rayon), on ajoute des petits prix, on choisit un
 * menu — et on passe à la caisse. Le ticket, en face, se calcule en direct :
 * c'est le même papier que celui du mini-site Supermarché 22H, mais avec les
 * vrais chiffres de ce qui a été coché.
 *
 * Les tarifs sont indicatifs : ce n'est pas une facture, c'est un plan qu'on
 * s'amuse à faire. Le magasin ne vend rien — il montre combien de choses
 * tiennent dans un mariage.
 */

const VERT = '#00FF88';

export default function SuperMariage() {
  const [selection, setSelection] = useState<string[]>(PANIER_DEPART);
  const [menu, setMenu] = useState<string | null>(null);
  const [paye, setPaye] = useState(false);
  const [maintenant] = useState(() => new Date());

  const total = useMemo(() => totalCaisse(selection, menu), [selection, menu]);
  const lignes = useMemo(() => lignesDuTicket(selection, menu), [selection, menu]);
  const numero = useMemo(() => numeroDeTicket(selection, menu), [selection, menu]);

  const dateLabel = maintenant.toLocaleDateString('fr-FR');
  const heureLabel = `${maintenant.getHours()}h${String(maintenant.getMinutes()).padStart(2, '0')}`;

  const basculer = (id: string) => {
    setPaye(false);
    setSelection((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const choisirMenu = (id: string) => {
    setPaye(false);
    setMenu((prev) => (prev === id ? null : id));
  };

  /** Passer à la caisse : on imprime, et on ouvre les portes du mariage. */
  const payer = () => {
    setPaye(true);
    document.getElementById('caisse')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const refaire = () => {
    setSelection(PANIER_DEPART);
    setMenu(null);
    setPaye(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* ————————————————— la ligne de caisse, toujours à portée ————————————————— */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0A0A0A]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: VERT }}>
              <ShoppingCart size={16} className="text-black" />
            </span>
            <span className="font-mono text-[12px] font-bold tracking-[0.2em] sm:text-[13px]">
              {MAGASIN.nom}
            </span>
            <span className="hidden rounded-full bg-white/10 px-2.5 py-1 font-mono text-[10px] tracking-widest text-white/55 lg:block">
              {MAGASIN.rayon}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-[11px] text-white/55 sm:block">
              {total.articles} article{total.articles > 1 ? 's' : ''} · {euros(total.total)}
            </span>
            <button
              type="button"
              onClick={payer}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-widest text-black transition hover:brightness-110"
              style={{ background: VERT }}
            >
              <ScanBarcode size={13} /> {paye ? 'Ticket payé' : 'Passer à la caisse'}
            </button>
          </div>
        </div>
      </div>

      {/* ——————————————————————————— le magasin ——————————————————————————— */}
      <header className="relative overflow-hidden border-b border-white/10">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent 0 38px, rgba(255,255,255,0.22) 38px 40px)',
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[1180px] px-5 pb-14 pt-14 sm:px-8 sm:pb-20 sm:pt-20">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 no-underline transition hover:text-white"
          >
            ← VOWS
          </Link>

          <span
            className="mt-8 inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-black"
            style={{ background: VERT }}
          >
            <Store size={12} /> Nouveau rayon
          </span>

          <h1
            className="mt-5 max-w-[820px] font-black leading-[0.95] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(2.6rem, 7vw, 5.2rem)' }}
          >
            SuperMariage
          </h1>
          <p className="mt-4 max-w-[600px] text-[15.5px] leading-relaxed text-white/70">
            Faites vos courses. Cochez les horaires, prenez les métiers, ajoutez les petits prix,
            choisissez un menu — puis passez à la caisse : le ticket de caisse se calcule tout seul,
            ligne par ligne, comme au rayon 7.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            <a
              href="#rayons"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-bold text-black no-underline transition hover:brightness-110"
              style={{ background: VERT }}
            >
              Commencer les courses <ArrowRight size={14} />
            </a>
            <Link
              to="/apercu?style=supermarche"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-[13px] font-semibold text-white no-underline backdrop-blur transition hover:bg-white/20"
            >
              Voir le mini-site Supermarché 22H
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            {[
              { label: 'Magasin', valeur: MAGASIN.ville },
              { label: 'Caisse', valeur: `${MAGASIN.caisse} · ${TICKET_COUPLE.convives} convives` },
              { label: 'Rayons ouverts', valeur: `${RAYONS.length} rayons · ${RAYONS.reduce((n, r) => n + r.articles.length, 0)} articles` },
              { label: 'Menu du jour', valeur: `${PACKAGES.length} formules` },
            ].map((item) => (
              <div key={item.label}>
                <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/40">
                  {item.label}
                </div>
                <div className="mt-1 text-[12.5px] font-medium text-white/80">{item.valeur}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ————————————————————————— les rayons ————————————————————————— */}
      <main id="rayons" className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: VERT }}>
              Dans les rayons
            </span>
            <h2 className="mt-2 max-w-[620px] text-[26px] font-semibold leading-tight tracking-[-0.02em] sm:text-[32px]">
              Cochez ce qui se passe, on s’occupe du ticket.
            </h2>
          </div>
          <p className="max-w-[360px] text-[12.5px] leading-relaxed text-white/55">
            Chaque rayon est un domaine de métier : un horaire, un métier, un petit prix — le caddie
            se remplit et la caisse suit, en haut de l’écran.
          </p>
        </div>

        <div className="mt-10 space-y-12">
          {RAYONS.map((rayon) => (
            <section key={rayon.key} id={rayon.key}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-3">
                <h3 className="font-mono text-[13px] font-bold uppercase tracking-[0.18em] text-white">
                  {rayon.label}
                </h3>
                <span className="font-mono text-[10.5px] text-white/40">{rayon.sousTitre}</span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {rayon.articles.map((article) => {
                  const actif = selection.includes(article.id);
                  return (
                    <button
                      key={article.id}
                      type="button"
                      role="checkbox"
                      aria-checked={actif}
                      onClick={() => basculer(article.id)}
                      className={`flex h-full flex-col rounded-[18px] border p-4 text-left transition ${
                        actif
                          ? 'border-transparent bg-white text-black'
                          : 'border-white/12 bg-white/[0.04] text-white hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-[13.5px] font-semibold leading-tight">{article.label}</span>
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${
                            actif ? 'text-black' : 'border border-white/25 text-transparent'
                          }`}
                          style={actif ? { background: VERT } : undefined}
                        >
                          <Check size={12} />
                        </span>
                      </div>

                      <p className={`mt-2 text-[11.5px] leading-relaxed ${actif ? 'text-black/55' : 'text-white/50'}`}>
                        {article.detail}
                      </p>

                      <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
                        <span className="font-mono text-[12px] font-bold">
                          {euros(article.prix)}
                          {article.quantite ? ' / pers.' : ''}
                        </span>
                        {article.quantite && (
                          <span className={`font-mono text-[10px] ${actif ? 'text-black/45' : 'text-white/40'}`}>
                            {euros(prixDeLArticle(article))} pour {article.quantite} invités
                          </span>
                        )}
                        {article.univers && (
                          <span
                            className={`ml-auto rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                              actif ? 'bg-black/6 text-black/55' : 'bg-white/10 text-white/45'
                            }`}
                          >
                            {article.univers}
                          </span>
                        )}
                        {article.promo && (
                          <span
                            className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${
                              actif ? 'text-black' : 'text-black'
                            }`}
                            style={{ background: VERT }}
                          >
                            Promo rayon 7
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* ———————————————————————— le menu du magasin ———————————————————————— */}
        <section id="menus" className="mt-14">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-3">
            <h3 className="font-mono text-[13px] font-bold uppercase tracking-[0.18em]">
              Rayon Menus · le chariot déjà rempli
            </h3>
            <span className="font-mono text-[10.5px] text-white/40">
              Un menu choisi et la carte de fidélité passe à -10 %
            </span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {PACKAGES.map((pkg) => {
              const actif = menu === pkg.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  role="radio"
                  aria-checked={actif}
                  onClick={() => choisirMenu(pkg.id)}
                  className={`relative flex h-full flex-col rounded-[20px] border p-5 text-left transition ${
                    actif ? 'border-transparent bg-white text-black' : 'border-white/12 bg-white/[0.04] hover:border-white/30'
                  }`}
                >
                  {pkg.popular && (
                    <span
                      className="absolute -top-2.5 left-5 rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-black"
                      style={{ background: VERT }}
                    >
                      Le plus pris
                    </span>
                  )}
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-[12px] font-bold uppercase tracking-[0.16em]">
                      Menu {pkg.name}
                    </span>
                    <span className="text-[15px] font-black">{euros(pkg.prix)}</span>
                  </div>
                  <p className={`mt-2 text-[11.5px] leading-relaxed ${actif ? 'text-black/55' : 'text-white/50'}`}>
                    {pkg.description}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                    {pkg.features.map((f) => (
                      <span
                        key={f}
                        className={`rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                          actif ? 'bg-black/6 text-black/55' : 'bg-white/10 text-white/50'
                        }`}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  <span className={`mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest ${actif ? 'text-black' : 'text-white/45'}`}>
                    {actif ? <Check size={12} /> : <Sparkles size={12} />}
                    {actif ? 'Dans le caddie' : `Prendre le menu ${pkg.name}`}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ————————————————————————— la caisse ————————————————————————— */}
        <section id="caisse" className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: VERT }}>
              En caisse
            </span>
            <h2 className="mt-2 max-w-[520px] text-[26px] font-semibold leading-tight tracking-[-0.02em] sm:text-[32px]">
              {paye ? 'Ticket payé. Le mariage est à vous.' : 'Le ticket se calcule à mesure que vous cochez.'}
            </h2>
            <p className="mt-4 max-w-[540px] text-[13px] leading-relaxed text-white/60">
              {paye
                ? 'Ce ticket n’est pas qu’un souvenir : les horaires cochés sont ceux du programme, et les métiers sont ceux des univers. Il reste à les faire vivre dans un vrai mini-site.'
                : 'Regardez la colonne de droite : chaque coche ajoute sa ligne, la remise s’applique, la TVA reste incluse. Un menu choisi débloque la carte de fidélité.'}
            </p>

            {/* Le récapitulatif de caddie */}
            <div className="mt-6 rounded-[20px] border border-white/12 bg-white/[0.04] p-5">
              <div className="flex items-center gap-2">
                <BadgeEuro size={15} className="text-white/50" />
                <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-white/60">
                  Récapitulatif
                </span>
              </div>

              {lignes.length === 0 ? (
                <p className="mt-3 text-[12.5px] text-white/50">
                  Le caddie est vide : remontez dans les rayons et cochez un horaire, puis un métier.
                </p>
              ) : (
                <div className="mt-3 space-y-1.5">
                  {lignes.map((ligne) => (
                    <div key={ligne.id} className="flex items-baseline justify-between gap-3 text-[12px]">
                      <span className="min-w-0 flex-1 truncate text-white/70">
                        <span className="font-mono text-[10px] text-white/40">×{ligne.quantite}</span>{' '}
                        {ligne.label}
                      </span>
                      <span className="font-mono tabular-nums text-white/85">{euros(ligne.total)}</span>
                    </div>
                  ))}
                  <div className="!mt-3 flex items-baseline justify-between border-t border-white/12 pt-3">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-white/55">
                      Total
                    </span>
                    <span className="text-[17px] font-black tabular-nums">{euros(total.total)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={payer}
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-bold text-black transition hover:brightness-110"
                style={{ background: VERT }}
              >
                <ScanBarcode size={14} /> {paye ? 'Repasser à la caisse' : 'Passer à la caisse'}
              </button>
              <button
                type="button"
                onClick={refaire}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-[12.5px] font-semibold text-white/75 transition hover:border-white/40 hover:text-white"
              >
                <RotateCcw size={13} /> Refaire mes courses
              </button>
              {paye && (
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-[12.5px] font-semibold text-white/75 transition hover:border-white/40 hover:text-white"
                >
                  <Printer size={13} /> Imprimer le ticket
                </button>
              )}
            </div>

            {/* Ce que le ticket devient, une fois payé */}
            {paye && (
              <div className="mt-8 rounded-[22px] border border-white/12 bg-white/[0.04] p-5">
                <div className="font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-white/55">
                  Et maintenant ?
                </div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-white/65">
                  Vos horaires cochés deviennent le programme du mini-site, vos métiers deviennent ses
                  prestataires, et le menu devient la section des formules. On ne recopie rien deux fois.
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <Link
                    to="/creer"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12.5px] font-bold text-black no-underline transition hover:bg-white/90"
                  >
                    Créer ma carte <ArrowRight size={13} />
                  </Link>
                  <Link
                    to="/le-mariage"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[12.5px] font-semibold text-white/80 no-underline transition hover:border-white/40"
                  >
                    Le mariage, en entier
                  </Link>
                  <Link
                    to="/apercu?style=supermarche"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[12.5px] font-semibold text-white/80 no-underline transition hover:border-white/40"
                  >
                    Ouvrir le mini-site Supermarché 22H
                  </Link>
                  <Link
                    to="/prestataire"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[12.5px] font-semibold text-white/80 no-underline transition hover:border-white/40"
                  >
                    Voir l’éditeur des métiers
                  </Link>
                </div>
              </div>
            )}

            <p className="mt-6 font-mono text-[10.5px] leading-relaxed text-white/35">
              Les prix sont indicatifs et servent à composer : rien n’est facturé, rien n’est réservé.
              Le jour où le magasin ouvre vraiment, on vous le dira.
            </p>
          </div>

          {/* Le ticket, en vrai */}
          <div className="lg:sticky lg:top-24">
            <TicketCaisse
              lignes={lignes}
              total={total}
              numero={numero}
              dateLabel={dateLabel}
              heureLabel={heureLabel}
              paye={paye}
              magasin={MAGASIN}
              couple={TICKET_COUPLE}
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-5 py-12 sm:px-8">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: VERT }}>
              <ShoppingCart size={14} className="text-black" />
            </span>
            <span className="font-mono text-[12px] font-bold tracking-[0.18em]">{MAGASIN.nom}</span>
          </div>
          <p className="max-w-[520px] text-[12px] leading-relaxed text-white/45">
            Un rayon ouvert par les univers VOWS : les horaires viennent du programme du Supermarché
            22H, les métiers des {RAYONS.length - 2} domaines, les menus des trois formules du
            magasin.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-white/60 no-underline transition hover:text-white"
          >
            Retour au site <ArrowRight size={13} />
          </Link>
        </div>
      </footer>
    </div>
  );
}
