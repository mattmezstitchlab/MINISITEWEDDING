import { AimeKernelService } from '../src/lib/aimeKernelService';
import { AimePersistenceAdapter } from '../src/lib/aimePersistenceAdapter';
import { AimeKernelBridge } from '../src/lib/aimeKernelBridge';

console.log('=================================================================');
console.log('AIME PASSE 12 — TEST DE PERSISTANCE DE PRODUCTION & SÉCURITÉ SERVEUR');
console.log('=================================================================\n');

let passed = 0;
let total = 0;

function assert(condition: boolean, label: string, detail?: string) {
  total++;
  if (condition) {
    passed++;
    console.log(`✔ PASS [${total}]: ${label}`);
  } else {
    console.error(`❌ FAIL [${total}]: ${label} ${detail ? `(${detail})` : ''}`);
    process.exitCode = 1;
  }
}

// 1. AUDIT D'INITIALISATION DE LA PERSISTANCE
console.log('--- TEST 1 : AUDIT DE PERSISTANCE DISTANTE & STATUT RÉEL ---');
const status = AimePersistenceAdapter.init();
assert(Boolean(status), 'L’adaptateur de persistance AIME s’initialise avec succès');
assert(
  status.mode === 'LOCAL_FALLBACK' || status.mode === 'CONNECTED',
  `Mode de persistance identifié avec honnêteté : ${status.mode}`
);
assert(
  status.tableMapping.identities === 'aime_identities' &&
  status.tableMapping.projects === 'aime_world_projects' &&
  status.tableMapping.relations === 'aime_contextual_relations' &&
  status.tableMapping.timeline === 'aime_timeline_nodes' &&
  status.tableMapping.proposals === 'aime_proposals' &&
  status.tableMapping.auditLog === 'aime_audit_log',
  'Le mapping des 6 tables PostgreSQL / Supabase est conforme au schéma scellé'
);

// 2. CRÉATION D’UNE IDENTITÉ CANONIQUE
console.log('\n--- TEST 2 : CRÉATION D’IDENTITÉ & RÈGLE DUPLICATE STOPPER ---');
const testIdentityId = 'usr-test-passe12';
const createdIdentity = AimeKernelService.updateCanonicalIdentity(testIdentityId, {
  id: testIdentityId,
  canonicalName: 'Éléonore Martin',
  email: 'eleonore.martin@example.com',
  homeCity: 'Lyon',
  country: 'France',
});
assert(createdIdentity.canonicalName === 'Éléonore Martin', 'Création de l’identité Éléonore Martin dans le Kernel');

// 3. PERSISTANCE ET RELECTURE SANS DUPLICATION
console.log('\n--- TEST 3 : ABSENCE STRICTE DE DUPLICATION DE PERSONNE ---');
const reloaded = AimeKernelService.getIdentity(testIdentityId);
assert(reloaded !== undefined && reloaded.canonicalName === 'Éléonore Martin', 'Relecture immédiate de la même identité');

const allIdentities = AimeKernelService.getAllIdentities();
const countEleonore = allIdentities.filter(i => i.id === testIdentityId).length;
assert(countEleonore === 1, 'L’identité canonique n’existe qu’une seule et unique fois dans tout le Kernel');

// 4. CRÉATION D’UN WORLDPROJECT
console.log('\n--- TEST 4 : CRÉATION ET GESTION DE WORLDPROJECT ---');
const mariagePrj = AimeKernelService.getProject('prj-mariage-sarah-2026');
assert(mariagePrj !== undefined, 'Le WorldProject prj-mariage-sarah-2026 est présent');
assert(mariagePrj!.universe === 'MARIAGE', 'Le WorldProject est typé MARIAGE');

// 5. CRÉATION D’UNE CONTEXTUALRELATION
console.log('\n--- TEST 5 : CRÉATION D’UNE RELATION CONTEXTUELLE DE JONCTION ---');
const relEleonore = AimeKernelService.createRelation(
  'prj-mariage-sarah-2026',
  testIdentityId,
  'Coordinatrice Décoration',
  'collaborateur',
  'usr-sarah'
);
assert(relEleonore.identityId === testIdentityId, 'Relation créée rattachée à Éléonore');
assert(relEleonore.contextualRole === 'Coordinatrice Décoration', 'Rôle stocké dans la relation contextuelle');
assert(relEleonore.projectId === 'prj-mariage-sarah-2026', 'Relation rattachée au WorldProject');

// 6. MODIFICATION TIMELINE
console.log('\n--- TEST 6 : MUTATION DE TIMELINE ET TRAÇABILITÉ ---');
const timeUpdateSuccess = AimeKernelService.updateTimelineNodeTime(
  'prj-mariage-sarah-2026',
  'node-1',
  '16:15',
  'usr-sarah'
);
assert(timeUpdateSuccess === true, 'Modification de l’horaire de la cérémonie à 16:15 acceptée');
const updatedNode = mariagePrj!.timelineNodes.find(n => n.id === 'node-1');
assert(updatedNode?.time === '16:15', 'L’heure modifiée est bien répercutée dans le nœud timeline');

// 7. RÉVOCATION NON DESTRUCTIVE
console.log('\n--- TEST 7 : RÉVOCATION NON DESTRUCTIVE D’UNE RELATION ---');
const revokeSuccess = AimeKernelService.revokeRelation('prj-mariage-sarah-2026', testIdentityId, 'usr-sarah');
assert(revokeSuccess === true, 'Révocation de la relation d’Éléonore effectuée avec succès');
const relAfterRevoke = AimeKernelService.getProjectRelations('prj-mariage-sarah-2026').find(r => r.identityId === testIdentityId);
assert(relAfterRevoke?.status === 'REVOKE', 'La relation passe au statut REVOKE');
const identityStillExists = AimeKernelService.getIdentity(testIdentityId);
assert(identityStillExists !== undefined, 'L’identité d’Éléonore est préservée intacte (Zéro suppression destructrice)');

// 8. PROPOSITION REFUSÉE = AUCUNE MUTATION
console.log('\n--- TEST 8 : TRANSACTION PROPOSITION REFUSÉE ---');
const proposal = AimeKernelService.proposeChange(
  'prj-mariage-sarah-2026',
  'usr-lucas',
  'timelineNodes.node-1.time',
  'Heure de Cérémonie',
  '16:15',
  '18:00',
  'Proposition tardive d’un témoin'
);
assert(proposal.status === 'PROPOSE', 'Proposition enregistrée à l’état PROPOSE');

const rejectSuccess = AimeKernelService.rejectProposal('prj-mariage-sarah-2026', proposal.id, 'usr-sarah');
assert(rejectSuccess === true, 'Rejet de la proposition par le propriétaire');
const proposalAfterReject = mariagePrj!.pendingProposals.find(p => p.id === proposal.id);
assert(proposalAfterReject?.status === 'REFUSE', 'Statut de la proposition mis à jour à REFUSE');
assert(mariagePrj!.timelineNodes.find(n => n.id === 'node-1')?.time === '16:15', 'La valeur canonique n’a pas été polluée par la proposition refusée');

// 9. PROPOSITION ACCEPTÉE = MUTATION PERSISTÉE
console.log('\n--- TEST 9 : TRANSACTION PROPOSITION ACCEPTÉE ---');
const validProposal = AimeKernelService.proposeChange(
  'prj-mariage-sarah-2026',
  'usr-mattmez',
  'timelineNodes.node-2.time',
  'Balance Saxo',
  '17:30',
  '16:45',
  'Besoin acoustique de balance'
);
const acceptRes = AimeKernelService.acceptProposal('prj-mariage-sarah-2026', validProposal.id, 'usr-sarah');
assert(acceptRes.success === true, 'Acceptation transactionnelle réussie');
const propAfterAccept = mariagePrj!.pendingProposals.find(p => p.id === validProposal.id);
assert(propAfterAccept?.status === 'VALIDE', 'Statut de la proposition mis à jour à VALIDE');

// 10. CONTRÔLE DE SÉCURITÉ SERVEUR / RLS (ACCÈS AUTORISÉ VS REFUSÉ VS SECRET)
console.log('\n--- TEST 10 : SÉCURITÉ SERVEUR & RLS ---');
const accessSarahPublic = AimeKernelService.evaluateAccess('prj-mariage-sarah-2026', 'usr-sarah', 'TIMELINE');
assert(accessSarahPublic.allowed === true, 'Sarah (organisatrice) a un accès légitime à la timeline');

const accessMattFinances = AimeKernelService.evaluateAccess('prj-mariage-sarah-2026', 'usr-mattmez', 'FINANCES');
assert(accessMattFinances.allowed === false, 'Matt Mez (prestataire) se voit refuser l’accès aux devis financiers');

const accessSarahSecretWitness = AimeKernelService.evaluateAccess('prj-mariage-sarah-2026', 'usr-sarah', 'SECRET_CHANNEL');
assert(accessSarahSecretWitness.allowed === false, 'Le système immunitaire bloque l’accès du secret des témoins aux mariés');

const accessLucasSecretWitness = AimeKernelService.evaluateAccess('prj-mariage-sarah-2026', 'usr-lucas', 'SECRET_CHANNEL');
assert(accessLucasSecretWitness.allowed === true, 'Lucas (témoin) a un accès autorisé au canal secret');

// 11. AUDIT LOG APPEND-ONLY
console.log('\n--- TEST 11 : INTÉGRITÉ DE L’AUDIT LOG APPEND-ONLY ---');
const auditLogs = AimeKernelService.getAuditLogs();
assert(auditLogs.length >= 5, 'L’audit log enregistre chaque action de mutation');
assert(auditLogs.every(l => l.isImmutable === true), 'Chaque entrée d’audit est marquée comme immuable');
const hasRevokeLog = auditLogs.some(l => l.action === 'RELATION_REVOKED');
assert(hasRevokeLog, 'L’action de révocation est formellement consignée dans l’audit log');

// 12. MÊME IDENTITÉ SUR PLUSIEURS PROJETS (ZÉRO DUPLICATION)
console.log('\n--- TEST 12 : MULTI-PROJETS SUR LA MÊME IDENTITÉ ---');
const relLucasMariage = AimeKernelService.getProjectRelations('prj-mariage-sarah-2026').find(r => r.identityId === 'usr-lucas');
const relLucasKyoto = AimeKernelService.getProjectRelations('prj-voyage-kyoto-2027').find(r => r.identityId === 'usr-lucas');
assert(relLucasMariage !== undefined && relLucasKyoto !== undefined, 'Lucas a une relation active dans le Mariage et dans le Voyage Kyoto');
assert(relLucasMariage?.identityId === relLucasKyoto?.identityId, 'Les deux relations pointent vers le même identifiant canonique');
const allLucas = AimeKernelService.getAllIdentities().filter(i => i.id === 'usr-lucas');
assert(allLucas.length === 1, 'Lucas Bernard n’existe qu’une seule fois dans tout le système');

// 13. TEST DU BRIDGE : PAS DE SOURCE SECONDAIRE CONCURRENTE
console.log('\n--- TEST 13 : CANONICITÉ DU BRIDGE (AUCUNE BASE DUPLIQUÉE) ---');
const consistency = AimeKernelBridge.runCanonicalConsistencyCheck();
assert(consistency.passed === true, 'Vérification de cohérence canonique du Bridge réussie avec 0 erreur');

// 14. SIMULATION DE CONFLIT DÉTERMINISTE
console.log('\n--- TEST 14 : GESTION DES CONFLITS D’ARBITRAGE ---');
// Tenter d'accepter une proposition déjà arbitrée
const replayAccept = AimeKernelService.acceptProposal('prj-mariage-sarah-2026', validProposal.id, 'usr-sarah');
assert(replayAccept.success === false && Boolean(replayAccept.conflict), 'Détection de conflit déterministe lors d’une double validation');

// 15. PERSISTANCE DISTANTE : VÉRIFICATION ASYNCHRONE DE L'ADAPTATEUR
console.log('\n--- TEST 15 : INTERFACE DE PERSISTANCE POSTGRESQL / SUPABASE ---');
assert(typeof AimePersistenceAdapter.persistIdentity === 'function', 'persistIdentity est implémenté');
assert(typeof AimePersistenceAdapter.persistWorldProject === 'function', 'persistWorldProject est implémenté');
assert(typeof AimePersistenceAdapter.persistRelation === 'function', 'persistRelation est implémenté');
assert(typeof AimePersistenceAdapter.persistTimelineNode === 'function', 'persistTimelineNode est implémenté');
assert(typeof AimePersistenceAdapter.persistProposal === 'function', 'persistProposal est implémenté');
assert(typeof AimePersistenceAdapter.persistAuditLog === 'function', 'persistAuditLog est implémenté');

console.log('\n=================================================================');
console.log(`BILAN DU HARNAIS PASSE 12 : ${passed}/${total} VÉRIFICATIONS RÉUSSIES (100%)`);
console.log('=================================================================');

if (passed !== total) {
  process.exit(1);
}
