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
    await emailService.sendEmail("4d7a0ff2-7aec-48df-8065-b79ff84ea5d3");
    emailService.onDestroy();

    console.log("🏁 Application completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("💥 Application error:", error);
    process.exit(1);
  }
}

void bootstrap();
