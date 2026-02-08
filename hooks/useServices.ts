import { useState, useEffect, useCallback } from 'react';
import { Service } from '../types';
import { api } from '../services/api';

export function useServices() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchServices = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.fetchServices();
            setServices(data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch services", err);
            setError(err instanceof Error ? err : new Error('Failed to fetch services'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    return { services, loading, error, refreshServices: fetchServices };
}
