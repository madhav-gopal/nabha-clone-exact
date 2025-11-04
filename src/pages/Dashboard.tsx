import { useEffect, useState } from "react";
import { Calendar, Users, FileText, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completed: 0,
    pending: 0,
    totalPatients: 0,
  });
  const [doctorName, setDoctorName] = useState("Doctor");

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    const today = new Date().toISOString().split('T')[0];

    // Get doctor info
    const { data: doctor } = await supabase
      .from("doctors")
      .select("full_name")
      .eq("id", user?.id)
      .single();

    if (doctor) {
      setDoctorName(doctor.full_name.split(' ')[doctor.full_name.split(' ').length - 1]);
    }

    // Get today's appointments
    const { data: appointments } = await supabase
      .from("appointments")
      .select("*")
      .eq("doctor_id", user?.id)
      .eq("appointment_date", today);

    const totalAppointments = appointments?.filter(a => a.status === 'booked').length || 0;
    const completed = appointments?.filter(a => a.status === 'completed').length || 0;

    // Get total patients
    const { count: patientsCount } = await supabase
      .from("patients")
      .select("*", { count: 'exact', head: true })
      .eq("doctor_id", user?.id);

    setStats({
      totalAppointments,
      completed,
      pending: totalAppointments - completed,
      totalPatients: patientsCount || 0,
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getFormattedDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      day: 'numeric',
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {getGreeting()}, Dr. {doctorName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Today is {getFormattedDate()}
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/schedule")} variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            My Schedule
          </Button>
          <Button onClick={() => navigate("/patients")} variant="outline">
            <Users className="w-4 h-4 mr-2" />
            Patient Database
          </Button>
          <Button onClick={() => navigate("/profile")} variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Profile
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground mt-1">Today's schedule</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-green-600"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.completed}</div>
            <p className="text-xs text-muted-foreground mt-1">Consultations done</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting consultation</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Duration
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">12m</div>
            <p className="text-xs text-muted-foreground mt-1">Per consultation</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
