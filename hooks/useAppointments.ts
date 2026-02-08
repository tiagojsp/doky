import { useState, useEffect, useCallback } from 'react';
import { Appointment, Client } from '../types';
import { api } from '../services/api';

export function useAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchAppointments = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.fetchAppointments();
            setAppointments(data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch appointments", err);
            setError(err instanceof Error ? err : new Error('Failed to fetch appointments'));
        } finally {
            setLoading(false);
        }
    }, []);

    const addAppointment = async (newApp: Appointment) => {
        // Specific logic for Guest Client lifted from App.tsx
        let finalAppointment = { ...newApp };

        if (newApp.clientId === 'c_guest') {
            try {
                // Sanitize input: Convert empty strings to undefined so API handles them as NULL
                // This prevents Unique Constraint violations on empty strings (email, nif, mobile)
                const clientData: Partial<Client> = {
                    name: newApp.clientName || 'Visitante',
                    email: (newApp.clientEmail && newApp.clientEmail.trim() !== '') ? newApp.clientEmail : undefined,
                    mobile: (newApp.clientPhone && newApp.clientPhone.trim() !== '') ? newApp.clientPhone : undefined,
                    nif: (newApp.clientNif && newApp.clientNif.trim() !== '') ? newApp.clientNif : undefined
                };

                const client = await api.findOrCreateClient(clientData);
                if (client) {
                    finalAppointment.clientId = client.id;
                } else {
                    throw new Error("Erro ao criar ficha de cliente. Verifique se os dados estão corretos.");
                }
            } catch (error) {
                console.error("Error handling guest client:", error);
                throw error;
            }
        }

        // Optimistic update
        const tempId = finalAppointment.id || crypto.randomUUID();
        const optimisticApp = { ...finalAppointment, id: tempId };

        setAppointments(prev => [...prev, optimisticApp]);

        try {
            const created = await api.createAppointment(finalAppointment);
            if (!created) {
                throw new Error("Não foi possível salvar o agendamento no momento.");
            }
            // Replace optimistic with real one
            setAppointments(prev => prev.map(a => a.id === tempId ? created : a));
            return created;
        } catch (err: any) {
            console.error("Failed to add appointment", err);
            // Revert optimistic update
            setAppointments(prev => prev.filter(a => a.id !== tempId));

            // Provide more descriptive error to user
            const errorMessage = err?.message || "Erro inesperado ao salvar marcação. Tente novamente.";
            setError(new Error(errorMessage));
            throw new Error(errorMessage);
        }
    };

    const updateAppointment = async (updatedApp: Appointment) => {
        // Optimistic
        const prevAppts = [...appointments];
        setAppointments(prev => prev.map(a => a.id === updatedApp.id ? updatedApp : a));

        try {
            const success = await api.updateAppointment(updatedApp);
            if (!success) {
                throw new Error("Failed to update appointment");
            }
            return true;
        } catch (err) {
            console.error("Failed to update appointment", err);
            setAppointments(prevAppts);
            setError(err instanceof Error ? err : new Error('Failed to update appointment'));
            throw err;
        }
    };

    const deleteAppointment = async (id: string) => {
        // Optimistic
        const prevAppts = [...appointments];
        setAppointments(prev => prev.filter(a => a.id !== id));

        try {
            const success = await api.deleteAppointment(id);
            if (!success) {
                throw new Error("Failed to delete appointment");
            }
            return true;
        } catch (err) {
            console.error("Failed to delete appointment", err);
            setAppointments(prevAppts);
            setError(err instanceof Error ? err : new Error('Failed to delete appointment'));
            throw err;
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    return {
        appointments,
        loading,
        error,
        refreshAppointments: fetchAppointments,
        addAppointment,
        updateAppointment,
        deleteAppointment
    };
}
