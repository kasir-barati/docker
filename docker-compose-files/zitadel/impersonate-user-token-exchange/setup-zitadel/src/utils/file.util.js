// @ts-check

import { mkdir, readFile, writeFile } from 'fs/promises';

import { Logger } from './logger.util.js';
import { sleep } from './sleep.util.js';

/**
 * Utility for file operations
 */
export class FileUtil {
  /**
   * Read PAT from file with retries
   * @param {string} patFile - Path to PAT file
   * @param {number} maxRetries - Maximum number of retries
   * @returns {Promise<string>} PAT token
   */
  static async readPatWithRetries(patFile, maxRetries = 15) {
    Logger.log(`Reading PAT from ${patFile} ...`);

    for (let retries = 0; retries < maxRetries; retries++) {
      try {
        const content = await readFile(patFile, 'utf-8');
        const pat = content.trim();

        if (pat.length > 0) {
          Logger.ok(`PAT loaded (${pat.length} chars)`);
          return pat;
        }
      } catch (error) {
        // File doesn't exist yet or is empty
      }

      Logger.log(
        `PAT file not ready yet, retrying (${retries}/${maxRetries})...`,
      );
      await sleep(2000);
    }

    Logger.error(`Could not read PAT from ${patFile}`);
    throw new Error(`Failed to read PAT from ${patFile}`);
  }

  /**
   * Write content to a file
   * @param {string} filePath - File path
   * @param {string} content - Content to write
   */
  static async writeFile(filePath, content) {
    await writeFile(filePath, content, 'utf-8');
  }

  /**
   * Create directory recursively
   * @param {string} dirPath - Directory path
   */
  static async ensureDir(dirPath) {
    await mkdir(dirPath, { recursive: true });
  }
}
