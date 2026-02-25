import nodemailer from "nodemailer";
import Email from "email-templates";
import { EmailTemplateRepository } from "./email-template.repository";
import { EmailConfig } from "./get-email-config.util";

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly config: EmailConfig,
    private readonly emailTemplateRepository: EmailTemplateRepository,
  ) {}

  async onInit() {
    // Create transporter
    this.transporter = nodemailer.createTransport({
      host: this.config.smtpHost,
      port: this.config.smtpPort,
      secure: false, // Mailpit doesn't use TLS
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify connection
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

  async sendEmail(emailTemplateId: string) {
    console.log("🚀 Starting email sending process...");
    console.log(
      `📧 SMTP Host: ${this.config.smtpHost}:${this.config.smtpPort}`,
    );
    console.log(`📤 From: ${this.config.from}`);
    console.log(`📥 To: ${this.config.to}`);

    // Create email instance with inline template rendering
    const email = new Email({
      message: {
        from: this.config.from,
      },
      transport: this.transporter,
      // We'll render the template manually since we're using a string template
      preview: false,
      send: true,
    });

    try {
      const emailTemplate =
        await this.emailTemplateRepository.getEmailTemplate(emailTemplateId);
      // Render the Pug template manually
      const pug = require("pug");
      const html = pug.render(emailTemplate, {
        userName: this.config.userName,
        message: this.config.message,
      });

      console.log("📝 Email template rendered successfully");

      // Send the email
      const result = await this.transporter.sendMail({
        from: this.config.from,
        to: this.config.to,
        subject: "Welcome to Our Platform! 🎉",
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
