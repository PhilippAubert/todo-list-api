import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import loginRoutes from "./routes/loginRoutes.js";
import { requireAuth } from "./auth/auth.js";
import { todo_add, todo_delete, todo_get, todo_get_one, todo_update } from "./controller/todoController.js";

dotenv.config();

const port = process.env["PORT"] || 3000;

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use("/", loginRoutes);

app.get("/someRoute", requireAuth, (_req, res) => res.send("SOMETHING"));
app.post("/todos", requireAuth, todo_add);
app.get("/todos", requireAuth, todo_get);
app.get("/todos/:id", requireAuth, todo_get_one);
app.put("/todos/:id", requireAuth, todo_update);
app.delete("/todos/:id", requireAuth, todo_delete);

app.listen(port, () => console.log(`Server listening on port ${port}`));