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
export declare class OllamaProvider implements IAIProvider {
    private model;
    private baseUrl;
    constructor(model?: string);
    ask(documentText: string, question: string): Promise<string>;
}
/**
 * OpenAI Provider - GPT-3.5/GPT-4
 */
export declare class OpenAIProvider implements IAIProvider {
    private apiKey;
    private model;
    constructor(apiKey?: string, model?: string);
    ask(documentText: string, question: string): Promise<string>;
}
/**
 * Google Gemini Provider
 */
export declare class GeminiProvider implements IAIProvider {
    private apiKey;
    private model;
    constructor(apiKey?: string, model?: string);
    ask(documentText: string, question: string): Promise<string>;
}
/**
 * AI Provider Factory
 */
export type ProviderType = "ollama" | "openai" | "gemini";
export declare function createAIProvider(provider?: ProviderType): IAIProvider;
//# sourceMappingURL=aiProvider.d.ts.map