import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowLeft, Check } from 'lucide-react';
import { useTerminology } from '../../hooks/useTerminology';
import { EstablishmentSettings } from '../../types';

interface Props {
    onDone: () => void;
    settings?: EstablishmentSettings | null;
}

export const WizardStepSuccess: React.FC<Props> = ({ onDone, settings }) => {
    const [seconds, setSeconds] = useState(10);
    const { t } = useTerminology(settings);

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (seconds === 0) {
            onDone();
        }
    }, [seconds, onDone]);

    return (
        <div className="w-full max-w-4xl mx-auto h-full flex flex-col justify-center pb-24 text-center">
            <div className="bg-white/85 backdrop-blur-2xl border border-white/40 shadow-2xl shadow-slate-300/20 rounded-[2.5rem] p-12 md:p-20 animate-fade-in-up">
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-8 animate-bounce-custom">
                        <Check size={48} strokeWidth={4} />
                    </div>
                </div>

                <h2 className="text-4xl md:text-5xl font-black font-heading text-slate-800 mb-4 tracking-tight">Confirmado!</h2>
                <p className="text-xl text-slate-600 mb-12 leading-relaxed font-medium max-w-lg">
                    O seu agendamento foi registado com sucesso.<br />
                    Enviámos uma confirmação para o seu email.
                </p>

                <button onClick={onDone} className="w-full max-w-sm py-5 rounded-2xl bg-white border-2 border-slate-100 hover:border-[var(--color-primary)] text-slate-700 hover:text-[var(--color-primary)] font-bold text-lg transition-all transform hover:scale-105 shadow-sm hover:shadow-lg flex items-center justify-center gap-2">
                    <ArrowLeft size={20} /> Voltar ao Início ({seconds}s)
                </button>
            </div>
        </div>
    );
};
