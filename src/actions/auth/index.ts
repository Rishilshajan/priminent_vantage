/*
 * Auth Action Barrel File
 * Purpose: Provides a unified entry point for all role-specific authentication actions.
 * Usage: Allows importing any auth action directly from '@/actions/auth'.
*/

export { studentSignup, studentResetPassword } from './student.auth'
export { resetEnterprisePassword, enrollMFA, verifyMFA } from './enterprise.auth'
export { educatorSignup } from './educator.auth'
export { signOut, signInWithGoogle } from './shared.auth'
export { login } from './login.auth'
