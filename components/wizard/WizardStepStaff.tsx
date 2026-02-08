import React from 'react';
import { Staff, EstablishmentSettings } from '../../types';
import { Sparkles, Star, Users } from 'lucide-react';
import { useTerminology } from '../../hooks/useTerminology';

interface Props {
    staff: Staff[];
    onSelect: (staff: Staff) => void;
    settings?: EstablishmentSettings | null;
}

export const WizardStepStaff: React.FC<Props> = ({ staff, onSelect, settings }) => {
    const { t } = useTerminology(settings);

    return (
        <div className="w-full max-w-5xl mx-auto pb-24">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pb-24">
                {/* Option for "Any Professional" */}
                <button
                    onClick={() => onSelect(null)}
                    className="
                        group relative flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300
                        bg-white/60 backdrop-blur-md border border-white/50 shadow-sm
                        hover:bg-white/80 hover:shadow-xl hover:shadow-[var(--color-primary)]/10 hover:-translate-y-1 hover:border-[var(--color-primary)]/50
                        active:scale-[0.95]
                    "
                >
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-100 mb-4 flex items-center justify-center group-hover:bg-teal-50 transition-colors border-4 border-white shadow-sm">
                        <Users size={32} className="text-slate-400 group-hover:text-[var(--color-primary)] transition-colors" />
                    </div>
                    <span className="font-bold text-slate-700 text-center group-hover:text-[var(--color-primary)] transition-colors">
                        Qualquer Profissional
                    </span>
                    <span className="text-xs text-slate-400 mt-1 font-medium">Primeiro disponível</span>
                </button>

                {staff.map((member, idx) => (
                    <button
                        key={member.id}
                        onClick={() => onSelect(member)}
                        className="
                            group relative flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300
                            bg-white/60 backdrop-blur-md border border-white/50 shadow-sm
                            hover:bg-white/80 hover:shadow-xl hover:shadow-[var(--color-primary)]/10 hover:-translate-y-1 hover:border-[var(--color-primary)]/50
                            active:scale-[0.95]
                            animate-fade-in-up
                        "
                        style={{ animationDelay: `${idx * 50}ms` }}
                    >
                        <div className="relative w-24 h-24 mb-4">
                            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-sm group-hover:border-[var(--color-primary)] transition-colors">
                                <img
                                    src={member.imageUrl || 'https://via.placeholder.com/150'}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`;
                                    }}
                                />
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-white px-2 py-1 rounded-full shadow-md flex items-center gap-1 border border-slate-50">
                                <Star size={10} className="fill-amber-400 text-amber-400" />
                                <span className="text-[10px] font-bold text-slate-700">4.9</span>
                            </div>
                        </div>

                        <h3 className="font-bold text-base md:text-lg text-slate-800 text-center leading-tight group-hover:text-[var(--color-primary)] transition-colors">
                            {member.name}
                        </h3>
                        <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">
                            {member.role || t('professional_label')}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
};
