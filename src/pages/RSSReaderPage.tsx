
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RSSReader from "@/components/RSSReader";
import { useNavigate } from "react-router-dom";

interface ArticleSelection {
  title: string;
  link: string;
}

const RSSReaderPage = () => {
  const navigate = useNavigate();

  const handleArticlesSelected = (articles: ArticleSelection[]) => {
    // Format the selected articles as a prompt for the brief generator
    const formattedText = articles.map(article => 
      `Title: ${article.title}\nLink: ${article.link}`
    ).join("\n\n");
    
    // Store the formatted text in sessionStorage to be accessed by the Brief Generator
    sessionStorage.setItem("selectedArticles", formattedText);
    
    // Navigate back to the Brief Generator page
    navigate("/");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl">RSS Feed Reader</CardTitle>
          <CardDescription>
            Browse and select articles for your investment brief generation
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <RSSReader onArticlesSelected={handleArticlesSelected} />
      </div>
    </div>
  );
};

export default RSSReaderPage;
