import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AI_PROVIDER } from './ai.provider.interface';
import { OllamaProvider } from './providers/ollama.provider';
import { OpenRouterProvider } from './providers/openrouter.provider';
import { AIController } from './ai.controller';

@Module({
  controllers: [AIController],
  providers: [
    OllamaProvider,
    OpenRouterProvider,
    {
      provide: AI_PROVIDER,
      inject: [ConfigService, OllamaProvider, OpenRouterProvider],
      useFactory: (
        config: ConfigService,
        ollama: OllamaProvider,
        openrouter: OpenRouterProvider,
      ) => {
        const provider = config.get('AI_PROVIDER', 'ollama');
        switch (provider) {
          case 'openrouter':
            return openrouter;
          case 'ollama':
          default:
            return ollama;
        }
      },
    },
  ],
  exports: [AI_PROVIDER],
})
export class AIModule {}
