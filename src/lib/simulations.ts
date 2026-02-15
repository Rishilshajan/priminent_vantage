import { z } from "zod";

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface Simulation {
    id: string;
    org_id: string;
    created_by: string | null;
    title: string;
    description: string | null;
    short_description: string | null;
    industry: string | null;
    target_role: string | null;
    duration: string | null;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced' | null;
    program_type: 'job_simulation' | 'career_exploration' | 'skill_sprint' | 'case_study' | 'internship_preview';
    learning_outcomes: string[];
    prerequisites: string | null;
    target_audience: string | null;
    visibility: 'draft' | 'internal' | 'educator_assigned' | 'public' | 'private' | 'archived';
    analytics_tags: string[];
    certificate_enabled: boolean;
    company_logo_url: string | null;
    banner_url: string | null;
    intro_video_url: string | null;
    about_company: string | null;
    why_work_here: string | null;
    status: 'draft' | 'published' | 'archived';
    published_at: string | null;
    created_at: string;
    updated_at: string;
    simulation_skills?: SimulationSkill[];
}

export interface SimulationTask {
    id: string;
    simulation_id: string;
    order_index: number;
    title: string;
    introduction: string | null;
    instructions: string | null;
    learning_objectives: string[] | null;
    attachments: { file_url: string; file_name: string; file_type: string }[] | null;
    video_url: string | null;
    deliverable_type: 'TEXT' | 'FILE_UPLOAD' | 'MULTIPLE_CHOICE' | 'CODE_SNIPPET' | 'REFLECTION_ONLY';
    submission_instructions: string | null;
    internal_notes: string | null;
    estimated_time: string | null;
    is_required: boolean;
    unlock_condition: 'SEQUENTIAL' | 'ALWAYS_OPEN';
    status: 'incomplete' | 'ready';
    created_at: string;
    updated_at: string;

    // Legacy support (optional, keep if needed during migration)
    task_number?: number;
    description?: string | null;
    estimated_duration?: string | null;
    submission_type?: string;
    what_you_learn?: string[] | null;
    supporting_docs?: { name: string; url: string }[];
    video_assets?: { title: string; url: string; type: 'upload' | 'embed' }[];
}

export interface SimulationSkill {
    id: string;
    simulation_id: string;
    skill_name: string;
    skill_type: 'technical' | 'soft_skill' | null;
    created_at: string;
}

export interface SimulationAsset {
    id: string;
    simulation_id: string;
    task_id: string | null;
    asset_type: 'logo' | 'banner' | 'video' | 'pdf' | 'dataset' | 'document';
    file_name: string;
    file_url: string;
    file_size: number | null;
    mime_type: string | null;
    uploaded_by: string | null;
    created_at: string;
}

// ============================================
// VALIDATION SCHEMAS
// ============================================

export const SimulationMetadataSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
    description: z.string().optional(),
    short_description: z.string().max(500, "Short description must be less than 500 characters").optional(),
    industry: z.string().optional(),
    target_role: z.string().optional(),
    duration: z.string().optional(),
    difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    program_type: z.enum(['job_simulation', 'career_exploration', 'skill_sprint', 'case_study', 'internship_preview']).default('job_simulation'),
    learning_outcomes: z.array(z.string()).default([]),
    prerequisites: z.string().optional(),
    target_audience: z.string().optional(),
    visibility: z.enum(['draft', 'internal', 'educator_assigned', 'public', 'private', 'archived']).default('draft'),
    analytics_tags: z.array(z.string()).default([]),
    certificate_enabled: z.boolean().default(true),
});

export const SimulationBrandingSchema = z.object({
    company_logo_url: z.string().optional(),
    banner_url: z.string().optional(),
    intro_video_url: z.string().optional(),
    about_company: z.string().optional(),
    why_work_here: z.string().optional(),
});

export const SimulationTaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    introduction: z.string().optional().nullable(),
    instructions: z.string().optional().nullable(),
    learning_objectives: z.array(z.string()).default([]),
    attachments: z.array(z.object({
        file_url: z.string(),
        file_name: z.string(),
        file_type: z.string()
    })).default([]),
    video_url: z.string().optional().nullable(),
    deliverable_type: z.enum(['TEXT', 'FILE_UPLOAD', 'MULTIPLE_CHOICE', 'CODE_SNIPPET', 'REFLECTION_ONLY']).default('TEXT'),
    submission_instructions: z.string().optional().nullable(),
    internal_notes: z.string().optional().nullable(),
    estimated_time: z.string().optional().nullable(),
    is_required: z.boolean().default(true),
    unlock_condition: z.enum(['SEQUENTIAL', 'ALWAYS_OPEN']).default('SEQUENTIAL'),
    status: z.enum(['incomplete', 'ready']).default('incomplete'),
    order_index: z.number().optional(),
    task_number: z.number().optional(),
    sort_order: z.number().optional(),
});

// ============================================
// CONSTANTS
// ============================================

export const INDUSTRIES = [
    'Financial Services',
    'Technology',
    'Consulting',
    'Healthcare',
    'Marketing',
    'Engineering',
    'Retail',
    'Legal',
] as const;

export const TARGET_ROLES = [
    'Software Engineer',
    'Data Analyst',
    'Product Manager',
    'Business Analyst',
    'Marketing Manager',
    'Investment Banker',
    'UX Designer',
] as const;

export const DURATIONS = [
    '2-4 hours',
    '4-6 hours',
    '6-8 hours',
    '8-10 hours',
    '10-12 hours',
    '12+ hours',
] as const;

export const DIFFICULTY_LEVELS = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
] as const;

export const PROGRAM_TYPES = [
    { value: 'job_simulation', label: 'Job Simulation' },
    { value: 'career_exploration', label: 'Career Exploration' },
    { value: 'skill_sprint', label: 'Skill Sprint' },
    { value: 'case_study', label: 'Case Study' },
    { value: 'internship_preview', label: 'Internship Preview' },
] as const;

export const AUDIENCE_LEVELS = [
    { value: '1st Year Students', label: '1st Year Students' },
    { value: 'Final Year Students', label: 'Final Year Students' },
    { value: 'Early Professionals', label: 'Early Professionals' },
    { value: 'Career Switchers', label: 'Career Switchers' },
    { value: 'Anyone', label: 'Anyone' },
] as const;

export const VISIBILITY_OPTIONS = [
    {
        value: 'draft',
        label: 'Draft',
        description: 'Only visible to builder. Students cannot see or enroll. Educator cannot assign.'
    },
    {
        value: 'internal',
        label: 'Internal (Enterprise Only)',
        description: 'Visible ONLY to students tied to your enterprise. Ideal for internal hiring or culture previews.'
    },
    {
        value: 'educator_assigned',
        label: 'Educator-Assigned',
        description: 'Visible only within an educator\'s classroom. Does not appear in the public explore page.'
    },
    {
        value: 'public',
        label: 'Public',
        description: 'Visible in the public explore page. Anyone can enroll. Boosts brand exposure and talent pool.'
    },
    {
        value: 'private',
        label: 'Private (Invite Only)',
        description: 'Not discoverable publicly. Accessible only via a direct invitation link for specific recruitment batches.'
    },
    {
        value: 'archived',
        label: 'Archived',
        description: 'Historical data is preserved for analytics, but the program is closed to new student enrollments.'
    },
] as const;

// ============================================
// HELPERS
// ============================================

export function canPublishSimulation(simulation: Simulation, tasks: SimulationTask[] = []): { canPublish: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!simulation.title) errors.push("Title is required");
    if (!simulation.description) errors.push("Description is required");
    if (!simulation.industry) errors.push("Industry is required");
    if (!simulation.target_role) errors.push("Target role is required");
    if (!simulation.company_logo_url) errors.push("Company logo is required");
    if (!simulation.banner_url) errors.push("Banner image is required");

    if (tasks.length === 0) {
        errors.push("At least one task is required");
    } else {
        const readyTasks = tasks.filter(t => t.status === 'ready');
        if (readyTasks.length === 0) {
            errors.push("At least one task must be marked as 'Ready'");
        }
    }

    return {
        canPublish: errors.length === 0,
        errors
    };
}
