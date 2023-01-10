import express, { Express, Request, Response } from "express";
import { env } from "config";

const app: Express = express();

app.get("/", (req: Request, res: Response, next) => {
  return res.send("API is online");
});

app.listen(env.API_PORT, () => {
  console.log(`API started on port ${env.API_PORT}`);
});
