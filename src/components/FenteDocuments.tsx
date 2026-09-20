import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Handshake, ShieldCheck, X } from 'lucide-react';
import {
  MENTION_DROITS, actionsPossibles, annonceCourante, changerEtatAnnonce, fermerFente, titreDuType,
  useAnnonces, useFenteOuverte, type EtatAnnonce,
} from '../lib/annonces';
import { DOCUMENTS } from '../lib/superFooter';
import { rangerAuWallet } from '../lib/wallet';
import { usePersonaCourante } from '../lib/personaCourant';

/**
 * LA FENTE — LE TICKET QUI SORT EN HAUT DU SITE
 *
 * Elle ne parle **que quand il y a un ticket** : le point d'état s'allume, on
 * clique, la fente s'ouvre — et celui qui arrive s'ouvre tout seul devant nous.
 * Le ticket dit de quoi il s'agit, rappelle **vos droits** (on n'est pas obligé
 * d'ouvrir, ni d'imprimer ; votre choix est enregistré), et propose trois gestes :
 *
 * - **Ne pas ouvrir** : le choix est écrit, et rien ne s'imprime ;
 * - **Valider** : la pièce se range dans le portefeuille, et l'autre est prévenu ;
 * - **Négocier** : un retour part, et la négociation reste sur le ticket.
 */

export default function FenteDocuments() {
  const annonces = useAnnonces();
  const ouverte = useFenteOuverte();
  const moi = usePersonaCourante();
  /** La réponse qu'on vient de donner, pour la montrer sur le ticket. */
  const [reponse, setReponse] = useState<string | null>(null);

  const annonce = annonceCourante(annonces);
  const visible = ouverte && Boolean(annonce);

  const agir = (id: EtatAnnonce) => {
    if (!annonce) return;
    changerEtatAnnonce(annonce.id, id);
    if (id === 'valide' && annonce.documentId) {
      const doc = DOCUMENTS.find((d) => d.id === annonce.documentId);
      if (doc) rangerAuWallet(doc, moi.nom);
    }
    setReponse(id);
    fermerFente();
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center">
      <div className="relative flex w-full max-w-[600px] flex-col items-center">
        {/* La fente, tant qu'il y a un ticket : on la voit, on ne la remarque pas vide. */}
        <div
          className={`h-1.5 w-full rounded-b-[6px] transition-colors ${visible ? 'bg-[#0B0C12]' : 'bg-transparent'}`}
          aria-hidden="true"
        />

        <AnimatePresence initial={false}>
          {visible && (
            <motion.div
              key={annonce!.id}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto overflow-hidden"
            >
              <div className="mx-2 rounded-b-[14px] bg-[#FFFEF7] px-5 py-4 font-mono text-[11.5px] text-black shadow-[0_22px_50px_rgba(0,0,0,0.35)]">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-[9.5px] uppercase tracking-[0.2em] text-black/45">
                      {titreDuType(annonce!.type)}
                    </div>
                    <div className="mt-1 text-[13px] font-bold leading-tight">{annonce!.titre}</div>
                    <div className="mt-1 text-black/60">{annonce!.detail}</div>
                  </div>
                  <button
                    type="button"
                    onClick={fermerFente}
                    aria-label="Refermer la fente"
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-black/40 transition hover:bg-black/8 hover:text-black"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* VOS DROITS, écrits noir sur blanc — et rien de plus. */}
                <p className="mt-3 flex gap-2 border-t border-dashed border-black/20 pt-3 text-[10.5px] leading-relaxed text-black/70">
                  <ShieldCheck size={13} className="mt-0.5 shrink-0" />
                  <span>{annonce!.droits || MENTION_DROITS}</span>
                </p>

                {/* LES TROIS GESTES */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {actionsPossibles(annonce!).map((action) => (
                    <button
                      key={action.id}
                      type="button"
                      title={action.aide}
                      onClick={() => agir(action.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold transition ${
                        action.id === 'valide'
                          ? 'bg-[#0B0C12] text-white hover:brightness-125'
                          : 'border border-black/15 text-black/70 hover:border-black/50 hover:text-black'
                      }`}
                    >
                      {action.id === 'negocie' && <Handshake size={12} />}
                      {action.label}
                    </button>
                  ))}
                  <Link
                    to="/footer"
                    className="inline-flex items-center rounded-full border border-black/15 px-3.5 py-1.5 text-[11.5px] font-semibold text-black/70 no-underline transition hover:border-black/50 hover:text-black"
                  >
                    Ouvrir SUPER FOOTER
                  </Link>
                </div>

                <div className="mt-2.5 text-[9px] uppercase tracking-widest text-black/40">
                  {reponse
                    ? 'Réponse enregistrée · le ticket garde la trace'
                    : 'Aucune impression nécessaire · votre choix est horodaté'}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
