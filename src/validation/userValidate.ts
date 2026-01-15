import type { UserInput, ValidationResult } from "../types/types.js";

export const validateUser = (user: UserInput): ValidationResult => {
    const errors: string[] = [];

    if (!user.name || !user.name.trim()) {
        errors.push("Name is required.");
    }

    if (!user.email || !user.email.trim()) {
        errors.push("Email is required.");
    } else if (!/^\S+@\S+\.\S+$/.test(user.email)) {
        errors.push("Email must be a valid email address.");
    }

    if (!user.password) {
        errors.push("Password is required.");
    } else if (user.password.length < 6) {
        errors.push("Password must be at least 6 characters.");
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};
