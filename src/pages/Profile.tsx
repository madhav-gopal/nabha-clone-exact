import { useEffect, useState } from "react";
import { Camera, Shield, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface DoctorProfile {
  full_name: string;
  specialization: string;
  medical_license: string;
  experience_years: number;
  consultation_fee: number;
  languages: string[];
  verified: boolean;
  avatar_url: string | null;
}

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<DoctorProfile | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    const { data } = await supabase
      .from("doctors")
      .select("*")
      .eq("id", user?.id)
      .single();

    if (data) {
      setProfile(data);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <User className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Doctor Profile</h1>
            <p className="text-muted-foreground">
              Manage your professional profile and settings
            </p>
          </div>
        </div>
        <Button onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </Button>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="w-32 h-32 bg-gradient-to-br from-accent to-primary">
              <AvatarFallback className="text-4xl text-white font-bold">
                {getInitials(profile.full_name)}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              className="absolute bottom-0 right-0 rounded-full w-10 h-10"
            >
              <Camera className="w-5 h-5" />
            </Button>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">
              {profile.full_name}
            </h2>
            <p className="text-muted-foreground">{profile.specialization}</p>
            {profile.verified && (
              <Badge className="mt-2 bg-green-600 text-white">
                <Shield className="w-3 h-3 mr-1" />
                Verified Doctor
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Professional Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-border/50">
            <span className="text-muted-foreground">Medical License</span>
            <span className="font-semibold text-foreground">
              {profile.medical_license}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border/50">
            <span className="text-muted-foreground">Experience</span>
            <span className="font-semibold text-foreground">
              {profile.experience_years} years
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border/50">
            <span className="text-muted-foreground">Consultation Fee</span>
            <span className="font-semibold text-foreground">
              ₹{profile.consultation_fee}
            </span>
          </div>
          <div className="py-2">
            <span className="text-muted-foreground block mb-2">Languages</span>
            <div className="flex flex-wrap gap-2">
              {profile.languages.map((language, idx) => (
                <Badge key={idx} variant="secondary">
                  {language}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full">Edit Information</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
