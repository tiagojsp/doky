import React from 'react';
import { Service, Staff, EstablishmentSettings } from '../../types';
import { CheckCircle, Edit2, Calendar, Clock, User } from 'lucide-react';
import { useTerminology } from '../../hooks/useTerminology';

interface Props {
    data: {
        service: Service | null;
        staff: Staff | null;
        date: string;
        time: string;
        client: {
            name: string;
            email: string;
            phone: string;
            nif?: string;
        };
    };
    onEdit: (step: number) => void;
    onConfirm: () => void;
    settings?: EstablishmentSettings | null;
}

export const WizardStepReview: React.FC<Props> = ({ data, onEdit, onConfirm, settings }) => {
    const { service, staff, date, time, client } = data;
    const { t } = useTerminology(settings);

    if (!service) return null;

    return (
        <div className="w-full max-w-4xl mx-auto h-full flex flex-col justify-center pb-24">
            <div className="bg-white/85 backdrop-blur-2xl border border-white/40 shadow-2xl shadow-slate-300/20 rounded-[2.5rem] p-8 md:p-12 animate-fade-in-up">
                <h3 className="text-3xl font-black text-slate-800 mb-8 text-center">{t('review_title')}</h3>
                <p className="text-slate-500 text-center mb-10 -mt-6">Confirme os detalhes do seu agendamento</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                    {/* Service & Staff Card */}
                    <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2rem] shadow-lg border border-white/50 relative group">
                        <button onClick={() => onEdit(0)} className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-400 hover:text-[var(--color-primary)] hover:bg-slate-200 transition-all">
                            <Edit2 size={20} />
                        </button>

                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></div> {t('service_label')}
                        </h3>

                        <div className="mb-6">
                            <h4 className="text-2xl font-black text-slate-900 leading-tight mb-2">{service.name}</h4>
                            <p className="text-slate-700 font-bold">{service.duration} min • {service.price}€</p>
                        </div>

                        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                            <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                                <img src={staff?.imageUrl || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase">{t('professional_label')}</p>
                                <p className="font-bold text-slate-900">{staff?.name || `Qualquer ${t('professional_label')}`}</p>
                            </div>
                        </div>
                    </div>

                    {/* Date & Time Card */}
                    <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[2rem] shadow-lg border border-white/50 relative group">
                        <button onClick={() => onEdit(2)} className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-400 hover:text-[var(--color-primary)] hover:bg-slate-200 transition-all">
                            <Edit2 size={20} />
                        </button>

                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Calendar size={12} /> {t('date_title')}
                        </h3>

                        <div className="text-center py-4">
                            <div className="inline-block px-6 py-2 rounded-full bg-slate-100 text-[var(--color-primary)] font-bold text-xl mb-2">
                                {new Date(date).toLocaleDateString('pt-PT', { weekday: 'long' })}
                            </div>
                            <div className="text-6xl font-black text-slate-900 mb-2">
                                {new Date(date).getDate()}
                            </div>
                            <div className="text-xl font-bold text-slate-600 uppercase tracking-wide mb-6">
                                {new Date(date).toLocaleDateString('pt-PT', { month: 'long' })}
                            </div>
                            <div className="flex items-center justify-center gap-2 text-2xl font-black text-slate-800 bg-slate-50 py-4 rounded-2xl">
                                <Clock size={24} className="text-[var(--color-primary)]" />
                                {time}
                            </div>
                        </div>
                    </div>

                    {/* Personal Info Card (Full Width) */}
                    <div className="md:col-span-2 bg-white/95 backdrop-blur-xl p-8 rounded-[2rem] shadow-lg border border-white/50 relative group flex flex-col md:flex-row gap-8 items-start">
                        <button onClick={() => onEdit(3)} className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-400 hover:text-[var(--color-primary)] hover:bg-slate-200 transition-all">
                            <Edit2 size={20} />
                        </button>

                        <div className="flex-1">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <User size={12} /> {t('data_title')}
                            </h3>
                            <div className="space-y-2">
                                <p className="text-2xl font-black text-slate-900">{client.name}</p>
                                <p className="text-slate-700 font-bold text-lg">{client.email}</p>
                                <p className="text-slate-700 font-bold text-lg">{client.phone}</p>
                                {client.nif && <p className="text-slate-500 font-medium text-sm mt-2">{t('nif_field')}: {client.nif}</p>}
                            </div>
                        </div>

                        <div className="w-full md:w-auto self-center">
                            <button
                                onClick={onConfirm}
                                className="w-full md:w-auto px-12 py-6 rounded-2xl bg-[var(--color-primary)] text-white font-bold text-xl uppercase tracking-widest shadow-xl shadow-teal-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                {t('booking_action')} <CheckCircle size={24} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
