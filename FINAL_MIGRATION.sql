-- ============================================
-- FINAL MIGRATION: Fix Services Table
-- Run this in your Supabase SQL Editor
-- ============================================

-- Add missing 'ref' column to services
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS ref TEXT;

-- Verify and Success
-- ============================================
-- SUCCESS: Services table updated.
-- ============================================
