// @ts-check

import { hostname } from "os";
import { readFile } from "fs/promises";

console.log("=".repeat(60));

console.log(`✓ os.hostname returns: ${hostname()}`);

const res = await getContainerId();

if (res) {
  console.log(`✓ Container ID (full): ${res.fullContainerId}`);
  console.log(`✓ Container ID (short): ${res.shortContainerId}`);
}

console.log(`Process PID: ${process.pid}`);

console.log("=".repeat(60));

async function getContainerId() {
  try {
    const cgroupContent = await readFile("/proc/self/cgroup", "utf8");
    const containerIdMatch = cgroupContent.match(/([a-f0-9]{64})/);

    if (containerIdMatch) {
      const fullContainerId = containerIdMatch[1];
      const shortContainerId = fullContainerId.substring(0, 12);

      return { fullContainerId, shortContainerId };
    }
  } catch (error) {
    console.error(error);
  }
}
