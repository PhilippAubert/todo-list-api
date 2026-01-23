import type { ResultSetHeader, RowDataPacket } from "mysql2";

import { pool } from "./db.js";

import type { 
    User
} from "../types/types.js";

export const registerUser = async (name:string, email:string, password:string):Promise<ResultSetHeader | null> => {
    const [loginData] = await pool.query<ResultSetHeader>(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, password]);
    return loginData;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
    const [user] = await pool.query<User[]>(`SELECT * FROM users WHERE email = ? LIMIT 1`, [email]);
    if (!user[0]) return null;
    return user[0];
};

export const getUserByName = async (name: string): Promise<User | null> => {
    const [user] = await pool.query<User[]>(`SELECT * FROM users WHERE name = ? LIMIT 1`, [name]);
    if (!user[0]) return null;
    return user[0];
};

export const getUserById = async (id:number):Promise<User | null> => {
    const [user] = await pool.query<User[]>(`SELECT * FROM users WHERE id = ? LIMIT 1`, [id]);
    if (!user[0]) return null;
    return user[0];
}

export const updateToken = async (refreshToken: string | null, expiry: Date | null, userId: number): Promise<boolean> => {
    const [result] = await pool.query<ResultSetHeader>(
        "UPDATE users SET refresh_token = ?, refresh_token_expires_at = ? WHERE id = ?",
        [refreshToken, expiry, userId]
    );
    return result.affectedRows > 0;
};

export const refreshSession = async (userId: number, token: string): Promise<boolean> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT id FROM users WHERE id = ? AND refresh_token = ? AND refresh_token_expires_at > NOW()`,
        [userId, token]
    );
    return rows.length > 0;
};