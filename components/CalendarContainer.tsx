import React, { useState, useMemo } from 'react';
import { Appointment, Staff, Service, Client } from '../types';
import { TimesheetView, MonthView } from './CalendarViews';
import { CalendarFilters } from './CalendarFilters';
import {
    addMonths, subMonths, addWeeks, subWeeks, addDays, subDays,
    format, isSameDay, startOfWeek, endOfWeek
} from 'date-fns';
import { pt } from 'date-fns/locale';
import {
    ChevronLeft, ChevronRight, Filter, Plus, Wallet,
    Calendar as CalendarIcon, AlignJustify
} from 'lucide-react';

interface Props {
    appointments: Appointment[];
    staff: Staff[];
    clients: Client[];
    services: Service[];
    onAddAppointment: (date: Date, time: string) => void;
    onSelectAppointment: (appt: Appointment) => void;
    onDeleteAppointment: (id: string) => void; // Passed down for context menus if needed, or handled by parent via selection
    targetDate?: Date;
}

export type ViewMode = 'month' | 'week' | '3day' | 'day' | 'list';

export const CalendarContainer: React.FC<Props> = ({
    appointments,
    staff,
    clients,
    services,
    onAddAppointment,
    onSelectAppointment,
    targetDate
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<ViewMode>('week');
    const [showFilters, setShowFilters] = useState(false);

    // React to external date changes (Deep Linking)
    React.useEffect(() => {
        if (targetDate) {
            setCurrentDate(targetDate);
        }
    }, [targetDate]);

    // Filters State
    const [filteredStaff, setFilteredStaff] = useState<string[]>(staff.map(s => s.id));
    const [filteredServices, setFilteredServices] = useState<string[]>(services.map(s => s.id));

    // ----------------------------------------------------------------------
    // FILTERS
    // ----------------------------------------------------------------------
    const visibleAppointments = useMemo(() => {
        return appointments.filter(app => {
            const staffMatch = filteredStaff.includes(app.staffId);
            // Service match handling: some apps might have null services (blocks), so be careful
            const serviceMatch = app.serviceId === 'system_block' || filteredServices.includes(app.serviceId);
            return staffMatch && serviceMatch;
        });
    }, [appointments, filteredStaff, filteredServices]);

    const toggleStaff = (id: string, all?: boolean) => {
        if (all) {
            setFilteredStaff(filteredStaff.length === staff.length ? [] : staff.map(s => s.id));
        } else {
            setFilteredStaff(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
        }
    };

    const toggleService = (id: string, all?: boolean) => {
        if (all) {
            setFilteredServices(filteredServices.length === services.length ? [] : services.map(s => s.id));
        } else {
            setFilteredServices(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
        }
    };

    // ----------------------------------------------------------------------
    // NAVIGATION
    // ----------------------------------------------------------------------
    const handlePrev = () => {
        switch (viewMode) {
            case 'month': setCurrentDate(subMonths(currentDate, 1)); break;
            case 'week': setCurrentDate(subWeeks(currentDate, 1)); break;
            case '3day': setCurrentDate(subDays(currentDate, 3)); break;
            case 'day': setCurrentDate(subDays(currentDate, 1)); break;
            default: setCurrentDate(subDays(currentDate, 1));
        }
    };

    const handleNext = () => {
        switch (viewMode) {
            case 'month': setCurrentDate(addMonths(currentDate, 1)); break;
            case 'week': setCurrentDate(addWeeks(currentDate, 1)); break;
            case '3day': setCurrentDate(addDays(currentDate, 3)); break;
            case 'day': setCurrentDate(addDays(currentDate, 1)); break;
            default: setCurrentDate(addDays(currentDate, 1));
        }
    };

    const handleToday = () => setCurrentDate(new Date());

    // ----------------------------------------------------------------------
    // REVENUE CALC
    // ----------------------------------------------------------------------
    const visibleRevenue = useMemo(() => {
        // Calculate revenue based on View Range
        // Simplified: just sum up displayed appointments
        // Ideally we should filter appointments by date range first, but visibleAppointments contains ALL filtered by type
        // So we need to filter visibleAppointments by DATE

        let start, end;
        if (viewMode === 'month') {
            start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        } else if (viewMode === 'week') {
            start = startOfWeek(currentDate, { weekStartsOn: 1 });
            end = endOfWeek(currentDate, { weekStartsOn: 1 });
        } else if (viewMode === '3day') {
            start = currentDate;
            end = addDays(currentDate, 2);
        } else {
            start = currentDate;
            end = currentDate;
        }

        // We need to compare strings 'yyyy-MM-dd' because appointments use strings
        // Or construct dates.
        // Easiest is to convert appointment dates to objects or use string comparison if ISO.
        // Appointment.date is "2026-01-12"

        const inRangeAppts = visibleAppointments.filter(a => {
            const d = new Date(a.date);
            // Simple compare: set hours to 0
            d.setHours(0, 0, 0, 0);
            const s = new Date(start); s.setHours(0, 0, 0, 0);
            const e = new Date(end); e.setHours(23, 59, 59, 999);
            return d >= s && d <= e;
        });

        return inRangeAppts.reduce((acc, app) => {
            if (app.status === 'blocked') return acc;
            const service = services.find(s => s.id === app.serviceId);
            return acc + (service ? service.price : 0);
        }, 0);

    }, [visibleAppointments, currentDate, viewMode, services]);


    return (
        <div className="flex flex-col h-full relative">
            {/* Header Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between px-4 md:px-6 py-4 border-b border-slate-100 bg-white md:rounded-t-3xl sticky top-0 z-20 gap-3">
                <div className="flex items-center justify-between md:justify-start gap-4 w-full md:w-auto">
                    <h2 className="text-lg md:text-xl font-bold text-slate-800 whitespace-nowrap capitalize">
                        {format(currentDate, 'MMMM yyyy', { locale: pt })}
                    </h2>
                    <div className="flex items-center bg-white/50 rounded-full p-1 shadow-inner">
                        <button onClick={handlePrev} className="p-1.5 hover:bg-white rounded-full transition-all text-slate-500 hover:text-cyan-600"><ChevronLeft size={18} /></button>
                        <button onClick={handleNext} className="p-1.5 hover:bg-white rounded-full transition-all text-slate-500 hover:text-cyan-600"><ChevronRight size={18} /></button>
                    </div>
                    <button onClick={handleToday} className="px-3 py-1.5 text-[10px] md:text-xs font-bold text-cyan-700 bg-cyan-100/50 hover:bg-cyan-100 rounded-xl transition-colors">
                        HOJE
                    </button>
                </div>

                {/* View Switcher & Actions */}
                <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                    {/* Mobile Revenue (Icon only) usually, but keeping full for now or hidden */}
                    <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100 mr-2">
                        <Wallet size={16} className="text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Faturação:</span>
                        <span className="text-sm font-black text-emerald-700">{visibleRevenue}€</span>
                    </div>

                    <div className="flex bg-slate-100/50 p-1 rounded-xl">
                        {[
                            { id: 'month', label: 'Mês' },
                            { id: 'week', label: 'Semana' },
                            { id: '3day', label: '3 Dias' },
                            { id: 'day', label: 'Dia' }
                        ].map(v => (
                            <button
                                key={v.id}
                                onClick={() => setViewMode(v.id as ViewMode)}
                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all
                        ${viewMode === v.id ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-500 hover:text-slate-700'}
                    `}
                            >
                                {v.label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs md:text-sm whitespace-nowrap transition-colors
                ${showFilters ? 'bg-cyan-50 border-cyan-200 text-cyan-700' : 'bg-white/50 border-white/50 text-slate-600 hover:bg-white'}
             `}
                    >
                        <Filter size={14} />
                        <span className="hidden md:inline">Filtros</span>
                    </button>

                    <button
                        onClick={() => onAddAppointment(currentDate, '09:00')}
                        className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs md:text-sm font-medium shadow-lg hover:bg-slate-700 transition-colors flex items-center gap-2 whitespace-nowrap ml-auto md:ml-0"
                    >
                        <Plus size={16} /> <span className="hidden md:inline">Novo</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden relative flex">
                {/* Main Calendar View */}
                <div className="flex-1 h-full overflow-hidden">
                    {viewMode === 'month' ? (
                        <MonthView
                            currentDate={currentDate}
                            appointments={visibleAppointments}
                            staff={staff}
                            clients={clients}
                            services={services}
                            onAddAppointment={onAddAppointment}
                            onSelectAppointment={onSelectAppointment}
                        />
                    ) : (
                        <TimesheetView
                            daysToShow={viewMode === 'day' ? 1 : viewMode === '3day' ? 3 : 7}
                            currentDate={currentDate}
                            appointments={visibleAppointments}
                            staff={staff}
                            clients={clients}
                            services={services}
                            onAddAppointment={onAddAppointment}
                            onSelectAppointment={onSelectAppointment}
                        />
                    )}
                </div>

                {/* Filters Sidebar Overlay */}
                {showFilters && (
                    <div className="absolute right-0 top-0 bottom-0 z-30 p-2 md:p-4 animate-slide-in-right">
                        <CalendarFilters
                            staff={staff}
                            services={services}
                            selectedStaff={filteredStaff}
                            selectedServices={filteredServices}
                            onToggleStaff={toggleStaff}
                            onToggleService={toggleService}
                            onClose={() => setShowFilters(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
