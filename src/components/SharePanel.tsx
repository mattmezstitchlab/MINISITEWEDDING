import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, MessageCircle, Mail, MessageSquare, Share2, Eye, Globe, Printer } from 'lucide-react';
import type { WeddingSite } from '../lib/types';

interface Props {
  site: WeddingSite;
  onPublishedChange: (v: boolean) => void;
}

export default function SharePanel({ site, onPublishedChange }: Props) {
  const [copied, setCopied] = useState(false);
  const url = `${site.slug}.byaime.fr`;
  const fullUrl = `https://${url}`;
  const text = encodeURIComponent(`Nous nous marions ! Découvrez notre site : ${fullUrl} — ${site.partner1} & ${site.partner2}`);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = fullUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <button onClick={copy} className="vp-btn vp-press !py-3 !text-[13.5px]">
            {copied ? <Check size={16} strokeWidth={2.5} /> : <Copy size={16} />}{copied ? 'Copié' : 'Copier le lien'}
          </button>
          <Link to={`/p/${site.slug}`} target="_blank" className="vp-btn vp-btn-glass vp-press !py-3 !text-[13.5px]">
            <Eye size={16} /> Prévisualiser
          </Link>
        </div>
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
