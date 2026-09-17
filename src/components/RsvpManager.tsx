import { useEffect, useState } from 'react';
import { Users, Check, X, Baby, Mail, Trash2, RefreshCw, UtensilsCrossed } from 'lucide-react';
import type { RsvpResponse, RsvpEvent } from '../lib/types';
import { apiGet, apiSend } from '../lib/api';

interface Props {
  siteId: number;
  events: RsvpEvent[];
  refreshKey: number;
}

export default function RsvpManager({ siteId, events, refreshKey }: Props) {
  const [responses, setResponses] = useState<RsvpResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const data = await apiGet<RsvpResponse[]>(`/api/rsvp?site_id=${siteId}`);
      setResponses(data);
    } catch { setResponses([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, [siteId, refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const present = responses.filter((r) => r.attending);
  const absent = responses.filter((r) => !r.attending);
  const persons = present.reduce((s, r) => s + (Number(r.guests_count) || 0), 0);
  const children = present.reduce((s, r) => s + (Number(r.children_count) || 0), 0);
  const rate = responses.length === 0 ? 0 : Math.round((present.length / responses.length) * 100);

  const remove = async (id: number) => {
    if (!confirm('Supprimer cette réponse ?')) return;
    await apiSend('/api/rsvp', 'DELETE', { id });
    fetchAll();
  };

  const stats = [
    { label: 'Réponses', value: String(responses.length), icon: Mail },
    { label: 'Présents', value: `${present.length} · ${persons} pers.`, icon: Check },
    { label: 'Absents', value: String(absent.length), icon: X },
    { label: 'Enfants', value: String(children), icon: Baby },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="vp-h2 text-[22px]">Réponses des invités</h3>
          <p className="vp-caption mt-0.5 !text-[13px]">Mis à jour en temps réel</p>
        </div>
        <button onClick={fetchAll} className="vp-press flex h-9 w-9 items-center justify-center rounded-full bg-black/5 transition hover:bg-black/10" aria-label="Actualiser">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {stats.map((s) => (
          <div key={s.label} className="vp-glass vp-spec rounded-[20px] p-4">
            <s.icon size={17} strokeWidth={1.9} className="text-[var(--vp-muted)]" />
            <div className="vp-num mt-2 text-[20px] font-semibold tracking-tight">{s.value}</div>
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--vp-muted)]">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="vp-glass vp-spec mt-4 rounded-[20px] p-4">
        <div className="mb-2 flex justify-between text-[12px] text-[var(--vp-muted)]"><span>Taux de présence</span><span className="vp-num font-semibold text-[var(--vp-ink)]">{rate}%</span></div>
        <div className="h-2.5 overflow-hidden rounded-full bg-black/10"><div className="h-full rounded-full bg-[var(--vp-ink)] transition-all duration-700" style={{ width: `${rate}%` }} /></div>
        {events.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {events.map((ev) => {
              const count = responses.filter((r) => r.attending && (r.events || []).includes(ev.name)).length;
              return <span key={ev.id} className="vp-chip !px-3 !py-1.5 !text-[12px] text-[var(--vp-ink-soft)]">{ev.name} · <strong className="vp-num">{count}</strong></span>;
            })}
          </div>
        )}
      </div>
      <div className="mt-5 space-y-2.5 max-h-[46vh] overflow-y-auto pr-1">
        {loading && <p className="vp-caption py-6 text-center !text-sm">Chargement des réponses…</p>}
        {!loading && responses.length === 0 && (
          <div className="rounded-[22px] border border-dashed border-black/20 bg-white/35 px-6 py-10 text-center backdrop-blur-xl">
            <Users size={28} strokeWidth={1.5} className="mx-auto text-[var(--vp-muted-2)]" />
            <p className="vp-caption mt-3 !text-sm">Aucune réponse pour le moment.<br />Partagez votre site pour recevoir les premières.</p>
          </div>
        )}
        {responses.map((r) => (
          <div key={r.id} className="vp-glass vp-spec rounded-[20px] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="vp-glyph flex h-9 w-9 items-center justify-center rounded-full text-[13px]">
                  {(r.first_name?.[0] || '?').toUpperCase()}
                </span>
                <div>
                  <div className="text-[14px] font-medium">{r.first_name} {r.last_name}</div>
                  <div className="vp-caption !text-[12px]">{r.attending ? `${r.guests_count} personne${Number(r.guests_count) > 1 ? 's' : ''}` : 'Absent'} {(r.events || []).length > 0 && `· ${(r.events || []).join(', ')}`}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${r.attending ? 'bg-black/5 text-[var(--vp-ink)]' : 'bg-black/5 text-[var(--vp-muted)]'}`}>{r.attending ? 'Présent' : 'Absent'}</span>
                <button onClick={() => remove(r.id)} className="vp-press flex h-7 w-7 items-center justify-center rounded-full text-[var(--vp-muted-2)] transition hover:bg-[color-mix(in_srgb,var(--vp-red)_14%,transparent)] hover:text-[var(--vp-red)]" aria-label="Supprimer"><Trash2 size={14} /></button>
              </div>
            </div>
            {(r.diet || r.allergies || r.message) && (
              <div className="mt-3 space-y-1.5 border-t border-black/5 pt-3 text-[13px] text-[var(--vp-ink-soft)]">
                {(r.diet || r.allergies) && <div className="flex items-center gap-1.5"><UtensilsCrossed size={13} />{[r.diet, r.allergies ? `Allergies : ${r.allergies}` : ''].filter(Boolean).join(' · ')}</div>}
                {r.message && <div className="italic">« {r.message} »</div>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
