import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PatientSidebar } from "@/components/PatientSidebar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Schedule from "./pages/Schedule";
import Profile from "./pages/Profile";
import PatientDashboard from "./pages/PatientDashboard";
import PatientAppointments from "./pages/PatientAppointments";
import PatientMedicalRecords from "./pages/PatientMedicalRecords";
import PatientProfile from "./pages/PatientProfile";
import VeterinaryAppointments from "./pages/VeterinaryAppointments";
import AnimalHealthRecords from "./pages/AnimalHealthRecords";
import VeterinaryEmergency from "./pages/VeterinaryEmergency";
import VeterinaryKnowledge from "./pages/VeterinaryKnowledge";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { userRole } = useAuth();
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {userRole === 'patient' ? <PatientSidebar /> : <AppSidebar />}
        <main className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
            <SidebarTrigger />
          </header>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Patients />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/schedule"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Schedule />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Profile />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient-dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <PatientDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient-appointments"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <PatientAppointments />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient-records"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <PatientMedicalRecords />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient-profile"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <PatientProfile />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/veterinary-appointments"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <VeterinaryAppointments />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/animal-records"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AnimalHealthRecords />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/veterinary-emergency"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <VeterinaryEmergency />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/veterinary-knowledge"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <VeterinaryKnowledge />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
