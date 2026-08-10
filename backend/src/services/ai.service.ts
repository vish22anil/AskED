import { GoogleGenAI } from '@google/genai';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  image?: string;
}

export interface AIProvider {
  chat(messages: AIMessage[]): Promise<string>;
  chatStream(messages: AIMessage[], onChunk: (chunk: string) => void): Promise<void>;
}

export class GeminiProvider implements AIProvider {
  private ai: GoogleGenAI;
  private model: string = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  private mapMessages(messages: AIMessage[]) {
    return messages.map(msg => {
      const parts: any[] = [{ text: msg.content }];
      
      if (msg.image && msg.image.startsWith('data:')) {
        const mimeType = msg.image.substring(5, msg.image.indexOf(';'));
        const base64Data = msg.image.substring(msg.image.indexOf(',') + 1);
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
      }

      return {
        role: msg.role === 'assistant' ? 'model' : (msg.role === 'system' ? 'user' : msg.role),
        parts: parts
      };
    });
  }

  private async withRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await Promise.race([
          operation(),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('AI Request Timeout')), 15000))
        ]);
        return result;
      } catch (error) {
        if (attempt === maxRetries) throw error;
        await new Promise(res => setTimeout(res, 1000 * attempt)); // exponential backoff
      }
    }
    throw new Error('AI Request failed after retries');
  }

  async chat(messages: AIMessage[]): Promise<string> {
    const formattedMessages = this.mapMessages(messages);
    const systemPrompt = formattedMessages.find(m => m.role === 'user' && messages.find(om => om.content === m.parts[0].text && om.role === 'system'));
    
    return this.withRetry(async () => {
      const chatSession = await this.ai.models.generateContent({
        model: this.model,
        contents: formattedMessages.filter(m => m !== systemPrompt),
        config: {
          systemInstruction: systemPrompt ? systemPrompt.parts[0].text : undefined
        }
      });
      return chatSession.text || '';
    });
  }

  async chatStream(messages: AIMessage[], onChunk: (chunk: string) => void): Promise<void> {
    const formattedMessages = this.mapMessages(messages);
    const systemPrompt = formattedMessages.find(m => m.role === 'user' && messages.find(om => om.content === m.parts[0].text && om.role === 'system'));

    await this.withRetry(async () => {
      const responseStream = await this.ai.models.generateContentStream({
        model: this.model,
        contents: formattedMessages.filter(m => m !== systemPrompt),
        config: {
          systemInstruction: systemPrompt ? systemPrompt.parts[0].text : undefined
        }
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          onChunk(chunk.text);
        }
      }
    });
  }
}

export class AIProviderFactory {
  static getProvider(providerName: string = 'gemini'): AIProvider {
    switch (providerName.toLowerCase()) {
      case 'gemini':
        if (!process.env.GEMINI_API_KEY) {
          throw new Error("AI provider unavailable");
        }
        return new GeminiProvider(process.env.GEMINI_API_KEY);
      default:
        throw new Error("AI provider unavailable");
    }
  }

  static isProviderConfigured(providerName: string = 'gemini'): boolean {
    switch (providerName.toLowerCase()) {
      case 'gemini':
        return !!process.env.GEMINI_API_KEY;
      default:
        return false;
    }
  }
}
