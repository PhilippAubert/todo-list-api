import type { ResultSetHeader } from "mysql2";

import { pool } from "./db.js";

import type { 
    User
} from "../types/types.js";

export const registerUser = async (name:string, email:string, password:string) => {
    const [loginData] = await pool.query<ResultSetHeader>(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, password]);
    return loginData;
};

export const getUserByEmail = async (email: string) => {
    const [user] = await pool.query<User[]>(`SELECT * FROM users WHERE email = ? LIMIT 1`, [email]);
    if (!user[0]) return null;
    return user[0];
};

export const getUserByName = async (name: string) => {
    const [user] = await pool.query<User[]>(`SELECT * FROM users WHERE name = ? LIMIT 1`, [name]);
    if (!user[0]) return null;
    return user[0];
};