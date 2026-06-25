import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { CandidatesModule } from './modules/candidates/candidates.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { InterviewsModule } from './modules/interviews/interviews.module';
import { FeedbacksModule } from './modules/feedbacks/feedbacks.module';
import { ResumesModule } from './modules/resumes/resumes.module';
import { AIModule } from './modules/ai/ai.module';
import { EmailModule } from './modules/email/email.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { SearchModule } from './modules/search/search.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    // Config (reads .env)
    ConfigModule.forRoot({ isGlobal: true }),

    // Rate limiting
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

    // Bull queues (Redis)
    BullModule.forRoot({
      redis: { host: 'localhost', port: 6379 },
    }),

    // Core
    PrismaModule,

    // Feature modules
    AuthModule,
    UsersModule,
    JobsModule,
    CandidatesModule,
    ApplicationsModule,
    InterviewsModule,
    FeedbacksModule,
    ResumesModule,
    AIModule,
    EmailModule,
    CalendarModule,
    SearchModule,
    DashboardModule,
  ],
})
export class AppModule {}
