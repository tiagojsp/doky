
export enum UserRole {
  ADMIN = 'ADMIN',
  PUBLIC = 'PUBLIC'
}

export interface Service {
  id: string;
  name: string;
  category: string;
  duration: number; // minutes
  price: number;
  description?: string;
  featured?: boolean;

  // Extended fields
  ref?: string;
  vat?: number;
  isOnline?: boolean;
  commission?: {
    value: number;
    type: '%' | '€';
  };
  collaborators?: string[]; // IDs of staff who perform this
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  invoiceNotes?: string;
  ref?: string;
  barcode?: string;
  price: number; // Final price including VAT usually, or base. Let's assume Final for now or handle logic in component.
  vat?: number;
  vatExemption?: string;
  commissions?: {
    executing: { value: number; type: '%' | '€' };
    responsible: { value: number; type: '%' | '€' };
  };
  category: string;
  brand?: string;
}

export interface Voucher {
  id: string;
  name: string;
  ref?: string;
  price: number;
  discountPercent?: number;
  validityDays?: number;
  category: string;
  items?: { id: string; type: 'service' | 'product'; quantity: number }[];
  vat?: number; // implied by checkboxes in ref image
  commissions?: {
    executing: { value: number; type: '%' | '€' };
    responsible: { value: number; type: '%' | '€' };
  };
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
  email?: string;
  mobile?: string;
  gender?: 'M' | 'F';
  bio?: string;
  specialty?: string;
  accessLevel?: 'admin' | 'user';
  color?: string;
  order?: number;

  permissions?: {
    hasOwnAgenda: boolean;
    visibleInApp: boolean;
    onlineBookingEnabled: boolean;
  };

  commissions?: {
    executing: { value: number; type: '%' | '€' };
    responsible: { value: number; type: '%' | '€' };
  };

  schedule?: Record<string, { // 'mon', 'tue', ...
    enabled: boolean;
    start: string;
    end: string;
    breakStart?: string;
    breakEnd?: string;
  }>;
}

export interface Resource {
  id: string;
  type: 'room' | 'equipment';
  name: string;
  capacity: number;
  isActive: boolean;
  isVisible: boolean;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  mobile: string;
  gender?: 'M' | 'F' | 'O';
  nif?: string;
  ccNumber?: string;
  jobTitle?: string;

  // Address
  address?: string;
  postalCode?: string;
  city?: string;
  country?: string;

  // Contact Extras
  alternativeMobile?: string;

  // Preferences & System
  ref?: string;
  preferredStaffId?: string;
  notes?: string;

  // GDPR
  consent?: {
    marketing: boolean;
    sms: boolean;
    email: boolean;
    photos: boolean;
  };

  // Loyalty
  loyalty?: {
    cardId: string;
    points: number;
    balance: number;
    visits: number;
    startDate: string;
    nextVoucherDiff: number;
  };

  age: number;
  birthDate?: string; // "MM-DD" or full ISO "YYYY-MM-DD"
  lastVisit: number; // days ago
  nextVisit?: number; // days from now
  segment: 'Active' | 'Potential' | 'Lost';
  imageUrl?: string;
  avatarColor?: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  staffId: string;
  serviceId: string;
  startTime: string; // ISO string or simple time string for demo "09:00"
  date: string; // "2026-01-12"
  status: 'confirmed' | 'pending' | 'cancelled' | 'blocked' | 'no_show' | 'arrived';
  paymentStatus?: 'paid' | 'unpaid' | 'refunded';
  color: string;
  blockReason?: string; // Optional: "Lunch", "Meeting", "Closed"
  duration?: number; // Optional duration override in minutes
  notes?: string; // Notes/Observations for the appointment
  coupon?: string;
  isRecurring?: boolean;
}

export enum ViewState {
  AGENDA = 'agenda',
  CLIENTS = 'clients',
  CAMPAIGNS = 'campanhas',
  REPORTS = 'relatorios',
  SETTINGS = 'definicoes',
  BOOKING_WIZARD = 'booking_wizard'
}

export interface EstablishmentSettings {
  name: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
    district: string;
    country: string;
  };
  contacts: {
    phone: string;
    mobile: string;
    email: string;
    website: string;
  };
  socials: {
    facebook: string;
    instagram: string;
  };
  preferences: {
    language: string;
    timezone: string;
  };
  visibility: {
    showInApp: boolean;
    showInEmails: boolean;
    availableOnWhatsapp: boolean;
  };
  notifications?: {
    enabled: boolean;
    message: string;
    channels: {
      smart: boolean;
      sms: boolean;
      email: boolean;
    };
    timing: {
      reminder: number; // days before
      sameDay: string; // 'none', '1h', '2h'
    };
    confirmationType: string; // 'simple', 'cancel', 'reschedule'
    resendSmsIfNeeded: boolean;
  };
  alerts?: any;
  aiConfig?: any;
}
