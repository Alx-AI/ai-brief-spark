
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface BriefDisplayProps {
  brief: string;
}

const BriefDisplay = ({ brief }: BriefDisplayProps) => {
  // Function to format the text with proper line breaks and spacing
  const formatBrief = (text: string) => {
    return text
      .split("\n")
      .map((line, i) => <p key={i} className={line.trim() === "" ? "my-2" : ""}>{line}</p>);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(brief);
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
        <div className="prose max-w-none">
          {formatBrief(brief)}
        </div>
      </CardContent>
    </Card>
  );
};

export default BriefDisplay;
