import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const port = process.env["PORT"] || 3000;

const app = express();

app.use(bodyParser.json());

app.listen(port, () => console.log(`Server listening on port ${port}!!!`));