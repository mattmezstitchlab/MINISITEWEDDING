import { CalendarDays, CreditCard, Heart, Image as ImageIcon } from 'lucide-react';
import { styleById } from '../lib/weddingStyles';

/**
 * SUPER ÉDITEUR — LA MÊME PAGE, TROIS TAILLES
 *
 * À la place de l'écran d'édition, un ordinateur, une tablette et un téléphone :
 * **la même page**, au même moment, qui défile doucement sur chacun. C'est ce
 * que fait l'éditeur : on écrit une fois, et la page se range toute seule — le
 * hero, le programme, la carte, les photos — sur les trois tailles.
 *
 * L'éditeur lui-même a sa page : le bouton **Paramètres**, en bas à gauche,
 * l'ouvre depuis n'importe où.
 */

/** La page montrée dans les trois appareils — la même, à trois largeurs. */
function Page() {
  return (
    <div className="bg-[#0B0C12] text-white">
      {/* Le hero de la page */}
      <div className="relative h-[168px] overflow-hidden">
        <img src="/images/garden.jpg" alt="" className="h-full w-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
        <div className="absolute inset-x-0 bottom-3 px-4 text-center">
          <div className="font-mono text-[7.5px] uppercase tracking-[0.2em] text-white/60">
            Samedi 12 septembre
          </div>
          <div className="vp-title mt-1 text-[17px] leading-tight">Camille & Théo</div>
        </div>
      </div>

      {/* Le programme */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-1.5 font-mono text-[7.5px] uppercase tracking-[0.2em] text-white/45">
          <CalendarDays size={9} /> Le programme
        </div>
        <div className="mt-2.5 grid gap-1.5">
          {[
            ['16:00', 'Cérémonie — sous les tilleuls'],
            ['18:30', 'Cocktail — terrasse haute'],
            ['23:00', 'Ouverture de bal'],
          ].map(([heure, texte]) => (
            <div key={heure} className="flex gap-3 border-b border-white/10 pb-1.5 text-[10px]">
              <span className="font-mono font-bold text-white/80">{heure}</span>
              <span className="min-w-0 flex-1 truncate text-white/60">{texte}</span>
            </div>
          ))}
        </div>
      </div>

      {/* La carte */}
      <div className="bg-white/5 px-4 py-4">
        <div className="flex items-center gap-1.5 font-mono text-[7.5px] uppercase tracking-[0.2em] text-white/45">
          <CreditCard size={9} /> La carte
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-2">
          {[
            ['Entrée', 'Velouté de saison'],
            ['Plat', 'Bar de ligne, fenouil'],
            ['Dessert', 'Pièce montée'],
            ['Minuit', 'Soupe à l’oignon'],
          ].map(([mot, plat]) => (
            <div key={mot} className="rounded-[10px] border border-white/10 p-2">
              <div className="font-mono text-[7px] uppercase tracking-[0.16em] text-white/40">{mot}</div>
              <div className="mt-1 text-[10px] leading-tight text-white/80">{plat}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Les photos, et le lien invité */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-1.5 font-mono text-[7.5px] uppercase tracking-[0.2em] text-white/45">
          <ImageIcon size={9} /> Les photos
        </div>
        <div className="mt-2.5 grid grid-cols-3 gap-1.5">
          {['chateau-terrasse-champagne.jpg', 'danse.jpg', 'bouquet.jpg', 'table-noir.jpg', 'vegas.jpg', 'terrasse.jpg'].map(
            (fichier) => (
              <img key={fichier} src={`/images/${fichier}`} alt="" className="h-[46px] w-full rounded-[7px] object-cover" />
            ),
          )}
        </div>
        <div className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-white py-2 text-[10px] font-bold text-[#0B0C12]">
          <Heart size={10} /> Répondre à l’invitation
        </div>
      </div>
    </div>
  );
}

export default function Appareils({ styleId }: { styleId: string }) {
  const style = styleById(styleId);
  return (
    <section id="editeur" className="bg-[#F4F2EE] py-16 sm:py-20">
      <div className="vp-page">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <div>
            <span className="vp-eyebrow">L’éditeur</span>
            <h2
              className="vp-title mt-4 text-[#0B0C12]"
              style={{ fontSize: 'clamp(2rem, 4.4vw, 3.4rem)', lineHeight: 1.04 }}
            >
              SUPER ÉDITEUR
            </h2>
          </div>
          <p className="text-[14.5px] leading-relaxed text-black/65">
            Une page s’écrit une fois, et se range sur les trois tailles. L’ordinateur pour
            préparer, la tablette pour montrer, le téléphone pour que chacun l’ait dans sa poche.
            C’est le même contenu, jamais recopié.
          </p>
        </div>

        {/* Les trois appareils : la même page, en train de défiler. */}
        <div className="mt-12 flex flex-wrap items-end justify-center gap-6 sm:gap-10">
          {/* L'ordinateur */}
          <div className="hidden sm:block">
            <div className="rounded-[16px] border border-black/15 bg-[#141414] p-2.5 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.5)]">
              <div className="h-[300px] w-[430px] overflow-hidden rounded-[9px] bg-[#0B0C12] xl:w-[520px]">
                <div className="vp-defile-page">
                  <Page />
                </div>
              </div>
            </div>
            <div className="mx-auto h-3 w-[120px] rounded-b-[10px] bg-[#1C1C1C]" />
            <div className="mx-auto h-1.5 w-[190px] rounded-full bg-[#1C1C1C]" />
          </div>

          {/* La tablette */}
          <div className="rounded-[20px] border border-black/15 bg-[#141414] p-2 shadow-[0_26px_60px_-30px_rgba(0,0,0,0.5)]">
            <div className="h-[260px] w-[190px] overflow-hidden rounded-[13px] bg-[#0B0C12]">
              <div className="vp-defile-page">
                <Page />
              </div>
            </div>
          </div>

          {/* Le téléphone */}
          <div className="rounded-[22px] border border-black/15 bg-[#141414] p-1.5 shadow-[0_24px_55px_-28px_rgba(0,0,0,0.5)]">
            <div className="relative h-[230px] w-[116px] overflow-hidden rounded-[18px] bg-[#0B0C12]">
              <div className="absolute left-1/2 top-1 z-10 h-1.5 w-8 -translate-x-1/2 rounded-full bg-black/50" />
              <div className="vp-defile-page">
                <Page />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center text-[12.5px] text-black/45">
          Ici, c’est l’univers{' '}
          <span className="font-semibold text-black/70">{style?.name ?? 'Sans univers'}</span> qui est
          mis en page — changez d’univers plus haut, la page suit.
        </div>
      </div>
    </section>
  );
}
