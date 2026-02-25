import { getEmailConfig } from "./get-email-config.util";
import { EmailTemplateRepository } from "./email-template.repository";
import { EmailService } from "./email.service";

async function bootstrap() {
  console.log("🎬 Application started");

  try {
    const config = getEmailConfig();
    const emailTemplateRepository = new EmailTemplateRepository();
    const emailService = new EmailService(config, emailTemplateRepository);

    await emailService.onInit();
    await emailService.sendEmail({
      emailTemplateId: "a647a565-a0c5-4cd9-a8ef-a7e4ad625c35",
      to: "recipient@example.com",
      subject: "Welcome to Our Platform! 🎉",
      data: {
        userName: "John Doe",
        message: "Thank you for joining our platform!"
      },
    });
    emailService.onDestroy();

    console.log("🏁 Application completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("💥 Application error:", error);
    process.exit(1);
  }
}

void bootstrap();
