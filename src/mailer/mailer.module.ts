import { Module } from '@nestjs/common';

@Module({ exports: [MailerModule] })
export class MailerModule {}
