
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
  customPrompt?: string
) => {
  try {
    const client = createOpenAIClient(apiKey);
    
    const prompt = customPrompt || `
      Create a new investment brief about:
      <topic>${newTopic}</topic>
      in the form of
      <example>${userPastedBrief}</example>
    `;

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
