import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AI_PROVIDER, AIProvider } from './ai.provider.interface';

@ApiTags('AI')
@ApiBearerAuth()
@Controller({ path: 'ai', version: '1' })
export class AIController {
  constructor(
    @Inject(AI_PROVIDER) private readonly aiProvider: AIProvider,
  ) {}

  @Get('health')
  @ApiOperation({ summary: 'Check AI provider health' })
  async health() {
    const ok = await this.aiProvider.healthCheck();
    return { status: ok ? 'healthy' : 'unavailable', provider: process.env.AI_PROVIDER ?? 'ollama' };
  }
}
