import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { EstablishmentSettings } from '../../types';

interface Props {
    onSelect: (date: string, time: string) => void;
    settings?: EstablishmentSettings | null;
}

export const WizardStepDateTime: React.FC<Props> = ({ onSelect }) => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Generate calendar days for current month
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay(); // 0 = Sunday

    const days = [];
    // Add empty slots for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
    }
    // Add days
    for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
        days.push({
            date: d.toISOString().split('T')[0],
            day: i,
            weekday: d.getDay(),
            isPast: d < new Date(new Date().setHours(0, 0, 0, 0)), // Start of today
            isToday: d.toDateString() === new Date().toDateString()
        });
    }

    const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

    const handleMonthChange = (delta: number) => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(newDate.getMonth() + delta);
        setCurrentMonth(newDate);
    };

    return (
        <div className="w-full max-w-6xl mx-auto h-full flex flex-col lg:flex-row gap-8 lg:gap-12 pb-24">
            {/* Calendar Section */}
            <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-white/50 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-700 text-lg">Selecione o Dia</h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleMonthChange(-1)}
                            className="p-2 rounded-full hover:bg-white hover:shadow-md transition-all text-slate-500"
                            disabled={currentMonth.getFullYear() <= new Date().getFullYear() && currentMonth.getMonth() <= new Date().getMonth()}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="font-bold text-slate-800 min-w-[140px] text-center capitalize">
                            {currentMonth.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
                        </span>
                        <button
                            onClick={() => handleMonthChange(1)}
                            className="p-2 rounded-full hover:bg-white hover:shadow-md transition-all text-slate-500"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center mb-2">
                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                        <div key={i} className="text-xs font-bold text-slate-400 py-2">{d}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {days.map((d, i) => {
                        if (!d) return <div key={`empty-${i}`} className="aspect-square"></div>;

                        const isSelected = selectedDate === d.date;
                        const isDisabled = d.isPast || d.weekday === 0; // Disable Sundays and past

                        return (
                            <button
                                key={d.date}
                                disabled={isDisabled}
                                onClick={() => setSelectedDate(d.date)}
                                className={`
                            aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all duration-200
                            ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-teal-50 hover:scale-105 cursor-pointer'}
                            ${isSelected ? 'bg-[var(--color-primary)] text-white shadow-lg scale-110 z-10' : 'bg-white/50 text-slate-700'}
                            ${d.isToday && !isSelected ? 'border-2 border-[var(--color-primary)]' : ''}
                        `}
                            >
                                <span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-slate-700'}`}>{d.day}</span>
                                {/* Dot for availability */}
                                {!isDisabled && !isSelected && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] opacity-60 mt-1"></span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Time Slots Section */}
            <div className="flex-1 lg:max-w-md flex flex-col">
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-white/50 shadow-sm h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <Clock className="text-[var(--color-primary)]" />
                        <h3 className="font-bold text-slate-700 text-lg">Horário Disponível</h3>
                    </div>

                    {!selectedDate ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl">
                            <Calendar size={48} className="mb-4 opacity-50" />
                            <p className="font-medium">Selecione um dia no calendário para ver os horários.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar p-2">
                            {times.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => onSelect(selectedDate, time)}
                                    className="
                group py-3 px-4 rounded-xl bg-white/70 backdrop-blur-md border border-white/50 
                shadow-sm hover:shadow-md transition-all duration-200 
                hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white
                flex items-center justify-center
                active:scale-95
              "
                                >
                                    <span className="text-lg font-bold text-slate-700 group-hover:text-white transition-colors">
                                        {time}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper for icon
const Calendar = ({ size, className }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
)
