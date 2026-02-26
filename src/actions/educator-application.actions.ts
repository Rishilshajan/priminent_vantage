"use server";

export {
    submitEducatorApplication,
    saveEducatorReview,
    updateEducatorApplication,
    handleEducatorAction,
} from "./educator/educator-application.actions";

export {
    getEducatorStats,
    getEducatorsList,
    deleteEducator,
} from "./educator/educator.actions";
