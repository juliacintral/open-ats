// ============================================================
// AI Provider Interface — open-ats
// ============================================================
// Implement this interface to add any AI provider.
// The application code never knows which provider is active.

export interface ParsedResume {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  currentTitle?: string;
  currentCompany?: string;
  summary?: string;
  skills: string[];
  yearsExperience?: number;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  languages: string[];
  certifications: string[];
}

export interface EducationEntry {
  institution: string;
  degree?: string;
  field?: string;
  startYear?: number;
  endYear?: number;
}

export interface ExperienceEntry {
  company: string;
  title: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  technologies?: string[];
}

export interface RankedCandidate {
  candidateId: string;
  score: number; // 0-100
  reasoning: string;
  strengths: string[];
  gaps: string[];
}

export interface GenerateOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface AIProvider {
  /** Generate any text from a prompt */
  generate(prompt: string, options?: GenerateOptions): Promise<string>;

  /** Summarize a long text into a short paragraph */
  summarize(text: string, maxWords?: number): Promise<string>;

  /** Parse raw resume text into structured JSON */
  parseResume(rawText: string): Promise<ParsedResume>;

  /** Rank candidates against a job description */
  rankCandidates(
    jobTitle: string,
    jobDescription: string,
    jobRequirements: string,
    candidates: Array<{ id: string; resumeText: string }>,
  ): Promise<RankedCandidate[]>;

  /** Check if the provider is healthy */
  healthCheck(): Promise<boolean>;
}

export const AI_PROVIDER = Symbol('AIProvider');
