import { AimeKernelService } from '../src/lib/aimeKernelService';
import { AimeKernelBridge } from '../src/lib/aimeKernelBridge';

console.log("=================================================================");
console.log("AIME PASSE 7 — AUDIT TECHNIQUE DE RÉALITÉ PRODUIT UNIVERSELLE");
console.log("=================================================================\n");

let passed = 0;
let total = 0;

function assert(condition: boolean, testTitle: string, detail?: string) {
  total++;
  if (condition) {
    passed++;
    console.log(`✔ PASS [${total}]: ${testTitle}`);
  } else {
    console.error(`❌ FAIL [${total}]: ${testTitle} ${detail ? `(${detail})` : ''}`);
    process.exitCode = 1;
  }
}

// 1. TEST « CHANGEMENT DE CONTEXTE » (UNE IDENTITÉ -> PLUSIEURS MONDES)
console.log("--- TEST 1 : DÉPLACEMENT D'UNE IDENTITÉ ENTRE UNIVERS SANS CONTAMINATION ---");
const lucasId = 'usr-lucas';
const lucas = AimeKernelService.getIdentity(lucasId);
assert(Boolean(lucas && lucas.id === 'usr-lucas'), "Lucas existe comme identité unique canonique");

const projMariage = AimeKernelService.getProject('prj-mariage-sarah-2026');
const projVoyage = AimeKernelService.getProject('prj-voyage-kyoto-2027');

const relLucasMariage = projMariage?.relations.find(r => r.identityId === lucasId);
const relLucasVoyage = projVoyage?.relations.find(r => r.identityId === lucasId);

assert(
  relLucasMariage?.contextualRole === 'Témoin d’Honneur & Maître des Surprises',
  "Lucas a le rôle contextuel de Témoin dans le Mariage"
);
assert(
  relLucasVoyage?.contextualRole === 'Co-voyageur & Reporter Photo',
  "Lucas a le rôle contextuel de Co-voyageur dans le Voyage Kyoto"
);
assert(
  relLucasMariage?.id !== relLucasVoyage?.id,
  "Les relations sont des objets distincts, mais pointent vers la même identité canonique"
);

// 2. TEST DE CONTAMINATION INTER-UNIVERS (ÉTANCHÉITÉ IMMUNITAIRE)
console.log("\n--- TEST 2 : ÉTANCHÉITÉ DES PERMISSIONS ENTRE PROJETS ---");
// Lucas a accès au secret dans le mariage (surprise des mariés)
const checkLucasSecretMariage = AimeKernelService.evaluateAccess('prj-mariage-sarah-2026', lucasId, 'SECRET_CHANNEL');
assert(
  checkLucasSecretMariage.allowed === true,
  "Lucas a accès au canal secret dans le Mariage (surprises autorisées)"
);

// Matt Mez dans le mariage n'a PAS accès aux finances privées
const checkMattFinancesMariage = AimeKernelService.evaluateAccess('prj-mariage-sarah-2026', 'usr-mattmez', 'FINANCES');
assert(
  checkMattFinancesMariage.allowed === false,
  "Matt Mez n'a pas accès aux finances privées du Mariage de Sarah"
);

// Sarah dans son mariage n'a PAS accès aux secrets de ses témoins
const checkSarahSecretMariage = AimeKernelService.evaluateAccess('prj-mariage-sarah-2026', 'usr-sarah', 'SECRET_CHANNEL');
assert(
  checkSarahSecretMariage.allowed === false,
  "Sarah n'a pas accès au canal secret de ses propres témoins (Immunité scellée)"
);

// 3. TEST DE SORTIE D'UN PROJET (RÉVOCATION SANS DESTRUCTION D'IDENTITÉ)
console.log("\n--- TEST 3 : RÉVOCATION NON-DESTRUCTIVE D'UN PROJET ---");
// Révocation de Matt Mez du projet Mariage
AimeKernelService.revokeRelation('prj-mariage-sarah-2026', 'usr-mattmez', 'usr-sarah');

const mattRelAfter = AimeKernelService.getProjectRelations('prj-mariage-sarah-2026').find(r => r.identityId === 'usr-mattmez');
const mattIdentityAfter = AimeKernelService.getIdentity('usr-mattmez');

assert(mattRelAfter?.status === 'REVOKE', "La relation mariage de Matt Mez est révoquée");
assert(
  mattIdentityAfter?.canonicalName === 'Matt Mez' && mattIdentityAfter.professionalProfile?.trade.includes('Saxophoniste'),
  "L'identité canonique de Matt Mez et son profil professionnel sont 100% conservés"
);

// Restauration pour conserver la cohérence
AimeKernelService.restoreRelation('prj-mariage-sarah-2026', 'usr-mattmez', 'usr-sarah');
assert(
  AimeKernelService.getProjectRelations('prj-mariage-sarah-2026').find(r => r.identityId === 'usr-mattmez')?.status === 'ACTIF',
  "Restauration de la relation de Matt Mez sans recréer d'identité"
);

// 4. TEST DE RÉUTILISATION DANS UN NOUVEAU CONTEXTE
console.log("\n--- TEST 4 : ATTACHEMENT À UN AUTRE PROJET SANS DUPLICATION ---");
// Création d'une relation pour Matt Mez dans le projet Voyage Kyoto
const relMattVoyage = AimeKernelService.createRelation(
  'prj-voyage-kyoto-2027',
  'usr-mattmez',
  'Artiste Acoustique Invité',
  'prestataire',
  'usr-sarah'
);

assert(
  relMattVoyage.identityId === 'usr-mattmez' && relMattVoyage.projectId === 'prj-voyage-kyoto-2027',
  "Matt Mez est attaché au projet Voyage Kyoto via sa référence unique (Zéro duplication)"
);

const allIdentities = AimeKernelService.getAllIdentities();
const mattCount = allIdentities.filter(i => i.id === 'usr-mattmez').length;
assert(mattCount === 1, "Il n'existe toujours qu'une seule identité canonique usr-mattmez");

// 5. TEST DE RECHERCHE UNIVERSELLE RELATIONNELLE
console.log("\n--- TEST 5 : RECHERCHE UNIVERSELLE ---");
const consistency = AimeKernelBridge.runCanonicalConsistencyCheck();
assert(consistency.passed, "Vérification globale de cohérence canonique : 0 erreur");

console.log("\n=================================================================");
console.log(`BILAN DU HARNAIS PASSE 7 : ${passed}/${total} TESTS VALIDÉS`);
console.log("=================================================================");
