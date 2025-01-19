import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { VerificationEmailContext } from 'src/templates/interfaces';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      host: process.env.SMTP_HOST,
      port: +(process.env.SMTP_PORT ?? 465),
      // secure: false, // Use TLS
      auth: {
        user: process.env.SMTP_USERNAME, // SMTP username (e.g., Ethereal email)
        pass: process.env.SMTP_PASSWORD, // SMTP password
      },
    });
  }

  async sendVerificationEmail(
    to: string,
    name: string,
    confirmationLink: string,
  ) {
    const context: VerificationEmailContext = {
      userName: name,
      confirmationLink: confirmationLink,
      privacyPolicyLink:
        this.configService.get<string>('FRONTEND_BASE_URL') ?? '',
      supportLink: this.configService.get<string>('FRONTEND_BASE_URL') ?? '',
      year: new Date().getFullYear(),
    };

    await this.sendEmail(
      to,
      'Confirm Your Email Address',
      'verification-email',
      context,
    );
  }

  // Function to compile Handlebars template and send email
  async sendEmail(
    to: string,
    subject: string,
    templateName: string,
    context: object,
  ): Promise<void> {
    try {
      // Read the template file
      const templatePath = path.resolve(
        './src/templates',
        `${templateName}.hbs`,
      );
      const templateSource = fs.readFileSync(templatePath, 'utf-8');

      // Compile the template with Handlebars
      const compiledTemplate = handlebars.compile(templateSource);

      // Generate the final HTML by passing dynamic context to the template
      const html = compiledTemplate(context);

      // Send the email
      const info = await this.transporter.sendMail({
        from: `Task Pro <${process.env.SMTP_USERNAME}>`, // Sender address
        to, // Receiver address
        subject, // Subject line
        html, // HTML body (compiled Handlebars template)
      });

      console.log('Email sent: %s', info.messageId);
    } catch (error) {
      if (error.responseCode == 535) {
        console.log(error);
        throw new HttpException(
          'Failed to send the email',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
