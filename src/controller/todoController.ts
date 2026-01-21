import { 
    type Request, 
    type Response 
} from "express";

import dotenv from "dotenv";

import { addTodo, getAllTodos } from "../db/todo.js";

dotenv.config();

export const todo_get = async (req: Request, res: Response):Promise<void> => {
    const {user_id} = req.body;
    try {
        const allTodos = await getAllTodos(user_id);
        res.status(200).json(allTodos);
    } catch (e) {
        res.status(500).json({error: e});
    }
};

export const todo_add = async (req: Request, res: Response):Promise<void> => {
    const {title, description, user_id} = req.body;

    try {
        const newPost = await addTodo(title, description, user_id);
        console.log(newPost);
        res.status(201).json("new todo added");
    } catch (e) {
        res.status(500).json({error:e});
    }
};