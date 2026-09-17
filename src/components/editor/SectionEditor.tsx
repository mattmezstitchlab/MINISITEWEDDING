import { useState } from 'react';
import { Images, Trash2 } from 'lucide-react';
import type {
  WeddingSite, ProgrammeEvent, InfoPratique, GalleryPhoto, Faq, RsvpEvent, GiftOption,
} from '../../lib/types';
import { apiSend } from '../../lib/http';
import { fontsFor } from '../../lib/weddingStyles';
import { AddRowButton, DeleteIconButton, DeleteLink, RowCard, TextField } from './Row';
import { fieldCls, labelCls, useDraftRow } from './draft';

/** Ce dont les panneaux d’édition ont besoin, fourni par la page éditeur. */
export interface EditorContext {
  site: WeddingSite;
  programme: ProgrammeEvent[];
  infos: InfoPratique[];
  gallery: GalleryPhoto[];
  faqs: Faq[];
  rsvpEvents: RsvpEvent[];
  gifts: GiftOption[];
  patchSite: (patch: Partial<WeddingSite>) => void;
  refresh: () => void;
  openMedia: (cb: (url: string) => void, title: string) => void;
  notify: (msg: string) => void;
}

type SaveFn = (fn: () => Promise<unknown>, msg?: string) => Promise<void>;

function PhotoField({ label, value, onPick, openMedia }: { label: string; value: string; onPick: (url: string) => void; openMedia: EditorContext['openMedia'] }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <button onClick={() => openMedia(onPick, label)} className="vp-press group relative aspect-[16/10] w-full overflow-hidden rounded-[12px] border border-black/8 bg-[#F5F5F7]">
        {value ? <img src={value} alt={label} className="h-full w-full object-cover" /> : <span className="text-sm font-medium text-[var(--vp-muted)]">Choisir une photo</span>}
        <span className="absolute inset-0 flex items-center justify-center bg-[#05060C]/0 transition group-hover:bg-[#05060C]/35">
          <span className="rounded-full bg-[var(--vp-accent)] px-4 py-2 text-[13px] font-semibold text-white opacity-0 transition group-hover:opacity-100">Choisir dans la bibliothèque</span>
        </span>
      </button>
    </div>
  );
}

function ProgRow({ p, save }: { p: ProgrammeEvent; save: SaveFn }) {
  const { draft, set } = useDraftRow(p);
  const put = (patch: Partial<ProgrammeEvent>, msg: string) => save(() => apiSend('/api/programme', 'PUT', { id: p.id, ...patch }), msg);

  return (
    <RowCard>
      <div className="grid grid-cols-[86px_1fr] gap-2">
        <TextField value={draft.event_time} saved={p.event_time} onChange={(v) => set('event_time', v)} onCommit={() => put({ event_time: draft.event_time }, 'Heure mise à jour')} />
        <TextField value={draft.title} saved={p.title} onChange={(v) => set('title', v)} onCommit={() => put({ title: draft.title }, 'Titre mis à jour')} />
      </div>
      <TextField value={draft.description || ''} saved={p.description || ''} placeholder="Description" onChange={(v) => set('description', v)} onCommit={() => put({ description: draft.description }, 'Description mise à jour')} />
      <div className="flex gap-2">
        <TextField value={draft.place || ''} saved={p.place || ''} placeholder="Lieu" onChange={(v) => set('place', v)} onCommit={() => put({ place: draft.place }, 'Lieu mis à jour')} />
        <DeleteIconButton onClick={() => save(() => apiSend('/api/programme', 'DELETE', { id: p.id }), 'Moment supprimé')} />
      </div>
    </RowCard>
  );
}

function InfoRow({ inf, save }: { inf: InfoPratique; save: SaveFn }) {
  const { draft, set } = useDraftRow(inf);
  const put = (patch: Partial<InfoPratique>, msg: string) => save(() => apiSend('/api/infos', 'PUT', { id: inf.id, ...patch }), msg);

  return (
    <RowCard>
      <div className="grid grid-cols-[1fr_76px] gap-2">
        <TextField value={draft.category} saved={inf.category} onChange={(v) => set('category', v)} onCommit={() => put({ category: draft.category }, 'Catégorie mise à jour')} />
        <TextField value={draft.event_time || ''} saved={inf.event_time || ''} placeholder="Heure" onChange={(v) => set('event_time', v)} onCommit={() => put({ event_time: draft.event_time }, 'Heure mise à jour')} />
      </div>
      <TextField value={draft.title} saved={inf.title} onChange={(v) => set('title', v)} onCommit={() => put({ title: draft.title }, 'Titre mis à jour')} />
      <TextField rows={2} value={draft.detail || ''} saved={inf.detail || ''} onChange={(v) => set('detail', v)} onCommit={() => put({ detail: draft.detail }, 'Détail mis à jour')} />
      <DeleteLink onClick={() => save(() => apiSend('/api/infos', 'DELETE', { id: inf.id }), 'Carte supprimée')}>Supprimer cette carte</DeleteLink>
    </RowCard>
  );
}

function RsvpEventRow({ ev, save }: { ev: RsvpEvent; save: SaveFn }) {
  const { draft, set } = useDraftRow(ev);

  return (
    <div className="flex gap-2">
      <TextField
        value={draft.name}
        saved={ev.name}
        onChange={(v) => set('name', v)}
        onCommit={() => save(() => apiSend('/api/rsvp-events', 'PUT', { id: ev.id, name: draft.name }), 'Événement mis à jour')}
      />
      <DeleteIconButton onClick={() => save(() => apiSend('/api/rsvp-events', 'DELETE', { id: ev.id }), 'Événement supprimé')} />
    </div>
  );
}

function GiftRow({ g, save }: { g: GiftOption; save: SaveFn }) {
  const { draft, set } = useDraftRow({
    ...g,
    goal: String(Number(g.goal_amount) || 0),
    current: String(Number(g.current_amount) || 0),
  });
  const put = (patch: Partial<GiftOption>, msg: string) => save(() => apiSend('/api/gifts', 'PUT', { id: g.id, ...patch }), msg);

  return (
    <RowCard>
      <TextField value={draft.gift_type} saved={g.gift_type} onChange={(v) => set('gift_type', v)} onCommit={() => put({ gift_type: draft.gift_type }, 'Type mis à jour')} />
      <TextField value={draft.title} saved={g.title} onChange={(v) => set('title', v)} onCommit={() => put({ title: draft.title }, 'Titre mis à jour')} />
      <TextField rows={2} value={draft.description || ''} saved={g.description || ''} onChange={(v) => set('description', v)} onCommit={() => put({ description: draft.description }, 'Description mise à jour')} />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <TextField
            label="Objectif (€)" type="number" value={draft.goal} saved={String(Number(g.goal_amount) || 0)}
            onChange={(v) => set('goal', v)} onCommit={() => put({ goal_amount: Number(draft.goal) || 0 }, 'Objectif mis à jour')}
          />
        </div>
        <div>
          <TextField
            label="Collecté (€)" type="number" value={draft.current} saved={String(Number(g.current_amount) || 0)}
            onChange={(v) => set('current', v)} onCommit={() => put({ current_amount: Number(draft.current) || 0 }, 'Montant mis à jour')}
          />
        </div>
      </div>
      <DeleteLink onClick={() => save(() => apiSend('/api/gifts', 'DELETE', { id: g.id }), 'Cagnotte supprimée')} />
    </RowCard>
  );
}

function FaqRow({ f, save }: { f: Faq; save: SaveFn }) {
  const { draft, set } = useDraftRow(f);
  const put = (patch: Partial<Faq>, msg: string) => save(() => apiSend('/api/faqs', 'PUT', { id: f.id, ...patch }), msg);

  return (
    <RowCard>
      <TextField value={draft.question} saved={f.question} onChange={(v) => set('question', v)} onCommit={() => put({ question: draft.question }, 'Question mise à jour')} />
      <TextField rows={2} value={draft.answer} saved={f.answer} onChange={(v) => set('answer', v)} onCommit={() => put({ answer: draft.answer }, 'Réponse mise à jour')} />
      <DeleteLink onClick={() => save(() => apiSend('/api/faqs', 'DELETE', { id: f.id }), 'Question supprimée')} />
    </RowCard>
  );
}

/** Panneau de droite : les champs de la section sélectionnée. */
export default function SectionEditor({ sectionKey, ctx }: { sectionKey: string; ctx: EditorContext }) {
  const { site, patchSite, refresh, openMedia, notify } = ctx;
  const [busy, setBusy] = useState(false);
  const heroFonts = fontsFor(site.typography);

  const save: SaveFn = async (fn, msg = 'Enregistré') => {
    setBusy(true);
    try { await fn(); refresh(); notify(msg); } catch { notify('Une erreur est survenue'); } finally { setBusy(false); }
  };

  if (sectionKey === 'hero') {
    return (
      <div className="space-y-5">
        <PhotoField label="Photo du Hero" value={site.hero_photo} onPick={(url) => patchSite({ hero_photo: url })} openMedia={openMedia} />
        <div>
          <label className={labelCls}>Titre principal</label>
          <input
            className={fieldCls}
            value={site.hero_title}
            onChange={(e) => patchSite({ hero_title: e.target.value })}
            style={{ fontFamily: heroFonts.heading, fontWeight: heroFonts.weight, fontSize: '1.25rem', letterSpacing: '-0.02em' }}
          />
        </div>
        <div><label className={labelCls}>Sur-titre</label><input className={fieldCls} value={site.hero_subtitle} onChange={(e) => patchSite({ hero_subtitle: e.target.value })} /></div>
        <div><label className={labelCls}>Phrase d’accueil</label><input className={fieldCls} value={site.announcement} onChange={(e) => patchSite({ announcement: e.target.value })} /></div>
        <p className="vp-caption !text-[12px]">La photo occupe tout l’écran, le compte à rebours se calcule seul depuis votre date.</p>
      </div>
    );
  }

  if (sectionKey === 'histoire') {
    return (
      <div className="space-y-5">
        <div><label className={labelCls}>Titre</label><input className={fieldCls} value={site.story_title} onChange={(e) => patchSite({ story_title: e.target.value })} /></div>
        <div><label className={labelCls}>Votre histoire</label><textarea rows={7} className={fieldCls} value={site.story_text} onChange={(e) => patchSite({ story_text: e.target.value })} /></div>
        <PhotoField label="Photo" value={site.story_photo} onPick={(url) => patchSite({ story_photo: url })} openMedia={openMedia} />
      </div>
    );
  }

  if (sectionKey === 'programme') {
    return (
      <div className="space-y-3">
        {ctx.programme.map((p) => <ProgRow key={p.id} p={p} save={save} />)}
        <AddRowButton
          disabled={busy}
          onClick={() => save(() => apiSend('/api/programme', 'POST', { site_id: site.id, event_time: '12:00', title: 'Nouveau moment', description: '', place: '', icon: 'clock', position: ctx.programme.length }), 'Moment ajouté')}
        >
          Ajouter un moment
        </AddRowButton>
      </div>
    );
  }

  if (sectionKey === 'lieux') {
    return (
      <div className="space-y-5">
        <div><label className={labelCls}>Lieu</label><input className={fieldCls} value={site.venue} onChange={(e) => patchSite({ venue: e.target.value })} /></div>
        <div><label className={labelCls}>Ville</label><input className={fieldCls} value={site.city} onChange={(e) => patchSite({ city: e.target.value })} /></div>
        <p className="vp-caption !text-[12px]">Les boutons « Voir l’itinéraire » ouvrent Google Maps avec ces adresses.</p>
      </div>
    );
  }

  if (sectionKey === 'infos') {
    return (
      <div className="space-y-3">
        {ctx.infos.map((inf) => <InfoRow key={inf.id} inf={inf} save={save} />)}
        <AddRowButton
          disabled={busy}
          onClick={() => save(() => apiSend('/api/infos', 'POST', { site_id: site.id, category: 'Nouveau', title: 'Nouvelle information', detail: '', event_time: '', link_label: '', position: ctx.infos.length }), 'Carte ajoutée')}
        >
          Ajouter une carte
        </AddRowButton>
      </div>
    );
  }

  if (sectionKey === 'rsvp') {
    return (
      <div className="space-y-3">
        <p className="vp-caption !text-[13px] leading-relaxed">Les invités indiquent présence, convives, régimes, hébergement et message. Choisissez les moments proposés :</p>
        {ctx.rsvpEvents.map((ev) => <RsvpEventRow key={ev.id} ev={ev} save={save} />)}
        <AddRowButton
          disabled={busy}
          onClick={() => save(() => apiSend('/api/rsvp-events', 'POST', { site_id: site.id, name: 'Nouvel événement', description: '', position: ctx.rsvpEvents.length }), 'Événement ajouté')}
        >
          Ajouter un événement
        </AddRowButton>
      </div>
    );
  }

  if (sectionKey === 'cagnotte') {
    return (
      <div className="space-y-3">
        {ctx.gifts.map((g) => <GiftRow key={g.id} g={g} save={save} />)}
        <AddRowButton
          disabled={busy}
          onClick={() => save(() => apiSend('/api/gifts', 'POST', { site_id: site.id, gift_type: 'Cagnotte', title: 'Nouvelle cagnotte', description: '', goal_amount: 0, current_amount: 0, position: ctx.gifts.length }), 'Cagnotte ajoutée')}
        >
          Ajouter une cagnotte
        </AddRowButton>
        <p className="vp-caption !text-[12px]">Les moyens de paiement se connecteront ici — l’architecture est prête.</p>
      </div>
    );
  }

  if (sectionKey === 'galerie') {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2.5">
          {ctx.gallery.map((g) => (
            <div key={g.id} className="group relative aspect-square overflow-hidden rounded-[12px] border border-black/8 bg-[#F5F5F7]">
              <img src={g.url} alt={g.caption || ''} className="w-full h-full object-cover" />
              <button onClick={() => save(() => apiSend('/api/gallery', 'DELETE', { id: g.id }), 'Photo supprimée')} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-xl transition group-hover:opacity-100" aria-label="Supprimer"><Trash2 size={14} /></button>
              {g.is_private && <span className="absolute bottom-2 left-2 rounded-full bg-black/45 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-xl">Privée</span>}
            </div>
          ))}
        </div>
        <button
          onClick={() => openMedia((url) => { save(() => apiSend('/api/gallery', 'POST', { site_id: site.id, url, caption: '', position: ctx.gallery.length, is_private: false }), 'Photo ajoutée'); }, 'Ajouter à la galerie')}
          className="vp-btn vp-press w-full !py-3.5 !text-[14px]"
        >
          <Images size={16} /> Choisir des photos
        </button>
        <p className="vp-caption !text-[12px]">Après le mariage, continuez à publier ici — la galerie devient vos souvenirs.</p>
      </div>
    );
  }

  if (sectionKey === 'faq') {
    return (
      <div className="space-y-3">
        {ctx.faqs.map((f) => <FaqRow key={f.id} f={f} save={save} />)}
        <AddRowButton
          disabled={busy}
          onClick={() => save(() => apiSend('/api/faqs', 'POST', { site_id: site.id, question: 'Nouvelle question ?', answer: 'Votre réponse…', position: ctx.faqs.length }), 'Question ajoutée')}
        >
          Ajouter une question
        </AddRowButton>
      </div>
    );
  }

  if (sectionKey === 'contact') {
    return (
      <div className="space-y-5">
        <div><label className={labelCls}>Email</label><input className={fieldCls} value={site.contact_email || ''} placeholder="nous@exemple.fr" onChange={(e) => patchSite({ contact_email: e.target.value })} /></div>
        <div><label className={labelCls}>Téléphone</label><input className={fieldCls} value={site.contact_phone || ''} placeholder="06 00 00 00 00" onChange={(e) => patchSite({ contact_phone: e.target.value })} /></div>
      </div>
    );
  }

  return <p className="vp-caption !text-[13px]">Le pied de page reprend vos prénoms, la date et la phase du mariage — rien à régler.</p>;
}
