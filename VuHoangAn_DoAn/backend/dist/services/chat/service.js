import { createAIProvider } from "./aiProvider.js";
export const aiService = {
    /**
     * Ask AI with specified provider
     * @param documentText - Document content
     * @param question - User question
     * @param provider - AI provider: "ollama" | "openai" | "gemini" (default: "ollama")
     */
    async ask(documentText, question, provider = "ollama") {
        try {
            const aiProvider = createAIProvider(provider);
            return await aiProvider.ask(documentText, question);
        }
        catch (error) {
            throw new Error(`AI Service Error: ${error.message}`);
        }
    },
};
//# sourceMappingURL=service.js.map