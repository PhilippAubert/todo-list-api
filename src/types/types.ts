import type { RowDataPacket } from "mysql2";

export interface User extends RowDataPacket {
    id: number, 
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

export interface Todo {
    id: number, 
    title: string,
    description: string,
    userId:number,
    created_at?: Date | null,
    updated_at?: Date | null
};

export type MultiQueryResult = [RowDataPacket[], RowDataPacket[], RowDataPacket[]];

export class AppError extends Error {
    constructor(public override message: string, public status: number) {
        super(message);
        this.name = "AppError";
        Object.setPrototypeOf(this, AppError.prototype);
    }
};

export type Tokens = {
    accessToken: string, 
    refreshToken: string
};