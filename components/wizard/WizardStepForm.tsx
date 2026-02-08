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
        <div className="w-full max-w-4xl mx-auto pb-32">
            <div className="bg-white/40 backdrop-blur-3xl border border-white/20 shadow-glass rounded-[3rem] p-8 md:p-16 animate-fade-in-up">
                <form onSubmit={handleSubmit} className="space-y-10">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        {/* Name */}
                        <div className="space-y-3">
                            <label className="text-xs font-black text-white/70 uppercase tracking-widest ml-1">{t('client_label')}</label>
                            <div className="relative group">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-doky-action-cyan transition-colors" size={22} />
                                <input
                                    required
                                    name="name"
                                    type="text"
                                    placeholder="O seu nome"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-14 pr-6 py-5 bg-white border border-white/20 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-doky-action-cyan/10 focus:border-doky-action-cyan/40 transition-all font-bold text-lg"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-3">
                            <label className="text-xs font-black text-white/70 uppercase tracking-widest ml-1">Telemóvel</label>
                            <div className="relative group">
                                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-doky-action-cyan transition-colors" size={22} />
                                <input
                                    required
                                    name="phone"
                                    type="tel"
                                    placeholder="O seu contacto"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-14 pr-6 py-5 bg-white border border-white/20 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-doky-action-cyan/10 focus:border-doky-action-cyan/40 transition-all font-bold text-lg"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-3">
                            <label className="text-xs font-black text-white/70 uppercase tracking-widest ml-1">Email (Opcional)</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-doky-action-cyan transition-colors" size={22} />
                                <input
                                    type="email"
                                    placeholder="Para receber a confirmação"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-14 pr-6 py-5 bg-white border border-white/20 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-doky-action-cyan/10 focus:border-doky-action-cyan/40 transition-all font-bold text-lg"
                                />
                            </div>
                        </div>

                        {/* NIF */}
                        <div className="space-y-3">
                            <label className="text-xs font-black text-white/70 uppercase tracking-widest ml-1">{t('nif_field')} (Opcional)</label>
                            <div className="relative group">
                                <FileText className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-doky-action-cyan transition-colors" size={22} />
                                <input
                                    type="tel"
                                    placeholder="Número de Contribuinte"
                                    value={formData.nif}
                                    onChange={e => setFormData({ ...formData, nif: e.target.value })}
                                    className="w-full pl-14 pr-6 py-5 bg-white border border-white/20 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-doky-action-cyan/10 focus:border-doky-action-cyan/40 transition-all font-bold text-lg"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full py-6 rounded-2xl bg-doky-action-cyan text-white font-black text-xl uppercase tracking-widest shadow-glow-cyan hover:shadow-premium hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-4 group"
                        >
                            <span>Continuar</span>
                            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};
