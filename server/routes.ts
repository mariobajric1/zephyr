import type { Express } from "express";
import { createServer, type Server } from "http";
import { getJson } from 'serpapi';
import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
if (!process.env.open2) {
  throw new Error("open2 environment variable is required");
}

const openai = new OpenAI({
  apiKey: process.env.open2,
});

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

interface SearchResponse {
  results: SearchResult[];
  explanation: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatResponse {
  message: ChatMessage;
}

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  if (!process.env.SERPAPI_KEY) {
    throw new Error("SERPAPI_KEY environment variable is required");
  }

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;

      if (!Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: "You are Zephyr, a helpful and knowledgeable AI assistant. You provide clear, accurate, and engaging responses while maintaining a friendly demeanor. Keep your responses concise but informative." 
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const aiMessage = response.choices[0].message;

      res.json({ 
        message: {
          role: "assistant",
          content: aiMessage.content
        }
      });
    } catch (error: any) {
      console.error('Chat error:', error);

      if (error.code === 'invalid_api_key') {
        res.status(401).json({ 
          error: "Invalid OpenAI API key",
          details: "Please check your API key configuration" 
        });
      } else if (error.code === 'insufficient_quota') {
        res.status(402).json({ 
          error: "OpenAI API quota exceeded",
          details: "Please check your API usage and limits" 
        });
      } else {
        res.status(500).json({ 
          error: "Failed to generate response",
          details: error.message 
        });
      }
    }
  });

  app.post("/api/search", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      // Set headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Get search results from Google via SerpApi
      const searchResults = await getJson({
        engine: "google",
        api_key: process.env.SERPAPI_KEY,
        q: query,
        num: 5
      });

      // Extract organic results
      const results: SearchResult[] = (searchResults.organic_results || [])
        .slice(0, 5)
        .map((result: any) => ({
          title: result.title,
          link: result.link,
          snippet: result.snippet || '',
        }));

      // Send the search results immediately
      res.write(`data: ${JSON.stringify({ type: 'results', results })}\n\n`);

      // Generate AI explanation using OpenAI with streaming
      const prompt = `You are Zephyr, a helpful and insightful AI assistant. Based on these search results about "${query}", provide a brief, insightful explanation that synthesizes the key information. Format your response as a concise paragraph:

Search Results:
${results.map(r => `- ${r.title}: ${r.snippet}`).join('\n')}`;

      const stream = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are Zephyr, a helpful search assistant. Provide clear, concise explanations." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 200,
        stream: true,
      });

      let explanation = '';
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        explanation += content;
        if (content) {
          res.write(`data: ${JSON.stringify({ type: 'explanation', content })}\n\n`);
        }
      }

      // Send end event
      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      res.end();
    } catch (error: any) {
      console.error('Search error:', error);

      const errorResponse = error.code === 'invalid_api_key'
        ? { error: "Invalid API key", details: "Please check your API key configuration" }
        : { error: "Failed to perform search", details: error.message };

      res.write(`data: ${JSON.stringify({ type: 'error', ...errorResponse })}\n\n`);
      res.end();
    }
  });

  return httpServer;
}