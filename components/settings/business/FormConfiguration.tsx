import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { EstablishmentSettings, FormConfig, FormFieldConfig } from '../../../types';
import { Save, FileText, Check, Eye, EyeOff } from 'lucide-react';

interface Props {
    onSave?: () => void;
}

const DEFAULT_FIELDS: FormFieldConfig[] = [
    { name: 'name', label: 'Nome Completo', type: 'text', required: true, active: true, placeholder: 'Introduza o seu nome' },
    { name: 'email', label: 'Email', type: 'email', required: true, active: true, placeholder: 'exemplo@email.com' },
    { name: 'phone', label: 'Telemóvel', type: 'tel', required: true, active: true, placeholder: '910000000' },
    { name: 'nif', label: 'NIF', type: 'number', required: false, active: true, placeholder: '123456789' },
    { name: 'address', label: 'Morada', type: 'text', required: false, active: false, placeholder: 'Sua morada' },
    { name: 'postalCode', label: 'Código Postal', type: 'text', required: false, active: false, placeholder: '0000-000' },
    { name: 'city', label: 'Cidade', type: 'text', required: false, active: false, placeholder: 'Sua cidade' },
    { name: 'notes', label: 'Observações', type: 'text', required: false, active: true, placeholder: 'Alguma indicação especial?' }
];

export const FormConfiguration: React.FC<Props> = ({ onSave }) => {
    const [settings, setSettings] = useState<EstablishmentSettings | null>(null);
    const [fields, setFields] = useState<FormFieldConfig[]>([]);
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

            // Merge loaded fields with defaults to ensure all exist
            const loaded = data.formConfig?.fields || [];
            if (loaded.length === 0) {
                setFields(DEFAULT_FIELDS);
            } else {
                // Merge to keep order but ensure all default keys exist if we add new ones later
                // For now, just use loaded. simpler.
                setFields(loaded);
            }
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
            const updatedSettings = {
                ...settings,
                formConfig: { fields }
            };
            await api.updateEstablishmentSettings(updatedSettings);
            if (onSave) onSave();
            // show toast
        } catch (error) {
            console.error("Failed to save settings", error);
        } finally {
            setSaving(false);
        }
    };

    const toggleField = (index: number, key: 'active' | 'required') => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], [key]: !newFields[index][key] };

        // If required is true, active must be true
        if (key === 'required' && newFields[index].required) {
            newFields[index].active = true;
        }
        // If active is false, required must be false
        if (key === 'active' && !newFields[index].active) {
            newFields[index].required = false;
        }

        setFields(newFields);
    };

    const updateLabel = (index: number, text: string) => {
        const newFields = [...fields];
        newFields[index].label = text;
        setFields(newFields);
    };

    const updatePlaceholder = (index: number, text: string) => {
        const newFields = [...fields];
        newFields[index].placeholder = text;
        setFields(newFields);
    };

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doky-action-cyan"></div>
        </div>
    );

    return (
        <div className="max-w-screen-lg mx-auto pb-20 px-4 md:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Formulário de Registo</h2>
                    <p className="text-slate-500 text-sm mt-1">Configure os dados solicitados aos clientes no Kiosk.</p>
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

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">Campos do Formulário</h3>
                        <p className="text-xs text-slate-500">Defina quais os campos visíveis e obrigatórios.</p>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <div className="col-span-4 md:col-span-3">Campo</div>
                        <div className="col-span-4 md:col-span-4">Label Personalizada</div>
                        <div className="col-span-4 md:col-span-3 hidden md:block">Placeholder</div>
                        <div className="col-span-2 text-center">Visível</div>
                        <div className="col-span-2 text-center">Obrigatório</div>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {fields.map((field, index) => (
                            <div key={field.name} className={`grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors ${field.active ? 'bg-white' : 'bg-slate-50 opacity-60'}`}>
                                <div className="col-span-4 md:col-span-3">
                                    <span className="font-medium text-slate-700 text-sm">{field.name === 'userId' ? 'Nome de Utilizador' : field.name}</span>
                                    <span className="block text-xs text-slate-400 capitalize">{field.type}</span>
                                </div>

                                <div className="col-span-4 md:col-span-4">
                                    <input
                                        type="text"
                                        value={field.label}
                                        onChange={(e) => updateLabel(index, e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
                                        disabled={!field.active}
                                    />
                                </div>

                                <div className="hidden md:block md:col-span-3">
                                    <input
                                        type="text"
                                        value={field.placeholder || ''}
                                        onChange={(e) => updatePlaceholder(index, e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none text-slate-500"
                                        disabled={!field.active}
                                    />
                                </div>

                                <div className="col-span-2 flex justify-center">
                                    <button
                                        onClick={() => toggleField(index, 'active')}
                                        className={`p-2 rounded-lg transition-colors ${field.active ? 'text-blue-600 bg-blue-50' : 'text-slate-300 hover:text-slate-500'}`}
                                        title={field.active ? "Visível" : "Oculto"}
                                    >
                                        {field.active ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                </div>

                                <div className="col-span-2 flex justify-center">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={field.required}
                                            onChange={() => toggleField(index, 'required')}
                                            disabled={!field.active}
                                        />
                                        <div className={`w-9 h-5 rounded-full peer peer-focus:outline-none peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${field.active ? 'bg-slate-200 peer-checked:bg-doky-action-cyan' : 'bg-slate-100 cursor-not-allowed'}`}></div>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
