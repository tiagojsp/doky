-- ============================================
-- DOKY - Sistema de Agendamento
-- Schema Completo Supabase
-- ============================================

-- Limpar tabelas existentes (CUIDADO: Remove todos os dados!)
-- DROP TABLE IF EXISTS appointments CASCADE;
-- DROP TABLE IF EXISTS clients CASCADE;
-- DROP TABLE IF EXISTS staff CASCADE;
-- DROP TABLE IF EXISTS services CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;
-- DROP TABLE IF EXISTS vouchers CASCADE;
-- DROP TABLE IF EXISTS resources CASCADE;
-- DROP TABLE IF EXISTS establishment_settings CASCADE;

-- ============================================
-- TABELA: establishment_settings
-- ============================================
CREATE TABLE IF NOT EXISTS establishment_settings (
    id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001',
    name TEXT NOT NULL DEFAULT 'Clínica Central',
    address JSONB DEFAULT '{"street":"","postalCode":"","city":"Albufeira","district":"Faro","country":"Portugal"}',
    contacts JSONB DEFAULT '{"phone":"","mobile":"","email":"geral@clinica.pt","website":"www.clinica.pt","clientAppUrl":""}',
    socials JSONB DEFAULT '{"facebook":"","instagram":""}',
    preferences JSONB DEFAULT '{"language":"pt-PT","timezone":"Europe/Lisbon"}',
    visibility JSONB DEFAULT '{"showInApp":true,"showInEmails":true,"availableOnWhatsapp":false}',
    notifications JSONB DEFAULT '{"enabled":true,"message":"Clínica Central relembra a sua marcação %dia_e_hora%.","channels":{"smart":true,"sms":false,"email":true},"timing":{"reminder":1,"sameDay":"none"},"confirmationType":"simple","resendSmsIfNeeded":false}',
    alerts JSONB DEFAULT '{}',
    ai_config JSONB DEFAULT '{}',
    business_profile JSONB DEFAULT '{"type":"Clinic","name":"Clínica Central","primaryColor":"#0f766e","secondaryColor":"#f0f9ff","language":"pt","currency":"EUR"}',
    terminology JSONB DEFAULT '{"service_label":"Serviço","service_subtitle":"Selecione o serviço","professional_label":"Profissional","professional_plural":"Profissionais","appointment_label":"Consulta","booking_action":"Confirmar Marcação","client_label":"Paciente","date_title":"Data e Hora","date_subtitle":"Quando prefere?","data_title":"Os seus dados","data_subtitle":"Para confirmarmos","nif_field":"NIF"}',
    form_config JSONB DEFAULT '{"fields":[]}',
    kiosk_config JSONB DEFAULT '{"timeoutSeconds":120,"showPromotions":false,"showQrCode":true}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: services
-- ============================================
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Geral',
    duration INTEGER NOT NULL DEFAULT 30,
    price NUMERIC(10,2) NOT NULL DEFAULT 0,
    description TEXT,
    featured BOOLEAN DEFAULT false,
    ref TEXT,
    vat NUMERIC(5,2) DEFAULT 23,
    is_online BOOLEAN DEFAULT false,
    commission JSONB DEFAULT '{"value":0,"type":"%"}',
    collaborators TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: staff
-- ============================================
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Profissional',
    email TEXT,
    mobile TEXT,
    image_url TEXT,
    gender TEXT CHECK (gender IN ('M', 'F')),
    bio TEXT,
    specialty TEXT,
    access_level TEXT DEFAULT 'user' CHECK (access_level IN ('admin', 'user')),
    color TEXT DEFAULT '#0891b2',
    "order" INTEGER DEFAULT 0,
    permissions JSONB DEFAULT '{"hasOwnAgenda":true,"visibleInApp":true,"onlineBookingEnabled":true}',
    commissions JSONB DEFAULT '{"executing":{"value":0,"type":"%"},"responsible":{"value":0,"type":"%"}}',
    schedule JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: clients
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    mobile TEXT,
    gender TEXT CHECK (gender IN ('M', 'F', 'O')),
    nif TEXT,
    cc_number TEXT,
    job_title TEXT,
    address TEXT,
    postal_code TEXT,
    city TEXT,
    country TEXT DEFAULT 'Portugal',
    alternative_mobile TEXT,
    ref TEXT,
    preferred_staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    notes TEXT,
    consent JSONB DEFAULT '{"marketing":false,"sms":false,"email":false,"photos":false}',
    loyalty JSONB DEFAULT '{"points":0,"balance":0,"visits":0}',
    age INTEGER DEFAULT 0,
    birth_date TEXT,
    last_visit_days_ago INTEGER DEFAULT 0,
    next_visit_days INTEGER,
    segment TEXT DEFAULT 'Potential' CHECK (segment IN ('Active', 'Potential', 'Lost')),
    image_url TEXT,
    avatar_color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: appointments
-- ============================================
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'cancelled', 'blocked', 'no_show', 'arrived')),
    payment_status TEXT CHECK (payment_status IN ('paid', 'unpaid', 'refunded')),
    color TEXT DEFAULT '#0891b2',
    block_reason TEXT,
    duration INTEGER,
    notes TEXT,
    coupon TEXT,
    is_recurring BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: products
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    invoice_notes TEXT,
    ref TEXT,
    barcode TEXT,
    price NUMERIC(10,2) NOT NULL DEFAULT 0,
    vat NUMERIC(5,2) DEFAULT 23,
    vat_exemption TEXT,
    commissions JSONB DEFAULT '{"executing":{"value":0,"type":"%"},"responsible":{"value":0,"type":"%"}}',
    category TEXT DEFAULT 'Geral',
    brand TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: vouchers
-- ============================================
CREATE TABLE IF NOT EXISTS vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    ref TEXT,
    price NUMERIC(10,2) NOT NULL DEFAULT 0,
    discount_percent NUMERIC(5,2),
    validity_days INTEGER,
    category TEXT DEFAULT 'Geral',
    items JSONB DEFAULT '[]',
    vat NUMERIC(5,2) DEFAULT 23,
    commissions JSONB DEFAULT '{"executing":{"value":0,"type":"%"},"responsible":{"value":0,"type":"%"}}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: resources
-- ============================================
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('room', 'equipment')),
    name TEXT NOT NULL,
    capacity INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ÍNDICES para Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_staff ON appointments(staff_id);
CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_service ON appointments(service_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_mobile ON clients(mobile);
CREATE INDEX IF NOT EXISTS idx_clients_nif ON clients(nif);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_staff_access_level ON staff(access_level);

-- ============================================
-- RLS (Row Level Security) - Acesso Público
-- ============================================
-- IMPORTANTE: Para desenvolvimento, permitir acesso público a todas tabelas
-- Em produção, adicionar políticas mais restritivas

ALTER TABLE establishment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público (para desenvolvimento/demo)
-- REMOVER EM PRODUÇÃO e implementar autenticação adequada

CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON establishment_settings FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Enable insert access for all users" ON establishment_settings FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Enable update access for all users" ON establishment_settings FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Enable delete access for all users" ON establishment_settings FOR DELETE USING (true);

CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON services FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Enable insert access for all users" ON services FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Enable update access for all users" ON services FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Enable delete access for all users" ON services FOR DELETE USING (true);

CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON staff FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Enable insert access for all users" ON staff FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Enable update access for all users" ON staff FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Enable delete access for all users" ON staff FOR DELETE USING (true);

CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON clients FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Enable insert access for all users" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Enable update access for all users" ON clients FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Enable delete access for all users" ON clients FOR DELETE USING (true);

CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON appointments FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Enable insert access for all users" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Enable update access for all users" ON appointments FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Enable delete access for all users" ON appointments FOR DELETE USING (true);

CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON products FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Enable insert access for all users" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Enable update access for all users" ON products FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Enable delete access for all users" ON products FOR DELETE USING (true);

CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON vouchers FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Enable insert access for all users" ON vouchers FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Enable update access for all users" ON vouchers FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Enable delete access for all users" ON vouchers FOR DELETE USING (true);

CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON resources FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Enable insert access for all users" ON resources FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Enable update access for all users" ON resources FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Enable delete access for all users" ON resources FOR DELETE USING (true);

-- ============================================
-- DADOS INICIAIS (Seed Data)
-- ============================================

-- Inserir establishment settings padrão (apenas se não existir)
INSERT INTO establishment_settings (id, name)
VALUES ('00000000-0000-0000-0000-000000000001', 'Clínica Central')
ON CONFLICT (id) DO NOTHING;

-- Serviço de exemplo
INSERT INTO services (id, name, category, duration, price, is_online, collaborators)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Consulta Geral', 'Consultas', 30, 50.00, true, '{}'),
    ('22222222-2222-2222-2222-222222222222', 'Consulta Especializada', 'Consultas', 60, 80.00, true, '{}')
ON CONFLICT (id) DO NOTHING;

-- Staff de exemplo
INSERT INTO staff (id, name, role, color, access_level, schedule)
VALUES
    ('33333333-3333-3333-3333-333333333333', 'Dr. João Silva', 'Médico', '#0891b2', 'admin',
     '{"mon":{"enabled":true,"start":"09:00","end":"18:00","breakStart":"13:00","breakEnd":"14:00"},
       "tue":{"enabled":true,"start":"09:00","end":"18:00","breakStart":"13:00","breakEnd":"14:00"},
       "wed":{"enabled":true,"start":"09:00","end":"18:00","breakStart":"13:00","breakEnd":"14:00"},
       "thu":{"enabled":true,"start":"09:00","end":"18:00","breakStart":"13:00","breakEnd":"14:00"},
       "fri":{"enabled":true,"start":"09:00","end":"18:00","breakStart":"13:00","breakEnd":"14:00"}}')
ON CONFLICT (id) DO NOTHING;

-- Cliente de exemplo
INSERT INTO clients (id, name, email, mobile, segment)
VALUES
    ('44444444-4444-4444-4444-444444444444', 'Maria Santos', 'maria@example.com', '912345678', 'Active')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- TRIGGERS para updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_establishment_settings_updated_at BEFORE UPDATE ON establishment_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vouchers_updated_at BEFORE UPDATE ON vouchers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FIM DO SETUP
-- ============================================
-- Schema criado com sucesso!
-- Próximos passos:
-- 1. Copie todo este SQL
-- 2. Cole no SQL Editor do Supabase
-- 3. Execute
-- 4. Verifique se todas as tabelas foram criadas
-- 5. Configure as variáveis de ambiente (.env.local) com suas credenciais
-- ============================================
