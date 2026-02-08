import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AdminHeader } from './components/AdminHeader';
import { FloatingAssistant } from './components/FloatingAssistant';
import { AgendaView } from './components/AgendaView';
import { ClientsView } from './components/ClientsView';
import { SettingsView } from './components/SettingsView';
import { BookingWizard } from './components/BookingWizard';
import { KioskView } from './components/KioskView';
import { DashboardView } from './components/DashboardView';
import { ViewState, Appointment } from './types';
import { LayoutDashboard } from 'lucide-react';

// Custom Hooks
import { useServices } from './hooks/useServices';
import { useStaff } from './hooks/useStaff';
import { useClients } from './hooks/useClients';
import { useAppointments } from './hooks/useAppointments';
import { useSettings } from './hooks/useSettings';
import { useToast } from './contexts/ToastContext';

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  // Data Hooks
  const { services, loading: loadingServices, refreshServices } = useServices();
  const { staff, loading: loadingStaff, refreshStaff } = useStaff();
  const { clients, loading: loadingClients, refreshClients } = useClients();
  const {
    appointments,
    loading: loadingAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    refreshAppointments
  } = useAppointments();
  const { settings: establishmentSettings, loading: loadingSettings, refreshSettings } = useSettings();

  // Combined Loading State
  const loading = loadingServices || loadingStaff || loadingClients || loadingAppointments || loadingSettings;

  // Client Navigation State
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const handleViewClient = (clientId: string) => {
    setSelectedClientId(clientId);
    navigate('/clients');
  };

  // Deep Linking State (Agenda)
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [targetAppointmentId, setTargetAppointmentId] = useState<string | null>(null);

  const handleJumpToAppointment = (dateStr: string, appointmentId: string) => {
    setTargetDate(new Date(dateStr));
    setTargetAppointmentId(appointmentId);
    navigate('/'); // Agenda is at root
  };

  const refreshData = async () => {
    await Promise.all([
      refreshServices(),
      refreshStaff(),
      refreshClients(),
      refreshAppointments(),
      refreshSettings()
    ]);
  };

  useEffect(() => {
    // Check for Kiosk mode in URL query params if user enters manually with ?mode=kiosk
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'kiosk') {
      navigate('/kiosk');
    }
  }, [navigate]);

  const handleAddAppointmentWrapper = useCallback(async (newApp: Appointment) => {
    try {
      await addAppointment(newApp);
      toast.success("Agendamento criado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save appointment");
    }
  }, [addAppointment, toast]);

  const handleDeleteAppointmentWrapper = useCallback(async (id: string) => {
    try {
      await deleteAppointment(id);
      toast.success("Agendamento eliminado.");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete appointment");
    }
  }, [deleteAppointment, toast]);

  const handleUpdateAppointmentWrapper = useCallback(async (updatedApp: Appointment) => {
    try {
      await updateAppointment(updatedApp);
      toast.success("Agendamento atualizado.");
    } catch (error: any) {
      console.error("Update failed", error);
      toast.error("Erro ao atualizar agendamento.");
    }
  }, [updateAppointment, toast]);

  const handleLogout = async () => {
    if (window.confirm('Tem a certeza que deseja sair?')) {
      window.location.reload();
    }
  };

  // Sidebar State
  const [isSideCollapsed, setIsSideCollapsed] = useState(false);

  // Helper to determine active view for AdminHeader
  const getCurrentViewFromPath = (path: string): ViewState => {
    if (path.startsWith('/clients')) return ViewState.CLIENTS;
    if (path.startsWith('/reports')) return ViewState.REPORTS;
    if (path.startsWith('/settings')) return ViewState.SETTINGS;
    if (path.startsWith('/kiosk')) return ViewState.KIOSK;
    if (path.startsWith('/booking')) return ViewState.BOOKING_WIZARD;
    if (path === '/') return ViewState.AGENDA;
    return ViewState.AGENDA;
  };

  const currentView = getCurrentViewFromPath(location.pathname);

  // Standalone views don't show the header/sidebar
  const isStandalone = location.pathname === '/kiosk' || location.pathname === '/booking';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doky-cyan"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-transparent">
      {!isStandalone && (
        <AdminHeader
          currentView={currentView}
          setView={(view) => {
            switch (view) {
              case ViewState.AGENDA: navigate('/'); break;
              case ViewState.CLIENTS: navigate('/clients'); break;
              case ViewState.REPORTS: navigate('/reports'); break;
              case ViewState.SETTINGS: navigate('/settings'); break;
              case ViewState.KIOSK: navigate('/kiosk'); break;
              // Campaigns etc not implemented yet?
              default: break;
            }
          }}
          onOpenBooking={() => navigate('/booking')}
          isCollapsed={isSideCollapsed}
          setIsCollapsed={setIsSideCollapsed}
          establishmentName={establishmentSettings?.name}
          clientAppUrl={establishmentSettings?.contacts.clientAppUrl}
          onLogout={handleLogout}
        />
      )}

      <main className={`
        flex-1 overflow-hidden relative p-0 md:p-1 transition-all duration-500 ease-out
        ${!isStandalone ? 'md:mt-6 md:h-[calc(100vh-3rem)]' : 'h-screen'}
        ${!isStandalone ? (isSideCollapsed ? 'md:ml-24' : 'md:ml-60') : ''}
      `}>
        <div className={`h-full w-full ${!isStandalone ? 'md:rounded-[2rem] bg-white/85 backdrop-blur-2xl border border-white/40 shadow-2xl shadow-slate-300/20 pb-20 md:pb-0' : ''} flex flex-col relative z-0 overflow-hidden`}>
          <Routes>
            <Route path="/" element={
              <AgendaView
                appointments={appointments}
                staff={staff}
                clients={clients}
                services={services}
                onAddAppointment={handleAddAppointmentWrapper}
                onUpdateAppointment={handleUpdateAppointmentWrapper}
                onDeleteAppointment={handleDeleteAppointmentWrapper}
                onViewClient={handleViewClient}
                targetDate={targetDate}
                targetAppointmentId={targetAppointmentId}
              />
            } />
            <Route path="/clients" element={
              <ClientsView
                clients={clients}
                initialSelectedClientId={selectedClientId}
                onClientChange={refreshClients}
                onClearSelection={() => setSelectedClientId(null)}
                appointments={appointments}
              />
            } />
            <Route path="/reports" element={
              <DashboardView appointments={appointments} services={services} />
            } />
            <Route path="/settings" element={
              <SettingsView onSettingsChange={refreshSettings} onDataChange={refreshData} />
            } />
            <Route path="/booking" element={
              <BookingWizard
                onBackToAdmin={() => navigate('/')}
                onNewBooking={handleAddAppointmentWrapper}
                services={services}
                staff={staff}
                settings={establishmentSettings}
              />
            } />
            <Route path="/kiosk" element={
              <KioskView
                services={services}
                staff={staff}
                settings={establishmentSettings}
                onNewBooking={handleAddAppointmentWrapper}
                onReset={() => {
                  window.location.reload();
                }}
              />
            } />
            {/* Fallback for development / not implemented routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      {!isStandalone && (
        <FloatingAssistant
          appointments={appointments}
          clients={clients}
          services={services}
          staff={staff}
          onNavigate={(view) => {
            switch (view) {
              case ViewState.AGENDA: navigate('/'); break;
              case ViewState.CLIENTS: navigate('/clients'); break;
              case ViewState.REPORTS: navigate('/reports'); break;
              case ViewState.SETTINGS: navigate('/settings'); break;
              default: break;
            }
          }}
        />
      )}
    </div>
  );
};

export default App;