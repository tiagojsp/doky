import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Staff } from '../../types';
import { ChevronDown, Save, ArrowLeft, Camera, User, Car, Clock, Calendar, Percent } from 'lucide-react';

interface CollaboratorFormProps {
    staff: Staff;
    onSave: () => void;
    onCancel: () => void;
}

type Tab = 'profile' | 'availability' | 'commissions';

export const CollaboratorForm: React.FC<CollaboratorFormProps> = ({ staff: initialStaff, onSave, onCancel }) => {
    const [staff, setStaff] = useState<Staff>(initialStaff);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('profile');

    // Initialize missing nested objects if necessary
    useEffect(() => {
        if (!staff.schedule) {
            setStaff(prev => ({
                ...prev,
                schedule: {
                    'mon': { enabled: true, start: '09:00', end: '18:00', breakStart: '13:00', breakEnd: '14:00' },
                    'tue': { enabled: true, start: '09:00', end: '18:00', breakStart: '13:00', breakEnd: '14:00' },
                    'wed': { enabled: true, start: '09:00', end: '18:00', breakStart: '13:00', breakEnd: '14:00' },
                    'thu': { enabled: true, start: '09:00', end: '18:00', breakStart: '13:00', breakEnd: '14:00' },
                    'fri': { enabled: true, start: '09:00', end: '18:00', breakStart: '13:00', breakEnd: '14:00' },
                    'sat': { enabled: false, start: '09:00', end: '13:00', breakStart: '', breakEnd: '' },
                    'sun': { enabled: false, start: '09:00', end: '13:00', breakStart: '', breakEnd: '' }
                }
            }));
        }
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.updateStaff(staff);
            onSave();
        } catch (error) {
            console.error("Failed to save staff", error);
        } finally {
            setSaving(false);
        }
    };

    const handleScheduleChange = (day: string, field: string, value: any) => {
        if (!staff.schedule) return;
        setStaff({
            ...staff,
            schedule: {
                ...staff.schedule,
                [day]: {
                    ...staff.schedule[day],
                    [field]: value
                }
            }
        });
    };

    const weekDays = [
        { key: 'mon', label: '2ª feira' },
        { key: 'tue', label: '3ª feira' },
        { key: 'wed', label: '4ª feira' },
        { key: 'thu', label: '5ª feira' },
        { key: 'fri', label: '6ª feira' },
        { key: 'sat', label: 'Sábado' },
        { key: 'sun', label: 'Domingo' },
    ];

    const timeOptions = [];
    for (let i = 7; i <= 22; i++) {
        timeOptions.push(`${i.toString().padStart(2, '0')}:00`);
        timeOptions.push(`${i.toString().padStart(2, '0')}:30`);
    }

    return (
        <div className="w-full pb-20 px-4 md:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-8">
                <div className="flex items-center gap-4">
                    <button onClick={onCancel} className="p-2 -ml-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            {staff.name || 'Novo Colaborador'}
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">Gerencie o perfil, comissões e horário de trabalho.</p>
                    </div>
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Column: Photo & Navigation */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Profile Photo Card */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 flex flex-col items-center text-center">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-lg mb-4 group cursor-pointer">
                            {staff.imageUrl ? (
                                <img src={staff.imageUrl} alt={staff.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <User size={40} />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                                <Camera className="text-white" size={20} />
                            </div>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{staff.name || 'Nome'}</h3>
                        <p className="text-xs text-slate-500">{staff.role || 'Colaborador'}</p>
                    </div>

                    {/* Navigation Tabs */}
                    <nav className="flex flex-col gap-1">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors text-left ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <User size={18} />
                            <span>Perfil & Acesso</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('availability')}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors text-left ${activeTab === 'availability' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <Calendar size={18} />
                            <span>Disponibilidade</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('commissions')}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors text-left ${activeTab === 'commissions' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <Percent size={18} />
                            <span>Comissões</span>
                        </button>
                    </nav>
                </div>

                {/* Main Content Column */}
                <div className="lg:col-span-9 space-y-6">

                    {/* TAB: PROFILE */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                                    <div className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 shadow-sm">
                                        <User size={20} />
                                    </div>
                                    <h3 className="font-semibold text-slate-900">Informações Pessoais</h3>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome Completo</label>
                                        <input
                                            className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                                            value={staff.name}
                                            onChange={e => setStaff({ ...staff, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                                        <input
                                            className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                                            value={staff.email || ''}
                                            onChange={e => setStaff({ ...staff, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Telemóvel</label>
                                        <input
                                            className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                                            value={staff.mobile || ''}
                                            onChange={e => setStaff({ ...staff, mobile: e.target.value })}
                                            placeholder="910..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Cargo / Função</label>
                                        <input
                                            className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                                            value={staff.role || ''}
                                            onChange={e => setStaff({ ...staff, role: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Especialidade</label>
                                        <input
                                            className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                                            value={staff.specialty || ''}
                                            onChange={e => setStaff({ ...staff, specialty: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Biografia</label>
                                        <textarea
                                            className="block w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none resize-none"
                                            rows={3}
                                            value={staff.bio || ''}
                                            onChange={e => setStaff({ ...staff, bio: e.target.value })}
                                            placeholder="Breve descrição sobre o colaborador..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
                                <h4 className="font-semibold text-slate-900 mb-4 text-sm">Configuração de Acesso</h4>
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer">
                                        <span className="text-sm font-medium text-slate-700">Mostrar na App / Portal</span>
                                        <div className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={staff.permissions?.visibleInApp}
                                                onChange={() => setStaff({ ...staff, permissions: { ...staff.permissions!, visibleInApp: !staff.permissions?.visibleInApp } })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                        </div>
                                    </label>

                                    <div className="p-3 rounded-lg border border-slate-100">
                                        <label className="block text-xs font-medium text-slate-500 mb-2">Cor na Agenda</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'].map(color => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => setStaff({ ...staff, color })}
                                                    className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${staff.color === color ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''}`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: AVAILABILITY */}
                    {activeTab === 'availability' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Horário Base</h3>
                                        <p className="text-xs text-slate-500">Defina o horário padrão semanal.</p>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                                            <tr>
                                                <th className="text-left font-medium py-3 px-4 w-32">Dia</th>
                                                <th className="text-left font-medium py-3 px-4">Início</th>
                                                <th className="text-left font-medium py-3 px-4 text-center">Pausa (Almoço)</th>
                                                <th className="text-left font-medium py-3 px-4">Fim</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {weekDays.map(day => {
                                                const daySchedule = staff.schedule?.[day.key];
                                                const isEnabled = daySchedule?.enabled;
                                                return (
                                                    <tr key={day.key} className={`group transition-colors ${isEnabled ? 'hover:bg-slate-50' : 'bg-slate-50/30'}`}>
                                                        <td className="py-3 px-4">
                                                            <label className="flex items-center gap-3 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isEnabled}
                                                                    onChange={(e) => handleScheduleChange(day.key, 'enabled', e.target.checked)}
                                                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                                                                />
                                                                <span className={`font-medium ${isEnabled ? 'text-slate-900' : 'text-slate-400'}`}>{day.label}</span>
                                                            </label>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <select
                                                                value={daySchedule?.start}
                                                                onChange={(e) => handleScheduleChange(day.key, 'start', e.target.value)}
                                                                disabled={!isEnabled}
                                                                className={`block w-full py-1.5 pl-2 pr-8 rounded-md border text-xs focus:ring-1 outline-none ${isEnabled ? 'border-slate-300 focus:border-blue-600 focus:ring-blue-600' : 'bg-transparent border-transparent text-transparent cursor-default'}`}
                                                            >
                                                                {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                                            </select>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <select
                                                                    value={daySchedule?.breakStart || ''}
                                                                    onChange={(e) => handleScheduleChange(day.key, 'breakStart', e.target.value)}
                                                                    disabled={!isEnabled}
                                                                    className={`block w-20 py-1.5 pl-2 pr-4 rounded-md border text-xs focus:ring-1 outline-none ${isEnabled ? 'border-slate-300 focus:border-blue-600 focus:ring-blue-600' : 'bg-transparent border-transparent text-transparent cursor-default'}`}
                                                                >
                                                                    <option value="">-</option>
                                                                    {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                                                </select>
                                                                <span className="text-slate-400 text-xs">até</span>
                                                                <select
                                                                    value={daySchedule?.breakEnd || ''}
                                                                    onChange={(e) => handleScheduleChange(day.key, 'breakEnd', e.target.value)}
                                                                    disabled={!isEnabled}
                                                                    className={`block w-20 py-1.5 pl-2 pr-4 rounded-md border text-xs focus:ring-1 outline-none ${isEnabled ? 'border-slate-300 focus:border-blue-600 focus:ring-blue-600' : 'bg-transparent border-transparent text-transparent cursor-default'}`}
                                                                >
                                                                    <option value="">-</option>
                                                                    {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                                                </select>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <select
                                                                value={daySchedule?.end}
                                                                onChange={(e) => handleScheduleChange(day.key, 'end', e.target.value)}
                                                                disabled={!isEnabled}
                                                                className={`block w-full py-1.5 pl-2 pr-8 rounded-md border text-xs focus:ring-1 outline-none ${isEnabled ? 'border-slate-300 focus:border-blue-600 focus:ring-blue-600' : 'bg-transparent border-transparent text-transparent cursor-default'}`}
                                                            >
                                                                {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                                            </select>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                                <div className="p-1 bg-white rounded-full text-blue-500 mt-1">
                                    <Clock size={16} />
                                </div>
                                <div className="text-sm text-blue-800">
                                    <p className="font-semibold mb-1">Como funciona a disponibilidade?</p>
                                    <p className="opacity-80">
                                        Os clientes só poderão agendar online dentro destes horários.
                                        Se definir uma pausa (ex: 13:00 às 14:00), esse intervalo ficará bloqueado na agenda online.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: COMMISSIONS */}
                    {activeTab === 'commissions' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg">
                                            <Percent size={20} />
                                        </div>
                                        <h3 className="font-semibold text-slate-900">Configuração de Comissões</h3>
                                    </div>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Comissão de Executante</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={staff.commissions?.executing?.value || ''}
                                                onChange={(e) => setStaff({ ...staff, commissions: { ...staff.commissions!, executing: { ...staff.commissions!.executing, value: parseFloat(e.target.value) } } })}
                                                className="block w-full pl-4 pr-10 py-3 rounded-lg border border-slate-300 text-slate-900 font-bold focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none shadow-sm"
                                                placeholder="0"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2">Percentagem sobre o valor do serviço quando este colaborador o realiza.</p>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Comissão de Responsável</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={staff.commissions?.responsible?.value || ''}
                                                onChange={(e) => setStaff({ ...staff, commissions: { ...staff.commissions!, responsible: { ...staff.commissions!.responsible, value: parseFloat(e.target.value) } } })}
                                                className="block w-full pl-4 pr-10 py-3 rounded-lg border border-slate-300 text-slate-900 font-bold focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none shadow-sm"
                                                placeholder="0"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2">Percentagem sobre vendas a clientes onde este colaborador é o gestor de conta.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
