
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import APIKeyForm from "@/components/APIKeyForm";
import ModelSelector from "@/components/ModelSelector";
import BriefGenerator from "@/components/BriefGenerator";
import BriefDisplay from "@/components/BriefDisplay";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-4o-mini");
  const [generatedBrief, setGeneratedBrief] = useState("");

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl">Investment Brief Generator</CardTitle>
          <CardDescription>
            Generate professional investment briefs powered by OpenAI
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <APIKeyForm apiKey={apiKey} onAPIKeySubmit={setApiKey} />
              <Separator />
              <ModelSelector selectedModel={model} onChange={setModel} />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <BriefGenerator 
            apiKey={apiKey} 
            model={model} 
            onBriefGenerated={setGeneratedBrief} 
          />
          
          {generatedBrief && <BriefDisplay brief={generatedBrief} />}
        </div>
      </div>
    </div>
  );
};

export default Index;
