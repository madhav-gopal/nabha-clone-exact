import { useState } from "react";
import { Shield, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name is required"),
  medicalLicense: z.string().min(5, "Medical license is required"),
  specialization: z.string().min(2, "Specialization is required"),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      fullName: formData.get("fullName") as string,
      medicalLicense: formData.get("medicalLicense") as string,
      specialization: formData.get("specialization") as string,
    };

    try {
      const validatedData = signUpSchema.parse(data);
      
      const { error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: validatedData.fullName,
            medical_license: validatedData.medicalLicense,
            specialization: validatedData.specialization,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Account created successfully! Please sign in.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      const validatedData = signInSchema.parse(data);
      
      const { error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg">
              <Stethoscope className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              NabhaArogya
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Doctor Portal - Secure Login
            </p>
          </div>
        </div>

        <Card className="border-accent/20 bg-card/50 backdrop-blur-sm shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-accent mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-semibold text-sm text-foreground">
                  Secure Medical Portal
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This portal complies with ABDM guidelines and uses end-to-end encryption.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card className="border-border/50 shadow-xl bg-card backdrop-blur-sm">
              <CardHeader className="space-y-2 pb-6">
                <CardTitle className="text-2xl text-center text-foreground">
                  Doctor Login
                </CardTitle>
                <CardDescription className="text-center text-muted-foreground">
                  Enter your credentials to access the portal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="doctor@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder="Enter your secure password"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="border-border/50 shadow-xl bg-card backdrop-blur-sm">
              <CardHeader className="space-y-2 pb-6">
                <CardTitle className="text-2xl text-center text-foreground">
                  Doctor Registration
                </CardTitle>
                <CardDescription className="text-center text-muted-foreground">
                  Create your account to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      name="fullName"
                      type="text"
                      placeholder="Dr. Anjali Mehta"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-license">Medical License ID</Label>
                    <Input
                      id="signup-license"
                      name="medicalLicense"
                      type="text"
                      placeholder="MH-12345-2018"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-specialization">Specialization</Label>
                    <Input
                      id="signup-specialization"
                      name="specialization"
                      type="text"
                      placeholder="General Medicine"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="doctor@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="Minimum 6 characters"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center space-y-2 px-4">
          <p className="text-xs text-muted-foreground">
            Need help? Contact IT Support:{" "}
            <span className="font-medium text-foreground">+91-XXXX-XXXXXX</span>
          </p>
          <p className="text-xs text-muted-foreground">
            © 2024 NabhaArogya Platform. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
