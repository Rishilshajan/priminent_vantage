"use server";

import * as educatorAppActions from "./educator/educator-application.actions";
import * as educatorActions from "./educator/educator.actions";

export async function submitEducatorApplication(formData: FormData) {
    return educatorAppActions.submitEducatorApplication(formData);
}

export async function saveEducatorReview(applicationId: string, reviewData: any) {
    return educatorAppActions.saveEducatorReview(applicationId, reviewData);
}

export async function updateEducatorApplication(applicationId: string, updates: any) {
    return educatorAppActions.updateEducatorApplication(applicationId, updates);
}

export async function handleEducatorAction(
    applicationId: string,
    action: "approve" | "reject" | "clarify",
    reason: string = "",
    adminProfile: any,
    applicantData: any
) {
    return educatorAppActions.handleEducatorAction(applicationId, action, reason, adminProfile, applicantData);
}

export async function getEducatorStats() {
    return educatorActions.getEducatorStats();
}

export async function getEducatorsList(page: number = 1, pageSize: number = 8, search?: string) {
    return educatorActions.getEducatorsList(page, pageSize, search);
}

export async function deleteEducator(applicationId: string, userId: string) {
    return educatorActions.deleteEducator(applicationId, userId);
}
