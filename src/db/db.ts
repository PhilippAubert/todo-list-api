import mysql, { type ResultSetHeader }  from "mysql2";

import dotenv from "dotenv";

import type { 
    User, 
    Post
} from "../types/types.js";

dotenv.config();

const pool = mysql.createPool({
    host: process.env["DB_HOST"] ?? "",
    user: process.env["DB_USER"] ?? "",
    database: process.env["DB"] ?? "",
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, 
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
}).promise();

const users = await pool.query<User[]>("SELECT * FROM users");

console.log(users);

const [posts] = await pool.query<Post[]>("SELECT * FROM todos");
if (posts.length !== 0) {
    console.log(posts);
} else {
    console.log("NOTHING POSTED THERE I THINK");
}

export const registerUser = async (name:string, email:string, password:string) => {
    const login = await pool.query<ResultSetHeader>(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, password]);
    return login;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
    const [rows] = await pool.query<User[]>(`SELECT * FROM users WHERE email = ? LIMIT 1`, [email]);
    if (!rows[0]) return null;
    return rows[0];
};

export const getUserByName = async (name: string): Promise<User | null> => {
    const [rows] = await pool.query<User[]>(`SELECT * FROM users WHERE name = ? LIMIT 1`, [name]);
    if (!rows[0]) return null;
    return rows[0];
};