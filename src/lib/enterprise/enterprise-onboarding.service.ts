import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logServerEvent } from "@/lib/logger/server";
import { createHash } from "node:crypto";

// Hashes an access code with SHA-256 for secure storage comparison
function hashAccessCode(code: string) {
    return createHash('sha256').update(code).digest('hex');
}

export const enterpriseOnboardingService = {
    // Validates an access code against the DB, checks expiry, and optionally verifies the email domain
    async validateCode(code: string, email?: string) {
        const supabase = createAdminClient();
        const cleanCode = code.trim().toUpperCase();
        const hashedCode = hashAccessCode(cleanCode);

        try {
            const { data: codeRecord, error: fetchError } = await supabase
                .from('enterprise_access_codes')
                .select('*, enterprise_requests(admin_email, admin_name, company_name, website, industry, company_size, status)')
                .eq('code_hash', hashedCode)
                .eq('status', 'active')
                .maybeSingle();

            if (fetchError || !codeRecord) throw new Error("Invalid access code.");

            const request = codeRecord.enterprise_requests;
            const now = new Date();
            const expiresAt = new Date(codeRecord.expires_at);

            if (codeRecord.status !== 'active') throw new Error(`Code is ${codeRecord.status}.`);
            if (now > expiresAt) throw new Error("Code has expired.");

            if (email) {
                const getDomain = (e: string) => e.split('@')[1]?.toLowerCase();
                if (getDomain(email) !== getDomain(request.admin_email)) {
                    throw new Error("Permission Denied: Organization domain mismatch.");
                }
            }

            const { data: org } = await supabase.from('organizations').select('id').eq('request_id', codeRecord.request_id).maybeSingle();
            const { data: profile } = await supabase.from('profiles').select('id').eq('email', email || request.admin_email).maybeSingle();

            return {
                requestId: codeRecord.request_id,
                companyName: request.company_name,
                adminEmail: email || request.admin_email,
                adminName: request.admin_name,
                website: request.website,
                industry: request.industry,
                companySize: request.company_size,
                isOrgExists: !!org,
                isUserExists: !!profile
            };
        } catch (err) {
            console.error("Error in enterpriseOnboardingService.validateCode:", err);
            throw err;
        }
    },

    // Provisions the organization and enterprise admin account, then marks the access code as used
    async completeSetup(setupData: any) {
        const supabaseAdmin = createAdminClient();

        try {
            const { data: codeRecord, error: codeError } = await supabaseAdmin
                .from('enterprise_access_codes')
                .select('id, status, request_id')
                .eq('request_id', setupData.requestId)
                .eq('status', 'active')
                .single();

            if (codeError || !codeRecord) throw new Error("Access session expired or invalid.");

            const { data: requestData } = await supabaseAdmin
                .from('enterprise_requests')
                .select('company_name, admin_email')
                .eq('id', setupData.requestId)
                .single();

            if (!requestData) throw new Error("Original request not found.");

            const domain = setupData.email.split('@')[1].toLowerCase();
            const finalOrgName = setupData.companyName || requestData.company_name;

            const { data: existingOrg } = await supabaseAdmin.from('organizations').select('id').eq('request_id', setupData.requestId).maybeSingle();

            let org;
            if (existingOrg) {
                org = existingOrg;
                await supabaseAdmin.from('organizations').update({
                    name: finalOrgName,
                    industry: setupData.industry,
                    size: setupData.companySize,
                    website: setupData.website
                }).eq('id', org.id);
            } else {
                const { data: newOrg, error: orgError } = await supabaseAdmin
                    .from('organizations')
                    .insert({
                        request_id: setupData.requestId,
                        name: finalOrgName,
                        domain: domain,
                        industry: setupData.industry,
                        size: setupData.companySize,
                        website: setupData.website,
                        status: 'active'
                    })
                    .select()
                    .single();
                if (orgError) throw orgError;
                org = newOrg;
            }

            let userId: string | undefined;
            const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
            const existingAuthUser = users.find(u => u.email?.toLowerCase() === setupData.email.toLowerCase());

            if (existingAuthUser) {
                userId = existingAuthUser.id;
                await supabaseAdmin.auth.admin.updateUserById(userId, {
                    password: setupData.password,
                    email_confirm: true,
                    user_metadata: { first_name: setupData.firstName, last_name: setupData.lastName, role: 'enterprise' }
                });
                await supabaseAdmin.from('profiles').upsert({
                    id: userId,
                    email: setupData.email,
                    first_name: setupData.firstName,
                    last_name: setupData.lastName,
                    role: 'enterprise'
                });
            } else {
                const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                    email: setupData.email,
                    password: setupData.password,
                    email_confirm: true,
                    user_metadata: { first_name: setupData.firstName, last_name: setupData.lastName, role: 'enterprise' }
                });
                if (authError) throw authError;
                userId = authData.user?.id;
            }

            if (!userId) throw new Error("Failed to establish user context.");

            await supabaseAdmin.from('organization_members').upsert({
                org_id: org.id,
                user_id: userId,
                role: 'admin'
            }, { onConflict: 'org_id,user_id' });

            await supabaseAdmin.from('enterprise_access_codes').update({ status: 'used', used_count: 1 }).eq('id', codeRecord.id);
            await supabaseAdmin.from('enterprise_requests').update({ status: 'completed' }).eq('id', setupData.requestId);

            return { orgId: org.id, userId };
        } catch (err) {
            console.error("Error in enterpriseOnboardingService.completeSetup:", err);
            throw err;
        }
    }
};
