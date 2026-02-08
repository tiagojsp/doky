import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { EstablishmentSettings, BusinessProfile } from '../../../types';
import { Save, Store, Palette, Globe, Layout } from 'lucide-react';

interface Props {
    onSave?: () => void;
}

export const BusinessProfileForm: React.FC<Props> = ({ onSave }) => {
    const [settings, setSettings] = useState<EstablishmentSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        try {
            const data = await api.fetchEstablishmentSettings();
            // Ensure businessProfile exists
            if (!data.businessProfile) {
                data.businessProfile = {
                    type: 'Clinic',
                    name: data.name,
                    primaryColor: '#0f766e',
                    secondaryColor: '#f0f9ff',
                    language: 'pt',
                    currency: 'EUR'
                };
            }
            setSettings(data);
        } catch (error) {
            console.error("Failed to load settings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!settings) return;
        setSaving(true);
        try {
            await api.updateEstablishmentSettings(settings);
            if (onSave) onSave();
        } catch (error) {
            console.error("Failed to save settings", error);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: keyof BusinessProfile, value: any) => {
        if (!settings) return;
        setSettings({
            ...settings,
            businessProfile: {
                ...settings.businessProfile!,
                [field]: value
            }
        });
    };

    if (loading || !settings || !settings.businessProfile) return (
        <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doky-action-cyan"></div>
        </div>
    );

    const profile = settings.businessProfile;

    return (
        <div className="max-w-screen-lg mx-auto pb-20 px-4 md:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Perfil de Negócio</h2>
                    <p className="text-slate-500 text-sm mt-1">Personalize a aparência e comportamento do Kiosk.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-cyan-600 focus:ring-4 focus:ring-cyan-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
                >
                    {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                    ) : (
                        <Save size={16} />
                    )}
                    {saving ? 'A Guardar...' : 'Guardar Alterações'}
                </button>
            </div>

            <div className="space-y-6">

                {/* Main Identity Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                        <div className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 shadow-sm">
                            <Store size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">Identidade e Marca</h3>
                            <p className="text-xs text-slate-500">Defina o tipo de negócio e branding</p>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Business Type */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo de Negócio</label>
                            <p className="text-xs text-slate-400 mb-3">Define a terminologia padrão do Kiosk.</p>
                            <select
                                value={profile.type}
                                onChange={(e) => handleChange('type', e.target.value)}
                                className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-white"
                            >
                                <option value="Clinic">Clínica / Saúde</option>
                                <option value="Barber">Barbearia</option>
                                <option value="Salon">Cabeleireiro / Estética</option>
                                <option value="Spa">Spa & Bem-estar</option>
                                <option value="Vet">Veterinário</option>
                                <option value="Tattoo">Estúdio de Tatuagem</option>
                                <option value="Custom">Outro / Personalizado</option>
                            </select>
                        </div>

                        {/* Business Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome no Kiosk</label>
                            <p className="text-xs text-slate-400 mb-3">Nome apresentado nos ecrãs de boas-vindas.</p>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                                placeholder="Clínica Central"
                            />
                        </div>

                        {/* Logo URL */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">URL do Logótipo</label>
                            <div className="flex gap-4">
                                <input
                                    type="url"
                                    value={profile.logoUrl || ''}
                                    onChange={(e) => handleChange('logoUrl', e.target.value)}
                                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                                    placeholder="https://..."
                                />
                                {profile.logoUrl && (
                                    <div className="w-10 h-10 border border-slate-200 rounded-lg p-1 flex items-center justify-center shrink-0">
                                        <img src={profile.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Theming Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg">
                            <Palette size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">Cores e Tema</h3>
                            <p className="text-xs text-slate-500">Personalize as cores da interface do Kiosk</p>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Primary Color */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Cor Primária</label>
                            <p className="text-xs text-slate-400 mb-3">Usada em botões, destaques e seleções.</p>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={profile.primaryColor}
                                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                                    className="w-12 h-12 p-1 rounded-lg border border-slate-200 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={profile.primaryColor}
                                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                                    className="w-32 px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm font-mono uppercase"
                                />
                            </div>
                        </div>

                        {/* Secondary Color */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Cor Secundária / Fundo</label>
                            <p className="text-xs text-slate-400 mb-3">Usada em fundos subtis e badges.</p>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={profile.secondaryColor}
                                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                                    className="w-12 h-12 p-1 rounded-lg border border-slate-200 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={profile.secondaryColor}
                                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                                    className="w-32 px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm font-mono uppercase"
                                />
                            </div>
                        </div>

                        {/* Preview helper */}
                        <div className="md:col-span-2 p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center gap-4">
                            <button className="px-6 py-2 rounded-lg text-white font-medium shadow-sm" style={{ backgroundColor: profile.primaryColor }}>
                                Botão Primário
                            </button>
                            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: profile.secondaryColor, color: profile.primaryColor }}>
                                Badge / Destaque
                            </span>
                        </div>
                    </div>
                </div>

                {/* Localization Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg">
                            <Globe size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">Regionalização</h3>
                            <p className="text-xs text-slate-500">Idioma e moeda padrão</p>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Idioma Principal</label>
                            <select
                                value={profile.language}
                                onChange={(e) => handleChange('language', e.target.value)}
                                className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-white"
                            >
                                <option value="pt">Português</option>
                                <option value="en">English</option>
                                <option value="es">Español</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Moeda</label>
                            <select
                                value={profile.currency}
                                onChange={(e) => handleChange('currency', e.target.value)}
                                className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-white"
                            >
                                <option value="EUR">Euro (€)</option>
                                <option value="GBP">Libra (£)</option>
                                <option value="USD">Dólar ($)</option>
                            </select>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
