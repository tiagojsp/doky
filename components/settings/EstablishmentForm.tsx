import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { EstablishmentSettings } from '../../types';
import { Save, Phone, Globe, Share2, Store, Facebook, Instagram, MapPin, Eye } from 'lucide-react';

interface Props {
    onSave?: () => void;
}

export const EstablishmentForm: React.FC<Props> = ({ onSave }) => {
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
            // Ideally show success toast
            if (onSave) onSave();
        } catch (error) {
            console.error("Failed to save settings", error);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (section: keyof EstablishmentSettings | null, field: string, value: any) => {
        if (!settings) return;
        if (section === null) {
            // Top-level property (e.g., 'name')
            setSettings({ ...settings, [field]: value });
        } else {
            setSettings({
                ...settings,
                [section]: typeof settings[section] === 'object'
                    ? { ...settings[section] as object, [field]: value }
                    : value
            });
        }
    };

    if (loading || !settings) return (
        <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doky-action-cyan"></div>
        </div>
    );

    return (
        <div className="max-w-screen-lg mx-auto pb-20 px-4 md:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Dados do Estabelecimento</h2>
                    <p className="text-slate-500 text-sm mt-1">Gerencie as informações principais do seu negócio.</p>
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

                {/* Main Info Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                        <div className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 shadow-sm">
                            <Store size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">Identificação e Localização</h3>
                            <p className="text-xs text-slate-500">Dados públicos da sua clínica</p>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Name */}
                        <div className="max-w-2xl">
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome Comercial</label>
                            <input
                                type="text"
                                value={settings.name}
                                onChange={(e) => handleChange(null, 'name', e.target.value)}
                                className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-shadow"
                                placeholder="Ex: Clínica Central"
                            />
                        </div>

                        <div className="border-t border-slate-100 my-6"></div>

                        {/* Address Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="md:col-span-12">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                                    <MapPin size={16} className="text-slate-400" />
                                    Morada Principal
                                </label>
                            </div>

                            <div className="md:col-span-8">
                                <label className="block text-xs text-slate-500 mb-1.5">Rua e Número</label>
                                <input
                                    className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                                    value={settings.address.street}
                                    onChange={e => handleChange('address', 'street', e.target.value)}
                                    placeholder="Rua Principal, nº 123"
                                />
                            </div>
                            <div className="md:col-span-4">
                                <label className="block text-xs text-slate-500 mb-1.5">Código Postal</label>
                                <input
                                    className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                                    value={settings.address.postalCode}
                                    onChange={e => handleChange('address', 'postalCode', e.target.value)}
                                    placeholder="0000-000"
                                />
                            </div>

                            <div className="md:col-span-4">
                                <label className="block text-xs text-slate-500 mb-1.5">Cidade</label>
                                <input
                                    className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                                    value={settings.address.city}
                                    onChange={e => handleChange('address', 'city', e.target.value)}
                                    placeholder="Lisboa"
                                />
                            </div>
                            <div className="md:col-span-4">
                                <label className="block text-xs text-slate-500 mb-1.5">Distrito</label>
                                <input
                                    type="text"
                                    value={settings.address.district}
                                    onChange={(e) => handleChange('address', 'district', e.target.value)}
                                    className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                                    placeholder="Lisboa"
                                />
                            </div>
                            <div className="md:col-span-4">
                                <label className="block text-xs text-slate-500 mb-1.5">País</label>
                                <select
                                    value={settings.address.country}
                                    onChange={(e) => handleChange('address', 'country', e.target.value)}
                                    className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-white cursor-pointer"
                                >
                                    <option value="Portugal">Portugal</option>
                                    <option value="Brasil">Brasil</option>
                                    <option value="Espanha">Espanha</option>
                                    <option value="França">França</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Contacts Card */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg">
                                <Phone size={20} />
                            </div>
                            <h3 className="font-semibold text-slate-900">Contactos</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 flex-1">
                            <div className="sm:col-span-2">
                                <label className="block text-xs text-slate-500 mb-1.5">Email Geral</label>
                                <input
                                    type="email"
                                    value={settings.contacts.email}
                                    onChange={(e) => handleChange('contacts', 'email', e.target.value)}
                                    className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                                    placeholder="geral@clinica.pt"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 mb-1.5">Telefone</label>
                                <input
                                    type="tel"
                                    value={settings.contacts.phone}
                                    onChange={(e) => handleChange('contacts', 'phone', e.target.value)}
                                    className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                                    placeholder="210..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 mb-1.5">Telemóvel</label>
                                <input
                                    type="tel"
                                    value={settings.contacts.mobile}
                                    onChange={(e) => handleChange('contacts', 'mobile', e.target.value)}
                                    className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                                    placeholder="910..."
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs text-slate-500 mb-1.5">Website</label>
                                <input
                                    type="url"
                                    value={settings.contacts.website}
                                    onChange={(e) => handleChange('contacts', 'website', e.target.value)}
                                    className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs text-slate-500 mb-1.5">Link da App Cliente (Agendamentos)</label>
                                <input
                                    type="url"
                                    value={settings.contacts.clientAppUrl || ''}
                                    onChange={(e) => handleChange('contacts', 'clientAppUrl', e.target.value)}
                                    className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                                    placeholder="Cole aqui o link da sua área de cliente (Ex: https://doky.io/clinica-central)"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* Regional & Socials */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg">
                                    <Globe size={20} />
                                </div>
                                <h3 className="font-semibold text-slate-900">Regional e Social</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1.5">Idioma</label>
                                        <select
                                            value={settings.preferences.language}
                                            onChange={(e) => handleChange('preferences', 'language', e.target.value)}
                                            className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-white cursor-pointer"
                                        >
                                            <option value="pt-PT">Português</option>
                                            <option value="en-US">English</option>
                                            <option value="es-ES">Español</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1.5">Fuso Horário</label>
                                        <select
                                            value={settings.preferences.timezone}
                                            onChange={(e) => handleChange('preferences', 'timezone', e.target.value)}
                                            className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-white cursor-pointer"
                                        >
                                            <option value="Europe/Lisbon">Lisboa</option>
                                            <option value="Europe/London">Londres</option>
                                            <option value="Europe/Paris">Paris</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <div className="relative group">
                                        <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                                        <input
                                            type="url"
                                            value={settings.socials.facebook}
                                            onChange={(e) => handleChange('socials', 'facebook', e.target.value)}
                                            className="block w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                                            placeholder="URL do Facebook"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-600 transition-colors" size={16} />
                                        <input
                                            type="url"
                                            value={settings.socials.instagram}
                                            onChange={(e) => handleChange('socials', 'instagram', e.target.value)}
                                            className="block w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                                            placeholder="URL do Instagram"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visibility */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-50 text-amber-500 border border-amber-100 rounded-lg">
                                <Eye size={20} />
                            </div>
                            <h3 className="font-semibold text-slate-900">Visibilidade</h3>
                        </div>
                    </div>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { key: 'showInApp', label: 'App Cliente', desc: 'Permitir agendamentos' },
                            { key: 'showInEmails', label: 'Emails', desc: 'Rodapé dos emails' },
                            { key: 'availableOnWhatsapp', label: 'WhatsApp', desc: 'Ícone de contacto' }
                        ].map((item) => (
                            <label key={item.key} className="flex items-start gap-4 cursor-pointer group">
                                <div className="relative flex items-center mt-1">
                                    <input
                                        type="checkbox"
                                        checked={(settings.visibility as any)[item.key]}
                                        onChange={(e) => handleChange('visibility', item.key as any, e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
                                </div>
                                <div>
                                    <span className="block text-sm font-medium text-slate-900 group-hover:text-blue-700 transition-colors">{item.label}</span>
                                    <span className="block text-xs text-slate-500">{item.desc}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

            </div>
        </div >
    );
};
