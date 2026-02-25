import nodemailer from "nodemailer";
import Email from "email-templates";
import { EmailConfig, getEmailConfig } from "./get-email-config.util";
import { EmailTemplateRepository } from "./email-template.repository";

async function sendEmail(config: EmailConfig) {
  console.log("🚀 Starting email sending process...");
  console.log(`📧 SMTP Host: ${config.smtpHost}:${config.smtpPort}`);
  console.log(`📤 From: ${config.from}`);
  console.log(`📥 To: ${config.to}`);

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: false, // Mailpit doesn't use TLS
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Verify connection
  try {
    await transporter.verify();
    console.log("✅ SMTP connection verified");
  } catch (error) {
    console.error("❌ SMTP connection failed:", error);
    throw error;
  }

  // Create email instance with inline template rendering
  const email = new Email({
    message: {
      from: config.from,
    },
    transport: transporter,
    // We'll render the template manually since we're using a string template
    preview: false,
    send: true,
  });

  try {
    const emailTemplateRepository = new EmailTemplateRepository();
    const emailTemplate = await emailTemplateRepository.getEmailTemplate(
      "4d7a0ff2-7aec-48df-8065-b79ff84ea5d3",
    );
    // Render the Pug template manually
    const pug = require("pug");
    const html = pug.render(emailTemplate, {
      userName: config.userName,
      message: config.message,
    });

    console.log("📝 Email template rendered successfully");

    // Send the email
    const result = await transporter.sendMail({
      from: config.from,
      to: config.to,
      subject: "Welcome to Our Platform! 🎉",
      html: html,
    });

    console.log("✅ Email sent successfully!");
    console.log(`📨 Message ID: ${result.messageId}`);
    console.log(`🌐 View it at: http://localhost:8025`);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw error;
  } finally {
    // Close transporter
    transporter.close();
  }
}

async function bootstrap() {
  console.log("🎬 Application started");

  try {
    const config = getEmailConfig();
    await sendEmail(config);
    console.log("🏁 Application completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("💥 Application error:", error);
    process.exit(1);
  }
}

void bootstrap();
