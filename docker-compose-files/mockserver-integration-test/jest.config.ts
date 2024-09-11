import type { Config } from 'jest';

export default {
  displayName: 'Stripe integration tests',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  verbose: true,
  testMatch: ['**/*.spec.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  detectOpenHandles: true,
  openHandlesTimeout: 5000,
  forceExit: true,
} satisfies Config;
