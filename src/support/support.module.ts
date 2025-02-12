import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { UsersModule } from 'src/users/users.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { MailerService } from 'src/mailer/mailer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Support } from './entity/Support.entity';

@Module({
  imports: [MailerModule, UsersModule, TypeOrmModule.forFeature([Support])],
  controllers: [SupportController],
  providers: [SupportService, MailerService],
})
export class SupportModule {}
