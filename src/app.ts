import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import loginRoutes from "./routes/loginRoutes.js";
import { requireAuth } from "./auth/auth.js";
import { todo_add, todo_get } from "./controller/todoController.js";

dotenv.config();

const port = process.env["PORT"] || 3000;

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use("/", loginRoutes);

app.get("/someRoute", requireAuth, (_req, res) => res.send("SOMETHING"));
app.post("/todos", requireAuth, todo_add);
app.get("/todos", requireAuth, todo_get);

app.listen(port, () => console.log(`Server listening on port ${port}`));