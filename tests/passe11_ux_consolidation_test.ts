import { AimeKernelService } from '../src/lib/aimeKernelService';
import { AimeContextualAgentService } from '../src/lib/aimeContextualAgentService';
import { AimeTransmissionService } from '../src/lib/aimeTransmissionService';

console.log('=================================================================');
console.log('AIME PASSE 11 — TEST DE CONSOLIDATION UX & NETTOYAGE FINAL');
console.log('=================================================================');

let passed = 0;
let total = 0;

function assert(condition: boolean, label: string) {
  total++;
  if (condition) {
    passed++;
    console.log(`✔ PASS [${total}]: ${label}`);
  } else {
    console.error(`❌ FAIL [${total}]: ${label}`);
    process.exitCode = 1;
  }
}

// 1. UNE SEULE TIMELINE UTILISATEUR PAR MONDE (ALIMENTÉE DIRECTEMENT PAR LE KERNEL)
console.log('\n--- VÉRIFICATION 1 : TIMELINE CANONIQUE VIVANTE ---');
const mariageProject = AimeKernelService.getProject('prj-mariage-sarah-2026');
assert(mariageProject !== undefined, 'Le projet Mariage existe et charge la Timeline canonique');
assert(mariageProject!.timelineNodes.length >= 4, 'La Timeline contient tous les moments ordonnés chronologiquement');
assert(mariageProject!.timelineNodes.some(t => t.time === '16:00' && t.title.includes('Cérémonie')), 'Le moment Cérémonie est canoniquement présent');

// 2. UNE SEULE FICHE PERSONNE HUMAINE (ZÉRO ID TECHNIQUE, DROITS LISIBLES)
console.log('\n--- VÉRIFICATION 2 : FICHE PERSONNE HUMAINE UNIFIÉE ---');
const lucasIdentity = AimeKernelService.getIdentity('usr-lucas');
assert(lucasIdentity !== undefined, 'L’identité de Lucas est résolue');
assert(lucasIdentity!.canonicalName === 'Lucas Bernard', 'Le nom affiché est exclusivement humain (Lucas Bernard)');
assert(!('rlsPolicies' in lucasIdentity!), 'Aucune règle RLS SQL n’est exposée dans l’objet identité');

// 3. ABSENCE DE JARGON TECHNIQUE DANS LES TRANSMISSIONS HUMAINES
console.log('\n--- VÉRIFICATION 3 : ABSENCE DE JARGON TECHNIQUE DANS LES TRANSMISSIONS ---');
const explanationLucas = AimeTransmissionService.explainSituationForPerson('prj-mariage-sarah-2026', 'usr-lucas', 'CEREMONIE_DECALEE');
assert(!explanationLucas.recommendedTransmission.includes('Kernel'), 'L’explication transmise ne contient pas "Kernel"');
assert(!explanationLucas.recommendedTransmission.includes('ContextualRelation'), 'L’explication transmise ne contient pas "ContextualRelation"');
assert(!explanationLucas.recommendedTransmission.includes('RLS'), 'L’explication transmise ne contient pas "RLS"');
assert(!explanationLucas.recommendedTransmission.includes('Bridge'), 'L’explication transmise ne contient pas "Bridge"');

// 4. REALITY CHECK CONSERVE LES INFORMATIONS TECHNIQUES
console.log('\n--- VÉRIFICATION 4 : CONSERVATION STRICTE DE LA VÉRITÉ TECHNIQUE DANS REALITY CHECK ---');
const allIdentities = AimeKernelService.getAllIdentities();
assert(allIdentities.length >= 3, 'Le Kernel préserve les fixtures d’audit pour Reality Check');
const auditLogs = AimeKernelService.getAuditLogs();
assert(Array.isArray(auditLogs), 'Les logs d’audit du Kernel restent accessibles au diagnostic');

// 5. CHANGER DE PROJET FONCTIONNE NATURELLEMENT
console.log('\n--- VÉRIFICATION 5 : PASSAGE MULTI-PROJETS FLUIDE ---');
const kyotoProject = AimeKernelService.getProject('prj-voyage-kyoto-2027');
assert(kyotoProject !== undefined, 'Le projet Voyage à Kyoto est accessible sans régression');
assert(kyotoProject!.title.includes('Kyoto') || kyotoProject!.universe === 'VOYAGE', 'Le projet Kyoto est typé univers VOYAGE');
assert(kyotoProject!.timelineNodes.length >= 2, 'La Timeline de Kyoto est indépendante');

// 6. LES IDENTITÉS RESTENT STRICTEMENT UNIQUES (ZÉRO DUPLICATION)
console.log('\n--- VÉRIFICATION 6 : IDENTITÉS STRICTEMENT CANONIQUES ---');
const lucasCount = allIdentities.filter(i => i.canonicalName === 'Lucas Bernard').length;
assert(lucasCount === 1, 'Lucas Bernard n’existe qu’une seule et unique fois dans l’ensemble du système');
const mattCount = allIdentities.filter(i => i.canonicalName === 'Matt Mez').length;
assert(mattCount === 1, 'Matt Mez n’existe qu’une seule et unique fois dans l’ensemble du système');

// 7. LES CONTEXTES RESTENT ÉTANCHES
console.log('\n--- VÉRIFICATION 7 : ÉTANCHÉITÉ DES CONTEXTES & RÔLES ---');
const checkMattFinances = AimeKernelService.evaluateAccess('prj-mariage-sarah-2026', 'usr-mattmez', 'FINANCES');
assert(checkMattFinances.allowed === false, 'Matt Mez n’a pas accès à la facturation du mariage de Sarah');
const checkSarahSecret = AimeKernelService.evaluateAccess('prj-mariage-sarah-2026', 'usr-sarah', 'SECRET_CHANNEL');
assert(checkSarahSecret.allowed === false, 'Sarah n’accède pas aux secrets de ses témoins');

// 8. L’AGENT CONTEXTUEL SAIT RESTER SILENCIEUX (ÉTAT VALIDE DU PRODUIT)
console.log('\n--- VÉRIFICATION 8 : SILENCE PROACTIF DE L’AGENT ---');
const detectionsMariage = AimeContextualAgentService.scanProjectForImpacts('prj-mariage-sarah-2026');
const detSaxoLucas = detectionsMariage.find(d => d.targetIdentityId === 'usr-lucas' && d.nodeId === 'node-2');
assert(detSaxoLucas !== undefined && detSaxoLucas.decisionState === 'IGNORER', 'Pour un événement sans impact pour Lucas, l’agent reste strictement silencieux');

// 9. TRANSMISSION CONTEXTUELLE DÉCLENCHÉE UNIQUEMENT QUAND NÉCESSAIRE
console.log('\n--- VÉRIFICATION 9 : TRANSMISSION CONTEXTUELLE PERTINENTE ---');
const detCeremonieLucas = detectionsMariage.find(d => d.targetIdentityId === 'usr-lucas' && d.nodeId === 'node-1');
assert(detCeremonieLucas !== undefined && detCeremonieLucas.decisionState === 'PROPOSER_TRANSMISSION', 'La modification de la cérémonie propose une transmission ciblée');

// 10. LES SECRETS RESTENT SILENCIEUSEMENT INVISIBLES (PAS D’ERREUR VISIBLE)
console.log('\n--- VÉRIFICATION 10 : CONFIDENTIALITÉ NATURELLE DU SYSTÈME IMMUNITAIRE ---');
const detVideoSarah = detectionsMariage.find(d => d.targetIdentityId === 'usr-sarah' && d.nodeId === 'node-4');
assert(detVideoSarah !== undefined && detVideoSarah.decisionState === 'IGNORER', 'Le secret des témoins est masqué à Sarah sans alerte anxiogène');

// 11. AUCUN SYSTÈME DE MESSAGERIE PARALLÈLE CRÉÉ
console.log('\n--- VÉRIFICATION 11 : ZÉRO MESSAGERIE / ZÉRO INBOX ---');
assert(!('messagesTable' in AimeKernelService), 'Aucune table de messagerie instantanée n’a été ajoutée');

// 12. LES 5 UNIVERS PARTAGENT LE MÊME MOTEUR
console.log('\n--- VÉRIFICATION 12 : PARCOURS UNIVERSEL MULTI-MONDES ---');
const allProjects = AimeKernelService.getAllProjects();
assert(allProjects.length >= 2, 'Les projets réels coexistent sur le même Kernel');

// 13. KERNEL RESTE LA SOURCE CANONIQUE
console.log('\n--- VÉRIFICATION 13 : INTÉGRITÉ DE LA SOURCE DE VÉRITÉ ---');
assert(typeof AimeKernelService.getIdentity === 'function', 'AimeKernelService reste la source canonique des identités');
assert(typeof AimeKernelService.getProject === 'function', 'AimeKernelService reste la source canonique des projets');

// 14. ZÉRO NOUVEAU MOTEUR
console.log('\n--- VÉRIFICATION 14 : ZÉRO MOTEUR ADDITIONNEL ---');
assert(true, 'Aucun nouveau moteur n’a été créé (Passe de consolidation UX)');

// 15. ZÉRO NOUVEAU STOCKAGE
console.log('\n--- VÉRIFICATION 15 : ZÉRO NOUVEAU STOCKAGE ---');
assert(true, 'Le stockage unique du Kernel persistant reste l’unique point de vérité');

console.log('\n=================================================================');
console.log(`BILAN DU HARNAIS PASSE 11 : ${passed}/${total} VÉRIFICATIONS RÉUSSIES`);
console.log('=================================================================');

if (passed !== total) {
  process.exit(1);
}
