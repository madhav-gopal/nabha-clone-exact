import { useEffect, useState } from "react";
import { Search, Filter, Users, FileText, Calendar, Eye, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PatientFormDialog } from "@/components/PatientFormDialog";

interface Patient {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  phone: string;
  village: string;
  conditions: string[];
  status: string;
  total_visits: number;
  last_visit_date: string | null;
}

const Patients = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    followUp: 0,
  });

  useEffect(() => {
    if (user) {
      loadPatients();
    }
  }, [user]);

  const loadPatients = async () => {
    const { data } = await supabase
      .from("patients")
      .select("*")
      .eq("doctor_id", user?.id)
      .order("last_visit_date", { ascending: false });

    if (data) {
      setPatients(data);
      setStats({
        total: data.length,
        active: data.filter(p => p.status === 'active').length,
        followUp: data.filter(p => p.conditions.includes('Diabetes') || p.conditions.includes('Hypertension')).length,
      });
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.conditions.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search patients by name, village, or medical condition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <PatientFormDialog onPatientCreated={loadPatients} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Patients
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">In your care</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Cases
            </CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.active}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently active</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Require Follow-up
            </CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.followUp}</div>
            <p className="text-xs text-muted-foreground mt-1">Need attention</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Patient Records ({filteredPatients.length})
        </h2>
        <div className="space-y-4">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16 bg-gradient-to-br from-accent to-primary">
                    <AvatarFallback className="text-white font-bold">
                      {getInitials(patient.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg text-foreground">
                          {patient.full_name}
                        </h3>
                        <Badge className="bg-green-600 text-white">
                          {patient.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Age: {patient.age} years</p>
                        <p>Gender: {patient.gender}</p>
                        <p>📍 {patient.village} Rural</p>
                        <p>📞 {patient.phone}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm">
                        <p className="text-muted-foreground">
                          Last Visit: {patient.last_visit_date || 'N/A'}
                        </p>
                        <p className="text-muted-foreground">
                          Total Visits: {patient.total_visits}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">
                          Conditions:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {patient.conditions.map((condition, idx) => (
                            <Badge key={idx} variant="secondary">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Record
                    </Button>
                    <Button size="sm">
                      <Video className="w-4 h-4 mr-2" />
                      Start Consultation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Patients;
