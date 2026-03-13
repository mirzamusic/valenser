import cors from "cors";
import express from "express";
import routes from "./routes";

export const app = express();

app.use(
  cors({
    origin: true,
    credentials: false
  })
);

app.use(express.json());
app.use("/api", routes);
