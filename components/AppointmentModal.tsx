import React, { useState, useEffect } from 'react';
import { Appointment, Staff, Client, Service } from '../types';
import { X, Calendar as CalendarIcon, Clock, Percent, Repeat, Plus, AlertCircle, Save, Ban, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (appt: any) => void;
    initialData?: Appointment | null;
    selectedDate?: string;
    selectedTime?: string;
    staff: Staff[];
    clients: Client[];
    services: Service[];
}

export const AppointmentModal: React.FC<Props> = ({
    isOpen, onClose, onSave, initialData, selectedDate, selectedTime, staff, clients, services
}) => {
    if (!isOpen) return null;

    // Mode State
    const [mode, setMode] = useState<'appointment' | 'block'>('appointment');

    // Form State
    const [clientId, setClientId] = useState('');
    const [professionalId, setProfessionalId] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [notes, setNotes] = useState('');
    const [coupon, setCoupon] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [blockReason, setBlockReason] = useState('');

    // Status State
    const [status, setStatus] = useState<'confirmed' | 'arrived' | 'paid' | 'no_show' | 'cancelled' | 'blocked'>('confirmed');
    const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid' | 'refunded' | undefined>(undefined);

    // Initialize
    useEffect(() => {
        if (initialData) {
            setMode(initialData.status === 'blocked' ? 'block' : 'appointment');
            setClientId(initialData.clientId);
            setProfessionalId(initialData.staffId);
            setServiceId(initialData.serviceId);
            setDate(initialData.date);
            setStartTime(initialData.startTime);
            setNotes(initialData.notes || '');
            setBlockReason(initialData.blockReason || '');
            if (initialData.status) setStatus(initialData.status);
            if (initialData.paymentStatus) setPaymentStatus(initialData.paymentStatus);
        } else {
            // Defaults for new
            setMode('appointment');
            setClientId(clients[0]?.id || '');
            setProfessionalId(staff[0]?.id || '');
            setServiceId(services[0]?.id || '');
            setDate(selectedDate || format(new Date(), 'yyyy-MM-dd'));
            setStartTime(selectedTime || '09:00');
            setStatus('confirmed');
            setBlockReason('');
        }
    }, [initialData, selectedDate, selectedTime, clients, staff, services]);

    const handleSave = () => {
        if (mode === 'appointment') {
            if (!clientId || !professionalId || !serviceId) return;
        } else {
            if (!professionalId) return;
        }

        const apptData = {
            id: initialData?.id,
            clientId: mode === 'block' ? 'system_block' : clientId,
            staffId: professionalId,
            serviceId: mode === 'block' ? 'system_block' : serviceId,
            date,
            startTime,
            notes,
            coupon,
            isRecurring,
            status: mode === 'block' ? 'blocked' : status,
            paymentStatus: mode === 'block' ? undefined : paymentStatus,
            blockReason: mode === 'block' ? blockReason : undefined,
            color: mode === 'block' ? 'bg-slate-200' : undefined // Let parent handle color or set here
        };
        onSave(apptData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in py-10">
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-full animate-scale-in">

                {/* Header */}
                <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-b border-slate-200">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setMode('appointment')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'appointment' ? 'bg-white shadow-sm text-cyan-600 ring-1 ring-cyan-100' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                            <CalendarIcon size={16} />
                            NOVA MARCAÇÃO
                        </button>
                        <button
                            onClick={() => { setMode('block'); setStatus('blocked'); }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'block' ? 'bg-white shadow-sm text-slate-700 ring-1 ring-slate-200' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                            <Ban size={16} />
                            BLOQUEAR HORÁRIO
                        </button>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full shadow-sm hover:shadow transition-all">
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6">

                    {mode === 'appointment' ? (
                        <>
                            {/* APPOINTMENT FORM */}
                            {/* Row 1: Professional */}
                            <div className="grid grid-cols-12 gap-4 items-center">
                                <label className="col-span-3 text-right text-sm font-bold text-slate-600">Profissional*</label>
                                <div className="col-span-9">
                                    <select
                                        className="w-full p-2.5 bg-white border border-slate-300 rounded-md text-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-sm"
                                        value={professionalId}
                                        onChange={(e) => setProfessionalId(e.target.value)}
                                    >
                                        {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Row 2: Client */}
                            <div className="grid grid-cols-12 gap-4 items-center">
                                <label className="col-span-3 text-right text-sm font-bold text-slate-600">Cliente*</label>
                                <div className="col-span-9 flex gap-2">
                                    <div className="relative flex-1">
                                        <select
                                            className="w-full p-2.5 bg-white border border-slate-300 rounded-md text-slate-700 focus:ring-2 focus:ring-cyan-500"
                                            value={clientId}
                                            onChange={(e) => setClientId(e.target.value)}
                                        >
                                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <button className="text-cyan-600 font-medium text-sm whitespace-nowrap hover:underline px-2">
                                        novo cliente
                                    </button>
                                </div>
                            </div>

                            {/* Row 3: Service */}
                            <div className="grid grid-cols-12 gap-4 items-center">
                                <label className="col-span-3 text-right text-sm font-bold text-slate-600">Serviço*</label>
                                <div className="col-span-9 flex gap-2">
                                    <select
                                        className="flex-[3] p-2.5 bg-white border border-slate-300 rounded-md text-slate-700"
                                        value={serviceId}
                                        onChange={(e) => setServiceId(e.target.value)}
                                    >
                                        <option value="">Selecione serviço</option>
                                        {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <hr className="border-slate-100" />
                        </>
                    ) : (
                        <>
                            {/* BLOCK FORM */}
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                                <AlertCircle className="text-slate-400 mt-0.5" size={20} />
                                <div className="text-sm text-slate-600">
                                    <p className="font-bold text-slate-700">Bloqueio de Agenda</p>
                                    <p>Esta ação impedirá quaisquer agendamentos online para o profissional selecionado neste período.</p>
                                </div>
                            </div>

                            {/* Row 1: Professional */}
                            <div className="grid grid-cols-12 gap-4 items-center">
                                <label className="col-span-3 text-right text-sm font-bold text-slate-600">Profissional*</label>
                                <div className="col-span-9">
                                    <select
                                        className="w-full p-2.5 bg-white border border-slate-300 rounded-md text-slate-700 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all shadow-sm"
                                        value={professionalId}
                                        onChange={(e) => setProfessionalId(e.target.value)}
                                    >
                                        {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Row 2: Reason */}
                            <div className="grid grid-cols-12 gap-4 items-center">
                                <label className="col-span-3 text-right text-sm font-bold text-slate-600">Motivo</label>
                                <div className="col-span-9">
                                    <input
                                        type="text"
                                        placeholder="Ex: Formação, Doença, Férias..."
                                        className="w-full p-2.5 bg-white border border-slate-300 rounded-md text-slate-700 focus:ring-2 focus:ring-slate-500"
                                        value={blockReason}
                                        onChange={(e) => setBlockReason(e.target.value)}
                                    />
                                    {/* Quick tags */}
                                    <div className="flex gap-2 mt-2">
                                        {['Almoço', 'Reunião', 'Formação', 'Pessoal', 'Doença'].map(tag => (
                                            <button
                                                key={tag}
                                                onClick={() => setBlockReason(tag)}
                                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-xs text-slate-600 rounded-md transition-colors"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* COMMON FIELDS: DATE & TIME */}
                    <div className="grid grid-cols-12 gap-4 items-center">
                        <label className="col-span-3 text-right text-sm font-bold text-slate-600">Data e Hora</label>
                        <div className="col-span-9 flex items-center gap-4">
                            <input
                                type="date"
                                className="p-2.5 bg-white border border-slate-300 rounded-md text-slate-700"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="time"
                                    className="p-2.5 bg-white border border-slate-300 rounded-md text-slate-700"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {mode === 'appointment' && (
                        <div className="grid grid-cols-12 gap-4 items-start">
                            <label className="col-span-3 text-right text-sm font-bold text-slate-600 mt-2">Notas</label>
                            <div className="col-span-9">
                                <textarea
                                    className="w-full p-3 bg-white border border-slate-300 rounded-md text-slate-700 focus:ring-2 focus:ring-cyan-500 min-h-[80px]"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Notas internas..."
                                />
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Status Bar */}
                <div className="bg-white border-t border-slate-200 p-4">
                    {mode === 'appointment' ? (
                        <div className="flex items-center gap-4 mb-6">
                            <label className="text-sm font-bold text-slate-600 w-24 text-right">Estado</label>
                            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl overflow-x-auto">
                                <button onClick={() => { setStatus('confirmed'); setPaymentStatus(undefined); }} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${status === 'confirmed' ? 'bg-cyan-500 text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}>CONFIRMADA</button>
                                <button onClick={() => setStatus('arrived')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${status === 'arrived' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}>CHEGOU</button>
                                <button onClick={() => setPaymentStatus('paid')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${paymentStatus === 'paid' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}>PAGOU</button>
                                <button onClick={() => setStatus('no_show')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${status === 'no_show' ? 'bg-red-500 text-white' : 'text-slate-500 hover:bg-white'}`}>FALTOU</button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 mb-6">
                            <div className="ml-auto text-xs text-slate-400 italic">
                                O horário selecionado ficará indisponível.
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button onClick={onClose} className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold rounded-lg transition-all">
                            CANCELAR
                        </button>
                        <button
                            onClick={handleSave}
                            className={`px-8 py-3 font-bold rounded-lg shadow-lg transition-all flex items-center gap-2 text-white ${mode === 'block' ? 'bg-slate-700 hover:bg-slate-800 shadow-slate-700/20' : 'bg-cyan-500 hover:bg-cyan-600 shadow-cyan-500/20'}`}
                        >
                            {mode === 'block' ? 'BLOQUEAR HORÁRIO' : 'GUARDAR MARCAÇÃO'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
