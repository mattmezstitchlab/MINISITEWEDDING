import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Network,
  Share2,
  Lock,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ArrowLeftRight,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  MapPin,
  Calendar,
  Globe,
  Briefcase,
  Plane,
  Heart,
  Users,
  AlertTriangle,
  RefreshCw,
  Search,
  Sliders,
  Eye,
  Info,
  UserCheck,
  UserX,
  Database,
  History,
} from 'lucide-react';
import type {
  UniversalIdentity,
  WorldProject,
  ContextualRelation,
  TimelineGraphNode,
  ProposalItem,
  CascadeImpact,
  UniverseCategory,
} from '../lib/aimeArchitectureCore';
import {
  AimeKernelService,
  type AuditLogEntry,
} from '../lib/aimeKernelService';
import { MOCK_CASCADE_IMPACTS } from '../lib/aimeArchitectureMock';

export default function AimeUniversalGraphShowcase() {
  // Store synchronisé avec le Kernel persistant
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Projets actifs lus directement depuis le Kernel persistant
  const mariageProject = useMemo(() => {
    return AimeKernelService.getProject('prj-mariage-sarah-2026')!;
  }, [refreshTrigger]);

  const voyageProject = useMemo(() => {
    return AimeKernelService.getProject('prj-voyage-kyoto-2027')!;
  }, [refreshTrigger]);

  // Univers actuellement visualisé dans le cockpit
  const [currentUniverseTab, setCurrentUniverseTab] = useState<UniverseCategory>('MARIAGE');

  // Inspecteur de relation ouvert (clic sur une relation)
  const [selectedRelation, setSelectedRelation] = useState<ContextualRelation | null>(null);

  // Démonstration Cascade d'impacts (Changement de lieu)
  const [isCascadeSimulated, setIsCascadeSimulated] = useState<boolean>(false);
  const [cascadeImpacts, setCascadeImpacts] = useState<CascadeImpact[]>([]);

  // Recherche universelle relationnelle
  const [universalSearchQuery, setUniversalSearchQuery] = useState<string>('');

  // Vue du journal d'audit immuable
  const [showAuditLog, setShowAuditLog] = useState<boolean>(false);

  // Message de confirmation / feedback d'audit
  const [lastActionFeedback, setLastActionFeedback] = useState<{ text: string; type: 'success' | 'alert' } | null>(null);

  // Projet actif selon l'univers
  const activeProject = currentUniverseTab === 'MARIAGE' ? mariageProject : voyageProject;

  // Matt Mez dans le projet mariage
  const mattRelation = useMemo(() => {
    return mariageProject.relations.find((r) => r.identityId === 'usr-mattmez');
  }, [mariageProject]);

  const isMattRevoked = mattRelation?.status === 'REVOKE';

  // 1. GESTION DES PROPOSITIONS (Arbitrage au lieu de modification directe)
  const handleAcceptProposal = (propId: string) => {
    const res = AimeKernelService.acceptProposal(activeProject.id, propId, 'usr-sarah');
    if (res.success) {
      setLastActionFeedback({
        text: 'Proposition validée et scellée dans le Kernel persistant (survit au reload F5).',
        type: 'success',
      });
    } else {
      setLastActionFeedback({
        text: `Conflit détecté : ${res.conflict}`,
        type: 'alert',
      });
    }
    setRefreshTrigger((v) => v + 1);
  };

  const handleRefuseProposal = (propId: string) => {
    AimeKernelService.rejectProposal(activeProject.id, propId, 'usr-sarah');
    setLastActionFeedback({
      text: 'Proposition refusée : l’horaire initial est strictement préservé.',
      type: 'alert',
    });
    setRefreshTrigger((v) => v + 1);
  };

  // 2. DÉCLENCHEMENT DE LA CASCADE D'IMPACTS CONTRÔLÉE (Changement de lieu)
  const triggerLocationChangeCascade = () => {
    setIsCascadeSimulated(true);
    setCascadeImpacts(MOCK_CASCADE_IMPACTS);
  };

  // 3. RÉVOCATION DE RELATION (Test critique de non-destruction d'identité)
  const handleToggleRevokeMatt = () => {
    if (!isMattRevoked) {
      AimeKernelService.revokeRelation(mariageProject.id, 'usr-mattmez', 'usr-sarah');
      setLastActionFeedback({
        text: 'Matt Mez révoqué du mariage. Son identité canonique & autres projets restent 100% intacts.',
        type: 'alert',
      });
    } else {
      AimeKernelService.restoreRelation(mariageProject.id, 'usr-mattmez', 'usr-sarah');
      setLastActionFeedback({
        text: 'Relation restaurée sans recréer d’identité (Zéro duplication).',
        type: 'success',
      });
    }
    setRefreshTrigger((v) => v + 1);
  };

  // 4. TEST DU SYSTÈME IMMUNITAIRE SERVEUR DIRECT
  const handleTestSecurityServer = (resource: 'FINANCES' | 'SECRET_CHANNEL') => {
    const checkMatt = AimeKernelService.evaluateAccess(mariageProject.id, 'usr-mattmez', resource);
    const checkSarah = AimeKernelService.evaluateAccess(mariageProject.id, 'usr-sarah', resource);

    alert(
      `--- CONTRÔLE D'ACCÈS DU KERNEL SERVEUR ---\n\n` +
      `Cible : ${resource}\n\n` +
      `● Matt Mez (Prestataire) : ${checkMatt.allowed ? 'AUTORISÉ' : 'REFUSÉ'}\n` +
      `  ↳ Règle : ${checkMatt.reason}\n\n` +
      `● Sarah (Mariée) : ${checkSarah.allowed ? 'AUTORISÉ' : 'REFUSÉ'}\n` +
      `  ↳ Règle : ${checkSarah.reason}`
    );
  };

  // 5. RECHERCHE UNIVERSELLE RELATIONNELLE
  const searchResults = useMemo(() => {
    const q = universalSearchQuery.trim().toLowerCase();
    if (!q) return [];

    const results: {
      type: string;
      label: string;
      subtext: string;
      universe: string;
      relationSummary: string;
    }[] = [];

    const allIdentities = AimeKernelService.getAllIdentities();
    const allProjects = AimeKernelService.getAllProjects();

    // Recherche dans les identités canoniques
    allIdentities.forEach((usr) => {
      if (usr.canonicalName.toLowerCase().includes(q) || usr.bio.toLowerCase().includes(q)) {
        results.push({
          type: 'IDENTITÉ',
          label: usr.canonicalName,
          subtext: `${usr.homeCity} · Actif dans ${usr.activeUniverses.join(', ')}`,
          universe: usr.activeUniverses[0],
          relationSummary: `Relié à ${usr.activeUniverses.length} Univers sans duplication.`,
        });
      }
    });

    // Recherche dans les projets
    allProjects.forEach((prj) => {
      if (prj.title.toLowerCase().includes(q) || prj.locationName.toLowerCase().includes(q) || prj.country.toLowerCase().includes(q)) {
        results.push({
          type: 'WORLDPROJECT',
          label: prj.title,
          subtext: `${prj.locationName} (${prj.country}) · Date : ${prj.date}`,
          universe: prj.universe,
          relationSummary: `${prj.relations.length} relations actives dans le graphe.`,
        });
      }
    });

    // Recherche dans les nœuds de timeline
    allProjects.flatMap((p) => p.timelineNodes).forEach((node) => {
      if (node.title.toLowerCase().includes(q) || node.locationName.toLowerCase().includes(q)) {
        results.push({
          type: 'TIMELINE',
          label: `${node.time} — ${node.title}`,
          subtext: `Lieu : ${node.locationName} · Visibilité : ${node.accessLevel}`,
          universe: node.projectId.includes('mariage') ? 'MARIAGE' : 'VOYAGE',
          relationSummary: node.assignedIdentityName ? `Assigné à : ${node.assignedIdentityName}` : 'Créneau partagé',
        });
      }
    });

    return results;
  }, [universalSearchQuery, refreshTrigger]);

  const auditLogs = useMemo(() => AimeKernelService.getAuditLogs(), [refreshTrigger]);

  return (
    <div className="space-y-10 text-left">
      
      {/* 1. HEADER ÉDITORIAL AIME KERNEL */}
      <div className="rounded-[28px] bg-[#0A0B10] text-white p-6 sm:p-9 shadow-2xl relative overflow-hidden border border-white/10">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-mono text-emerald-400 font-bold border border-emerald-500/30">
              <Database size={12} />
              <span>AIME Kernel Persistant v4 (PostgreSQL / RLS Ready)</span>
            </span>

            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10.5px] font-mono text-blue-300 border border-blue-500/30">
              <CheckCircle2 size={11} />
              <span>Persistance Réelle (Survit au Reload F5)</span>
            </span>
          </div>

          <h2 className="vp-title text-[28px] sm:text-[38px] text-white leading-tight">
            Une Identité. Plusieurs Univers.<br />
            <span className="text-white/40">Des Relations Contextuelles &amp; Zéro Duplication.</span>
          </h2>

          <p className="text-[14.5px] sm:text-[15.5px] text-white/70 leading-relaxed max-w-3xl font-normal">
            Le mariage n'est qu'un contexte parmi d'autres. Les identités canoniques sont uniques et persistées. Les mutations sont enregistrées dans un journal d'audit immuable. Testez un rechargement complet (`F5`) : <strong>l’état relationnel est scellé.</strong>
          </p>

          {/* BASCULE RAPIDE DES UNIVERS + BOUTON JOURNAL AUDIT */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase text-white/40 mr-1">Contexte Univers :</span>
              <button
                type="button"
                onClick={() => setCurrentUniverseTab('MARIAGE')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-semibold transition ${
                  currentUniverseTab === 'MARIAGE'
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Heart size={12} className="text-rose-500" />
                <span>Mariage Sarah (Château Tilleuls)</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentUniverseTab('VOYAGE')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-semibold transition ${
                  currentUniverseTab === 'VOYAGE'
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Plane size={12} className="text-blue-400" />
                <span>Voyage Kyoto 2027</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAuditLog(!showAuditLog)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono transition border border-white/10"
              >
                <History size={13} className="text-amber-400" />
                <span>Journal d’Audit ({auditLogs.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Réinitialiser le Kernel AIME à ses données canoniques initiales ?')) {
                    AimeKernelService.resetToDefault();
                    setRefreshTrigger((v) => v + 1);
                  }
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-mono transition border border-rose-500/30"
                title="Reset Store Persistant"
              >
                <RefreshCw size={11} />
                <span>Reset Store</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FEEDBACK BANNER */}
      {lastActionFeedback && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3.5 rounded-[18px] text-[12px] flex items-center justify-between border ${
            lastActionFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
              : 'bg-amber-50 text-amber-950 border-amber-300'
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 size={16} className={lastActionFeedback.type === 'success' ? 'text-emerald-600' : 'text-amber-600'} />
            <span>{lastActionFeedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setLastActionFeedback(null)}
            className="text-[11px] font-bold underline ml-4"
          >
            Fermer
          </button>
        </motion.div>
      )}

      {/* PANNEAU D'AUDIT IMMUABLE (QUAND OUVERT) */}
      <AnimatePresence>
        {showAuditLog && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-[24px] bg-[#111218] text-white p-5 border border-white/10 space-y-3 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <History size={16} className="text-amber-400" />
                <h4 className="text-[14px] font-bold">Journal d’Audit Immuable du Kernel AIME</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                  REAL &amp; PERSISTANT
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAuditLog(false)}
                className="text-[11px] font-mono text-white/50 hover:text-white"
              >
                Masquer
              </button>
            </div>

            <div className="max-h-[220px] overflow-y-auto space-y-1.5 custom-scrollbar font-mono text-[11px]">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-2 rounded bg-white/5 border border-white/5 flex items-start justify-between gap-3">
                  <div>
                    <span className="text-amber-300 font-bold">[{log.action}]</span>{' '}
                    <span className="text-white/60">{log.detail}</span>
                  </div>
                  <div className="text-white/40 text-[9.5px] shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()} · {log.actorName}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. BARRE DE RECHERCHE UNIVERSELLE RELATIONNELLE */}
      <div className="rounded-[22px] bg-[#F7F7F8] border border-black/8 p-4 sm:p-5">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
          <input
            type="text"
            value={universalSearchQuery}
            onChange={(e) => setUniversalSearchQuery(e.target.value)}
            placeholder="Recherche Universelle AIME (ex: Sarah, Matt Mez, Kyoto, Cocktail, Lucas, Tilleuls)..."
            className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-11 pr-5 text-[13px] outline-none focus:border-black/30 shadow-sm transition"
          />
        </div>

        {/* RÉSULTATS DE RECHERCHE RELATIONNELLE */}
        {searchResults.length > 0 && (
          <div className="mt-3 pt-3 border-t border-black/6 space-y-2">
            <div className="text-[10.5px] font-mono uppercase text-black/40 font-bold">
              {searchResults.length} connexions trouvées dans le graphe :
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {searchResults.map((res, i) => (
                <div key={i} className="rounded-[14px] bg-white p-3 border border-black/6 shadow-sm text-[12px]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black">{res.label}</span>
                    <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-black/5 text-black/70">
                      {res.type}
                    </span>
                  </div>
                  <div className="text-[11px] text-black/60 mt-0.5">{res.subtext}</div>
                  <div className="text-[10.5px] text-emerald-700 font-mono mt-1">
                    ↳ {res.relationSummary}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. DÉMONSTRATION RELATIONNELLE : LE CONTEXTE ACTIF ({currentUniverseTab}) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLONNE GAUCHE (7 COL) : WORLDPROJECT & SA TIMELINE COMME SYSTÈME NERVEUX */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* CARTE WORLDPROJECT */}
          <div className="rounded-[26px] bg-white border border-black/8 overflow-hidden shadow-sm">
            <div className="relative h-[220px] w-full">
              <img
                src={activeProject.coverImage}
                alt={activeProject.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="rounded-full bg-white/20 backdrop-blur-md px-2.5 py-1 text-[9.5px] font-mono uppercase tracking-wider font-bold">
                  Univers {activeProject.universe} · Propriétaire : Sarah Alvès
                </span>
                <h3 className="vp-title text-[22px] sm:text-[26px] font-bold text-white mt-1">
                  {activeProject.title}
                </h3>
                <div className="text-[12px] text-white/80 font-mono mt-0.5 flex items-center gap-2">
                  <MapPin size={12} />
                  <span>{activeProject.locationName} ({activeProject.country})</span>
                  <span>·</span>
                  <Calendar size={12} />
                  <span>{activeProject.date}</span>
                </div>
              </div>
            </div>

            {/* CAS D'USAGE VOYAGE : EXPLICATION DE LA RÉUTILISATION */}
            {currentUniverseTab === 'VOYAGE' && (
              <div className="p-4 bg-blue-50/60 border-t border-blue-100 text-[12px] text-blue-950 flex items-start gap-2.5">
                <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Preuve d'universalité :</strong> Lucas Bernard (témoin dans le mariage de Sarah) est ici réutilisé dans le <em>Voyage au Japon</em> comme <em>Co-voyageur &amp; Reporter Photo</em> avec accès au budget partagé. <strong>Zéro compte recréé, zéro donnée dupliquée.</strong>
                </div>
              </div>
            )}
          </div>

          {/* LA TIMELINE VIVANTE DU GRAPHE (CONVERGENCE DES DONNÉES) */}
          <div className="rounded-[26px] bg-white border border-black/8 p-5 sm:p-6 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-black/6 pb-2.5">
              <div>
                <h4 className="text-[15px] font-bold text-black flex items-center gap-2">
                  <Clock size={16} className="text-black/60" />
                  <span>Timeline du Système Nerveux</span>
                </h4>
                <div className="text-[11px] text-black/50 font-mono">
                  Lecture directe des relations et des permissions persistées
                </div>
              </div>

              {currentUniverseTab === 'MARIAGE' && (
                <button
                  type="button"
                  onClick={triggerLocationChangeCascade}
                  className="px-3 py-1 rounded-full bg-amber-500 text-white text-[11px] font-bold hover:bg-amber-600 shadow-sm transition"
                >
                  Simuler changement de lieu (Cascade)
                </button>
              )}
            </div>

            <div className="space-y-2.5 pt-1">
              {activeProject.timelineNodes.map((node) => (
                <div
                  key={node.id}
                  className={`rounded-[16px] p-3.5 border transition ${
                    node.secretToOwners
                      ? 'bg-purple-50/60 border-purple-200'
                      : node.assignedIdentityName?.includes('Matt Mez')
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : 'bg-[#FAFAFC] border-black/6'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11.5px] font-bold px-2 py-0.5 rounded-md bg-white border border-black/10 text-black">
                        {node.time}
                      </span>
                      <strong className="text-[13px] text-black">{node.title}</strong>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9.5px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        node.accessLevel === 'SECRET'
                          ? 'bg-purple-200 text-purple-900'
                          : node.accessLevel === 'PUBLIC'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-neutral-200 text-neutral-800'
                      }`}>
                        {node.accessLevel}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11.5px] text-black/60 border-t border-black/5 pt-2">
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />
                      <span>{node.locationName}</span>
                    </span>
                    <span className="font-mono text-black/80">
                      {node.assignedIdentityName ? (
                        <>Assigné à : <strong>{node.assignedIdentityName}</strong></>
                      ) : (
                        'Collectif / Tous'
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ARBITRAGE DES PROPOSITIONS (CYCLE : PROPOSÉ -> VALIDÉ / REFUSÉ) */}
          {activeProject.pendingProposals.length > 0 && (
            <div className="rounded-[24px] bg-[#FFFBEB] border border-amber-300 p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-[14px]">
                <AlertTriangle size={16} className="text-amber-600" />
                <span>Proposition d’Ajustement en Attente d’Arbitrage (Persistante)</span>
              </div>

              {activeProject.pendingProposals.map((prop) => (
                <div key={prop.id} className="rounded-[16px] bg-white p-4 border border-amber-200 space-y-2 text-[12px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={prop.authorAvatar} alt={prop.authorName} className="h-6 w-6 rounded-full object-cover" />
                      <strong className="text-black">{prop.authorName} propose :</strong>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      prop.status === 'VALIDE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : prop.status === 'REFUSE'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {prop.status}
                    </span>
                  </div>

                  <div className="text-[12px] text-black/80">
                    <div><strong>Champ cible :</strong> {prop.targetFieldLabel}</div>
                    <div className="line-through text-black/40">Valeur actuelle : {prop.oldValue}</div>
                    <div className="text-emerald-700 font-bold">Nouvelle valeur proposée : {prop.proposedValue}</div>
                    <div className="text-[11px] text-black/60 italic mt-1">« {prop.impactSummary} »</div>
                  </div>

                  {prop.status === 'PROPOSE' && (
                    <div className="flex items-center gap-2 pt-2 border-t border-black/5">
                      <button
                        type="button"
                        onClick={() => handleAcceptProposal(prop.id)}
                        className="flex-1 py-1.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition"
                      >
                        Accepter &amp; Synchroniser
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRefuseProposal(prop.id)}
                        className="flex-1 py-1.5 rounded-full bg-neutral-200 text-black/70 text-[11px] font-semibold hover:bg-neutral-300 transition"
                      >
                        Refuser
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>

        {/* COLONNE DROITE (5 COL) : LES RELATIONS CONTEXTUELLES & L'INSPECTEUR */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* LISTE DES RELATIONS DU PROJET */}
          <div className="rounded-[26px] bg-white border border-black/8 p-5 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between border-b border-black/6 pb-2.5">
              <div>
                <h4 className="text-[15px] font-bold text-black flex items-center gap-2">
                  <Share2 size={16} className="text-black/60" />
                  <span>Relations dans ce Projet ({activeProject.relations.length})</span>
                </h4>
                <div className="text-[11px] text-black/50 font-mono">
                  Cliquez sur une relation pour inspecter la propriété
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {activeProject.relations.map((rel) => {
                const isSelected = selectedRelation?.id === rel.id;
                return (
                  <div
                    key={rel.id}
                    onClick={() => setSelectedRelation(rel)}
                    className={`cursor-pointer rounded-[18px] p-3 border transition-all text-[12px] flex items-center justify-between ${
                      isSelected
                        ? 'border-black bg-neutral-100 shadow-sm'
                        : rel.status === 'REVOKE'
                        ? 'border-rose-200 bg-rose-50/50 opacity-60'
                        : 'border-black/6 bg-[#FAFAFC] hover:border-black/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={rel.identityAvatar}
                        alt={rel.identityName}
                        className="h-10 w-10 rounded-full object-cover ring-1 ring-black/10"
                      />
                      <div>
                        <div className="font-bold text-black flex items-center gap-1.5">
                          <span>{rel.identityName}</span>
                          {rel.status === 'REVOKE' && (
                            <span className="text-[9px] font-mono px-1.5 rounded bg-rose-200 text-rose-800">
                              Révoqué
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-black/60">{rel.contextualRole}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-black/40 block uppercase">
                        Catégorie
                      </span>
                      <span className="text-[11px] font-semibold text-black">
                        {rel.roleCategory}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TEST DE RÉVOCATION SANS SUPPRESSION DE L'IDENTITÉ CANONIQUE */}
            {currentUniverseTab === 'MARIAGE' && (
              <div className="pt-2 border-t border-black/6">
                <button
                  type="button"
                  onClick={handleToggleRevokeMatt}
                  className={`w-full py-2 rounded-full text-[11px] font-bold transition flex items-center justify-center gap-1.5 ${
                    isMattRevoked
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'border border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100'
                  }`}
                >
                  {isMattRevoked ? (
                    <>
                      <UserCheck size={13} />
                      <span>Restaurer la Relation avec Matt Mez (Persistant)</span>
                    </>
                  ) : (
                    <>
                      <UserX size={13} />
                      <span>Tester Révocation de Matt Mez (Zéro destruction identité)</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* L'INSPECTEUR DE RELATION DÉTAILLÉ (SOURCE DE VÉRITÉ & SYSTÈME IMMUNITAIRE) */}
          <div className="rounded-[26px] bg-[#FAFAFC] border border-black/8 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-black/6 pb-2.5">
              <span className="text-[12px] font-bold text-black flex items-center gap-1.5 font-mono uppercase">
                <ShieldCheck size={15} className="text-emerald-600" />
                <span>Inspecteur de Relation</span>
              </span>
              <span className="text-[10px] font-mono text-black/40">Propriété de la Donnée</span>
            </div>

            {selectedRelation ? (
              <div className="space-y-3.5 text-[12px]">
                <div className="flex items-center gap-3">
                  <img src={selectedRelation.identityAvatar} alt={selectedRelation.identityName} className="h-9 w-9 rounded-full object-cover" />
                  <div>
                    <strong className="text-black">{selectedRelation.identityName}</strong>
                    <div className="text-[11px] text-black/50 font-mono">
                      Rôle contextuel : {selectedRelation.contextualRole}
                    </div>
                  </div>
                </div>

                {/* CE QUI EST PARTAGÉ */}
                <div className="rounded-[14px] bg-white p-3 border border-black/6 space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    <span>Données Partagées sur ce Projet :</span>
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedRelation.sharedDataKeys.map((k, i) => (
                      <span key={i} className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10.5px] text-emerald-900">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CE QUI EST STRICTEMENT PROTÉGÉ / MASQUÉ */}
                <div className="rounded-[14px] bg-white p-3 border border-black/6 space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-rose-700 flex items-center gap-1">
                    <Lock size={12} />
                    <span>Données Masquées pour Confidentialité :</span>
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedRelation.restrictedDataKeys.map((k, i) => (
                      <span key={i} className="rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10.5px] text-rose-900">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>

                {/* BOUTON TEST DU SYSTÈME IMMUNITAIRE KERNEL */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleTestSecurityServer('FINANCES')}
                    className="py-1.5 px-2 rounded-full border border-black/10 bg-white text-[10.5px] font-semibold text-black hover:bg-neutral-100 transition"
                  >
                    Tester accès Finances
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTestSecurityServer('SECRET_CHANNEL')}
                    className="py-1.5 px-2 rounded-full border border-black/10 bg-white text-[10.5px] font-semibold text-black hover:bg-neutral-100 transition"
                  >
                    Tester accès Secret
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-black/40 text-[12px]">
                Sélectionnez une relation ci-dessus pour inspecter sa matrice de permissions et ses flux de données.
              </div>
            )}
          </div>

        </div>

      </div>

      {/* 4. MODALE / PANNEAU DE CASCADE D'IMPACTS LORS DU CHANGEMENT DE LIEU */}
      <AnimatePresence>
        {isCascadeSimulated && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="rounded-[26px] bg-[#FFFBEB] border-2 border-amber-400 p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-[16px]">
                <AlertTriangle size={20} className="text-amber-600" />
                <span>Simulation : Modification du Lieu du Mariage</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCascadeSimulated(false)}
                className="text-[12px] font-bold text-amber-900 hover:underline"
              >
                Fermer
              </button>
            </div>

            <p className="text-[13px] text-amber-900/80">
              Le système refuse d’écraser aveuglément les données : <strong>{cascadeImpacts.length} éléments en cascade sont identifiés</strong>. Chaque acteur concerné reçoit une proposition ciblée selon ses permissions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {cascadeImpacts.map((imp) => (
                <div key={imp.id} className="rounded-[16px] bg-white p-3.5 border border-amber-300 space-y-1.5 text-[12px] shadow-sm">
                  <div className="flex items-center justify-between">
                    <strong className="text-black">{imp.label}</strong>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      imp.impactLevel === 'CRITIQUE'
                        ? 'bg-rose-100 text-rose-800'
                        : imp.impactLevel === 'MAJEUR'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-neutral-100 text-neutral-800'
                    }`}>
                      {imp.impactLevel}
                    </span>
                  </div>
                  <div className="text-[11px] text-black/50">Cible : {imp.affectedIdentityName}</div>
                  <div className="text-[11.5px] text-black/80">{imp.reason}</div>
                  <div className="text-[10.5px] text-emerald-700 font-mono font-bold pt-1 border-t border-black/5">
                    ↳ {imp.proposedAction}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
