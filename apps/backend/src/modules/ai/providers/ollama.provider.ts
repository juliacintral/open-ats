import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AIProvider,
  GenerateOptions,
  ParsedResume,
  RankedCandidate,
} from '../ai.provider.interface';

@Injectable()
export class OllamaProvider implements AIProvider {
  private readonly logger = new Logger(OllamaProvider.name);
  private readonly baseUrl: string;
  private readonly defaultModel: string;

  constructor(private config: ConfigService) {
    this.baseUrl = config.get('OLLAMA_BASE_URL', 'http://localhost:11434');
    this.defaultModel = config.get('OLLAMA_MODEL', 'llama3');
  }

  async generate(prompt: string, options?: GenerateOptions): Promise<string> {
    const model = options?.model ?? this.defaultModel;
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: {
          temperature: options?.temperature ?? 0.3,
          num_predict: options?.maxTokens ?? 2048,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.response as string;
  }

  async summarize(text: string, maxWords = 120): Promise<string> {
    const prompt = `Summarize the following text in ${maxWords} words or less, in plain professional English. Return only the summary, no preamble.\n\nTEXT:\n${text}`;
    return this.generate(prompt, { temperature: 0.2 });
  }

  async parseResume(rawText: string): Promise<ParsedResume> {
    const prompt = `You are an expert ATS parser. Extract structured information from the resume below.
Return ONLY a valid JSON object with this exact schema (no markdown, no explanation):
{
  "name": string,
  "email": string,
  "phone": string,
  "location": string,
  "currentTitle": string,
  "currentCompany": string,
  "summary": string,
  "skills": string[],
  "yearsExperience": number,
  "education": [{"institution":string,"degree":string,"field":string,"startYear":number,"endYear":number}],
  "experience": [{"company":string,"title":string,"startDate":string,"endDate":string,"description":string,"technologies":string[]}],
  "languages": string[],
  "certifications": string[]
}

RESUME:
${rawText}`;

    const raw = await this.generate(prompt, { temperature: 0.1, maxTokens: 3000 });

    try {
      // Extract JSON even if model adds text around it
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('No JSON found in response');
      return JSON.parse(match[0]) as ParsedResume;
    } catch (err) {
      this.logger.error('Failed to parse resume JSON', err);
      return {
        skills: [],
        education: [],
        experience: [],
        languages: [],
        certifications: [],
      };
    }
  }

  async rankCandidates(
    jobTitle: string,
    jobDescription: string,
    jobRequirements: string,
    candidates: Array<{ id: string; resumeText: string }>,
  ): Promise<RankedCandidate[]> {
    const results: RankedCandidate[] = [];

    for (const candidate of candidates) {
      const prompt = `You are an expert recruiter. Score how well this candidate matches the job.
Return ONLY a valid JSON object (no markdown):
{
  "score": number (0-100),
  "reasoning": string,
  "strengths": string[],
  "gaps": string[]
}

JOB TITLE: ${jobTitle}
JOB DESCRIPTION: ${jobDescription}
REQUIREMENTS: ${jobRequirements}

CANDIDATE RESUME:
${candidate.resumeText.slice(0, 3000)}`;

      const raw = await this.generate(prompt, { temperature: 0.2 });

      try {
        const match = raw.match(/\{[\s\S]*\}/);
        if (!match) throw new Error('No JSON found');
        const parsed = JSON.parse(match[0]);
        results.push({
          candidateId: candidate.id,
          score: parsed.score,
          reasoning: parsed.reasoning,
          strengths: parsed.strengths ?? [],
          gaps: parsed.gaps ?? [],
        });
      } catch {
        results.push({
          candidateId: candidate.id,
          score: 0,
          reasoning: 'Could not evaluate',
          strengths: [],
          gaps: [],
        });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`);
      return res.ok;
    } catch {
      return false;
    }
  }
}
