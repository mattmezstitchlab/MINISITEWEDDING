import { useState } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Copy, Mail, MessageCircle } from 'lucide-react';
import { apiSend } from '../../lib/http';
import { isRemote } from '../../lib/dataSource';
import RsvpTicket from '../RsvpTicket';
import { useSiteView } from './context';

const FIELD = 'vp-field vp-field-dark !px-4 !py-3 !text-[14px]';

/**
 * LE RSVP
 *
 * Le même bloc que celui du hero de l'accueil : une barre sombre, une question
 * à la fois, des points de progression, et une capsule blanche pour avancer.
 * Les questions s'adaptent à la réponse — quelqu'un qui ne vient pas n'a pas à
 * parler de son régime — et le récapitulatif part aux mariés d'un seul geste.
 */
export default function RsvpForm() {
  const { site, data, preview, degraded, theme, accent, names } = useSiteView();
  const events = data.rsvpEvents;
  const local = !isRemote();
  /**
   * Un aperçu n'est pas un mariage : `preview` vient de l'éditeur, et
   * l'identifiant `0` est celui du mini-site de démonstration montré sur
   * l'accueil. Dans les deux cas, rien ne part — et on le dit.
   */
  const demonstration = preview || site.id === 0;

  const [step, setStep] = useState(0);
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

  // Les questions s'adaptent à la réponse : on ne demande pas son régime à
  // quelqu'un qui ne vient pas.
  const etapes: Array<{ id: string; title: string; hint: string }> = [
    { id: 'identite', title: 'Qui êtes-vous ?', hint: 'Vos noms, tels qu’ils figureront sur le plan de table.' },
    { id: 'presence', title: 'Serez-vous des nôtres ?', hint: 'Une réponse, même tardive, nous aide vraiment.' },
    ...(attending === true
      ? [
          { id: 'nombre', title: 'Combien serez-vous ?', hint: 'Les enfants comptent aussi.' },
          { id: 'regime', title: 'Ce que vous mangez', hint: 'Transmis directement à la cuisine.' },
          ...(events.length > 0
            ? [{ id: 'moments', title: 'À quels moments ?', hint: 'Vous pouvez tout cocher.' }]
            : []),
        ]
      : []),
    { id: 'mot', title: 'Un mot, et c’est prêt', hint: 'Facultatif — mais très apprécié.' },
  ];

  const index = Math.min(step, etapes.length - 1);
  const courante = etapes[index];
  const dernier = index === etapes.length - 1;

  const peutAvancer = () => {
    if (courante.id === 'identite') return firstName.trim().length > 0 && lastName.trim().length > 0;
    if (courante.id === 'presence') return attending !== null;
    return true;
  };

  const texte = [
    `RSVP — ${site.partner1} & ${site.partner2}`,
    `${firstName.trim()} ${lastName.trim()}${email.trim() ? ` · ${email.trim()}` : ''}`,
    attending ? `Présent·e — ${guests} adulte(s)${children ? `, ${children} enfant(s)` : ''}` : 'Ne pourra pas être présent·e',
    picked.length ? `Moments : ${picked.join(', ')}` : '',
    diet.trim() ? `Régime : ${diet.trim()}` : '',
    allergies.trim() ? `Allergies : ${allergies.trim()}` : '',
    housing.trim() ? `Hébergement : ${housing.trim()}` : '',
    transport.trim() ? `Transport : ${transport.trim()}` : '',
    message.trim() ? message.trim() : '',
  ]
    .filter(Boolean)
    .join('\n');

  const pret = Boolean(firstName.trim() && lastName.trim() && attending !== null);
  const digits = site.contact_phone.replace(/\D/g, '').replace(/^0(?=\d{9}$)/, '33');
  const webhook = import.meta.env.VITE_RSVP_WEBHOOK as string | undefined;

  /** Envoi d'une copie au point de collecte, s'il y en a un : l'invité n'attend pas. */
  const envoyerAuPointDeCollecte = () => {
    if (!webhook || !pret) return;
    void fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ site: site.slug, reponse: texte }),
    }).catch(() => undefined);
  };

  const copier = async () => {
    try {
      await navigator.clipboard.writeText(texte);
      setError('Votre réponse est copiée — envoyez-la aux mariés.');
    } catch {
      setError('Copie impossible sur cet appareil : envoyez plutôt un WhatsApp ou un e-mail.');
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!firstName.trim() || !lastName.trim()) {
      setStep(0);
      setError('Merci d’indiquer votre prénom et votre nom.');
      return;
    }
    if (attending === null) {
      setStep(1);
      setError('Dites-nous si vous serez présent.');
      return;
    }
    if (degraded && !local) {
      setError('Les réponses sont suspendues pour le moment — réessayez un peu plus tard, ou écrivez-nous directement.');
      return;
    }
    setSending(true);
    try {
      await apiSend('/api/rsvp', 'POST', {
        site_id: site.id,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        attending,
        guests_count: guests,
        children_count: children,
        diet,
        allergies,
        housing,
        transport,
        message,
        events: picked,
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setSending(false);
    }
  };

  const suivant = () => {
    if (!peutAvancer()) return;
    if (demonstration) {
      setError('Aperçu : les réponses ne partent pas tant que le site n’est pas publié.');
      return;
    }
    setStep(index + 1);
  };

  const capsule =
    'flex items-center gap-1.5 rounded-full bg-white px-5 py-2 text-[12.5px] font-bold text-[#0B0C12] shadow-[0_6px_20px_rgba(0,0,0,0.28)] transition hover:bg-white/90 disabled:opacity-30';
  const stepper =
    'vp-press flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-[16px] leading-none text-white transition hover:bg-white/[0.14]';
  const choix =
    'flex items-start justify-between gap-2 rounded-[14px] border px-3.5 py-3 text-left transition';

  if (sent) {
    return (
      <div className="text-white">
        {/* Répondre délivre un billet : nominatif, numéroté, au nom de l'univers. */}
        <RsvpTicket
          nom={`${firstName} ${lastName}`.trim()}
          styleId={theme.id}
          universeName={theme.name}
          accent={accent}
          noms={names}
          date={site.wedding_date ?? ''}
          venue={[site.venue, site.city].filter(Boolean).join(', ')}
          vient={attending === true}
          places={guests}
          enfants={children}
          moments={picked}
          regime={diet}
          allergies={allergies}
          message={message}
          reponduLe={new Date()}
        />
        <p className="mx-auto mt-4 max-w-md text-center text-[13.5px] leading-relaxed text-white/70">
          <Check size={14} className="mr-1 inline" />
          {attending
            ? `Merci ${firstName}. Votre billet est prêt — gardez-le, il vous attend à l’entrée.`
            : `Merci ${firstName}. Votre réponse est arrivée : vous nous manquerez.`}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="text-left">
      {/* La barre sombre, comme celle du hero */}
      <div className="rounded-[24px] border border-white/10 bg-[#0B0C12]/92 p-3.5 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-md">
        <div className="flex items-center justify-between gap-3 px-1 pb-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10.5px] font-bold text-white">
              {index + 1}
            </span>
            <div className="min-w-0">
              <div className="truncate text-[14px] font-bold leading-none text-white">{courante.title}</div>
              <div className="mt-1 truncate text-[10.5px] leading-none text-white/45">{courante.hint}</div>
            </div>
          </div>

          <span className="shrink-0 font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/35">
            {demonstration ? 'Aperçu' : `sur ${etapes.length}`}
          </span>
        </div>

        {/* La réponse à la question du moment, dans une zone de hauteur fixe */}
        <div className="no-scrollbar h-[232px] overflow-y-auto pr-0.5">
          <AnimatePresence mode="wait">
            <motion.div
              key={courante.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {courante.id === 'identite' && (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="vp-label !text-white/45">Prénom</label>
                      <input className={FIELD} value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Léa" />
                    </div>
                    <div>
                      <label className="vp-label !text-white/45">Nom</label>
                      <input className={FIELD} value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Dupont" />
                    </div>
                  </div>
                  <div>
                    <label className="vp-label !text-white/45">Email</label>
                    <input type="email" className={FIELD} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="lea@exemple.fr" />
                  </div>
                </div>
              )}

              {courante.id === 'presence' && (
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    { valeur: true, titre: 'Je serai là', note: 'Avec joie' },
                    { valeur: false, titre: 'Je ne peux pas', note: 'À regret' },
                  ].map((option) => {
                    const actif = attending === option.valeur;
                    return (
                      <button
                        key={option.titre}
                        type="button"
                        onClick={() => setAttending(option.valeur)}
                        className={`${choix} ${
                          actif
                            ? 'border-white bg-white text-[#0B0C12]'
                            : 'border-white/10 bg-white/[0.05] text-white hover:border-white/30'
                        }`}
                      >
                        <span>
                          <span className="block text-[13px] font-bold leading-tight">{option.titre}</span>
                          <span className={`block text-[11px] ${actif ? 'text-black/50' : 'text-white/45'}`}>
                            {option.note}
                          </span>
                        </span>
                        {actif && <Check size={14} className="mt-0.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {courante.id === 'nombre' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: 'Adultes', valeur: guests, set: setGuests, min: 1, max: 10 },
                    { label: 'Enfants', valeur: children, set: setChildren, min: 0, max: 8 },
                  ].map((compteur) => (
                    <div key={compteur.label} className="rounded-[14px] border border-white/10 bg-white/[0.05] px-4 py-3.5">
                      <div className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/45">
                        {compteur.label}
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => compteur.set(Math.max(compteur.min, compteur.valeur - 1))}
                          className={stepper}
                          aria-label={`Moins de ${compteur.label}`}
                        >
                          −
                        </button>
                        <span className="vp-num min-w-[28px] text-center text-[20px] font-bold text-white">
                          {compteur.valeur}
                        </span>
                        <button
                          type="button"
                          onClick={() => compteur.set(Math.min(compteur.max, compteur.valeur + 1))}
                          className={stepper}
                          aria-label={`Plus de ${compteur.label}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {courante.id === 'regime' && (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="vp-label !text-white/45">Régime alimentaire</label>
                      <input className={FIELD} value={diet} onChange={(e) => setDiet(e.target.value)} placeholder="Végétarien, sans porc…" />
                    </div>
                    <div>
                      <label className="vp-label !text-white/45">Allergies</label>
                      <input className={FIELD} value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="Fruits à coque…" />
                    </div>
                  </div>
                  <p className="px-1 text-[11.5px] leading-relaxed text-white/45">
                    C’est cette ligne que le traiteur lira. Tout ce qui sort de l’ordinaire se traite au cas par cas.
                  </p>
                </div>
              )}

              {courante.id === 'moments' && (
                <div className="space-y-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    {events.map((evenement) => {
                      const actif = picked.includes(evenement.name);
                      return (
                        <button
                          key={evenement.id}
                          type="button"
                          onClick={() => toggleEvent(evenement.name)}
                          className={`rounded-full border px-3 py-1.5 text-[11.5px] font-semibold transition ${
                            actif
                              ? 'border-white bg-white text-[#0B0C12]'
                              : 'border-white/10 bg-white/[0.06] text-white/70 hover:border-white/30 hover:text-white'
                          }`}
                        >
                          {evenement.name}
                        </button>
                      );
                    })}
                  </div>
                  <p className="px-1 text-[11.5px] leading-relaxed text-white/45">
                    Les moments que vous cochez apparaissent sur votre carte d’invité.
                  </p>
                </div>
              )}

              {courante.id === 'mot' && (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="vp-label !text-white/45">Hébergement</label>
                      <input className={FIELD} value={housing} onChange={(e) => setHousing(e.target.value)} placeholder="Je dors sur place…" />
                    </div>
                    <div>
                      <label className="vp-label !text-white/45">Transport</label>
                      <input className={FIELD} value={transport} onChange={(e) => setTransport(e.target.value)} placeholder="Voiture, train…" />
                    </div>
                  </div>
                  <div>
                    <label className="vp-label !text-white/45">Un mot pour les mariés ?</label>
                    <textarea
                      rows={2}
                      className={`${FIELD} resize-none`}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Quelques mots doux…"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Le pilotage : retour, progression, capsule */}
        <div className="mt-3.5 flex items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStep(Math.max(0, index - 1))}
              disabled={index === 0}
              className="text-[12px] font-semibold text-white/45 transition hover:text-white disabled:opacity-25"
            >
              Retour
            </button>
            <span className="flex items-center gap-1">
              {etapes.map((etape, i) => (
                <span
                  key={etape.id}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? 'w-4 bg-white' : i < index ? 'w-1.5 bg-white/45' : 'w-1.5 bg-white/15'
                  }`}
                />
              ))}
            </span>
          </div>

          {!dernier ? (
            <button type="button" onClick={suivant} disabled={!peutAvancer()} className={capsule}>
              Continuer <ArrowRight size={13} />
            </button>
          ) : local ? (
            <div className="flex items-center gap-1.5">
              {digits && (
                <a
                  href={`https://wa.me/${digits}?text=${encodeURIComponent(texte)}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={envoyerAuPointDeCollecte}
                  className={capsule}
                >
                  <MessageCircle size={13} /> Envoyer
                </a>
              )}
              {site.contact_email && (
                <a
                  href={`mailto:${site.contact_email}?subject=${encodeURIComponent(
                    `RSVP — ${firstName.trim() || 'Invité'} ${lastName.trim()}`,
                  )}&body=${encodeURIComponent(texte)}`}
                  onClick={envoyerAuPointDeCollecte}
                  className={capsule}
                >
                  <Mail size={13} /> E-mail
                </a>
              )}
            </div>
          ) : (
            <button
              type="submit"
              disabled={!pret || sending || degraded || demonstration}
              className={capsule}
            >
              {sending ? 'Envoi…' : 'Envoyer ma réponse'} <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>

      {/*
        * Les issues, en petit, sous la barre.
        *
        * Sans base pour recevoir les réponses, elles partent directement chez
        * les mariés : la ligne reste là, à toutes les étapes, pour qu'un invité
        * pressé n'ait pas à finir le questionnaire. Avec une base, l'envoi
        * classique prend sa place.
        */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11.5px] text-white/55">
        {local && !demonstration ? (
          <>
            <span className="text-white/40">Envoyer dès maintenant :</span>
            {digits && (
              <a
                href={`https://wa.me/${digits}?text=${encodeURIComponent(texte)}`}
                target="_blank"
                rel="noreferrer"
                onClick={envoyerAuPointDeCollecte}
                className="inline-flex items-center gap-1.5 font-semibold transition hover:text-white"
              >
                <MessageCircle size={12} /> WhatsApp
              </a>
            )}
            {site.contact_email && (
              <a
                href={`mailto:${site.contact_email}?subject=${encodeURIComponent(
                  `RSVP — ${firstName.trim() || 'Invité'} ${lastName.trim()}`,
                )}&body=${encodeURIComponent(texte)}`}
                onClick={envoyerAuPointDeCollecte}
                className="inline-flex items-center gap-1.5 font-semibold transition hover:text-white"
              >
                <Mail size={12} /> E-mail
              </a>
            )}
            <button
              type="button"
              onClick={copier}
              disabled={!pret}
              className="inline-flex items-center gap-1.5 font-semibold transition hover:text-white disabled:opacity-40"
            >
              <Copy size={12} /> Copier ma réponse
            </button>
          </>
        ) : (
          <button
            type="submit"
            disabled={!pret || sending || degraded}
            className="font-semibold transition hover:text-white disabled:opacity-40"
          >
            {sending ? 'Envoi en cours…' : 'Envoyer ma réponse'}
          </button>
        )}
      </div>

      <p className="mt-2 text-center text-[11.5px] text-white/45">
        {demonstration
          ? 'Aperçu : les réponses ne partent pas tant que le site n’est pas publié.'
          : local
            ? 'Votre réponse part directement aux mariés, sans serveur intermédiaire.'
            : 'Votre réponse est enregistrée dans le cockpit des mariés.'}
      </p>

      {error && <p className="mt-2 text-center text-[12.5px] font-medium text-white/80">{error}</p>}
    </form>
  );
}
