import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "./db.js"

import type { Todo } from "../types/types.js";


export const getAllTodos = async (userId:number) => {
    const [rows] = await pool.query<Todo[] & RowDataPacket[]>(
        `SELECT * FROM todos WHERE user_id = ?`, 
        [userId]
    );
    return rows;
};

export const getOneTodo = async (id:number, userId:number) => {
    const [rows] = await pool.query<Todo[] & RowDataPacket[]>(
        `SELECT * FROM todos WHERE user_id = ? AND id = ?`, 
        [userId, id]
    );
    return rows[0] || null;
};

export const addTodo = async (title:string,description:string, userId:number) => {
    const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO todos (title, description, user_id) VALUES (?, ?, ?)`, 
        [title, description, userId]
    );
    return result.insertId; 
};

export const updateTodo = async (id: number, title:string, description: string, userId: number) => {
    const [result] = await pool.query<ResultSetHeader>(
        `UPDATE todos SET title = ?, description = ? WHERE id = ? AND user_id = ?`,
        [title, description, id, userId] 
    );
    
    if (result.affectedRows === 0) return null;
    return await getOneTodo(id, userId);
}

export const deleteTodo = async (id:number, userId:number) => {
    const [result] = await pool.query<ResultSetHeader>(
        `DELETE FROM todos WHERE id = ? AND user_id = ?`, 
        [id, userId]
    );
    return result.affectedRows > 0;
}