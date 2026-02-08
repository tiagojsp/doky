import React from 'react';
import { Service, Staff } from '../../types';
import { Calendar, Clock, User, Sparkles } from 'lucide-react';

interface Props {
    selectedService: Service | null;
    selectedStaff: Staff | null;
    selectedDate: string;
    selectedTime: string;
}

export const WizardSummary: React.FC<Props> = ({ selectedService, selectedStaff, selectedDate, selectedTime }) => {
    if (!selectedService) return null;

    return (
        <>
            {/* Desktop Sidebar */}
            {/* Desktop/Tablet Sidebar */}
            <div className="hidden lg:block fixed left-6 top-1/2 -translate-y-1/2 w-72 max-h-[90vh] overflow-y-auto custom-scrollbar bg-white/85 backdrop-blur-2xl border border-white/40 shadow-2xl shadow-slate-300/20 rounded-[2.5rem] p-6 z-40 transition-all duration-500 animate-fade-in-left">
                <div className="flex items-center gap-2 mb-6 text-slate-800">
                    <Sparkles size={18} className="text-[var(--color-primary)]" />
                    <h3 className="font-black text-sm tracking-widest uppercase">O seu Resumo</h3>
                </div>

                <div className="space-y-8 relative">
                    <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-200 -z-10"></div>

                    {/* Service */}
                    <div className="flex gap-4 items-start">
                        <div className="w-6 h-6 rounded-full bg-teal-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0 z-10">
                            <div className="w-2 h-2 rounded-full bg-teal-600"></div>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-black uppercase mb-1">Serviço</p>
                            <p className="font-black text-slate-900 text-base leading-tight">{selectedService.name}</p>
                            <p className="text-sm text-slate-700 font-medium mt-1">{selectedService.duration} min • {selectedService.price}€</p>
                        </div>
                    </div>

                    {/* Staff */}
                    <div className={`flex gap-4 items-start transition-opacity duration-300 ${selectedStaff ? 'opacity-100' : 'opacity-40'}`}>
                        <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0 z-10">
                            <User size={12} className="text-blue-700" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-black uppercase mb-1">Profissional</p>
                            <p className="font-bold text-slate-900 text-sm">{selectedStaff?.name || '...'}</p>
                        </div>
                    </div>

                    {/* Date/Time */}
                    <div className={`flex gap-4 items-start transition-opacity duration-300 ${selectedDate ? 'opacity-100' : 'opacity-40'}`}>
                        <div className="w-6 h-6 rounded-full bg-purple-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0 z-10">
                            <Calendar size={12} className="text-purple-700" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-black uppercase mb-1">Data & Hora</p>
                            <p className="font-bold text-slate-900 text-sm">
                                {selectedDate ? new Date(selectedDate).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long' }) : '...'}
                            </p>
                            {selectedTime && (
                                <p className="text-xs text-slate-700 mt-1 flex items-center gap-1 font-bold">
                                    <Clock size={10} /> {selectedTime}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-4 z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Resumo</p>
                        <p className="font-black text-slate-900 leading-tight text-sm">{selectedService.name}</p>
                        <p className="text-xs text-slate-600 font-bold">{selectedService.duration} min • {selectedService.price}€</p>
                    </div>
                    {selectedDate && (
                        <div className="text-right">
                            <p className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                                {new Date(selectedDate).getDate()} {new Date(selectedDate).toLocaleDateString('pt-PT', { month: 'short' })}
                                {selectedTime && <span className="ml-1 text-[var(--color-primary)]">{selectedTime}</span>}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
