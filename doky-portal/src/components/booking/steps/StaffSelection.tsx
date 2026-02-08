
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Service, Staff } from "@/types";
import { User } from "lucide-react";

interface StaffSelectionProps {
    service: Service;
    onSelect: (staff: Staff | null) => void;
    onBack: () => void;
}

export function StaffSelection({ service, onSelect, onBack }: StaffSelectionProps) {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStaff() {
            let query = supabase
                .from("staff")
                .select("*")
                .order("name");

            const { data, error } = await query;

            if (error) {
                console.error("Error fetching staff:", error);
            } else {
                // Filter staff based on service.collaborators if it exists and is not empty
                let filtered = (data as any[]) || [];
                if (service.collaborators && Array.isArray(service.collaborators) && service.collaborators.length > 0) {
                    filtered = filtered.filter(s => service.collaborators!.includes(s.id));
                }

                // Filter by Online Booking Permission
                filtered = filtered.filter(s => s.permissions?.onlineBookingEnabled !== false);

                setStaffList(filtered);
            }
            setLoading(false);
        }

        fetchStaff();
    }, [service]);

    if (loading) {
        return (
            <div className="flex flex-col gap-4 animate-pulse">
                {[1, 2].map((i) => (
                    <div key={i} className="h-20 bg-slate-100 rounded-2xl"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-[var(--color-doky-blue)] mb-2 font-heading">
                Escolha o Profissional
            </h2>

            {/* Option: Any Professional */}
            <button
                onClick={() => onSelect(null)}
                className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-[var(--color-doky-action-cyan)] transition-all"
            >
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-cyan-50 group-hover:text-[var(--color-doky-action-cyan)] transition-colors">
                    <User size={24} />
                </div>
                <div className="text-left">
                    <div className="font-bold text-slate-800">Qualquer profissional</div>
                    <div className="text-xs text-slate-500">Mencione a sua preferência na próxima etapa</div>
                </div>
            </button>

            {staffList.map((staff) => (
                <button
                    key={staff.id}
                    onClick={() => onSelect(staff)}
                    className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-[var(--color-doky-action-cyan)] transition-all"
                >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-slate-600 font-bold overflow-hidden ${staff.color || 'bg-slate-200'}`}>
                        {staff.imageUrl ? (
                            <img src={staff.imageUrl} alt={staff.name} className="w-full h-full object-cover" />
                        ) : (
                            <span>{staff.name.charAt(0)}</span>
                        )}
                    </div>
                    <div className="text-left">
                        <div className="font-bold text-slate-800">{staff.name}</div>
                        <div className="text-xs text-slate-500">{staff.role || 'Colaborador'}</div>
                    </div>
                </button>
            ))}

            <button
                onClick={onBack}
                className="mt-4 text-sm text-slate-400 underline hover:text-slate-600"
            >
                Voltar à seleção de serviços
            </button>
        </div>
    );
}
