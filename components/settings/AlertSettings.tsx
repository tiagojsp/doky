import React, { useState } from 'react';
import { Save, Bell, Mail, Monitor } from 'lucide-react';

export const AlertSettings: React.FC = () => {
    const [saving, setSaving] = useState(false);

    // Client - Emails
    const [clientEmailAppointments, setClientEmailAppointments] = useState(true);

    // Collaborator - Emails - Backoffice
    const [collabEmailBackofficeAdmin, setCollabEmailBackofficeAdmin] = useState(true);
    const [collabEmailBackofficeManager, setCollabEmailBackofficeManager] = useState(true);
    const [collabEmailBackofficeProvider, setCollabEmailBackofficeProvider] = useState(true);

    // Collaborator - Emails - Online
    const [collabEmailOnlineAdmin, setCollabEmailOnlineAdmin] = useState(true);
    const [collabEmailOnlineManager, setCollabEmailOnlineManager] = useState(true);
    const [collabEmailOnlineProvider, setCollabEmailOnlineProvider] = useState(true);

    // Collaborator - System/Backoffice Notifications
    const [collabSysBackofficeAdmin, setCollabSysBackofficeAdmin] = useState(true);
    const [collabSysBackofficeManager, setCollabSysBackofficeManager] = useState(true);
    const [collabSysBackofficeProvider, setCollabSysBackofficeProvider] = useState(true);

    // Collaborator - System/Online Notifications
    const [collabSysOnlineAdmin, setCollabSysOnlineAdmin] = useState(true);
    const [collabSysOnlineManager, setCollabSysOnlineManager] = useState(true);
    const [collabSysOnlineProvider, setCollabSysOnlineProvider] = useState(true);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => setSaving(false), 1000);
    };

    return (
        <div className="max-w-screen-xl mx-auto pb-20 px-4 md:px-8">
            <div className="py-8">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Configuração de Alertas</h2>
                <p className="text-slate-500 mt-2 text-sm max-w-4xl">
                    Defina quem recebe notificações (email ou sistema) quando ocorrem agendamentos, alterações ou cancelamentos.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Internal Notifications (Backoffice System) */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Monitor size={20} />
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">Notificações internas (Backoffice)</h3>
                    </div>

                    <div className="p-6 space-y-8 flex-1">
                        <div>
                            <h4 className="font-bold text-slate-900 mb-3 text-sm">Sempre que uma marcação é agendada ou alterada no seu <span className="text-blue-600">backoffice</span>:</h4>
                            <div className="space-y-3 pl-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" checked={collabSysBackofficeAdmin} onChange={(e) => setCollabSysBackofficeAdmin(e.target.checked)} className="peer sr-only" />
                                    <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-sm opacity-0 peer-checked:opacity-100" />
                                    </div>
                                    <span className="text-slate-600 text-sm font-medium group-hover:text-slate-900">Utilizadores com acesso - Administrador</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" checked={collabSysBackofficeManager} onChange={(e) => setCollabSysBackofficeManager(e.target.checked)} className="peer sr-only" />
                                    <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-sm opacity-0 peer-checked:opacity-100" />
                                    </div>
                                    <span className="text-slate-600 text-sm font-medium group-hover:text-slate-900">Utilizadores com acesso - Gerente ou Receção</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" checked={collabSysBackofficeProvider} onChange={(e) => setCollabSysBackofficeProvider(e.target.checked)} className="peer sr-only" />
                                    <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-sm opacity-0 peer-checked:opacity-100" />
                                    </div>
                                    <span className="text-slate-600 text-sm font-medium group-hover:text-slate-900">Prestador do serviço em questão</span>
                                </label>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-6">
                            <h4 className="font-bold text-slate-900 mb-3 text-sm">Sempre que uma marcação <span className="text-blue-600">online</span> é efetuada:</h4>
                            <div className="space-y-3 pl-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" checked={collabSysOnlineAdmin} onChange={(e) => setCollabSysOnlineAdmin(e.target.checked)} className="peer sr-only" />
                                    <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-sm opacity-0 peer-checked:opacity-100" />
                                    </div>
                                    <span className="text-slate-600 text-sm font-medium group-hover:text-slate-900">Utilizadores com acesso - Administrador</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" checked={collabSysOnlineManager} onChange={(e) => setCollabSysOnlineManager(e.target.checked)} className="peer sr-only" />
                                    <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-sm opacity-0 peer-checked:opacity-100" />
                                    </div>
                                    <span className="text-slate-600 text-sm font-medium group-hover:text-slate-900">Utilizadores com acesso - Gerente ou Receção</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" checked={collabSysOnlineProvider} onChange={(e) => setCollabSysOnlineProvider(e.target.checked)} className="peer sr-only" />
                                    <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-sm opacity-0 peer-checked:opacity-100" />
                                    </div>
                                    <span className="text-slate-600 text-sm font-medium group-hover:text-slate-900">Prestador do serviço em questão</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Email Notifications */}
                <div className="space-y-8">

                    {/* Client Emails */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                <Mail size={20} />
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg">Emails a Clientes</h3>
                        </div>
                        <div className="p-6">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="relative mt-0.5">
                                    <input type="checkbox" checked={clientEmailAppointments} onChange={(e) => setClientEmailAppointments(e.target.checked)} className="peer sr-only" />
                                    <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-green-500 peer-checked:border-green-500 transition-all flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-sm opacity-0 peer-checked:opacity-100" />
                                    </div>
                                </div>
                                <div>
                                    <span className="text-slate-700 font-medium text-sm block group-hover:text-slate-900">Enviar os dados da marcação ao cliente, sempre que uma marcação é agendada, alterada ou cancelada.</span>
                                </div>
                            </label>
                            <p className="mt-4 text-xs text-slate-400 italic">
                                Nota: as notificações a clientes respeitam as preferências de comunicação presentes na Ficha de Cliente.
                            </p>
                        </div>
                    </div>

                    {/* Collaborator Emails */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                <Mail size={20} />
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg">Emails a Colaboradores</h3>
                        </div>

                        <div className="p-6 space-y-8">
                            <div>
                                <h4 className="font-bold text-slate-900 mb-3 text-sm">Sempre que uma marcação é agendada ou alterada no seu <span className="text-indigo-600">backoffice</span>:</h4>
                                <div className="space-y-3 pl-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" checked={collabEmailBackofficeAdmin} onChange={(e) => setCollabEmailBackofficeAdmin(e.target.checked)} className="peer sr-only" />
                                        <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-sm opacity-0 peer-checked:opacity-100" />
                                        </div>
                                        <span className="text-slate-600 text-sm font-medium group-hover:text-slate-900">Utilizadores com acesso - Administrador</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" checked={collabEmailBackofficeManager} onChange={(e) => setCollabEmailBackofficeManager(e.target.checked)} className="peer sr-only" />
                                        <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-sm opacity-0 peer-checked:opacity-100" />
                                        </div>
                                        <span className="text-slate-600 text-sm font-medium group-hover:text-slate-900">Utilizadores com acesso - Gerente ou Receção</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" checked={collabEmailBackofficeProvider} onChange={(e) => setCollabEmailBackofficeProvider(e.target.checked)} className="peer sr-only" />
                                        <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-sm opacity-0 peer-checked:opacity-100" />
                                        </div>
                                        <span className="text-slate-600 text-sm font-medium group-hover:text-slate-900">Prestador do serviço em questão</span>
                                    </label>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-6">
                                <h4 className="font-bold text-slate-900 mb-3 text-sm">Sempre que uma marcação <span className="text-indigo-600">online</span> é efetuada:</h4>
                                <div className="space-y-3 pl-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" checked={collabEmailOnlineAdmin} onChange={(e) => setCollabEmailOnlineAdmin(e.target.checked)} className="peer sr-only" />
                                        <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-sm opacity-0 peer-checked:opacity-100" />
                                        </div>
                                        <span className="text-slate-600 text-sm font-medium group-hover:text-slate-900">Utilizadores com acesso - Administrador</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" checked={collabEmailOnlineManager} onChange={(e) => setCollabEmailOnlineManager(e.target.checked)} className="peer sr-only" />
                                        <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-sm opacity-0 peer-checked:opacity-100" />
                                        </div>
                                        <span className="text-slate-600 text-sm font-medium group-hover:text-slate-900">Utilizadores com acesso - Gerente ou Receção</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" checked={collabEmailOnlineProvider} onChange={(e) => setCollabEmailOnlineProvider(e.target.checked)} className="peer sr-only" />
                                        <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-sm opacity-0 peer-checked:opacity-100" />
                                        </div>
                                        <span className="text-slate-600 text-sm font-medium group-hover:text-slate-900">Prestador do serviço em questão</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Action */}
            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-doky-action-cyan to-doky-blue text-white text-sm font-bold rounded-lg hover:shadow-lg hover:from-cyan-500 hover:to-blue-600 focus:ring-4 focus:ring-cyan-100 transition-all shadow-md shadow-cyan-500/20 uppercase tracking-wide disabled:opacity-70 disabled:grayscale"
                >
                    {saving ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                            A GRAVAR...
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            GUARDAR
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
