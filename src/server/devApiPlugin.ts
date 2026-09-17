import type { Plugin, ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';

interface StorageData {
  wedding_sites: any[];
  site_sections: any[];
  programme: any[];
  infos: any[];
  gallery: any[];
  faqs: any[];
  rsvp_events: any[];
  rsvp_responses: any[];
  gifts: any[];
  media_assets: any[];
}

const DB_FILE = path.resolve(process.cwd(), '.wedding-db.json');

const DEFAULT_MEDIA_ASSETS = [
  { id: 1, category: 'Couple', title: 'Flânerie parisienne', url: '/images/couple-paris.jpg', collection: 'Editorial Paris', kind: 'photo', orientation: 'landscape' },
  { id: 2, category: 'Couple', title: 'Grand jour au château', url: '/images/hero-wedding.jpg', collection: 'Editorial Paris', kind: 'photo', orientation: 'portrait' },
  { id: 3, category: 'Couple', title: 'Complicité intemporelle', url: '/images/noir-blanc.jpg', collection: 'Black Tie', kind: 'photo', orientation: 'portrait' },
  { id: 4, category: 'Danse', title: 'Première danse étincelante', url: '/images/danse.jpg', collection: 'Modern Romance', kind: 'photo', orientation: 'landscape' },
  { id: 5, category: 'Alliances', title: 'Promesse d’or pur', url: '/images/alliances.jpg', collection: 'Château', kind: 'photo', orientation: 'landscape' },
  { id: 6, category: 'Bouquet', title: 'Roses poudrées & pivoines', url: '/images/bouquet.jpg', collection: 'Garden Wedding', kind: 'photo', orientation: 'portrait' },
  { id: 7, category: 'Château', title: 'Façade historique & fontaine', url: '/images/chateau.jpg', collection: 'Château', kind: 'photo', orientation: 'landscape' },
  { id: 8, category: 'Table', title: 'Table d’honneur aux bougies', url: '/images/table-noir.jpg', collection: 'Black Tie', kind: 'photo', orientation: 'landscape' },
  { id: 9, category: 'Cérémonie', title: 'Jardins de Provence', url: '/images/garden.jpg', collection: 'Garden Wedding', kind: 'photo', orientation: 'landscape' },
  { id: 10, category: 'Nature', title: 'Terrasse sur la Méditerranée', url: '/images/terrasse.jpg', collection: "Côte d'Azur", kind: 'photo', orientation: 'landscape' },
  { id: 11, category: 'Champagne', title: 'Toast d’exception', url: '/images/champagne.jpg', collection: 'Black Tie', kind: 'photo', orientation: 'landscape' },
  { id: 12, category: 'Fleurs', title: 'Composition champêtre', url: '/images/bouquet.jpg', collection: 'Garden Wedding', kind: 'photo', orientation: 'portrait' },
  { id: 13, category: 'Architecture', title: 'Péristyle du domaine', url: '/images/chateau.jpg', collection: 'Château', kind: 'photo', orientation: 'landscape' },
  { id: 14, category: 'Décoration', title: 'Ambiance feutrée', url: '/images/table-noir.jpg', collection: 'Black Tie', kind: 'photo', orientation: 'landscape' },
];

function getInitialData(): StorageData {
  return {
    wedding_sites: [
      {
        id: 1,
        slug: 'matt-marie',
        partner1: 'Marie',
        partner2: 'Matt',
        wedding_date: '2027-07-18',
        venue: 'Château de Chantilly',
        city: 'Chantilly, Oise',
        style: 'editorial',
        phase: 'avant',
        typography: 'editorial',
        accent_color: '#8A6D4B',
        button_style: 'pill',
        shape: 'soft',
        layout: 'magazine',
        animation_level: 'fluide',
        hero_photo: '/images/hero-wedding.jpg',
        hero_title: 'Marie & Matt',
        hero_subtitle: 'Nous nous marions',
        story_title: 'Tout a commencé par un regard',
        story_text: 'C’est une histoire comme on les aime : une rencontre imprévue sur les quais de Seine, un éclat de rire partagé, puis une évidence qui ne s’est plus jamais démentie.\n\nSept ans, des dizaines de voyages et un millier de souvenirs plus tard, nous avons choisi de réunir celles et ceux qui comptent le plus pour célébrer notre amour et débuter ce nouveau chapitre ensemble.',
        story_photo: '/images/couple-paris.jpg',
        announcement: 'Nous avons hâte de vous retrouver le 18 Juillet 2027.',
        contact_email: 'mariage@marie-matt.fr',
        contact_phone: '06 12 34 56 78',
        published: true,
        created_at: new Date().toISOString(),
      },
    ],
    site_sections: [
      { id: 1, site_id: 1, section_key: 'hero', title: 'Accueil', visible: true, position: 0 },
      { id: 2, site_id: 1, section_key: 'histoire', title: 'Notre histoire', visible: true, position: 1 },
      { id: 3, site_id: 1, section_key: 'programme', title: 'Programme', visible: true, position: 2 },
      { id: 4, site_id: 1, section_key: 'lieux', title: 'Lieux', visible: true, position: 3 },
      { id: 5, site_id: 1, section_key: 'infos', title: 'Infos pratiques', visible: true, position: 4 },
      { id: 6, site_id: 1, section_key: 'rsvp', title: 'RSVP', visible: true, position: 5 },
      { id: 7, site_id: 1, section_key: 'cagnotte', title: 'Cagnotte', visible: true, position: 6 },
      { id: 8, site_id: 1, section_key: 'galerie', title: 'Galerie', visible: true, position: 7 },
      { id: 9, site_id: 1, section_key: 'faq', title: 'FAQ', visible: true, position: 8 },
      { id: 10, site_id: 1, section_key: 'contact', title: 'Contact', visible: true, position: 9 },
      { id: 11, site_id: 1, section_key: 'footer', title: 'Pied de page', visible: true, position: 10 },
    ],
    programme: [
      { id: 1, site_id: 1, event_time: '14:30', title: 'Cérémonie Laïque', description: 'Échange des vœux et des alliances dans le parterre anglais du château.', place: 'Jardins du Château', icon: 'clock', position: 0 },
      { id: 2, site_id: 1, event_time: '16:00', title: 'Cocktail & Champagne', description: 'Coupes fraîches, pièces cocktails créatives et musique acoustique en plein air.', place: 'Terrasse du Grand Bassin', icon: 'clock', position: 1 },
      { id: 3, site_id: 1, event_time: '19:00', title: 'Dîner Gastronomique', description: 'Dîner assis sous la verrière d’époque, discours complices et surprises.', place: 'Galerie des Cerfs', icon: 'clock', position: 2 },
      { id: 4, site_id: 1, event_time: '21:30', title: 'Ouverture du Bal', description: 'La première danse sous les lustres de cristal, puis à tous les invités.', place: 'Salon d’Honneur', icon: 'clock', position: 3 },
      { id: 5, site_id: 1, event_time: '23:30', title: 'Soirée Dansante', description: 'DJ set live, bar à cocktails signature et danse jusqu’au petit matin.', place: 'L’Orangerie', icon: 'clock', position: 4 },
    ],
    infos: [
      { id: 1, site_id: 1, category: 'Cérémonie', title: 'Château de Chantilly', detail: '60500 Chantilly. Arrivée recommandée à 14h00 pour vous installer sereinement.', event_time: '14:30', link_label: 'Voir l’itinéraire', position: 0 },
      { id: 2, site_id: 1, category: 'Réception', title: 'L’Orangerie du Domaine', detail: 'Accès direct depuis le parc du château. Fléchage prévu pour les invités.', event_time: '16:00', link_label: 'Voir l’itinéraire', position: 1 },
      { id: 3, site_id: 1, category: 'Parking', title: 'Parking Privé P1', detail: 'Parking gratuit et gardé réservé à nos invités à l’entrée du domaine.', event_time: '', link_label: '', position: 2 },
      { id: 4, site_id: 1, category: 'Hébergements', title: 'Où dormir ?', detail: 'L’Auberge du Jeu de Paume et l’Hôtel Mercure sont à 5 min. Mentionnez le mariage MARIE & MATT.', event_time: '', link_label: 'En savoir plus', position: 3 },
      { id: 5, site_id: 1, category: 'Dress code', title: 'Élégance Estivale', detail: 'Robes cocktail ou longues, costumes sombres. Privilégiez des talons stables pour les pelouses.', event_time: '', link_label: '', position: 4 },
      { id: 6, site_id: 1, category: 'Navettes', title: 'Navettes Nocturnes', detail: 'Navettes vers Paris Nord et les hôtels partenaires de 01h00 à 04h30.', event_time: '01:00', link_label: '', position: 5 },
    ],
    gallery: [
      { id: 1, site_id: 1, url: '/images/couple-paris.jpg', caption: 'Sur les quais de Seine', position: 0, is_private: false },
      { id: 2, site_id: 1, url: '/images/hero-wedding.jpg', caption: 'L’élégance du grand jour', position: 1, is_private: false },
      { id: 3, site_id: 1, url: '/images/alliances.jpg', caption: 'La promesse', position: 2, is_private: false },
      { id: 4, site_id: 1, url: '/images/bouquet.jpg', caption: 'Roses anciennes & pivoines', position: 3, is_private: false },
      { id: 5, site_id: 1, url: '/images/chateau.jpg', caption: 'Le Château de Chantilly', position: 4, is_private: false },
      { id: 6, site_id: 1, url: '/images/table-noir.jpg', caption: 'Détails de table & bougies', position: 5, is_private: false },
      { id: 7, site_id: 1, url: '/images/danse.jpg', caption: 'Sous les étoiles', position: 6, is_private: false },
      { id: 8, site_id: 1, url: '/images/champagne.jpg', caption: 'À l’amour', position: 7, is_private: false },
    ],
    faqs: [
      { id: 1, site_id: 1, question: 'Comment venir au Château ?', answer: 'En train direct depuis Paris Gare du Nord (25 min jusqu’à Chantilly-Gouvieux, puis navette de 5 min). En voiture via l’autoroute A1, sortie 7 Chantilly (environ 45 minutes de Paris).', position: 0 },
      { id: 2, site_id: 1, question: 'Où se loger à proximité ?', answer: 'Nous avons négocié un tarif spécial à l’Auberge du Jeu de Paume et à l’Hôtel Mercure Chantilly avec le code promo MARIE&MATT2027. Pensez à réserver avant le 1er mai.', position: 1 },
      { id: 3, site_id: 1, question: 'Y a-t-il un dress code précis ?', answer: 'Tenue cocktail chic estivale ! Pour les dames, prévoyez des talons carrés ou des embouts pour la cérémonie sur pelouse.', position: 2 },
      { id: 4, site_id: 1, question: 'Les enfants sont-ils conviés ?', answer: 'Pour que tous les invités profitent au maximum de la soirée festive, le dîner et la soirée dansante sont réservés aux adultes. Un service de baby-sitting certifié peut être coordonné avec les hôtels.', position: 3 },
      { id: 5, site_id: 1, question: 'Un brunch est-il prévu le lendemain ?', answer: 'Absolument ! Nous vous donnons rendez-vous le dimanche à partir de 11h30 pour un brunch décontracté au bord de l’eau au domaine.', position: 4 },
      { id: 6, site_id: 1, question: 'Jusqu’à quelle heure pourrons-nous danser ?', answer: 'La musique se poursuivra jusqu’à 05h00 du matin ! Des viennoiseries chaudes et cafés seront servis aux plus noctambules.', position: 5 },
    ],
    rsvp_events: [
      { id: 1, site_id: 1, name: 'Cérémonie & Cocktail', description: '14:30 - 18:30', position: 0 },
      { id: 2, site_id: 1, name: 'Dîner & Soirée', description: '19:00 - 05:00', position: 1 },
      { id: 3, site_id: 1, name: 'Brunch du lendemain', description: 'Dimanche 11:30', position: 2 },
    ],
    rsvp_responses: [
      {
        id: 1, site_id: 1, first_name: 'Camille', last_name: 'Laurent', email: 'camille.laurent@example.com',
        attending: true, guests_count: 2, children_count: 0, diet: 'Sans porc', allergies: '',
        housing: 'Auberge du Jeu de Paume', transport: 'Voiture', message: 'Tellement heureux pour vous deux ! Nous avons hâte d’y être.',
        events: ['Cérémonie & Cocktail', 'Dîner & Soirée', 'Brunch du lendemain'], created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 2, site_id: 1, first_name: 'Thomas', last_name: 'Dubois', email: 'thomas.dubois@example.com',
        attending: true, guests_count: 1, children_count: 0, diet: 'Végétarien', allergies: 'Arachides',
        housing: 'Hôtel Mercure', transport: 'Train', message: 'Toutes mes félicitations ! Comptez sur moi sur la piste de danse.',
        events: ['Cérémonie & Cocktail', 'Dîner & Soirée'], created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 3, site_id: 1, first_name: 'Élodie', last_name: 'Moreau', email: 'elodie.m@example.com',
        attending: false, guests_count: 0, children_count: 0, diet: '', allergies: '',
        housing: '', transport: '', message: 'Toutes mes pensées affectueuses, retenue à l’étranger ce week-end là. Vous serez magnifiques !',
        events: [], created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
    ],
    gifts: [
      { id: 1, site_id: 1, gift_type: 'Voyage de noces', title: 'Notre lune de miel au Japon', description: 'Une escapade poétique entre Tokyo, les temples millénaires de Kyoto et les sources chaudes de Hakone.', goal_amount: 6000, current_amount: 3850, position: 0 },
      { id: 2, site_id: 1, gift_type: 'Participation libre', title: 'Cagnotte des mariés', description: 'Chaque attention nous va droit au cœur pour accompagner nos futurs projets d’amoureux.', goal_amount: 0, current_amount: 1450, position: 1 },
    ],
    media_assets: DEFAULT_MEDIA_ASSETS,
  };
}

class LocalDatabase {
  private data: StorageData;

  constructor() {
    this.data = this.load();
  }

  private load(): StorageData {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.wedding_sites && parsed.wedding_sites.length > 0) {
          if (!parsed.media_assets || parsed.media_assets.length === 0) {
            parsed.media_assets = DEFAULT_MEDIA_ASSETS;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[DB] Failed to load db file, initializing defaults', e);
    }
    const initial = getInitialData();
    this.save(initial);
    return initial;
  }

  private save(dataToSave?: StorageData) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('[DB] Failed to save DB to file', e);
    }
  }

  public getData(): StorageData {
    return this.data;
  }

  public commit() {
    this.save(this.data);
  }

  public nextId(collection: keyof StorageData): number {
    const list = this.data[collection] as any[];
    if (!list || list.length === 0) return 1;
    const max = Math.max(...list.map((x) => (typeof x.id === 'number' ? x.id : 0)));
    return max + 1;
  }
}

export function devApiPlugin(): Plugin {
  const db = new LocalDatabase();

  return {
    name: 'wedding-dev-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const urlStr = req.url || '';
        if (!urlStr.startsWith('/api/')) {
          return next();
        }

        const parsedUrl = new URL(urlStr, 'http://localhost');
        const pathname = parsedUrl.pathname;
        const query: Record<string, string> = {};
        parsedUrl.searchParams.forEach((v, k) => { query[k] = v; });

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          return res.end();
        }

        const readBody = (): Promise<any> => {
          return new Promise((resolve) => {
            let body = '';
            req.on('data', (chunk) => { body += chunk; });
            req.on('end', () => {
              try {
                resolve(body ? JSON.parse(body) : {});
              } catch {
                resolve({});
              }
            });
          });
        };

        const json = (data: any, status = 200) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };

        const error = (msg: string, status = 400) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: msg }));
        };

        const store = db.getData();

        try {
          // 1. /api/wedding-sites
          if (pathname === '/api/wedding-sites') {
            if (req.method === 'GET') {
              if (query.slug) {
                const site = store.wedding_sites.find((s) => s.slug === query.slug);
                if (!site) return error('Site introuvable', 404);
                return json(site);
              }
              if (query.id) {
                const site = store.wedding_sites.find((s) => String(s.id) === String(query.id));
                if (!site) return error('Site introuvable', 404);
                return json(site);
              }
              return json(store.wedding_sites);
            }
            if (req.method === 'POST') {
              const body = await readBody();
              const newSite = {
                id: db.nextId('wedding_sites'),
                ...body,
                created_at: new Date().toISOString(),
              };
              store.wedding_sites.push(newSite);
              db.commit();
              return json(newSite, 201);
            }
            if (req.method === 'PUT') {
              const body = await readBody();
              const { id, ...patch } = body;
              const idx = store.wedding_sites.findIndex((s) => String(s.id) === String(id));
              if (idx === -1) return error('Site introuvable', 404);
              store.wedding_sites[idx] = { ...store.wedding_sites[idx], ...patch };
              db.commit();
              return json(store.wedding_sites[idx]);
            }
            if (req.method === 'DELETE') {
              const body = await readBody();
              store.wedding_sites = store.wedding_sites.filter((s) => String(s.id) !== String(body.id));
              db.commit();
              return json({ ok: true });
            }
          }

          // 2. Generic table handler for child collections
          const tableMap: Record<string, keyof StorageData> = {
            '/api/site-sections': 'site_sections',
            '/api/programme': 'programme',
            '/api/infos': 'infos',
            '/api/gallery': 'gallery',
            '/api/faqs': 'faqs',
            '/api/rsvp-events': 'rsvp_events',
            '/api/rsvp': 'rsvp_responses',
            '/api/gifts': 'gifts',
          };

          if (tableMap[pathname]) {
            const tableKey = tableMap[pathname];
            const list = store[tableKey] as any[];

            if (req.method === 'GET') {
              let results = [...list];
              if (query.site_id) {
                results = results.filter((item) => String(item.site_id) === String(query.site_id));
              }
              if (tableKey === 'site_sections' || tableKey === 'programme' || tableKey === 'infos' || tableKey === 'gallery' || tableKey === 'faqs' || tableKey === 'rsvp_events' || tableKey === 'gifts') {
                results.sort((a, b) => (Number(a.position) || 0) - (Number(b.position) || 0));
              } else if (tableKey === 'rsvp_responses') {
                results.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
              }
              return json(results);
            }

            if (req.method === 'POST') {
              const body = await readBody();
              const newItem = {
                id: db.nextId(tableKey),
                ...body,
                created_at: new Date().toISOString(),
              };
              list.push(newItem);
              db.commit();
              return json(newItem, 201);
            }

            if (req.method === 'PUT') {
              const body = await readBody();
              const { id, ...patch } = body;
              const idx = list.findIndex((x) => String(x.id) === String(id));
              if (idx === -1) return error('Élément introuvable', 404);
              list[idx] = { ...list[idx], ...patch };
              db.commit();
              return json(list[idx]);
            }

            if (req.method === 'DELETE') {
              const body = await readBody();
              const filtered = list.filter((x) => String(x.id) !== String(body.id));
              (store as any)[tableKey] = filtered;
              db.commit();
              return json({ ok: true });
            }
          }

          // 3. /api/media
          if (pathname === '/api/media') {
            if (req.method === 'GET') {
              let mediaList = [...store.media_assets];
              if (query.category && query.category !== 'Tout') {
                mediaList = mediaList.filter((m) => m.category === query.category);
              }
              if (query.collection && query.collection !== 'Toutes') {
                mediaList = mediaList.filter((m) => m.collection === query.collection);
              }
              return json(mediaList);
            }
            if (req.method === 'POST') {
              const body = await readBody();
              const newAsset = {
                id: db.nextId('media_assets'),
                ...body,
              };
              store.media_assets.push(newAsset);
              db.commit();
              return json(newAsset, 201);
            }
            if (req.method === 'DELETE') {
              const body = await readBody();
              store.media_assets = store.media_assets.filter((m) => String(m.id) !== String(body.id));
              db.commit();
              return json({ ok: true });
            }
          }

          // 4. /api/upload
          if (pathname === '/api/upload') {
            if (req.method === 'POST') {
              const body = await readBody();
              const { fileName, fileBase64, contentType: _contentType } = body;
              if (!fileBase64) return error('Données manquantes', 400);

              const safeName = `${Date.now()}-${String(fileName || 'photo.jpg')}`.replace(/[^a-zA-Z0-9._-]/g, '_');
              const uploadsDir = path.resolve(process.cwd(), 'public/uploads');
              if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
              }
              const filePath = path.join(uploadsDir, safeName);
              const buffer = Buffer.from(fileBase64, 'base64');
              fs.writeFileSync(filePath, buffer);

              const publicUrl = `/uploads/${safeName}`;

              // Also auto-add to media assets
              const newAsset = {
                id: db.nextId('media_assets'),
                category: 'Importés',
                title: fileName ? fileName.replace(/\.[^.]+$/, '') : 'Photo importée',
                url: publicUrl,
                collection: 'Mes photos',
                kind: 'photo',
                orientation: 'landscape',
              };
              store.media_assets.unshift(newAsset);
              db.commit();

              return json({ url: publicUrl }, 200);
            }
          }

          return error('Non trouvé', 404);
        } catch (err: any) {
          console.error('[API Error]', err);
          return error(err?.message || 'Erreur interne', 500);
        }
      });
    },
  };
}
