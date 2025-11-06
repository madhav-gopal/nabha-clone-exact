import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Pill, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function PatientMedicalRecords() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchMedicalHistory();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("patient_profiles")
      .select("*")
      .eq("id", user?.id)
      .single();

    if (data) setProfile(data);
  };

  const fetchMedicalHistory = async () => {
    const { data } = await supabase
      .from("patient_appointments")
      .select(`
        *,
        doctors (full_name, specialization)
      `)
      .eq("patient_id", user?.id)
      .not("diagnosis", "is", null)
      .order("appointment_date", { ascending: false });

    if (data) setAppointments(data);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Medical Records</h1>
        <p className="text-muted-foreground">
          Your complete medical history and records
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Current Medications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.current_medications?.length > 0 ? (
              <ul className="space-y-2">
                {profile.current_medications.map((med: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Pill className="h-4 w-4 mt-1 text-muted-foreground" />
                    <span>{med}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No current medications</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Medical History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.medical_history?.length > 0 ? (
              <ul className="space-y-2">
                {profile.medical_history.map((condition: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <span>{condition}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No medical history recorded</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visit History & Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No medical records available yet
            </p>
          ) : (
            <div className="space-y-6">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border p-4 rounded-lg space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-lg">
                        {appointment.doctors?.full_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.doctors?.specialization}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(appointment.appointment_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {appointment.symptoms && (
                    <div>
                      <p className="font-medium text-sm mb-1">Symptoms:</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.symptoms}
                      </p>
                    </div>
                  )}

                  {appointment.diagnosis && (
                    <div>
                      <p className="font-medium text-sm mb-1">Diagnosis:</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.diagnosis}
                      </p>
                    </div>
                  )}

                  {appointment.prescription && (
                    <div className="bg-accent/10 p-3 rounded">
                      <p className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Pill className="h-4 w-4" />
                        Prescription:
                      </p>
                      <p className="text-sm whitespace-pre-wrap">
                        {appointment.prescription}
                      </p>
                    </div>
                  )}

                  {appointment.notes && (
                    <div>
                      <p className="font-medium text-sm mb-1">Doctor's Notes:</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
