import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { EstablishmentSettings, Terminology } from '../../../types';
import { Save, BookType, RotateCcw } from 'lucide-react';

interface Props {
    onSave?: () => void;
}

const TERMINOLOGY_DEFAULTS: Record<string, Terminology> = {
    'Clinic': {
        service_label: 'Serviço',
        service_subtitle: 'Cuidados de saúde de excelência',
        professional_label: 'Profissional',
        professional_plural: 'Profissionais',
        appointment_label: 'Consulta',
        booking_action: 'Confirmar Agendamento',
        client_label: 'Paciente',
        date_title: 'Data e Hora',
        date_subtitle: 'Quando lhe dá mais jeito?',
        data_title: 'Os seus dados',
        data_subtitle: 'Para confirmarmos a consulta',
        nif_field: 'NIF (Opcional)'
    },
    'Barber': {
        service_label: 'Serviço',
        service_subtitle: 'O teu estilo, o nosso corte',
        professional_label: 'Barbeiro',
        professional_plural: 'Barbeiros',
        appointment_label: 'Marcação',
        booking_action: 'Confirmar Marcação',
        client_label: 'Cliente',
        date_title: 'Data e Hora',
        date_subtitle: 'Quando queres vir?',
        data_title: 'Os teus dados',
        data_subtitle: 'Para guardarmos a marcação',
        nif_field: 'NIF (Opcional)'
    },
    'Salon': {
        service_label: 'Tratamento',
        service_subtitle: 'Cuide de si',
        professional_label: 'Especialista',
        professional_plural: 'Especialistas',
        appointment_label: 'Sessão',
        booking_action: 'Confirmar Reserva',
        client_label: 'Cliente',
        date_title: 'Data e Hora',
        date_subtitle: 'Quando prefere?',
        data_title: 'Os seus dados',
        data_subtitle: 'Para confirmarmos a reserva',
        nif_field: 'NIF (Opcional)'
    },
    'Vet': {
        service_label: 'Serviço',
        service_subtitle: 'Cuidamos do seu animal',
        professional_label: 'Veterinário',
        professional_plural: 'Veterinários',
        appointment_label: 'Consulta',
        booking_action: 'Confirmar Agendamento',
        client_label: 'Tutor',
        date_title: 'Data e Hora',
        date_subtitle: 'Quando lhe dá mais jeito?',
        data_title: 'Os seus dados',
        data_subtitle: 'Para confirmarmos a consulta',
        nif_field: 'NIF (Opcional)',
        animal_name_field: 'Nome do Animal'
    },
    'Spa': {
        service_label: 'Experiência',
        service_subtitle: 'Relaxe connosco',
        professional_label: 'Terapeuta',
        professional_plural: 'Terapeutas',
        appointment_label: 'Sessão',
        booking_action: 'Confirmar Reserva',
        client_label: 'Cliente',
        date_title: 'Data e Hora',
        date_subtitle: 'Para o seu momento de relaxamento',
        data_title: 'Os seus dados',
        data_subtitle: 'Para garantir a sua reserva',
        nif_field: 'NIF'
    }
};

const DEFAULT_TERMS = TERMINOLOGY_DEFAULTS['Clinic'];

export const TerminologyForm: React.FC<Props> = ({ onSave }) => {
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
            // Ensure terminology exists
            if (!data.terminology) {
                const type = data.businessProfile?.type || 'Clinic';
                data.terminology = TERMINOLOGY_DEFAULTS[type] || DEFAULT_TERMS;
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

    const handleChange = (field: keyof Terminology, value: any) => {
        if (!settings) return;
        setSettings({
            ...settings,
            terminology: {
                ...settings.terminology!,
                [field]: value
            }
        });
    };

    const handleResetDefaults = () => {
        if (!settings) return;
        const type = settings.businessProfile?.type || 'Clinic';
        const defaults = TERMINOLOGY_DEFAULTS[type] || DEFAULT_TERMS;

        if (window.confirm(`Tem a certeza que deseja repor a terminologia para o padrão "${type}"?`)) {
            setSettings({
                ...settings,
                terminology: defaults
            });
        }
    };

    if (loading || !settings || !settings.terminology) return (
        <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doky-action-cyan"></div>
        </div>
    );

    const terms = settings.terminology;
    const currentType = settings.businessProfile?.type || 'Desconhecido';

    return (
        <div className="max-w-screen-lg mx-auto pb-20 px-4 md:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Dicionário de Terminologia</h2>
                    <p className="text-slate-500 text-sm mt-1">Adapte os textos do Kiosk ao seu negócio.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleResetDefaults}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all"
                    >
                        <RotateCcw size={16} />
                        <span className="hidden sm:inline">Repor Padrão ({currentType})</span>
                    </button>
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
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg">
                        <BookType size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">Mapeamento de Termos</h3>
                        <p className="text-xs text-slate-500">Substitua os termos usados no Kiosk</p>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Services */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b pb-1">Serviços</h4>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Título (Singular)</label>
                            <input
                                type="text"
                                value={terms.service_label}
                                onChange={(e) => handleChange('service_label', e.target.value)}
                                className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Subtítulo (Chamada)</label>
                            <input
                                type="text"
                                value={terms.service_subtitle}
                                onChange={(e) => handleChange('service_subtitle', e.target.value)}
                                className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 outline-none"
                            />
                        </div>
                    </div>

                    {/* Professionals */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b pb-1">Profissionais</h4>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Título (Singular)</label>
                            <input
                                type="text"
                                value={terms.professional_label}
                                onChange={(e) => handleChange('professional_label', e.target.value)}
                                className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Título (Plural)</label>
                            <input
                                type="text"
                                value={terms.professional_plural}
                                onChange={(e) => handleChange('professional_plural', e.target.value)}
                                className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 outline-none"
                            />
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b pb-1">Data e Hora</h4>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Título do Passo</label>
                            <input
                                type="text"
                                value={terms.date_title}
                                onChange={(e) => handleChange('date_title', e.target.value)}
                                className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Subtítulo / Pergunta</label>
                            <input
                                type="text"
                                value={terms.date_subtitle}
                                onChange={(e) => handleChange('date_subtitle', e.target.value)}
                                className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 outline-none"
                            />
                        </div>
                    </div>

                    {/* Client Data */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b pb-1">Dados do Cliente</h4>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Título do Cliente (Ex: Paciente, Tutor)</label>
                            <input
                                type="text"
                                value={terms.client_label}
                                onChange={(e) => handleChange('client_label', e.target.value)}
                                className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Título do Formulário</label>
                            <input
                                type="text"
                                value={terms.data_title}
                                onChange={(e) => handleChange('data_title', e.target.value)}
                                className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Subtítulo</label>
                            <input
                                type="text"
                                value={terms.data_subtitle}
                                onChange={(e) => handleChange('data_subtitle', e.target.value)}
                                className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Placeholder do NIF</label>
                            <input
                                type="text"
                                value={terms.nif_field}
                                onChange={(e) => handleChange('nif_field', e.target.value)}
                                className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Botão de Confirmação</label>
                            <input
                                type="text"
                                value={terms.booking_action}
                                onChange={(e) => handleChange('booking_action', e.target.value)}
                                className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 outline-none"
                            />
                        </div>
                        {/* Optional Animal Name */}
                        {currentType === 'Vet' && (
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Label 'Nome do Animal'</label>
                                <input
                                    type="text"
                                    value={terms.animal_name_field || ''}
                                    onChange={(e) => handleChange('animal_name_field', e.target.value)}
                                    className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 outline-none"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
