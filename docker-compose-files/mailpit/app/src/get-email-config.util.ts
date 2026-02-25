export interface EmailConfig {
  /** @description SMTP server host */
  smtpHost: string;
  /** @description SMTP server port */
  smtpPort: number;
  /** @description Sender email address */
  from: string;
  /** @description Recipient email address */
  to: string;
  /** @description User name for email template */
  userName: string;
  /** @description Message for email template */
  message: string;
}

export function getEmailConfig(): EmailConfig {
  return {
    smtpHost: process.env.SMTP_HOST,
    smtpPort: parseInt(process.env.SMTP_PORT),
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    userName: process.env.USER_NAME,
    message: process.env.MESSAGE,
  };
}
