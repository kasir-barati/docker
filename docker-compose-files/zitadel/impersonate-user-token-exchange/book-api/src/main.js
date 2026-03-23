// @ts-check

import express from "express";

import { authMiddleware } from "./middlewares/index.js";
import { requireRole } from "./utils/index.js";

const app = express();

app.use(express.json());

const PORT = 3000;

app
  .get("/api/healthcheck", (_, res) => res.json({ ok: true }))
  .post("/api/books", authMiddleware, requireRole("admin"), (req, res) => {
    console.log("[createBook] body:", req.body);
    res.json({ id: "book-123", ...req.body, createdBy: req.user.sub });
  })
  .get("/api/books/:id", authMiddleware, requireRole("guest"), (req, res) => {
    console.log("[readBook]", req.params.id);
    res.json({ id: req.params.id, title: "Dummy Book", readBy: req.user.sub });
  })
  .listen(PORT, () => {
    console.log("Books API running on :3000");
  });
