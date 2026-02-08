import React, { useEffect } from 'react';
import { BookingWizard } from './BookingWizard';
import { Service, Staff, Appointment, EstablishmentSettings } from '../types';

interface Props {
    services: Service[];
    staff: Staff[];
    settings: EstablishmentSettings | null;
    onNewBooking: (appt: Appointment) => void;
    onReset: () => void;
}

export const KioskView: React.FC<Props> = ({ services, staff, settings, onNewBooking, onReset }) => {

    // Apply Theme
    useEffect(() => {
        if (settings?.businessProfile) {
            const root = document.documentElement;
            const { primaryColor, secondaryColor } = settings.businessProfile;

            if (primaryColor) root.style.setProperty('--color-primary', primaryColor);
            if (secondaryColor) root.style.setProperty('--color-secondary', secondaryColor);
        }
    }, [settings]);

    const backgroundStyle = settings?.businessProfile ? {
        background: `linear-gradient(135deg, ${settings.businessProfile.secondaryColor} 0%, ${settings.businessProfile.primaryColor} 100%)`
    } : undefined;

    return (
        <div className="fixed inset-0 z-[100] bg-slate-50" style={backgroundStyle}>
            {/* Background Overlay for better text contrast if needed */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>

            <BookingWizard
                onBackToAdmin={onReset}
                onNewBooking={onNewBooking}
                services={services}
                staff={staff}
                settings={settings}
                isKiosk={true}
            />
        </div>
    );
};
