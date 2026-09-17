import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Music, Play, Pause, Volume2, VolumeX, Compass, 
  MapPin, Wind, Flower2, Droplets, Check, Feather, Eye, Moon
} from 'lucide-react';

interface SecretPlace {
  id: string;
  name: string;
  category: string;
  distance: string;
  desc: string;
  fragrance: string;
  image: string;
}

export default function MaisonAnomalieSite() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [selectedPlaceId, setSelectedPlaceId] = useState('1');
  const [activeStoryFragment, setActiveStoryFragment] = useState(0);
  const [rsvpGift, setRsvpGift] = useState('Un vœu silencieux sous la pleine lune');
  const [rsvpDone, setRsvpDone] = useState(false);

  const playlist = [
    { title: 'Nocturne aux Miroirs Flottants', artist: 'Curated by Maison Anomalie', length: '04:12' },
    { title: 'Astral Dreamscape (Live Harpe & Synthé)', artist: 'Atelier Sonore Le Monde Aime', length: '03:45' },
    { title: 'La Pluie de Jasmin Éthérée', artist: 'Orchestration Onirique', length: '05:08' },
  ];

  const secretPlaces: SecretPlace[] = [
    {
      id: '1',
      name: 'Le Labyrinthe des Statues Endormies',
      category: 'BOSQUET SECRET',
      distance: '300m du Château',
      desc: 'Un dédale de buis taillés au XVIIe siècle abritant six statues de marbre couvertes de lierre. À la tombée de la nuit, des lanternes d’ambre y sont allumées.',
      fragrance: 'Cèdre bleu & Mousse humide',
      image: '/images/packages/anomalie.jpg',
    },
    {
      id: '2',
      name: 'La Source aux Éphémères',
      category: 'BASSIN MYSTIQUE',
      distance: '650m à travers la clairière',
      desc: 'Une résurgence d’eau cristalline où flottent des nymphéas blancs et des bougies de cire vierge. Lieu idéal pour un aparté hors du temps.',
      fragrance: 'Fleur d’oranger sauvage & Menthe fraîche',
      image: '/images/chateau.jpg',
    },
    {
      id: '3',
      name: 'Le Belvédère Stellaire',
      category: 'POINT CÉLESTE',
      distance: 'Au sommet de la colline sud',
      desc: 'Un observatoire à ciel ouvert bordé de bancs de pierre douce, équipé de télescopes anciens tournés vers les constellations d’été.',
      fragrance: 'Encens blanc & Jasmin de nuit',
      image: '/images/hero-wedding.jpg',
    },
  ];

  const activePlace = secretPlaces.find(p => p.id === selectedPlaceId) || secretPlaces[0];

  const storyFragments = [
    {
      num: 'FRAGMENT I',
      title: 'Le Miroir Égaré sur les Toits',
      text: 'Ils se sont croisés un mardi où la pluie ne touchait pas le sol. Gaspard portait une veste de velours ciel, Philomène cherchait une constellation disparue dans les reflets d’une flaque.',
    },
    {
      num: 'FRAGMENT II',
      title: 'L’Apprivoisement des Nuages',
      text: 'Trois hivers durant, ils collectionnèrent les murmures de train, les théières fissurées et les clés de portes inexistantes. Rien n’était ordinaire, car tout était habité par leur songe.',
    },
    {
      num: 'FRAGMENT III',
      title: 'Le Pacte des Lanternes',
      text: 'Ce mariage n’est pas un engagement civil. C’est un sortilège partagé : convier cent âmes choisies dans une serre de verre suspendue entre ciel et terre.',
    },
  ];

  return (
    <div className="bg-[#0A101D] text-[#E0E7FF] min-h-screen selection:bg-[#38BDF8] selection:text-black" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      {/* Top Banner */}
      <div className="border-b border-white/10 bg-[#070B14] px-4 sm:px-8 py-3 flex items-center justify-between text-xs tracking-[0.25em] uppercase font-semibold text-[#7DD3FC]">
        <div className="flex items-center gap-2">
          <Feather size={14} className="text-[#F472B6]" />
          <span className="text-white">MAISON ANOMALIE // SCÉNOGRAPHIE POÉTIQUE & EXPÉRIENCE SENSORIELLE</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[11px] text-[#93C5FD]">
          <a href="#signature-sonore" className="hover:text-white transition">Signature Sonore</a>
          <a href="#pyramide-olfactive" className="hover:text-white transition">Carnet Olfactif</a>
          <a href="#lieux-secrets" className="hover:text-white transition">Lieux Secrets</a>
          <a href="#sortilege-rsvp" className="hover:text-white transition">Sortilège RSVP</a>
        </div>
        <div className="text-[11px] font-mono text-[#F472B6] border border-[#F472B6]/40 px-3 py-1 rounded-full">
          ONIRISME PUR
        </div>
      </div>

      {/* Floating Interactive Audio Player Pill */}
      <div className="fixed bottom-6 right-6 z-40 bg-[#0F172A]/90 backdrop-blur-xl border border-[#38BDF8]/30 rounded-full px-5 py-3 shadow-2xl flex items-center gap-4 text-xs font-mono text-white">
        <button
          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
          className="w-8 h-8 rounded-full bg-[#38BDF8] text-black flex items-center justify-center hover:scale-105 transition shadow-lg"
        >
          {isPlayingAudio ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
        </button>

        <div className="hidden sm:block">
          <div className="text-[11px] font-semibold truncate max-w-[170px] text-white">
            {playlist[currentTrackIndex].title}
          </div>
          <div className="text-[9px] text-[#7DD3FC] flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isPlayingAudio ? 'bg-emerald-400 animate-ping' : 'bg-neutral-500'}`} />
            <span>{isPlayingAudio ? 'Lecture immersive active' : 'Audio en pause'}</span>
          </div>
        </div>

        {/* Visualizer bars */}
        <div className="flex items-center gap-0.5 h-4">
          {[40, 80, 50, 95, 60, 30, 85].map((h, i) => (
            <motion.div
              key={i}
              animate={isPlayingAudio ? { height: ['20%', `${h}%`, '20%'] } : { height: '20%' }}
              transition={{ repeat: Infinity, duration: 0.8 + (i * 0.1), ease: 'easeInOut' }}
              className="w-0.5 bg-[#38BDF8] rounded-full"
            />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative min-h-[92vh] flex flex-col justify-end p-6 sm:p-14 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <img
            src="/images/packages/anomalie.jpg"
            alt="Maison Anomalie Mariage"
            className="w-full h-full object-cover filter brightness-90 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A101D] via-[#0A101D]/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-6xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-[#38BDF8]/40 text-[#38BDF8] text-[11px] tracking-[0.25em] uppercase font-semibold mb-6">
            <Sparkles size={13} /> Scénographie Onirique & Design Sensoriel
          </div>

          <h1
            className="text-white uppercase leading-[0.92] tracking-tight font-normal text-[clamp(3.5rem,12vw,9.5rem)]"
            style={{ fontFamily: '"Playfair Display", "Cormorant Garamond", serif' }}
          >
            GASPARD <span className="text-[#F472B6] italic font-light">&</span> PHILOMÈNE
          </h1>

          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 border-t border-white/15">
            <div>
              <p className="text-xl sm:text-2xl font-light text-white tracking-wide" style={{ fontFamily: '"Playfair Display", serif' }}>
                18 JUILLET 2026 — SERRE DES SONGES, NORMANDIE
              </p>
              <p className="text-sm text-[#94A3B8] mt-1 font-light">
                Une parenthèse suspendue sous les roses et les miroirs célestes. Laissez la réalité au vestiaire.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a href="#signature-sonore" className="px-6 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-[#38BDF8] to-[#818CF8] text-black text-xs tracking-[0.2em] uppercase font-bold hover:opacity-90 transition shadow-lg">
                Écouter la Playlist
              </a>
              <a href="#lieux-secrets" className="px-6 sm:px-8 py-3.5 rounded-full border border-white/30 text-white text-xs tracking-[0.2em] uppercase font-semibold hover:border-white transition">
                Carte des Songes
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* MODULE 1 : SIGNATURE SONORE & PLAYLIST CURATORIALE DU MARIAGE */}
      <section id="signature-sonore" className="py-24 sm:py-36 px-4 sm:px-8 border-b border-white/10 bg-[#070B14]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs tracking-[0.3em] uppercase text-[#38BDF8] font-semibold flex items-center justify-center gap-1.5">
              <Music size={14} /> PAYSAGE ACOUSTIQUE & COMPOSITION
            </span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-light uppercase tracking-tight text-white" style={{ fontFamily: '"Playfair Display", serif' }}>
              LA SIGNATURE SONORE DU MARIAGE
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#94A3B8] font-light">
              Une fresque musicale composée sur-mesure pour accompagner l'élévation des cœurs et les danses sous la verrière.
            </p>
          </div>

          <div className="p-8 sm:p-12 rounded-3xl bg-[#0F172A] border border-[#38BDF8]/25 shadow-2xl relative overflow-hidden">
            <div className="grid md:grid-cols-[1fr_320px] gap-8 items-center">
              <div>
                <span className="text-[11px] font-mono uppercase text-[#F472B6] tracking-widest">TITRE EN COURS</span>
                <h3 className="text-2xl sm:text-3xl font-light text-white mt-1" style={{ fontFamily: '"Playfair Display", serif' }}>
                  {playlist[currentTrackIndex].title}
                </h3>
                <p className="text-xs text-[#94A3B8] font-mono mt-1">{playlist[currentTrackIndex].artist}</p>

                {/* Big Interactive Waveform Visualizer */}
                <div className="mt-8 flex items-center gap-1.5 h-16 bg-black/40 p-4 rounded-2xl border border-white/5">
                  {[30, 60, 45, 90, 75, 40, 85, 100, 65, 45, 80, 95, 30, 50, 70, 85, 60, 40, 75, 90, 55, 35].map((val, idx) => (
                    <motion.div
                      key={idx}
                      animate={isPlayingAudio ? { height: [`${val * 0.3}%`, `${val}%`, `${val * 0.4}%`] } : { height: '25%' }}
                      transition={{ repeat: Infinity, duration: 1.2 + (idx * 0.05), ease: 'easeInOut' }}
                      className="flex-1 bg-gradient-to-t from-[#38BDF8] to-[#F472B6] rounded-full"
                    />
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                  <span>01:45</span>
                  <span>{playlist[currentTrackIndex].length}</span>
                </div>
              </div>

              {/* Controls & Tracklist */}
              <div className="space-y-3 border-t md:border-t-0 md:border-l border-white/10 md:pl-8 pt-6 md:pt-0">
                <div className="text-xs font-mono uppercase tracking-widest text-[#38BDF8] mb-3">
                  PLAYLIST ONIRIQUE
                </div>
                {playlist.map((track, i) => (
                  <button
                    key={track.title}
                    onClick={() => {
                      setCurrentTrackIndex(i);
                      setIsPlayingAudio(true);
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left transition flex items-center justify-between gap-3 ${
                      currentTrackIndex === i
                        ? 'bg-[#38BDF8]/15 border-[#38BDF8] text-white'
                        : 'bg-black/30 border-white/5 text-[#94A3B8] hover:border-white/20'
                    }`}
                  >
                    <div className="truncate">
                      <div className="text-xs font-semibold truncate">{track.title}</div>
                      <div className="text-[10px] text-[#64748B] font-mono">{track.length}</div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      {currentTrackIndex === i && isPlayingAudio ? <Pause size={12} /> : <Play size={12} />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODULE 2 : CARNET DE VOYAGE OLFACTIF (PARFUM DE SCÉNOGRAPHIE DU MARIAGE) */}
      <section id="pyramide-olfactive" className="py-24 sm:py-36 px-4 sm:px-8 border-b border-white/10 bg-[#0A101D]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs tracking-[0.3em] uppercase text-[#F472B6] font-semibold flex items-center justify-center gap-1.5">
              <Wind size={14} /> SCULPTURE DE L'AIR & EFFLUVES
            </span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-light uppercase tracking-tight text-white" style={{ fontFamily: '"Playfair Display", serif' }}>
              LE CARNET OLFACTIF DU JOUR J
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#94A3B8] font-light">
              Un sillage sur-mesure diffusé dans la serre par des nébulisateurs invisibles pour graver la mémoire sensorielle de l'instant.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Notes de Tête */}
            <div className="p-8 rounded-3xl bg-[#0F172A] border border-white/10 hover:border-[#38BDF8]/40 transition flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] flex items-center justify-center mb-4">
                  <Droplets size={20} />
                </div>
                <span className="text-[11px] font-mono text-[#38BDF8] uppercase tracking-widest">01 // NOTES DE TÊTE</span>
                <h3 className="text-xl font-light text-white uppercase mt-2" style={{ fontFamily: '"Playfair Display", serif' }}>
                  Éveil & Fraîcheur Vaporeuse
                </h3>
                <p className="text-xs text-[#94A3B8] mt-3 leading-relaxed font-light">
                  Bergamote fumée d'Italie, poivre blanc moulu et rosée de concombre sauvage. Une ouverture cristalline et mystérieuse.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-white/60">
                Sillage : 0 à 30 minutes
              </div>
            </div>

            {/* Notes de Cœur */}
            <div className="p-8 rounded-3xl bg-[#0F172A] border border-[#F472B6]/30 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#F472B6]/10 text-[#F472B6] flex items-center justify-center mb-4">
                  <Flower2 size={20} />
                </div>
                <span className="text-[11px] font-mono text-[#F472B6] uppercase tracking-widest">02 // NOTES DE CŒUR</span>
                <h3 className="text-xl font-light text-white uppercase mt-2" style={{ fontFamily: '"Playfair Display", serif' }}>
                  Le Cœur Romantique Surréaliste
                </h3>
                <p className="text-xs text-[#94A3B8] mt-3 leading-relaxed font-light">
                  Fleur d'oranger sauvage en pleine floraison, jasmin étoilé nocturne et aiguilles de cèdre bleu de l'Atlas.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-white/60">
                Sillage : 30 min à 4 heures
              </div>
            </div>

            {/* Notes de Fond */}
            <div className="p-8 rounded-3xl bg-[#0F172A] border border-white/10 hover:border-[#38BDF8]/40 transition flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center mb-4">
                  <Moon size={20} />
                </div>
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest">03 // NOTES DE FOND</span>
                <h3 className="text-xl font-light text-white uppercase mt-2" style={{ fontFamily: '"Playfair Display", serif' }}>
                  Sillage Éternel & Cire Ancienne
                </h3>
                <p className="text-xs text-[#94A3B8] mt-3 leading-relaxed font-light">
                  Ambre gris fossile, encens d'églises gothiques, cire d'abeille des cierges fondus et musc blanc poudré.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-white/60">
                Persistance : Jusqu'à l'aube
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODULE 3 : CARTE INTERACTIVE POÉTIQUE DES LIEUX SECRETS */}
      <section id="lieux-secrets" className="py-24 sm:py-36 px-4 sm:px-8 border-b border-white/10 bg-[#070B14]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-[#38BDF8] font-semibold flex items-center gap-1.5">
                <Compass size={14} /> GÉOGRAPHIE DU SONGE
              </span>
              <h2 className="text-4xl sm:text-6xl font-light uppercase tracking-tight text-white mt-1" style={{ fontFamily: '"Playfair Display", serif' }}>
                LA CARTE DES LIEUX SECRETS
              </h2>
            </div>
            <p className="text-sm text-[#94A3B8] max-w-md font-light leading-relaxed">
              Autour de la grande serre, trois havres confidentiels ont été aménagés pour vos flâneries amoureuses et vos confidences.
            </p>
          </div>

          <div className="mt-12 grid lg:grid-cols-[380px_1fr] gap-8 items-start">
            {/* List of points */}
            <div className="space-y-3">
              {secretPlaces.map((place) => (
                <button
                  key={place.id}
                  onClick={() => setSelectedPlaceId(place.id)}
                  className={`w-full p-6 rounded-2xl border text-left transition flex flex-col justify-between ${
                    selectedPlaceId === place.id
                      ? 'bg-[#0F172A] border-[#38BDF8] text-white shadow-xl'
                      : 'bg-black/30 border-white/10 text-[#94A3B8] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#38BDF8]">
                    <span>{place.category}</span>
                    <span>{place.distance}</span>
                  </div>
                  <h4 className="text-lg font-light text-white uppercase mt-2" style={{ fontFamily: '"Playfair Display", serif' }}>
                    {place.name}
                  </h4>
                  <div className="mt-3 text-xs text-[#94A3B8] font-light flex items-center gap-1.5">
                    <Wind size={12} className="text-[#F472B6]" />
                    <span>Fragrance : {place.fragrance}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Active Place Visual Dossier */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#0F172A] border border-white/10 relative overflow-hidden shadow-2xl">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6 border border-white/10">
                <img src={activePlace.image} alt={activePlace.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/20">
                    {activePlace.distance}
                  </span>
                  <span className="text-[#F472B6]">ACCÈS LIBRE AUX INVITÉS</span>
                </div>
              </div>

              <span className="text-xs font-mono uppercase tracking-widest text-[#38BDF8]">{activePlace.category}</span>
              <h3 className="text-2xl sm:text-3xl font-light text-white mt-1" style={{ fontFamily: '"Playfair Display", serif' }}>
                {activePlace.name}
              </h3>
              <p className="text-sm text-[#94A3B8] mt-3 leading-relaxed font-light">
                {activePlace.desc}
              </p>

              <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-[#94A3B8]">
                <span>Ambiance : Bougies flottantes & lampions d'or</span>
                <span className="text-[#38BDF8] font-mono">Latitude : 48.8566° N</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Surréaliste */}
      <section id="sortilege-rsvp" className="py-24 sm:py-36 px-4 sm:px-8 bg-[#0A101D]">
        <div className="max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl border border-[#38BDF8]/30 bg-[#0F172A] shadow-2xl text-center">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#F472B6]">ENGAGEMENT ONIRIQUE</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-light uppercase tracking-tight text-white" style={{ fontFamily: '"Playfair Display", serif' }}>
            SCELLEZ VOTRE PRÉSENCE
          </h2>
          <p className="mt-2 text-sm text-[#94A3B8] font-light">Quel don invisible ou promesse apportez-vous à Gaspard & Philomène ?</p>

          {rsvpDone ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-[#38BDF8]/20 to-[#F472B6]/20 border border-[#38BDF8] text-white">
              <Check size={28} className="mx-auto text-[#38BDF8]" />
              <div className="text-lg font-light mt-2" style={{ fontFamily: '"Playfair Display", serif' }}>VOTRE SORTILÈGE EST INSCRIT DANS LE LIVRE D'OR</div>
              <p className="text-xs text-[#94A3B8] mt-1 font-mono">« {rsvpGift} »</p>
            </motion.div>
          ) : (
            <div className="mt-8 space-y-4 text-left">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#94A3B8] mb-1 font-semibold">Votre Nom & Prénom</label>
                <input placeholder="ex: Tristan & Iseult" className="w-full px-4 py-3 bg-black/40 border border-white/15 rounded-xl text-sm text-white outline-none focus:border-[#38BDF8]" />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#94A3B8] mb-1 font-semibold">Votre Don Invisible</label>
                <div className="space-y-2">
                  {[
                    'Un vœu silencieux sous la pleine lune',
                    'Une bouteille de vin mystère à ouvrir en 2036',
                    'Une danse extravagante au milieu des fougères',
                  ].map((gift) => (
                    <button
                      key={gift}
                      type="button"
                      onClick={() => setRsvpGift(gift)}
                      className={`w-full p-3 rounded-xl border text-xs text-left transition ${
                        rsvpGift === gift ? 'bg-[#38BDF8]/20 border-[#38BDF8] text-white' : 'bg-black/30 border-white/10 text-[#94A3B8]'
                      }`}
                    >
                      {gift}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setRsvpDone(true)}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#F472B6] text-black text-xs font-bold uppercase tracking-[0.2em] hover:opacity-90 transition mt-4"
              >
                Inscrire mon nom dans le songe
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-xs tracking-[0.2em] uppercase text-[#64748B] border-t border-white/10 bg-[#070B14]">
        GASPARD & PHILOMÈNE — 18.07.2026 // SCÉNOGRAPHIE : MAISON ANOMALIE PAR LE MONDE AIME
      </footer>
    </div>
  );
}
