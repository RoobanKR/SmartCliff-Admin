import { configureStore } from "@reduxjs/toolkit";
import userSignInSlice from "./slices/user/Signin";
import userSignUpSlice from "./slices/user/Signup";
import superAdminSignUpSlice from "./slices/superAdminRegister/superAdminRegister";
import adminSignUpSlice from "./slices/adminRegister/adminRegister";
import categoryReducer from "./slices/category/category";
import careerOpportunitiesReducer from "./slices/careerOppertunities/careerOppertunities";
import softwareToolsReducer from "./slices/softwareTools/softwareTools";
import faqReducer from "./slices/faq/faq";
import instructorReducer from "./slices/instructor/instructor";
import courseReducer from "./slices/course/course";
import batchesReducer from "./slices/batch/batches";

import courseModuleReducer from "./slices/courseModule/courseModule";
import ourProgramReducer from "./slices/mca/ourProgram/ourProgram";
import degreeProgramReducer from "./slices/mca/degreeProgram/degreeProgram";
import qualificationLearningReducer from "./slices/mca/qualificationLearning/qualificationLearning";
import programFeesReducer from "./slices/mca/programFees/programfees";
import programMentorReducer from "./slices/mca/programMentor/programMentor";
import eligibilityCriteriaReducer from "./slices/mca/eligibilityCriteria/eligibilityCriteria";
import semesterReducer from "./slices/mca/semester/semester";
import admissionProcessReducer from "./slices/mca/admissionProcess/admissionProcess";
import outcomeReducer from "./slices/mca/outcome/outcome";
import highlightReducer from "./slices/mca/highlights/highlight";
import programApplicationsReducer from "./slices/registerProgram/RegisterProgram";
import serviceReducer from "./slices/services/services/Services";
import clientReducer from "./slices/services/client/Client";
import executionHighlightsReducer from "./slices/services/executionHighlights/Execution_Highlights";
import executionOverviewsReducer from "./slices/services/executionOverview/ExecutionOverview";
import testimonialReducer from "./slices/services/testimonial/Testimonial";
import galleryReducer from "./slices/services/gallery/Gallery";
import managedCampusReducer from "./slices/services/managedCampus/managedCampus";
import hiringReducer from "./slices/hiring/hiring/Hiring";

export default configureStore({
  reducer: {
    userSignIn: userSignInSlice,
    userSignUp: userSignUpSlice,
    superAdminRegister: superAdminSignUpSlice,
    adminRegister: adminSignUpSlice,
    category: categoryReducer,
    careerOpportunities: careerOpportunitiesReducer,
    softwareTools: softwareToolsReducer,
    faq: faqReducer,
    instructors: instructorReducer,
    course: courseReducer,
    courseModule: courseModuleReducer,
    ourProgram: ourProgramReducer,
    degreeProgram: degreeProgramReducer,
    qualificationLearning: qualificationLearningReducer,
    programFees: programFeesReducer,
    programMentor: programMentorReducer,
    eligibilityCriteria: eligibilityCriteriaReducer,
    semester: semesterReducer,
    admissionProcess: admissionProcessReducer,
    outcomes: outcomeReducer,
    highlight: highlightReducer,
    programApplications: programApplicationsReducer,
    service: serviceReducer,
    clients: clientReducer,
    executionHighlights: executionHighlightsReducer,
    executionOverviews: executionOverviewsReducer,
    testimonial: testimonialReducer,
    gallery: galleryReducer,
    batches:batchesReducer,
    managedCampus:managedCampusReducer,
    hiring: hiringReducer,
    
  },
});