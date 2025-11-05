-- Add notes field to patients table for initial consultation notes
ALTER TABLE public.patients 
ADD COLUMN notes TEXT;