import { Injectable } from '@nestjs/common';
import { SmtpSendPayload } from '@src/common/smtp/type/smtp-send.type';
import { SmtpConfig } from '@src/config/smtp.config';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class SmtpService {
  private readonly client: Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options> = createTransport({
    host: SmtpConfig.Host,
    port: SmtpConfig.Port,
    sender: SmtpConfig.DefaultSender,
    auth: {
      user: SmtpConfig.Username,
      pass: SmtpConfig.Password,
    },
  });

  public async send(payload: SmtpSendPayload): Promise<void> {
    await this.client.sendMail({
      to: payload.to,
      sender: payload.from,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });
  }
}
