import express from "express";

import { 
    todo_add, 
    todo_delete, 
    todo_get_all, 
    todo_get_one, 
    todo_update 
} from "../controller/todoController.js";

import { requireAuth } from "../auth/auth.js";

const todoRouter = express.Router();

todoRouter.route("/todos")
    .get(requireAuth, todo_get_all)
    .post(requireAuth, todo_add);

todoRouter.route("/todos/:id")
    .get(requireAuth, todo_get_one)
    .put(requireAuth, todo_update)
    .delete(requireAuth, todo_delete);

export default todoRouter;