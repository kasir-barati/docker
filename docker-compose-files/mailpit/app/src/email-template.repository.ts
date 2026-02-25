export class EmailTemplateRepository {
  /**
   * @description
   * returns Pug email template as a string.
   */
  async getEmailTemplate(id: string): Promise<string> {
    // In a real app we would fetch this from a database

    return emailTemplate;
  }

  /**
   * @description
   * Validates that all placeholders in the email template exist in the provided data object.
   * 
   * ## **Important**: Only `#{variableName}` syntax is supported for placeholders.
   *
   * @throws an error if any required placeholder is missing.
   *
   * @example
   * ```ts
   * const template = "Hello, #{userName}! Your message: #{message}";
   * validateEmailTemplate(template, { userName: "John", message: "Welcome" }); // ✅ Valid
   * validateEmailTemplate(template, { userName: "John" }); // ❌ Throws error: Missing required template variables: message
   * ```
   */
  validateEmailTemplate(
    template: string,
    data: Record<string, any>
  ): void {
    // Extract all Pug interpolation placeholders using #{variableName} syntax
    // Regex explanation: #{(\w+)} matches #{userName}, #{message}, etc.
    const placeholderRegex = /#{(\w+)}/g;
    const matches = template.matchAll(placeholderRegex);
    const requiredPlaceholders = new Set<string>();
    
    // Collect all unique placeholders
    for (const match of matches) {
      const placeholder = match[1];
      if (placeholder) {
        requiredPlaceholders.add(placeholder);
      }
    }
    
    // Check if all required placeholders exist in data
    const missingPlaceholders: string[] = [];
    
    for (const placeholder of requiredPlaceholders) {
      if (!(placeholder in data)) {
        missingPlaceholders.push(placeholder);
      }
    }
    
    if (missingPlaceholders.length > 0) {
      throw new Error(
        `Missing required template variables: ${missingPlaceholders.join(", ")}. ` +
        `Please provide values for these variables in the data object.`
      );
    }
  }
}

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
        .message #{message}
        p We're excited to have you on board. This is a demonstration of email templating using Pug syntax with inline CSS.
        p
          | This email was generated dynamically with variables passed to the template,
          | simulating how you would fetch a template from a database and populate it with data.
        a.button(href="#") Get Started
      .footer
        p &copy; 2026 Your Company. All rights reserved.
        p This is an automated email. Please do not reply.
`;
