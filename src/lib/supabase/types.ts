export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    created_at: string
                    email: string
                    role: 'student' | 'admin' | 'super_admin' | 'enterprise'
                    first_name: string | null
                    last_name: string | null
                    avatar_url: string | null
                }
                Insert: {
                    id: string
                    created_at?: string
                    email: string
                    role?: 'student' | 'admin' | 'super_admin' | 'enterprise'
                    first_name?: string | null
                    last_name?: string | null
                    avatar_url?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    email?: string
                    role?: 'student' | 'admin' | 'super_admin' | 'enterprise'
                    first_name?: string | null
                    last_name?: string | null
                    avatar_url?: string | null
                }
            }
            // Add other tables as needed based on usage
        }
    }
}
