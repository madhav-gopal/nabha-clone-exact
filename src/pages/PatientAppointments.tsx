import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function PatientAppointments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAppointments();
      fetchDoctors();
    }
  }, [user]);

  const fetchAppointments = async () => {
    const { data } = await supabase
      .from("patient_appointments")
      .select(`
        *,
        doctors (full_name, specialization, consultation_fee)
      `)
      .eq("patient_id", user?.id)
      .order("appointment_date", { ascending: true });

    if (data) setAppointments(data);
  };

  const fetchDoctors = async () => {
    const { data } = await supabase
      .from("doctors")
      .select("*")
      .eq("verified", true);

    if (data) setDoctors(data);
  };

  const handleBookAppointment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const { error } = await supabase.from("patient_appointments").insert({
        patient_id: user?.id,
        doctor_id: formData.get("doctor_id") as string,
        appointment_date: formData.get("date") as string,
        start_time: formData.get("time") as string,
        end_time: new Date(
          new Date(`2000-01-01 ${formData.get("time")}`).getTime() + 30 * 60000
        ).toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
        symptoms: formData.get("symptoms") as string,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Appointment booked successfully!",
      });

      setIsDialogOpen(false);
      fetchAppointments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.appointment_date) >= new Date() && apt.status !== 'cancelled'
  );

  const pastAppointments = appointments.filter(
    (apt) => new Date(apt.appointment_date) < new Date() || apt.status === 'completed'
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground">
            Manage your doctor appointments
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Book New Appointment</DialogTitle>
              <DialogDescription>
                Fill in the details to schedule your appointment
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="doctor_id">Select Doctor</Label>
                <select
                  id="doctor_id"
                  name="doctor_id"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.full_name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Appointment Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Appointment Time</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms / Reason</Label>
                <Textarea
                  id="symptoms"
                  name="symptoms"
                  placeholder="Describe your symptoms or reason for visit"
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">
                Book Appointment
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No upcoming appointments
              </p>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-start justify-between border p-4 rounded-lg"
                  >
                    <div className="space-y-2">
                      <p className="font-semibold text-lg">
                        {appointment.doctors?.full_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.doctors?.specialization}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(appointment.appointment_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {appointment.start_time}
                        </div>
                      </div>
                      {appointment.symptoms && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Reason:</span> {appointment.symptoms}
                        </p>
                      )}
                    </div>
                    <div
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        appointment.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {appointment.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Past Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {pastAppointments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No past appointments
              </p>
            ) : (
              <div className="space-y-4">
                {pastAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-start justify-between border p-4 rounded-lg opacity-75"
                  >
                    <div className="space-y-2">
                      <p className="font-semibold">
                        {appointment.doctors?.full_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.doctors?.specialization}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(appointment.appointment_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {appointment.start_time}
                        </div>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800">
                      {appointment.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
