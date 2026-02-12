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
    program_type: 'job_simulation' | 'career_exploration' | 'skill_lab';
    company_logo_url: string | null;
    banner_url: string | null;
    intro_video_url: string | null;
    about_company: string | null;
    why_work_here: string | null;
    status: 'draft' | 'published' | 'archived';
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface SimulationTask {
    id: string;
    simulation_id: string;
    task_number: number;
    title: string;
    description: string | null;
    scenario_context: string | null;
    estimated_duration: string | null;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced' | null;
    instructions: string | null;
    what_you_learn: string[] | null;
    what_you_do: string | null;
    video_url: string | null;
    pdf_brief_url: string | null;
    dataset_url: string | null;
    supporting_docs: { name: string; url: string }[];
    submission_type: 'file_upload' | 'text' | 'mcq' | 'self_paced';
    submission_config: Record<string, unknown>;
    status: 'incomplete' | 'ready';
    sort_order: number;
    created_at: string;
    updated_at: string;
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
    program_type: z.enum(['job_simulation', 'career_exploration', 'skill_lab']).default('job_simulation'),
});

export const SimulationBrandingSchema = z.object({
    company_logo_url: z.string().url().optional(),
    banner_url: z.string().url().optional(),
    intro_video_url: z.string().url().optional(),
    about_company: z.string().optional(),
    why_work_here: z.string().optional(),
});

export const SimulationTaskSchema = z.object({
    task_number: z.number().int().positive(),
    title: z.string().min(1, "Task title is required"),
    description: z.string().optional(),
    scenario_context: z.string().optional(),
    estimated_duration: z.string().optional(),
    difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    instructions: z.string().optional(),
    what_you_learn: z.array(z.string()).optional(),
    what_you_do: z.string().optional(),
    submission_type: z.enum(['file_upload', 'text', 'mcq', 'self_paced']).default('self_paced'),
    sort_order: z.number().int(),
});

// ============================================
// CONSTANTS
// ============================================

export const INDUSTRIES = [
    'Financial Services',
    'Technology',
    'Consulting',
    'Healthcare',
    'Retail',
    'Manufacturing',
    'Education',
    'Media & Entertainment',
    'Real Estate',
    'Energy',
    'Other',
] as const;

export const TARGET_ROLES = [
    'Junior Data Analyst',
    'Investment Associate',
    'Product Manager',
    'Software Engineer',
    'Marketing Specialist',
    'Business Analyst',
    'UX Designer',
    'Financial Analyst',
    'Consultant',
    'Project Manager',
    'Other',
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
    { value: 'skill_lab', label: 'Skill Lab' },
] as const;

// Common technical skills
export const TECHNICAL_SKILLS = [
    'Python',
    'JavaScript',
    'SQL',
    'Data Visualization',
    'Machine Learning',
    'React',
    'Node.js',
    'AWS',
    'Docker',
    'Git',
    'Tableau',
    'Power BI',
    'Excel',
    'Financial Modeling',
    'Market Research',
    'A/B Testing',
    'SEO',
    'Content Strategy',
    'UX Research',
    'Figma',
] as const;

// Common soft skills
export const SOFT_SKILLS = [
    'Communication',
    'Critical Thinking',
    'Problem Solving',
    'Teamwork',
    'Leadership',
    'Time Management',
    'Adaptability',
    'Creativity',
    'Attention to Detail',
    'Strategic Thinking',
    'Presentation',
    'Negotiation',
    'Conflict Resolution',
] as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate a unique certificate ID
 */
export function generateCertificateId(): string {
    const year = new Date().getFullYear();
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CERT-${year}-${randomString}`;
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(completedTasks: number, totalTasks: number): number {
    if (totalTasks === 0) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
}

/**
 * Format duration for display
 */
export function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Get skill suggestions based on industry and role
 */
export function getSkillSuggestions(industry?: string, role?: string): string[] {
    const suggestions: string[] = [];

    // Industry-based suggestions
    if (industry === 'Technology') {
        suggestions.push('JavaScript', 'Python', 'React', 'Node.js', 'AWS');
    } else if (industry === 'Financial Services') {
        suggestions.push('Financial Modeling', 'Excel', 'SQL', 'Data Visualization');
    } else if (industry === 'Consulting') {
        suggestions.push('Strategic Thinking', 'Presentation', 'Problem Solving', 'Excel');
    }

    // Role-based suggestions
    if (role?.includes('Data')) {
        suggestions.push('SQL', 'Python', 'Tableau', 'Data Visualization');
    } else if (role?.includes('Product')) {
        suggestions.push('UX Research', 'A/B Testing', 'Strategic Thinking');
    } else if (role?.includes('Software')) {
        suggestions.push('JavaScript', 'Git', 'React', 'Node.js');
    }

    // Always include soft skills
    suggestions.push('Communication', 'Critical Thinking', 'Problem Solving');

    // Remove duplicates and return
    return Array.from(new Set(suggestions));
}

/**
 * Validate simulation can be published
 */
export function canPublishSimulation(simulation: Partial<Simulation>, tasks: SimulationTask[]): {
    canPublish: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    // Check required metadata
    if (!simulation.title) errors.push('Title is required');
    if (!simulation.description) errors.push('Description is required');
    if (!simulation.industry) errors.push('Industry is required');
    if (!simulation.target_role) errors.push('Target role is required');
    if (!simulation.duration) errors.push('Duration is required');
    if (!simulation.difficulty_level) errors.push('Difficulty level is required');

    // Check branding
    if (!simulation.company_logo_url) errors.push('Company logo is required');
    if (!simulation.banner_url) errors.push('Banner image is required');

    // Check tasks
    if (tasks.length === 0) {
        errors.push('At least one task is required');
    } else {
        const incompleteTasks = tasks.filter(t => t.status === 'incomplete');
        if (incompleteTasks.length > 0) {
            errors.push(`${incompleteTasks.length} task(s) are incomplete`);
        }
    }

    return {
        canPublish: errors.length === 0,
        errors,
    };
}
