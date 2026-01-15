import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import loginRoutes from "./routes/loginRoutes.js";
import { requireAuth } from "./auth/auth.js";

dotenv.config();

const port = process.env["PORT"] || 3000;

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use("/", loginRoutes);

app.get("/someRoute", requireAuth, (_req, res) => res.send("SOMETHING"));

app.listen(port, () => console.log(`Server listening on port ${port}`));