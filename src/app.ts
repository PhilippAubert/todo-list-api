import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import loginRoutes from "./routes/loginRoutes.js";

dotenv.config();

const port = process.env["PORT"] || 3000;

const app = express();

app.use(bodyParser.json());

app.use("/", loginRoutes);

app.listen(port, () => console.log(`Server listening on port ${port}`));