import { AimeKernelService } from '../src/lib/aimeKernelService';
import { AimeKernelBridge } from '../src/lib/aimeKernelBridge';

console.log("=================================================================");
console.log("AIME PASSE 5.3 — CANONICAL LOCK & NON-RÉGRESSION TEST");
console.log("=================================================================\n");

let passedCount = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedCount++;
    console.log(`✔ PASS [${totalTests}]: ${testName}`);
  } else {
    console.error(`❌ FAIL [${totalTests}]: ${testName} ${detail ? `(${detail})` : ''}`);
    process.exitCode = 1;
  }
}

// 1. RÈGLE : LE KERNEL EST LA SEULE SOURCE CANONIQUE POUR L'IDENTITÉ
console.log("--- TEST 1 : KERNEL COMME SOURCE CANONIQUE DES IDENTITÉS ---");
const sarah = AimeKernelService.getIdentity('usr-sarah');
const matt = AimeKernelService.getIdentity('usr-mattmez');
assert(Boolean(sarah && sarah.canonicalName === 'Sarah Alvès'), "Sarah existe de façon stable dans le Kernel");
assert(Boolean(matt && matt.canonicalName === 'Matt Mez'), "Matt existe de façon stable dans le Kernel");

// 2. RÈGLE : LE MARIAGE EST UNE PROJECTION STRICTE DU WORLDPROJECT
console.log("\n--- TEST 2 : PROJECTION STRICTE DU WORLDPROJECT (IMMUNITÉ CONTRE DIVERGENCE) ---");
const fakeLegacyData: any = {
  site: {
    id: 1,
    partner1: 'FauxMariéLegacy',
    partner2: 'FausseMariéeLegacy',
    venue: 'FauxLieuLegacyQuiNeDoitPasApparaitre',
    city: 'FausseVille',
    wedding_date: '1999-12-31'
  },
  programme: [
    { id: 99, title: 'FauxProgrammeLegacy', event_time: '00:00' }
  ]
};

const projectionResult = AimeKernelBridge.projectWorldProjectToSiteData(fakeLegacyData);

// Vérifier que le Kernel écrase la valeur Legacy divergente
assert(
  projectionResult.site.venue === 'Château des Tilleuls',
  "Le lieu du mini-site provient obligatoirement du Kernel (Château des Tilleuls), écrasant le Legacy"
);
assert(
  projectionResult.site.partner1 === 'Sarah',
  "Le prénom du marié/mariée provient du propriétaire canonique du WorldProject (Sarah)"
);
assert(
  projectionResult.programme.every(p => p.title !== 'FauxProgrammeLegacy'),
  "Aucun faux programme legacy ne pollue la vue projetée"
);

// 3. RÈGLE : LE BRIDGE NE COPIE PAS LE LEGACY DANS LE KERNEL (PAS DE RÉPARATION INVERSÉE)
console.log("\n--- TEST 3 : PAS DE CONTAMINATION INVERSE DU KERNEL PAR LE LEGACY ---");
const projectAfterProjection = AimeKernelService.getProject('prj-mariage-sarah-2026');
assert(
  projectAfterProjection?.locationName === 'Château des Tilleuls',
  "Le Kernel reste intact et n'a pas été contaminé par la valeur legacy 'FauxLieuLegacyQuiNeDoitPasApparaitre'"
);

// 4. RÈGLE : L'ÉDITEUR ÉCRIT DIRECTEMENT DANS LE KERNEL EN PREMIER
console.log("\n--- TEST 4 : ÉCRITURE CANONIQUE DEPUIS L'ÉDITEUR ---");
AimeKernelBridge.updateWorldProjectFromEditor({
  venue: 'Château des Tilleuls (Édité)',
  city: 'Valbonne Contemporaine'
});

const updatedProject = AimeKernelService.getProject('prj-mariage-sarah-2026');
assert(
  updatedProject?.locationName === 'Château des Tilleuls (Édité)',
  "L'éditeur a directement muté le WorldProject Kernel persistant"
);

// Rétablissement de la valeur initiale
AimeKernelBridge.updateWorldProjectFromEditor({
  venue: 'Château des Tilleuls',
  city: 'Valbonne'
});

// 5. RÈGLE : LE RSVP NE CRÉE PAS D'IDENTITÉ PARALLÈLE
console.log("\n--- TEST 5 : LE FLUX RSVP RESPECTE L'UNICITÉ CANONIQUE ---");
AimeKernelBridge.recordRsvpToKernel({
  firstName: 'Lucas',
  lastName: 'Bernard',
  email: 'lucas.b@example.com', // Email déjà existant
  attending: true
});

const allIdentities = AimeKernelService.getAllIdentities();
const lucasCount = allIdentities.filter(i => i.email.toLowerCase() === 'lucas.b@example.com').length;
assert(
  lucasCount === 1,
  "RSVP avec un email existant ne crée AUCUNE deuxième identité (lucasCount === 1)"
);

// 6. RÈGLE : NON-RÉGRESSION DE COHÉRENCE GLOBALE
console.log("\n--- TEST 6 : AUDIT DE COHÉRENCE CANONIQUE GLOBALE ---");
const consistency = AimeKernelBridge.runCanonicalConsistencyCheck();
assert(consistency.passed, "Canonical Consistency Check : 0 erreur, 0 orphelin");

console.log("\n=================================================================");
console.log(`RÉSULTAT DU VERROUILLAGE CANONIQUE : ${passedCount}/${totalTests} TESTS VALIDÉS`);
console.log("=================================================================");

if (passedCount !== totalTests) {
  process.exit(1);
}
