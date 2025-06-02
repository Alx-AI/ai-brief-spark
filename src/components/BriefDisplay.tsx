
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

interface BriefDisplayProps {
  brief: string;
}

const BriefDisplay = ({ brief }: BriefDisplayProps) => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Function to format the text with proper line breaks and spacing
  const formatBrief = (text: string) => {
    return text
      .split("\n")
      .map((line, i) => <p key={i} className={line.trim() === "" ? "my-2" : ""}>{line}</p>);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(brief);
    toast({
      title: "Copied to clipboard",
      description: "The brief has been copied to your clipboard.",
    });
  };

  const handleSendToWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Sending brief to webhook:", webhookUrl);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          brief: brief,
          timestamp: new Date().toISOString(),
          source: "Investment Brief Generator",
        }),
      });

      toast({
        title: "Brief Sent",
        description: "The brief has been sent to your webhook successfully.",
      });
    } catch (error) {
      console.error("Error sending to webhook:", error);
      toast({
        title: "Error",
        description: "Failed to send the brief to webhook. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!brief) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Generated Investment Brief</CardTitle>
        <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
          Copy to Clipboard
        </Button>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6 whitespace-pre-line">
        <div className="prose max-w-none mb-6">
          {formatBrief(brief)}
        </div>
        
        <Separator className="my-6" />
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url" className="text-sm font-medium">
              Send to Webhook
            </Label>
            <Input
              id="webhook-url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="Enter your webhook URL..."
              type="url"
            />
          </div>
          
          <Button 
            onClick={handleSendToWebhook}
            disabled={!webhookUrl || isLoading}
            className="w-full"
          >
            {isLoading ? "Sending..." : "Send Brief to Webhook"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BriefDisplay;
