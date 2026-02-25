import nodemailer from 'nodemailer';
import Email from 'email-templates';

/**
 * Email configuration from environment variables
 * @typedef {Object} EmailConfig
 * @property {string} smtpHost - SMTP server host
 * @property {number} smtpPort - SMTP server port
 * @property {string} from - Sender email address
 * @property {string} to - Recipient email address
 * @property {string} userName - User name for email template
 * @property {string} message - Message for email template
 */

/**
 * Get email configuration from environment variables
 * @returns {EmailConfig}
 */
function getEmailConfig() {
  return {
    smtpHost: process.env.SMTP_HOST || 'localhost',
    smtpPort: parseInt(process.env.SMTP_PORT || '1025', 10),
    from: process.env.EMAIL_FROM || 'noreply@example.com',
    to: process.env.EMAIL_TO || 'test@example.com',
    userName: process.env.USER_NAME || 'Guest User',
    message: process.env.MESSAGE || 'Welcome!',
  };
}

/**
 * Pug email template as a string (simulating database-fetched template)
 * This template includes inline CSS in the head tag
 */
const emailTemplate = `
doctype html
html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport" content="width=device-width, initial-scale=1.0")
    title Welcome Email
    style.
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #4CAF50;
        color: white;
        padding: 20px;
        text-align: center;
        border-radius: 8px 8px 0 0;
        margin: -30px -30px 20px -30px;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
      }
      .content {
        padding: 20px 0;
      }
      .greeting {
        font-size: 18px;
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 15px;
      }
      .message {
        font-size: 16px;
        color: #555;
        margin-bottom: 20px;
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #4CAF50;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        margin: 20px 0;
      }
      .footer {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #eee;
        font-size: 12px;
        color: #888;
        text-align: center;
      }
  body
    .container
      .header
        h1 Welcome to Our Platform
      .content
        .greeting Hello, #{userName}!
        .message= message
        p We're excited to have you on board. This is a demonstration of email templating using Pug syntax with inline CSS.
        p
          | This email was generated dynamically with variables passed to the template,
          | simulating how you would fetch a template from a database and populate it with data.
        a.button(href="#") Get Started
      .footer
        p &copy; 2026 Your Company. All rights reserved.
        p This is an automated email. Please do not reply.
`;

/**
 * Send email using nodemailer and email-templates
 * @param {EmailConfig} config - Email configuration
 * @returns {Promise<void>}
 */
async function sendEmail(config) {
  console.log('🚀 Starting email sending process...');
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
    console.log('✅ SMTP connection verified');
  } catch (error) {
    console.error('❌ SMTP connection failed:', error);
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
    // Render the Pug template manually
    const pug = require('pug');
    const html = pug.render(emailTemplate, {
      userName: config.userName,
      message: config.message,
    });

    console.log('📝 Email template rendered successfully');

    // Send the email
    const result = await transporter.sendMail({
      from: config.from,
      to: config.to,
      subject: 'Welcome to Our Platform! 🎉',
      html: html,
    });

    console.log('✅ Email sent successfully!');
    console.log(`📨 Message ID: ${result.messageId}`);
    console.log(`🌐 View it at: http://localhost:8025`);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  } finally {
    // Close transporter
    transporter.close();
  }
}

/**
 * Main function - bootstrap the application
 */
async function bootstrap() {
  console.log('🎬 Application started');

  try {
    const config = getEmailConfig();
    await sendEmail(config);
    console.log('🏁 Application completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('💥 Application error:', error);
    process.exit(1);
  }
}

// Run the application
bootstrap();
