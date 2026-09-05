import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import https from "node:https";

const SA_DIR = "/var/run/secrets/kubernetes.io/serviceaccount";
const K8S_HOST = process.env.KUBERNETES_SERVICE_HOST;
const K8S_PORT = process.env.KUBERNETES_SERVICE_PORT ?? "443";

function readServiceAccountFiles() {
  return {
    token: readFileSync(`${SA_DIR}/token`, "utf8").trim(),
    ca: readFileSync(`${SA_DIR}/ca.crt`),
    namespace: readFileSync(`${SA_DIR}/namespace`, "utf8").trim(),
  };
}

/**
 *
 * @param {Object} params
 * @param {string} params.token - The service account token
 * @param {Buffer} params.ca - The CA certificate
 * @param {string} params.namespace - The Kubernetes namespace
 *
 * @returns {Promise<Array<{ name: string; phase: string }>>} - A promise that resolves to an array of pod objects
 */
function listPods({ token, ca, namespace }) {
  const options = {
    hostname: K8S_HOST,
    port: K8S_PORT,
    path: `/api/v1/namespaces/${namespace}/pods`,
    headers: { Authorization: `Bearer ${token}` },
    ca,
  };

  return new Promise((resolve, reject) => {
    https
      .get(options, (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          if (res.statusCode !== 200) {
            const err = new Error(`API server responded ${res.statusCode}: ${body}`);
            err.statusCode = res.statusCode;
            return reject(err);
          }
          const { items } = JSON.parse(body);
          resolve(
            items.map((pod) => ({
              name: pod.metadata.name,
              phase: pod.status.phase,
            })),
          );
        });
      })
      .on("error", reject);
  });
}

const server = createServer(async (req, res) => {
  if (req.url !== "/pods") {
    res.writeHead(200, { "content-type": "text/plain" });
    return res.end("ok\n");
  }

  try {
    const saFiles = readServiceAccountFiles();
    const pods = await listPods(saFiles);

    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ namespace: saFiles.namespace, pods }, null, 2));
  } catch (err) {
    res.writeHead(err.statusCode ?? 500, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
});

server.listen(3000, () => console.log("listening on :3000"));
