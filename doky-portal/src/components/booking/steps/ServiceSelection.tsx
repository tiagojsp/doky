
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Service } from "@/types";
import { Clock, Tag } from "lucide-react";

interface ServiceSelectionProps {
    onSelect: (service: Service) => void;
}

export function ServiceSelection({ onSelect }: ServiceSelectionProps) {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchServices() {
            const { data, error } = await supabase
                .from("services")
                .select("*")
                .eq("is_online", true) // Only show online services
                .order("name");

            if (error) {
                console.error("Error fetching services:", error);
            } else {
                setServices((data as any[]) || []); // TODO: Fix type assertion if needed
            }
            setLoading(false);
        }

        fetchServices();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col gap-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-slate-100 rounded-2xl"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-[var(--color-doky-blue)] mb-2 font-heading">
                Selecione o Serviço
            </h2>

            {services.map((service) => (
                <button
                    key={service.id}
                    onClick={() => onSelect(service)}
                    className="group relative flex flex-col text-left p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-[var(--color-doky-action-cyan)] transition-all duration-200 active:scale-[0.98]"
                >
                    <div className="flex justify-between items-start w-full">
                        <span className="font-bold text-slate-800 text-lg group-hover:text-[var(--color-doky-blue)] transition-colors">
                            {service.name}
                        </span>
                        <span className="font-bold text-[var(--color-doky-action-cyan)] bg-cyan-50 px-3 py-1 rounded-full text-sm">
                            {Number(service.price).toFixed(2)}€
                        </span>
                    </div>

                    <div className="flex gap-4 mt-3 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-[var(--color-doky-success)]" />
                            <span>{service.duration} min</span>
                        </div>
                        {service.category && (
                            <div className="flex items-center gap-1.5">
                                <Tag size={14} className="text-slate-400" />
                                <span>{service.category}</span>
                            </div>
                        )}
                    </div>
                </button>
            ))}

            {services.length === 0 && (
                <div className="text-center p-8 text-slate-500 bg-slate-50 rounded-2xl">
                    Nenhum serviço disponível para agendamento online.
                </div>
            )}
        </div>
    );
}
