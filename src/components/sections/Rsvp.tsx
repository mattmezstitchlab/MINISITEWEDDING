import VisionImage from '../vision/VisionImage';
import { useSiteView } from './context';
import { Eyebrow, SectionTitle } from './primitives';
import RsvpForm from './RsvpForm';

/**
 * Section RSVP, posée sur une photo de danse.
 * Dans l’éditeur, le formulaire est remplacé par une maquette : rien n’est
 * envoyé tant que le site n’est pas public.
 */
export default function Rsvp() {
  const { accent, cardR, preview } = useSiteView();

  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28" style={{ color: '#fff' }}>
      <div className="absolute inset-0">
        <VisionImage src="/images/danse.jpg" alt="" fallbackLabel="Danse" className="h-full w-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#05060C]/62 via-[#05060C]/48 to-[#05060C]/72" />
      <div className="relative mx-auto max-w-2xl text-center">
        <Eyebrow>RSVP</Eyebrow>
        <SectionTitle style={{ color: '#fff' }}>Serez-vous des nôtres ?</SectionTitle>
        <p className="vp-body mt-3 !text-white/70">Merci de répondre avant le 1er juin — votre réponse nous est précieuse.</p>
        <div className="vp-glass-dark vp-spec-dark mt-10 p-7 text-white sm:p-10" style={{ borderRadius: cardR }}>
          {preview ? (
            <div className="space-y-4 text-left opacity-90">
              <div className="grid grid-cols-2 gap-4"><div className="h-12 rounded-xl bg-white/10" /><div className="h-12 rounded-xl bg-white/10" /></div>
              <div className="h-12 rounded-xl bg-white/10" />
              <div className="grid grid-cols-2 gap-4"><div className="h-16 rounded-xl bg-white/10" /><div className="h-16 rounded-xl bg-white/10" /></div>
              <div className="rounded-full py-4 text-center text-sm font-semibold uppercase tracking-[0.15em]" style={{ background: accent }}>Envoyer ma réponse</div>
              <p className="pt-1 text-center text-sm text-white/60">Le formulaire apparaîtra ici sur votre site public.</p>
            </div>
          ) : (
            <RsvpForm />
          )}
        </div>
      </div>
    </section>
  );
}
