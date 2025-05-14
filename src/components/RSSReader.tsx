
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";

interface Article {
  title: string;
  link: string;
  selected: boolean;
  markdown?: string;
  isLoadingMarkdown?: boolean;
  showPreview?: boolean;
}

interface RSSReaderProps {
  onArticlesSelected: (articles: { title: string, link: string, markdown?: string }[]) => void;
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

  const fetchMarkdown = async (index: number) => {
    const article = articles[index];
    
    // Skip if we already have markdown content
    if (article.markdown) {
      toggleMarkdownPreview(index);
      return;
    }

    try {
      // Set loading state for this article
      setArticles(prev => prev.map((a, i) => 
        i === index ? { ...a, isLoadingMarkdown: true } : a
      ));

      const jinaUrl = `https://r.jina.ai/${article.link}`;
      const response = await axios.get(jinaUrl);
      
      setArticles(prev => prev.map((a, i) => 
        i === index ? { 
          ...a, 
          markdown: response.data,
          isLoadingMarkdown: false,
          showPreview: true 
        } : a
      ));
      
      toast({
        title: "Content Loaded",
        description: "Article markdown content fetched successfully",
      });
    } catch (error) {
      console.error("Error fetching markdown:", error);
      setArticles(prev => prev.map((a, i) => 
        i === index ? { ...a, isLoadingMarkdown: false } : a
      ));
      
      toast({
        title: "Error Loading Content",
        description: "Failed to fetch article content. The link may not be compatible with Jina Reader.",
        variant: "destructive",
      });
    }
  };

  const toggleMarkdownPreview = (index: number) => {
    setArticles(prev => prev.map((article, i) => 
      i === index ? { ...article, showPreview: !article.showPreview } : article
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
            
            <div className="max-h-[600px] overflow-y-auto space-y-4 pr-2">
              {articles.map((article, index) => (
                <div 
                  key={index} 
                  className="border rounded p-3 hover:bg-slate-50"
                >
                  <div className="flex items-center space-x-2 mb-2">
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
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-2 flex gap-1 items-center"
                      onClick={() => fetchMarkdown(index)}
                      disabled={article.isLoadingMarkdown}
                    >
                      <BookOpen className="h-4 w-4" />
                      {article.isLoadingMarkdown ? "Loading..." : article.markdown ? 
                        (article.showPreview ? "Hide Content" : "Show Content") : "Get Content"}
                    </Button>
                  </div>
                  
                  {article.showPreview && article.markdown && (
                    <div className="mt-4 border-t pt-2">
                      <div className="bg-slate-50 p-3 rounded">
                        <ScrollArea className="h-[300px] rounded">
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown>
                              {article.markdown}
                            </ReactMarkdown>
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  )}
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
