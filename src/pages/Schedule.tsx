import { useEffect, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Appointment {
  id: string;
  start_time: string;
  end_time: string;
  status: string;
  patient_name: string | null;
}

const Schedule = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (user) {
      loadSchedule();
    }
  }, [user, selectedDate]);

  const loadSchedule = async () => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    
    const { data } = await supabase
      .from("appointments")
      .select("*")
      .eq("doctor_id", user?.id)
      .eq("appointment_date", dateStr)
      .order("start_time");

    if (data) {
      setAppointments(data);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      available: "bg-green-600",
      booked: "bg-primary",
      blocked: "bg-red-600",
      completed: "bg-gray-600",
    };

    return (
      <Badge className={`${variants[status]} text-white`}>
        {status}
      </Badge>
    );
  };

  const getActionButton = (appointment: Appointment) => {
    if (appointment.status === "available") {
      return (
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Block
        </Button>
      );
    }
    if (appointment.status === "booked") {
      return (
        <Button variant="outline" size="sm">
          Reschedule
        </Button>
      );
    }
    if (appointment.status === "blocked") {
      return (
        <Button variant="outline" size="sm">
          Unblock
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Schedule Management
            </h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Manage your availability and appointments
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Block Time Slot
        </Button>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daily Schedule</CardTitle>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => changeDate(-1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-semibold text-foreground min-w-[300px] text-center">
                {formatDate(selectedDate)}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => changeDate(1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {appointments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No appointments scheduled for this day
              </p>
            ) : (
              appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-foreground min-w-[100px]">
                      {appointment.start_time}
                    </span>
                    {appointment.patient_name ? (
                      <Badge className="bg-primary text-white">
                        {appointment.patient_name}
                      </Badge>
                    ) : (
                      getStatusBadge(appointment.status)
                    )}
                  </div>
                  {getActionButton(appointment)}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Schedule;
