import React from 'react';
import { Appointment, Staff, Service, Client } from '../types';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addDays,
  startOfDay,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  getDay
} from 'date-fns';
import { pt } from 'date-fns/locale';
import { Clock, Plus, Lock, Utensils, FileText, AlignLeft, Trash2, User, RefreshCw, Copy, Check, Circle, DollarSign, MapPin, UserX } from 'lucide-react';

interface ViewProps {
  currentDate: Date;
  appointments: Appointment[];
  staff: Staff[];
  clients: Client[];
  services: Service[];
  onAddAppointment: (date: Date, time: string) => void;
  onSelectAppointment: (appt: Appointment) => void;
  onBlockDay?: (date: Date) => void;
}

// ----------------------------------------------------------------------
// HELPER COMPONENTS
// ----------------------------------------------------------------------

const AppointmentCard: React.FC<{
  app: Appointment;
  clientName: string;
  serviceName: string;
  staffName: string;
  onClick: () => void;
  style?: React.CSSProperties;
}> = ({ app, clientName, serviceName, staffName, onClick, style }) => {
  const isBlocked = app.status === 'blocked';
  const isNoShow = app.status === 'no_show';
  const isCancelled = app.status === 'cancelled';

  // Opacity for past/cancelled/no-show
  const opacityClass = isNoShow || isCancelled ? 'opacity-60 grayscale' : 'opacity-100';

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      title={`${clientName} - ${app.notes || ''} (${app.status})`}
      className={`absolute left-0.5 right-0.5 md:left-1 md:right-1 p-2 md:p-3 rounded-2xl shadow-sm border border-white/10 text-xs cursor-pointer hover:scale-[1.02] transition-all hover:shadow-lg hover:z-20 group overflow-hidden flex flex-col justify-between
        ${isBlocked
          ? 'bg-slate-100/90 border-slate-300 text-slate-500'
          : `${app.color} bg-opacity-95 text-white shadow-blue-500/20`
        } backdrop-blur-sm ${opacityClass}`}
      style={{
        ...style,
        backgroundImage: isBlocked ? 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)' : 'none'
      }}
    >
      {isBlocked ? (
        <div className="flex flex-col items-center justify-center h-full gap-1 opacity-70">
          {app.blockReason === 'Almoço' ? <Utensils size={16} /> : <Lock size={16} />}
          <span className="font-bold text-xs uppercase tracking-wider text-center">{app.blockReason || 'BLOQUEADO'}</span>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start opacity-90 relative">
            <div className="flex items-center gap-1.5 font-semibold text-xs tracking-tight">
              <Clock size={12} className="opacity-80" />
              <span>{app.startTime}</span>
            </div>

            {/* Status Icons Row */}
            <div className="flex items-center gap-1">
              {/* PAID INDICATOR */}
              {app.paymentStatus === 'paid' && (
                <div className="bg-emerald-500/20 p-0.5 rounded border border-emerald-200/50" title="Pago">
                  <DollarSign size={10} strokeWidth={3} className="text-emerald-100" />
                </div>
              )}

              {/* ARRIVED INDICATOR (Luzes/Icon) */}
              {app.status === 'arrived' && (
                <div className="animate-pulse bg-indigo-500 p-0.5 rounded-full ring-2 ring-indigo-300 ring-offset-1 ring-offset-transparent" title="Cliente Chegou">
                  <MapPin size={10} className="text-white" />
                </div>
              )}

              {/* NO SHOW INDICATOR */}
              {app.status === 'no_show' && (
                <div className="bg-red-500/20 p-0.5 rounded border border-red-200/50" title="Faltou">
                  <UserX size={10} strokeWidth={3} className="text-red-100" />
                </div>
              )}

              {/* CANCELLED INDICATOR */}
              {isCancelled && (
                <div className="bg-slate-500/20 p-0.5 rounded border border-slate-200/50" title="Cancelada">
                  <UserX size={10} strokeWidth={3} className="text-slate-100" />
                </div>
              )}

              {/* STANDARD STATUS */}
              {app.status === 'confirmed' && <Check size={14} strokeWidth={3} className="text-white" />}
              {app.status === 'pending' && <Circle size={10} strokeWidth={3} className="text-white/60" />}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-0.5 py-1">
            <div className={`font-bold text-sm md:text-base leading-tight line-clamp-2 drop-shadow-sm ${isNoShow || isCancelled ? 'line-through decoration-white/50' : ''}`}>
              {(() => {
                const parts = clientName.trim().split(/\s+/);
                if (parts.length > 2) {
                  return `${parts[0]} ${parts[parts.length - 1]}`;
                }
                return clientName;
              })()}
            </div>
            <div className="text-white/80 text-[10px] md:text-xs font-medium line-clamp-1 truncate flex items-center gap-1">
              <span className="opacity-70">•</span> {serviceName}
            </div>
          </div>

          <div className="flex items-center justify-between mt-1 pt-2 border-t border-white/20">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-bold backdrop-blur-sm">
                {staffName.charAt(0)}
              </div>
              <span className="text-[10px] md:text-xs font-medium opacity-90 truncate max-w-[80px]">
                {staffName.split(' ')[0]}
              </span>
            </div>

            {app.notes && (
              <div className="opacity-80 hover:opacity-100 transition-opacity" title={app.notes}>
                <FileText size={14} className="fill-white/20" />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// TIMESHEET VIEW (Week, 3-Day, Day)
// ----------------------------------------------------------------------

interface TimesheetProps extends ViewProps {
  daysToShow: 1 | 3 | 7;
}

export const TimesheetView: React.FC<TimesheetProps> = ({
  currentDate,
  appointments,
  staff,
  clients,
  services,
  onAddAppointment,
  onSelectAppointment,
  onBlockDay,
  daysToShow
}) => {

  // Calculate days to render
  const days = React.useMemo(() => {
    if (daysToShow === 1) return [currentDate];
    if (daysToShow === 3) {
      return [currentDate, addDays(currentDate, 1), addDays(currentDate, 2)];
    }
    // Week view normally starts on Monday
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentDate, daysToShow]);

  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 to 20:00

  const getAppointmentsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointments.filter(a => a.date === dateStr);
  };

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Unknown';
  const getServiceName = (id: string) => services.find(s => s.id === id)?.name || 'Service';
  const getStaffName = (id: string) => staff.find(s => s.id === id)?.name || 'Staff';

  return (
    <div className="flex-1 overflow-auto flex relative h-full">
      {/* Time Labels */}
      <div className="w-14 md:w-20 flex-shrink-0 bg-white/40 backdrop-blur-sm border-r border-white/40 pt-14 sticky left-0 z-10">
        {timeSlots.map(hour => (
          <div key={hour} className="h-32 text-[10px] md:text-xs font-semibold text-slate-400 text-right pr-2 md:pr-4 -mt-2.5">
            {hour}:00
          </div>
        ))}
      </div>

      {/* Days Columns */}
      <div className="flex-1 flex min-w-0">
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isToday = isSameDay(day, new Date());

          return (
            <div key={dateStr} className={`flex-1 ${daysToShow > 3 ? 'min-w-[100px]' : 'min-w-[150px]'} border-r border-white/30 relative group bg-white/10`}>
              {/* Sticky Date Header */}
              <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-white/40 py-2 md:py-4 px-2 text-center z-10 shadow-sm group/header">
                <div className="flex justify-center items-center relative">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {format(day, 'EEE', { locale: pt })}
                  </span>
                  {onBlockDay && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onBlockDay(day); }}
                      className="absolute right-0 top-0 p-1 text-slate-300 hover:text-red-400 opacity-0 group-hover/header:opacity-100 transition-opacity"
                      title="Bloquear Dia Inteiro"
                    >
                      <Lock size={14} />
                    </button>
                  )}
                </div>
                <span className={`block text-lg md:text-xl font-bold mt-1 w-8 h-8 md:w-10 md:h-10 mx-auto rounded-full flex items-center justify-center ${isToday ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/40' : 'text-slate-700'}`}>
                  {format(day, 'd')}
                </span>
              </div>

              {/* Grid Cells */}
              <div className="relative h-[calc(13*8rem)]">
                {timeSlots.map(hour => {
                  const timeString = `${hour < 10 ? '0' + hour : hour}:00`;
                  return (
                    <div
                      key={`${dateStr}-${hour}`}
                      onClick={() => onAddAppointment(day, timeString)}
                      className="h-32 border-b border-dashed border-slate-200/50 hover:bg-cyan-50/30 transition-colors cursor-pointer relative group/cell"
                    >
                      <div className="hidden group-hover/cell:flex absolute inset-0 items-center justify-center opacity-50">
                        <Plus className="text-cyan-400" />
                      </div>
                    </div>
                  );
                })}

                {/* Appointments Overlay */}
                {getAppointmentsForDay(day).map(app => {
                  const startHour = parseInt(app.startTime.split(':')[0]);
                  const startMin = parseInt(app.startTime.split(':')[1] || '0');
                  const topOffset = ((startHour - 8) * 128) + (startMin * (128 / 60));

                  const duration = app.duration || 60;
                  const heightPx = (duration / 60) * 128;

                  return (
                    <AppointmentCard
                      key={app.id}
                      app={app}
                      clientName={getClientName(app.clientId)}
                      serviceName={getServiceName(app.serviceId)}
                      staffName={getStaffName(app.staffId)}
                      onClick={() => onSelectAppointment(app)}
                      style={{
                        top: `${topOffset}px`,
                        height: `${heightPx > 20 ? heightPx - 8 : heightPx}px`
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// MONTH VIEW
// ----------------------------------------------------------------------

export const MonthView: React.FC<ViewProps> = ({
  currentDate,
  appointments,
  onSelectAppointment,
  onAddAppointment
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-white/50 backdrop-blur-sm">
        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(d => (
          <div key={d} className="py-2 text-center text-xs font-bold text-slate-500 uppercase">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6 auto-rows-fr">
        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayAppts = appointments.filter(a => a.date === dateStr);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={dateStr}
              onClick={() => onAddAppointment(day, '09:00')} // Default time for month view click
              className={`border-r border-b border-slate-100 p-1 md:p-2 relative hover:bg-slate-50 transition-colors cursor-pointer flex flex-col gap-1 overflow-hidden group
                        ${!isCurrentMonth ? 'bg-slate-50/50' : ''}
                    `}
            >
              <div className="flex justify-between items-start">
                <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full
                            ${isToday ? 'bg-cyan-500 text-white' : (isCurrentMonth ? 'text-slate-700' : 'text-slate-400')}
                        `}>
                  {format(day, 'd')}
                </span>

                {/* Dot indicators for mobile or visual summary */}
                <div className="flex -space-x-1">
                  {dayAppts.length > 0 && dayAppts.slice(0, 3).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-400 border border-white"></div>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto mt-1 space-y-1">
                {dayAppts.map(app => (
                  <div
                    key={app.id}
                    onClick={(e) => { e.stopPropagation(); onSelectAppointment(app); }}
                    className={`text-[10px] p-1 rounded truncate border-l-2 pl-2 shadow-sm hover:scale-[1.02] transition-transform
                                    ${app.status === 'blocked'
                        ? 'bg-slate-200 border-slate-400 text-slate-500'
                        : `${app.color.replace('bg-', 'text-').replace('-500', '-700')} bg-white border-${app.color.split('-')[1]}-500`
                      }
                                `}
                  >
                    {app.status === 'blocked' ? (app.blockReason || 'Bloqueado') : app.startTime + ' ' + (app.notes || 'Consulta')}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
