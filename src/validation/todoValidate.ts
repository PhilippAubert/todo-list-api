import { getUserById } from "../db/user.js";
import type { Todo, ValidationResult } from "../types/types.js";

export const validateTodo = async (todo:Todo):Promise<ValidationResult>=> {
    const errors : string[] = [];
    const {title, description, user_id} = todo;

    if (!title || !title.trim()) {
        errors.push("You need a title");
    }
    if (!description || !description.trim()) {
        errors.push("We need a description");
    }

    if (!user_id) {
        errors.push("No user id provided");
    }

    const existingUser = await getUserById(user_id);
    if (!existingUser?.id) errors.push("We cannot find this user!");
    
    return {
        valid: errors.length === 0,
        errors,
    };
}