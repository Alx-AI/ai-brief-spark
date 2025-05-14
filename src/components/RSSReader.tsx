
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

interface Article {
  title: string;
  link: string;
  selected: boolean;
}

interface RSSReaderProps {
  onArticlesSelected: (articles: { title: string, link: string }[]) => void;
}

const RSSReader = ({ onArticlesSelected }: RSSReaderProps) => {
  const [feedUrl, setFeedUrl] = useState("https://techcrunch.com/feed/");
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const CORS_PROXY = "https://api.allorigins.win/raw?url=";

  const fetchRSS = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(CORS_PROXY + encodeURIComponent(feedUrl));
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "application/xml");
      
      const items = Array.from(xmlDoc.querySelectorAll("item")).map(item => ({
        title: item.querySelector("title")?.textContent || "No title",
        link: item.querySelector("link")?.textContent || "#",
        selected: false
      }));
      
      setArticles(items);
      
      toast({
        title: "RSS Feed Loaded",
        description: `Successfully loaded ${items.length} articles`,
      });
    } catch (error) {
      console.error("Error fetching RSS:", error);
      toast({
        title: "Error Loading RSS Feed",
        description: "Failed to load the RSS feed. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleArticleSelection = (index: number) => {
    setArticles(prev => prev.map((article, i) => 
      i === index ? { ...article, selected: !article.selected } : article
    ));
  };

  const handleUseSelected = () => {
    const selectedArticles = articles.filter(article => article.selected);
    
    if (selectedArticles.length === 0) {
      toast({
        title: "No Articles Selected",
        description: "Please select at least one article.",
        variant: "destructive",
      });
      return;
    }

    onArticlesSelected(selectedArticles);
    navigate("/");
    
    toast({
      title: "Articles Transferred",
      description: `${selectedArticles.length} article(s) sent to Brief Generator`,
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle>RSS Feed Reader</CardTitle>
      </CardHeader>
      
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            value={feedUrl}
            onChange={(e) => setFeedUrl(e.target.value)}
            placeholder="Enter RSS feed URL"
            className="flex-1"
          />
          <Button 
            onClick={fetchRSS}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Fetch Feed"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Default: TechCrunch RSS Feed
        </p>
      </div>

      {articles.length > 0 && (
        <>
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">
                {articles.length} Articles Found 
                ({articles.filter(a => a.selected).length} selected)
              </h3>
              <Button
                onClick={handleUseSelected}
                size="sm"
                disabled={articles.filter(a => a.selected).length === 0}
              >
                Use Selected
              </Button>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
              {articles.map((article, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-2 p-2 border rounded hover:bg-slate-50"
                >
                  <Checkbox
                    id={`article-${index}`}
                    checked={article.selected}
                    onCheckedChange={() => toggleArticleSelection(index)}
                  />
                  <div className="flex-1 overflow-hidden">
                    <a 
                      href={article.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm font-medium hover:underline truncate block"
                    >
                      {article.title}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default RSSReader;
