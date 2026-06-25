# 🎯 open-ats

> Enterprise ATS (Applicant Tracking System) open source — inspired by Greenhouse, built 100% with free and self-hosted technologies.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Stack: Next.js + NestJS](https://img.shields.io/badge/stack-Next.js%20%2B%20NestJS-blue)](#tech-stack)
[![AI: Ollama](https://img.shields.io/badge/AI-Ollama%20%7C%20Llama3-orange)](#ai-engine)

---

## ✨ Features

- **Pipeline de vagas** — Kanban-style com stages customizáveis
- **Gestão de candidatos** — Perfis, histórico, notas e feedbacks
- **Parsing de currículos com IA local** — PDF → LLM local (Ollama) → JSON estruturado
- **Ranking de candidatos com IA** — Score automático por compatibilidade
- **Autenticação JWT** — Refresh token, bcrypt, sem Auth0
- **Multi-papel** — Recrutadores, Hiring Managers, Candidatos
- **Entrevistas & Feedbacks** — Agendamento com Google/Microsoft Calendar
- **Dashboard & Analytics** — Metabase ou Apache Superset
- **E-mail gratuito** — SMTP Gmail, Outlook ou Brevo free tier
- **Busca full-text** — PostgreSQL FTS ou Meilisearch
- **Storage de currículos** — Supabase Storage ou MinIO self-hosted
- **Observabilidade** — Grafana + Prometheus + Loki

---

## 🏗️ Tech Stack

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

### AI Engine
| Provider | Modelos | Tipo |
|---|---|---|
| Ollama | Llama 3, Qwen3, Mistral, DeepSeek | Local (self-hosted) |
| LM Studio | Qualquer GGUF | Local |
| OpenRouter | Modelos gratuitos | Cloud fallback |
| LocalAI | OpenAI-compatible | Self-hosted |

---

## 📁 Project Structure

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
│   └── deployment.md
└── scripts/
    └── seed.ts
```

---

## 🚀 Quick Start (Docker)

```bash
# 1. Clone
git clone https://github.com/juliacintral/open-ats.git
cd open-ats

# 2. Copie e configure o .env
cp .env.example .env

# 3. Suba tudo com Docker Compose
docker-compose up -d

# 4. Rode as migrations
docker-compose exec backend npx prisma migrate deploy

# 5. Seed inicial
docker-compose exec backend npx ts-node scripts/seed.ts

# Acesse:
# Frontend: http://localhost:3000
# Backend API: http://localhost:3333
# Swagger: http://localhost:3333/api
```

---

## 🧠 AI Provider Interface

Toda IA é abstraída por uma interface única — troque o provedor sem mudar o código de negócio:

```typescript
interface AIProvider {
  generate(prompt: string, options?: GenerateOptions): Promise<string>;
  summarize(text: string): Promise<string>;
  parseResume(rawText: string): Promise<ParsedResume>;
  rankCandidates(job: Job, candidates: Candidate[]): Promise<RankedCandidate[]>;
}
```

**Implementações incluídas:** `OllamaProvider` · `OpenRouterProvider` · `LocalAIProvider`

---

## 💰 Custo Operacional

| Ambiente | Custo | Stack |
|---|---|---|
| MVP / Dev local | **$0/mês** | Docker local + Ollama local |
| Staging gratuito | **$0/mês** | Vercel + Neon Free + Supabase Storage |
| Produção baixo custo | **~$5-20/mês** | VPS Docker + Neon Pro ou Supabase Pro |
| Produção escalável | **~$30-60/mês** | Railway ou Render + PostgreSQL gerenciado |

---

## 📖 Documentação

- [Arquitetura do Sistema](docs/architecture.md)
- [Provedores de IA](docs/ai-providers.md)
- [Guia de Deploy](docs/deployment.md)
- [Variáveis de Ambiente](.env.example)

---

## 📄 License

MIT — use, fork, contribute.
