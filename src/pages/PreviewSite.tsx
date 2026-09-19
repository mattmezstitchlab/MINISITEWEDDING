import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PublicSiteView from '../components/PublicSiteView';
import { buildPreviewSite } from '../lib/previewSite';
import { WEDDING_STYLES } from '../lib/weddingStyles';

/**
 * L'APERÇU DU MINI-SITE
 *
 * La même page que le site public, montée avec un mariage d'exemple : c'est ce
 * que montrent l'accueil et l'éditeur, dans une fenêtre à part pour que la mise
 * en page se comporte exactement comme le vrai site (mêmes points de rupture,
 * mêmes images plein écran).
 */
export default function PreviewSite() {
  const [params] = useSearchParams();
  const styleId = params.get('style') ?? WEDDING_STYLES[0].id;

  const data = useMemo(
    () =>
      buildPreviewSite({
        styleId,
        typography: params.get('typo') ?? undefined,
        accent: params.get('accent') ? `#${params.get('accent')}` : undefined,
        buttonStyle: params.get('bouton') ?? undefined,
      }),
    [styleId, params],
  );

  return (
    <div className="vp-env min-h-screen">
      <PublicSiteView data={data} />
    </div>
  );
}
