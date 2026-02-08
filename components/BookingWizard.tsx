import React, { useState } from 'react';
import { Service, Staff, Appointment, EstablishmentSettings } from '../types';
import { ArrowLeft, Sparkles, MonitorPlay } from 'lucide-react';
import { WizardStepper } from './wizard/WizardStepper';
import { WizardSummary } from './wizard/WizardSummary';
import { WizardStepService } from './wizard/WizardStepService';
import { WizardStepStaff } from './wizard/WizardStepStaff';
import { WizardStepDateTime } from './wizard/WizardStepDateTime';
import { WizardStepForm } from './wizard/WizardStepForm';
import { WizardStepReview } from './wizard/WizardStepReview';
import { WizardStepSuccess } from './wizard/WizardStepSuccess';
import { useIdleTimer } from '../hooks/useIdleTimer';
import { useTerminology } from '../hooks/useTerminology';

interface Props {
  onBackToAdmin: () => void;
  onNewBooking: (appt: Appointment) => void;
  services: Service[];
  staff: Staff[];
  isKiosk?: boolean;
  settings?: EstablishmentSettings | null;
}

type Step = 'SERVICE' | 'STAFF' | 'DATETIME' | 'FORM' | 'REVIEW' | 'SUCCESS';

export const BookingWizard: React.FC<Props> = ({ onBackToAdmin, onNewBooking, services, staff, isKiosk, settings }) => {
  const [step, setStep] = useState<Step>('SERVICE');
  const { t } = useTerminology(settings);

  // Selection State
  // ... (unchanged)
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientInfo, setClientInfo] = useState({ name: '', phone: '', email: '', nif: '' });

  // Screensaver State
  const [isScreensaverActive, setIsScreensaverActive] = useState(false);

  // Idle Timer (2 minutes = 120000ms)
  useIdleTimer(120000, () => {
    if (isKiosk && step !== 'SERVICE') {
      setIsScreensaverActive(true);
    }
  });

  const handleReset = () => {
    setStep('SERVICE');
    setSelectedService(null);
    setSelectedStaff(null);
    setSelectedDate('');
    setSelectedTime('');
    setClientInfo({ name: '', phone: '', email: '', nif: '' });
    setIsScreensaverActive(false);
    if (!isKiosk) onBackToAdmin();
  };

  // Steps handling
  const stepsList = [t('service_label'), t('professional_label'), t('date_title'), t('data_title'), 'Revisão'];
  const currentStepIndex = ['SERVICE', 'STAFF', 'DATETIME', 'FORM', 'REVIEW', 'SUCCESS'].indexOf(step);

  // Submit Logic
  const handleConfirmBooking = () => {
    if (selectedService && selectedDate && selectedTime) {
      const newAppt: Appointment = {
        id: Math.random().toString(36).substr(2, 9),
        clientId: 'c_guest', // In real app create/find client
        clientName: clientInfo.name,
        clientPhone: clientInfo.phone,
        clientEmail: clientInfo.email,
        clientNif: clientInfo.nif,
        staffId: selectedStaff?.id || 'any',
        serviceId: selectedService.id,
        date: selectedDate,
        startTime: selectedTime,
        status: 'pending',
        color: 'bg-teal-500'
      };

      onNewBooking(newAppt);
      setStep('SUCCESS');
    }
  };

  // Screensaver Component (Inline for simplicity)
  if (isScreensaverActive && isKiosk) {
    return (
      <div
        onClick={handleReset}
        className="fixed inset-0 z-[200] bg-gradient-to-br from-doky-blue to-doky-action-cyan flex flex-col items-center justify-center text-white cursor-pointer animate-fade-in"
      >
        <div className="animate-pulse flex flex-col items-center">
          <MonitorPlay size={80} className="mb-8 opacity-80" />
          <h1 className="text-5xl font-black font-heading tracking-tight mb-4">Toque para Agendar</h1>
          <p className="text-xl font-medium opacity-80">Estamos à sua espera</p>
        </div>
        <div className="absolute bottom-10 flex items-center gap-2 opacity-50">
          <Sparkles size={16} /> Powered by DOKY
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-transparent p-0 md:p-6 flex flex-col relative overflow-y-auto overflow-x-hidden font-sans">

      {/* Persistent Summary (Desktop/Large Screens) */}
      {step !== 'SUCCESS' && step !== 'SERVICE' && (
        <WizardSummary
          selectedService={selectedService}
          selectedStaff={selectedStaff}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
        />
      )}

      {/* Navigation Controls */}
      {step !== 'SUCCESS' && !isKiosk && (
        <button
          onClick={() => {
            if (step === 'SERVICE') onBackToAdmin();
            else if (step === 'STAFF') setStep('SERVICE');
            else if (step === 'DATETIME') setStep('STAFF');
            else if (step === 'FORM') setStep('DATETIME');
            else if (step === 'REVIEW') setStep('FORM');
          }}
          className="fixed top-6 left-6 p-4 rounded-full bg-white/80 backdrop-blur shadow-sm hover:shadow-md text-slate-600 hover:text-teal-600 transition-all z-50 group border border-slate-100"
        >
          <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </button>
      )}

      {/* Kiosk Back Button Logic */}
      {step !== 'SUCCESS' && isKiosk && step !== 'SERVICE' && (
        <button
          onClick={() => {
            if (step === 'STAFF') setStep('SERVICE');
            else if (step === 'DATETIME') setStep('STAFF');
            else if (step === 'FORM') setStep('DATETIME');
            else if (step === 'REVIEW') setStep('FORM');
          }}
          className="fixed top-6 left-6 p-4 rounded-full bg-white/80 backdrop-blur shadow-sm hover:shadow-md text-slate-600 hover:text-teal-600 transition-all z-50 group border border-slate-100"
        >
          <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </button>
      )}

      {/* Main Content */}
      <div className={`flex-1 w-full flex flex-col pt-12 md:pt-4 pb-24 lg:pb-0 items-center transition-all duration-300 ${(step !== 'SUCCESS' && step !== 'SERVICE') ? 'lg:pl-72' : ''
        }`}>

        {/* Stepper (Only visible if not success) */}
        {step !== 'SUCCESS' && (
          <div className="w-full max-w-4xl px-4 z-10 mb-12 md:mb-16">
            <WizardStepper currentStep={currentStepIndex} steps={stepsList} />
          </div>
        )}

        {/* Step Content */}
        <div className="w-full flex-1 animate-fade-in-up">
          {step === 'SERVICE' && (
            <WizardStepService
              services={services}
              settings={settings}
              onSelect={(s) => { setSelectedService(s); setStep('STAFF'); }}
            />
          )}

          {step === 'STAFF' && (
            <WizardStepStaff
              staff={staff}
              settings={settings}
              onSelect={(s) => { setSelectedStaff(s); setStep('DATETIME'); }}
            />
          )}

          {step === 'DATETIME' && (
            <WizardStepDateTime
              settings={settings}
              onSelect={(d, t) => { setSelectedDate(d); setSelectedTime(t); setStep('FORM'); }}
            />
          )}

          {step === 'FORM' && (
            <WizardStepForm
              settings={settings}
              onSubmit={(data) => { setClientInfo(data); setStep('REVIEW'); }}
            />
          )}

          {step === 'REVIEW' && (
            <WizardStepReview
              data={{
                service: selectedService,
                staff: selectedStaff,
                date: selectedDate,
                time: selectedTime,
                client: clientInfo
              }}
              onEdit={(stepIndex) => {
                const stepMap: Step[] = ['SERVICE', 'STAFF', 'DATETIME', 'FORM'];
                setStep(stepMap[stepIndex] || 'SERVICE');
              }}
              onConfirm={handleConfirmBooking}
              settings={settings}
            />
          )}

          {step === 'SUCCESS' && (
            <WizardStepSuccess onDone={handleReset} />
          )}
        </div>

      </div>

      {/* Footer Branding */}
      <div className="pb-8 text-center text-slate-400 opacity-60">
        <div className="text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-2">
          <Sparkles size={10} />
          Powered by DOKY - Todos os direitos estão reservados.
        </div>
      </div>
    </div>
  );
};