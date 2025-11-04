import { useState } from "react";
import { Shield, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-medical-light to-accent/10 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
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

        {/* Security Notice */}
        <Card className="border-accent/20 bg-card/50 backdrop-blur-sm shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <Shield className="w-5 h-5 text-accent" />
              </div>
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

        {/* Login Form */}
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
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-foreground">
                  Medical License ID / Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your medical license ID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-11 border-border/80 focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 border-border/80 focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200"
              >
                Continue to Two-Factor Authentication
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
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

export default Index;
