import { useLEtatDuTicket } from '../hooks/useLEtatDuTicket';
import LeChampDuTicket from '../components/LeChampDuTicket';
import LeTicketPleinEcran from '../components/LeTicketPleinEcran';

/* LE SPÉCIALISTE DU TICKET DE CAISSE — **LE PAPIER, ET RIEN D'AUTRE**
 *
 * « Garde que le ticket du haut, c'est suffisant. » Cette page-là ne monte que
 * le papier : le champ (un seul contrôle, le +) et le ticket, droit, qui prend
 * l'écran. Tout ce qui le configure vit sur la landing (`/`), et l'état est le
 * même : `useLEtatDuTicket`.
 *
 * ```txt
 *   ┌──────────────────────────────┐
 *   › un dîner pour vingt…   ＋      le champ : on écrit, et ça part tout seul
 *   ┌──────────────────────────────┐
 *   │       SUPER MARIAGE          │   le papier, et tout ce qu'il porte
 *   │  NUB-139 · CAISSE 3 · 23:00  │
 *   │  › LE MENU SUPER ESSENTIEL▌  │   ce que la caisse écrit, lettre par lettre
 *   │  TOTAL        41 620 €       │   on clique : le papier dit PAYÉ
 *   │  ● ● ● ● ● ●   LE MARKER     │   sa couleur de marker
 *   └──────────────────────────────┘
 * ```
 *
 * L'adresse porte tout : `?code=`, `?coches=`, `?marker=`, `?reve=`, `?qui=`,
 * `?lieu=`, `?invites=`, `?op=`, `?vue=`. Le lien, c'est le ticket.
 */

export default function LaCaisse() {
  const t = useLEtatDuTicket();

  return (
    <main
      data-page="ticket"
      data-code={t.code}
      data-cochees={t.coches.length}
      data-total={t.total}
      data-marker={t.laCouleur.id}
      data-face={t.face}
      data-opérations={t.opérations.length}
      style={{ ['--vp-fluo' as string]: t.laCouleur.couleur }}
      className="min-h-svh bg-white text-[color:var(--vp-ink)]"
    >
      {/* **AU DÉBUT, UN CHAMP.** « Au début juste un champ de saisie avec un
          agent agentic » : on écrit ce qu'on veut, et l'agent écrit le reste. */}
      <LeChampDuTicket
        prises={t.coches}
        combienDOpérations={t.opérations.length}
        surGénération={t.recevoirLaGénération}
        surOpération={t.recevoirLOpération}
        surFace={t.setFace}
      />

      {/* **ET LE TICKET.** Le papier est la page, et l'on scrolle dedans. */}
      <LeTicketPleinEcran
        code={t.code}
        numero={t.numero}
        dateLabel={t.dateLabel}
        heure={t.heure}
        couple={t.couple}
        coches={t.coches}
        surCocher={t.cocher}
        totaux={t.totaux}
        portefeuilles={t.portefeuilles}
        rêve={t.rêve}
        budget={t.budget}
        payé={t.payé}
        surPayer={t.basculerLePaiement}
        marker={t.laCouleur}
        surMarker={t.setMarker}
        frappe={t.ligneEnCours ? { mot: t.ligneEnCours.mot, pas: t.pas } : null}
        face={t.face}
        surFace={t.setFace}
        opérations={t.opérations}
        signature={t.signature}
      />
    </main>
  );
}
