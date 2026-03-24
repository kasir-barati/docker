// @ts-check

/**
 * Utility for logging messages with consistent formatting
 */
export class Logger {
  /**
   * Log an informational message
   * @param {string} message - Message to log
   */
  static log(message) {
    console.error(`  ${message}`);
  }

  /**
   * Log a success message
   * @param {string} message - Message to log
   */
  static ok(message) {
    console.error(`  ✓ ${message}`);
  }

  /**
   * Log a warning message
   * @param {string} message - Message to log
   */
  static warn(message) {
    console.error(`  ⚠ ${message}`);
  }

  /**
   * Log an error message
   * @param {string} message - Message to log
   */
  static error(message) {
    console.error(`  ✗ ${message}`);
  }

  /**
   * Log a section header
   * @param {string} title - Section title
   */
  static section(title) {
    console.error('');
    console.error('================================================');
    console.error(title);
    console.error('================================================');
    console.error('');
  }

  /**
   * Log a subsection
   * @param {string} title - Subsection title
   */
  static subsection(title) {
    console.error('');
    console.error(title);
    console.error('');
  }
}
