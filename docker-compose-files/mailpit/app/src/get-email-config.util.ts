export interface EmailConfig {
  /** @description SMTP server host */
  smtpHost: string;
  /** @description SMTP server port */
  smtpPort: number;
  /** @description Sender email address */
  from: string;
}

export function getEmailConfig(): EmailConfig {
  return {
    smtpHost: process.env.SMTP_HOST,
    smtpPort: parseInt(process.env.SMTP_PORT),
    from: process.env.EMAIL_FROM,
  };
}
