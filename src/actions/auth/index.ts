/*
 * Auth Action Barrel File
 * Purpose: Provides a unified entry point for all role-specific authentication actions.
 * Usage: Allows importing any auth action directly from '@/actions/auth'.
*/

export * from './student.auth'
export * from './enterprise.auth'
export * from './educator.auth'
export * from './shared.auth'
export * from './login.auth'
