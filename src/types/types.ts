import type { RowDataPacket } from "mysql2";

export interface User extends RowDataPacket {
    id?: number, 
    name: string,
    email:string,
    password: string
}

export type UserInput = {
    name?: string;
    email: string;
    password: string;
};

export type ValidationResult = {
    valid: boolean;
    errors: string[];
};

export interface Todo extends RowDataPacket {
    id?:number, 
    title:string,
    description: string,
    user_id: number
};

export type MultiQueryResult = [RowDataPacket[], RowDataPacket[], RowDataPacket[]];
