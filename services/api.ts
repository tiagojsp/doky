import { supabase } from '../lib/supabase';
import { Service, Staff, Client, Appointment, EstablishmentSettings, Resource, Product, Voucher } from '../types';

export const api = {
    // --- SERVICES ---
    async fetchServices(): Promise<Service[]> {
        const { data, error } = await supabase.from('services').select('*').order('name');
        if (error) {
            console.error('Error fetching services:', error);
            throw new Error(`Failed to fetch services: ${error.message}`);
        }
        if (!data) return [];
        return data.map(s => ({
            ...s,
            isOnline: s.is_online,
            // JSON fields are automatically parsed by Supabase JS client
        }));
    },

    async createService(service: Service): Promise<{ success: boolean; error?: string; data?: Service }> {
        const row: any = {
            id: service.id,
            name: service.name,
            category: service.category,
            duration: service.duration,
            price: service.price,
            description: service.description,
            featured: service.featured,
            vat: service.vat,
            is_online: service.isOnline,
            commission: service.commission,
            collaborators: service.collaborators,
            ref: service.ref || '' // Always include ref, even if empty
        };

        const { error } = await supabase.from('services').insert(row);
        if (error) {
            console.error('Error creating service:', error);

            // Provide specific error messages
            let errorMessage = 'Erro ao criar serviço.';

            if (error.code === '42703') {
                errorMessage = 'Erro de esquema: coluna inexistente na base de dados.';
            } else if (error.code === '23505') {
                errorMessage = 'Erro: serviço já existe.';
            } else if (error.message.includes('policy')) {
                errorMessage = 'Erro de permissões: contacte o administrador.';
            } else if (error.message) {
                errorMessage = `Erro: ${error.message}`;
            }

            return { success: false, error: errorMessage };
        }
        return { success: true, data: service };
    },

    async updateService(service: Service): Promise<{ success: boolean; error?: string }> {
        const row: any = {
            id: service.id,
            name: service.name,
            category: service.category,
            duration: service.duration,
            price: service.price,
            description: service.description,
            featured: service.featured,
            vat: service.vat,
            is_online: service.isOnline,
            commission: service.commission,
            collaborators: service.collaborators,
            ref: service.ref || '' // Always include ref, even if empty
        };

        const { error } = await supabase.from('services').update(row).eq('id', service.id);
        if (error) {
            console.error('Error updating service:', error);

            // Provide specific error messages based on error code
            let errorMessage = 'Erro ao guardar alteração no servidor.';

            if (error.code === '42703') {
                errorMessage = 'Erro de esquema: coluna inexistente na base de dados.';
            } else if (error.code === '23505') {
                errorMessage = 'Erro: valor duplicado.';
            } else if (error.message.includes('policy')) {
                errorMessage = 'Erro de permissões: contacte o administrador.';
            } else if (error.message.includes('network')) {
                errorMessage = 'Erro de rede: verifique a sua ligação.';
            } else if (error.message) {
                errorMessage = `Erro: ${error.message}`;
            }

            return { success: false, error: errorMessage };
        }
        return { success: true };
    },

    async deleteService(id: string): Promise<{ success: boolean; error?: string }> {
        const { error } = await supabase.from('services').delete().eq('id', id);
        if (error) {
            console.error('Error deleting service:', error);

            // Provide specific error messages
            let errorMessage = 'Erro ao eliminar serviço.';

            if (error.message.includes('policy')) {
                errorMessage = 'Erro de permissões: contacte o administrador.';
            } else if (error.message.includes('foreign key')) {
                errorMessage = 'Não é possível eliminar: existem marcações associadas a este serviço.';
            } else if (error.message) {
                errorMessage = `Erro: ${error.message}`;
            }

            return { success: false, error: errorMessage };
        }
        return { success: true };
    },

    // --- PRODUCTS ---
    async fetchProducts(): Promise<Product[]> {
        const { data, error } = await supabase.from('products').select('*').order('name');
        if (error) {
            console.error('Error fetching products:', error);
            return [];
        }
        return data.map(p => ({
            ...p,
            vatExemption: p.vat_exemption,
            invoiceNotes: p.invoice_notes
        }));
    },

    async createProduct(product: Product): Promise<Product | null> {
        const row = {
            id: product.id,
            name: product.name,
            description: product.description,
            invoice_notes: product.invoiceNotes,
            ref: product.ref,
            barcode: product.barcode,
            price: product.price,
            vat: product.vat,
            vat_exemption: product.vatExemption,
            commissions: product.commissions,
            category: product.category,
            brand: product.brand
        };
        const { error } = await supabase.from('products').insert(row);
        if (error) {
            console.error('Error creating product:', error);
            return null;
        }
        return product;
    },

    async updateProduct(product: Product): Promise<boolean> {
        const row = {
            id: product.id,
            name: product.name,
            description: product.description,
            invoice_notes: product.invoiceNotes,
            ref: product.ref,
            barcode: product.barcode,
            price: product.price,
            vat: product.vat,
            vat_exemption: product.vatExemption,
            commissions: product.commissions,
            category: product.category,
            brand: product.brand
        };
        const { error } = await supabase.from('products').update(row).eq('id', product.id);
        if (error) {
            console.error('Error updating product:', error);
            return false;
        }
        return true;
    },

    async deleteProduct(id: string): Promise<boolean> {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
            console.error('Error deleting product:', error);
            return false;
        }
        return true;
    },

    // --- VOUCHERS ---
    async fetchVouchers(): Promise<Voucher[]> {
        const { data, error } = await supabase.from('vouchers').select('*').order('name');
        if (error) {
            console.error('Error fetching vouchers:', error);
            return [];
        }
        return data.map(v => ({
            ...v,
            discountPercent: v.discount_percent,
            validityDays: v.validity_days
        }));
    },

    async createVoucher(voucher: Voucher): Promise<Voucher | null> {
        const row = {
            id: voucher.id,
            name: voucher.name,
            ref: voucher.ref,
            price: voucher.price,
            discount_percent: voucher.discountPercent,
            validity_days: voucher.validityDays,
            category: voucher.category,
            items: voucher.items, // JSON
            commissions: voucher.commissions, // JSON
            vat: voucher.vat
        };
        const { error } = await supabase.from('vouchers').insert(row);
        if (error) {
            console.error('Error creating voucher:', error);
            return null;
        }
        return voucher;
    },

    async updateVoucher(voucher: Voucher): Promise<boolean> {
        const row = {
            id: voucher.id,
            name: voucher.name,
            ref: voucher.ref,
            price: voucher.price,
            discount_percent: voucher.discountPercent,
            validity_days: voucher.validityDays,
            category: voucher.category,
            items: voucher.items,
            commissions: voucher.commissions,
            vat: voucher.vat
        };
        const { error } = await supabase.from('vouchers').update(row).eq('id', voucher.id);
        if (error) {
            console.error('Error updating voucher:', error);
            return false;
        }
        return true;
    },

    async deleteVoucher(id: string): Promise<boolean> {
        const { error } = await supabase.from('vouchers').delete().eq('id', id);
        if (error) {
            console.error('Error deleting voucher:', error);
            return false;
        }
        return true;
    },

    // --- RESOURCES ---
    async fetchResources(): Promise<Resource[]> {
        const { data, error } = await supabase.from('resources').select('*').order('name');
        if (error) {
            console.error('Error fetching resources:', error);
            return [];
        }
        return data.map(r => ({
            ...r,
            isActive: r.is_active,
            isVisible: r.is_visible
        }));
    },

    async saveResources(resources: Resource[]): Promise<boolean> {
        // Upsert all resources
        const rows = resources.map(r => ({
            id: r.id,
            type: r.type,
            name: r.name,
            capacity: r.capacity,
            is_active: r.isActive,
            is_visible: r.isVisible
        }));

        const { error } = await supabase.from('resources').upsert(rows);
        if (error) {
            console.error('Error saving resources:', error);
            return false;
        }
        return true;
    },

    async createResource(resource: Resource): Promise<Resource | null> {
        const row = {
            id: resource.id,
            type: resource.type,
            name: resource.name,
            capacity: resource.capacity,
            is_active: resource.isActive,
            is_visible: resource.isVisible
        };
        const { error } = await supabase.from('resources').insert(row);
        if (error) {
            console.error('Error creating resource:', error);
            return null;
        }
        return resource;
    },

    async deleteResource(id: string): Promise<boolean> {
        const { error } = await supabase.from('resources').delete().eq('id', id);
        if (error) {
            console.error('Error deleting resource:', error);
            return false;
        }
        return true;
    },

    // --- STAFF ---
    async fetchStaff(): Promise<Staff[]> {
        const { data, error } = await supabase.from('staff').select('*').order('name');
        if (error) {
            console.error('Error fetching staff:', error);
            throw new Error(`Failed to fetch staff: ${error.message}`);
        }
        if (!data) return [];
        return data.map(s => ({
            ...s,
            imageUrl: s.image_url,
            accessLevel: s.access_level,
            // Ensure JSON fields have defaults if null
            permissions: s.permissions || { hasOwnAgenda: true, visibleInApp: true, onlineBookingEnabled: true },
            commissions: s.commissions || { executing: { value: 0, type: '%' }, responsible: { value: 0, type: '%' } },
            schedule: s.schedule || {}
        }));
    },

    async updateStaff(staff: Staff): Promise<{ success: boolean; error?: string }> {
        const row: any = {
            id: staff.id,
            name: staff.name,
            role: staff.role,
            email: staff.email,
            mobile: staff.mobile,
            image_url: staff.imageUrl,
            bio: staff.bio,
            access_level: staff.accessLevel,
            color: staff.color,
            order: staff.order || 1,
            permissions: staff.permissions,
            commissions: staff.commissions,
            schedule: staff.schedule
        };
        // Upsert to handle both create and update
        const { error } = await supabase.from('staff').upsert(row);
        if (error) {
            console.error('Error updating staff:', error);

            // Provide specific error messages
            let errorMessage = 'Erro ao guardar alteração no colaborador.';

            if (error.code === '42703') {
                errorMessage = 'Erro de esquema: coluna inexistente na base de dados.';
            } else if (error.code === '23505') {
                errorMessage = 'Erro: email já existe.';
            } else if (error.message.includes('policy')) {
                errorMessage = 'Erro de permissões: contacte o administrador.';
            } else if (error.message) {
                errorMessage = `Erro: ${error.message}`;
            }

            return { success: false, error: errorMessage };
        }
        return { success: true };
    },

    async deleteStaff(id: string): Promise<{ success: boolean; error?: string }> {
        const { error } = await supabase.from('staff').delete().eq('id', id);
        if (error) {
            console.error('Error deleting staff:', error);

            // Provide specific error messages
            let errorMessage = 'Erro ao eliminar colaborador.';

            if (error.message.includes('policy')) {
                errorMessage = 'Erro de permissões: contacte o administrador.';
            } else if (error.message.includes('foreign key') || error.message.includes('violates')) {
                errorMessage = 'Não é possível eliminar: existem marcações ou serviços associados a este colaborador.';
            } else if (error.message) {
                errorMessage = `Erro: ${error.message}`;
            }

            return { success: false, error: errorMessage };
        }
        return { success: true };
    },

    // --- CLIENTS ---
    async fetchClients(): Promise<Client[]> {
        const { data, error } = await supabase.from('clients').select('*').order('name');
        if (error) {
            console.error('Error fetching clients:', error);
            throw new Error(`Failed to fetch clients: ${error.message}`);
        }
        if (!data) return [];
        return data.map(c => ({
            ...c,
            ccNumber: c.cc_number,
            jobTitle: c.job_title,
            postalCode: c.postal_code,
            alternativeMobile: c.alternative_mobile,
            preferredStaffId: c.preferred_staff_id,
            lastVisit: c.last_visit_days_ago,
            nextVisit: c.next_visit_days,
            imageUrl: c.image_url,
            avatarColor: c.avatar_color,
            consent: c.consent || { marketing: false, sms: false, email: false, photos: false },
            loyalty: c.loyalty || { points: 0, balance: 0, visits: 0 }
        }));
    },

    async updateClient(client: Client): Promise<boolean> {
        const row: any = {
            id: client.id,
            name: client.name,
            email: client.email,
            mobile: client.mobile,
            gender: client.gender,
            // Omit missing columns: nif, cc_number, job_title, address, postal_code, city, country
            alternative_mobile: client.alternativeMobile,
            ref: client.ref,
            preferred_staff_id: client.preferredStaffId,
            notes: client.notes,
            consent: client.consent,
            loyalty: client.loyalty,
            age: client.age,
            birth_date: client.birthDate,
            last_visit_days_ago: client.lastVisit,
            next_visit_days: client.nextVisit,
            segment: client.segment,
            image_url: client.imageUrl,
            avatar_color: client.avatarColor
        };
        const { error } = await supabase.from('clients').upsert(row);
        if (error) {
            console.error('Error updating client:', error);
            return false;
        }
        return true;
    },

    async deleteClient(id: string): Promise<boolean> {
        const { error } = await supabase.from('clients').delete().eq('id', id);
        if (error) {
            console.error('Error deleting client:', error);
            return false;
        }
        return true;
    },

    async findOrCreateClient(clientData: Partial<Client>): Promise<Client | null> {
        // Priority: NIF > Email > Mobile
        const conditions = [];

        if (clientData.nif) conditions.push(`nif.eq.${clientData.nif}`);
        if (clientData.email) conditions.push(`email.eq.${clientData.email}`);
        if (clientData.mobile) conditions.push(`mobile.eq.${clientData.mobile}`);

        if (conditions.length > 0) {
            const { data: existing, error } = await supabase.from('clients').select('*').or(conditions.join(',')).limit(1);

            if (!error && existing && existing.length > 0) {
                // Return mapped client
                const c = existing[0];
                return {
                    ...c,
                    ccNumber: c.cc_number,
                    jobTitle: c.job_title,
                    postalCode: c.postal_code,
                    alternativeMobile: c.alternative_mobile,
                    preferredStaffId: c.preferred_staff_id,
                    lastVisit: c.last_visit_days_ago,
                    nextVisit: c.next_visit_days,
                    imageUrl: c.image_url,
                    avatarColor: c.avatar_color,
                    consent: c.consent || { marketing: false, sms: false, email: false, photos: false },
                    loyalty: c.loyalty || { points: 0, balance: 0, visits: 0 }
                };
            }
        }

        // Create new client if not found
        const newId = crypto.randomUUID();
        const newClient: Client = {
            id: newId,
            name: clientData.name || 'Guest',
            email: clientData.email || '',
            mobile: clientData.mobile || '',
            nif: clientData.nif || '',
            age: 0, // default
            lastVisit: 0,
            segment: 'Potential',
            // Default other fields
            gender: 'O',
            consent: { marketing: false, sms: false, email: false, photos: false }
        };

        const row: any = {
            id: newClient.id,
            name: newClient.name,
            email: newClient.email || null,
            mobile: newClient.mobile || null,
            // nif: newClient.nif || null, // OMITTED: column missing in DB
            segment: newClient.segment,
            age: newClient.age,
            last_visit_days_ago: 0
        };

        const { data: insertedData, error: insertError } = await supabase.from('clients').insert(row).select().single();
        if (insertError) {
            console.error('Error creating guest client:', insertError.message, insertError.details, insertError.hint);
            return null;
        }

        return {
            ...newClient,
            id: insertedData.id
        };
    },

    // --- APPOINTMENTS ---
    async fetchAppointments(): Promise<Appointment[]> {
        const { data, error } = await supabase.from('appointments').select('*').order('date');
        if (error) {
            console.error('Error fetching appointments:', error);
            throw new Error(`Failed to fetch appointments: ${error.message}`);
        }
        if (!data) return [];
        return data.map(a => ({
            id: a.id,
            clientId: a.client_id,
            staffId: a.staff_id,
            serviceId: a.service_id,
            date: a.date,
            startTime: a.start_time,
            status: a.status,
            paymentStatus: a.payment_status,
            color: a.color,
            blockReason: a.block_reason,
            duration: a.duration,
            notes: a.notes,
            coupon: a.coupon,
            isRecurring: a.is_recurring
        })) as Appointment[];
    },

    async createAppointment(appointment: Appointment): Promise<Appointment | null> {
        const row: any = {
            id: appointment.id,
            client_id: appointment.clientId,
            staff_id: appointment.staffId,
            service_id: appointment.serviceId,
            date: appointment.date,
            start_time: appointment.startTime,
            status: appointment.status,
            payment_status: appointment.paymentStatus,
            color: appointment.color,
            block_reason: appointment.blockReason,
            // duration: appointment.duration, // OMITTED: column missing in DB
            notes: appointment.notes,
            coupon: appointment.coupon,
            is_recurring: appointment.isRecurring
        };
        const { error } = await supabase.from('appointments').insert(row);
        if (error) {
            console.error('Error creating appointment:', error);
            alert('Falha ao criar marcação: ' + (error.message || 'Erro desconhecido'));
            return null;
        }
        return appointment;
    },

    async updateAppointment(appointment: Appointment): Promise<boolean> {
        const row = {
            id: appointment.id,
            client_id: appointment.clientId,
            staff_id: appointment.staffId,
            service_id: appointment.serviceId,
            date: appointment.date,
            start_time: appointment.startTime,
            status: appointment.status,
            payment_status: appointment.paymentStatus,
            color: appointment.color,
            block_reason: appointment.blockReason,
            duration: appointment.duration,
            notes: appointment.notes,
            coupon: appointment.coupon,
            is_recurring: appointment.isRecurring
        };
        const { error } = await supabase.from('appointments').update(row).eq('id', appointment.id);
        if (error) {
            console.error('Error updating appointment:', error);
            alert('Falha ao atualizar marcação: ' + (error.message || 'Erro desconhecido'));
            return false;
        }
        return true;
    },

    async deleteAppointment(id: string): Promise<boolean> {
        const { error } = await supabase.from('appointments').delete().eq('id', id);
        if (error) {
            console.error('Error deleting appointment:', error);
            return false;
        }
        return true;
    },

    // --- ESTABLISHMENT SETTINGS ---
    async fetchEstablishmentSettings(): Promise<EstablishmentSettings> {
        // Enforce the specific ID for this test context
        const ESTABLISHMENT_ID = '00000000-0000-0000-0000-000000000001';

        const { data, error } = await supabase
            .from('establishment_settings')
            .select('*')
            .eq('id', ESTABLISHMENT_ID)
            .single();

        if (error || !data) {
            // Return fallback defaults if DB is empty or fails
            return {
                name: 'Clínica Central',
                address: { street: '', postalCode: '', city: 'Albufeira', district: 'Faro', country: 'Portugal' },
                contacts: { phone: '', mobile: '', email: 'geral@clinica.pt', website: 'www.clinica.pt', clientAppUrl: '' },
                socials: { facebook: '', instagram: '' },
                preferences: { language: 'pt-PT', timezone: 'Europe/Lisbon' },
                visibility: { showInApp: true, showInEmails: true, availableOnWhatsapp: false },
                notifications: {
                    enabled: true,
                    message: 'Clínica Central relembra a sua marcação %dia_e_hora%. Caso não possa comparecer pedimos que avise a recepção ou envie mensagem indicando a sua ausência. Obrigado.',
                    channels: { smart: true, sms: false, email: true },
                    timing: { reminder: 1, sameDay: 'none' },
                    confirmationType: 'simple',
                    resendSmsIfNeeded: false
                },
                alerts: {},
                aiConfig: {},
                // Defaults for new fields
                businessProfile: {
                    type: 'Clinic',
                    name: 'Clínica Central',
                    primaryColor: '#0f766e',
                    secondaryColor: '#f0f9ff',
                    language: 'pt',
                    currency: 'EUR'
                },
                terminology: {
                    service_label: 'Serviço',
                    service_subtitle: 'Selecione o serviço',
                    professional_label: 'Profissional',
                    professional_plural: 'Profissionais',
                    appointment_label: 'Consulta',
                    booking_action: 'Confirmar Marcação',
                    client_label: 'Paciente',
                    date_title: 'Data e Hora',
                    date_subtitle: 'Quando prefere?',
                    data_title: 'Os seus dados',
                    data_subtitle: 'Para confirmarmos',
                    nif_field: 'NIF'
                },
                formConfig: { fields: [] },
                kioskConfig: { timeoutSeconds: 120, showPromotions: false, showQrCode: true }
            };
        }

        return {
            ...data,
            businessProfile: data.business_profile,
            terminology: data.terminology,
            formConfig: data.form_config,
            kioskConfig: data.kiosk_config,
            aiConfig: data.ai_config
        } as EstablishmentSettings;
    },

    async updateEstablishmentSettings(settings: EstablishmentSettings): Promise<boolean> {
        // constant ID
        const ESTABLISHMENT_ID = '00000000-0000-0000-0000-000000000001';

        const row = {
            id: ESTABLISHMENT_ID, // Explicitly set ID
            name: settings.name,
            address: settings.address,
            contacts: settings.contacts,
            socials: settings.socials,
            preferences: settings.preferences,
            visibility: settings.visibility,
            notifications: settings.notifications,
            alerts: settings.alerts,
            ai_config: settings.aiConfig,
            business_profile: settings.businessProfile,
            terminology: settings.terminology,
            form_config: settings.formConfig,
            kiosk_config: settings.kioskConfig
        };

        const { error } = await supabase.from('establishment_settings').upsert(row);

        if (error) {
            console.error('Error updating settings:', error);
            alert('Falha ao atualizar definições: ' + (error.message || 'Erro desconhecido'));
            return false;
        }
        return true;
    }
};
