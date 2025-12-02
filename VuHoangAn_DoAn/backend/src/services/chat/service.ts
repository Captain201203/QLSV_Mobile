import { createAIProvider, type ProviderType } from "./aiProvider.js";

export const aiService = {
  /**
   * Ask AI with specified provider
   * @param documentText - Document content
   * @param question - User question
   * @param provider - AI provider: "ollama" | "openai" | "gemini" (default: "ollama")
   */
  async ask(
    documentText: string,
    question: string,
    provider: ProviderType = "ollama"
  ): Promise<string> {
    try {
      const aiProvider = createAIProvider(provider);
      return await aiProvider.ask(documentText, question);
    } catch (error: any) {
      throw new Error(`AI Service Error: ${error.message}`);
    }
  },
};
