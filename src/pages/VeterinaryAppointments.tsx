import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Calendar, Clock, Stethoscope } from "lucide-react";

interface VeterinaryDoctor {
  id: string;
  full_name: string;
  specialization: string;
  phone: string;
  available_slots: any;
}

interface Animal {
  id: string;
  animal_id: string;
  species: string;
}

interface VetAppointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string;
  veterinary_doctors: {
    full_name: string;
    specialization: string;
  };
  animal_health_records: {
    animal_id: string;
    species: string;
  };
}

export default function VeterinaryAppointments() {
  const { user } = useAuth();
  const [vets, setVets] = useState<VeterinaryDoctor[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [appointments, setAppointments] = useState<VetAppointment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    vet_id: "",
    animal_id: "",
    appointment_date: "",
    appointment_time: "",
    notes: "",
  });

  useEffect(() => {
    if (user) {
      fetchVets();
      fetchAnimals();
      fetchAppointments();
    }
  }, [user]);

  const fetchVets = async () => {
    const { data, error } = await supabase
      .from("veterinary_doctors")
      .select("*")
      .eq("verified", true);

    if (error) {
      toast.error("Failed to load veterinary doctors");
    } else {
      setVets(data || []);
    }
  };

  const fetchAnimals = async () => {
    const { data, error } = await supabase
      .from("animal_health_records")
      .select("id, animal_id, species")
      .eq("patient_id", user?.id);

    if (error) {
      toast.error("Failed to load animals");
    } else {
      setAnimals(data || []);
    }
  };

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from("vet_appointments")
      .select(`
        *,
        veterinary_doctors(full_name, specialization),
        animal_health_records(animal_id, species)
      `)
      .eq("patient_id", user?.id)
      .order("appointment_date", { ascending: false });

    if (error) {
      toast.error("Failed to load appointments");
    } else {
      setAppointments(data || []);
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.vet_id || !formData.animal_id || !formData.appointment_date || !formData.appointment_time) {
      toast.error("Please fill all required fields");
      return;
    }

    const { error } = await supabase.from("vet_appointments").insert({
      patient_id: user?.id,
      vet_id: formData.vet_id,
      animal_id: formData.animal_id,
      appointment_date: formData.appointment_date,
      appointment_time: formData.appointment_time,
      notes: formData.notes,
    });

    if (error) {
      toast.error("Failed to book appointment");
    } else {
      toast.success("Appointment booked successfully");
      setIsDialogOpen(false);
      setFormData({ vet_id: "", animal_id: "", appointment_date: "", appointment_time: "", notes: "" });
      fetchAppointments();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Veterinary Appointments 🐄</h1>
          <p className="text-muted-foreground">Book and manage vet appointments for your animals</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Book Appointment</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Book Vet Appointment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div>
                <Label htmlFor="vet">Select Veterinarian</Label>
                <Select value={formData.vet_id} onValueChange={(value) => setFormData({ ...formData, vet_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a vet" />
                  </SelectTrigger>
                  <SelectContent>
                    {vets.map((vet) => (
                      <SelectItem key={vet.id} value={vet.id}>
                        {vet.full_name} - {vet.specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="animal">Select Animal</Label>
                <Select value={formData.animal_id} onValueChange={(value) => setFormData({ ...formData, animal_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an animal" />
                  </SelectTrigger>
                  <SelectContent>
                    {animals.map((animal) => (
                      <SelectItem key={animal.id} value={animal.id}>
                        {animal.animal_id} - {animal.species}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date">Appointment Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.appointment_date}
                  onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="time">Appointment Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.appointment_time}
                  onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes (e.g., symptoms)</Label>
                <Textarea
                  id="notes"
                  placeholder="Cow has fever, not eating properly..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full">Book Appointment</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {vets.map((vet) => (
          <Card key={vet.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                {vet.full_name}
              </CardTitle>
              <CardDescription>{vet.specialization}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">📞 {vet.phone}</p>
              <div className="space-y-1">
                <p className="text-sm font-medium">Available Slots:</p>
                {vet.available_slots?.slice(0, 2).map((slot, idx) => (
                  <p key={idx} className="text-sm text-muted-foreground">
                    • {slot.date} at {slot.time}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Your Appointments</h2>
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No appointments yet. Book your first vet appointment!
              </CardContent>
            </Card>
          ) : (
            appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4" />
                        <span className="font-semibold">{appointment.veterinary_doctors?.full_name}</span>
                        <span className="text-muted-foreground">- {appointment.veterinary_doctors?.specialization}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(appointment.appointment_date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {appointment.appointment_time}
                        </span>
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">Animal:</span> {appointment.animal_health_records?.animal_id} ({appointment.animal_health_records?.species})
                      </p>
                      {appointment.notes && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Notes:</span> {appointment.notes}
                        </p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
