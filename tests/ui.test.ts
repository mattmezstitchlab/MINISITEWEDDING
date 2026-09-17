/**
 * Lot « interface » : ce que l’invité et les mariés voient réellement.
 *
 * Les composants de `src/` sont rendus tels quels (rendu statique React), sans
 * aucune base distante : c’est le mode de fonctionnement par défaut du projet
 * (`VITE_DATA_SOURCE=local` dans le lanceur). On vérifie donc que
 *   - le mini-site complet se compose à partir des données locales ;
 *   - le formulaire RSVP propose bien un envoi direct aux mariés quand aucune
 *     base ne peut recevoir les réponses — et redevient un envoi classique dès
 *     qu’une base est déclarée ;
 *   - le panneau de partage expose la publication par fichier.
 */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import PublicSiteView from '../src/components/PublicSiteView';
import SharePanel from '../src/components/SharePanel';
import { setActiveToken } from '../src/lib/auth';
import { apiSend } from '../src/lib/http';
import { seedSite } from '../src/lib/defaults';
import { loadSiteData } from '../src/lib/siteData';
import { setRemote } from '../src/lib/dataSource';
import { resetDb } from '../src/lib/localStore';
import { MemStorage } from './memStorage';

let pass = 0;
const failures: string[] = [];
function check(label: string, actual: unknown, expected: unknown) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) pass++;
  else failures.push(`${label}\n     attendu: ${JSON.stringify(expected)}\n     reçu   : ${JSON.stringify(actual)}`);
}

const mem = new MemStorage();
(globalThis as { localStorage?: unknown }).localStorage = mem;

/* --------------------------------------------------- un site, sans Supabase */

resetDb();
setActiveToken(null);

const created = await seedSite({
  partner1: 'Sarah', partner2: 'Gabriel', wedding_date: '2027-06-12',
  venue: 'Château de Larris', city: 'Paris', style: 'cinema',
});
setActiveToken(created.editToken);
await apiSend('/api/wedding-sites', 'PUT', {
  id: created.site.id, contact_phone: '+33 6 12 34 56 78', contact_email: 'sarah.et.gabriel@mail.fr',
});

const { data, degraded } = await loadSiteData({ slug: created.site.slug });

check('mini-site local : il se compose entièrement', degraded, false);
check('mini-site local : les mariés sont les bons', [data.site.partner1, data.site.partner2], ['Sarah', 'Gabriel']);

/** Le pied de page contient des liens de navigation : un routeur est requis. */
const rendre = (element: Parameters<typeof createElement>[1], props: Record<string, unknown>) =>
  renderToStaticMarkup(createElement(MemoryRouter, null, createElement(element as never, props)));

const invite = rendre(PublicSiteView, { data });

check('mini-site local : le rendu est complet', invite.length > 20_000, true);
check('mini-site local : la date du mariage est présente', invite.includes('2027'), true);
check('mini-site local : les sections ont leurs ancres', invite.includes('id="sec-programme"') && invite.includes('id="sec-rsvp"'), true);

/* ------------------------------------------- RSVP sans serveur intermédiaire */

check('RSVP autonome : la réponse part en WhatsApp', invite.includes('https://wa.me/33612345678'), true);
check('RSVP autonome : le numéro français est normalisé', invite.includes('wa.me/0'), false);
check('RSVP autonome : la réponse part aussi par e-mail', invite.includes('mailto:sarah.et.gabriel@mail.fr'), true);
check('RSVP autonome : l’invité peut copier sa réponse', invite.includes('Copier ma réponse'), true);
check('RSVP autonome : rien n’est annoncé comme suspendu', invite.includes('Réponses suspendues'), false);
check('RSVP autonome : aucun envoi vers une base absente', invite.includes('Envoyer ma réponse'), false);

setRemote(true);
const distant = rendre(PublicSiteView, { data });
check('RSVP avec base : l’envoi classique revient', distant.includes('Envoyer ma réponse'), true);
check('RSVP avec base : plus de relais WhatsApp', distant.includes('wa.me/'), false);
setRemote(false);

/* ------------------------------------------------------ publier pour partager */

const partage = rendre(SharePanel, { site: data.site, data, onPublishedChange: () => undefined });

check('Partage : la publication est expliquée', partage.includes('Publier pour vos invités'), true);
check('Partage : le dossier de dépôt est indiqué', partage.includes('public/sites/'), true);
check('Partage : le nom de fichier attendu est donné', partage.includes(`${created.site.slug}.json`), true);

/* ------------------------------------------------------------------- bilan */

if (failures.length > 0) {
  console.error(`\n✗ Interface — ${failures.length} échec(s) :\n`);
  for (const f of failures) console.error(`   • ${f}\n`);
  process.exitCode = 1;
} else {
  console.log(`\n✓ Interface — ${pass} vérifications réussies, 0 échec(s)\n`);
}

// framer-motion laisse une boucle d’animation ouverte après un rendu serveur :
// sans cela, Node attendrait un handle qui ne se referme jamais.
process.exit(failures.length > 0 ? 1 : 0);
