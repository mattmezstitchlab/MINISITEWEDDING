import { useState } from 'react';
import { PACKAGES_DATA, PackageData } from '../../data/packagesData';
import { ArrowUpRight, Check, Sparkles } from 'lucide-react';

interface PackagesComparisonTableProps {
  onSelectPackage: (id: PackageData['id']) => void;
  selectedPackageId: PackageData['id'];
}

export default function PackagesComparisonTable({ onSelectPackage, selectedPackageId }: PackagesComparisonTableProps) {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Les 12 Packages' },
    { id: 'Coordination & Elopement', label: 'Coordination & Elopement' },
    { id: 'Design & Scénographie', label: 'Design & Scénographie' },
    { id: 'Organisation Globale', label: 'Organisation Globale' },
    { id: 'Haute Couture & Immersion', label: 'Haute Couture & Immersion' },
  ];

  const filteredPackages = filterCategory === 'all'
    ? PACKAGES_DATA
    : PACKAGES_DATA.filter((p) => p.category === filterCategory);

  return (
    <section id="comparatif" className="py-24 sm:py-36 px-4 sm:px-8 bg-[#0D0D10] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-[#C5A059]">
              <Sparkles size={14} />
              <span>GRILLE COMPARATIVE EXHAUSTIVE</span>
            </div>
            <h2 className="mt-3 text-3xl sm:text-5xl font-light tracking-tight text-white uppercase" style={{ fontFamily: '"Cinzel", serif' }}>
              LES 12 PACKAGES CÔTE À CÔTE
            </h2>
          </div>
          <p className="text-sm text-[#A1A1AA] max-w-md font-light leading-relaxed">
            Du micro-wedding intime au festival privé multi-jours de 4 jours, comparez les formats, livrables et budgets d’honoraires de l’agence.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCategory(c.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition ${
                filterCategory === c.id
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/5 border border-white/10 text-[#A1A1AA] hover:text-white hover:border-white/20'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Comparative Responsive Table */}
        <div className="mt-8 overflow-x-auto rounded-3xl border border-white/10 bg-[#121215] shadow-2xl">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-white/10 text-[11px] font-mono uppercase tracking-widest text-[#A1A1AA] bg-black/40">
                <th className="p-5 font-semibold">Package & Direction</th>
                <th className="p-5 font-semibold">Catégorie</th>
                <th className="p-5 font-semibold">Honoraires</th>
                <th className="p-5 font-semibold">Format & Durée</th>
                <th className="p-5 font-semibold">Convives</th>
                <th className="p-5 font-semibold">Modules Mini-Site Inclus</th>
                <th className="p-5 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredPackages.map((pkg) => {
                const isSelected = pkg.id === selectedPackageId;
                return (
                  <tr
                    key={pkg.id}
                    className={`transition group ${
                      isSelected ? 'bg-white/[0.08]' : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={pkg.heroImage}
                          alt={pkg.name}
                          className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                        />
                        <div>
                          <div className="text-[10px] font-mono text-[#C5A059]">{pkg.number} // LE MONDE AIME</div>
                          <div className="text-sm font-semibold text-white group-hover:text-[#C5A059] transition">
                            {pkg.name}
                          </div>
                          <div className="text-[11px] text-[#A1A1AA] font-light truncate max-w-[200px]">
                            {pkg.agencySubtitle}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-white/5 border border-white/10 text-[#D4D4D8] whitespace-nowrap">
                        {pkg.category}
                      </span>
                    </td>

                    <td className="p-5 font-mono text-sm font-bold text-white whitespace-nowrap">
                      {pkg.priceFrom}
                    </td>

                    <td className="p-5 text-[#A1A1AA] font-light whitespace-nowrap">
                      {pkg.duration}
                    </td>

                    <td className="p-5 text-[#A1A1AA] font-mono text-xs whitespace-nowrap">
                      {pkg.guestCount}
                    </td>

                    <td className="p-5">
                      <ul className="space-y-1 text-[11px] text-[#A1A1AA] max-w-[280px]">
                        {pkg.features.slice(0, 2).map((feat, i) => (
                          <li key={i} className="flex items-start gap-1.5 truncate">
                            <span className="text-emerald-400 shrink-0">✓</span>
                            <span className="truncate">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </td>

                    <td className="p-5 text-right">
                      <button
                        onClick={() => onSelectPackage(pkg.id)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
                          isSelected
                            ? 'bg-[#C5A059] text-black shadow-lg font-bold'
                            : 'bg-white/10 hover:bg-white text-white hover:text-black border border-white/15'
                        }`}
                      >
                        <span>{isSelected ? 'Actif' : 'Tester'}</span>
                        <ArrowUpRight size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
