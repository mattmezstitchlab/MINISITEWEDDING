import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, MessageCircle, Mail, MessageSquare, Share2, Eye, EyeOff, Globe, KeyRound, Printer } from 'lucide-react';
import type { WeddingSite } from '../lib/types';
import { publicUrl, publicPath } from '../lib/format';
import { getEditToken } from '../lib/auth';

interface Props {
  site: WeddingSite;
  onPublishedChange: (v: boolean) => void;
}

/** Copie avec repli pour les navigateurs sans `clipboard`. */
async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = value;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}

export default function SharePanel({ site, onPublishedChange }: Props) {
  const [copied, setCopied] = useState<'url' | 'key' | null>(null);
  const [revealKey, setRevealKey] = useState(false);
  const fullUrl = publicUrl(site.slug);
  const url = publicPath(site.slug);
  const editToken = getEditToken({ id: site.id, slug: site.slug });
  const text = encodeURIComponent(`Nous nous marions ! Découvrez notre site : ${fullUrl} — ${site.partner1} & ${site.partner2}`);

  const copy = async (value: string, which: 'url' | 'key') => {
    await copyText(value);
    setCopied(which);
    setTimeout(() => setCopied(null), 2000);
  };

  const channels = [
    { name: 'WhatsApp', icon: MessageCircle, href: `https://wa.me/?text=${text}` },
    { name: 'Messages', icon: MessageSquare, href: `sms:?&body=${text}` },
    { name: 'Email', icon: Mail, href: `mailto:?subject=${encodeURIComponent('Nous nous marions !')}&body=${text}` },
  ];

  return (
    <div className="text-center">
      <span className="vp-glyph mx-auto flex h-14 w-14 items-center justify-center rounded-[20px]">
        <Share2 size={22} strokeWidth={1.8} />
      </span>
      <h3 className="vp-h2 mt-4 text-[24px]">Votre site est prêt.</h3>
      <p className="vp-caption mt-1.5">Partagez-le avec vos invités, partout.</p>

      <div className="vp-glass vp-spec mt-6 rounded-[24px] p-5">
        <div className="vp-eyebrow">Votre adresse personnalisée</div>
        <div className="vp-num mt-2 break-all text-[19px] font-semibold tracking-tight">{url}</div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button onClick={() => copy(fullUrl, 'url')} className="vp-btn vp-press !py-3 !text-[13.5px]">
            {copied === 'url' ? <Check size={16} strokeWidth={2.5} /> : <Copy size={16} />}{copied === 'url' ? 'Copié' : 'Copier le lien'}
          </button>
          {/* Pas de `?preview=1` : c’est la clé d’édition de ce navigateur qui
              autorise l’aperçu d’un brouillon. */}
          <Link to={`/p/${site.slug}`} target="_blank" className="vp-btn vp-btn-glass vp-press !py-3 !text-[13.5px]">
            <Eye size={16} /> Prévisualiser
          </Link>
        </div>
      </div>

      <div className="vp-glass vp-spec mt-4 rounded-[24px] p-5 text-left">
        <div className="vp-eyebrow"><KeyRound size={13} className="mr-1 inline" />Clé d’édition</div>
        {editToken ? (
          <>
            <div className="vp-num mt-2 break-all text-[14px] font-semibold">
              {revealKey ? editToken : `${editToken.slice(0, 6)}${'•'.repeat(18)}`}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button onClick={() => copy(editToken, 'key')} className="vp-btn vp-btn-glass vp-press !py-2.5 !text-[12.5px]">
                {copied === 'key' ? <Check size={15} strokeWidth={2.5} /> : <Copy size={15} />}{copied === 'key' ? 'Copiée' : 'Copier'}
              </button>
              <button onClick={() => setRevealKey((v) => !v)} className="vp-btn vp-btn-glass vp-press !py-2.5 !text-[12.5px]">
                {revealKey ? <EyeOff size={15} /> : <Eye size={15} />}{revealKey ? 'Masquer' : 'Afficher'}
              </button>
            </div>
            <p className="vp-caption mt-3 !text-[11.5px] leading-relaxed">
              Cette clé donne accès à l’éditeur et aux réponses des invités. Envoyez-la à l’autre membre du couple
              par un canal privé pour éditer depuis son téléphone — elle n’est jamais affichée sur le site public.
            </p>
          </>
        ) : (
          <p className="vp-caption mt-2 !text-[11.5px] leading-relaxed">
            Ce site a été créé avant la mise en place des clés, ou depuis un autre appareil.
            Générez-en une dans la base, puis saisissez-la ici ou sur <code className="vp-num">/editeur/{site.id}</code> :
            la marche à suivre est dans <code className="vp-num">supabase/schema.sql</code>,
            section « Exploitation des clés d’édition ».
          </p>
        )}
      </div>

      <div className="vp-glass vp-spec mt-4 rounded-[24px] p-6">
        <div className="inline-block rounded-[14px] border border-black/8 bg-white p-4">
          <QRCodeSVG value={fullUrl} size={160} fgColor="#0B0C12" level="M" />
        </div>
        <div className="vp-caption mt-3">QR code élégant, prêt à imprimer<br />sur vos invitations papier.</div>
        <button onClick={() => window.print()} className="vp-press mt-3 inline-flex items-center gap-2 text-[13px] font-medium text-[var(--vp-ink-soft)] underline underline-offset-4 transition hover:text-[var(--vp-accent)]">
          <Printer size={14} /> Imprimer le QR code
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {channels.map((c) => (
          <a key={c.name} href={c.href} target="_blank" rel="noreferrer" className="vp-glass vp-lift flex flex-col items-center gap-1.5 rounded-[16px] py-4">
            <c.icon size={19} strokeWidth={1.75} className="text-[var(--vp-ink)]" />
            <span className="text-[12px] font-semibold">{c.name}</span>
          </a>
        ))}
      </div>

      <button onClick={() => onPublishedChange(!site.published)} className="vp-btn vp-press mt-4 w-full !py-4">
        <Globe size={16} />{site.published ? 'Site publié — cliquer pour suspendre' : 'Publier mon site'}
      </button>
      {!site.published && <p className="vp-caption mt-2 !text-[12px]">Votre site est en brouillon, visible uniquement par vous.</p>}
    </div>
  );
}
