-- Create doctors profile table
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  medical_license TEXT NOT NULL UNIQUE,
  experience_years INTEGER NOT NULL DEFAULT 0,
  consultation_fee INTEGER NOT NULL DEFAULT 0,
  languages TEXT[] NOT NULL DEFAULT '{}',
  verified BOOLEAN NOT NULL DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Doctors can view their own profile
CREATE POLICY "Doctors can view own profile"
  ON public.doctors FOR SELECT
  USING (auth.uid() = id);

-- Doctors can update their own profile
CREATE POLICY "Doctors can update own profile"
  ON public.doctors FOR UPDATE
  USING (auth.uid() = id);

-- Create patients table
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  phone TEXT NOT NULL,
  village TEXT NOT NULL,
  conditions TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  total_visits INTEGER NOT NULL DEFAULT 0,
  last_visit_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Doctors can view their own patients
CREATE POLICY "Doctors can view own patients"
  ON public.patients FOR SELECT
  USING (doctor_id = auth.uid());

-- Doctors can create patients
CREATE POLICY "Doctors can create patients"
  ON public.patients FOR INSERT
  WITH CHECK (doctor_id = auth.uid());

-- Doctors can update their own patients
CREATE POLICY "Doctors can update own patients"
  ON public.patients FOR UPDATE
  USING (doctor_id = auth.uid());

-- Doctors can delete their own patients
CREATE POLICY "Doctors can delete own patients"
  ON public.patients FOR DELETE
  USING (doctor_id = auth.uid());

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  patient_name TEXT,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'booked', 'blocked', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(doctor_id, appointment_date, start_time)
);

-- Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Doctors can view their own appointments
CREATE POLICY "Doctors can view own appointments"
  ON public.appointments FOR SELECT
  USING (doctor_id = auth.uid());

-- Doctors can create appointments
CREATE POLICY "Doctors can create appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (doctor_id = auth.uid());

-- Doctors can update their own appointments
CREATE POLICY "Doctors can update own appointments"
  ON public.appointments FOR UPDATE
  USING (doctor_id = auth.uid());

-- Doctors can delete their own appointments
CREATE POLICY "Doctors can delete own appointments"
  ON public.appointments FOR DELETE
  USING (doctor_id = auth.uid());

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new doctor registration
CREATE OR REPLACE FUNCTION public.handle_new_doctor()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.doctors (id, full_name, specialization, medical_license, experience_years, consultation_fee, languages)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New Doctor'),
    COALESCE(NEW.raw_user_meta_data->>'specialization', 'General Medicine'),
    COALESCE(NEW.raw_user_meta_data->>'medical_license', 'MH-00000-0000'),
    COALESCE((NEW.raw_user_meta_data->>'experience_years')::INTEGER, 0),
    COALESCE((NEW.raw_user_meta_data->>'consultation_fee')::INTEGER, 300),
    COALESCE(ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'languages')), ARRAY['English']::TEXT[])
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new doctor registration
CREATE TRIGGER on_auth_doctor_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_doctor();