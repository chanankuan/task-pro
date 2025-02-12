import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Support } from './entity/Support.entity';
import { MailerService } from 'src/mailer/mailer.service';
import { UsersService } from 'src/users/users.service';
import type {
  SupportContext,
  SupportReceiptContext,
} from 'src/templates/interfaces';
import type { SupportDto } from './dto/support-dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(Support)
    private readonly supportRepository: Repository<Support>,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly usersService: UsersService,
  ) {}

  async support(userId: number, supportDto: SupportDto) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with ID '${userId}' not found`);
    }

    const caseId = uuidv4();

    // Create a new case in db
    const supportCase = new Support();
    supportCase.case_id = caseId;
    supportCase.description = supportDto.description;
    supportCase.user = user;

    // Insert new data in db
    await this.supportRepository.save(supportCase);

    // Send  emails
    const privacyPolicyLink =
      this.configService.get<string>('FRONTEND_BASE_URL') ?? '';
    const supportLink =
      this.configService.get<string>('FRONTEND_BASE_URL') ?? '';

    // Add context
    const supportRequestContext: SupportContext = {
      caseId,
      userEmail: supportDto.email,
      description: supportDto.description,
      privacyPolicyLink,
      supportLink,
      year: new Date().getFullYear(),
    };

    const supportReceiptContext: SupportReceiptContext = {
      caseId,
      userName: user.name,
      description: supportDto.description,
      privacyPolicyLink,
      supportLink,
      year: new Date().getFullYear(),
    };

    await this.mailerService.sendEmail(
      this.configService.get<string>('SMTP_EMAIL') ?? '',
      'New Support Request',
      'support-request',
      supportRequestContext,
    );

    await this.mailerService.sendEmail(
      user.email,
      `We’ve Received Your Support Request - Case ID: ${caseId}`,
      'support-receipt-email',
      supportReceiptContext,
    );
  }
}
