import React, { useState } from 'react';
import { Appointment, Staff, Client, Service } from '../types';
import { CalendarContainer } from './CalendarContainer';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import {
  X, Trash2, FileText, User, RefreshCw, Copy, AlignLeft,
  Calendar as CalendarIcon, AlertCircle
} from 'lucide-react';
import { AppointmentModal } from './AppointmentModal';

// ... (imports)

interface Props {
  appointments: Appointment[];
  staff: Staff[];
  clients: Client[];
  services: Service[];
  onAddAppointment: (appt: Appointment) => void;
  onUpdateAppointment: (appt: Appointment) => void;
  onDeleteAppointment: (id: string) => void;
  onViewClient: (clientId: string) => void;
  targetDate?: Date;
  targetAppointmentId?: string | null;
}

export const AgendaView: React.FC<Props> = ({
  appointments, staff, clients, services,
  onAddAppointment, onUpdateAppointment, onDeleteAppointment, onViewClient,
  targetDate, targetAppointmentId
}) => {
  const [selectedSlot, setSelectedSlot] = useState<{ date: string, time: string } | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Deep Linking Effect: Open specific appointment
  React.useEffect(() => {
    if (targetAppointmentId) {
      const appt = appointments.find(a => a.id === targetAppointmentId);
      if (appt) {
        setSelectedAppointment(appt);
      }
    }
  }, [targetAppointmentId, appointments]);

  // Editing State
  const [editingAppointmentId, setEditingAppointmentId] = useState<string | null>(null);

  // Modal State
  const [modalMode, setModalMode] = useState<'appointment' | 'block'>('appointment');
  const [newApptClient, setNewApptClient] = useState(clients[0]?.id || '');
  const [newApptService, setNewApptService] = useState(services[0]?.id || '');
  const [newApptStaff, setNewApptStaff] = useState(staff[0]?.id || '');
  const [newApptNotes, setNewApptNotes] = useState('');

  // Blocking State
  const [blockReason, setBlockReason] = useState('Almoço');

  // Helper to open modal cleanly (Called from CalendarContainer)
  const handleSlotClick = (date: Date, time: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setSelectedSlot({ date: dateStr, time });
    setModalMode('appointment'); // Reset to default
    setNewApptNotes(''); // Reset notes
    setEditingAppointmentId(null); // Ensure we are in create mode

    // Reset defaults
    if (clients.length > 0) setNewApptClient(clients[0].id);
    if (services.length > 0) setNewApptService(services[0].id);
    if (staff.length > 0) setNewApptStaff(staff[0].id);
  };

  const handleEditAppointment = (appt: Appointment) => {
    setSelectedAppointment(null); // Close context menu
    setSelectedSlot({ date: appt.date, time: appt.startTime }); // Open modal at this slot
    setEditingAppointmentId(appt.id);
    setModalMode(appt.status === 'blocked' ? 'block' : 'appointment');

    setNewApptClient(appt.clientId);
    setNewApptService(appt.serviceId);
    setNewApptStaff(appt.staffId);
    setNewApptNotes(appt.notes || '');
    setBlockReason(appt.blockReason || 'Almoço');
  };

  // Handle creating a new appointment or block
  const handleCreate = () => {
    if (!selectedSlot) return;

    // Use existing ID if editing, else generate new
    const newId = editingAppointmentId || Math.random().toString(36).substr(2, 9);
    let newAppt: Appointment;

    if (modalMode === 'appointment') {
      // Prepare colors - keep existing if editing, else random
      let color = 'bg-cyan-500';
      if (editingAppointmentId) {
        const existing = appointments.find(a => a.id === editingAppointmentId);
        if (existing) color = existing.color;
      } else {
        const colors = ['bg-cyan-500', 'bg-blue-500', 'bg-indigo-500', 'bg-sky-500'];
        color = colors[Math.floor(Math.random() * colors.length)];
      }

      newAppt = {
        id: newId,
        clientId: newApptClient,
        serviceId: newApptService,
        staffId: newApptStaff,
        date: selectedSlot.date,
        startTime: selectedSlot.time,
        status: 'confirmed',
        color: color,
        notes: newApptNotes
      };
    } else {
      // Create Block
      newAppt = {
        id: newId,
        clientId: 'system_block',
        serviceId: 'system_block',
        staffId: newApptStaff,
        date: selectedSlot.date,
        startTime: selectedSlot.time,
        status: 'blocked',
        color: 'bg-slate-200',
        blockReason: blockReason
      };
    }

    if (editingAppointmentId) {
      onUpdateAppointment(newAppt);
    } else {
      onAddAppointment(newAppt);
    }

    setSelectedSlot(null);
    setEditingAppointmentId(null);
  };

  return (
    <div className="h-full relative">
      <CalendarContainer
        appointments={appointments}
        staff={staff}
        clients={clients}
        services={services}
        onAddAppointment={handleSlotClick}
        onSelectAppointment={setSelectedAppointment}
        onDeleteAppointment={onDeleteAppointment}
        targetDate={targetDate}
      />

      {/* NEW APPOINTMENT / BLOCK MODAL */}
      <AppointmentModal
        isOpen={!!selectedSlot}
        onClose={() => { setSelectedSlot(null); setEditingAppointmentId(null); setSelectedAppointment(null); }}
        onSave={(data) => {
          // Handle Save
          const newId = editingAppointmentId || Math.random().toString(36).substr(2, 9);
          const newAppt = {
            ...data,
            id: newId,
            status: data.status || 'confirmed',
            color: editingAppointmentId ? (appointments.find(a => a.id === editingAppointmentId)?.color || 'bg-cyan-500') : 'bg-cyan-500' // Simple color logic for now
          };

          if (editingAppointmentId) {
            onUpdateAppointment(newAppt);
          } else {
            onAddAppointment(newAppt);
          }
          setSelectedSlot(null);
          setEditingAppointmentId(null);
          setSelectedAppointment(null); // Clear selected appointment after saving
        }}
        initialData={editingAppointmentId ? appointments.find(a => a.id === editingAppointmentId) : null}
        selectedDate={selectedSlot?.date}
        selectedTime={selectedSlot?.time}
        staff={staff}
        clients={clients}
        services={services}
      />

      {/* CONTEXT MENU */}
      {selectedAppointment && !selectedSlot && ( // Ensure we don't show context menu if modal is open (editing)
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] p-4" onClick={() => setSelectedAppointment(null)}>
          <div
            className="w-full max-w-[320px] bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden animate-scale-in flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100">
              <div className="flex flex-col">
                <span className="font-bold text-slate-700">
                  {selectedAppointment.status === 'blocked' ? 'Bloqueio de Horário' : format(new Date(selectedAppointment.date), 'EEE, d MMM yyyy', { locale: pt })}
                </span>
                <span className="text-sm text-slate-500">{selectedAppointment.startTime}</span>
              </div>
              <button onClick={() => setSelectedAppointment(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {/* Notes Section in Menu */}
            {selectedAppointment.notes && !['blocked'].includes(selectedAppointment.status) && (
              <div className="px-5 py-3 bg-amber-50 border-b border-amber-100 flex gap-3">
                <div className="shrink-0 mt-0.5 text-amber-500"><AlignLeft size={16} /></div>
                <div>
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">Notas</p>
                  <p className="text-sm text-slate-700 leading-snug">{selectedAppointment.notes}</p>
                </div>
              </div>
            )}

            {/* Menu Actions */}
            <div className="py-2 flex flex-col text-sm font-medium text-slate-600">

              {selectedAppointment.status === 'blocked' ? (
                // ACTIONS FOR BLOCKED SLOTS
                <button
                  onClick={() => { onDeleteAppointment(selectedAppointment.id); setSelectedAppointment(null); }}
                  className="flex items-center gap-3 px-6 py-4 hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors font-semibold"
                >
                  <Trash2 size={18} />
                  <span>Desbloquear / Remover</span>
                </button>
              ) : (
                // ACTIONS FOR APPOINTMENTS
                <>
                  <button
                    onClick={() => handleEditAppointment(selectedAppointment)}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                  >
                    <FileText size={18} className="text-cyan-500" />
                    <span>Editar esta marcação</span>
                  </button>

                  <button
                    onClick={() => onViewClient(selectedAppointment.clientId)}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                  >
                    <User size={18} className="text-cyan-500" />
                    <span>Ver Ficha de Cliente</span>
                  </button>

                  <div className="h-px bg-slate-100 my-1 mx-4"></div>

                  <button
                    onClick={() => {
                      // Void Payment Logic
                      if (window.confirm('Tem a certeza que deseja anular o pagamento?')) {
                        onUpdateAppointment({ ...selectedAppointment, paymentStatus: 'refunded' });
                        setSelectedAppointment(null);
                      }
                    }}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-cyan-50 text-cyan-600 font-bold uppercase text-xs tracking-wide transition-colors"
                  >
                    <span className="w-5"></span>
                    ANULAR PAGAMENTO
                  </button>

                  <button
                    onClick={() => {
                      // No Show Logic
                      if (confirm('Marcar como "Faltou"?')) {
                        onUpdateAppointment({ ...selectedAppointment, status: 'no_show', color: 'bg-slate-400' });
                        setSelectedAppointment(null);
                      }
                    }}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-cyan-50 text-cyan-600 font-bold uppercase text-xs tracking-wide transition-colors"
                  >
                    <span className="w-5"></span>
                    FALTOU
                  </button>

                  <div className="h-px bg-slate-100 my-1 mx-4"></div>

                  <button
                    onClick={() => { onDeleteAppointment(selectedAppointment.id); setSelectedAppointment(null); }}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors font-semibold"
                  >
                    <Trash2 size={18} />
                    <span>Cancelar esta marcação</span>
                  </button>

                  <button
                    onClick={() => {
                      // Duplicate Logic
                      const newAppt = {
                        ...selectedAppointment,
                        id: Math.random().toString(36).substr(2, 9),
                        status: 'pending' as const, // Reset status
                        startTime: selectedAppointment.startTime // Keep time, user might want to change it
                      };
                      // Open modal with this new appointment to let user choose new time/date if needed
                      setSelectedAppointment(null);
                      setNewApptClient(newAppt.clientId);
                      setNewApptService(newAppt.serviceId);
                      setNewApptStaff(newAppt.staffId);
                      setNewApptNotes(newAppt.notes || '');
                      setSelectedSlot({ date: newAppt.date, time: newAppt.startTime });
                      setEditingAppointmentId(null); // It's a new one
                      setModalMode('appointment');
                    }}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-cyan-50 text-cyan-600 font-bold transition-colors"
                  >
                    <RefreshCw size={18} />
                    <span>Nova marcação (Dupla)</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};