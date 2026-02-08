import React, { useState, useEffect } from 'react';
import { Client, Appointment } from '../types';
import {
    Mail, X, CreditCard, Calendar, Shield, Save, Camera,
    FileText, Award, History, Trash2, Clock
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';

interface ClientFormModalProps {
    client: Client;
    onClose: () => void;
    onSave: (client: Client) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    appointments?: Appointment[];
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
    client,
    onClose,
    onSave,
    onDelete,
    appointments
}) => {
    const [editingClient, setEditingClient] = useState<Client>(client);
    const [saving, setSaving] = useState(false);

    // Sync if prop changes
    useEffect(() => {
        setEditingClient(client);
    }, [client]);

    const handleSaveClick = async () => {
        setSaving(true);
        await onSave(editingClient);
        setSaving(false);
    };

    const handleDeleteClick = async () => {
        await onDelete(editingClient.id);
    };

    // Derived stats
    const clientAppts = appointments ? appointments.filter(a => a.clientId === editingClient.id) : [];
    const pastAppts = clientAppts.filter(a => new Date(a.date) < new Date()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const futureAppts = clientAppts.filter(a => new Date(a.date) >= new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const lastVisitDate = pastAppts[0]?.date ? new Date(pastAppts[0].date) : null;
    const daysAgo = lastVisitDate ? Math.floor((new Date().getTime() - lastVisitDate.getTime()) / (1000 * 3600 * 24)) : 0;

    const nextVisitDate = futureAppts[0]?.date ? new Date(futureAppts[0].date) : null;
    const daysUntil = nextVisitDate ? Math.floor((nextVisitDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white/95 backdrop-blur-2xl w-full max-w-5xl h-[90vh] rounded-[2rem] shadow-2xl border border-white/50 flex flex-col overflow-hidden animate-scale-in">

                {/* Modal Header */}
                <div className="flex justify-between items-start p-6 md:p-8 border-b border-slate-100 bg-white/50">
                    <div className="flex items-center gap-6">
                        <div className="relative group cursor-pointer">
                            <div className={`w-24 h-24 rounded-3xl ${editingClient.avatarColor || 'bg-slate-200'} flex items-center justify-center text-slate-600 shadow-inner overflow-hidden`}>
                                {editingClient.imageUrl ? (
                                    <img src={editingClient.imageUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl font-bold opacity-30">{editingClient.name.charAt(0)}</span>
                                )}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white rounded-3xl">
                                    <Camera size={24} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{editingClient.name}</h2>
                                <button className="text-slate-400 hover:text-cyan-600"><FileText size={16} /></button>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <div className="flex items-center gap-1">
                                    <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Ref:</span>
                                    <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{editingClient.ref || editingClient.id.substr(0, 6)}</span>
                                </div>
                                <div className="w-px h-3 bg-slate-300"></div>
                                <span>{editingClient.city || 'Localidade não definida'}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${editingClient.segment === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {editingClient.segment === 'Active' ? 'Cliente Ativo' : 'Inativo'}
                                </span>
                                {editingClient.loyalty && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 flex items-center gap-1">
                                        <Award size={10} />
                                        Nível Gold
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                            <X size={24} />
                        </button>
                        <div className="text-right text-xs text-slate-400 mt-2">
                            <p>Última Visita: <span className="font-bold text-slate-600">{daysAgo > 0 ? `${daysAgo} dias atrás` : lastVisitDate ? 'Hoje' : '-'}</span></p>
                            <p>Próxima: <span className="font-bold text-cyan-600">{daysUntil !== null ? `Em ${daysUntil} dias` : 'Não agendada'}</span></p>
                        </div>
                    </div>
                </div>

                {/* Modal Content - Scrollable Grid */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-slate-50/50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* LEFT COLUMN - PERSONAL & ADDRESS */}
                        <div className="space-y-8">
                            {/* Personal Info */}
                            <section>
                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Dados Pessoais</h4>
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-8">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Nome Completo</label>
                                        <input
                                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all font-medium"
                                            value={editingClient.name}
                                            onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Data Nascimento</label>
                                        <input
                                            type="date"
                                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700"
                                            value={editingClient.birthDate || ''}
                                            onChange={(e) => setEditingClient({ ...editingClient, birthDate: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-span-12 md:col-span-6">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">NIF (Contribuinte)</label>
                                        <input
                                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 font-mono"
                                            placeholder="000 000 000"
                                            value={editingClient.nif || ''}
                                            onChange={(e) => setEditingClient({ ...editingClient, nif: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-6 flex items-center gap-4 pt-4">
                                        <div className="flex items-center gap-2">
                                            <input type="radio" name="gender"
                                                checked={editingClient.gender === 'F'}
                                                onChange={() => setEditingClient({ ...editingClient, gender: 'F' })}
                                            />
                                            <span className="text-sm text-slate-600">Feminino</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="radio" name="gender"
                                                checked={editingClient.gender === 'M'}
                                                onChange={() => setEditingClient({ ...editingClient, gender: 'M' })}
                                            />
                                            <span className="text-sm text-slate-600">Masculino</span>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="col-span-12">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Morada</label>
                                        <input
                                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700"
                                            placeholder="Rua, Nº, Andar..."
                                            value={editingClient.address || ''}
                                            onChange={(e) => setEditingClient({ ...editingClient, address: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Código Postal</label>
                                        <input
                                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700"
                                            placeholder="0000-000"
                                            value={editingClient.postalCode || ''}
                                            onChange={(e) => setEditingClient({ ...editingClient, postalCode: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-7">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Localidade</label>
                                        <input
                                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700"
                                            value={editingClient.city || ''}
                                            onChange={(e) => setEditingClient({ ...editingClient, city: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* LOYALTY CARD SECTION */}
                            <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                    <Award size={100} />
                                </div>
                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <CreditCard size={18} className="text-purple-500" />
                                    Cartão de Cliente
                                </h4>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Visitas Acumuladas</p>
                                        <p className="text-2xl font-black text-slate-800">{editingClient.loyalty?.visits || 0}</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Saldo em Cartão</p>
                                        <p className="text-2xl font-black text-emerald-600">{editingClient.loyalty?.balance || 0}€</p>
                                    </div>
                                </div>

                                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 mb-2">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-purple-700 uppercase">Próximo Voucher</span>
                                        <span className="text-xs font-bold text-purple-700">Faltam {editingClient.loyalty?.nextVoucherDiff || 9} visitas</span>
                                    </div>
                                    <div className="w-full h-2 bg-purple-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 w-[10%] rounded-full"></div>
                                    </div>
                                    <p className="text-[10px] text-purple-600 mt-2 leading-tight">
                                        Ao atingir 10 visitas ganha Voucher de 5% de desconto em serviços de Spa.
                                    </p>
                                </div>
                            </section>
                        </div>

                        {/* RIGHT COLUMN - CONTACTS & CONSENT */}
                        <div className="space-y-8">
                            {/* Contacts */}
                            <section>
                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Dados Contacto</h4>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Email</label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                                            <input
                                                type="email"
                                                className="w-full pl-9 p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-slate-300 focus:border-cyan-500 transition-colors"
                                                value={editingClient.email}
                                                onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Telemóvel</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-2.5 flex items-center gap-1 border-r border-slate-200 pr-2 mr-2">
                                                    <img src="https://flagcdn.com/w20/pt.png" className="w-4 rounded-sm" alt="PT" />
                                                </div>
                                                <input
                                                    className="w-full pl-14 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800 font-bold tracking-wide"
                                                    value={editingClient.mobile}
                                                    onChange={(e) => setEditingClient({ ...editingClient, mobile: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Telemóvel Alternativo</label>
                                            <input
                                                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700"
                                                value={editingClient.alternativeMobile || ''}
                                                onChange={(e) => setEditingClient({ ...editingClient, alternativeMobile: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Notas / Obs</label>
                                        <textarea
                                            rows={3}
                                            className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 resize-none"
                                            placeholder="Ex: Cliente prefere contacto por email..."
                                            value={editingClient.notes || ''}
                                            onChange={(e) => setEditingClient({ ...editingClient, notes: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* History Section (Connected to DB) */}
                            <section>
                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
                                    <History size={16} className="text-slate-400" />
                                    Histórico de Visitas ({appointments ? appointments.filter(a => a.clientId === editingClient.id).length : 0})
                                </h4>

                                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                    {appointments && appointments.filter(a => a.clientId === editingClient.id).length > 0 ? (
                                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                            {appointments
                                                .filter(a => a.clientId === editingClient.id)
                                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                                .map((appt) => (
                                                    <div key={appt.id} className="p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-2 rounded-lg ${appt.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                                                                <Calendar size={14} />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-bold text-slate-700">
                                                                    {format(parseISO(appt.date), "d 'de' MMMM, yyyy", { locale: pt })}
                                                                </p>
                                                                <p className="text-[10px] text-slate-500 uppercase tracking-wide">{appt.startTime}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${appt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                                appt.paymentStatus === 'paid' ? 'bg-blue-100 text-blue-700' :
                                                                    appt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                                        'bg-slate-100 text-slate-600'
                                                                }`}>
                                                                {appt.paymentStatus === 'paid' ? 'Pago' : appt.status === 'confirmed' ? 'Confirmado' : appt.status === 'cancelled' ? 'Cancelado' : appt.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-slate-400 text-sm">
                                            <Clock size={24} className="mx-auto mb-2 opacity-30" />
                                            <p>Sem registo de visitas.</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Consent (GDPR) */}
                            <section>
                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
                                    <Shield size={16} className="text-slate-400" />
                                    Consentimento (RGPD)
                                </h4>
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col gap-3">
                                    {[
                                        { id: 'marketing', label: 'Marketing (aniversários e campanhas)' },
                                        { id: 'sms', label: 'Lembretes via SMS ou Notificação' },
                                        { id: 'email', label: 'Lembretes via Email' },
                                        { id: 'photos', label: 'Partilha de fotos (Antes/Depois)' }
                                    ].map((opt) => (
                                        <div key={opt.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg transition-colors">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${editingClient.consent?.[opt.id as keyof typeof editingClient.consent] ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-white border-slate-300'}`}
                                                onClick={() => setEditingClient({
                                                    ...editingClient,
                                                    consent: { ...editingClient.consent, [opt.id]: !editingClient.consent?.[opt.id as keyof typeof editingClient.consent] } as any
                                                })}
                                            >
                                                {editingClient.consent?.[opt.id as keyof typeof editingClient.consent] && <X size={12} className="rotate-45" />}
                                            </div>
                                            <span className="text-sm text-slate-600">{opt.label}</span>
                                        </div>
                                    ))}

                                    <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-green-600 font-bold flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        Consentimento validado em 03 Set 2025
                                    </div>
                                    <button className="text-xs text-cyan-600 font-bold hover:underline text-left mt-1">
                                        ALTERAR CONSENTIMENTOS
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-white border-t border-slate-100 flex justify-between items-center">
                    <button onClick={handleDeleteClick} className="flex items-center gap-2 text-red-400 hover:text-red-500 font-bold px-4 py-2 rounded-xl hover:bg-red-50 transition-colors pointer-events-auto">
                        <Trash2 size={18} />
                        <span>Eliminar Ficha</span>
                    </button>
                    <div className="flex gap-4">
                        <button onClick={onClose} className="px-8 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors">
                            Cancelar
                        </button>
                        <button onClick={handleSaveClick} disabled={saving} className="px-8 py-3 bg-cyan-500 text-white font-bold rounded-xl hover:bg-cyan-600 shadow-lg shadow-cyan-500/30 flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-70 disabled:grayscale">
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                                    A GRAVAR...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    GUARDAR FICHA
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
