import React, { useState, useEffect } from 'react';
import { Save, HelpCircle, Smartphone, Mail, MessageSquare, Clock, Check, Calendar } from 'lucide-react';
import { api } from '../../services/api';

export const NotificationSettings: React.FC = () => {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // State mapped to UI
    const [enabled, setEnabled] = useState(true);
    const [message, setMessage] = useState('');
    const [sendSmart, setSendSmart] = useState(true);
    const [sendSMS, setSendSMS] = useState(false);
    const [sendEmail, setSendEmail] = useState(true);
    const [resendSMS, setResendSMS] = useState(false);
    const [reminderTiming, setReminderTiming] = useState('1');
    const [sameDayTiming, setSameDayTiming] = useState('none');
    const [confirmationType, setConfirmationType] = useState('simple');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await api.fetchEstablishmentSettings();
            setSettings(data);

            // Populate local state
            if (data.notifications) {
                setEnabled(data.notifications.enabled);
                setMessage(data.notifications.message);
                setSendSmart(data.notifications.channels.smart);
                setSendSMS(data.notifications.channels.sms);
                setSendEmail(data.notifications.channels.email);
                setResendSMS(data.notifications.resendSmsIfNeeded);
                setReminderTiming(String(data.notifications.timing.reminder));
                setSameDayTiming(data.notifications.timing.sameDay);
                setConfirmationType(data.notifications.confirmationType);
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
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
                notifications: {
                    enabled,
                    message,
                    channels: { smart: sendSmart, sms: sendSMS, email: sendEmail },
                    timing: { reminder: parseInt(reminderTiming), sameDay: sameDayTiming },
                    confirmationType,
                    resendSmsIfNeeded: resendSMS
                }
            };

            const success = await api.updateEstablishmentSettings(updatedSettings);
            if (success) {
                setSettings(updatedSettings);
            } else {
                console.error('Failed to save notification settings');
            }
        } catch (error) {
            console.error('Error saving notification settings:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-400">A carregar definições...</div>;

    return (
        <div className="max-w-screen-xl mx-auto pb-20 px-4 md:px-8">
            <div className="py-8">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Lembretes automáticos - SMS ou Email</h2>
                <div className="flex items-center gap-3 mt-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        <span className="ml-3 text-sm font-bold text-slate-700">{enabled ? 'Ativar' : 'Desativado'}</span>
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Message Editor */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Editar a sua mensagem:</h3>
                    <div className="relative">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all resize-none font-mono leading-relaxed"
                            placeholder="Escreva a sua mensagem..."
                        />
                        <div className="absolute bottom-2 right-2 text-xs text-slate-400">
                            Caracteres restantes: <span className="font-bold text-slate-600">{160 - message.length}</span>
                        </div>
                    </div>
                    <div className="mt-3 text-xs text-slate-400 leading-relaxed">
                        Pode consultar <a href="#" className="text-blue-500 hover:underline">aqui</a> a lista de códigos que pode adicionar ao seu lembrete, caso pretenda incluir campos automáticos no texto.
                        <br />
                        Partilhamos também algumas dicas e <a href="#" className="text-blue-500 hover:underline">termos a evitar</a> no sentido de maximizar a taxa de entrega das mensagens.
                    </div>
                </div>

                {/* Example Preview */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Ver um exemplo:</h3>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 h-[178px] flex flex-col justify-center">
                        <div className="flex gap-3">
                            <div className="w-2 h-full bg-slate-200 rounded-full"></div>
                            <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 text-sm text-slate-600 leading-relaxed max-w-[90%]">
                                <p>Clínica Central relembra a sua marcação amanhã às 10:30. Caso não possa comparecer pedimos que avise a recepção ou envie mensagem indicando a sua ausência. Obrigado.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Methods */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Enviar os lembretes através de:</h3>

                <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative mt-1">
                            <input type="checkbox" checked={sendSmart} onChange={(e) => setSendSmart(e.target.checked)} className="peer sr-only" />
                            <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                                <Check size={12} className="text-white opacity-0 peer-checked:opacity-100" />
                            </div>
                        </div>
                        <div>
                            <span className="text-slate-900 font-bold text-sm block group-hover:text-blue-600 transition-colors">Smart (Notificação Móvel ou SMS)</span>
                            <span className="text-slate-500 text-sm block mt-1">Os lembretes Smart são enviados por Notificação Móvel ou SMS (caso o cliente não receba a notificação). Os lembretes enviados por Notificação Móvel são ilimitados.</span>
                        </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative mt-1">
                            <input type="checkbox" checked={sendSMS} onChange={(e) => setSendSMS(e.target.checked)} className="peer sr-only" />
                            <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                                <Check size={12} className="text-white opacity-0 peer-checked:opacity-100" />
                            </div>
                        </div>
                        <div>
                            <span className="text-slate-900 font-bold text-sm block group-hover:text-blue-600 transition-colors">Mensagem SMS</span>
                            <span className="text-slate-500 text-sm block mt-1">Os lembretes são enviados por SMS, a descontar do seu plafond mensal.</span>
                        </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative mt-1">
                            <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} className="peer sr-only" />
                            <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                                <Check size={12} className="text-white opacity-0 peer-checked:opacity-100" />
                            </div>
                        </div>
                        <div>
                            <span className="text-slate-900 font-bold text-sm block group-hover:text-blue-600 transition-colors">Email</span>
                            <span className="text-slate-500 text-sm block mt-1">Os lembretes são enviados por Email e os envios são ilimitados.</span>
                        </div>
                    </label>

                    <div className="pt-4 mt-4 border-t border-slate-100">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative mt-1">
                                <input type="checkbox" checked={resendSMS} onChange={(e) => setResendSMS(e.target.checked)} className="peer sr-only" />
                                <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                                    <Check size={12} className="text-white opacity-0 peer-checked:opacity-100" />
                                </div>
                            </div>
                            <div className="text-sm text-slate-500 leading-relaxed">
                                <span className="text-slate-800 font-bold">Reenviar o lembrete via SMS, após 3 horas, se o cliente não tiver clicado em "SIM VOU" no lembrete que recebeu via notificação.</span>
                                <br />
                                Aplicável caso tenha a opção Smart ativa. Este envio permite que os clientes que não viram notificação móvel recebam sempre um SMS e assim, de forma prudente, evita que aleguem que não receberam o lembrete.
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Timing */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Os lembretes automáticos são enviados com a antecedência de:</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-sm font-bold text-slate-700 min-w-[120px]">Lembrete principal</span>
                            <select
                                value={reminderTiming}
                                onChange={(e) => setReminderTiming(e.target.value)}
                                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none font-medium"
                            >
                                <option value="1">1 dia(s) antes</option>
                                <option value="2">2 dia(s) antes</option>
                                <option value="3">3 dia(s) antes</option>
                            </select>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Os lembretes são enviados todos os dias às 12:30, para os clientes do dia seguinte. Caso crie uma marcação para o dia seguinte após as 12:30, o cliente não receberá lembrete, pois pressupõe-se que esteja informado.
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-sm font-bold text-slate-700 min-w-[120px]">Lembrete na hora</span>
                            <select
                                value={sameDayTiming}
                                onChange={(e) => setSameDayTiming(e.target.value)}
                                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none font-medium"
                            >
                                <option value="none">Nenhum</option>
                                <option value="1h">1 hora antes</option>
                                <option value="2h">2 horas antes</option>
                            </select>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Os lembretes são enviados X horas antes do início da marcação. Estes lembretes têm o custo de 6 cêntimos por envio e não estão incluídos no plafond mensal.
                        </p>
                    </div>
                </div>
            </div>

            {/* Advanced Options */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Opções avançadas (notificação móvel e email):</h3>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Mockup */}
                    <div className="w-full lg:w-1/3 flex justify-center">
                        <div className="bg-slate-100 rounded-[2.5rem] p-4 border-[6px] border-slate-200 w-[280px] shadow-inner relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-200 rounded-b-xl"></div>
                            <div className="bg-white h-[400px] rounded-[2rem] p-4 flex flex-col pt-10 overflow-hidden shadow-sm">
                                <div className="bg-slate-50 rounded-xl p-4 shadow-sm border border-slate-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                                                <Calendar size={14} className="text-slate-500" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-sm">Clínica Central</div>
                                                <div className="text-[10px] text-slate-400">clinicacentral.pt</div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-slate-400">agora</span>
                                    </div>
                                    <p className="text-xs text-slate-600 mb-3">Clínica Central relembra a sua marcação amanhã às 10:30. Caso não possa comparecer...</p>

                                    <div className="flex gap-2">
                                        <button className="flex-1 bg-slate-100 text-slate-600 text-[10px] font-bold py-1.5 rounded border border-slate-200 text-center">SIM, VOU</button>
                                        {confirmationType !== 'simple' && (
                                            <button className="flex-1 bg-slate-100 text-slate-600 text-[10px] font-bold py-1.5 rounded border border-slate-200 text-center">NÃO VOU</button>
                                        )}
                                    </div>
                                    {confirmationType === 'reschedule' && (
                                        <button className="w-full mt-2 bg-slate-100 text-slate-600 text-[10px] font-bold py-1.5 rounded border border-slate-200 text-center">REAGENDAR</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="w-full lg:w-2/3 space-y-6">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative mt-1">
                                <input
                                    type="radio"
                                    name="confirmationType"
                                    checked={confirmationType === 'simple'}
                                    onChange={() => setConfirmationType('simple')}
                                    className="peer sr-only"
                                />
                                <div className="w-5 h-5 border-2 border-slate-300 rounded-full peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100" />
                                </div>
                            </div>
                            <div>
                                <span className="text-slate-900 font-bold text-sm block group-hover:text-blue-600 transition-colors">Reconfirmação (SIM, VOU)</span>
                                <span className="text-slate-500 text-xs block mt-1 leading-relaxed">
                                    Vantagem: após o clique em SIM, VOU, a marcação vai mostrar o icone "cliente recebeu e confirmou presença";<br />
                                    Vantagem: se o cliente faltar, não pode alegar que não viu a mensagem (porque clicou em SIM, VOU);<br />
                                    Desvantagem: não facilita o cancelamento ou reagendamento da marcação.
                                </span>
                            </div>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative mt-1">
                                <input
                                    type="radio"
                                    name="confirmationType"
                                    checked={confirmationType === 'cancel'}
                                    onChange={() => setConfirmationType('cancel')}
                                    className="peer sr-only"
                                />
                                <div className="w-5 h-5 border-2 border-slate-300 rounded-full peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100" />
                                </div>
                            </div>
                            <div>
                                <span className="text-slate-900 font-bold text-sm block group-hover:text-blue-600 transition-colors">Reconfirmação (SIM, VOU) + Opção de faltar/cancelar (NÃO VOU)</span>
                                <span className="text-slate-500 text-xs block mt-1 leading-relaxed">
                                    Disponível em estabelecimentos com a App Advanced ou Premium;<br />
                                    Vantagem: após o clique em SIM, VOU, a marcação vai mostrar o icone "cliente recebeu e confirmou presença";<br />
                                    Vantagem: se o cliente faltar, não pode alegar que não viu a mensagem (porque clicou em SIM, VOU);<br />
                                    Vantagem: facilita o processo de cancelamento da marcação.
                                </span>
                            </div>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative mt-1">
                                <input
                                    type="radio"
                                    name="confirmationType"
                                    checked={confirmationType === 'reschedule'}
                                    onChange={() => setConfirmationType('reschedule')}
                                    className="peer sr-only"
                                />
                                <div className="w-5 h-5 border-2 border-slate-300 rounded-full peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100" />
                                </div>
                            </div>
                            <div>
                                <span className="text-slate-900 font-bold text-sm block group-hover:text-blue-600 transition-colors">Reconfirmação (SIM, VOU) + Opção de faltar/cancelar (NÃO VOU) + Opção de reagendar online (REAGENDAR)</span>
                                <span className="text-slate-500 text-xs block mt-1 leading-relaxed">
                                    Disponível em estabelecimentos com a App Advanced ou Premium;<br />
                                    Vantagem: após o clique em SIM, VOU, a marcação vai mostrar o icone "cliente recebeu e confirmou presença";<br />
                                    Vantagem: se o cliente faltar, não pode alegar que não viu a mensagem (porque clicou em SIM, VOU);<br />
                                    Vantagem: facilita o processo de cancelamento ou reagendamento da marcação;
                                </span>
                            </div>
                        </label>

                        <p className="text-xs text-slate-400 italic mt-4">
                            Nota: estes botões apenas estão disponíveis nos lembretes enviados através de notificação móvel e email. Os lembretes enviados via SMS apenas incluem a mensagem principal (sem botões).
                        </p>
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
