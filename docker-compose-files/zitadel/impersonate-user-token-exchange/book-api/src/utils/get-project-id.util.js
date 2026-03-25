// @ts-check

import { readFileSync } from "node:fs";

export function getProjectId() {
  /** @description shared volume between init-zitadel & backend */
  const projectIdPath = "/zitadel-pat/project-id";
  const projectId = readFileSync(projectIdPath, "utf8");

  if (!projectId || projectId.trim().length === 0) {
    throw new Error("Project ID is missing or empty");
  }

  return projectId.trim();
}
