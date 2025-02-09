import { getJestProjectsAsync } from '@nx/jest';
import type { Config } from 'jest';

export default async () => {
  const config: Config = {
    projects: await getJestProjectsAsync(),
  };

  return config;
};
