import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, ShieldAlert } from 'lucide-react';
import { forgetEditToken, saveEditToken } from '../../lib/auth';

interface Props {
  /** Identifiant du site, tel que présent dans l’URL de l’éditeur. */
  siteId?: string;
  /** Une clé était enregistrée mais l’API l’a refusée (révoquée ou modifiée). */
  invalid?: boolean;
}

/**
 * Éditeur verrouillé.
 *
 * Deux cas : ce navigateur n’a jamais reçu la clé (création faite ailleurs,
 * stockage effacé), ou la clé enregistrée a été révoquée. Dans les deux cas,
 * saisir une clé valide redonne l’accès — c’est aussi le chemin prévu pour le
 * second membre du couple.
 */
export default function NoAccess({ siteId, invalid }: Props) {
  const [key, setKey] = useState('');

  const submit = () => {
    const value = key.trim();
    if (!value || !siteId) return;
    saveEditToken({ id: siteId }, value);
    window.location.reload();
  };

  const reset = () => {
    if (!siteId) return;
    forgetEditToken({ id: siteId });
    window.location.reload();
  };

  return (
    <div className="vp-env flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      <span className="vp-glass vp-spec flex h-16 w-16 items-center justify-center rounded-[22px]">
        <ShieldAlert size={28} strokeWidth={1.6} className="text-[var(--vp-muted)]" />
      </span>

      <h1 className="vp-h2 mt-6 text-[26px]">Cet éditeur est protégé.</h1>
      <p className="vp-body mx-auto mt-3 max-w-md">
        {invalid
          ? 'La clé d’édition enregistrée dans ce navigateur a été refusée. Elle a probablement été révoquée ou remplacée.'
          : 'Chaque site de mariage possède une clé d’édition. Ce navigateur ne la connaît pas encore : sans elle, personne ne peut modifier un site ni lire les réponses des invités.'}
      </p>

      <div className="vp-glass vp-spec mt-8 w-full max-w-md rounded-[26px] p-6 text-left">
        <label className="vp-label" htmlFor="edit-key">
          <KeyRound size={13} className="mr-1 inline" /> Clé d’édition
        </label>
        <input
          id="edit-key"
          className="vp-field vp-num !text-[14px]"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
          placeholder="Collez la clé reçue à la création du site"
          autoComplete="off"
          spellCheck={false}
        />
        <button onClick={submit} disabled={!key.trim() || !siteId} className="vp-btn vp-press mt-4 w-full !py-3.5 !text-[14px]">
          Déverrouiller l’éditeur
        </button>
        {invalid && (
          <button onClick={reset} className="vp-caption mt-3 w-full !text-[12px] underline underline-offset-4 transition hover:text-[var(--vp-ink)]">
            Oublier la clé enregistrée
          </button>
        )}
      </div>

      <p className="vp-caption mx-auto mt-6 max-w-md !text-[12px] leading-relaxed">
        La clé est affichée dans le panneau « Partager » de l’éditeur, sur un navigateur qui la possède déjà.
        Si vous l’avez définitivement perdue, elle se réinitialise dans la base —
        voir <code className="vp-num">supabase/schema.sql</code>, section « Exploitation des clés d’édition ».
      </p>

      <Link to="/creer" className="vp-btn vp-btn-glass vp-press mt-8 !px-6">Créer un nouveau site</Link>
    </div>
  );
}
