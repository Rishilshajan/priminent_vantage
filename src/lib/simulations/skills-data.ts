export interface SkillCategory {
    id: string;
    label: string;
    skills: string[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
    {
        id: 'languages',
        label: 'Programming Languages',
        skills: [
            'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go',
            'Rust', 'Swift', 'Kotlin', 'SQL', 'R', 'MATLAB', 'HTML5', 'CSS3', 'Sass'
        ]
    },
    {
        id: 'frameworks',
        label: 'Frameworks & Libraries',
        skills: [
            'React', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'Node.js', 'Express', 'NestJS',
            'Django', 'Flask', 'Spring Boot', 'Laravel', 'Ruby on Rails', 'Redux', 'TailwindCSS',
            'Bootstrap', 'Material UI', 'Pandas', 'NumPy', 'TensorFlow', 'PyTorch'
        ]
    },
    {
        id: 'backend',
        label: 'Backend & DevOps Tools',
        skills: [
            'AWS', 'Google Cloud (GCP)', 'Azure', 'Docker', 'Kubernetes', 'Terraform',
            'PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'Firebase', 'GraphQL', 'REST API',
            'Git', 'GitHub Actions', 'Jenkins', 'Nginx', 'Vercel'
        ]
    },
    {
        id: 'design',
        label: 'Design & Frontend Tools',
        skills: [
            'Figma', 'Adobe XD', 'Sketch', 'Canva', 'UX Research', 'Wireframing',
            'Prototyping', 'Responsive Design', 'Web Accessibility (A11y)', 'Storybook'
        ]
    },
    {
        id: 'marketing',
        label: 'Marketing & Analytics Tools',
        skills: [
            'Google Analytics', 'Search Engine Optimization (SEO)', 'Google Ads',
            'Meta Ads Manager', 'HubSpot', 'Salesforce', 'Mailchimp', 'Tableau',
            'Power BI', 'Mixpanel', 'Amplitude', 'Hotjar', 'A/B Testing'
        ]
    },
    {
        id: 'business',
        label: 'Business & PM Tools',
        skills: [
            'Jira', 'Asana', 'Trello', 'Notion', 'Slack', 'Microsoft Excel',
            'Financial Modeling', 'Market Research', 'Agile Methodology', 'Scrum',
            'Strategy Development', 'Product Roadmap'
        ]
    },
    {
        id: 'soft_skills',
        label: 'Soft Skills',
        skills: [
            'Communication', 'Teamwork', 'Leadership', 'Problem Solving',
            'Critical Thinking', 'Time Management', 'Adaptability', 'Emotional Intelligence',
            'Negotiation', 'Conflict Resolution', 'Presentation Skills', 'Storytelling',
            'Public Speaking', 'Attention to Detail', 'Strategic Thinking'
        ]
    }
];

export const ALL_SKILLS = SKILL_CATEGORIES.flatMap(cat => cat.skills);
