import type { RowDataPacket } from "mysql2";

export interface User extends RowDataPacket {
    id:Number, 
    email:string,
    password:string
}

export interface Post extends RowDataPacket {
    id:Number, 
    title: string, 
    description:string
}