import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Edit, Trash2 } from "lucide-react";

interface AnimalRecord {
  id: string;
  animal_id: string;
  species: string;
  breed: string;
  age: number;
  last_vaccination: string;
  current_treatment: string;
  notes: string;
}

export default function AnimalHealthRecords() {
  const { user } = useAuth();
  const [animals, setAnimals] = useState<AnimalRecord[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<AnimalRecord | null>(null);
  const [formData, setFormData] = useState({
    animal_id: "",
    species: "",
    breed: "",
    age: 0,
    last_vaccination: "",
    current_treatment: "",
    notes: "",
  });

  useEffect(() => {
    if (user) {
      fetchAnimals();
    }
  }, [user]);

  const fetchAnimals = async () => {
    const { data, error } = await supabase
      .from("animal_health_records")
      .select("*")
      .eq("patient_id", user?.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load animal records");
    } else {
      setAnimals(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.animal_id || !formData.species) {
      toast.error("Please fill required fields");
      return;
    }

    if (editingAnimal) {
      const { error } = await supabase
        .from("animal_health_records")
        .update(formData)
        .eq("id", editingAnimal.id);

      if (error) {
        toast.error("Failed to update animal record");
      } else {
        toast.success("Animal record updated successfully");
      }
    } else {
      const { error } = await supabase.from("animal_health_records").insert({
        ...formData,
        patient_id: user?.id,
      });

      if (error) {
        toast.error("Failed to add animal record");
      } else {
        toast.success("Animal record added successfully");
      }
    }

    setIsDialogOpen(false);
    setEditingAnimal(null);
    setFormData({ animal_id: "", species: "", breed: "", age: 0, last_vaccination: "", current_treatment: "", notes: "" });
    fetchAnimals();
  };

  const handleEdit = (animal: AnimalRecord) => {
    setEditingAnimal(animal);
    setFormData({
      animal_id: animal.animal_id,
      species: animal.species,
      breed: animal.breed || "",
      age: animal.age || 0,
      last_vaccination: animal.last_vaccination || "",
      current_treatment: animal.current_treatment || "",
      notes: animal.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this animal record?")) return;

    const { error } = await supabase
      .from("animal_health_records")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete animal record");
    } else {
      toast.success("Animal record deleted successfully");
      fetchAnimals();
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingAnimal(null);
    setFormData({ animal_id: "", species: "", breed: "", age: 0, last_vaccination: "", current_treatment: "", notes: "" });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Animal Health Records 🐮</h1>
          <p className="text-muted-foreground">Manage health records for your animals</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>Add Animal</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingAnimal ? "Edit Animal" : "Add New Animal"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="animal_id">Animal ID *</Label>
                <Input
                  id="animal_id"
                  placeholder="e.g., NBH-COW-001"
                  value={formData.animal_id}
                  onChange={(e) => setFormData({ ...formData, animal_id: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="species">Species *</Label>
                <Input
                  id="species"
                  placeholder="e.g., Cow, Buffalo, Goat"
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="breed">Breed</Label>
                <Input
                  id="breed"
                  placeholder="e.g., Holstein, Murrah"
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="age">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div>
                <Label htmlFor="last_vaccination">Last Vaccination Date</Label>
                <Input
                  id="last_vaccination"
                  type="date"
                  value={formData.last_vaccination}
                  onChange={(e) => setFormData({ ...formData, last_vaccination: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="current_treatment">Current Treatment</Label>
                <Input
                  id="current_treatment"
                  placeholder="e.g., Antibiotic course"
                  value={formData.current_treatment}
                  onChange={(e) => setFormData({ ...formData, current_treatment: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full">
                {editingAnimal ? "Update Animal" : "Add Animal"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Animals</CardTitle>
        </CardHeader>
        <CardContent>
          {animals.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No animal records yet. Add your first animal to get started!
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Animal ID</TableHead>
                  <TableHead>Species</TableHead>
                  <TableHead>Breed</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Last Vaccination</TableHead>
                  <TableHead>Current Treatment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {animals.map((animal) => (
                  <TableRow key={animal.id}>
                    <TableCell className="font-medium">{animal.animal_id}</TableCell>
                    <TableCell>{animal.species}</TableCell>
                    <TableCell>{animal.breed || "—"}</TableCell>
                    <TableCell>{animal.age || "—"}</TableCell>
                    <TableCell>
                      {animal.last_vaccination
                        ? new Date(animal.last_vaccination).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>{animal.current_treatment || "—"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(animal)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(animal.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
