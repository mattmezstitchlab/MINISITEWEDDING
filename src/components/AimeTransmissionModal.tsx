import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  HelpCircle,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Clock,
  Send,
  X,
  Lock,
  CheckCircle2,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import { AimeTransmissionService, type TransmissionExplanation } from '../lib/aimeTransmissionService';

interface TransmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  situationKey: 'CEREMONIE_DECALEE' | 'BALANCE_SAXO' | 'SURPRISE_TEMOINS' | 'VOYAGE_RYOKAN';
  defaultTargetId?: string;
}

export default function AimeTransmissionModal({
  isOpen,
  onClose,
  projectId,
  situationKey,
  defaultTargetId = 'usr-lucas',
}: TransmissionModalProps) {
  const [selectedTargetId, setSelectedTargetId] = useState<string>(defaultTargetId);
  const [hasSent, setHasSent] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (!isOpen) return null;

  // Calcul instantané de l'explication et de la transmission selon la personne et les droits
  const explanation = AimeTransmissionService.explainSituationForPerson(
    projectId,
    selectedTargetId,
    situationKey
  );

  const handleValidate = () => {
    setHasSent(true);
    setTimeout(() => {
      setHasSent(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 p-4 sm:p-6 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-[28px] bg-white text-[#0B0C12] shadow-2xl overflow-hidden border border-black/10 flex flex-col max-h-[90vh]">
        
        {/* HEADER DE COMPRÉHENSION */}
        <div className="flex items-center justify-between border-b border-black/8 px-6 py-4 bg-[#FBFBFD]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
              <Sparkles size={16} className="text-fuchsia-400" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-black flex items-center gap-2">
                <span>Compréhension &amp; Transmission</span>
              </h3>
              <div className="text-[12px] text-black/50">
                AIME éclaire la situation · Vous gardez le contrôle de ce qui est partagé.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-black hover:bg-black hover:text-white transition"
          >
            <X size={15} />
          </button>
        </div>

        {/* CONTENU */}
        <div className="p-6 overflow-y-auto space-y-5 text-left custom-scrollbar">
          
          {/* SÉLECTEUR DU DESTINATAIRE POUR OBSERVER LA DIFFÉRENCE CONTEXTUELLE */}
          <div className="flex items-center justify-between p-3 rounded-[16px] bg-[#F7F7F8] border border-black/6">
            <span className="text-[12px] font-mono text-black/60 font-bold">Destinataire concerné :</span>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'usr-lucas', label: 'Lucas (Témoin)' },
                { id: 'usr-mattmez', label: 'Matt Mez (Saxo)' },
                { id: 'usr-sarah', label: 'Sarah (Mariée)' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedTargetId(p.id);
                    setIsEditing(false);
                    setCustomText('');
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
                    selectedTargetId === p.id
                      ? 'bg-black text-white font-bold shadow-sm'
                      : 'bg-white border border-black/10 text-black/70 hover:text-black'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* CAS D'UN ÉVÉNEMENT CONFIDENTIEL */}
          {explanation.securityClearance === 'BLOCKED_BY_IMMUNITY' ? (
            <div className="p-5 rounded-[20px] bg-neutral-50 border border-neutral-200 text-neutral-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-[14px]">
                <ShieldAlert size={18} className="text-neutral-500" />
                <span>Information Confidentielle</span>
              </div>
              <p className="text-[12.5px] leading-relaxed text-neutral-700">
                Ce moment fait partie d'une surprise ou d'un échange réservé. Il n'apparaît pas dans le planning partagé de {explanation.targetName}.
              </p>
            </div>
          ) : (
            <>
              {/* ANALYSE DU POURQUOI MAINTENANT & DE L'HISTORIQUE */}
              <div className="rounded-[20px] bg-[#FAFAFC] border border-black/8 p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-black/6 pb-2">
                  <div className="font-bold text-[13px] text-black flex items-center gap-2">
                    <Info size={15} className="text-blue-600" />
                    <span>Situation : {explanation.situationTitle}</span>
                  </div>
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold">
                    NIVEAU : {explanation.transmissionLevel}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11.5px] text-black/80">
                  <div className="p-2.5 rounded-[12px] bg-white border border-black/5 space-y-1">
                    <span className="text-black/40 font-mono text-[10px] uppercase block font-bold">Pourquoi maintenant ?</span>
                    <div>{explanation.whyNow}</div>
                  </div>

                  <div className="p-2.5 rounded-[12px] bg-white border border-black/5 space-y-1">
                    <span className="text-black/40 font-mono text-[10px] uppercase block font-bold">Conséquence concrète</span>
                    <div>{explanation.consequences}</div>
                  </div>
                </div>

                {explanation.historicalContext && (
                  <div className="text-[11px] text-black/60 pt-1 italic font-mono border-t border-black/5">
                    Origine : {explanation.historicalContext}
                  </div>
                )}
              </div>

              {/* LA PROPOSITION DE FORMULATION */}
              <div className="rounded-[22px] bg-gradient-to-br from-neutral-900 to-black text-white p-5 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-mono uppercase text-fuchsia-400 font-bold flex items-center gap-1.5">
                    <Sparkles size={13} />
                    <span>Message suggéré</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/50">
                    Pour : {explanation.targetName} ({explanation.targetRole})
                  </span>
                </div>

                {!isEditing ? (
                  <div className="text-[13.5px] text-white/95 leading-relaxed bg-white/10 p-3.5 rounded-[14px] border border-white/10 font-normal">
                    « {customText || explanation.recommendedTransmission} »
                  </div>
                ) : (
                  <textarea
                    rows={3}
                    value={customText || explanation.recommendedTransmission}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="w-full rounded-[14px] bg-white/10 p-3 text-[13px] text-white border border-white/20 outline-none focus:border-white/40"
                  />
                )}

                <div className="flex items-center justify-between pt-1 text-[11px] text-white/60">
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-white hover:underline text-[11.5px]"
                  >
                    {isEditing ? 'Valider la modification' : 'Modifier la formulation'}
                  </button>
                  <span className="italic">Zéro spam : transmets uniquement l'essentiel</span>
                </div>
              </div>

              {/* BOUTONS D'ARBITRAGE HUMAIN */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-full text-[12px] font-semibold text-black/60 hover:text-black hover:bg-black/5 transition"
                >
                  Ne pas transmettre
                </button>

                <button
                  type="button"
                  onClick={handleValidate}
                  disabled={hasSent}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white text-[12px] font-bold shadow-md hover:bg-neutral-800 transition disabled:bg-emerald-600"
                >
                  {hasSent ? (
                    <>
                      <Check size={14} />
                      <span>Message prêt &amp; validé</span>
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      <span>Valider &amp; Transmettre à {explanation.targetName}</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
}
