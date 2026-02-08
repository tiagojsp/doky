"use client";

import { useState } from "react";
import { ServiceSelection } from "./steps/ServiceSelection";
import { StaffSelection } from "./steps/StaffSelection";
import { TimeSelection } from "./steps/TimeSelection";
import { Confirmation } from "./steps/Confirmation";
import { Service, Staff } from "@/types";
import { format } from "date-fns";
import { CheckCircle, Calendar } from "lucide-react";
import Link from "next/link";

type BookingStep = "service" | "staff" | "time" | "auth" | "success";

export function BookingWizard() {
    const [currentStep, setCurrentStep] = useState<BookingStep>("service");
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const handleServiceSelect = (service: Service) => {
        setSelectedService(service);
        setCurrentStep("staff");
    };

    const handleStaffSelect = (staff: Staff | null) => {
        setSelectedStaff(staff);
        setCurrentStep("time");
    };

    const handleTimeSelect = (date: Date, time: string) => {
        setSelectedDate(date);
        setSelectedTime(time);
        setCurrentStep("auth");
    }

    const handleBookingSuccess = () => {
        setCurrentStep("success");
    }

    if (currentStep === "success") {
        return (
            <div className="max-w-md mx-auto min-h-screen bg-white/50 flex items-center justify-center p-6">
                <div className="glass-card w-full p-8 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-[var(--color-doky-success)] rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-green-200">
                        <CheckCircle className="text-white w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--color-doky-blue)] mb-2 font-heading">Sucesso!</h2>
                    <p className="text-slate-600 mb-6">
                        O seu agendamento foi confirmado. Enviaremos uma mensagem com os detalhes.
                    </p>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm mb-8 text-left">
                        <div className="flex justify-between mb-2">
                            <span className="text-slate-500">Quando:</span>
                            <span className="font-bold text-slate-800">
                                {selectedDate && format(selectedDate, "dd/MM/yyyy")} às {selectedTime}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Serviço:</span>
                            <span className="font-bold text-slate-800">{selectedService?.name}</span>
                        </div>
                    </div>

                    <Link href="/" className="btn-primary w-full">
                        Voltar ao Início
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-[var(--color-doky-blue)] p-6 text-white text-center rounded-b-[3rem] shadow-lg z-10 transition-all duration-500 ease-out">
                <h1 className="text-xl font-bold font-heading">DOKY Branding</h1>
                <p className="text-sm opacity-80">Portal de Agendamento</p>

                {/* Breadcrumbs summary */}
                {currentStep !== "service" && (
                    <div className="mt-4 flex flex-wrap justify-center gap-2 text-[10px] uppercase tracking-wider opacity-90">
                        <span className="bg-white/10 px-2 py-1 rounded">{selectedService?.name}</span>
                        {selectedStaff && <span className="bg-white/10 px-2 py-1 rounded">{selectedStaff.name}</span>}
                        {selectedTime && <span className="bg-white/10 px-2 py-1 rounded">{selectedTime}</span>}
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 relative no-scrollbar">
                {currentStep === "service" && (
                    <ServiceSelection onSelect={handleServiceSelect} />
                )}
                {currentStep === "staff" && selectedService && (
                    <StaffSelection
                        service={selectedService}
                        onSelect={handleStaffSelect}
                        onBack={() => setCurrentStep("service")}
                    />
                )}
                {currentStep === "time" && selectedService && (
                    <TimeSelection
                        service={selectedService}
                        staff={selectedStaff}
                        onSelect={handleTimeSelect}
                        onBack={() => setCurrentStep("staff")}
                    />
                )}
                {currentStep === "auth" && selectedService && selectedDate && selectedTime && (
                    <Confirmation
                        service={selectedService}
                        staff={selectedStaff}
                        date={selectedDate}
                        time={selectedTime}
                        onSuccess={handleBookingSuccess}
                        onBack={() => setCurrentStep("time")}
                    />
                )}
            </div>

            {/* Progress / Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400">
                Passo {currentStep === "service" ? 1 : currentStep === "staff" ? 2 : currentStep === "time" ? 3 : 4} de 4
            </div>
        </div>
    );
}
