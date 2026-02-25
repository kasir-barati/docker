import { EmailTemplateRepository } from "./email-template.repository";


describe(EmailTemplateRepository.name, () => {
  let uut: EmailTemplateRepository

  beforeEach(() => {
    uut = new EmailTemplateRepository();
  });
  
  it('should return the email template', () => {
    const emailTemplate = uut.getEmailTemplate("f7ca59fe-1680-42f5-8179-83dfaa422abb");
    
    expect(emailTemplate).toBeString();
  });

  it('should NOT throw an error when all required interpolation placeholder fields are provided', async () => {
    const emailTemplate = await uut.getEmailTemplate("f7ca59fe-1680-42f5-8179-83dfaa422abb");

    expect(() => uut.validateEmailTemplate(emailTemplate, {
      userName: "John Doe",
      message: "Hello, this is a test message."
    })).not.toThrow();
  });

  it('should throw an error when required interpolation placeholder fields are missing', async () => {
    const emailTemplate = await uut.getEmailTemplate("f7ca59fe-1680-42f5-8179-83dfaa422abb");

    expect(() => uut.validateEmailTemplate(emailTemplate, {
      userName: "John Doe"
    })).toThrow("Missing required template variables: message. Please provide values for these variables in the data object.");
  });
});
