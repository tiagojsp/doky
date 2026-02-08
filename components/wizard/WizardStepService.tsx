import React, { useState } from 'react';
import { Service, EstablishmentSettings } from '../../types';
import { Clock, ChevronRight, Search } from 'lucide-react';
import { useTerminology } from '../../hooks/useTerminology';

interface Props {
    services: Service[];
    onSelect: (service: Service) => void;
    settings?: EstablishmentSettings | null;
}

export const WizardStepService: React.FC<Props> = ({ services, onSelect, settings }) => {
    const categories = Array.from(new Set(services.map(s => s.category)));
    const [activeCategory, setActiveCategory] = useState<string>(categories[0]);
    const { t } = useTerminology(settings);

    const filteredServices = services.filter(s => s.category === activeCategory);

    return (
        <div className="w-full max-w-6xl mx-auto h-full flex flex-col md:flex-row gap-6 md:gap-8 min-h-[500px]">
            {/* Category Tabs (Sidebar) */}
            <div className="w-full md:w-64 flex flex-col gap-4 shrink-0">
                {/* Categories */}
                <div className="flex gap-3 overflow-x-auto pb-6 custom-scrollbar snap-x">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`
                                px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap snap-center
                                ${activeCategory === cat
                                    ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30 scale-105 ring-2 ring-white/50'
                                    : 'bg-white/40 backdrop-blur-md border border-white/40 text-slate-600 hover:bg-white/60 hover:text-[var(--color-primary)]'
                                }
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Services Grid */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-24">
                    {filteredServices.map((service, idx) => (
                        <button
                            key={service.id}
                            onClick={() => onSelect(service)}
                            className="
                                group relative flex flex-col items-start p-5 rounded-2xl text-left transition-all duration-300
                                bg-white/60 backdrop-blur-md border border-white/50 shadow-sm
                                hover:bg-white/80 hover:shadow-xl hover:shadow-[var(--color-primary)]/10 hover:-translate-y-1 hover:border-[var(--color-primary)]/50
                                active:scale-[0.98]
                            "
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <div className="w-full flex justify-between items-start mb-2">
                                <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-[var(--color-primary)] transition-colors">
                                    {service.name}
                                </h3>
                                <span className="text-[var(--color-primary)] font-bold bg-[var(--color-primary)]/10 px-2 py-1 rounded-lg text-xs md:text-sm">
                                    {service.price}€
                                </span>
                            </div>

                            <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed w-full">
                                {service.description || t('service_subtitle')}
                            </p>

                            <div className="mt-auto flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <span className="flex items-center gap-1 text-slate-600 bg-slate-100/60 px-2 py-1 rounded-lg">
                                    <Clock size={12} className="md:w-[14px] md:h-[14px]" /> {service.duration} min
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
