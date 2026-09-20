# -*- coding: utf-8 -*-
p='src/pages/Landing.tsx'
s=open(p,encoding='utf-8').read()

old = """import BandeDuHero from '../components/BandeDuHero';"""
new = """import BandeDuHero from '../components/BandeDuHero';
import ChampDuMagazine from '../components/ChampDuMagazine';"""
assert s.count(old)==1
s=s.replace(old,new)

old = """          <div className="flex flex-col items-center text-center">
            <span className="vp-eyebrow !text-white/70">Qui êtes-vous dans ce mariage ?</span>"""
new = """          <div className="flex flex-col items-center text-center">
            {/* LE CHAMP DU MAGAZINE : la première chose qu'on voit, avant le
                titre. On demande le strict nécessaire — les deux prénoms, la
                date — et le magazine commence. Sans réponse, c'est le magazine
                du jour : il y a toujours quelque chose à ouvrir. */}
            <ChampDuMagazine className="mb-8 sm:mb-10" />

            <span className="vp-eyebrow !text-white/70">Qui êtes-vous dans ce mariage ?</span>"""
assert s.count(old)==1
s=s.replace(old,new)
open(p,'w',encoding='utf-8').write(s)
print('Landing : champ ajouté en tête du hero')

p='src/pages/Onboarding.tsx'
s=open(p,encoding='utf-8').read()
old = """/** Ce que l'accueil transmet : l'univers et le rôle déjà choisis dans le hero. */
function useEntryState(): { preselectedStyle: string; roleId: string } {
  const state = useLocation().state as { preselectedStyle?: string; roleId?: string } | null;
  return {
    preselectedStyle: typeof state?.preselectedStyle === 'string' ? state.preselectedStyle : '',
    roleId: typeof state?.roleId === 'string' ? state.roleId : '',
  };
}"""
new = """/**
 * Ce que l'accueil transmet : le rôle et l'univers déjà choisis dans le hero,
 * **et les réponses du champ du magazine** — les deux prénoms et la date, écrits
 * dans la première vue. Ce qui est déjà répondu ne se redemande pas.
 */
function useEntryState(): {
  preselectedStyle: string;
  roleId: string;
  partner1: string;
  partner2: string;
  weddingDate: string;
} {
  const state = useLocation().state as {
    preselectedStyle?: string;
    roleId?: string;
    partner1?: string;
    partner2?: string;
    weddingDate?: string;
  } | null;
  const net = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  return {
    preselectedStyle: net(state?.preselectedStyle),
    roleId: net(state?.roleId),
    partner1: net(state?.partner1),
    partner2: net(state?.partner2),
    weddingDate: net(state?.weddingDate),
  };
}"""
assert s.count(old)==1
s=s.replace(old,new)

old = """    return {
      ...base,
      access: accessFromRole(entree.roleId),
      styleId: entree.preselectedStyle || base.styleId,
    };"""
new = """    return {
      ...base,
      // Ce qui vient de l'accueil gagne : c'est la réponse la plus récente.
      partner1: entree.partner1 || base.partner1,
      partner2: entree.partner2 || base.partner2,
      date: entree.weddingDate || base.date,
      access: accessFromRole(entree.roleId),
      styleId: entree.preselectedStyle || base.styleId,
    };"""
assert s.count(old)==1
s=s.replace(old,new)

old = """            L’univers, lui, se choisit dans l’éditeur : vous le découvrirez sur
            votre site.
          </p>"""
new = """            L’univers, lui, se choisit dans l’éditeur : vous le découvrirez sur
            votre site.
          </p>
          {entree.partner1 && (
            <p className="mt-4 inline-block rounded-full border border-white/25 px-3 py-1.5 text-[12px] font-semibold text-white/85">
              Déjà répondu dans l’accueil : {(entree.partner1 + (entree.partner2 ? ` & ${entree.partner2}` : '')).trim()}
              {entree.weddingDate ? ` · ${entree.weddingDate}` : ''}
            </p>
          )}"""
assert s.count(old)==1
s=s.replace(old,new)
open(p,'w',encoding='utf-8').write(s)
print('Onboarding : reprend les réponses de l’accueil')
