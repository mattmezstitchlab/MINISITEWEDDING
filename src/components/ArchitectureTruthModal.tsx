import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Database,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  HardDrive,
  Network,
  Lock,
  Search,
  ExternalLink,
  Server,
  CloudOff,
  Sparkles,
  Layers,
  Bot,
} from 'lucide-react';
import AimeUniversalGraphShowcase from './AimeUniversalGraphShowcase';

export default function ArchitectureTruthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<'matrix' | 'reality' | 'agent' | 'data' | 'graph' | 'persistence'>('persistence');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 sm:p-6 backdrop-blur-md">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-[28px] bg-white text-[#0B0C12] shadow-2xl overflow-hidden border border-black/10">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-black/8 px-6 py-4 bg-[#FBFBFD]">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
              <Database size={15} />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-black flex items-center gap-2">
                <span>AIME · Diagnostic de Réalité Produit</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                  PASSE 7 AUDITÉ
                </span>
              </h2>
              <div className="text-[12px] text-black/50">
                Vérité Produit : ce qui est réellement fonctionnel vs démonstration de vision.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-black hover:bg-black hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* ONGLETS DU DIAGNOSTIC */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-[#FAFAFC] border-b border-black/6 text-[12px] overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setTab('persistence')}
            className={`px-3 py-1 rounded-full font-semibold transition shrink-0 ${
              tab === 'persistence' ? 'bg-black text-white' : 'bg-white border border-black/10 text-black/60'
            }`}
          >
            Persistance &amp; Sécurité (Passe 12)
          </button>
          <button
            type="button"
            onClick={() => setTab('agent')}
            className={`px-3 py-1 rounded-full font-semibold transition shrink-0 ${
              tab === 'agent' ? 'bg-black text-white' : 'bg-white border border-black/10 text-black/60'
            }`}
          >
            Agent Contextuel (Passe 9)
          </button>
          <button
            type="button"
            onClick={() => setTab('graph')}
            className={`px-3 py-1 rounded-full font-semibold transition shrink-0 ${
              tab === 'graph' ? 'bg-black text-white' : 'bg-white border border-black/10 text-black/60'
            }`}
          >
            Graphe &amp; Synchronisation
          </button>
          <button
            type="button"
            onClick={() => setTab('reality')}
            className={`px-3 py-1 rounded-full font-semibold transition shrink-0 ${
              tab === 'reality' ? 'bg-black text-white' : 'bg-white border border-black/10 text-black/60'
            }`}
          >
            4 Niveaux de Réalité
          </button>
          <button
            type="button"
            onClick={() => setTab('matrix')}
            className={`px-3 py-1 rounded-full font-semibold transition shrink-0 ${
              tab === 'matrix' ? 'bg-black text-white' : 'bg-white border border-black/10 text-black/60'
            }`}
          >
            Matrice des 5 Univers
          </button>
          <button
            type="button"
            onClick={() => setTab('data')}
            className={`px-3 py-1 rounded-full font-semibold transition shrink-0 ${
              tab === 'data' ? 'bg-black text-white' : 'bg-white border border-black/10 text-black/60'
            }`}
          >
            Audit des Données
          </button>
        </div>

        {/* CONTENU SELON ONGLET */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar text-left">
          
          {tab === 'persistence' && (
            <div className="space-y-4">
              <div className="p-4 rounded-[20px] bg-slate-900 text-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-[14px]">
                    <HardDrive size={18} className="text-emerald-400" />
                    <span>Statut de la Persistance Canonique (Passe 12)</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    MODE AUTONOME / LOCAL FALLBACK
                  </span>
                </div>
                <p className="text-[12.5px] leading-relaxed text-white/80">
                  Le Kernel relationnel est la source unique de vérité. En l'absence de credentials distants actifs dans ce bac à sable, l'adaptateur opère en <strong>Local Fallback immuable</strong> : aucune donnée locale n'est faussement déclarée comme synchronisée sur un cloud distant.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12px]">
                <div className="p-3.5 rounded-[18px] bg-emerald-50 border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-800">REAL</span>
                  <div className="font-bold text-emerald-950">Kernel &amp; Logique RLS</div>
                  <div className="text-[11.5px] text-emerald-900/80">
                    Identités canoniques (Sarah, Lucas, Matt Mez), jonctions contextuelles, isolation des secrets témoins, et audit log append-only.
                  </div>
                </div>

                <div className="p-3.5 rounded-[18px] bg-blue-50 border border-blue-200 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-blue-800">SIMULATED / PREPARED</span>
                  <div className="font-bold text-blue-950">Schéma SQL &amp; Adaptateur</div>
                  <div className="text-[11.5px] text-blue-900/80">
                    Schéma <code>supabase/aime_kernel_schema.sql</code> (6 tables) et <code>AimePersistenceAdapter</code> prêts à recevoir les variables d'environnement Supabase.
                  </div>
                </div>

                <div className="p-3.5 rounded-[18px] bg-neutral-100 border border-neutral-300 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-neutral-600">CONCEPTUAL</span>
                  <div className="font-bold text-neutral-900">Synchronisation Realtime Cloud</div>
                  <div className="text-[11.5px] text-neutral-700">
                    Websockets PostgreSQL CDC multi-appareils distants (en attente du déploiement Supabase distant).
                  </div>
                </div>
              </div>

              <div className="rounded-[18px] bg-[#FAFAFC] border border-black/8 p-4 space-y-2">
                <div className="text-[11.5px] font-mono font-bold text-black uppercase">
                  Mapping des 6 Tables Distantes Scellées :
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono text-black/70">
                  <div className="p-2 bg-white rounded-md border border-black/5">aime_identities</div>
                  <div className="p-2 bg-white rounded-md border border-black/5">aime_world_projects</div>
                  <div className="p-2 bg-white rounded-md border border-black/5">aime_contextual_relations</div>
                  <div className="p-2 bg-white rounded-md border border-black/5">aime_timeline_nodes</div>
                  <div className="p-2 bg-white rounded-md border border-black/5">aime_proposals</div>
                  <div className="p-2 bg-white rounded-md border border-black/5">aime_audit_log</div>
                </div>
              </div>
            </div>
          )}

          {tab === 'graph' && (
            <div className="space-y-4">
              <AimeUniversalGraphShowcase />
            </div>
          )}

          {tab === 'agent' && (
            <div className="space-y-4">
              <div className="p-4 rounded-[20px] bg-fuchsia-50 border border-fuchsia-200 text-fuchsia-950 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-[14px]">
                  <Bot size={18} className="text-fuchsia-700" />
                  <span>L’Agent Contextuel AIME : Ce qui est Réel vs Démontré</span>
                </div>
                <p className="text-[12.5px] leading-relaxed">
                  « <strong>L’Agent Contextuel AIME n’agit pas à la place de l’humain.</strong> Il détecte ce qui mérite son attention, reconstruit le contexte nécessaire et propose l’action ou la transmission la plus pertinente, au moment où elle devient utile. »
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
                <div className="p-4 rounded-[18px] bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-800">REAL (Calculé par le Code)</span>
                  <div className="font-bold text-emerald-950">Détection d'Impact Proactive</div>
                  <div className="text-[11.5px] text-emerald-900/80">
                    Scan de la Timeline, identification du destinataire selon sa relation contextuelle, calcul du niveau d'impact (AUCUN, FAIBLE, IMPORTANT, CRITIQUE), décision automatique d'IGNORER pour éviter le spam, et blocage immunitaire absolu des secrets.
                  </div>
                </div>

                <div className="p-4 rounded-[18px] bg-blue-50/70 border border-blue-200 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-blue-800">UX DEMONSTRATION (Local)</span>
                  <div className="font-bold text-blue-950">Proposition de Transmission (Cerise)</div>
                  <div className="text-[11.5px] text-blue-900/80">
                    Formulation pré-rédigée et adaptée au destinataire, bouton d'arbitrage [Transmettre / Modifier / Ignorer] sans boîte de réception encombrante.
                  </div>
                </div>

                <div className="p-4 rounded-[18px] bg-amber-50/70 border border-amber-200 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-amber-800">INFRASTRUCTURE (Non Déployé)</span>
                  <div className="font-bold text-amber-950">Dispatch Réseau Externe</div>
                  <div className="text-[11.5px] text-amber-900/80">
                    Envoi réel de SMS Flash ou d'emails transactionnels (volontairement désactivé pour ne pas spammer de vrais contacts).
                  </div>
                </div>

                <div className="p-4 rounded-[18px] bg-neutral-100 border border-neutral-300 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-neutral-600">CONCEPT (Vision Future)</span>
                  <div className="font-bold text-neutral-900">Transmission Automatique Autonome</div>
                  <div className="text-[11.5px] text-neutral-700">
                    Transmission sans validation humaine pour les événements mineurs d'extrême urgence (ex: alerte pluie à H-15 min).
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'reality' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-[20px] bg-emerald-50 border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 tracking-wider">
                    1. PRODUCT REALITY (RÉELLEMENT FONCTIONNEL)
                  </span>
                  <div className="text-[13px] font-bold text-emerald-950">Moteur Relationnel Local Scellé</div>
                  <p className="text-[11.5px] text-emerald-900/80 leading-relaxed">
                    Identités uniques canoniques, WorldProjects indépendants, ContextualRelations (rôles attachés aux relations), Timeline vivante, révocations non destructives, arbitrage de propositions et persistance locale (survit au F5).
                  </p>
                </div>

                <div className="p-4 rounded-[20px] bg-blue-50 border border-blue-200 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-blue-800 tracking-wider">
                    2. UX DEMONSTRATION (DÉMONSTRATION DE VISION)
                  </span>
                  <div className="text-[13px] font-bold text-blue-950">L'Expérience Multi-Mondes</div>
                  <p className="text-[11.5px] text-blue-900/80 leading-relaxed">
                    Scénarios Voyage (Kyoto), Profession (Tournée), Art (Exposition) et Famille (Cousinade) démontrant le voyage des personnes entre univers. Les flux métier profonds (gestion des bagages, billetterie) ne sont pas implémentés.
                  </p>
                </div>

                <div className="p-4 rounded-[20px] bg-amber-50 border border-amber-200 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-amber-800 tracking-wider">
                    3. INFRASTRUCTURE (EN ATTENTE DE DÉPLOIEMENT)
                  </span>
                  <div className="text-[13px] font-bold text-amber-950">PostgreSQL / Supabase Distant</div>
                  <p className="text-[11.5px] text-amber-900/80 leading-relaxed">
                    Schéma SQL et politiques RLS formellement écrits dans <code>supabase/aime_kernel_schema.sql</code>, prêts pour le déploiement mais non connectés en réseau distant (mode autonome actif).
                  </p>
                </div>

                <div className="p-4 rounded-[20px] bg-neutral-100 border border-neutral-300 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-neutral-600 tracking-wider">
                    4. CONCEPT (EXTENSIONS FUTURES)
                  </span>
                  <div className="text-[13px] font-bold text-neutral-900">Connecteurs API &amp; Protocoles Matériels</div>
                  <p className="text-[11.5px] text-neutral-700 leading-relaxed">
                    Cartes déclaratives Spotify, Stripe Direct Pay, régie lumière DMX 512 et calcul de cascade électrique. Présents pour l'ergonomie, non branchés à des flux réels.
                  </p>
                </div>
              </div>

              {/* PHRASE SYNTHÈSE DU PRODUIT RÉEL */}
              <div className="rounded-[20px] bg-[#0A0B10] text-white p-5 space-y-2">
                <div className="text-[10px] font-mono uppercase text-fuchsia-400 font-bold tracking-wider">
                  Le Vrai Centre d’AIME
                </div>
                <p className="text-[14.5px] leading-relaxed text-white/95">
                  « <strong>AIME permet à des personnes d’orchestrer des moments de vie (projets) grâce à des relations contextuelles sécurisées et une Timeline vivante sans jamais dupliquer leur identité.</strong> »
                </p>
              </div>
            </div>
          )}

          {tab === 'matrix' && (
            <div className="space-y-3">
              <div className="text-[12px] text-black/60">
                Audit strict des 15 capacités à travers les 5 Univers. Aucune carte n'est comptée comme réelle si le flux sous-jacent n'existe pas.
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] font-mono border border-black/10 rounded-[14px]">
                  <thead className="bg-[#FAFAFC] border-b border-black/10 text-black/60">
                    <tr>
                      <th className="p-2.5">Capacité</th>
                      <th className="p-2.5">Mariage</th>
                      <th className="p-2.5">Voyage</th>
                      <th className="p-2.5">Profession</th>
                      <th className="p-2.5">Art</th>
                      <th className="p-2.5">Famille</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 text-black/80">
                    <tr>
                      <td className="p-2.5 font-bold text-black">Identity</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-black">Relation</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-black">WorldProject</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-black">Timeline</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-black">Documents</td>
                      <td className="p-2.5 text-blue-700">SIMULATED</td>
                      <td className="p-2.5 text-blue-700">SIMULATED</td>
                      <td className="p-2.5 text-blue-700">SIMULATED</td>
                      <td className="p-2.5 text-neutral-400">N/A</td>
                      <td className="p-2.5 text-neutral-400">N/A</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-black">Médias</td>
                      <td className="p-2.5 text-blue-700">CONNECTED</td>
                      <td className="p-2.5 text-blue-700">SIMULATED</td>
                      <td className="p-2.5 text-blue-700">SIMULATED</td>
                      <td className="p-2.5 text-blue-700">SIMULATED</td>
                      <td className="p-2.5 text-blue-700">SIMULATED</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-black">Messages</td>
                      <td className="p-2.5 text-neutral-400">CONCEPTUAL</td>
                      <td className="p-2.5 text-neutral-400">CONCEPTUAL</td>
                      <td className="p-2.5 text-neutral-400">CONCEPTUAL</td>
                      <td className="p-2.5 text-neutral-400">CONCEPTUAL</td>
                      <td className="p-2.5 text-neutral-400">CONCEPTUAL</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-black">Budget</td>
                      <td className="p-2.5 text-blue-700">SIMULATED</td>
                      <td className="p-2.5 text-blue-700">SIMULATED</td>
                      <td className="p-2.5 text-blue-700">SIMULATED</td>
                      <td className="p-2.5 text-neutral-400">N/A</td>
                      <td className="p-2.5 text-neutral-400">N/A</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-black">Invitation</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                      <td className="p-2.5 text-blue-700">SIMULATED</td>
                      <td className="p-2.5 text-neutral-400">N/A</td>
                      <td className="p-2.5 text-blue-700">SIMULATED</td>
                      <td className="p-2.5 text-blue-700">SIMULATED</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-black">RSVP / Réponse</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                      <td className="p-2.5 text-neutral-400">N/A</td>
                      <td className="p-2.5 text-neutral-400">N/A</td>
                      <td className="p-2.5 text-neutral-400">N/A</td>
                      <td className="p-2.5 text-neutral-400">N/A</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-black">Permissions</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-black">Propositions</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                      <td className="p-2.5 text-neutral-400">N/A</td>
                      <td className="p-2.5 text-blue-700">SIMULATED</td>
                      <td className="p-2.5 text-neutral-400">N/A</td>
                      <td className="p-2.5 text-neutral-400">N/A</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-black">Recherche</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                      <td className="p-2.5 text-emerald-700 font-bold">REAL</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-black">Notifications</td>
                      <td className="p-2.5 text-blue-700">SIMULATED</td>
                      <td className="p-2.5 text-neutral-400">N/A</td>
                      <td className="p-2.5 text-neutral-400">N/A</td>
                      <td className="p-2.5 text-neutral-400">N/A</td>
                      <td className="p-2.5 text-neutral-400">N/A</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-black">Connecteurs</td>
                      <td className="p-2.5 text-neutral-400">CONCEPTUAL</td>
                      <td className="p-2.5 text-neutral-400">N/A</td>
                      <td className="p-2.5 text-neutral-400">N/A</td>
                      <td className="p-2.5 text-neutral-400">N/A</td>
                      <td className="p-2.5 text-neutral-400">N/A</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'data' && (
            <div className="space-y-3 text-[12px]">
              <div className="text-black/60">
                Classification stricte de chaque entité de données présente dans le prototype :
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
                <div className="p-3 rounded-[14px] bg-[#FAFAFC] border border-black/6">
                  <div className="font-bold text-black">Sarah Alvès (usr-sarah)</div>
                  <div className="text-[10px] text-emerald-700 font-bold">FIXTURE CANONIQUE KERNEL</div>
                  <div className="text-black/60 text-[11px] mt-0.5">Propriétaire du Mariage et Curatrice.</div>
                </div>

                <div className="p-3 rounded-[14px] bg-[#FAFAFC] border border-black/6">
                  <div className="font-bold text-black">Lucas Bernard (usr-lucas)</div>
                  <div className="text-[10px] text-emerald-700 font-bold">FIXTURE CANONIQUE KERNEL</div>
                  <div className="text-black/60 text-[11px] mt-0.5">Témoin (Mariage) et Co-voyageur (Japon).</div>
                </div>

                <div className="p-3 rounded-[14px] bg-[#FAFAFC] border border-black/6">
                  <div className="font-bold text-black">Matt Mez (usr-mattmez)</div>
                  <div className="text-[10px] text-emerald-700 font-bold">FIXTURE CANONIQUE KERNEL</div>
                  <div className="text-black/60 text-[11px] mt-0.5">Prestataire Saxophoniste Live &amp; Acoustique.</div>
                </div>

                <div className="p-3 rounded-[14px] bg-[#FAFAFC] border border-black/6">
                  <div className="font-bold text-black">Camille Roussel (usr-camille)</div>
                  <div className="text-[10px] text-blue-700 font-bold">DONNÉE MUTÉE PAR RSVP</div>
                  <div className="text-black/60 text-[11px] mt-0.5">Générée dynamiquement par le formulaire RSVP.</div>
                </div>

                <div className="p-3 rounded-[14px] bg-[#FAFAFC] border border-black/6">
                  <div className="font-bold text-black">Château des Tilleuls, Valbonne</div>
                  <div className="text-[10px] text-emerald-700 font-bold">LIEU RÉEL PROJETÉ</div>
                  <div className="text-black/60 text-[11px] mt-0.5">Lieu canonique du WorldProject Mariage.</div>
                </div>

                <div className="p-3 rounded-[14px] bg-[#FAFAFC] border border-black/6">
                  <div className="font-bold text-black">Ryokan Gion &amp; Mont Fuji, Kyoto</div>
                  <div className="text-[10px] text-emerald-700 font-bold">LIEU RÉEL PROJETÉ</div>
                  <div className="text-black/60 text-[11px] mt-0.5">Lieu canonique du WorldProject Voyage.</div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="border-t border-black/8 px-6 py-3.5 bg-[#FBFBFD] flex items-center justify-between text-[11px] font-mono text-black/50">
          <span>AIME Universal Reality Audit v7.0</span>
          <span>Source of Truth avant Wow · Transparence absolue</span>
        </div>

      </div>
    </div>
  );
}
