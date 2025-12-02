/**
 * Interface for AI providers
 * Supports: Ollama, OpenAI, Google Gemini
 */
export interface IAIProvider {
  ask(documentText: string, question: string): Promise<string>;
}

/**
 * Ollama Provider - Local LLM
 */
export class OllamaProvider implements IAIProvider {
  private model: string;
  private baseUrl: string;

  constructor(model: string = "qwen2.5:1.5b-instruct-q4_K_M") {
    this.model = model;
    this.baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  }

  async ask(documentText: string, question: string): Promise<string> {
    try {
      const prompt = `You are an AI assistant for students.
Answer ONLY using the document below.
If the answer is not found, say "Thông tin này không có trong tài liệu".

--- Document ---
${documentText}

--- Question ---
${question}

--- Answer ---`;

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = (await response.json()) as { response?: string };
      return data.response?.trim() || "Không thể lấy phản hồi từ AI";
    } catch (error: any) {
      throw new Error(`Ollama Error: ${error.message}`);
    }
  }
}

/**
 * OpenAI Provider - GPT-3.5/GPT-4
 */
export class OpenAIProvider implements IAIProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model: string = "gpt-3.5-turbo") {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || "";
    this.model = model;

    if (!this.apiKey) {
      throw new Error("OpenAI API key not provided");
    }
  }

  async ask(documentText: string, question: string): Promise<string> {
    try {
      const systemPrompt = `You are an AI assistant for students.
Answer ONLY using the document provided.
If the answer is not found in the document, say "Thông tin này không có trong tài liệu".`;

      const userMessage = `Document:\n${documentText}\n\nQuestion: ${question}`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errBody = (await response.json().catch(() => null)) as any;
        throw new Error(`OpenAI API error: ${errBody?.error?.message || response.statusText}`);
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const answer = data.choices?.[0]?.message?.content?.trim();
      return answer || "Không thể lấy phản hồi từ AI";
    } catch (error: any) {
      throw new Error(`OpenAI Error: ${error.message}`);
    }
  }
}

/**
 * Google Gemini Provider
 */
export class GeminiProvider implements IAIProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model: string = "gemini-2.5-flash") {
    this.apiKey = apiKey || process.env.GOOGLE_GEMINI_API_KEY || "";
    this.model = model;

    if (!this.apiKey) {
      throw new Error("Google Gemini API key not provided");
    }
  }

  async ask(documentText: string, question: string): Promise<string> {
    try {
      const prompt = `You are an AI assistant for students.
Answer ONLY using the document below.
If the answer is not found, say "Thông tin này không có trong tài liệu".

--- Document ---
${documentText}

--- Question ---
${question}

--- Answer ---`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
            },
          }),
        }
      );

      if (!response.ok) {
        const errBody = (await response.json().catch(() => null)) as any;
        throw new Error(`Gemini API error: ${errBody?.error?.message || response.statusText}`);
      }

      const data = (await response.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      return answer || "Không thể lấy phản hồi từ AI";
    } catch (error: any) {
      throw new Error(`Gemini Error: ${error.message}`);
    }
  }
}

/**
 * AI Provider Factory
 */
export type ProviderType = "ollama" | "openai" | "gemini";

export function createAIProvider(provider: ProviderType = "ollama"): IAIProvider {
  switch (provider) {
    case "openai":
      return new OpenAIProvider();
    case "gemini":
      return new GeminiProvider();
    case "ollama":
    default:
      return new OllamaProvider();
  }
}
