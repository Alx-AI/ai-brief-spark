
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { generateBrief } from "@/services/openai";
import { useToast } from "@/components/ui/use-toast";

interface BriefGeneratorProps {
  apiKey: string;
  model: string;
  onBriefGenerated: (brief: string) => void;
}

const BriefGenerator = ({ apiKey, model, onBriefGenerated }: BriefGeneratorProps) => {
  const [exampleBrief, setExampleBrief] = useState("");
  const [selectedArticles, setSelectedArticles] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const { toast } = useToast();

  // Check for articles from the RSS reader
  useEffect(() => {
    const articles = sessionStorage.getItem("selectedArticles");
    if (articles) {
      setSelectedArticles(articles);
      // Clear the storage after use
      sessionStorage.removeItem("selectedArticles");
      
      toast({
        title: "Articles Imported",
        description: "Selected articles have been added to your brief generator.",
      });
    }
  }, [toast]);

  const generatePromptPreview = () => {
    if (!exampleBrief || !newTopic) {
      toast({
        title: "Missing information",
        description: "Please provide both an example brief and a new topic.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingPrompt(true);
    let generatedPrompt = `Create a new investment brief about:
<topic>${newTopic}</topic>
in the form of
<example>${exampleBrief}</example>`;

    // Add selected articles if available
    if (selectedArticles) {
      generatedPrompt += `\n\n<reference_articles>
${selectedArticles}
</reference_articles>`;
    }
    
    setPrompt(generatedPrompt);
    setIsGeneratingPrompt(false);
  };

  const handleGenerateBrief = async () => {
    if (!apiKey) {
      toast({
        title: "API key required",
        description: "Please enter your OpenAI API key first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGeneratingBrief(true);
      const result = await generateBrief(
        apiKey,
        model,
        newTopic,
        exampleBrief,
        prompt, // Use the potentially edited prompt
        selectedArticles
      );
      onBriefGenerated(result || "");
      toast({
        title: "Brief generated successfully",
        description: "Your investment brief has been created.",
      });
    } catch (error: any) {
      toast({
        title: "Error generating brief",
        description: error.message || "An error occurred while generating the brief.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="example-brief" className="text-sm font-medium">
          Example Investment Brief
        </Label>
        <Textarea
          id="example-brief"
          value={exampleBrief}
          onChange={(e) => setExampleBrief(e.target.value)}
          placeholder="Paste an existing investment brief here as an example template..."
          className="min-h-[150px]"
        />
      </div>

      {selectedArticles && (
        <div className="space-y-2">
          <Label htmlFor="selected-articles" className="text-sm font-medium">
            Selected Articles
          </Label>
          <Textarea
            id="selected-articles"
            value={selectedArticles}
            onChange={(e) => setSelectedArticles(e.target.value)}
            placeholder="Selected articles will appear here..."
            className="min-h-[100px] font-mono text-xs"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="new-topic" className="text-sm font-medium">
          New Investment Topic
        </Label>
        <Input
          id="new-topic"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          placeholder="Enter your new investment thesis or topic..."
        />
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={generatePromptPreview} 
          disabled={!exampleBrief || !newTopic || isGeneratingPrompt}
        >
          {isGeneratingPrompt ? "Generating..." : "Generate Preview"}
        </Button>
      </div>

      {prompt && (
        <>
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-sm font-medium">
              Prompt Preview (Editable)
            </Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[150px] font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              You can modify this prompt to customize the output.
            </p>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleGenerateBrief} 
              disabled={!apiKey || isGeneratingBrief}
              className="bg-green-600 hover:bg-green-700"
            >
              {isGeneratingBrief ? "Generating..." : "Generate Brief"}
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};

export default BriefGenerator;
