import React, { useState } from 'react';
import { ArrowRight, Calendar, CheckCircle, ChevronLeft } from 'lucide-react';
import { BookingWizard } from './BookingWizard';
import { Service, Staff, Appointment } from '../types';

interface Props {
    services: Service[];
    staff: Staff[];
    onNewBooking: (appt: Appointment) => void;
    onBack: () => void;
    establishmentName?: string;
}

export const PortalView: React.FC<Props> = ({ services, staff, onNewBooking, onBack, establishmentName }) => {
    const [showWizard, setShowWizard] = useState(false);

    if (showWizard) {
        return (
            <BookingWizard
                onBackToAdmin={() => setShowWizard(false)}
                onNewBooking={(appt) => {
                    onNewBooking(appt);
                    // Optionally redirect or show success here if BookingWizard doesn't handle it fully
                }}
                services={services}
                staff={staff}
            />
        );
    }

    return (
        <div className="min-h-full flex items-center justify-center p-4 bg-slate-50 relative">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all"
                title="Voltar ao Painel"
            >
                <ChevronLeft size={24} />
            </button>

            <div className="glass-card w-full max-w-md p-8 text-center relative overflow-hidden bg-white rounded-3xl shadow-xl">

                {/* Logo/Brand Area */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black font-heading text-slate-800 tracking-tight uppercase">
                        {establishmentName || 'CLÍNICA CENTRAL'}
                    </h1>
                    <p className="text-slate-500 mt-2 text-sm font-medium uppercase tracking-widest">Estética Avançada</p>
                </div>

                {/* Hero Illustration Placeholder */}
                <div className="w-24 h-24 bg-gradient-to-tr from-cyan-600 to-blue-500 rounded-full mx-auto mb-8 flex items-center justify-center shadow-lg shadow-cyan-200">
                    <Calendar className="text-white w-10 h-10" />
                </div>

                {/* CTA */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-800">Agende a sua consulta</h2>
                    <p className="text-slate-500 text-sm leading-relaxed px-4">
                        Selecione o serviço, escolha o profissional e marque o seu horário em menos de 1 minuto.
                    </p>

                    <button
                        onClick={() => setShowWizard(true)}
                        className="w-full mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all transform hover:scale-[1.02] group"
                    >
                        Começar Agora
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-4">
                    <div className="flex justify-center gap-6 text-xs text-slate-400 font-medium">
                        <div className="flex items-center gap-1.5">
                            <CheckCircle size={14} className="text-emerald-500" />
                            <span>Sem registo</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <CheckCircle size={14} className="text-emerald-500" />
                            <span>Confirmado</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
