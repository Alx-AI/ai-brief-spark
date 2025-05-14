
import OpenAI from "openai";

export const createOpenAIClient = (apiKey: string) => {
  return new OpenAI({ 
    apiKey, 
    dangerouslyAllowBrowser: true 
  });
};

export const generateBrief = async (
  apiKey: string,
  model: string,
  newTopic: string,
  userPastedBrief: string,
  customPrompt?: string,
  selectedArticles?: string
) => {
  try {
    const client = createOpenAIClient(apiKey);
    
    let prompt = customPrompt;
    
    if (!prompt) {
      prompt = `Create a new investment brief about:
<topic>${newTopic}</topic>
in the form of
<example>${userPastedBrief}</example>`;
      
      if (selectedArticles) {
        prompt += `\n\n<reference_articles>
${selectedArticles}
</reference_articles>`;
      }
    }

    const response = await client.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating brief:", error);
    throw error;
  }
};
