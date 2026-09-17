import { useState } from 'react';
import type { FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { apiSend } from '../../lib/http';
import { useSiteView } from './context';

const FIELD = 'vp-field vp-field-dark !px-5 !py-3.5 !text-[15px]';

/** Formulaire de réponse : présence, convives, régimes, hébergement, message. */
export default function RsvpForm() {
  const { site, data, accent, fonts, headWeight, btnR } = useSiteView();
  const events = data.rsvpEvents;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guests, setGuests] = useState(2);
  const [children, setChildren] = useState(0);
  const [diet, setDiet] = useState('');
  const [allergies, setAllergies] = useState('');
  const [housing, setHousing] = useState('');
  const [transport, setTransport] = useState('');
  const [message, setMessage] = useState('');
  const [picked, setPicked] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const toggleEvent = (name: string) => {
    setPicked((p) => (p.includes(name) ? p.filter((x) => x !== name) : [...p, name]));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!firstName.trim() || !lastName.trim()) { setError('Merci d’indiquer votre prénom et votre nom.'); return; }
    if (attending === null) { setError('Dites-nous si vous serez présent.'); return; }
    setSending(true);
    try {
      await apiSend('/api/rsvp', 'POST', {
        site_id: site.id, first_name: firstName.trim(), last_name: lastName.trim(), email: email.trim(),
        attending, guests_count: guests, children_count: children, diet, allergies, housing, transport,
        message, events: picked,
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="px-6 py-10 text-center">
        <span className="vp-glyph mx-auto flex h-16 w-16 items-center justify-center rounded-[22px]">
          <Check size={28} strokeWidth={2.4} />
        </span>
        <h3 className="mt-6 text-[28px] text-white" style={{ fontFamily: fonts.heading, fontWeight: headWeight, letterSpacing: '-0.025em' }}>Merci {firstName}.</h3>
        <p className="vp-body mt-3 !text-white/70">
          {attending ? 'Votre réponse a bien été envoyée. Nous avons hâte de vous retrouver.' : 'Votre réponse a bien été envoyée. Vous nous manquerez.'}
        </p>
      </motion.div>
    );
  }

  const stepper = 'flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xl leading-none text-white transition hover:bg-white/20 vp-press';

  return (
    <form onSubmit={submit} className="space-y-5 text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="vp-label !text-white/55">Prénom</label>
          <input className={FIELD} value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Marie" />
        </div>
        <div>
          <label className="vp-label !text-white/55">Nom</label>
          <input className={FIELD} value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Dupont" />
        </div>
      </div>
      <div>
        <label className="vp-label !text-white/55">Email</label>
        <input type="email" className={FIELD} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="marie@exemple.fr" />
      </div>
      <div>
        <label className="vp-label !text-white/55">Serez-vous présent ?</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setAttending(true)}
            className="vp-press border border-white/18 px-4 py-4 text-white transition"
            style={{
              borderRadius: btnR,
              borderColor: attending === true ? accent : undefined,
              background: attending === true ? accent : 'rgba(255,255,255,0.06)',
              boxShadow: attending === true ? `0 12px 28px -14px ${accent}` : 'inset 0 1px 0 rgba(255,255,255,0.12)',
              opacity: attending === false ? 0.5 : 1,
            }}
          >
            <span className="block text-[15px] font-semibold">Je serai là</span>
            <span className="mt-0.5 block text-xs opacity-70">Avec joie</span>
          </button>
          <button
            type="button"
            onClick={() => setAttending(false)}
            className="vp-press border border-white/18 px-4 py-4 text-white transition"
            style={{
              borderRadius: btnR,
              borderColor: attending === false ? accent : undefined,
              background: attending === false ? accent : 'rgba(255,255,255,0.06)',
              boxShadow: attending === false ? `0 12px 28px -14px ${accent}` : 'inset 0 1px 0 rgba(255,255,255,0.12)',
              opacity: attending === true ? 0.5 : 1,
            }}
          >
            <span className="block text-[15px] font-semibold">Je ne peux pas</span>
            <span className="mt-0.5 block text-xs opacity-70">À regret</span>
          </button>
        </div>
      </div>
      {events.length > 0 && attending === true && (
        <div>
          <label className="vp-label !text-white/55">Je participerai à</label>
          <div className="flex flex-wrap gap-2">
            {events.map((ev) => (
              <button
                key={ev.id}
                type="button"
                onClick={() => toggleEvent(ev.name)}
                className="vp-press border border-white/18 px-4 py-2 text-sm text-white transition"
                style={{
                  borderRadius: btnR,
                  borderColor: picked.includes(ev.name) ? accent : undefined,
                  background: picked.includes(ev.name) ? accent : 'rgba(255,255,255,0.07)',
                }}
              >
                {ev.name}
              </button>
            ))}
          </div>
        </div>
      )}
      {attending === true && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="vp-label !text-white/55">Nombre de personnes</label>
              <div className="flex items-center gap-3 text-white">
                <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} className={stepper}>−</button>
                <span className="vp-num text-2xl" style={{ fontFamily: fonts.heading, fontWeight: headWeight }}>{guests}</span>
                <button type="button" onClick={() => setGuests(Math.min(10, guests + 1))} className={stepper}>+</button>
              </div>
            </div>
            <div>
              <label className="vp-label !text-white/55">Enfants</label>
              <div className="flex items-center gap-3 text-white">
                <button type="button" onClick={() => setChildren(Math.max(0, children - 1))} className={stepper}>−</button>
                <span className="vp-num text-2xl" style={{ fontFamily: fonts.heading, fontWeight: headWeight }}>{children}</span>
                <button type="button" onClick={() => setChildren(Math.min(8, children + 1))} className={stepper}>+</button>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="vp-label !text-white/55">Régime alimentaire</label>
              <input className={FIELD} value={diet} onChange={(e) => setDiet(e.target.value)} placeholder="Végétarien, sans porc…" />
            </div>
            <div>
              <label className="vp-label !text-white/55">Allergies</label>
              <input className={FIELD} value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="Fruits à coque…" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="vp-label !text-white/55">Hébergement</label>
              <input className={FIELD} value={housing} onChange={(e) => setHousing(e.target.value)} placeholder="Je dors sur place…" />
            </div>
            <div>
              <label className="vp-label !text-white/55">Transport</label>
              <input className={FIELD} value={transport} onChange={(e) => setTransport(e.target.value)} placeholder="Voiture, train…" />
            </div>
          </div>
        </>
      )}
      <div>
        <label className="vp-label !text-white/55">Un message pour les mariés ?</label>
        <textarea rows={3} className={FIELD} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Quelques mots doux…" />
      </div>
      {error && <p className="text-sm font-medium text-[#FF8A80]">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="vp-press w-full py-4 text-[15px] font-semibold text-white transition disabled:opacity-60"
        style={{ background: accent, borderRadius: btnR, boxShadow: `0 16px 34px -16px ${accent}, inset 0 1px 0 rgba(255,255,255,0.3)` }}
      >
        {sending ? 'Envoi en cours…' : 'Envoyer ma réponse'}
      </button>
    </form>
  );
}
