import { createServer } from "http";

const PORT = process.env.PORT || 3000;

const server = createServer((req, res) => {
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hi!\n");
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found\n");
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
