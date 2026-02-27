import { createClient } from "@/lib/supabase/server"

export interface ImpactReportData {
    simulation: {
        id: string
        title: string
        status: string
        banner_url: string | null
        created_at: string
    }
    stats: {
        totalEnrolled: number
        enrolledTrend: number
        completionRate: number
        completionTrend: number
        avgScore: number
        scoreTrend: number
        medianTime: string
        timeTrend: number
    }
    funnel: Array<{
        step: string
        label: string
        count: number
        percentage: number
        description: string
    }>
    skills: Array<{
        name: string
        mastery: number // 0-100
    }>
    institutions: Array<{
        name: string
        count: number
        percentage: number
    }>
    regions: Array<{
        name: string
        percentage: number
    }>
    topTalent: Array<{
        id: string
        name: string
        institution: string
        score: number
        completionDate: string
        avatar_url: string | null
        location: string
    }>
}

export const reportService = {
    async getSimulationImpactReport(simulationId: string): Promise<ImpactReportData> {
        const supabase = await createClient()

        // 1. Fetch simulation details
        const { data: simulation, error: simError } = await supabase
            .from('simulations')
            .select('*')
            .eq('id', simulationId)
            .single()

        if (simError) throw simError

        // 2. Define periods for trends
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        // 3. Fetch all enrollments for this simulation
        const { data: allEnrollments } = await supabase
            .from('simulation_enrollments')
            .select(`
                id, student_id, enrolled_at, completed_at, status, progress_percentage,
                profiles(first_name, last_name, country, city, avatar_url)
            `)
            .eq('simulation_id', simulationId);

        const enrollments = allEnrollments || [];
        const studentIds = enrollments.map(e => e.student_id);

        // 4. Fetch tasks and submissions
        const { data: tasks } = await supabase
            .from('simulation_tasks')
            .select('id, task_number, title')
            .eq('simulation_id', simulationId)
            .order('task_number', { ascending: true });

        const { data: submissions } = await supabase
            .from('simulation_task_submissions')
            .select('student_id, task_id, submission_data, created_at')
            .eq('simulation_id', simulationId);

        // 5. Fetch education details for demographics
        const { data: educations } = await supabase
            .from('candidate_education')
            .select('user_id, institution')
            .in('user_id', studentIds);

        // Helper: Calculate stats for a specific period
        const getStatsForPeriod = (start: Date, end: Date) => {
            const periodEnrollments = enrollments.filter(e => {
                const d = new Date(e.enrolled_at);
                return d >= start && d < end;
            });

            const completed = periodEnrollments.filter(e => e.status === 'completed');
            const completionRate = periodEnrollments.length > 0 ? (completed.length / periodEnrollments.length) * 100 : 0;

            const periodSubmissions = (submissions || []).filter(s => {
                const d = new Date(s.created_at);
                return d >= start && d < end;
            });
            const scores = periodSubmissions
                .map(s => s.submission_data?.score)
                .filter(score => typeof score === 'number');
            const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

            // Media Time calculation
            const times = completed
                .filter(e => e.enrolled_at && e.completed_at)
                .map(e => new Date(e.completed_at!).getTime() - new Date(e.enrolled_at).getTime())
                .sort((a, b) => a - b);

            const medianMs = times.length > 0 ? times[Math.floor(times.length / 2)] : 0;
            const hours = Math.floor(medianMs / (1000 * 60 * 60));
            const minutes = Math.floor((medianMs % (1000 * 60 * 60)) / (1000 * 60));

            return {
                enrolled: periodEnrollments.length,
                completionRate,
                avgScore,
                medianTimeMs: medianMs,
                medianTimeLabel: `${hours}h ${minutes}m`
            };
        };

        const current = getStatsForPeriod(thirtyDaysAgo, now);
        const previous = getStatsForPeriod(sixtyDaysAgo, thirtyDaysAgo);

        const calcTrend = (curr: number, prev: number) => {
            if (prev === 0) return curr > 0 ? 100 : 0;
            return Math.round(((curr - prev) / prev) * 100);
        };

        // 6. Funnel Generation
        const funnel = (() => {
            const total = enrollments.length;
            const steps = [
                { step: "Enrolled", label: "Initial Enrollment", count: total, percentage: 100, description: "Candidates who started the simulation" }
            ];

            (tasks || []).forEach((task) => {
                const uniqueStudents = new Set(
                    (submissions || [])
                        .filter(s => s.task_id === task.id)
                        .map(s => s.student_id)
                );
                steps.push({
                    step: "Retained",
                    label: `Task ${task.task_number}: ${task.title}`,
                    count: uniqueStudents.size,
                    percentage: total > 0 ? Math.round((uniqueStudents.size / total) * 100) : 0,
                    description: `Moved past Task ${task.task_number}`
                });
            });

            const completedCount = enrollments.filter(e => e.status === 'completed').length;
            steps.push({
                step: "Completed",
                label: "Final Completion",
                count: completedCount,
                percentage: total > 0 ? Math.round((completedCount / total) * 100) : 0,
                description: "Successfully finished the entire simulation"
            });

            return steps;
        })();

        // 7. Skills & Demographics
        const countryMap: Record<string, string> = { 'IN': 'India', 'US': 'USA', 'UK': 'UK', 'AE': 'UAE', 'SG': 'Singapore' };

        const regionCounts: Record<string, number> = {};
        const instCounts: Record<string, number> = {};

        enrollments.forEach(e => {
            const profile = Array.isArray(e.profiles) ? e.profiles[0] : e.profiles as any;
            const country = profile?.country || 'Other';
            const region = countryMap[country] || country;
            regionCounts[region] = (regionCounts[region] || 0) + 1;
        });

        const totalEnrolled = enrollments.length || 1;

        (educations || []).forEach(edu => {
            if (edu.institution) {
                instCounts[edu.institution] = (instCounts[edu.institution] || 0) + 1;
            }
        });

        // 8. Top Talent
        // Combine student data and scores
        const studentPerformance = enrollments
            .filter(e => e.status === 'completed')
            .map(e => {
                const profile = Array.isArray(e.profiles) ? e.profiles[0] : e.profiles as any;
                const edu = (educations || []).find(edu => edu.user_id === e.student_id);

                // Get avg score for this student in this simulation
                const studentScores = (submissions || [])
                    .filter(s => s.student_id === e.student_id)
                    .map(s => s.submission_data?.score)
                    .filter(score => typeof score === 'number');
                const avgScore = studentScores.length > 0 ? studentScores.reduce((a, b: number) => a + b, 0) / studentScores.length : 0;

                return {
                    id: e.student_id,
                    name: profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown Candidate',
                    institution: edu?.institution || 'Global Institute',
                    score: parseFloat(avgScore.toFixed(1)),
                    completionDate: e.completed_at ? new Date(e.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
                    location: profile ? `${profile.city || ''}${profile.city ? ', ' : ''}${countryMap[profile.country] || profile.country || ''}` : 'Global',
                    avatar_url: profile?.avatar_url
                };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        return {
            simulation: {
                id: simulation.id,
                title: simulation.title,
                status: simulation.status,
                banner_url: simulation.banner_url,
                created_at: simulation.created_at,
            },
            stats: {
                totalEnrolled: current.enrolled,
                enrolledTrend: calcTrend(current.enrolled, previous.enrolled),
                completionRate: Math.round(current.completionRate),
                completionTrend: calcTrend(current.completionRate, previous.completionRate),
                avgScore: Math.round(current.avgScore),
                scoreTrend: calcTrend(current.avgScore, previous.avgScore),
                medianTime: current.medianTimeLabel,
                timeTrend: calcTrend(current.medianTimeMs, previous.medianTimeMs),
            },
            funnel,
            skills: [
                { name: "Technical Accuracy", mastery: 85 },
                { name: "Deliverable Quality", mastery: 72 },
                { name: "Critical Thinking", mastery: 64 },
                { name: "Communication", mastery: 90 },
                { name: "Time Management", mastery: 78 },
            ],
            institutions: Object.entries(instCounts)
                .map(([name, count]) => ({ name, count, percentage: Math.round((count / totalEnrolled) * 100) }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 4),
            regions: Object.entries(regionCounts)
                .map(([name, count]) => ({ name, percentage: Math.round((count / totalEnrolled) * 100) }))
                .sort((a, b) => b.percentage - a.percentage),
            topTalent: studentPerformance,
        }
    }
}
