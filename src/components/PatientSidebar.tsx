import { Calendar, FileText, Home, User, Stethoscope, AlertCircle, BookOpen, PawPrint } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Dashboard",
    url: "/patient-dashboard",
    icon: Home,
  },
  {
    title: "Appointments",
    url: "/patient-appointments",
    icon: Calendar,
  },
  {
    title: "Medical Records",
    url: "/patient-records",
    icon: FileText,
  },
  {
    title: "Profile",
    url: "/patient-profile",
    icon: User,
  },
];

const veterinaryItems = [
  {
    title: "Vet Appointments",
    url: "/veterinary-appointments",
    icon: Stethoscope,
  },
  {
    title: "Animal Records",
    url: "/animal-records",
    icon: PawPrint,
  },
  {
    title: "Emergency Help",
    url: "/veterinary-emergency",
    icon: AlertCircle,
  },
  {
    title: "Knowledge Corner",
    url: "/veterinary-knowledge",
    icon: BookOpen,
  },
];

export function PatientSidebar() {
  const { open } = useSidebar();
  const { signOut } = useAuth();

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Patient Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive ? "bg-accent text-accent-foreground" : ""
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Veterinary Services 🐄</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {veterinaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive ? "bg-accent text-accent-foreground" : ""
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          <Button onClick={signOut} variant="outline" className="w-full">
            Sign Out
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
