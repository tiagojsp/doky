import { useState, useEffect, useRef } from 'react';

export const useIdleTimer = (timeoutMs: number, onTimeout: () => void) => {
    const [isIdle, setIsIdle] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const onTimeoutRef = useRef(onTimeout);

    useEffect(() => {
        onTimeoutRef.current = onTimeout;
    }, [onTimeout]);

    useEffect(() => {
        let mounted = true;
        const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

        const handleActivity = () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (mounted) setIsIdle(false);

            timerRef.current = setTimeout(() => {
                if (mounted) {
                    setIsIdle(true);
                    onTimeoutRef.current();
                }
            }, timeoutMs);
        };

        events.forEach(event => window.addEventListener(event, handleActivity));

        // Initial start
        handleActivity();

        return () => {
            mounted = false;
            if (timerRef.current) clearTimeout(timerRef.current);
            events.forEach(event => window.removeEventListener(event, handleActivity));
        };
    }, [timeoutMs]);

    return isIdle;
};
