import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Lock, Eye, Sparkles, Clock, Send, Check } from 'lucide-react';
import { AimeKernelService } from '../lib/aimeKernelService';

interface AimeHumanPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  personId: string;
  projectId: string;
  onOpenTransmission?: (personId: string) => void;
}

export default function AimeHumanPersonModal({
  isOpen,
  onClose,
  personId,
  projectId,
  onOpenTransmission,
}: AimeHumanPersonModalProps) {
  if (!isOpen) return null;

  const identity = AimeKernelService.getIdentity(personId);
  const project = AimeKernelService.getProject(projectId);

  if (!identity) return null;

  // Récupération de son rôle contextuel dans le projet
  const roleInProject = (() => {
    if (personId === 'usr-lucas') {
      return {
        role: 'Témoin d’honneur & Coordination surprises',
        visible: 'Programme général, timing d’arrivée des invités, moments où il intervient',
        hidden: 'Facturation traiteur, budget confidentiel, surprises organisées par d’autres',
        moments: [
          { time: '16:00', title: 'Cérémonie & Discours' },
          { time: '21:45', title: 'Projection vidéo secrète' },
        ],
      };
    }
    if (personId === 'usr-mattmez') {
      return {
        role: 'Saxophoniste Live & Direction musicale sunset',
        visible: 'Créneau acoustique cocktail, balance son, accès régie',
        hidden: 'Vœux privés des mariés, liste complète des invités, budget traiteur',
        moments: [
          { time: '14:00', title: 'Balance acoustique & HF' },
          { time: '17:30', title: 'Set live deep house au coucher du soleil' },
        ],
      };
    }
    // usr-sarah ou autre
    return {
      role: 'Organisatrice & Mariée',
      visible: 'Ensemble des moments du projet, contacts, prestataires',
      hidden: 'Surprises préparées en secret par les témoins',
      moments: [
        { time: '16:00', title: 'Cérémonie laïque sous l’arche' },
        { time: '17:30', title: 'Cocktail sunset' },
        { time: '20:00', title: 'Banquet gastronomique' },
      ],
    };
  })();

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-[28px] bg-white p-6 sm:p-7 text-[#0B0C12] shadow-2xl border border-black/10 flex flex-col space-y-5 text-left">
        
        {/* EN-TÊTE : PHOTO + NOM */}
        <div className="flex items-center justify-between border-b border-black/6 pb-4">
          <div className="flex items-center gap-3.5">
            <img
              src={identity.avatar}
              alt={identity.canonicalName}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-black/5"
            />
            <div>
              <h3 className="text-[18px] font-bold text-black">{identity.canonicalName}</h3>
              <div className="text-[12px] text-black/60 font-medium">
                {roleInProject.role}
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

        {/* CE QU'IL VOIT / CE QUI LUI EST MASQUÉ (CONFIDENTIALITÉ NATURELLE) */}
        <div className="space-y-2.5">
          <div className="rounded-[16px] bg-[#FAFAFC] border border-black/6 p-3.5 space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <Eye size={13} className="text-emerald-600" />
              <span>Ce qu’il voit</span>
            </div>
            <p className="text-[12.5px] text-black/80 leading-relaxed">
              {roleInProject.visible}
            </p>
          </div>

          <div className="rounded-[16px] bg-[#FAFAFC] border border-black/6 p-3.5 space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-black/50 flex items-center gap-1.5">
              <Lock size={13} className="text-black/40" />
              <span>Ce qui lui est masqué</span>
            </div>
            <p className="text-[12.5px] text-black/70 leading-relaxed">
              {roleInProject.hidden}
            </p>
          </div>
        </div>

        {/* MOMENTS CONCERNÉS */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-black/40 flex items-center gap-1.5">
            <Clock size={12} />
            <span>Moments concernés dans ce projet</span>
          </div>
          <div className="space-y-1.5">
            {roleInProject.moments.map((m, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-[12px] bg-white border border-black/8 px-3 py-2 text-[12px]"
              >
                <span className="font-mono font-bold text-black">{m.time}</span>
                <span className="text-black/80 font-medium">{m.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ACTION DISPONIBLE : COMPRENDRE / TRANSMETTRE */}
        <div className="pt-2 flex items-center justify-between border-t border-black/6">
          <span className="text-[11.5px] text-black/50">
            Une modification ? AIME prépare le message utile.
          </span>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenTransmission?.(personId);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black text-white text-[11.5px] font-bold hover:bg-neutral-800 transition shadow-sm"
          >
            <Sparkles size={12} className="text-fuchsia-400" />
            <span>Comprendre &amp; Transmettre</span>
          </button>
        </div>

      </div>
    </div>
  );
}
