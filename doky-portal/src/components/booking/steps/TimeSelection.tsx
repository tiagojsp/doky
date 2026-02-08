
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Service, Staff, Appointment } from "@/types";
import { format, addDays, startOfToday, isSameDay, parse, addMinutes, isBefore, isAfter } from "date-fns";
import { pt } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

interface TimeSelectionProps {
    service: Service;
    staff: Staff | null;
    onSelect: (date: Date, time: string) => void;
    onBack: () => void;
}

export function TimeSelection({ service, staff, onSelect, onBack }: TimeSelectionProps) {
    const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // Calendar strip (Next 7 days)
    const days = Array.from({ length: 7 }, (_, i) => addDays(startOfToday(), i));

    useEffect(() => {
        async function fetchAvailability() {
            setLoading(true);
            const dateStr = format(selectedDate, "yyyy-MM-dd");

            // Robust way to get 'mon', 'tue', etc. regardless of locale
            const weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
            const dayOfWeek = weekDays[selectedDate.getDay()];

            console.log('DEBUG: Checking availability for:', dateStr, dayOfWeek);
            console.log('DEBUG: Staff:', staff?.name, staff?.schedule);

            // 1. Determine Working Hours
            let openTime = "09:00";
            let closeTime = "19:00";
            let breakStart: string | undefined;
            let breakEnd: string | undefined;

            if (staff && staff.schedule) {
                const daySchedule = staff.schedule[dayOfWeek];

                console.log('DEBUG: Schedule Key:', dayOfWeek, 'Found:', daySchedule);

                if (!daySchedule || !daySchedule.enabled) {
                    console.log('DEBUG: Day schedule disabled or not found');
                    setAvailableSlots([]); // Staff not working today
                    setLoading(false);
                    return;
                }
                openTime = daySchedule.start;
                closeTime = daySchedule.end;
                breakStart = daySchedule.breakStart;
                breakEnd = daySchedule.breakEnd;
            }

            // 2. Fetch existing appointments for the date
            let query = supabase
                .from("appointments")
                .select("start_time, duration, status")
                .eq("date", dateStr)
                .neq("status", "cancelled");

            if (staff) {
                query = query.eq("staff_id", staff.id);
            }

            const { data: appointments, error } = await query;

            if (error) {
                console.error("Error fetching appointments:", error);
                setLoading(false);
                return;
            }

            // 3. Generate Slots
            const interval = 30; // minutes
            const slots: string[] = [];

            const safeParse = (timeStr: string, refDate: Date): Date | null => {
                try {
                    const result = parse(timeStr, "HH:mm", refDate);
                    return isNaN(result.getTime()) ? null : result;
                } catch {
                    console.warn('Invalid time format:', timeStr);
                    return null;
                }
            };

            const parsedOpen = safeParse(openTime, selectedDate);
            const parsedClose = safeParse(closeTime, selectedDate);
            if (!parsedOpen || !parsedClose) {
                console.error('Invalid open/close times:', openTime, closeTime);
                setAvailableSlots([]);
                setLoading(false);
                return;
            }
            let currentTime = parsedOpen;
            const endTime = parsedClose;

            // Parse break times if they exist
            let breakStartTime: Date | null = null;
            let breakEndTime: Date | null = null;
            if (breakStart && breakEnd) {
                breakStartTime = safeParse(breakStart, selectedDate);
                breakEndTime = safeParse(breakEnd, selectedDate);
            }

            while (isBefore(currentTime, endTime)) {
                const slotStartStr = format(currentTime, "HH:mm");
                const slotEnd = addMinutes(currentTime, service.duration);

                // A. Check Closing Time
                if (isAfter(slotEnd, endTime)) break;

                // B. Check Break Collision
                let isBreak = false;
                if (breakStartTime && breakEndTime) {
                    // Overlap logic: SlotStart < BreakEnd AND SlotEnd > BreakStart
                    if (isBefore(currentTime, breakEndTime) && isAfter(slotEnd, breakStartTime)) {
                        isBreak = true;
                    }
                }

                // C. Check Appointment/Block Collision
                const hasApptCollision = appointments?.some((app) => {
                    const appStart = safeParse(app.start_time, selectedDate);
                    if (!appStart) return false;
                    const appEnd = addMinutes(appStart, app.duration || 30);
                    return isBefore(currentTime, appEnd) && isAfter(slotEnd, appStart);
                });

                if (!isBreak && !hasApptCollision) {
                    slots.push(slotStartStr);
                }

                currentTime = addMinutes(currentTime, interval);
            }

            setAvailableSlots(slots);
            setLoading(false);
        }

        fetchAvailability();
    }, [selectedDate, service, staff]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center px-1">
                <h2 className="text-xl font-bold text-[var(--color-doky-blue)] font-heading">
                    Escolha o Horário
                </h2>
                <span className="text-xs font-bold bg-cyan-100 text-[var(--color-doky-blue)] px-2 py-1 rounded">
                    {format(selectedDate, "MMMM yyyy", { locale: pt })}
                </span>
            </div>

            {/* Date Strip */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                {days.map((day) => {
                    const isSelected = isSameDay(day, selectedDate);
                    return (
                        <button
                            key={day.toString()}
                            onClick={() => setSelectedDate(day)}
                            className={`flex flex-col items-center justify-center min-w-[4.5rem] h-20 rounded-2xl border transition-all duration-200 ${isSelected
                                ? "bg-[var(--color-doky-blue)] border-[var(--color-doky-blue)] text-white shadow-lg shadow-blue-900/20 transform scale-105"
                                : "bg-white border-slate-100 text-slate-400 hover:border-[var(--color-doky-action-cyan)]"
                                }`}
                        >
                            <span className="text-xs font-medium uppercase">{format(day, "EEE", { locale: pt })}</span>
                            <span className={`text-xl font-bold ${isSelected ? "text-white" : "text-slate-800"}`}>
                                {format(day, "d")}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Slots Grid */}
            <div className="grid grid-cols-3 gap-3">
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-12 bg-slate-50 rounded-xl animate-pulse" />)
                ) : (
                    availableSlots.map((time) => (
                        <button
                            key={time}
                            onClick={() => onSelect(selectedDate, time)}
                            className="py-3 px-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-[var(--color-doky-action-cyan)] hover:text-white hover:border-transparent transition-colors shadow-sm active:scale-95"
                        >
                            {time}
                        </button>
                    ))
                )}
            </div>

            {!loading && availableSlots.length === 0 && (
                <div className="text-center p-8 text-slate-400 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Sem horários disponíveis neste dia.</p>
                </div>
            )}

            <button
                onClick={onBack}
                className="mt-auto text-sm text-slate-400 underline hover:text-slate-600 text-center"
            >
                Voltar à seleção de profissional
            </button>
        </div>
    );
}
