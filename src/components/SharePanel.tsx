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
      <div className="mx-auto w-14 h-14 rounded-full bg-neutral-900 text-white flex items-center justify-center"><Share2 size={22} strokeWidth={1.75} /></div>
      <h3 className="mt-4 text-2xl font-light" style={{ fontFamily: '"Playfair Display", "Cormorant Garamond", Georgia, serif' }}>Votre site est prêt.</h3>
      <p className="mt-1.5 text-sm text-neutral-500">Partagez-le avec vos invités, partout.</p>
      <div className="mt-6 p-5 rounded-2xl bg-white border border-black/10">
        <div className="text-[11px] tracking-[0.25em] uppercase text-neutral-400">Votre adresse personnalisée</div>
        <div className="mt-2 text-xl font-medium tabular-nums break-all" style={{ fontFamily: '"Playfair Display", "Cormorant Garamond", Georgia, serif' }}>{url}</div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button onClick={copy} className="flex items-center justify-center gap-2 py-3 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition">
            {copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copié' : 'Copier le lien'}
          </button>
          <Link to={`/p/${site.slug}`} target="_blank" className="flex items-center justify-center gap-2 py-3 rounded-full border border-black/15 text-sm font-medium hover:border-black/40 transition">
            <Eye size={16} /> Prévisualiser
          </Link>
        </div>
      </div>
      <div className="mt-4 p-6 rounded-2xl bg-white border border-black/10">
        <div className="inline-block p-4 bg-white rounded-2xl border border-black/10 shadow-sm">
          <QRCodeSVG value={fullUrl} size={160} fgColor="#1A1A1A" level="M" />
        </div>
        <div className="mt-3 text-[13px] text-neutral-500">QR code élégant, prêt à imprimer<br />sur vos invitations papier.</div>
        <button onClick={() => window.print()} className="mt-3 inline-flex items-center gap-2 text-[13px] text-neutral-600 underline underline-offset-4 hover:text-black"><Printer size={14} /> Imprimer le QR code</button>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {channels.map((c) => (
          <a key={c.name} href={c.href} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1.5 py-4 rounded-2xl bg-white border border-black/10 hover:border-black/40 transition">
            <c.icon size={19} strokeWidth={1.75} />
            <span className="text-[12px] font-medium">{c.name}</span>
          </a>
        ))}
      </div>
      <button onClick={() => onPublishedChange(!site.published)} className={`mt-4 w-full py-4 rounded-full text-sm font-medium tracking-wide transition flex items-center justify-center gap-2 ${site.published ? 'bg-emerald-600 text-white' : 'bg-neutral-900 text-white hover:bg-neutral-700'}`}>
        <Globe size={16} />{site.published ? 'Site publié — cliquer pour suspendre' : 'Publier mon site'}
      </button>
      {!site.published && <p className="mt-2 text-[12px] text-neutral-400">Votre site est en brouillon, visible uniquement par vous.</p>}
    </div>
  );
}
