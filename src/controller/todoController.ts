import { 
    type Request, 
    type Response 
} from "express";

import dotenv from "dotenv";

import { 
    addTodo, 
    deleteTodo, 
    getAllTodos, 
    getOneTodo, 
    updateTodo 
} from "../db/todo.js";

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

export const todo_get_one = async (req:Request, res:Response): Promise<void> => {
    const {id} = req.params;
    const {user_id} = req.body;
    try {
        const todo = await getOneTodo(Number(id), user_id);
        if (!todo) {
            res.status(404).json({ error: "Todo not found" });
            return;
        }
        res.status(200).json(todo);
    } catch (e) {
        res.status(500).json({error:e});
    }
}

export const todo_add = async (req: Request, res: Response):Promise<void> => {
    const {title, description, user_id} = req.body;
    try {
        const newTodo = await addTodo(title, description, user_id);
        res.status(201).json(`${newTodo} has been added!`);
    } catch (e) {
        res.status(500).json({error:e});
    }
};

export const todo_update = async (req:Request, res: Response):Promise<void> => {
    const {title, description, user_id} = req.body;
    const {id} = req.params;
    try {
        const todoToUpdate = await updateTodo(title, description, Number(id), user_id);
        if (!todoToUpdate) {
            res.status(404).json({ error: "Todo not found" });
            return;
        }
        res.status(201).json(`Todo ${todoToUpdate?.id} updated now!`);
    } catch (e) {
        res.status(500).json({error: e});
    }
}


export const todo_delete = async (req:Request, res:Response):Promise<void> => {
    const {id} = req.params;
    const {user_id} = req.body;
    try {
        const todoToDelete = await deleteTodo(Number(id), user_id);
        if (!todoToDelete) {
            res.status(404).json({ error: "Todo not found" });
            return;
        }
        res.status(201).json(`todo ${id} deleted: ${todoToDelete}`);
    } catch (e) {
        res.status(500).json({error: e});
    }
}
