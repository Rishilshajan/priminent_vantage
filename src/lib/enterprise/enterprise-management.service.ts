import { createClient } from "@/lib/supabase/server";
import { uploadToS3 } from "@/lib/s3/index";

export const enterpriseManagementService = {
    // Fetches aggregate statistics for the admin enterprise overview (total requests, approvals, conversions)
    async getStats() {
        const supabase = await createClient();
        try {
            const { count: totalRequests } = await supabase.from('enterprise_requests').select('*', { count: 'exact', head: true });
            const { count: pendingRequests } = await supabase.from('enterprise_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending');
            const { count: approvedOrgs } = await supabase.from('enterprise_requests').select('*', { count: 'exact', head: true }).eq('status', 'approved');

            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const { count: requestsThisWeek } = await supabase.from('enterprise_requests').select('*', { count: 'exact', head: true }).gte('created_at', oneWeekAgo.toISOString());

            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const { count: monthlyOnboardings } = await supabase.from('enterprise_requests').select('*', { count: 'exact', head: true }).eq('status', 'approved').gte('created_at', firstDayOfMonth.toISOString());

            return {
                totalRequests: totalRequests || 0,
                pendingRequests: pendingRequests || 0,
                approvedOrgs: approvedOrgs || 0,
                requestsThisWeek: requestsThisWeek || 0,
                monthlyOnboardings: monthlyOnboardings || 0,
                avgResponseTime: "4.2h",
                conversionRate: "68.4%"
            };
        } catch (err) {
            console.error("Error in enterpriseManagementService.getStats:", err);
            throw err;
        }
    },

    // Returns dashboard KPIs and enrollment chart data for the enterprise's active simulations filtered by period
    async getDashboardMetrics(userId: string, period: string = 'all', month?: number, year?: number) {
        const supabase = await createClient();
        try {
            let { data: member } = await supabase.from('organization_members').select('org_id, organizations(*)').eq('user_id', userId).maybeSingle();
            const { data: userProfile } = await supabase.from('profiles').select('first_name, last_name, email, role').eq('id', userId).single();

            if (!member && (userProfile?.role === 'admin' || userProfile?.role === 'super_admin')) {
                const { data: recentOrg } = await supabase.from('organizations').select('*').eq('status', 'active').order('created_at', { ascending: false }).limit(1).single();
                if (recentOrg) member = { org_id: recentOrg.id, organizations: recentOrg } as any;
            }

            if (!member || !member.organizations) {
                return {
                    organization: null,
                    stats: {
                        totalEnrollments: { value: "0", change: "N/A", trend: "neutral" },
                        completionRate: { value: "0%", change: "N/A", trend: "neutral" },
                        avgTimeToComplete: { value: "N/A", change: "N/A", trend: "neutral" },
                        activeSimulations: { value: "0", change: "N/A", trend: "neutral" }
                    },
                    chartData: Array.from({ length: 6 }).map((_, i) => ({
                        month: new Date(new Date().getFullYear(), new Date().getMonth() - (5 - i), 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                        enrollments: 0,
                        completions: 0
                    })),
                    activePrograms: [],
                    topInstructors: [],
                    userProfile
                };
            }
            const orgId = member.org_id;

            // We'll calculate the 'end date' for our 6-month window based on month/year or 'now'
            const endDate = (month !== undefined && year !== undefined)
                ? new Date(year, month + 1, 0) // Last day of selected month
                : new Date();

            // Build the base query for enrollments
            let enrollmentsQuery = supabase
                .from('simulation_enrollments')
                .select(`
                    id, status, enrolled_at, completed_at, simulation_id,
                    simulations!inner(id, title, industry, duration, org_id)
                `)
                .eq('simulations.org_id', orgId);

            // Apply period filter if month/year are not provided
            if (month === undefined && year === undefined && period === '30d') {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                enrollmentsQuery = enrollmentsQuery.gte('enrolled_at', thirtyDaysAgo.toISOString());
            }

            const { data: enrollmentsData, error: enrollmentsError } = await enrollmentsQuery;
            if (enrollmentsError) throw enrollmentsError;

            const { data: simulations } = await supabase
                .from('simulations')
                .select(`
                    *,
                    simulation_enrollments(count)
                `)
                .eq('org_id', orgId)
                .eq('status', 'published')
                .order('updated_at', { ascending: false });

            // --- CALCULATIONS ---

            // If filtering by specific month/year, we should show stats for THAT month
            const filterDataForStats = (data: any[]) => {
                if (month !== undefined && year !== undefined) {
                    return data.filter(e => {
                        const d = new Date(e.enrolled_at);
                        return d.getMonth() === month && d.getFullYear() === year;
                    });
                }
                return data; // If no specific month/year, use the data already filtered by 'period'
            };

            const statsEnrollments = filterDataForStats(enrollmentsData || []);
            const totalEnrollmentsCount = statsEnrollments.length;
            const completedEnrollments = statsEnrollments.filter(e => e.status === 'completed' && e.completed_at && e.enrolled_at);
            const completionRateValue = totalEnrollmentsCount > 0
                ? Math.round((completedEnrollments.length / totalEnrollmentsCount) * 100)
                : 0;

            let avgTime = "N/A";
            if (completedEnrollments.length > 0) {
                const totalMinutes = completedEnrollments.reduce((acc, curr) => {
                    const start = new Date(curr.enrolled_at);
                    const end = new Date(curr.completed_at);
                    return acc + (end.getTime() - start.getTime()) / (1000 * 60);
                }, 0);
                const avgMins = Math.round(totalMinutes / completedEnrollments.length);
                avgTime = avgMins >= 60 ? `${(avgMins / 60).toFixed(1)}h` : `${avgMins}m`;
            }

            // Generate real chart data for the last 6 months relative to endDate
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const chartDataList: { month: string; enrollments: number; completions: number }[] = [];

            for (let i = 5; i >= 0; i--) {
                const d = new Date(endDate.getFullYear(), endDate.getMonth() - i, 1);
                const label = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;

                const monthEnrollments = (enrollmentsData || []).filter(e => {
                    const enrollDate = new Date(e.enrolled_at);
                    return enrollDate.getMonth() === d.getMonth() && enrollDate.getFullYear() === d.getFullYear();
                });

                const monthCompletions = (enrollmentsData || []).filter(e => {
                    if (e.status !== 'completed' || !e.completed_at) return false;
                    const completeDate = new Date(e.completed_at);
                    return completeDate.getMonth() === d.getMonth() && completeDate.getFullYear() === d.getFullYear();
                });

                chartDataList.push({
                    month: label,
                    enrollments: monthEnrollments.length,
                    completions: monthCompletions.length
                });
            }

            // --- FETCH TOP INSTRUCTORS ---
            const { data: instructors } = await supabase
                .from('organization_members')
                .select(`
                    role,
                    profiles!inner(
                        id, 
                        first_name, 
                        last_name, 
                        avatar_url,
                        instructor_profiles(professional_title)
                    )
                `)
                .eq('org_id', orgId)
                .in('role', ['owner', 'enterprise_admin', 'instructor', 'reviewer'])
                .order('joined_at', { ascending: true })
                .limit(4);

            const topInstructors = (instructors || []).map((member: any, index: number) => {
                const profile = member.profiles;
                const instructorProfileArr = profile.instructor_profiles;
                const instructorProfile = Array.isArray(instructorProfileArr)
                    ? instructorProfileArr[0]
                    : instructorProfileArr;

                const name = `${profile.first_name} ${profile.last_name}`.trim();
                const initials = `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase();

                return {
                    id: profile.id,
                    name,
                    role: instructorProfile?.professional_title || member.role.replace(/_/g, ' '),
                    score: 98 - (index * 2), // Mock score for visual hierarchy
                    initials,
                    avatar: profile.avatar_url
                };
            });

            return {
                organization: member.organizations,
                stats: {
                    totalEnrollments: { value: totalEnrollmentsCount.toLocaleString(), change: month !== undefined ? `${monthNames[month]} ${year}` : (period === '30d' ? "Last 30 Days" : "All Time"), trend: "neutral" },
                    completionRate: { value: `${completionRateValue}%`, change: "Avg.", trend: "neutral" },
                    avgTimeToComplete: { value: avgTime, change: "Avg.", trend: "neutral" },
                    activeSimulations: { value: (simulations?.length || 0).toString(), change: "Published", trend: "up" }
                },
                chartData: chartDataList,
                activePrograms: simulations?.slice(0, 4).map(sim => {
                    const simEnrollments = (enrollmentsData || []).filter(e => e.simulation_id === sim.id);
                    const completed = simEnrollments.filter(e => e.status === 'completed').length;
                    const total = simEnrollments.length;
                    const rateValue = total > 0 ? Math.round((completed / total) * 100) : 0;

                    return {
                        id: sim.id,
                        name: sim.title,
                        department: sim.industry || "General",
                        status: "STABLE",
                        duration: sim.duration || "N/A",
                        enrolled: total.toLocaleString(),
                        rate: rateValue,
                        color: "primary"
                    };
                }) || [],
                topInstructors,
                userProfile
            };
        } catch (err) {
            console.error("Error in enterpriseManagementService.getDashboardMetrics:", err);
            throw err;
        }
    },

    // Fetches simulation-level metrics (published count, skill counts, enrollments) for an enterprise org
    async getSimulationsMetrics(userId: string) {
        const supabase = await createClient();
        try {
            const { data: membership } = await supabase.from('organization_members').select('org_id, organizations(id, name)').eq('user_id', userId).single();
            if (!membership) throw new Error("No organization found");
            const orgId = membership.org_id;

            const { data: simulations } = await supabase.from('simulations').select('*, simulation_tasks(id), simulation_skills(id)').eq('org_id', orgId).order('updated_at', { ascending: false });
            const { data: userProfile } = await supabase.from('profiles').select('first_name, last_name, email, role').eq('id', userId).single();

            const activeSimulations = simulations?.filter(s => s.status === 'published').length || 0;
            const skillsAssessed = simulations?.reduce((acc, s) => acc + (Array.isArray(s.simulation_skills) ? s.simulation_skills.length : 0), 0) || 0;

            return {
                organization: membership.organizations,
                stats: { totalEnrollments: 0, activeSimulations, completionRate: 0, skillsAssessed },
                simulations: simulations || [],
                userProfile
            };
        } catch (err) {
            console.error("Error in enterpriseManagementService.getSimulationsMetrics:", err);
            throw err;
        }
    },

    // Fetches the authenticated enterprise user's profile and their organization's name
    async getUser(userId: string) {
        const supabase = await createClient();
        try {
            const { data: userProfile } = await supabase.from('profiles').select('first_name, last_name, email, role, avatar_url').eq('id', userId).single();
            const { data: member } = await supabase.from('organization_members').select('organizations(name, logo_url)').eq('user_id', userId).maybeSingle();
            const org = member?.organizations as any;
            const orgName = org?.name || "Enterprise";
            const orgLogo = org?.logo_url || null;
            return { userProfile, orgName, orgLogo };
        } catch (err) {
            console.error("Error in enterpriseManagementService.getUser:", err);
            throw err;
        }
    },

    // Fetches the full organization record (logo, colors, cert settings, etc.) by org ID
    async getBranding(orgId: string) {
        const supabase = await createClient();
        try {
            const { data: org } = await supabase.from('organizations').select('*').eq('id', orgId).single();
            return org;
        } catch (err) {
            console.error("Error in enterpriseManagementService.getBranding:", err);
            throw err;
        }
    },

    // Updates organization branding fields and records the last-updated timestamp and author
    async updateBranding(userId: string, data: any) {
        const supabase = await createClient();
        try {
            const { data: member } = await supabase.from('organization_members').select('org_id, role').eq('user_id', userId).maybeSingle();
            if (!member || !['enterprise_admin', 'owner', 'admin', 'billing'].includes(member.role)) throw new Error("Unauthorized");

            const { data: profile } = await supabase.from('profiles').select('first_name, last_name').eq('id', userId).single();
            const updatedBy = profile ? `${profile.first_name} ${profile.last_name}`.trim() : userId;

            const { error } = await supabase.from('organizations').update({ ...data, last_updated_at: new Date().toISOString(), last_updated_by: updatedBy }).eq('id', member.org_id);
            if (error) throw error;
            return true;
        } catch (err) {
            console.error("Error in enterpriseManagementService.updateBranding:", err);
            throw err;
        }
    },

    // Uploads a branding asset (logo or signature) to S3 and updates the matching org column
    async uploadAsset(userId: string, assetType: 'logo' | 'signature', file: File) {
        const supabase = await createClient();
        try {
            const { data: member } = await supabase.from('organization_members').select('org_id, role').eq('user_id', userId).maybeSingle();
            if (!member || !['enterprise_admin', 'owner', 'admin'].includes(member.role)) throw new Error("Access denied");

            const folderMap: Record<string, string> = { logo: 'organization-logos', signature: 'organization-signatures' };
            const folder = folderMap[assetType] || 'organization-misc';

            const { url } = await uploadToS3({ file, fileName: file.name, folder, orgId: member.org_id });

            await supabase.from('simulation_assets').insert({
                org_id: member.org_id,
                asset_type: assetType,
                file_name: file.name,
                file_url: url,
                file_size: file.size,
                mime_type: file.type || 'application/octet-stream',
                uploaded_by: userId
            });

            const orgUpdateField = assetType === 'logo' ? 'logo_url' : 'certificate_signature_url';
            await supabase.from('organizations').update({ [orgUpdateField]: url }).eq('id', member.org_id);

            return url;
        } catch (err) {
            console.error("Error in enterpriseManagementService.uploadAsset:", err);
            throw err;
        }
    },

    // Fetches all instructors associated with the enterprise organization, including their professional profiles
    async getInstructors(userId: string) {
        const supabase = await createClient();
        try {
            const { data: membership } = await supabase.from('organization_members').select('org_id').eq('user_id', userId).maybeSingle();
            if (!membership) throw new Error("Unauthorized");

            const { data: instructors, error: instructorError } = await supabase
                .from('organization_members')
                .select(`
                    role,
                    joined_at,
                    profiles!inner(
                        id, 
                        first_name, 
                        last_name, 
                        email, 
                        avatar_url, 
                        role,
                        logged_in,
                        instructor_profiles(professional_title, linkedin_url, years_of_experience, bio, expertise_tags)
                    )
                `)
                .eq('org_id', membership.org_id)
                .in('role', ['instructor', 'reviewer', 'admin', 'member']);

            if (instructorError) throw instructorError;

            // 2. Fetch Pending Invitations
            const { data: pendingInvites, error: inviteError } = await supabase
                .from('instructor_invitations')
                .select('*')
                .eq('org_id', membership.org_id)
                .eq('status', 'pending');

            if (inviteError) throw inviteError;

            const activeMembers = (instructors as any[]).map(member => {
                const profile = Array.isArray(member.profiles) ? member.profiles[0] : member.profiles;
                const iProfile = profile.instructor_profiles;
                const instructorProfile = Array.isArray(iProfile) ? iProfile[0] : iProfile;

                return {
                    id: profile?.id,
                    name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Unknown Specialist',
                    email: profile?.email,
                    avatar: profile?.avatar_url,
                    role: instructorProfile?.professional_title || member.role,
                    status: 'Active',
                    lastActivity: profile?.logged_in,
                    simulations: [],
                    instructorProfile: instructorProfile
                };
            });

            const invitationMembers = (pendingInvites || []).map(invite => ({
                id: invite.id,
                name: `${invite.first_name || ''} ${invite.last_name || ''}`.trim() || 'Pending Account',
                email: invite.email,
                avatar: null,
                role: invite.role,
                status: 'Pending',
                lastActivity: invite.created_at,
                simulations: [],
                isInvitation: true
            }));

            return [...invitationMembers, ...activeMembers];
        } catch (err) {
            console.error("Error in enterpriseManagementService.getInstructors:", err);
            throw err;
        }
    },

    // Updates or creates an instructor's professional profile (bio, title, expertise)
    async updateInstructorProfile(userId: string, data: { professional_title?: string, linkedin_url?: string, years_of_experience?: number, bio?: string, expertise_tags?: string[] }) {
        const supabase = await createClient();
        try {
            const { error } = await supabase
                .from('instructor_profiles')
                .upsert({
                    id: userId,
                    ...data,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            return { success: true };
        } catch (err) {
            console.error("Error in enterpriseManagementService.updateInstructorProfile:", err);
            return { success: false, error: (err as any).message };
        }
    },

    // Fetches aggregate statistics for the specialist management section
    async getInstructorStats(userId: string) {
        const supabase = await createClient();
        try {
            const { data: member } = await supabase.from('organization_members').select('org_id').eq('user_id', userId).maybeSingle();
            if (!member) throw new Error("Organization not found");
            const orgId = member.org_id;

            const { count: totalSpecialists } = await supabase
                .from('organization_members')
                .select('*', { count: 'exact', head: true })
                .eq('org_id', orgId)
                .in('role', ['instructor', 'reviewer', 'admin', 'enterprise_admin']);

            const { count: pendingInvites } = await supabase
                .from('instructor_invitations')
                .select('*', { count: 'exact', head: true })
                .eq('org_id', orgId)
                .eq('status', 'pending');

            const { count: activeSimulations } = await supabase
                .from('simulations')
                .select('*', { count: 'exact', head: true })
                .eq('org_id', orgId)
                .eq('status', 'published');

            return {
                totalSpecialists: totalSpecialists || 0,
                pendingInvitations: pendingInvites || 0,
                activePrograms: activeSimulations || 0
            };
        } catch (err) {
            throw err;
        }
    },

    /**
     * Updates a specialist's role within the organization.
     */
    async updateInstructorRole(userId: string, orgId: string, role: 'admin' | 'member' | 'reviewer' | 'instructor') {
        const supabase = await createClient();
        try {
            const { error } = await supabase
                .from('organization_members')
                .update({ role, updated_at: new Date().toISOString() })
                .eq('user_id', userId)
                .eq('org_id', orgId);

            if (error) throw error;
            return { success: true };
        } catch (err) {
            console.error("Error in enterpriseManagementService.updateInstructorRole:", err);
            return { success: false, error: (err as any).message };
        }
    },

    /**
     * Removes a specialist from the organization.
     */
    async deleteInstructor(userId: string, orgId: string) {
        const supabase = await createClient();
        try {
            // Remove from organization_members
            const { error: memberError } = await supabase
                .from('organization_members')
                .delete()
                .eq('user_id', userId)
                .eq('org_id', orgId);

            if (memberError) throw memberError;

            // Note: We don't delete the base profile as it might be used elsewhere, 
            // but we could delete instructor_profiles if explicitly requested.
            await supabase
                .from('instructor_profiles')
                .delete()
                .eq('id', userId);

            return { success: true };
        } catch (err) {
            console.error("Error in enterpriseManagementService.deleteInstructor:", err);
            return { success: false, error: (err as any).message };
        }
    },

    /**
     * Fetches candidate metrics and list for the enterprise dashboard.
     * Candidates are students enrolled in any of the organization's simulations.
     */
    async getCandidatesDashboardData(userId: string) {
        const supabase = await createClient();
        try {
            const { data: membership } = await supabase.from('organization_members').select('org_id, organizations(name)').eq('user_id', userId).single();
            if (!membership) throw new Error("No organization found");
            const orgId = membership.org_id;

            // 1. Fetch all simulations for this organization
            const { data: simulations } = await supabase
                .from('simulations')
                .select('id, title')
                .eq('org_id', orgId);

            const simulationIds = (simulations || []).map(s => s.id);

            // 2. Fetch all enrollments for these simulations
            const { data: enrollments, error: enrollError } = await supabase
                .from('simulation_enrollments')
                .select(`
                    id,
                    status,
                    progress_percentage,
                    enrolled_at,
                    completed_at,
                    time_spent_minutes,
                    simulation_id,
                    student_id,
                    profiles!inner(
                        id,
                        first_name,
                        last_name,
                        email,
                        avatar_url,
                        linkedin_url,
                        github_url,
                        phone_number,
                        country,
                        city,
                        certifications,
                        previous_industry,
                        previous_role,
                        years_of_experience,
                        highest_qualification
                    )
                `)
                .in('simulation_id', simulationIds)
                .order('enrolled_at', { ascending: false });

            if (enrollError) throw enrollError;

            // 2.2 Fetch Education and Experience for these students
            const studentIds = Array.from(new Set(enrollments?.map(e => e.student_id).filter(Boolean)));

            const { data: educationData } = await supabase
                .from('candidate_education')
                .select('*')
                .in('user_id', studentIds);

            const { data: experienceData } = await supabase
                .from('candidate_experience')
                .select('*')
                .in('user_id', studentIds);

            const { data: skillsData } = await supabase
                .from('candidate_skills')
                .select('*')
                .in('user_id', studentIds);

            // 2.5 Fetch all task submissions for these enrollments to get MCQ scores
            const { data: submissions } = await supabase
                .from('simulation_task_submissions')
                .select('student_id, simulation_id, submission_data')
                .in('simulation_id', simulationIds);

            // 3. Aggregate Stats
            const now = new Date();
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

            const totalCandidates = new Set(enrollments?.map(e => {
                const profile = Array.isArray(e.profiles) ? e.profiles[0] : (e.profiles as any);
                return profile?.id || e.student_id;
            }).filter(Boolean)).size;

            const newThisWeek = new Set(enrollments?.filter(e => new Date(e.enrolled_at) >= sevenDaysAgo).map(e => {
                const profile = Array.isArray(e.profiles) ? e.profiles[0] : (e.profiles as any);
                return profile?.id || e.student_id;
            }).filter(Boolean)).size;

            // Filter top performers based on MCQ score or progress
            const studentScores = (submissions || []).reduce((acc: any, sub: any) => {
                const key = `${sub.student_id}-${sub.simulation_id}`;
                if (sub.submission_data?.score !== undefined) {
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(sub.submission_data.score);
                }
                return acc;
            }, {});

            const topPerformersArr = (enrollments || []).filter(e => {
                const key = `${e.student_id}-${e.simulation_id}`;
                const scores = studentScores[key];
                if (scores && scores.length > 0) {
                    const avgScore = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
                    return avgScore > 90;
                }
                return e.progress_percentage > 90;
            });

            const topPerformersCount = new Set(topPerformersArr.map(e => {
                const profile = Array.isArray(e.profiles) ? e.profiles[0] : (e.profiles as any);
                return profile?.id || e.student_id;
            }).filter(Boolean)).size;

            const completedEnrollments = enrollments?.filter(e => e.status === 'completed' && e.completed_at && e.enrolled_at) || [];
            const avgTimeSpent = completedEnrollments.length > 0
                ? Math.round(completedEnrollments.reduce((acc, curr) => {
                    const start = new Date(curr.enrolled_at);
                    const end = new Date(curr.completed_at);
                    return acc + (end.getTime() - start.getTime()) / (1000 * 60);
                }, 0) / completedEnrollments.length)
                : 0;

            const formattedCandidates = (enrollments || []).map(e => {
                const sim = simulations?.find(s => s.id === e.simulation_id);
                const profile = Array.isArray(e.profiles) ? e.profiles[0] : (e.profiles as any);

                const key = `${e.student_id}-${e.simulation_id}`;
                const scores = studentScores[key];
                const avgScore = scores && scores.length > 0
                    ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
                    : null;

                return {
                    id: e.id,
                    studentId: profile?.id || e.student_id,
                    name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || profile?.email || 'Unknown',
                    email: profile?.email,
                    avatar: profile?.avatar_url,
                    simulationTitle: sim?.title || 'Unknown Simulation',
                    status: e.status,
                    progress: e.progress_percentage,
                    score: avgScore,
                    linkedinUrl: profile?.linkedin_url,
                    githubUrl: profile?.github_url,
                    phone: profile?.phone_number,
                    location: profile?.city && profile?.country ? `${profile.city}, ${profile.country}` : (profile?.city || profile?.country || 'N/A'),
                    education: educationData?.filter(edu => edu.user_id === e.student_id) || [],
                    experience: experienceData?.filter(exp => exp.user_id === e.student_id) || [],
                    skills: skillsData?.filter(skill => skill.user_id === e.student_id) || [],
                    certifications: profile?.certifications || [],
                    yearsOfExperience: profile?.years_of_experience,
                    highestQualification: profile?.highest_qualification,
                    previousRole: profile?.previous_role,
                    previousIndustry: profile?.previous_industry,
                    enrolledAt: e.enrolled_at,
                    completedAt: e.completed_at
                };
            });

            const org = Array.isArray(membership.organizations) ? membership.organizations[0] : membership.organizations;

            return {
                stats: {
                    totalCandidates: { value: totalCandidates.toLocaleString(), change: "Overall", trend: "neutral" },
                    newThisWeek: { value: newThisWeek.toLocaleString(), change: "Last 7 days", trend: "up" },
                    topPerformers: { value: topPerformersCount.toLocaleString(), change: "Score > 90", trend: "neutral" },
                    avgCompletion: {
                        value: avgTimeSpent >= 60 ? `${(avgTimeSpent / 60).toFixed(1)}h` : `${avgTimeSpent}m`,
                        change: "Avg. Duration",
                        trend: "neutral"
                    }
                },
                candidates: formattedCandidates,
                organizationName: (org as any)?.name
            };
        } catch (err) {
            console.error("Error in enterpriseManagementService.getCandidatesDashboardData:", err);
            throw err;
        }
    }
};
