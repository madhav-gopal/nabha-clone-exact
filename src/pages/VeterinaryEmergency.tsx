import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MessageCircle, AlertCircle } from "lucide-react";

export default function VeterinaryEmergency() {
  const emergencyContact = "+91-9876543210";
  const whatsappLink = `https://wa.me/919876543210?text=Emergency%20Vet%20Help%20Needed`;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-red-600 flex items-center gap-2">
          <AlertCircle className="w-8 h-8" />
          Emergency Veterinary Help 🚨
        </h1>
        <p className="text-muted-foreground mt-2">
          Get immediate help for your animals in emergency situations
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Call Emergency Helpline
            </CardTitle>
            <CardDescription>24/7 emergency veterinary support</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-2xl font-bold">{emergencyContact}</p>
              <Button
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => window.open(`tel:${emergencyContact}`)}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              WhatsApp Support
            </CardTitle>
            <CardDescription>Chat with vet support team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Quick response via WhatsApp messaging
              </p>
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => window.open(whatsappLink, "_blank")}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Open WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>When to Seek Emergency Help</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold">•</span>
              <span><strong>Severe bleeding</strong> - Wounds that won't stop bleeding</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold">•</span>
              <span><strong>Difficulty breathing</strong> - Labored or rapid breathing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold">•</span>
              <span><strong>Severe diarrhea or vomiting</strong> - Continuous for more than 24 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold">•</span>
              <span><strong>Inability to stand</strong> - Sudden weakness or collapse</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold">•</span>
              <span><strong>Eye injuries</strong> - Any trauma to the eyes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold">•</span>
              <span><strong>Birthing complications</strong> - Prolonged labor or visible distress</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold">•</span>
              <span><strong>Poisoning symptoms</strong> - Excessive drooling, tremors, seizures</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold">•</span>
              <span><strong>High fever</strong> - Body temperature above 103°F (39.4°C)</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle>First Aid Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p><strong>Before help arrives:</strong></p>
            <ul className="space-y-2 ml-4">
              <li>• Keep the animal calm and in a safe, quiet area</li>
              <li>• For bleeding: Apply gentle pressure with clean cloth</li>
              <li>• For poisoning: Do NOT induce vomiting - call vet immediately</li>
              <li>• Keep the animal's airway clear</li>
              <li>• Monitor breathing and heart rate</li>
              <li>• Note symptoms and time of onset to inform the vet</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
