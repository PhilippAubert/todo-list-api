import type { RowDataPacket } from "mysql2";

export interface User extends RowDataPacket {
    id?: Number, 
    name: string,
    email:string,
    password: string
}

export interface Post extends RowDataPacket {
    id:Number, 
    title: string, 
    description:string
}

export type UserInput = {
    name: string;
    email: string;
    password: string;
};

export type ValidationResult = {
    valid: boolean;
    errors: string[];
};
