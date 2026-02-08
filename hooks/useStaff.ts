import { useState, useEffect, useCallback } from 'react';
import { Staff } from '../types';
import { api } from '../services/api';

export function useStaff() {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchStaff = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.fetchStaff();
            setStaff(data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch staff", err);
            setError(err instanceof Error ? err : new Error('Failed to fetch staff'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStaff();
    }, [fetchStaff]);

    return { staff, loading, error, refreshStaff: fetchStaff };
}
