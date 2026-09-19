import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { WEDDING_STYLES, styleById } from '../lib/weddingStyles';
import EditorShowcase from '../components/EditorShowcase';
import { enregistrerNavVerticale } from '../lib/navVerticale';
import { NAV_PARAMETRES } from '../lib/navDesPages';

/**
 * SUPER ÉDITEUR — LA PAGE DE L'ÉDITEUR DU MINI-SITE
 *
 * L'éditeur avait sa place sur l'accueil ; il a maintenant **sa page**, ouverte
 * par le bouton **Paramètres** (en bas à gauche, sur tout le site). Ici, on
 * travaille : on prend un univers, on regarde la page se composer, section par
 * section — et l'on comprend, en même temps, ce que la personne qui la remplit
 * verra de son côté.
 *
 * L'univers se choisit par l'adresse (`?univers=vegas`), pour qu'une page
 * d'éditeur se partage comme une page du site.
 */

export default function EditeurMiniSite() {
  const [params] = useSearchParams();
  const styleId = params.get('univers') ?? WEDDING_STYLES[0]!.id;
  const style = useMemo(() => styleById(styleId) ?? WEDDING_STYLES[0]!, [styleId]);

  // La nav de droite : le mini-site, ses univers, et le shop.
  useEffect(() => {
    enregistrerNavVerticale(NAV_PARAMETRES);
    return () => enregistrerNavVerticale(null);
  }, []);

  return (
    <div className="vp-env min-h-screen bg-[#FBFAF8] text-[#0B0C12] pb-40 pt-24">
      <header className="vp-page">
        <span className="vp-eyebrow">L’éditeur</span>
        <h1
          className="vp-title mt-4 text-[#0B0C12]"
          style={{ fontSize: 'clamp(2rem, 4.4vw, 3.4rem)', lineHeight: 1.04 }}
        >
          SUPER ÉDITEUR
        </h1>
        <p className="mt-5 max-w-[620px] text-[15px] leading-relaxed text-black/65">
          La page s’écrit une fois et se range sur les trois tailles. Ici, on la travaille
          section par section — le hero, le programme, la carte, les photos, la playlist — et
          l’on voit exactement ce que chacun verra de son côté, selon la carte qu’il tient.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {WEDDING_STYLES.slice(0, 6).map((u) => (
            <a
              key={u.id}
              href={`/parametres?univers=${u.id}`}
              className={`rounded-full border px-3 py-1.5 text-[12px] no-underline transition ${
                u.id === style.id
                  ? 'border-transparent bg-[#0B0C12] text-white'
                  : 'border-black/12 text-black/60 hover:border-black/40 hover:text-black'
              }`}
            >
              {u.name}
            </a>
          ))}
        </div>
      </header>

      <div id="mini-site" className="mt-12">
        <EditorShowcase key={style.id} styleId={style.id} />
      </div>
    </div>
  );
}
