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

import { validateTodo } from "../validation/todoValidate.js";
import type { Todo } from "../types/types.js";

dotenv.config();

export const todo_get_all = async (req: Request, res: Response):Promise<void> => {
    const userId = (req as any).user.id; 
    const pageNum = Number(req.query["page"]) || 1;
    const limitNum = Number(req.query["limit"]) || 10;
    const offset = (pageNum - 1) * limitNum;

    try {
        const [todoRows, totalRows, allItemsRows] = await getAllTodos(userId, limitNum, offset);

        res.status(200).json({
            data: todoRows,
            page: pageNum,
            limit: limitNum,
            total: totalRows[0]?.["total"] ?? 0,
            all_items: allItemsRows[0]?.["all_items"] ?? 0
        });
    } catch (e) {
        res.status(500).json({error: e});
    }
};

export const todo_get_one = async (req:Request, res:Response): Promise<void> => {    
    const userId = (req as any).user.id; 
    const {id} = req.params;
    try {
        const todo = await getOneTodo(Number(id), userId);
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
    const userId = (req as any).user.id; 
    const { title, description } = req.body;

    const validationResult = await validateTodo({ title, description, user_id: userId } as any);
    
    if (!validationResult.valid) {
        res.status(400).json({ errors: validationResult.errors });
        return;
    }
    try {
        const newTodo = await addTodo(title, description, userId);
        res.status(201).json(`todo ${newTodo} has been added!`);
    } catch (e) {
        res.status(500).json({error:e});
    }
};

export const todo_update = async (req:Request, res: Response):Promise<void> => {
    const userId = (req as any).user.id;
    const {title, description} = req.body;
    const {id} = req.params;

    const validationResult = await validateTodo({title, description, userId} as unknown as Todo);

    if (!validationResult.valid) {
        res.status(401).json({errors: validationResult.errors});
        return;
    }

    try {
        const updated = await updateTodo(title, description, Number(id), userId);
        if (!updated) {
            res.status(403).json({ error: "Forbidden: You are not authorized to update this item." });
            return;
        }
        res.status(201).json(`Todo ${updated?.id} updated now!`);
    } catch (e) {
        res.status(500).json({error: e});
    }
}


export const todo_delete = async (req:Request, res:Response):Promise<void> => {
    const {id} = req.params;
    const userId = (req as any).user.id; 
    try {
        const deleted = await deleteTodo(Number(id), userId);
        if (!deleted) {
            res.status(403).json({ error: "Forbidden: You are not authorized to delete this item." });
            return;
        }
        res.status(204).json("Todo deleted");
    } catch (e) {
        res.status(500).json({error: e});
    }
}
