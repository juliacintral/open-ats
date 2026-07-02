# open-ats

ATS enterprise open source, inspirado no Greenhouse, construdo 100% com tecnologias gratuitas e self-hosted. Nenhum plano pago, nenhuma surpresa no cartão.

Esse projeto começou porque eu queria entender como um ATS de verdade funciona por dentro — do kanban de pipeline até o parsing de currículo com IA local.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Stack: Next.js + NestJS](https://img.shields.io/badge/stack-Next.js%20%2B%20NestJS-blue)](#tech-stack)
[![AI: Ollama](https://img.shields.io/badge/AI-Ollama%20%7C%20Llama3-orange)](#ai-engine)

## O que tem

- **Pipeline de vagas** — Kanban com stages customizáveis
- **Gestão de candidatos** — Perfis, histórico, notas e feedbacks
- **Parsing de currículo com IA local** — PDF → LLM (Ollama) → JSON estruturado
- **Ranking de candidatos** — Score automático por compatibilidade
- **Auth JWT** — Refresh token, bcrypt, sem Auth0
- **Multi-papel** — Recrutadores, Hiring Managers, Candidatos
- **Entrevistas & Feedbacks** — Agendamento com Google/Microsoft Calendar
- **Dashboard & Analytics** — Metabase ou Apache Superset
- **E-mail gratuito** — SMTP Gmail, Outlook ou Brevo free tier
- **Busca full-text** — PostgreSQL FTS ou Meilisearch
- **Storage de currículos** — Supabase Storage ou MinIO self-hosted

## Tech Stack

### Frontend
| Tech | Versão | Função |
|---|---|---|
| Next.js | 14+ (App Router) | Framework React SSR/SSG |
| TypeScript | 5+ | Tipagem estática |
| Tailwind CSS | 3+ | Estilização utility-first |
| shadcn/ui | latest | Componentes acessíveis |
| React Query | 5+ | Server state, cache |
| Zustand | 4+ | Client state global |

### Backend
| Tech | Versão | Função |
|---|---|---|
| NestJS | 10+ | Framework Node.js modular |
| TypeScript | 5+ | Tipagem estática |
| PostgreSQL | 15+ | Banco principal |
| Prisma ORM | 5+ | Queries type-safe |
| Redis | 7+ | Cache, filas, sessões |
| Bull/BullMQ | latest | Filas de background jobs |

### IA
| Provider | Modelos | Tipo |
|---|---|---|
| Ollama | Llama 3, Qwen3, Mistral, DeepSeek | Local (self-hosted) |
| LM Studio | Qualquer GGUF | Local |
| OpenRouter | Modelos gratuitos | Cloud fallback |
| LocalAI | OpenAI-compatible | Self-hosted |

## Estrutura do projeto

```
open-ats/
├── apps/
│   ├── frontend/          # Next.js 14 App Router
│   └── backend/           # NestJS Monolith Modular
├── packages/
│   ├── shared-types/      # DTOs e interfaces compartilhadas
│   └── ai-provider/       # Abstração de provedores de IA
├── docker/
│   ├── docker-compose.yml
│   └── docker-compose.prod.yml
├── docs/
│   ├── architecture.md
│   ├── ai-providers.md
└── scripts/
    └── seed.ts
```

## Quick Start com Docker

```bash
# Clone
git clone https://github.com/juliacintral/open-ats.git
cd open-ats

# Configure o .env
cp .env.example .env

# Sobe tudo
docker-compose up -d

# Aplica as migrations
docker-compose exec backend npx prisma migrate deploy

# Seed inicial
docker-compose exec backend npx ts-node scripts/seed.ts

# Frontend: http://localhost:3000
# API: http://localhost:3333
# Swagger: http://localhost:3333/api
```

## Interface de IA

Toda IA é abstraida por uma interface única. Você troca o provedor sem mexer na lógica de negócio:

```typescript
interface AIProvider {
  generate(prompt: string, options?: GenerateOptions): Promise<string>;
  summarize(text: string): Promise<string>;
  parseResume(rawText: string): Promise<ParsedResume>;
  rankCandidates(job: Job, candidates: Candidate[]): Promise<RankedCandidate[]>;
}
```

**Implementações:** `OllamaProvider` · `OpenRouterProvider` · `LocalAIProvider`

## Custo operacional

| Ambiente | Custo | Stack |
|---|---|---|
| MVP / Dev local | **$0/mês** | Docker local + Ollama local |
| Staging gratuito | **$0/mês** | Vercel + Neon Free + Supabase Storage |
| Produção baixo custo | **~$5–20/mês** | VPS Docker + Neon Pro ou Supabase Pro |
| Produção escalável | **~$30–60/mês** | Railway ou Render + PostgreSQL gerenciado |

## Documentação

- [Arquitetura](docs/architecture.md)
- [Provedores de IA](docs/ai-providers.md)
- [Guia de Deploy](docs/deployment.md)

## Licença

MIT — usa, faz fork, contribui.

---

Feito com ❤️ juliacintral
