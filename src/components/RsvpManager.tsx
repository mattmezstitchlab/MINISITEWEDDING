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
    { label: 'Réponses', value: String(responses.length), icon: Mail, bg: 'bg-neutral-900 text-white' },
    { label: 'Présents', value: `${present.length} · ${persons} pers.`, icon: Check, bg: 'bg-emerald-600 text-white' },
    { label: 'Absents', value: String(absent.length), icon: X, bg: 'bg-white border border-black/10' },
    { label: 'Enfants', value: String(children), icon: Baby, bg: 'bg-white border border-black/10' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xl font-light" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>Réponses des invités</h3>
          <p className="text-[13px] text-neutral-400 mt-0.5">Mis à jour en temps réel</p>
        </div>
        <button onClick={fetchAll} className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition" aria-label="Actualiser">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {stats.map((s) => (
          <div key={s.label} className={`p-4 rounded-2xl ${s.bg}`}>
            <s.icon size={17} strokeWidth={1.75} className="opacity-70" />
            <div className="mt-2 text-xl font-medium tabular-nums" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>{s.value}</div>
            <div className="text-[11px] tracking-[0.18em] uppercase opacity-60">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-4 rounded-2xl bg-white border border-black/10">
        <div className="flex justify-between text-[12px] text-neutral-500 mb-2"><span>Taux de présence</span><span className="font-medium text-neutral-900">{rate}%</span></div>
        <div className="h-2.5 rounded-full bg-black/10 overflow-hidden"><div className="h-full rounded-full bg-emerald-600 transition-all duration-700" style={{ width: `${rate}%` }} /></div>
        {events.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {events.map((ev) => {
              const count = responses.filter((r) => r.attending && (r.events || []).includes(ev.name)).length;
              return <span key={ev.id} className="text-[12px] px-3 py-1.5 rounded-full bg-black/5 text-neutral-600">{ev.name} · <strong>{count}</strong></span>;
            })}
          </div>
        )}
      </div>
      <div className="mt-5 space-y-2.5 max-h-[46vh] overflow-y-auto pr-1">
        {loading && <p className="text-sm text-neutral-400 text-center py-6">Chargement des réponses…</p>}
        {!loading && responses.length === 0 && (
          <div className="text-center py-10 px-6 rounded-2xl bg-white border border-dashed border-black/15">
            <Users size={28} strokeWidth={1.5} className="mx-auto text-neutral-300" />
            <p className="mt-3 text-sm text-neutral-500">Aucune réponse pour le moment.<br />Partagez votre site pour recevoir les premières.</p>
          </div>
        )}
        {responses.map((r) => (
          <div key={r.id} className="p-4 rounded-2xl bg-white border border-black/10">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-medium ${r.attending ? 'bg-emerald-600 text-white' : 'bg-black/10 text-neutral-500'}`}>
                  {(r.first_name?.[0] || '?').toUpperCase()}
                </span>
                <div>
                  <div className="text-[14px] font-medium">{r.first_name} {r.last_name}</div>
                  <div className="text-[12px] text-neutral-400">{r.attending ? `${r.guests_count} personne${Number(r.guests_count) > 1 ? 's' : ''}` : 'Absent'} {(r.events || []).length > 0 && `· ${(r.events || []).join(', ')}`}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[11px] px-2.5 py-1 rounded-full ${r.attending ? 'bg-emerald-50 text-emerald-700' : 'bg-black/5 text-neutral-500'}`}>{r.attending ? 'Présent' : 'Absent'}</span>
                <button onClick={() => remove(r.id)} className="w-7 h-7 rounded-full hover:bg-red-50 text-neutral-300 hover:text-red-500 flex items-center justify-center transition" aria-label="Supprimer"><Trash2 size={14} /></button>
              </div>
            </div>
            {(r.diet || r.allergies || r.message) && (
              <div className="mt-3 pt-3 border-t border-black/5 space-y-1.5 text-[13px] text-neutral-500">
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
