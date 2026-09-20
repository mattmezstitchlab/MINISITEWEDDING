/**
 * LE CALENDRIER, EN NOMS — la seule liste des douze mois.
 *
 * Elle vivait dans `couvertureDuJour.ts` ; elle déménage ici parce que **deux
 * modules en ont besoin en même temps** : la couverture (qui écrit la date en
 * bas) et les profils éditoriaux (qui datent le personnage du jour). Sans ça,
 * les deux s'importaient l'un l'autre.
 */

export const MOIS_LONGS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

export const MOIS: Array<{ numero: number; nom: string }> = MOIS_LONGS.map((nom, i) => ({ numero: i + 1, nom }));
