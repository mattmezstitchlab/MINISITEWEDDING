import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, Check, Music2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  LA_BARRE,
  LES_HÉROS,
  LE_PIED,
  LE_TITRE,
  LES_FORMULES,
  LES_GESTES,
  LES_QUESTIONS,
  LES_TROIS_FAMILLES,
} from '../lib/bandesDeLAime';
import { PORTEFEUILLES } from '../lib/portefeuille';
import { euros } from '../lib/superMariage';

/* LES BANDES DE LA PAGE D'ENTRÉE
 *
 * Ce qui est repris de la référence (Tapdaa, étudiée le 20 septembre 2026) :
 * **le rythme** — une barre qui porte la marque et une pastille sombre ; un
 * titre unique et une phrase ; une suite numérotée qui va jusqu'au bout ;
 * trois colonnes **égales** séparées par des filets ; une bande d'image calme ;
 * trois formules de même poids ; des questions ; un pied qui répète la marque.
 *
 * Ce qui n'est **pas** repris : la marque, la couleur d'accent, les cartes
 * arrondies teintées, les visuels produits, les mots, la structure commerciale
 * (essai gratuit, abonnement, labels NFC). Ici, tout est écrit avec le matériel
 * d'AIME : blanc et encre, filets de 1 px, chiffres tabulaires, images du
 * magazine, et le vocabulaire du ticket.
 */

/**
 * **La barre.** Elle flotte au-dessus de la page : la marque à gauche, les
 * quatre portes au centre, et à droite **l'état du ticket** — le nombre de
 * lignes, le total, le code du mariage — puis la pastille d'encre.
 *
 * Deux choses la rendent moderne, et rien d'autre : elle est **translucide**
 * (le contenu passe dessous), et sur un téléphone elle **ne se replie pas en
 * menu** — les quatre portes glissent sous la marque, à hauteur de pouce. Pas
 * de burger, pas de tiroir, pas de deuxième barre.
 */
export function BarreDeLAime({
  lignes,
  total,
  part,
}: {
  /** Ce qu'il y a sur le ticket : le compte, et le total. */
  lignes: number;
  total: number;
  /** **La part du rêve** déjà financée, de zéro à un : la cible, dans la barre. */
  part: number;
}) {
  const pourcent = Math.round(part * 100);
  /* La barre se resserre dès qu'on descend : elle prend moins de place quand on
     lit, et reprend sa taille quand on remonte. */
  const [serrée, setSerrée] = useState(false);

  useEffect(() => {
    const auDéfilement = () => setSerrée(window.scrollY > 24);
    auDéfilement();
    window.addEventListener('scroll', auDéfilement, { passive: true });
    return () => window.removeEventListener('scroll', auDéfilement);
  }, []);

  const porte = (lien: { mot: string; vers: string }, taille: string) =>
    lien.vers.startsWith('/') ? (
      <Link key={lien.mot} to={lien.vers} data-lien={lien.mot} className={taille}>
        {lien.mot}
      </Link>
    ) : (
      <a key={lien.mot} href={lien.vers} data-lien={lien.mot} className={taille}>
        {lien.mot}
      </a>
    );

  const motDePorte =
    'shrink-0 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[color:var(--vp-muted)] transition hover:text-[color:var(--vp-ink)]';

  return (
    <div
      data-bande="barre"
      data-barre-serrée={serrée ? 'vrai' : 'false'}
      className={`sticky top-0 z-50 px-3 pb-1 transition-[padding] duration-300 sm:px-5 ${
        serrée ? 'pt-1.5' : 'pt-3'
      }`}
    >
      <div className="vp-barre-flottante mx-auto max-w-[1180px] px-3 py-2 sm:px-4">
        <div className="flex items-center justify-between gap-3">
          <a href="#l-appareil" className="flex items-baseline gap-2" data-marque="AIME">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--vp-ink)] font-mono text-[10.5px] font-bold text-white">
              A
            </span>
            <span className="text-[13.5px] font-bold tracking-[-0.03em]">AIME</span>
            <span className="hidden font-mono text-[9.5px] uppercase tracking-[0.16em] text-[color:var(--vp-muted)] sm:inline">
              {LA_BARRE.filet}
            </span>
          </a>

          <nav className="hidden items-center gap-5 md:flex">{LA_BARRE.liens.map((l) => porte(l, motDePorte))}</nav>

          <span className="flex items-center gap-1.5 sm:gap-2">
            {/* L'état du ticket, toujours sous les yeux : le compte, le total. */}
            <span
              data-barre-compte={lignes}
              data-barre-part={pourcent}
              className="hidden items-center gap-2 rounded-full bg-black/[0.045] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[color:var(--vp-ink)] sm:flex"
            >
              <span className="block h-1.5 w-10 overflow-hidden rounded-full bg-black/10 md:w-14">
                <i
                  className="block h-full bg-[color:var(--vp-ink)] transition-[width] duration-500"
                  style={{ width: `${pourcent}%` }}
                />
              </span>
              <span className="tabular-nums">{pourcent} % du rêve</span>
              <span aria-hidden="true" className="text-[color:var(--vp-line)]">
                |
              </span>
              <span className="tabular-nums">
                {lignes} ligne{lignes > 1 ? 's' : ''}
              </span>
              <span aria-hidden="true" className="text-[color:var(--vp-line)]">
                |
              </span>
              <span className="tabular-nums">{euros(total)}</span>
            </span>

            <a href="#la-machine" data-action="ouvrir-le-ticket" className="vp-pastille !py-2 !text-[11px]">
              Ouvrir le ticket
            </a>
          </span>
        </div>

        {/* Sur un téléphone, les quatre portes glissent : pas de menu à ouvrir. */}
        <nav
          data-barre-portes="vrai"
          className="mt-2 flex items-center gap-4 overflow-x-auto border-t border-[color:var(--vp-line)] pt-2 md:hidden"
        >
          {LA_BARRE.liens.map((l) => porte(l, motDePorte))}
        </nav>
      </div>
    </div>
  );
}

/**
 * **Les quatre héros de catégorie.** Chacun est **une image, un titre dessus, et
 * le chemin de ce qu'il contient** : c'est ainsi que l'arborescence du produit
 * se lit d'un coup d'œil, au lieu d'être expliquée par un paragraphe. Ils
 * ouvrent aussi l'écran de l'appareil sur la catégorie choisie.
 */
export function LesHeros({ cible, surCible }: { cible: string; surCible: (id: string) => void }) {
  return (
    <section id="les-catégories" data-bande="héros" className="vp-bande">
      <div className="vp-page">
        <p className="vp-bande-nom">
          <b>AIME</b>
          <span aria-hidden="true">·</span>
          <span>LES QUATRE CATÉGORIES</span>
        </p>

        <div className="mt-8 max-w-[54ch]">
          <h2 data-bande-titre="héros" className="vp-bande-titre">
            Quatre entrées, et tout le produit dedans.
          </h2>
          <p className="vp-bande-sous mt-5">
            Le jour J a un prix, le voyage a une cible, les objets sortent du ticket, et le code ouvre le reste.
            Chaque image montre le chemin — et l’écran de l’appareil suit.
          </p>
        </div>

        <div data-héros="vrai" className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {LES_HÉROS.map((héros) => (
            <button
              key={héros.id}
              type="button"
              data-héros-de-la-landing={héros.id}
              data-actif={héros.id === cible ? 'true' : 'false'}
              aria-pressed={héros.id === cible}
              onClick={() => {
                surCible(héros.id);
                document.getElementById('l-appareil')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`vp-heros h-[420px] text-left transition sm:h-[460px] ${
                héros.id === cible ? 'ring-2 ring-[color:var(--vp-ink)] ring-offset-2' : ''
              }`}
            >
              <img src={héros.image} alt={héros.titre} data-héros-image={héros.id} />
              <span aria-hidden="true" className="vp-heros-voile" />
              <span className="absolute inset-x-0 bottom-0 block px-4 pb-4">
                <span className="block font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/65">
                  {héros.mot}
                </span>
                <span data-héros-titre={héros.id} className="vp-hero-titre mt-1.5 block text-white">
                  {héros.titre}
                </span>
                <span className="mt-2 block text-[12.5px] leading-snug text-white/70">{héros.sous}</span>
                <span data-héros-chemin={héros.id} className="mt-3 flex flex-col gap-0.5">
                  {héros.chemin.map((étape) => (
                    <span key={étape} className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-white/55">
                      · {étape}
                    </span>
                  ))}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Une bande : son nom à gauche, son contenu au centre. */
function Bande({
  nom,
  fond,
  children,
  id,
}: {
  nom: string;
  fond?: boolean;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} data-bande={nom} className={`vp-bande ${fond ? 'vp-bande-fond' : ''}`}>
      <div className="vp-page">
        <p className="vp-bande-nom">
          <b>{LA_BARRE.marque}</b>
          <span aria-hidden="true">·</span>
          <span>{nom}</span>
        </p>
        <div className="mt-7">{children}</div>
      </div>
    </section>
  );
}

/** Le titre : une phrase, une image du jour, et deux portes. */
export function LeTitre({ couverture, legende }: { couverture: string | null; legende: string }) {
  return (
    <section data-bande="titre" className="vp-bande">
      <div className="vp-page">
        <p className="vp-bande-nom">
          <b>{LA_BARRE.marque}</b>
          <span aria-hidden="true">·</span>
          <span>{LE_TITRE.eyebrow}</span>
        </p>

        <div className="mt-8 grid items-end gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.72fr)] md:gap-14">
          <div>
            <h1 data-titre-de-la-page="vrai" className="vp-bande-titre max-w-[15ch]">
              {LE_TITRE.titre}
            </h1>
            <p className="vp-bande-sous mt-6 max-w-[46ch]">{LE_TITRE.sous}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {LE_TITRE.pastilles.map((pastille) => (
                <a
                  key={pastille.mot}
                  href={pastille.vers}
                  data-pastille={pastille.mot}
                  className={`vp-pastille ${pastille.fort ? '' : 'vp-pastille-trait'}`}
                >
                  {pastille.mot}
                  {pastille.fort ? <ArrowDown size={14} /> : <ArrowRight size={14} />}
                </a>
              ))}
            </div>
          </div>

          {couverture && (
            <figure data-cover="jour" className="relative">
              <img
                src={couverture}
                alt=""
                className="aspect-[3/4] w-full rounded-[3px] object-cover shadow-[0_24px_60px_rgba(12,14,24,0.14)]"
              />
              <figcaption className="vp-caption mt-3 flex items-baseline justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em]">{LE_TITRE.legende}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--vp-muted-2)]">
                  {legende}
                </span>
              </figcaption>
            </figure>
          )}
        </div>
      </div>
    </section>
  );
}

/** Les quatre gestes, numérotés — et à droite, les cinq papiers qui en sortent. */
export function LesGestes() {
  return (
    <Bande nom="LE PROGRAMME" fond>
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.62fr)] md:gap-14">
        <div>
          <h2 data-bande-titre="programme" className="vp-bande-titre max-w-[20ch]">
            Quatre gestes, et c’est tout.
          </h2>
          <p className="vp-bande-sous mt-5 max-w-[44ch]">
            On part d’une liste et on arrive à cinq papiers. Entre les deux : une machine, un ticket, et rien
            d’autre à comprendre.
          </p>

          <ol data-gestes="vrai" className="mt-10 flex flex-col">
            {LES_GESTES.map((geste) => (
              <li
                key={geste.numero}
                data-geste={geste.numero}
                className="grid grid-cols-[3.2rem_minmax(0,1fr)] gap-4 border-t border-[color:var(--vp-line)] py-5 last:border-b"
              >
                <span className="vp-geste-numero">{geste.numero}</span>
                <span>
                  <span className="block text-[17px] font-semibold tracking-[-0.02em]">{geste.titre}</span>
                  <span className="vp-body mt-1 block text-[14.5px]">{geste.texte}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Les cinq papiers : c'est ce que les quatre gestes produisent. */}
        <div data-papiers="vrai" className="md:pt-24">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--vp-muted)]">
            LES CINQ PAPIERS
          </p>
          <ul className="mt-4 flex flex-col">
            {PORTEFEUILLES.map((papier) => (
              <li
                key={papier.id}
                data-papier={papier.id}
                data-exemplaires={papier.exemplaires}
                className="flex items-baseline justify-between gap-3 border-t border-[color:var(--vp-line)] py-3 last:border-b"
              >
                <span className="flex items-baseline gap-2">
                  <span aria-hidden="true" className="text-[13px] text-[color:var(--vp-muted)]">
                    {papier.marque}
                  </span>
                  <span className="text-[14.5px] font-medium tracking-[-0.015em]">{papier.mot}</span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[color:var(--vp-muted)]">
                  {papier.exemplaires} exemplaire{papier.exemplaires === '1' ? '' : 's'} · {papier.papier}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Bande>
  );
}

/** Les trois familles : trois colonnes égales, chacune avec sa porte. */
export function LesTroisFamilles() {
  return (
    <section id="les-trois-familles" data-bande="familles" className="vp-bande">
      <div className="vp-page">
        <p className="vp-bande-nom">
          <b>{LA_BARRE.marque}</b>
          <span aria-hidden="true">·</span>
          <span>CE QU’ON COCHE</span>
        </p>

        <div className="mt-8 max-w-[52ch]">
          <h2 data-bande-titre="familles" className="vp-bande-titre">
            Tout est classé. On coche.
          </h2>
          <p className="vp-bande-sous mt-5">
            Le jour J a un prix. Le site et les documents sont inclus. Rien ne se cherche : tout est rangé, et le
            ticket s’en occupe.
          </p>
        </div>

        <div data-colonnes="familles" className="vp-colonnes mt-10">
          {LES_TROIS_FAMILLES.map((famille) => (
            <a
              key={famille.id}
              href={famille.vers}
              data-famille-de-la-landing={famille.id}
              data-compte={famille.compte}
              className="vp-colonne group flex flex-col justify-between gap-6 transition"
            >
              <span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--vp-muted)]">
                  {famille.sous}
                </span>
                <span className="mt-3 block text-[clamp(1.4rem,2.6vw,1.9rem)] font-semibold tracking-[-0.03em]">
                  {famille.mot}
                </span>
                <span className="mt-4 flex items-baseline gap-2">
                  <span className="text-[34px] font-semibold tracking-[-0.04em] [font-variant-numeric:tabular-nums]">
                    {famille.compte}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--vp-muted)]">
                    lignes · {famille.donne}
                  </span>
                </span>
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[color:var(--vp-ink)]">
                voir les lignes
                <ArrowRight size={13} className="transition group-hover:translate-x-1" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Les trois formules : même poids, aucune mise en avant de couleur. */
export function LesFormules({ onChoisir }: { onChoisir: (id: string) => void }) {
  return (
    <Bande nom="L’ADDITION">
      <div className="max-w-[52ch]">
        <h2 data-bande-titre="addition" className="vp-bande-titre">
          Trois façons de remplir le caddie.
        </h2>
        <p className="vp-bande-sous mt-5">
          Ce sont les trois menus du magasin, tels qu’ils sont déjà écrits. On les coche dans le ticket, et ils se
          calculent comme le reste. <span className="text-[color:var(--vp-ink)]">Tarifs indicatifs.</span>
        </p>
      </div>

      <div data-colonnes="formules" className="vp-colonnes mt-10">
        {LES_FORMULES.map((formule) => (
          <div key={formule.id} data-formule={formule.id} className="vp-colonne flex flex-col gap-6">
            <div>
              <span className="flex items-baseline justify-between gap-3">
                <span className="text-[15px] font-semibold tracking-[-0.02em]">{formule.nom}</span>
                {formule.note && (
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-[color:var(--vp-muted)]">
                    {formule.note}
                  </span>
                )}
              </span>
              <span className="mt-3 block text-[clamp(1.8rem,4vw,2.6rem)] font-semibold tracking-[-0.04em] [font-variant-numeric:tabular-nums]">
                {euros(formule.prix)}
              </span>
              <span className="vp-caption mt-2 block">{formule.description}</span>
            </div>

            <ul data-lignes-de-la-formule="vrai" className="flex flex-col gap-1.5">
              {formule.lignes.map((ligne) => (
                <li key={ligne} className="flex items-start gap-2 text-[13.5px] text-[color:var(--vp-ink-soft)]">
                  <Check size={13} className="mt-[3px] shrink-0 text-[color:var(--vp-muted)]" />
                  {ligne}
                </li>
              ))}
            </ul>

            <button
              type="button"
              data-action="cocher-le-menu"
              data-menu={formule.id}
              onClick={() => onChoisir(`menu-${formule.id}`)}
              className="vp-pastille vp-pastille-trait mt-auto self-start !text-[11px]"
            >
              {formule.plusTard}
            </button>
          </div>
        ))}
      </div>
    </Bande>
  );
}

/** Les questions : un titre, et les réponses. Aucun panneau, aucun badge. */
export function LesQuestions() {
  return (
    <Bande nom="QUESTIONS" fond>
      <div className="grid gap-10 md:grid-cols-[minmax(0,0.5fr)_minmax(0,1fr)] md:gap-14">
        <h2 data-bande-titre="questions" className="vp-bande-titre max-w-[14ch]">
          Ce qu’on nous demande le plus.
        </h2>
        <dl data-questions="vrai" className="flex flex-col">
          {LES_QUESTIONS.map((question) => (
            <div
              key={question.question}
              data-question={question.question}
              className="border-t border-[color:var(--vp-line)] py-5 last:border-b md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-8"
            >
              <dt className="text-[15.5px] font-semibold tracking-[-0.02em]">{question.question}</dt>
              <dd className="vp-body mt-2 text-[14.5px] md:mt-0">{question.reponse}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Bande>
  );
}

/** Le pied : la marque, les portes, et le dernier mot. */
export function LePied() {
  return (
    <footer data-bande="pied" className="vp-pied">
      <div className="vp-page flex flex-col gap-6">
        <p className="vp-bande-nom">
          <b>{LE_PIED.marque}</b>
          <span aria-hidden="true">·</span>
          <span>{LE_PIED.filet}</span>
        </p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {LE_PIED.liens.map((lien) =>
            lien.vers.startsWith('/') ? (
              <Link
                key={lien.mot}
                to={lien.vers}
                className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[color:var(--vp-muted)] transition hover:text-[color:var(--vp-ink)]"
              >
                {lien.mot}
              </Link>
            ) : (
              <a
                key={lien.mot}
                href={lien.vers}
                className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[color:var(--vp-muted)] transition hover:text-[color:var(--vp-ink)]"
              >
                {lien.mot}
              </a>
            ),
          )}
          <span className="ml-auto flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--vp-muted-2)]">
            <Music2 size={12} />
            ouvert quand tout est fermé
          </span>
        </div>
      </div>
    </footer>
  );
}
