
-- ============================================
-- SQL MIGRATION: Restore Missing Columns
-- Run this in your Supabase SQL Editor
-- ============================================

-- Fix Clients table
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS nif TEXT,
ADD COLUMN IF NOT EXISTS cc_number TEXT,
ADD COLUMN IF NOT EXISTS job_title TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Portugal';

-- Fix Appointments table
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS duration INTEGER;

-- Fix Staff table
ALTER TABLE staff
ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('M', 'F')),
ADD COLUMN IF NOT EXISTS specialty TEXT,
ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

-- Create missing index if needed
CREATE INDEX IF NOT EXISTS idx_clients_nif ON clients(nif);

-- ============================================
-- SUCCESS: Schema is now fully aligned.
-- ============================================
