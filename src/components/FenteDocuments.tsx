import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { annonceDuJour, oublierDemande, useDemandes } from '../lib/documents';

/**
 * LA FENTE — EN HAUT DU SITE, LE TICKET QUI SORT
 *
 * Elle ne dit qu'une chose, et seulement quand il y a quelque chose à dire :
 * **« Document disponible concernant … »** — qui l'a demandé, pour qui, et où
 * l'on va. Le reste du temps, il n'y a rien : une fente fermée ne se voit pas.
 *
 * C'est le bandeau d'intégration : on apprend ici ce qui vient de se passer,
 * sans ouvrir une page pour le découvrir.
 */

export default function FenteDocuments() {
  const demandes = useDemandes();
  const annonce = annonceDuJour(demandes);
  /** On l'a lue : elle se retire, sans effacer la demande. */
  const [lue, setLue] = useState<string | null>(null);

  const visible = Boolean(annonce) && annonce!.id !== lue;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center">
      {/* La fente : une fente sombre, et le ticket qui en sort. */}
      <div className="relative flex w-full max-w-[560px] flex-col items-center">
        <div className="h-1.5 w-full rounded-b-[6px] bg-[#0B0C12] shadow-[0_6px_18px_rgba(0,0,0,0.35)]" aria-hidden="true" />

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
              <div className="mx-2 mt-0 flex items-start gap-3 rounded-b-[12px] bg-[#FFFEF7] px-4 py-3 font-mono text-[11.5px] text-black shadow-[0_22px_50px_rgba(0,0,0,0.35)]">
                <div className="min-w-0 flex-1">
                  <div className="text-[9.5px] uppercase tracking-[0.2em] text-black/45">
                    {annonce!.etat === 'disponible' ? 'Document disponible' : 'Document demandé'}
                  </div>
                  <div className="mt-1 text-[12.5px] font-bold leading-tight">{annonce!.document}</div>
                  <div className="mt-1 text-black/60">
                    demandé par {annonce!.parQui}
                    {annonce!.pourQui ? ` · pour ${annonce!.pourQui}` : ''}
                  </div>
                  <Link
                    to="/footer"
                    className="mt-2 inline-block font-bold text-black underline underline-offset-2 no-underline"
                  >
                    Ouvrir SUPER FOOTER
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLue(annonce!.id);
                    oublierDemande(annonce!.id);
                  }}
                  aria-label="Retirer cette annonce"
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-black/40 transition hover:bg-black/8 hover:text-black"
                >
                  <X size={13} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
