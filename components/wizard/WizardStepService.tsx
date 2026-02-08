import React, { useState, useEffect } from 'react';
import { Service, EstablishmentSettings } from '../../types';
import { Clock, Search, Heart, Activity, Sparkles, ChevronRight, Stethoscope } from 'lucide-react';
import { useTerminology } from '../../hooks/useTerminology';

interface Props {
    services: Service[];
    onSelect: (service: Service) => void;
    settings?: EstablishmentSettings | null;
}

// Map categories to icons
const CATEGORY_ICONS: Record<string, any> = {
    'Diagnóstico': Search,
    'Terapia': Heart,
    'Bem-estar': Sparkles,
    'Fisioterapia': Activity,
    'Saúde': Stethoscope,
    'Geral': Activity
};

export const WizardStepService: React.FC<Props> = ({ services, onSelect, settings }) => {
    const { t } = useTerminology(settings);

    // 1. Filter services to show only those available online
    const onlineServices = services.filter(s => s.isOnline);

    // 2. Derive categories from ONLY online services
    const categories = Array.from(new Set(onlineServices.map(s => s.category?.trim() || 'Geral')));

    // 3. Keep track of active category, defaulting to first available
    const [activeCategory, setActiveCategory] = useState<string>(categories[0] || '');

    // Ensure active category is valid if categories change
    useEffect(() => {
        if (categories.length > 0 && !categories.includes(activeCategory)) {
            setActiveCategory(categories[0]);
        }
    }, [categories, activeCategory]);

    // 4. Filter online services by selected category
    const filteredServices = onlineServices.filter(s => (s.category?.trim() || 'Geral') === activeCategory);

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8 min-h-[500px] animate-fade-in-up">
            {/* Category Sidebar */}
            <div className="w-full md:w-72 flex flex-col shrink-0">
                <div className="mb-6 ml-2 text-shadow-sm">
                    <h3 className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                        Explorar
                    </h3>
                    <h2 className="text-white text-2xl font-black font-heading tracking-tight">
                        Categorias
                    </h2>
                </div>

                {/* Horizontal on mobile, Vertical on desktop */}
                <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto pb-6 md:pb-24 p-3 -m-3 no-scrollbar snap-x">
                    {categories.map((cat) => {
                        const Icon = CATEGORY_ICONS[cat] || CATEGORY_ICONS['Geral'];
                        const isActive = activeCategory === cat;

                        return (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`
                                    group relative flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-500 whitespace-nowrap snap-center text-left
                                    ${isActive
                                        ? 'bg-white/10 backdrop-blur-2xl text-white scale-[1.02] border border-white/40 ring-1 ring-white/20'
                                        : 'bg-black/10 backdrop-blur-md border border-white/5 text-white/60 hover:bg-black/20 hover:text-white'
                                    }
                                `}
                            >
                                <div className={`
                                    p-2 rounded-xl transition-colors duration-500
                                    ${isActive ? 'bg-doky-action-cyan/10 text-doky-action-cyan' : 'bg-white/5 text-white/40 group-hover:text-white/60'}
                                `}>
                                    <Icon size={18} />
                                </div>
                                <span className="flex-1">{cat}</span>
                                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-doky-action-cyan shadow-[0_0_8px_rgba(0,194,224,0.6)]"></div>}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Services Grid */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar md:pt-1">
                {filteredServices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-32">
                        {filteredServices.map((service, idx) => (
                            <button
                                key={service.id}
                                onClick={() => onSelect(service)}
                                className="
                                    group relative flex flex-col items-start p-7 rounded-[2rem] text-left transition-all duration-700
                                    bg-black/20 backdrop-blur-xl border border-white/10
                                    hover:bg-black/30 hover:-translate-y-1 hover:border-white/20 hover:shadow-glass
                                    active:scale-[0.98]
                                "
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                {/* Active Glow Effect */}
                                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-doky-action-cyan/0 to-doky-bright-cyan/0 group-hover:from-doky-action-cyan/5 group-hover:to-doky-bright-cyan/5 transition-all duration-500"></div>

                                <div className="w-full flex justify-between items-start mb-3 z-10">
                                    <h3 className="font-black text-white text-xl leading-tight font-heading group-hover:text-doky-bright-cyan transition-colors">
                                        {service.name}
                                    </h3>
                                    <div className="flex flex-col items-end">
                                        <span className="text-doky-bright-cyan font-black text-xl">
                                            {Number(service.price).toFixed(0)}€
                                        </span>
                                    </div>
                                </div>

                                <p className="text-sm text-white/90 mb-6 line-clamp-2 leading-relaxed w-full font-bold z-10 group-hover:text-white transition-colors">
                                    {service.description || t('service_subtitle')}
                                </p>

                                <div className="mt-auto w-full flex items-center justify-between z-10">
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-1.5 text-[10px] font-black text-doky-bright-cyan bg-doky-action-cyan/20 px-3 py-1.5 rounded-full uppercase tracking-widest border border-doky-action-cyan/40 shadow-[0_0_10px_rgba(0,194,224,0.2)]">
                                            <Clock size={12} className="text-doky-bright-cyan" /> {service.duration} min
                                        </span>
                                    </div>
                                    <div className="p-2 rounded-full bg-white/5 text-white/20 group-hover:bg-doky-action-cyan group-hover:text-white transition-all duration-500 transform group-hover:translate-x-1">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-20 bg-white/5 backdrop-blur-md rounded-[3rem] border border-white/10 text-white/30">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            <Search size={40} className="opacity-20" />
                        </div>
                        <p className="font-black font-heading text-lg tracking-tight text-center max-w-xs">Nenhum serviço disponível online nesta categoria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
