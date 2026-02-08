import { useState, useEffect, useCallback } from 'react';
import { EstablishmentSettings } from '../types';
import { api } from '../services/api';

export function useSettings() {
    const [settings, setSettings] = useState<EstablishmentSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.fetchEstablishmentSettings();
            setSettings(data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch settings", err);
            setError(err instanceof Error ? err : new Error('Failed to fetch settings'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return { settings, loading, error, refreshSettings: fetchSettings };
}
