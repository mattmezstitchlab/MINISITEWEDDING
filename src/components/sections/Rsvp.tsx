import VisionImage from '../vision/VisionImage';
import { Eyebrow, SectionTitle } from './primitives';
import RsvpForm from './RsvpForm';

/**
 * Section RSVP, posée sur une photo de danse.
 * Dans l’éditeur, le formulaire est remplacé par une maquette : rien n’est
 * envoyé tant que le site n’est pas public.
 */
export default function Rsvp() {
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
        {/* Le même bloc que celui du hero de l'accueil : une barre sombre, une
            question à la fois. En aperçu, il s'affiche tel quel. */}
        <div className="mx-auto mt-10 max-w-2xl">
          <RsvpForm />
        </div>
      </div>
    </section>
  );
}
