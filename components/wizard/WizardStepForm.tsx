import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, FileText, ArrowRight } from 'lucide-react';
import { EstablishmentSettings, FormFieldConfig } from '../../types';
import { useTerminology } from '../../hooks/useTerminology';

interface Props {
    onSubmit: (data: any) => void;
    settings?: EstablishmentSettings | null;
}

export const WizardStepForm: React.FC<Props> = ({ onSubmit, settings }) => {
    const { t } = useTerminology(settings);
    const [formData, setFormData] = useState<Record<string, string>>({
        name: '',
        phone: '',
        email: '',
        nif: ''
    });

    const [fields, setFields] = useState<FormFieldConfig[]>([]);

    useEffect(() => {
        if (settings?.formConfig?.fields && settings.formConfig.fields.length > 0) {
            setFields(settings.formConfig.fields.filter(f => f.active));
        }
    }, [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="w-full max-w-lg mx-auto pb-32">
            <div className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-2xl shadow-slate-300/20 rounded-[2.5rem] p-8 md:p-12 animate-fade-in-up">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-600 ml-2">{t('client_label')}</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
                            <input
                                required
                                name="name"
                                type="text"
                                placeholder="O seu nome"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-4 bg-white/80 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/10 focus:border-[var(--color-primary)] transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-600 ml-2">Telemóvel</label>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
                            <input
                                required
                                name="phone"
                                type="tel"
                                placeholder="O seu contacto"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-4 bg-white/80 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/10 focus:border-[var(--color-primary)] transition-all font-medium"
                            />
                        </div>
                    </div>
                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-600 ml-2">Email (Opcional)</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
                            <input
                                type="email"
                                placeholder="Para receber a confirmação"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-white/80 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/10 focus:border-[var(--color-primary)] transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* NIF */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-600 ml-2">{t('nif_field')} (Opcional)</label>
                        <div className="relative group">
                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
                            <input
                                type="tel"
                                placeholder="Número de Contribuinte"
                                value={formData.nif}
                                onChange={e => setFormData({ ...formData, nif: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-white/80 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/10 focus:border-[var(--color-primary)] transition-all font-medium"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-8 py-5 rounded-2xl bg-[var(--color-primary)] text-white font-black text-lg uppercase tracking-wide shadow-xl shadow-[var(--color-primary)]/30 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                    >
                        Continuar <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                </form>
            </div>
        </div>
    );
};
