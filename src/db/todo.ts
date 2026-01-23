import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "./db.js"

import type { Todo } from "../types/types.js";

type MultiQueryResult = [RowDataPacket[], RowDataPacket[], RowDataPacket[]];

export const getAllTodos = async (userId: number, limit: number, offset: number): Promise<MultiQueryResult> => {
    const [rows] = await pool.query<MultiQueryResult>(
        `SELECT * FROM todos WHERE user_id = ? LIMIT ? OFFSET ?;
         SELECT COUNT(*) AS total FROM todos WHERE user_id = ?;
         SELECT COUNT(*) AS all_items FROM todos;`,
        [userId, limit, offset, userId]
    );
    return rows;
};

export const getOneTodo = async (id:number, userId:number): Promise<Todo | null> => {
    const [rows] = await pool.query<Todo[] & RowDataPacket[]>(
        `SELECT * FROM todos WHERE user_id = ? AND id = ?`, 
        [userId, id]
    );
    return rows[0] || null;
};

export const addTodo = async (title:string,description:string, userId:number): Promise<number> => {
    const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO todos (title, description, user_id) VALUES (?, ?, ?)`, 
        [title, description, userId]
    );
    return result.insertId;
};

export const updateTodo = async (title: string, description: string, id: number, userId: number):Promise<(Todo & RowDataPacket) | null> => {
    const [result] = await pool.query<ResultSetHeader>(
        `UPDATE todos SET title = ?, description = ? WHERE id = ? AND user_id = ?`,
        [title, description, id, userId] 
    );
    if (result.affectedRows === 0) return null;
    return await getOneTodo(id, userId);
}

export const deleteTodo = async (id:number, userId:number): Promise<boolean> => {
    const [result] = await pool.query<ResultSetHeader>(
        `DELETE FROM todos WHERE id = ? AND user_id = ?`, 
        [id, userId]
    );
    return result.affectedRows > 0;
}