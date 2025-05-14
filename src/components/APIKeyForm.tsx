
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";

interface APIKeyFormProps {
  onAPIKeySubmit: (apiKey: string) => void;
  apiKey: string;
}

const APIKeyForm = ({ onAPIKeySubmit, apiKey }: APIKeyFormProps) => {
  const [key, setKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAPIKeySubmit(key);
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key" className="text-sm font-medium">
            OpenAI API Key
          </Label>
          <div className="flex">
            <Input
              id="api-key"
              type={showKey ? "text" : "password"}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter your OpenAI API key"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setShowKey(!showKey)}
              className="ml-2"
            >
              {showKey ? <X size={16} /> : <Check size={16} />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Your API key is stored only in memory and is never saved permanently.
          </p>
        </div>
        <Button type="submit" className="w-full">
          {apiKey ? "Update API Key" : "Set API Key"}
        </Button>
      </form>
    </div>
  );
};

export default APIKeyForm;
