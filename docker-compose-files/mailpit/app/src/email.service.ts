import nodemailer from "nodemailer";
import Email from "email-templates";
import pug from "pug";
import { EmailTemplateRepository } from "./email-template.repository";
import { EmailConfig } from "./get-email-config.util";

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly config: EmailConfig,
    private readonly emailTemplateRepository: EmailTemplateRepository,
  ) {}

  async onInit() {
    this.transporter = nodemailer.createTransport({
      host: this.config.smtpHost,
      port: this.config.smtpPort,
      secure: false, // Mailpit doesn't use TLS
      tls: {
        rejectUnauthorized: false,
      },
    });

    try {
      await this.transporter.verify();
      console.log("✅ SMTP connection verified");
    } catch (error) {
      console.error("❌ SMTP connection failed:", error);
      throw error;
    }
  }

  onDestroy() {
    this.transporter.close();
  }

  async sendEmail({to, subject, data, emailTemplateId}: EmailData) {
    console.log("🚀 Starting email sending process...");
    console.log(
      `📧 SMTP Host: ${this.config.smtpHost}:${this.config.smtpPort}`,
    );
    console.log(`📤 From: ${this.config.from}`);
    console.log(`📥 To: ${to}`);

    try {
      const emailTemplate =
        await this.emailTemplateRepository.getEmailTemplate(emailTemplateId);
      
      this.emailTemplateRepository.validateEmailTemplate(emailTemplate, data);
      console.log("✅ Email template validation passed");
      
      const html = pug.render(emailTemplate, data);

      console.log("📝 Email template rendered successfully");

      // Send the email
      const result = await this.transporter.sendMail({
        from: this.config.from,
        to: to,
        subject: subject,
        html: html,
      });

      console.log("✅ Email sent successfully!");
      console.log(`📨 Message ID: ${result.messageId}`);
      console.log(`🌐 View it at: http://localhost:8025`);
    } catch (error) {
      console.error("❌ Failed to send email:", error);
      throw error;
    }
  }
}

interface EmailData {
  emailTemplateId: string;
  to: string;
  subject: string;
  data: Record<string, string>;
}
