import React, { useState } from 'react';
import { Staff, Service } from '../types';
import { Check, User, Sparkles, Filter, X } from 'lucide-react';

interface Props {
    staff: Staff[];
    services: Service[];
    selectedStaff: string[];
    selectedServices: string[];
    onToggleStaff: (id: string, all?: boolean) => void;
    onToggleService: (id: string, all?: boolean) => void;
    onClose?: () => void;
}

export const CalendarFilters: React.FC<Props> = ({
    staff,
    services,
    selectedStaff,
    selectedServices,
    onToggleStaff,
    onToggleService,
    onClose
}) => {
    return (
        <div className="w-full md:w-80 bg-white/95 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl p-5 flex flex-col h-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <Filter size={18} className="text-cyan-600" />
                    <h3>Filtros de Agenda</h3>
                </div>
                {onClose && (
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                        <X size={20} />
                    </button>
                )}
            </div>

            <div className="overflow-y-auto flex-1 space-y-6 pr-2">
                {/* STAFF FILTERS */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <User size={14} /> Profissionais
                        </h4>
                        <button onClick={() => onToggleStaff('', true)} className="text-[10px] text-cyan-600 hover:underline">
                            {selectedStaff.length === staff.length ? 'Limpar' : 'Todos'}
                        </button>
                    </div>
                    <div className="space-y-2">
                        {staff.map(s => (
                            <label key={s.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors
                               ${selectedStaff.includes(s.id) ? 'bg-cyan-500 border-cyan-500' : 'border-slate-300 bg-white'}
                           `}>
                                    {selectedStaff.includes(s.id) && <Check size={12} className="text-white" />}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={selectedStaff.includes(s.id)}
                                    onChange={() => onToggleStaff(s.id)}
                                />
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                        {s.name.charAt(0)}
                                    </div>
                                    <span className={`text-sm ${selectedStaff.includes(s.id) ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                                        {s.name}
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* SERVICE FILTERS */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <Sparkles size={14} /> Serviços
                        </h4>
                        <button onClick={() => onToggleService('', true)} className="text-[10px] text-cyan-600 hover:underline">
                            {selectedServices.length === services.length ? 'Limpar' : 'Todos'}
                        </button>
                    </div>
                    <div className="space-y-1">
                        {services.map(s => (
                            <label key={s.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors
                               ${selectedServices.includes(s.id) ? 'bg-purple-500 border-purple-500' : 'border-slate-300 bg-white'}
                           `}>
                                    {selectedServices.includes(s.id) && <Check size={12} className="text-white" />}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={selectedServices.includes(s.id)}
                                    onChange={() => onToggleService(s.id)}
                                />
                                <span className={`text-sm truncate ${selectedServices.includes(s.id) ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                                    {s.name}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                    onClick={() => onClose?.()}
                    className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:bg-slate-700 transition-colors"
                >
                    Aplicar Filtros
                </button>
            </div>
        </div>
    );
};
