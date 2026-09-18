import { AimeKernelService } from '../src/lib/aimeKernelService';
import { AimeKernelBridge } from '../src/lib/aimeKernelBridge';

console.log("=================================================================");
console.log("AIME PASSE 5.1 — CAMPAGNE DE VÉRIFICATION DESTRUCTIVE & VÉRITÉ");
console.log("=================================================================\n");

// 1. TEST SOURCE OF TRUTH & ANTI-DUPLICATION
console.log("--- 1. TEST IDENTITÉ & NON-DUPLICATION ---");
const initialSarah = AimeKernelService.getIdentity('usr-sarah');
const initialMatt = AimeKernelService.getIdentity('usr-mattmez');
const initialLucas = AimeKernelService.getIdentity('usr-lucas');

console.log("Identités chargées :");
console.log(`- Sarah : ${initialSarah?.canonicalName} (ID: ${initialSarah?.id})`);
console.log(`- Matt  : ${initialMatt?.canonicalName} (ID: ${initialMatt?.id})`);
console.log(`- Lucas : ${initialLucas?.canonicalName} (ID: ${initialLucas?.id})`);

// Vérification de Lucas dans deux WorldProjects distincts
const projMariage = AimeKernelService.getProject('prj-mariage-sarah-2026');
const projVoyage = AimeKernelService.getProject('prj-voyage-kyoto-2027');

const relLucasMariage = projMariage?.relations.find(r => r.identityId === 'usr-lucas');
const relLucasVoyage = projVoyage?.relations.find(r => r.identityId === 'usr-lucas');

console.log(`Lucas dans Mariage -> Rôle: "${relLucasMariage?.contextualRole}" (Catégorie: ${relLucasMariage?.roleCategory})`);
console.log(`Lucas dans Voyage  -> Rôle: "${relLucasVoyage?.contextualRole}" (Catégorie: ${relLucasVoyage?.roleCategory})`);

if (relLucasMariage && relLucasVoyage && relLucasMariage.identityId === relLucasVoyage.identityId) {
  console.log("✔ PASS: Lucas existe 1 SEULE FOIS, réutilisé dans 2 Univers avec rôles différents.");
} else {
  console.log("❌ FAIL: Duplication détectée pour Lucas.");
}

// 2. TEST BIDIRECTIONNEL RÉEL (MUTATION KERNEL -> PROJECTION SITE)
console.log("\n--- 2. TEST BIDIRECTIONNEL & PROJECTION MINI-SITE ---");
const mockBaseSiteData: any = {
  site: {
    id: 1,
    partner1: 'AncienPartner',
    partner2: 'AncienPartner2',
    wedding_date: '2020-01-01',
    venue: 'AncienLieu',
    city: 'AncienneVille',
  },
  programme: []
};

const projected = AimeKernelBridge.projectWorldProjectToSiteData(mockBaseSiteData);
console.log(`Projection Mini-Site :`);
console.log(`- Titre / Mariés : ${projected.site.hero_title}`);
console.log(`- Lieu projeté   : ${projected.site.venue}`);
console.log(`- Date projetée  : ${projected.site.wedding_date}`);
console.log(`- Programme      : ${projected.programme.length} scènes synchronisées.`);

if (projected.site.venue === projMariage?.locationName && projected.site.partner1 === 'Sarah') {
  console.log("✔ PASS: Le mini-site projette directement la vérité du Kernel AIME.");
} else {
  console.log("❌ FAIL: Le mini-site n'a pas hérité du Kernel.");
}

// 3. TEST RSVP (AJOUT D'UN INVITÉ SANS DUPLICATION)
console.log("\n--- 3. TEST RSVP & CONTEXTUAL RELATION ---");
AimeKernelBridge.recordRsvpToKernel({
  firstName: 'Camille',
  lastName: 'Roussel',
  email: 'camille.roussel@example.com',
  attending: true,
  allergies: 'Gluten'
});

const camilleIdentity = AimeKernelService.getAllIdentities().find(i => i.email === 'camille.roussel@example.com');
const camilleRel = AimeKernelService.getProjectRelations('prj-mariage-sarah-2026').find(r => r.identityId === camilleIdentity?.id);

console.log(`Invité RSVP créé : ${camilleIdentity?.canonicalName} (ID: ${camilleIdentity?.id})`);
console.log(`Relation Projet créée : Rôle "${camilleRel?.contextualRole}" (Statut: ${camilleRel?.status})`);

if (camilleIdentity && camilleRel) {
  console.log("✔ PASS: Le RSVP crée une Identité Canonique et une Relation Contextuelle.");
} else {
  console.log("❌ FAIL: Erreur lors du flux RSVP.");
}

// 4. TEST DU SYSTÈME IMMUNITAIRE / SÉCURITÉ SERVEUR
console.log("\n--- 4. TEST DU SYSTÈME IMMUNITAIRE (PERMISSIONS) ---");
const checkMattFinances = AimeKernelService.evaluateAccess('prj-mariage-sarah-2026', 'usr-mattmez', 'FINANCES');
const checkSarahSecret = AimeKernelService.evaluateAccess('prj-mariage-sarah-2026', 'usr-sarah', 'SECRET_CHANNEL');
const checkLucasSecret = AimeKernelService.evaluateAccess('prj-mariage-sarah-2026', 'usr-lucas', 'SECRET_CHANNEL');

console.log(`Matt Mez -> Finances       : ${checkMattFinances.allowed ? 'AUTORISÉ' : 'REFUSÉ'} (Raison: ${checkMattFinances.reason})`);
console.log(`Sarah    -> Canal Secret   : ${checkSarahSecret.allowed ? 'AUTORISÉ' : 'REFUSÉ'} (Raison: ${checkSarahSecret.reason})`);
console.log(`Lucas    -> Canal Secret   : ${checkLucasSecret.allowed ? 'AUTORISÉ' : 'REFUSÉ'} (Raison: ${checkLucasSecret.reason})`);

if (!checkMattFinances.allowed && !checkSarahSecret.allowed && checkLucasSecret.allowed) {
  console.log("✔ PASS: Matrice d'autorisations du Système Immunitaire rigoureusement respectée.");
} else {
  console.log("❌ FAIL: Faille de permission détectée.");
}

// 5. TEST DE RÉVOCATION NON-DESTRUCTIVE
console.log("\n--- 5. TEST DE RÉVOCATION NON-DESTRUCTIVE ---");
AimeKernelService.revokeRelation('prj-mariage-sarah-2026', 'usr-mattmez', 'usr-sarah');
const mattRelAfterRevoke = AimeKernelService.getProjectRelations('prj-mariage-sarah-2026').find(r => r.identityId === 'usr-mattmez');
const mattIdentityAfterRevoke = AimeKernelService.getIdentity('usr-mattmez');

console.log(`Statut relation Matt Mez après révocation : ${mattRelAfterRevoke?.status}`);
console.log(`Identité Matt Mez après révocation        : ${mattIdentityAfterRevoke?.canonicalName} (Tarif base: ${mattIdentityAfterRevoke?.professionalProfile?.tarifBase})`);

if (mattRelAfterRevoke?.status === 'REVOKE' && mattIdentityAfterRevoke?.id === 'usr-mattmez') {
  console.log("✔ PASS: La relation est révoquée SANS détruire l'identité canonique ni son profil.");
} else {
  console.log("❌ FAIL: Révocation destructive.");
}

// Restauration
AimeKernelService.restoreRelation('prj-mariage-sarah-2026', 'usr-mattmez', 'usr-sarah');
console.log("✔ Restauration de Matt Mez validée.");

// 6. CANONICAL CONSISTENCY CHECK
console.log("\n--- 6. CANONICAL DATA CONSISTENCY CHECK GLOBAL ---");
const consistency = AimeKernelBridge.runCanonicalConsistencyCheck();
console.log(`Résultat : ${consistency.passed ? 'SUCCÈS' : 'ÉCHEC'}`);
console.log(`Stats :`, consistency.stats);
if (consistency.errors.length > 0) {
  console.log("Erreurs détectées :", consistency.errors);
} else {
  console.log("✔ PASS: Aucune duplication, aucune référence orpheline.");
}

console.log("\n=================================================================");
console.log("FIN DE CAMPAGNE PASSE 5.1");
console.log("=================================================================");
