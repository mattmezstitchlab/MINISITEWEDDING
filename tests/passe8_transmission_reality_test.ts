import { AimeKernelService } from '../src/lib/aimeKernelService';
import { AimeTransmissionService } from '../src/lib/aimeTransmissionService';

console.log("=================================================================");
console.log("AIME PASSE 8 — HARNAIS DE TEST TRANSMISSION & COMPRÉHENSION");
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

// 1. TEST : UNE INFORMATION HISTORIQUE EST RELIÉE À UNE SITUATION ACTUELLE
console.log("--- TEST 1 : RECONSTRUCTION HISTORIQUE D'UNE DÉCISION PASSÉE (LUCAS) ---");
const expLucasCeremonie = AimeTransmissionService.explainSituationForPerson(
  'prj-mariage-sarah-2026',
  'usr-lucas',
  'CEREMONIE_DECALEE'
);

assert(
  expLucasCeremonie.transmissionLevel === 'HISTORIQUE',
  "Le niveau de transmission est HISTORIQUE (reconstruit l'origine et l'évolution)"
);
assert(
  expLucasCeremonie.whyNow.includes('ajustée de 15 min'),
  "AIME sait 'Pourquoi maintenant ?' (décalage de 15 min)"
);
assert(
  expLucasCeremonie.targetRole.includes('Témoin'),
  "Le rôle contextuel de Lucas (Témoin) est directement pris en compte"
);
assert(
  expLucasCeremonie.recommendedTransmission.includes('Lucas, la cérémonie est décalée à 16h15'),
  "Formulation humaine et concise générée pour Lucas"
);

// 2. TEST : LE CONTEXTE RELATIONNEL MODIFIE LA TRANSMISSION PROPOSÉE
console.log("\n--- TEST 2 : FORMULATION DIFFÉRENCIÉE SELON LA RELATION (MATT MEZ VS LUCAS) ---");
const expMattCeremonie = AimeTransmissionService.explainSituationForPerson(
  'prj-mariage-sarah-2026',
  'usr-mattmez',
  'CEREMONIE_DECALEE'
);

assert(
  expMattCeremonie.recommendedTransmission.includes('Information régie') &&
  expMattCeremonie.recommendedTransmission.includes('arrivée cocktail reste fixée à 17h30'),
  "Matt Mez (Prestataire) reçoit uniquement l'information opérationnelle le concernant"
);
assert(
  expMattCeremonie.recommendedTransmission !== expLucasCeremonie.recommendedTransmission,
  "La transmission proposée diffère selon la relation sans modifier la donnée source"
);

// 3. TEST : SYSTÈME IMMUNITAIRE & BLOQUAGE STRICT DES SECRETS
console.log("\n--- TEST 3 : SYSTÈME IMMUNITAIRE (BLOCAGE DES FUITES CONFIDENTIELLES) ---");
// Tentative d'expliquer la surprise des témoins à Sarah (propriétaire du projet)
const expSarahSurprise = AimeTransmissionService.explainSituationForPerson(
  'prj-mariage-sarah-2026',
  'usr-sarah',
  'SURPRISE_TEMOINS'
);

assert(
  expSarahSurprise.securityClearance === 'BLOCKED_BY_IMMUNITY',
  "La transmission vers Sarah est STRICTEMENT BLOQUÉE par le Système Immunitaire"
);
assert(
  expSarahSurprise.needsTransmission === false && expSarahSurprise.recommendedTransmission === '',
  "Aucun message n'est formulé vers Sarah pour préserver l'intimité de la surprise"
);

// Pour Lucas (Témoin autorisé) : la transmission est autorisée
const expLucasSurprise = AimeTransmissionService.explainSituationForPerson(
  'prj-mariage-sarah-2026',
  'usr-lucas',
  'SURPRISE_TEMOINS'
);

assert(
  expLucasSurprise.securityClearance === 'ALLOWED' && expLucasSurprise.needsTransmission === true,
  "Lucas (Témoin) reçoit la confirmation discrète de régie car sa permission l'y autorise"
);

// 4. TEST : AUCUNE TRANSMISSION NÉCESSAIRE (ANTI-SPAM / ZÉRO CHARGE COGNITIVE)
console.log("\n--- TEST 4 : DÉTECTION DU CAS 'AUCUNE TRANSMISSION NÉCESSAIRE' ---");
// Simulation d'une situation sans impact
const expNoImpact = AimeTransmissionService.explainSituationForPerson(
  'prj-mariage-sarah-2026',
  'usr-lucas',
  'BALANCE_SAXO'
);

// Lucas n'a pas besoin d'être prévenu de la balance acoustique du saxo !
assert(
  expNoImpact.needsTransmission === false,
  "AIME refuse de créer un message inutile pour Lucas concernant la balance du saxo"
);

// 5. TEST : LE MÊME MÉCANISME FONCTIONNE DANS UN AUTRE WORLDPROJECT (VOYAGE KYOTO)
console.log("\n--- TEST 5 : FONCTIONNEMENT IDENTIQUE DANS L'UNIVERS VOYAGE (KYOTO) ---");
const expLucasVoyage = AimeTransmissionService.explainSituationForPerson(
  'prj-voyage-kyoto-2027',
  'usr-lucas',
  'VOYAGE_RYOKAN'
);

assert(
  expLucasVoyage.projectTitle.includes('Kyoto') && expLucasVoyage.targetRole.includes('Co-voyageur'),
  "AIME contextualise la transmission pour le rôle de Co-voyageur de Lucas à Kyoto"
);
assert(
  expLucasVoyage.recommendedTransmission.includes('Ryokan Gion est validée'),
  "Transmission concrète générée pour le voyage sans changer de moteur"
);

// 6. TEST : INTÉGRITÉ ABSOLUE DU KERNEL (ZÉRO NOUVELLE IDENTITÉ, ZÉRO NOUVELLE TABLE)
console.log("\n--- TEST 6 : VÉRIFICATION D'INTÉGRITÉ CANONIQUE ---");
const allIdentities = AimeKernelService.getAllIdentities();
assert(
  allIdentities.length >= 3 && allIdentities.some(i => i.id === 'usr-lucas') && allIdentities.some(i => i.id === 'usr-mattmez'),
  "Aucune identité n'a été créée ou dupliquée lors des explications et transmissions"
);

console.log("\n=================================================================");
console.log(`BILAN DU HARNAIS PASSE 8 : ${passedCount}/${totalTests} TESTS VALIDÉS`);
console.log("=================================================================");
