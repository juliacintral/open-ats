import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AIProvider,
  GenerateOptions,
  ParsedResume,
  RankedCandidate,
} from '../ai.provider.interface';
import { OllamaProvider } from './ollama.provider';

/**
 * OpenRouter Provider — uses free models via OpenAI-compatible API
 * Free models available: meta-llama/llama-3-8b-instruct:free, etc.
 * See: https://openrouter.ai/models?order=top-weekly&supported_parameters=free
 */
@Injectable()
export class OpenRouterProvider implements AIProvider {
  private readonly logger = new Logger(OpenRouterProvider.name);
  private readonly apiKey: string;
  private readonly model: string;
  // Fallback to Ollama if no API key
  private readonly fallback: OllamaProvider;

  constructor(private config: ConfigService) {
    this.apiKey = config.get('OPENROUTER_API_KEY', '');
    this.model = config.get(
      'OPENROUTER_MODEL',
      'meta-llama/llama-3-8b-instruct:free',
    );
    this.fallback = new OllamaProvider(config);
  }

  private async chat(messages: Array<{ role: string; content: string }>, options?: GenerateOptions): Promise<string> {
    if (!this.apiKey) {
      this.logger.warn('No OpenRouter API key — falling back to Ollama');
      return this.fallback.generate(messages.map((m) => m.content).join('\n'), options);
    }

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'HTTP-Referer': 'https://github.com/juliacintral/open-ats',
      },
      body: JSON.stringify({
        model: options?.model ?? this.model,
        messages,
        temperature: options?.temperature ?? 0.3,
        max_tokens: options?.maxTokens ?? 2048,
      }),
    });

    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? '';
  }

  async generate(prompt: string, options?: GenerateOptions): Promise<string> {
    return this.chat([{ role: 'user', content: prompt }], options);
  }

  async summarize(text: string, maxWords = 120): Promise<string> {
    return this.fallback.summarize(text, maxWords);
  }

  async parseResume(rawText: string): Promise<ParsedResume> {
    return this.fallback.parseResume(rawText);
  }

  async rankCandidates(
    jobTitle: string,
    jobDescription: string,
    jobRequirements: string,
    candidates: Array<{ id: string; resumeText: string }>,
  ): Promise<RankedCandidate[]> {
    return this.fallback.rankCandidates(jobTitle, jobDescription, jobRequirements, candidates);
  }

  async healthCheck(): Promise<boolean> {
    if (!this.apiKey) return this.fallback.healthCheck();
    try {
      const res = await fetch('https://openrouter.ai/api/v1/models', {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
