import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronRight, AlertCircle, Bot, X, Send, Sparkles } from 'lucide-react';
import { Appointment, Client, ViewState, Service, Staff } from '../types';
import { format, isAfter } from 'date-fns';
import { pt } from 'date-fns/locale';
import { aiService } from '../services/ai';

interface Props {
    appointments: Appointment[];
    clients: Client[];
    services: Service[];
    staff: Staff[];
    onNavigate: (view: ViewState, date?: string, appointmentId?: string) => void;
}

export const FloatingAssistant: React.FC<Props> = ({ appointments, clients, services, staff, onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasNotification, setHasNotification] = useState(true);

    // Chat State
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([]);
    const [isThinking, setIsThinking] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isThinking, isOpen]);

    // Calculate Next Appointment
    const nextAppointment = useMemo(() => {
        const now = new Date();
        const upcoming = appointments
            .filter(app => app.status !== 'cancelled' && app.status !== 'blocked')
            .filter(app => {
                const appDate = new Date(`${app.date}T${app.startTime}`);
                return isAfter(appDate, now);
            })
            .sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.startTime}`);
                const dateB = new Date(`${b.date}T${b.startTime}`);
                return dateA.getTime() - dateB.getTime();
            });

        return upcoming[0] || null;
    }, [appointments]);

    // Calculate Pending Requests
    const pendingCount = useMemo(() => {
        return appointments.filter(a => a.status === 'pending').length;
    }, [appointments]);

    const getClientName = (id: string) => {
        return clients.find(c => c.id === id)?.name || 'Cliente Desconhecido';
    };

    const handleNextApptClick = () => {
        if (nextAppointment) {
            onNavigate(ViewState.AGENDA, nextAppointment.date, nextAppointment.id);
            setIsOpen(false);
        }
    };

    const handlePendingClick = () => {
        onNavigate(ViewState.REPORTS);
        setIsOpen(false);
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsThinking(true);

        // Build Context
        // SMART CONTEXT INJECTION
        // 1. Search for mentioned Clients
        const searchTerms = userMsg.toLowerCase().split(' ').filter(term => term.length > 2);
        const relevantClients = clients.filter(c =>
            searchTerms.some(term => c.name.toLowerCase().includes(term) || c.mobile.includes(term))
        ).slice(0, 3); // Limit to top 3 matches to save context

        // 2. Search for relevant Appointments (for found clients or general schedule)
        const relevantAppointments = appointments.filter(a =>
            relevantClients.some(c => c.id === a.clientId) || // Appts for found clients
            searchTerms.some(term => a.status.includes(term)) // Appts matching status query (e.g. "cancelada")
        ).slice(0, 10);

        // 3. Get Today's Schedule (Full)
        const todayStr = new Date().toISOString().split('T')[0];
        const todaysAppointments = appointments.filter(a => a.date === todayStr);

        // Build Context
        const context = {
            today: todayStr,
            summary: {
                appointmentsCount: appointments.length,
                pendingCount: pendingCount,
                clientsCount: clients.length,
                revenueEstimate: appointments.filter(a => a.status === 'paid').length * 45 // Pure estimate
            },
            // Inject specific data found based on query
            relevantContext: {
                foundClients: relevantClients.map(c => ({
                    name: c.name,
                    mobile: c.mobile,
                    lastVisit: c.lastVisit,
                    notes: c.notes,
                    segment: c.segment,
                    loyalty: c.loyalty
                })),
                foundAppointments: relevantAppointments.map(a => ({
                    date: a.date,
                    time: a.startTime,
                    status: a.status,
                    client: clients.find(c => c.id === a.clientId)?.name,
                    service: services.find(s => s.id === a.serviceId)?.name
                })),
                todaysSchedule: todaysAppointments.map(a => ({
                    time: a.startTime,
                    client: clients.find(c => c.id === a.clientId)?.name,
                    status: a.status,
                    service: services.find(s => s.id === a.serviceId)?.name
                }))
            },
            nextAppointment: nextAppointment ? {
                client: getClientName(nextAppointment.clientId),
                time: nextAppointment.startTime,
                service: services.find(s => s.id === nextAppointment.serviceId)?.name || 'Serviço',
                staff: staff.find(s => s.id === nextAppointment.staffId)?.name || 'Staff'
            } : null,
            availableStaff: staff.map(s => ({ name: s.name, role: s.role })),
            // Simplified lists
            servicesList: services.map(s => s.name)
        };

        const apiKey = import.meta.env.VITE_AI_API_KEY || localStorage.getItem('doky_ai_key') || '';
        const response = await aiService.generateResponse(userMsg, context, apiKey);

        setIsThinking(false);
        setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4 pointer-events-none">

            {/* Floating Panel Content */}
            <div
                className={`
          pointer-events-auto
          w-80 md:w-96 bg-white/95 backdrop-blur-2xl border border-white/50 rounded-[32px] shadow-2xl shadow-cyan-900/20
          transition-all duration-500 ease-out origin-bottom-right overflow-hidden flex flex-col
          ${isOpen ? 'opacity-100 scale-100 translate-y-0 h-[600px]' : 'opacity-0 scale-50 translate-y-20 h-0 pointer-events-none absolute right-0 bottom-0'}
        `}
            >
                {/* Header */}
                <div className="flex-none flex items-center justify-between p-5 border-b border-slate-200/50 bg-white/40">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-doky-action-cyan to-doky-blue flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                            <Bot size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 line-clamp-1">Assistente DOKY</h3>
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Scrollable Content (Widgets + Chat) */}
                <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-slate-50/50">

                    {/* Active Alerts / Widgets Section */}
                    <div className="space-y-3 mb-6">
                        <p className="text-[10px] uppercase font-bold text-slate-400 pl-1 mb-2">Resumo Operacional</p>

                        {/* Next Appointment Widget */}
                        {nextAppointment ? (
                            <div
                                onClick={handleNextApptClick}
                                className="bg-white rounded-2xl p-4 border border-slate-100 relative overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-cyan-50 to-transparent rounded-bl-3xl"></div>
                                <div className="relative z-10 w-full">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600">Próxima Consulta</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="bg-cyan-50 rounded-lg p-2 text-cyan-700 min-w-[48px] text-center border border-cyan-100">
                                            <span className="block text-[10px] font-bold uppercase">
                                                {format(new Date(nextAppointment.date), 'EEE', { locale: pt })}
                                            </span>
                                            <span className="block text-lg font-bold leading-none">{nextAppointment.startTime}</span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-700 leading-tight mb-0.5 truncate">{getClientName(nextAppointment.clientId)}</p>
                                            <p className="text-xs text-slate-400 truncate opacity-80">Clique para ver detalhes</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 rounded-xl bg-white border border-dashed border-slate-200 text-center text-slate-400 text-xs">
                                Sem consultas próximas.
                            </div>
                        )}

                        {/* Pending Alerts Widget */}
                        {pendingCount > 0 && (
                            <div
                                onClick={handlePendingClick}
                                className="flex items-center justify-between bg-orange-50 rounded-xl p-3 border border-orange-100 cursor-pointer hover:bg-orange-100 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 rounded-full bg-orange-200 text-orange-600">
                                        <AlertCircle size={14} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-orange-800">{pendingCount} Pedidos Pendentes</p>
                                    </div>
                                </div>
                                <ChevronRight size={14} className="text-orange-400" />
                            </div>
                        )}
                    </div>

                    {/* Chat Section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] uppercase font-bold text-slate-400 pl-1">Conversa</p>
                            {messages.length > 0 && (
                                <button onClick={() => setMessages([])} className="text-[10px] text-slate-400 hover:text-red-400 transition-colors">Limpar</button>
                            )}
                        </div>

                        {messages.length === 0 ? (
                            <div className="text-center text-xs text-slate-400 py-4 bg-white/50 rounded-xl border border-slate-100/50">
                                <Sparkles size={20} className="mx-auto mb-2 text-cyan-400 opacity-50" />
                                <p>Estou pronto para ajudar!</p>
                                <p className="opacity-60 text-[10px] mt-1">"Como está a faturação?"</p>
                            </div>
                        ) : (
                            <div className="space-y-3 pb-2">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                                        <div className={`max-w-[85%] p-3 rounded-2xl text-xs font-medium shadow-sm ${msg.role === 'user' ? 'bg-gradient-to-br from-doky-action-cyan to-doky-blue text-white rounded-br-none' : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {isThinking && (
                                    <div className="flex justify-start animate-pulse">
                                        <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-bl-none flex gap-1 shadow-sm">
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Input Area (Fixed Bottom) */}
                <div className="flex-none p-4 bg-white border-t border-slate-100">
                    <div className="relative flex items-center gap-2">
                        <input
                            className="flex-1 p-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all outline-none"
                            placeholder="Escreva a sua mensagem..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!input.trim() || isThinking}
                            className="absolute right-2 p-1.5 bg-gradient-to-r from-doky-action-cyan to-doky-blue text-white rounded-lg shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                        >
                            <Send size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    setHasNotification(false);
                }}
                className={`
            pointer-events-auto
            w-16 h-16 rounded-full 
            bg-gradient-to-br from-doky-action-cyan to-doky-blue 
            shadow-[0_8px_30px_rgba(0,194,224,0.4)]
            border-[3px] border-white
            flex items-center justify-center text-white
            transition-all duration-300 hover:scale-110 active:scale-95
            relative
            ${isOpen ? 'rotate-90 opacity-0 pointer-events-none' : 'rotate-0 opacity-100'}
        `}
            >
                <Bot size={28} />
                {/* Notification Dot */}
                {hasNotification && (pendingCount > 0 || nextAppointment) && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-bounce"></span>
                )}
            </button>
        </div>
    );
};
