-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('doctor', 'patient');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create patient_profiles table for patient users
CREATE TABLE public.patient_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  phone TEXT NOT NULL,
  address TEXT,
  blood_group TEXT,
  emergency_contact TEXT,
  emergency_contact_phone TEXT,
  medical_history TEXT[] DEFAULT '{}',
  allergies TEXT[] DEFAULT '{}',
  current_medications TEXT[] DEFAULT '{}',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on patient_profiles
ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for patient_profiles
CREATE POLICY "Patients can view own profile"
ON public.patient_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Patients can update own profile"
ON public.patient_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Doctors can view all patient profiles"
ON public.patient_profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'doctor'));

-- Create patient_appointments table (separate from doctor's appointments table)
CREATE TABLE public.patient_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patient_profiles(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  symptoms TEXT,
  diagnosis TEXT,
  prescription TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on patient_appointments
ALTER TABLE public.patient_appointments ENABLE ROW LEVEL SECURITY;

-- RLS policies for patient_appointments
CREATE POLICY "Patients can view own appointments"
ON public.patient_appointments
FOR SELECT
TO authenticated
USING (patient_id = auth.uid());

CREATE POLICY "Patients can create appointments"
ON public.patient_appointments
FOR INSERT
TO authenticated
WITH CHECK (patient_id = auth.uid() AND public.has_role(auth.uid(), 'patient'));

CREATE POLICY "Patients can update own appointments"
ON public.patient_appointments
FOR UPDATE
TO authenticated
USING (patient_id = auth.uid());

CREATE POLICY "Doctors can view their appointments"
ON public.patient_appointments
FOR SELECT
TO authenticated
USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can update their appointments"
ON public.patient_appointments
FOR UPDATE
TO authenticated
USING (doctor_id = auth.uid() AND public.has_role(auth.uid(), 'doctor'));

-- Trigger for updated_at on patient_profiles
CREATE TRIGGER update_patient_profiles_updated_at
BEFORE UPDATE ON public.patient_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on patient_appointments
CREATE TRIGGER update_patient_appointments_updated_at
BEFORE UPDATE ON public.patient_appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new patient user
CREATE OR REPLACE FUNCTION public.handle_new_patient()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only create patient profile if user registered as patient
  IF NEW.raw_user_meta_data->>'role' = 'patient' THEN
    INSERT INTO public.patient_profiles (
      id, 
      full_name, 
      age, 
      gender, 
      phone,
      address,
      blood_group
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'New Patient'),
      COALESCE((NEW.raw_user_meta_data->>'age')::INTEGER, 0),
      COALESCE(NEW.raw_user_meta_data->>'gender', 'Other'),
      COALESCE(NEW.raw_user_meta_data->>'phone', ''),
      COALESCE(NEW.raw_user_meta_data->>'address', ''),
      COALESCE(NEW.raw_user_meta_data->>'blood_group', '')
    );
    
    -- Add patient role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'patient');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger for new patient users
CREATE TRIGGER on_auth_patient_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_patient();

-- Update the existing doctor trigger to also add role
CREATE OR REPLACE FUNCTION public.handle_new_doctor()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only create doctor profile if user registered as doctor
  IF NEW.raw_user_meta_data->>'role' = 'doctor' THEN
    INSERT INTO public.doctors (
      id, 
      full_name, 
      specialization, 
      medical_license, 
      experience_years, 
      consultation_fee, 
      languages
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'New Doctor'),
      COALESCE(NEW.raw_user_meta_data->>'specialization', 'General Medicine'),
      COALESCE(NEW.raw_user_meta_data->>'medical_license', 'MH-00000-0000'),
      COALESCE((NEW.raw_user_meta_data->>'experience_years')::INTEGER, 0),
      COALESCE((NEW.raw_user_meta_data->>'consultation_fee')::INTEGER, 300),
      COALESCE(ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'languages')), ARRAY['English']::TEXT[])
    );
    
    -- Add doctor role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'doctor');
  END IF;
  
  RETURN NEW;
END;
$$;