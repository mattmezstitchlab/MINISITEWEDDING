/**
 * LA PHOTO DE LA CARTE
 *
 * Prise dans l'appareil, recadrée en carré et réduite **avant** d'entrer dans
 * la carte : une photo de téléphone pèse quatre mégaoctets, la carte en garde
 * une version de quelques dizaines de kilo-octets. Le recadrage privilégie le
 * haut du cadre — c'est là qu'est le visage.
 *
 * Rien n'est inventé : si la personne n'a pas mis de photo, la carte affiche
 * ses initiales. On ne remplace jamais un visage par une image de quelqu'un
 * d'autre.
 */

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Lecture impossible'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Image illisible'));
    image.src = src;
  });
}

export async function prepareCardPhoto(file: File, size = 512): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Seules les images sont acceptées.');

  const dataUrl = await readAsDataUrl(file);
  if (typeof document === 'undefined') return dataUrl;

  try {
    const image = await loadImage(dataUrl);
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return dataUrl;

    const ratio = Math.max(size / image.width, size / image.height);
    const largeur = image.width * ratio;
    const hauteur = image.height * ratio;
    const dx = (size - largeur) / 2;
    // Léger biais vers le haut : on garde le visage, pas le plafond.
    const dy = (size - hauteur) * 0.25;

    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(image, dx, dy, largeur, hauteur);

    const reduite = canvas.toDataURL('image/jpeg', 0.82);
    return reduite.length < dataUrl.length ? reduite : dataUrl;
  } catch {
    return dataUrl;
  }
}
