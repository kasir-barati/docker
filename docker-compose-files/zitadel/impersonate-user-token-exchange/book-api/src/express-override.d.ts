declare namespace Express {
  interface Request {
    user?: import("jose").JWTPayload;
  }
}
