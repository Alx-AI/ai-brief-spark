
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ModelSelectorProps {
  selectedModel: string;
  onChange: (model: string) => void;
}

const ModelSelector = ({ selectedModel, onChange }: ModelSelectorProps) => {
  const models = [
    { id: "gpt-4o-mini", name: "GPT-4o Mini (Faster, Cheaper)" },
    { id: "gpt-4o", name: "GPT-4o (More Powerful)" },
    { id: "o4-mini", name: "O4 Mini" },
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="model-select" className="text-sm font-medium">
        AI Model
      </Label>
      <Select value={selectedModel} onValueChange={onChange}>
        <SelectTrigger id="model-select">
          <SelectValue placeholder="Select model" />
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ModelSelector;
