'use server'

export * from './auth/index'

import { studentSignup, studentResetPassword } from './auth/student.auth'

// Map legacy signup to studentSignup (the default)
export const signup = studentSignup
export const resetPasswordForEmail = studentResetPassword

