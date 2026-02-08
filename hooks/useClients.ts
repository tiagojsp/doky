import { useState, useEffect, useCallback } from 'react';
import { Client } from '../types';
import { api } from '../services/api';

export function useClients() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchClients = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.fetchClients();
            setClients(data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch clients", err);
            setError(err instanceof Error ? err : new Error('Failed to fetch clients'));
        } finally {
            setLoading(false);
        }
    }, []);

    const addClient = async (clientData: Partial<Client>) => {
        // Note: api.findOrCreateClient returns the client if found or created
        // But for a pure "add" UI, we might want api.createClient if it existed.
        // Using findOrCreate based on App.tsx usage pattern or extending API.

        // Actually, looking at ClientsView, it uses api.updateClient for both?
        // "New Client" button just creates a dummy object in state with new UUID.
        // modifying specific fields.
        // We should probably rely on updateClient (upsert) for now.

        // For this hook, let's expose updateClient which handles upsert.
        return updateClient(clientData as Client);
    };

    const updateClient = async (client: Client) => {
        // Optimistic update
        const prevClients = [...clients];
        const exists = clients.some(c => c.id === client.id);

        if (exists) {
            setClients(prev => prev.map(c => c.id === client.id ? client : c));
        } else {
            setClients(prev => [...prev, client]);
        }

        try {
            const success = await api.updateClient(client);
            if (!success) {
                throw new Error("Failed to update client");
            }
            return true;
        } catch (err) {
            console.error("Failed to update client", err);
            // Revert
            setClients(prevClients);
            setError(err instanceof Error ? err : new Error('Failed to update client'));
            return false;
        }
    };

    const deleteClient = async (id: string) => {
        // Optimistic
        const prevClients = [...clients];
        setClients(prev => prev.filter(c => c.id !== id));

        try {
            const success = await api.deleteClient(id);
            if (!success) {
                throw new Error("Failed to delete client");
            }
            return true;
        } catch (err) {
            console.error("Failed to delete client", err);
            setClients(prevClients);
            setError(err instanceof Error ? err : new Error('Failed to delete client'));
            return false;
        }
    };

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    return {
        clients,
        loading,
        error,
        refreshClients: fetchClients,
        updateClient,
        deleteClient
    };
}
