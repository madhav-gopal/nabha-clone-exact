export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      animal_health_records: {
        Row: {
          age: number | null
          animal_id: string
          assigned_vet_id: string | null
          breed: string | null
          created_at: string
          current_treatment: string | null
          id: string
          last_vaccination: string | null
          notes: string | null
          patient_id: string
          species: string
          updated_at: string
        }
        Insert: {
          age?: number | null
          animal_id: string
          assigned_vet_id?: string | null
          breed?: string | null
          created_at?: string
          current_treatment?: string | null
          id?: string
          last_vaccination?: string | null
          notes?: string | null
          patient_id: string
          species: string
          updated_at?: string
        }
        Update: {
          age?: number | null
          animal_id?: string
          assigned_vet_id?: string | null
          breed?: string | null
          created_at?: string
          current_treatment?: string | null
          id?: string
          last_vaccination?: string | null
          notes?: string | null
          patient_id?: string
          species?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "animal_health_records_assigned_vet_id_fkey"
            columns: ["assigned_vet_id"]
            isOneToOne: false
            referencedRelation: "veterinary_doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          created_at: string
          doctor_id: string
          end_time: string
          id: string
          notes: string | null
          patient_id: string | null
          patient_name: string | null
          start_time: string
          status: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          created_at?: string
          doctor_id: string
          end_time: string
          id?: string
          notes?: string | null
          patient_id?: string | null
          patient_name?: string | null
          start_time: string
          status?: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          created_at?: string
          doctor_id?: string
          end_time?: string
          id?: string
          notes?: string | null
          patient_id?: string | null
          patient_name?: string | null
          start_time?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          avatar_url: string | null
          consultation_fee: number
          created_at: string
          experience_years: number
          full_name: string
          id: string
          languages: string[]
          medical_license: string
          specialization: string
          updated_at: string
          verified: boolean
        }
        Insert: {
          avatar_url?: string | null
          consultation_fee?: number
          created_at?: string
          experience_years?: number
          full_name: string
          id: string
          languages?: string[]
          medical_license: string
          specialization: string
          updated_at?: string
          verified?: boolean
        }
        Update: {
          avatar_url?: string | null
          consultation_fee?: number
          created_at?: string
          experience_years?: number
          full_name?: string
          id?: string
          languages?: string[]
          medical_license?: string
          specialization?: string
          updated_at?: string
          verified?: boolean
        }
        Relationships: []
      }
      patient_appointments: {
        Row: {
          appointment_date: string
          created_at: string
          diagnosis: string | null
          doctor_id: string
          end_time: string
          id: string
          notes: string | null
          patient_id: string
          prescription: string | null
          start_time: string
          status: string
          symptoms: string | null
          updated_at: string
        }
        Insert: {
          appointment_date: string
          created_at?: string
          diagnosis?: string | null
          doctor_id: string
          end_time: string
          id?: string
          notes?: string | null
          patient_id: string
          prescription?: string | null
          start_time: string
          status?: string
          symptoms?: string | null
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          created_at?: string
          diagnosis?: string | null
          doctor_id?: string
          end_time?: string
          id?: string
          notes?: string | null
          patient_id?: string
          prescription?: string | null
          start_time?: string
          status?: string
          symptoms?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_profiles: {
        Row: {
          address: string | null
          age: number
          allergies: string[] | null
          avatar_url: string | null
          blood_group: string | null
          created_at: string
          current_medications: string[] | null
          emergency_contact: string | null
          emergency_contact_phone: string | null
          full_name: string
          gender: string
          id: string
          medical_history: string[] | null
          phone: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          age: number
          allergies?: string[] | null
          avatar_url?: string | null
          blood_group?: string | null
          created_at?: string
          current_medications?: string[] | null
          emergency_contact?: string | null
          emergency_contact_phone?: string | null
          full_name: string
          gender: string
          id: string
          medical_history?: string[] | null
          phone: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          age?: number
          allergies?: string[] | null
          avatar_url?: string | null
          blood_group?: string | null
          created_at?: string
          current_medications?: string[] | null
          emergency_contact?: string | null
          emergency_contact_phone?: string | null
          full_name?: string
          gender?: string
          id?: string
          medical_history?: string[] | null
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      patients: {
        Row: {
          age: number
          conditions: string[]
          created_at: string
          doctor_id: string
          full_name: string
          gender: string
          id: string
          last_visit_date: string | null
          notes: string | null
          phone: string
          status: string
          total_visits: number
          updated_at: string
          village: string
        }
        Insert: {
          age: number
          conditions?: string[]
          created_at?: string
          doctor_id: string
          full_name: string
          gender: string
          id?: string
          last_visit_date?: string | null
          notes?: string | null
          phone: string
          status?: string
          total_visits?: number
          updated_at?: string
          village: string
        }
        Update: {
          age?: number
          conditions?: string[]
          created_at?: string
          doctor_id?: string
          full_name?: string
          gender?: string
          id?: string
          last_visit_date?: string | null
          notes?: string | null
          phone?: string
          status?: string
          total_visits?: number
          updated_at?: string
          village?: string
        }
        Relationships: [
          {
            foreignKeyName: "patients_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vet_appointments: {
        Row: {
          animal_id: string | null
          appointment_date: string
          appointment_time: string
          created_at: string
          diagnosis: string | null
          id: string
          notes: string | null
          patient_id: string
          status: string
          treatment_plan: string | null
          updated_at: string
          vet_id: string
        }
        Insert: {
          animal_id?: string | null
          appointment_date: string
          appointment_time: string
          created_at?: string
          diagnosis?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          status?: string
          treatment_plan?: string | null
          updated_at?: string
          vet_id: string
        }
        Update: {
          animal_id?: string | null
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          diagnosis?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          status?: string
          treatment_plan?: string | null
          updated_at?: string
          vet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vet_appointments_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animal_health_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vet_appointments_vet_id_fkey"
            columns: ["vet_id"]
            isOneToOne: false
            referencedRelation: "veterinary_doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      veterinary_doctors: {
        Row: {
          available_slots: Json | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone: string | null
          specialization: string
          updated_at: string
          verified: boolean
        }
        Insert: {
          available_slots?: Json | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          phone?: string | null
          specialization: string
          updated_at?: string
          verified?: boolean
        }
        Update: {
          available_slots?: Json | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          specialization?: string
          updated_at?: string
          verified?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "doctor" | "patient"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["doctor", "patient"],
    },
  },
} as const
