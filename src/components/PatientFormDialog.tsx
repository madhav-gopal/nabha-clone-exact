import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

const patientFormSchema = z.object({
  full_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  age: z.coerce.number().min(1, "Age must be at least 1").max(150, "Age must be valid"),
  gender: z.string().min(1, "Please select a gender"),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must be less than 15 digits"),
  village: z.string().trim().min(2, "Village name is required").max(100, "Village name must be less than 100 characters"),
  conditions: z.string().trim().max(500, "Conditions must be less than 500 characters"),
  notes: z.string().trim().max(2000, "Notes must be less than 2000 characters").optional(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

interface PatientFormDialogProps {
  onPatientCreated: () => void;
}

export const PatientFormDialog = ({ onPatientCreated }: PatientFormDialogProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      full_name: "",
      age: 0,
      gender: "",
      phone: "",
      village: "",
      conditions: "",
      notes: "",
    },
  });

  const onSubmit = async (values: PatientFormValues) => {
    if (!user) {
      toast.error("You must be logged in to create a patient");
      return;
    }

    setIsSubmitting(true);

    try {
      const conditionsArray = values.conditions
        .split(",")
        .map(c => c.trim())
        .filter(c => c.length > 0);

      const { error } = await supabase.from("patients").insert({
        doctor_id: user.id,
        full_name: values.full_name,
        age: values.age,
        gender: values.gender,
        phone: values.phone,
        village: values.village,
        conditions: conditionsArray,
        notes: values.notes || null,
        status: "active",
        total_visits: 0,
      });

      if (error) throw error;

      toast.success("Patient record created successfully");
      form.reset();
      setOpen(false);
      onPatientCreated();
    } catch (error) {
      console.error("Error creating patient:", error);
      toast.error("Failed to create patient record");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Add New Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Patient Record</DialogTitle>
          <DialogDescription>
            Add a new patient to your database with their personal details and medical information.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter patient's full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter age" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="village"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Village/Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter village or location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="conditions"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Medical Conditions</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter conditions separated by commas (e.g., Diabetes, Hypertension)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Initial Consultation Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter initial consultation notes, symptoms, observations..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Patient"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
