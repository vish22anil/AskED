import nodemailer from 'nodemailer';
import { Resend } from 'resend';

interface EmailProvider {
  sendEmail(to: string, subject: string, html: string): Promise<boolean>;
}

class NodemailerProvider implements EmailProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'dummy@ethereal.email',
          pass: 'dummy_pass'
      }
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      console.log('\n=================== NODEMAILER ===================');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body:\n${html.replace(/<[^>]*>?/gm, '')}`);
      console.log('==================================================\n');
      
      // In development we might just mock it to save time, but here is the actual send:
      // await this.transporter.sendMail({
      //   from: '"AskED Support" <support@asked.com>',
      //   to,
      //   subject,
      //   html,
      // });
      return true;
    } catch (error) {
      console.error('Nodemailer Error:', error);
      return false;
    }
  }
}

class ResendProvider implements EmailProvider {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');
  }

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      await this.resend.emails.send({
        from: 'AskED Support <support@asked.com>',
        to,
        subject,
        html,
      });
      return true;
    } catch (error) {
      console.error('Resend Error:', error);
      return false;
    }
  }
}

export const sendEmail = async (to: string, subject: string, html: string) => {
  const providerType = process.env.EMAIL_PROVIDER || (process.env.NODE_ENV === 'production' ? 'resend' : 'nodemailer');
  
  let provider: EmailProvider;

  if (providerType === 'resend') {
    provider = new ResendProvider();
  } else {
    provider = new NodemailerProvider();
  }

  return await provider.sendEmail(to, subject, html);
};
