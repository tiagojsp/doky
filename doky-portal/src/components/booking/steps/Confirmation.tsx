
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Service, Staff } from "@/types";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Loader2, Phone, User, CheckCircle } from "lucide-react";

interface ConfirmationProps {
    service: Service;
    staff: Staff | null;
    date: Date;
    time: string;
    onBack: () => void;
    onSuccess: () => void;
}

export function Confirmation({ service, staff, date, time, onBack, onSuccess }: ConfirmationProps) {
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState(""); // Optional
    const [notes, setNotes] = useState(""); // Optional coupon/notes

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleBooking(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Check or Create Client
            // Simple logic: Check by mobile. 
            // In a real app, we'd use OTP auth here.

            let clientId: string | null = null;

            // Check if exists
            const { data: existingClient } = await supabase
                .from("clients")
                .select("id")
                .eq("mobile", mobile)
                .maybeSingle();

            if (existingClient) {
                clientId = existingClient.id;
            } else {
                // Create new
                // Note: ID generation should ideally be handled by DB default (uuid_generate_v4())
                // But our schema uses TEXT IDs. We'll generate a random one for now or rely on a function if available.
                // Using crypto.randomUUID() for now since schema is text.
                const newId = crypto.randomUUID();

                const { error: createError } = await supabase
                    .from("clients")
                    .insert({
                        id: newId,
                        name: name,
                        mobile: mobile,
                        email: email,
                        segment: "Active"
                    });

                if (createError) throw new Error("Erro ao criar perfil de cliente: " + createError.message);
                clientId = newId;
            }

            // 2. Create Appointment
            const appointmentId = crypto.randomUUID();
            const startDateTime = `${format(date, "yyyy-MM-dd")} ${time}`; // Just for reference, schema separates them

            const { error: bookingError } = await supabase
                .from("appointments")
                .insert({
                    id: appointmentId,
                    service_id: service.id,
                    staff_id: staff?.id || null, // Handle 'any' logic later if needed (assign to first available?)
                    client_id: clientId,
                    date: format(date, "yyyy-MM-dd"),
                    start_time: time,
                    duration: service.duration,
                    status: "pending", // Default to pending
                    notes: notes,
                    created_at: new Date().toISOString()
                });

            if (bookingError) throw new Error("Erro ao agendar: " + bookingError.message);

            // Success!
            onSuccess();

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Ocorreu um erro desconhecido.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-xl font-bold text-[var(--color-doky-blue)] font-heading">
                    Confirmar e Agendar
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                    Quase lá! Preencha os seus dados para receber a confirmação.
                </p>
            </div>

            {/* Summary Card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm">
                <div className="flex justify-between mb-2">
                    <span className="text-slate-500">Serviço</span>
                    <span className="font-bold text-slate-800 text-right">{service.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="text-slate-500">Profissional</span>
                    <span className="font-bold text-slate-800">{staff ? staff.name : "Qualquer"}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="text-slate-500">Data</span>
                    <span className="font-bold text-slate-800 capitalize">{format(date, "EEEE, d 'de' MMMM", { locale: pt })}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">Horário</span>
                    <span className="font-bold text-[var(--color-doky-action-cyan)]">{time}</span>
                </div>
            </div>

            <form onSubmit={handleBooking} className="flex flex-col gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                        Nome Completo <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="block w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-bold outline-none focus:border-[var(--color-doky-action-cyan)] focus:ring-4 focus:ring-cyan-500/10 placeholder:font-normal placeholder:text-slate-400"
                            placeholder="Seu nome"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                        Telemóvel <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="tel"
                            required
                            value={mobile}
                            onChange={e => setMobile(e.target.value)}
                            className="block w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-bold outline-none focus:border-[var(--color-doky-action-cyan)] focus:ring-4 focus:ring-cyan-500/10 placeholder:font-normal placeholder:text-slate-400"
                            placeholder="912 345 678"
                        />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 ml-1">
                        Usaremos este número para enviar a confirmação.
                    </p>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                        Notas / Cupão (Opcional)
                    </label>
                    <input
                        type="text"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        className="block w-full px-5 py-3.5 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-bold outline-none focus:border-[var(--color-doky-action-cyan)] focus:ring-4 focus:ring-cyan-500/10 placeholder:font-normal placeholder:text-slate-400"
                        placeholder="Código promocional ou observações"
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-500 text-sm rounded-xl border border-red-100">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full mt-2 disabled:opacity-70"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <>
                            Confirmar Agendamento
                            <CheckCircle className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>

            <button
                onClick={onBack}
                className="mt-auto text-sm text-slate-400 underline hover:text-slate-600 text-center"
            >
                Voltar à seleção de horário
            </button>
        </div>
    );
}
