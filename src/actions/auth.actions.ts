'use server'

/**
 * This file is now a entry point that re-exports actions from role-specific modules.
 * New actions should be added to their respective files in @/actions/auth/
 */

export * from './auth/index'

// For specific imports that might expect the old function names if they changed
// (Currently we kept most names the same or provided replacements)
import { studentSignup, studentResetPassword } from './auth/student.auth'

// Map legacy signup to studentSignup (the default)
export const signup = studentSignup
export const resetPasswordForEmail = studentResetPassword

