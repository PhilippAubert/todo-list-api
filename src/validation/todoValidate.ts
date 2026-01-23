import { getOneTodo } from "../db/todo.js";
import { getUserById } from "../db/user.js";
import type { Todo, ValidationResult } from "../types/types.js";

export const validateTodo = async (todo:Todo):Promise<ValidationResult>=> {
    const errors : string[] = [];
    const {id, title, description, userId} = todo;

    if (!title || !title.trim()) {
        errors.push("You need a title");
    }
    if (!description || !description.trim()) {
        errors.push("We need a description");
    }

    if (!userId) {
        errors.push("No user id provided");
    }

    const existingUser = await getUserById(userId);
    if (!existingUser?.id) errors.push("We cannot find this user!");

    const existingTodo = await getOneTodo(userId, id);
    if (!existingTodo?.created_at) errors.push("We cannot find this todo!");

    return {
        valid: errors.length === 0,
        errors,
    };
}