// src/mail/mail.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { EnvConfigService } from './env-manager.service';

@Injectable()
export class EmailService implements OnModuleInit {
  constructor(private readonly envService: EnvConfigService) {}

  private transporter: Transporter;
  private testAccount: nodemailer.TestAccount;

  async onModuleInit() {
    // Create Ethereal test account
    this.testAccount = await nodemailer.createTestAccount();

    // Create transporter
    this.transporter = nodemailer.createTransport({
      host: this.testAccount.smtp.host,
      port: this.testAccount.smtp.port,
      secure: this.testAccount.smtp.secure,
      auth: {
        user: this.testAccount.user,
        pass: this.testAccount.pass,
      },
    });
  }

  async sendEmail(params: {
    to: string | string[];
    subject: string;
    html?: string;
    text?: string;
    fromName?: string;
  }) {
    if (this.envService.appOptions.env === 'dev') {
      return true;
    }

    const { to, subject, html, text, fromName = 'Test App' } = params;

    const info = await this.transporter.sendMail({
      from: `"${fromName}" <${this.testAccount.user}>`,
      to,
      subject,
      text,
      html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);

    console.log('Message sent:', info.messageId);
    console.log('Preview URL:', previewUrl);

    return {
      messageId: info.messageId,
      previewUrl,
    };
  }
}
