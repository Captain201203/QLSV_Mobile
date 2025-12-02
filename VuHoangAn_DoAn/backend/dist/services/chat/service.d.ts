import { type ProviderType } from "./aiProvider.js";
export declare const aiService: {
    /**
     * Ask AI with specified provider
     * @param documentText - Document content
     * @param question - User question
     * @param provider - AI provider: "ollama" | "openai" | "gemini" (default: "ollama")
     */
    ask(documentText: string, question: string, provider?: ProviderType): Promise<string>;
};
//# sourceMappingURL=service.d.ts.map