import { useState } from 'react';
import { imageDeRepli, type ShopProduct } from '../lib/shopData';

/**
 * LE VISUEL D'UNE PIÈCE
 *
 * Chaque objet du shop a son propre visuel. Tant que le fichier n'est pas
 * livré, la carte retombe sur celui de sa catégorie — jamais de case vide.
 */
export default function ShopImage({ produit, className = '' }: { produit: ShopProduct; className?: string }) {
  const [src, setSrc] = useState(produit.image);
  return (
    <img
      src={src}
      alt={produit.name}
      loading="lazy"
      className={className}
      onError={() => {
        const repli = imageDeRepli(produit);
        setSrc((actuel) => (actuel === repli ? actuel : repli));
      }}
    />
  );
}
