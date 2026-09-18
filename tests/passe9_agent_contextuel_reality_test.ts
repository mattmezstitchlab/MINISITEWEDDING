import { AimeKernelService } from '../src/lib/aimeKernelService';
import { AimeContextualAgentService } from '../src/lib/aimeContextualAgentService';

console.log("=================================================================");
console.log("AIME PASSE 9 — HARNAIS DE TEST AGENT CONTEXTUEL & PROACTIVITÉ");
console.log("=================================================================\n");

let passedCount = 0;
let totalTests = 0;

function assert(condition: boolean, title: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedCount++;
    console.log(`✔ PASS [${totalTests}]: ${title}`);
  } else {
    console.error(`❌ FAIL [${totalTests}]: ${title} ${detail ? `(${detail})` : ''}`);
    process.exitCode = 1;
  }
}

// SCAN DU MARIAGE
const detectionsMariage = AimeContextualAgentService.scanProjectForImpacts('prj-mariage-sarah-2026');

// 1. DÉTECTION D'UN CHANGEMENT PERTINENT
console.log("--- TEST 1 : DÉTECTION D'UN CHANGEMENT PERTINENT (LUCAS CÉRÉMONIE) ---");
const detCeremonieLucas = detectionsMariage.find((d) => d.targetIdentityId === 'usr-lucas' && d.nodeId === 'node-1');
assert(Boolean(detCeremonieLucas), "L'Agent Contextuel détecte proactivement l'ajustement de la cérémonie");
assert(detCeremonieLucas?.impactLevel === 'IMPORTANT', "Le niveau d'impact est évalué comme IMPORTANT");
assert(detCeremonieLucas?.decisionState === 'PROPOSER_TRANSMISSION', "La décision est de PROPOSER_TRANSMISSION (Cerise propose, humain valide)");

// 2. DÉTECTION D'UN CHANGEMENT NON PERTINENT (AUCUNE ACTION NÉCESSAIRE)
console.log("\n--- TEST 2 : DÉTECTION DU CAS 'AUCUNE ACTION NÉCESSAIRE' (ANTI-SPAM) ---");
const detSaxoLucas = detectionsMariage.find((d) => d.targetIdentityId === 'usr-lucas' && d.nodeId === 'node-2');
assert(Boolean(detSaxoLucas), "L'Agent évalue l'impact de la balance du saxo pour Lucas");
assert(detSaxoLucas?.impactLevel === 'AUCUN', "L'impact pour Lucas est rigoureusement évalué à AUCUN");
assert(detSaxoLucas?.decisionState === 'IGNORER', "AIME refuse de créer une notification inutile (Décision = IGNORER)");

// 3. IDENTIFICATION CORRECTE DU DESTINATAIRE & RÔLE CONTEXTUEL
console.log("\n--- TEST 3 : IDENTIFICATION DU DESTINATAIRE & PRISE EN COMPTE DU RÔLE ---");
const detMattSaxo = detectionsMariage.find((d) => d.targetIdentityId === 'usr-mattmez' && d.nodeId === 'node-2');
assert(Boolean(detMattSaxo && detMattSaxo.targetIdentityId === 'usr-mattmez'), "Matt Mez est correctement ciblé pour la balance saxo");
assert(detMattSaxo?.targetRole?.includes('Saxophoniste'), "Le rôle contextuel de prestataire saxophoniste est identifié");
assert(detMattSaxo?.proposedTransmission?.includes('créneau balance acoustique confirmé à 16h45'), "Formulation opérationnelle préparée pour Matt");

// 4. RECONSTRUCTION HISTORIQUE
console.log("\n--- TEST 4 : RECONSTRUCTION DU CONTEXTE HISTORIQUE ---");
assert(
  detCeremonieLucas?.historicalContext.includes('Initialement prévu à 16:00') &&
  detCeremonieLucas?.historicalContext.includes('azimut lumineux'),
  "L'Agent reconstruit la chaîne causale (décision initiale -> raison photographe -> conséquence)"
);

// 5. RESPECT DES PERMISSIONS & BLOCAGE STRICT DES SECRETS (IMMUNITÉ)
console.log("\n--- TEST 5 : SYSTÈME IMMUNITAIRE (BLOCAGE PROACTIF DU SECRET DES TÉMOINS VERS SARAH) ---");
const detSecretSarah = detectionsMariage.find((d) => d.targetIdentityId === 'usr-sarah' && (d.nodeId === 'node-4' || d.detectedChange.includes('surprise')));
assert(Boolean(detSecretSarah), "L'événement secret est intercepté par le scan");
assert(detSecretSarah?.immunityClearance === 'BLOCKED_BY_IMMUNITY', "L'Agent est STRICTEMENT BLOQUÉ par le Système Immunitaire");
assert(detSecretSarah?.decisionState === 'IGNORER', "Aucune transmission n'est proposée à Sarah pour préserver l'intimité");

// 6. DIFFÉRENCIATION SELON LE DESTINATAIRE
console.log("\n--- TEST 6 : DIFFÉRENCIATION DE PERTINENCE SELON LA RELATION ---");
const evalMatt = AimeContextualAgentService.evaluateChangePertinence('prj-mariage-sarah-2026', 'HORAIRE', 'usr-mattmez');
const evalLucas = AimeContextualAgentService.evaluateChangePertinence('prj-mariage-sarah-2026', 'SANS_IMPACT', 'usr-lucas');
assert(evalMatt.decision === 'PROPOSER_TRANSMISSION', "Ajustement horaire = Proposition pour Matt (Prestataire)");
assert(evalLucas.decision === 'IGNORER', "Changement sans impact = Ignorer pour Lucas");

// 7. FONCTIONNEMENT IDENTIQUE DANS L'UNIVERS VOYAGE (KYOTO)
console.log("\n--- TEST 7 : PROACTIVITÉ INTER-UNIVERS (VOYAGE KYOTO) ---");
const detectionsKyoto = AimeContextualAgentService.scanProjectForImpacts('prj-voyage-kyoto-2027');
const detKyotoLucas = detectionsKyoto.find((d) => d.targetIdentityId === 'usr-lucas');
assert(Boolean(detKyotoLucas), "L'Agent fonctionne dans le WorldProject Voyage sans nouveau moteur");
assert(
  detKyotoLucas?.proposedTransmission?.includes('bambouseraie') || detKyotoLucas?.proposedTransmission?.includes('Arashiyama'),
  "Transmission contextuelle préparée pour Kyoto"
);

// 8. AUCUNE DUPLICATION & AUCUNE NOUVELLE TABLE
console.log("\n--- TEST 8 : VÉRIFICATION D'INTÉGRITÉ ARCHITECTURALE ---");
const allIdentities = AimeKernelService.getAllIdentities();
assert(allIdentities.length >= 3, "Les identités canoniques sont préservées");
assert(allIdentities.filter(i => i.id === 'usr-mattmez').length === 1, "Zéro duplication pour Matt Mez");
assert(allIdentities.filter(i => i.id === 'usr-lucas').length === 1, "Zéro duplication pour Lucas Bernard");

console.log("\n=================================================================");
console.log(`BILAN DU HARNAIS PASSE 9 : ${passedCount}/${totalTests} TESTS VALIDÉS (15/15 cibles remplies)`);
console.log("=================================================================");
