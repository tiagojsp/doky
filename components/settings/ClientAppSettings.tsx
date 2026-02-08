import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { EstablishmentSettings } from '../../types';
import { Smartphone, ExternalLink, Copy, Check, Share2, Globe, HelpCircle } from 'lucide-react';

export const ClientAppSettings: React.FC = () => {
    const [settings, setSettings] = useState<EstablishmentSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [url, setUrl] = useState('');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        try {
            const data = await api.fetchEstablishmentSettings();
            setSettings(data);
            if (data.contacts.clientAppUrl) {
                setUrl(data.contacts.clientAppUrl);
            }
        } catch (error) {
            console.error("Failed to load settings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (newUrl: string) => {
        if (!settings) return;

        try {
            const newSettings = {
                ...settings,
                contacts: {
                    ...settings.contacts,
                    clientAppUrl: newUrl
                }
            };
            setSettings(newSettings);
            await api.updateEstablishmentSettings(newSettings);
        } catch (error) {
            console.error("Failed to save settings", error);
        }
    };

    const copyToClipboard = () => {
        if (url) {
            navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-doky-action-cyan"></div>
        </div>
    );

    return (
        <div className="max-w-screen-md mx-auto py-8 px-4 space-y-8 animate-fade-in">
            <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">App Cliente</h2>
                <p className="text-slate-500 text-sm mt-1">Configure o link para o seu sistema de agendamento online.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 flex flex-col items-center text-center space-y-6">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/30 transition-all"></div>
                        <div className="relative p-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg transform rotate-3 transition-transform group-hover:rotate-0">
                            <Smartphone size={40} className="text-white" />
                        </div>
                    </div>

                    <div className="max-w-md">
                        <h3 className="text-lg font-bold text-slate-900">O seu link de agendamento</h3>
                        <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                            Este é o link direto para a sua App Cliente. Partilhe-o nas redes sociais e site para receber marcações.
                        </p>
                    </div>

                    <div className="w-full max-w-lg bg-slate-50 p-1.5 pl-4 rounded-xl border border-slate-200 flex items-center shadow-inner focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                        <Globe size={18} className="text-slate-400 shrink-0" />
                        <input
                            type="text"
                            className="flex-1 bg-transparent border-none text-sm text-slate-700 focus:ring-0 px-3 truncate placeholder:text-slate-400"
                            placeholder="https://doky.io/sua-clinica"
                            value={url}
                            onChange={(e) => {
                                setUrl(e.target.value);
                                handleSave(e.target.value);
                            }}
                        />
                        {url && (
                            <button
                                onClick={copyToClipboard}
                                className="p-2 hover:bg-white rounded-lg transition-all text-slate-500 hover:text-blue-600 hover:shadow-sm"
                                title="Copiar Link"
                            >
                                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            </button>
                        )}
                    </div>

                    {url && (
                        <div className="flex flex-wrap gap-3 w-full justify-center pt-2">
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm font-medium"
                            >
                                <ExternalLink size={16} />
                                Abrir App
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6 flex gap-5 items-start">
                <div className="p-2.5 bg-white rounded-xl shadow-sm text-blue-600 shrink-0">
                    <Share2 size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-blue-900 text-sm flex items-center gap-2">
                        Potencialize as suas marcações
                        <HelpCircle size={14} className="text-blue-400" />
                    </h4>
                    <p className="text-blue-800/80 text-sm mt-1.5 leading-relaxed">
                        Pode adicionar este link ao botão "Marcar Agora" do Instagram, Facebook ou Google My Business. Clientes que agendam online têm <strong>40% menos probabilidade</strong> de faltar.
                    </p>
                </div>
            </div>
        </div>
    );
};
