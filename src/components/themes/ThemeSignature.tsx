import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { ThemeSignature } from '../../lib/themeSignatures';

/**
 * LE MODULE DE SIGNATURE
 *
 * Le geste d'un univers, posé juste sous le hero de son mini-site. Huit gestes
 * possibles — l'enseigne néon, l'affiche, le faire-part, les étiquettes, la
 * ligne, le plan, le hublot, la marée — et pour chacun, les mots de l'univers :
 * ses horaires, son lieu, sa tenue.
 *
 * Le module ne remplace aucune section : il ajoute ce que l'univers a de plus
 * que les autres, et la page continue ensuite comme avant.
 */

function Lignes({ signature, inversees = false }: { signature: ThemeSignature; inversees?: boolean }) {
  return (
    <div className="space-y-2">
      {signature.module.lignes.map((ligne) => (
        <div
          key={ligne.label}
          className="flex items-baseline justify-between gap-4 border-b border-dashed pb-1.5 last:border-none"
          style={{ borderColor: inversees ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)' }}
        >
          <span
            className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em]"
            style={{ color: inversees ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}
          >
            {ligne.label}
          </span>
          <span className="text-right text-[13.5px] font-medium leading-snug">{ligne.valeur}</span>
        </div>
      ))}
    </div>
  );
}

function Eyebrow({ children, accent }: { children: ReactNode; accent: string }) {
  return (
    <span
      className="font-mono text-[10px] font-bold uppercase tracking-[0.24em]"
      style={{ color: accent }}
    >
      {children}
    </span>
  );
}

/* ————————————————————————————— les huit gestes ————————————————————————————— */

function Enseigne({ s }: { s: ThemeSignature }) {
  const sombre = s.encre === '#F3F1FF' || s.encre === '#EAEBFF';
  return (
    <div
      className="relative overflow-hidden rounded-[26px] border-2 px-6 py-9 text-center sm:px-10"
      style={{
        borderColor: s.accent,
        background: sombre ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.5)',
        boxShadow: `0 0 60px -18px ${s.accent}, inset 0 0 40px -22px ${s.accent}`,
      }}
    >
      {/* Les ampoules de l'enseigne */}
      <div className="pointer-events-none absolute inset-x-4 top-2 flex justify-between" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: s.accent, opacity: i % 2 === 0 ? 1 : 0.35, boxShadow: `0 0 10px ${s.accent}` }}
          />
        ))}
      </div>

      <Eyebrow accent={s.accent}>{s.module.eyebrow}</Eyebrow>

      <div
        className="mt-4 font-black uppercase leading-[0.95]"
        style={{
          fontSize: 'clamp(1.9rem, 6vw, 3.1rem)',
          letterSpacing: '0.02em',
          color: s.accent,
          textShadow: `0 0 18px ${s.accent}, 0 0 46px ${s.accent}80`,
        }}
      >
        {s.module.titre}
      </div>

      <div className="mx-auto mt-7 max-w-[560px] text-left">
        <Lignes signature={s} inversees={sombre} />
      </div>

      <p className="mt-4 text-[12.5px] opacity-70">{s.module.note}</p>
    </div>
  );
}

function Affiche({ s }: { s: ThemeSignature }) {
  return (
    <div className="relative overflow-hidden rounded-[18px] border-2 border-black/85 p-6 sm:p-9">
      <div className="absolute inset-x-0 top-0 h-2" style={{ background: s.accent }} aria-hidden="true" />
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <Eyebrow accent={s.accent}>{s.module.eyebrow}</Eyebrow>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-45">Affiche officielle</span>
      </div>

      <h3
        className="mt-5 font-black uppercase leading-[0.9]"
        style={{ fontSize: 'clamp(2rem, 6.5vw, 3.6rem)', letterSpacing: '-0.02em' }}
      >
        {s.module.titre}
      </h3>

      <div className="mt-7 grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <Lignes signature={s} />
        <span
          className="hidden h-24 w-24 shrink-0 rounded-full sm:block"
          style={{ background: s.accent, opacity: 0.9 }}
          aria-hidden="true"
        />
      </div>

      <p className="mt-5 border-t border-black/15 pt-3 font-mono text-[11px] uppercase tracking-[0.12em] opacity-60">
        {s.module.note}
      </p>
    </div>
  );
}

function FairePart({ s }: { s: ThemeSignature }) {
  return (
    <div className="mx-auto max-w-[720px] rounded-[10px] border px-6 py-10 text-center sm:px-12" style={{ borderColor: `${s.accent}66` }}>
      <div className="mx-auto h-px w-16" style={{ background: s.accent }} aria-hidden="true" />
      <div className="mt-5">
        <Eyebrow accent={s.accent}>{s.module.eyebrow}</Eyebrow>
      </div>

      <h3
        className="mx-auto mt-4 max-w-[520px] text-[26px] leading-tight sm:text-[36px]"
        style={{ fontFamily: 'var(--vp-font-heading, inherit)', fontWeight: 600, letterSpacing: '-0.01em' }}
      >
        {s.module.titre}
      </h3>

      <div className="mx-auto mt-8 max-w-[520px] text-left">
        <Lignes signature={s} />
      </div>

      <p className="mt-6 text-[12.5px] italic opacity-70">{s.module.note}</p>
      <div className="mx-auto mt-6 h-px w-16" style={{ background: s.accent }} aria-hidden="true" />
    </div>
  );
}

function Etiquettes({ s }: { s: ThemeSignature }) {
  return (
    <div className="mx-auto max-w-[860px]">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <Eyebrow accent={s.accent}>{s.module.eyebrow}</Eyebrow>
        <h3 className="text-[18px] font-semibold">{s.module.titre}</h3>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {s.module.lignes.map((ligne, i) => (
          <motion.div
            key={ligne.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="relative rounded-[14px] border px-4 pb-5 pt-7 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.5)]"
            style={{
              borderColor: `${s.accent}55`,
              background: 'rgba(255,255,255,0.72)',
              transform: `rotate(${(i - 1) * 1.2}deg)`,
            }}
          >
            {/* La ficelle de l'étiquette */}
            <span
              className="absolute left-1/2 top-2 h-3 w-px -translate-x-1/2"
              style={{ background: `${s.accent}88` }}
              aria-hidden="true"
            />
            <div className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: s.accent }}>
              {ligne.label}
            </div>
            <div className="mt-1.5 text-[13.5px] leading-snug">{ligne.valeur}</div>
          </motion.div>
        ))}
      </div>

      <p className="mt-4 text-[12.5px] opacity-65">{s.module.note}</p>
    </div>
  );
}

function LigneDeVie({ s }: { s: ThemeSignature }) {
  return (
    <div className="rounded-[22px] border px-6 py-8 sm:px-10" style={{ borderColor: 'rgba(0,0,0,0.12)' }}>
      <Eyebrow accent={s.accent}>{s.module.eyebrow}</Eyebrow>

      <div className="mt-6 flex items-baseline justify-between gap-4">
        <h3 className="text-[22px] font-semibold sm:text-[28px]">{s.module.titre}</h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-45">Sens de la marche</span>
      </div>

      {/* La ligne : des stations, une par horaire */}
      <div className="relative mt-8 pb-2">
        <span
          className="absolute left-0 right-0 top-[9px] h-[3px] rounded-full"
          style={{ background: s.accent }}
          aria-hidden="true"
        />
        <div className="relative flex justify-between gap-2">
          {s.module.lignes.map((ligne, i) => (
            <div key={ligne.label} className="flex min-w-0 flex-1 flex-col items-center text-center">
              <span
                className="h-[21px] w-[21px] rounded-full border-[3px] bg-white"
                style={{ borderColor: i === 0 ? s.accent : `${s.accent}88` }}
                aria-hidden="true"
              />
              <span className="mt-2 font-mono text-[10.5px] font-bold" style={{ color: s.accent }}>
                {ligne.label}
              </span>
              <span className="mt-0.5 text-[12px] leading-snug opacity-80">{ligne.valeur}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-[12.5px] opacity-65">{s.module.note}</p>
    </div>
  );
}

function Plan({ s }: { s: ThemeSignature }) {
  return (
    <div
      className="relative overflow-hidden rounded-[18px] border p-6 sm:p-9"
      style={{
        borderColor: 'rgba(0,0,0,0.2)',
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)',
        backgroundSize: '26px 26px',
      }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <Eyebrow accent={s.accent}>{s.module.eyebrow}</Eyebrow>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-45">Cotes en mètres</span>
      </div>

      <h3 className="mt-4 text-[22px] font-semibold uppercase tracking-tight sm:text-[28px]">
        {s.module.titre}
      </h3>

      <div className="mt-6 space-y-3">
        {s.module.lignes.map((ligne) => (
          <div key={ligne.label} className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-50">{ligne.label}</span>
            <span className="h-px flex-1" style={{ background: `${s.accent}55` }} aria-hidden="true" />
            <span className="text-[13px]">{ligne.valeur}</span>
            <span className="font-mono text-[10px]" style={{ color: s.accent }}>
              ⟷
            </span>
          </div>
        ))}
      </div>

      <p className="mt-6 border-t border-dashed border-black/20 pt-3 font-mono text-[11px] opacity-60">
        {s.module.note}
      </p>
    </div>
  );
}

function Hublot({ s }: { s: ThemeSignature }) {
  return (
    <div className="mx-auto flex max-w-[880px] flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-12">
      {/* Le hublot */}
      <div className="relative h-[190px] w-[190px] shrink-0">
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-dashed"
          style={{ borderColor: `${s.accent}66` }}
          animate={{ rotate: 360 }}
          transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
          aria-hidden="true"
        />
        <span
          className="absolute inset-4 rounded-full border"
          style={{ borderColor: `${s.accent}44`, background: 'rgba(255,255,255,0.5)' }}
          aria-hidden="true"
        />
        <span
          className="absolute inset-10 rounded-full"
          style={{ background: `radial-gradient(circle at 35% 30%, ${s.accent}55, transparent 70%)` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <Eyebrow accent={s.accent}>{s.module.eyebrow.split('·')[0]}</Eyebrow>
          <span className="mt-1 font-mono text-[11px] opacity-60">
            {s.module.eyebrow.split('·')[1]?.trim()}
          </span>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-[22px] font-semibold sm:text-[28px]">{s.module.titre}</h3>
        <div className="mt-5">
          <Lignes signature={s} />
        </div>
        <p className="mt-4 text-[12.5px] opacity-65">{s.module.note}</p>
      </div>
    </div>
  );
}

function Maree({ s }: { s: ThemeSignature }) {
  return (
    <div className="mx-auto max-w-[820px]">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <Eyebrow accent={s.accent}>{s.module.eyebrow}</Eyebrow>
        <h3 className="text-[20px] font-semibold sm:text-[26px]">{s.module.titre}</h3>
      </div>

      {/* La ligne d'horizon */}
      <div className="relative mt-6">
        <span className="absolute inset-x-0 top-1/2 h-px border-t border-dashed" style={{ borderColor: `${s.accent}66` }} aria-hidden="true" />
        <div className="relative grid gap-3 sm:grid-cols-3">
          {s.module.lignes.map((ligne, i) => (
            <div
              key={ligne.label}
              className="rounded-[14px] px-4 py-3"
              style={{
                background: 'rgba(255,255,255,0.7)',
                marginTop: `${Math.abs(i - 1) * 14}px`,
              }}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: s.accent }}>
                {ligne.label}
              </div>
              <div className="mt-1 text-[13px] leading-snug">{ligne.valeur}</div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-[12.5px] opacity-65">{s.module.note}</p>
    </div>
  );
}

const GESTES: Record<ThemeSignature['kind'], (p: { s: ThemeSignature }) => ReactNode> = {
  enseigne: Enseigne,
  affiche: Affiche,
  'faire-part': FairePart,
  etiquettes: Etiquettes,
  ligne: LigneDeVie,
  plan: Plan,
  hublot: Hublot,
  maree: Maree,
};

/**
 * Le module de signature, prêt à poser sous le hero. Sans signature — c'est le
 * cas de l'univers vierge — il ne rend rien : c'est exactement sa promesse.
 */
export default function SignatureBlock({ signature }: { signature?: ThemeSignature }) {
  if (!signature) return null;
  const Geste = GESTES[signature.kind];
  return (
    <section
      className={`relative px-5 py-16 sm:px-10 sm:py-24 ${signature.lueur ? 'vp-sg-lueur' : ''}`}
      data-signature={signature.kind}
    >
      <div className="mx-auto max-w-[900px]">
        <Geste s={signature} />
      </div>
    </section>
  );
}
