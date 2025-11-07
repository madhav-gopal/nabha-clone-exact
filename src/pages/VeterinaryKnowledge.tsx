import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Syringe, AlertTriangle, Leaf, Calendar } from "lucide-react";

export default function VeterinaryKnowledge() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BookOpen className="w-8 h-8" />
          Veterinary Knowledge Corner 📚
        </h1>
        <p className="text-muted-foreground mt-2">
          Essential information for cattle care and management
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Seasonal Vaccination Schedule
            </CardTitle>
            <CardDescription>Recommended vaccination timeline for cattle</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Initial Vaccinations (Calves)</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 ml-4">
                    <li><strong>1-2 months:</strong> FMD (Foot and Mouth Disease) - 1st dose</li>
                    <li><strong>3-4 months:</strong> FMD - 2nd dose</li>
                    <li><strong>4-6 months:</strong> Brucellosis (female calves only)</li>
                    <li><strong>6 months:</strong> Black Quarter (BQ) - 1st dose</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Annual Vaccinations (Adult Cattle)</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 ml-4">
                    <li><strong>Every 6 months:</strong> FMD booster</li>
                    <li><strong>Annually:</strong> Hemorrhagic Septicemia (HS)</li>
                    <li><strong>Annually:</strong> Black Quarter (BQ) booster</li>
                    <li><strong>Pre-monsoon:</strong> Anthrax vaccination</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Signs of Common Diseases
            </CardTitle>
            <CardDescription>Recognize these symptoms early</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-semibold mb-2">Foot and Mouth Disease (FMD)</h4>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• High fever (104-106°F)</li>
                  <li>• Blisters on mouth, tongue, and hooves</li>
                  <li>• Excessive salivation</li>
                  <li>• Lameness and reluctance to move</li>
                  <li>• Reduced milk production</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold mb-2">Mastitis</h4>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Swollen, hot, or hard udder</li>
                  <li>• Abnormal milk (clots, blood, watery)</li>
                  <li>• Reduced milk yield</li>
                  <li>• Fever and loss of appetite</li>
                  <li>• Pain when touching udder</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2">Digestive Issues</h4>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Bloating or distended abdomen</li>
                  <li>• Diarrhea or constipation</li>
                  <li>• Loss of appetite</li>
                  <li>• Reduced rumination</li>
                  <li>• Dehydration</li>
                </ul>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold mb-2">Respiratory Problems</h4>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Coughing or difficulty breathing</li>
                  <li>• Nasal discharge</li>
                  <li>• Fever</li>
                  <li>• Reduced activity and appetite</li>
                  <li>• Rapid breathing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5" />
              Proper Fodder Mix for Dairy Cattle
            </CardTitle>
            <CardDescription>Balanced nutrition for optimal milk production</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Daily Feed Requirements (per 100 kg body weight)</h4>
                <ul className="space-y-2 ml-4 text-sm">
                  <li><strong>Green Fodder:</strong> 15-20 kg (Berseem, Maize, Jowar)</li>
                  <li><strong>Dry Fodder:</strong> 3-4 kg (Wheat/Rice straw)</li>
                  <li><strong>Concentrate Mix:</strong> 1-2 kg (based on milk production)</li>
                  <li><strong>Water:</strong> 30-40 liters (clean, fresh water)</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2">Concentrate Mix Composition</h4>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Maize/Wheat: 30-35%</li>
                  <li>• De-oiled Rice Bran: 20-25%</li>
                  <li>• Cottonseed/Groundnut Cake: 20-25%</li>
                  <li>• Wheat Bran: 10-15%</li>
                  <li>• Mineral Mixture: 2%</li>
                  <li>• Salt: 1%</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2">Feeding Tips</h4>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Feed at regular times (morning and evening)</li>
                  <li>• Increase concentrate for high-yielding cows</li>
                  <li>• Ensure clean, mold-free fodder</li>
                  <li>• Provide minerals and vitamin supplements</li>
                  <li>• Adjust feed during pregnancy and lactation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Syringe className="w-5 h-5" />
              When to Call a Vet
            </CardTitle>
            <CardDescription>Don't delay - early intervention saves lives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="font-semibold">Call a veterinarian immediately if you notice:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-0.5">•</span>
                  <span><strong>Sudden drop in milk production</strong> (more than 20%)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-0.5">•</span>
                  <span><strong>High fever</strong> (above 103°F / 39.4°C)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-0.5">•</span>
                  <span><strong>Persistent diarrhea or constipation</strong> (more than 24 hours)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-0.5">•</span>
                  <span><strong>Breathing difficulties</strong> or rapid breathing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-0.5">•</span>
                  <span><strong>Severe bloating</strong> or distended abdomen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-0.5">•</span>
                  <span><strong>Wounds or injuries</strong> that need treatment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-0.5">•</span>
                  <span><strong>Birthing complications</strong> or retained placenta</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-0.5">•</span>
                  <span><strong>Abnormal discharge</strong> from any body opening</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-0.5">•</span>
                  <span><strong>Sudden behavioral changes</strong> or lethargy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-0.5">•</span>
                  <span><strong>Visible pain or discomfort</strong></span>
                </li>
              </ul>

              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm">
                  <strong>Prevention is better than cure:</strong> Regular health check-ups, proper nutrition,
                  clean housing, and timely vaccinations can prevent most diseases.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
