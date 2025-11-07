-- Create veterinary doctors table
CREATE TABLE public.veterinary_doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  available_slots JSONB DEFAULT '[]'::JSONB,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create animal health records table
CREATE TABLE public.animal_health_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  animal_id TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  age INTEGER,
  last_vaccination DATE,
  current_treatment TEXT,
  assigned_vet_id UUID REFERENCES public.veterinary_doctors(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vet appointments table
CREATE TABLE public.vet_appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vet_id UUID NOT NULL REFERENCES public.veterinary_doctors(id) ON DELETE CASCADE,
  animal_id UUID REFERENCES public.animal_health_records(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  diagnosis TEXT,
  treatment_plan TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.veterinary_doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animal_health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vet_appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for veterinary_doctors
CREATE POLICY "Everyone can view verified vets"
ON public.veterinary_doctors
FOR SELECT
USING (verified = true);

-- RLS Policies for animal_health_records
CREATE POLICY "Patients can view own animal records"
ON public.animal_health_records
FOR SELECT
USING (auth.uid() = patient_id);

CREATE POLICY "Patients can create own animal records"
ON public.animal_health_records
FOR INSERT
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update own animal records"
ON public.animal_health_records
FOR UPDATE
USING (auth.uid() = patient_id);

CREATE POLICY "Patients can delete own animal records"
ON public.animal_health_records
FOR DELETE
USING (auth.uid() = patient_id);

-- RLS Policies for vet_appointments
CREATE POLICY "Patients can view own vet appointments"
ON public.vet_appointments
FOR SELECT
USING (auth.uid() = patient_id);

CREATE POLICY "Patients can create own vet appointments"
ON public.vet_appointments
FOR INSERT
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update own vet appointments"
ON public.vet_appointments
FOR UPDATE
USING (auth.uid() = patient_id);

-- Create triggers for updated_at
CREATE TRIGGER update_veterinary_doctors_updated_at
BEFORE UPDATE ON public.veterinary_doctors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_animal_health_records_updated_at
BEFORE UPDATE ON public.animal_health_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vet_appointments_updated_at
BEFORE UPDATE ON public.vet_appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample veterinary doctors
INSERT INTO public.veterinary_doctors (full_name, specialization, phone, email, available_slots, verified) VALUES
('Dr. Ritu Chauhan', 'Cattle', '+91-9876543210', 'ritu.chauhan@nabhavet.com', '[{"date": "2025-11-10", "time": "10:00 AM"}, {"date": "2025-11-11", "time": "2:00 PM"}]', true),
('Dr. Manish Bedi', 'Buffalo & Goat', '+91-9876543211', 'manish.bedi@nabhavet.com', '[{"date": "2025-11-11", "time": "3:00 PM"}, {"date": "2025-11-12", "time": "11:00 AM"}]', true);