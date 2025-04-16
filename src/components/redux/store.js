import { configureStore } from "@reduxjs/toolkit";
import userSignInSlice from "./slices/user/Signin";
import userSignUpSlice from "./slices/user/Signup";
import superAdminSignUpSlice from "./slices/superAdminRegister/superAdminRegister";
import adminSignUpSlice from "./slices/adminRegister/adminRegister";
import adminRegister from "./slices/user/admin";
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
import managedCampusReducer from "./slices/services/managedCampus/managedCampus";
import hiringReducer from "./slices/hiring/hiring/Hiring";
import keyElementsReducer from "./slices/business/keyElements/keyElements";
import placementTestimonialReducer from "./slices/business/placementTestimonial/placementTestimonial";
import engagedGovernanceReducer from "./slices/business/engagedGovernance/engagedGovernance";
import businessServiceReducer from "./slices/services/bussinessServices/BussinessSerives";
import serviceAboutReducer from "./slices/services/about/about";
import serviceProcessReducer from "./slices/services/process/process";
import serviceOpportunityReducer from "./slices/services/serviceOpportunity/serviceOpportunity";
import enquiryReducer from "./slices/enquiry/enquiry";
import contactReducer from "./slices/contact/contact";
import careerFormReducer from "./slices/career/careerForm";
import reviewReducer from "./slices/review/review";
import joinUsReducer from "./slices/joinus/joinus";
import placementTrainingTrackReducer from "./slices/services/placementTrainingTrack/placementTrainingTrack";
import visionMissionReducer from "./slices/aboutpage/visionMission/visionMission";
import galleryReducer from "./slices/gallery/gallery";
import aboutUsReducer from "./slices/aboutpage/aboutUs/aboutus";
import shineReducer from "./slices/aboutpage/shine/shine";
import ourPartnersReducer from './slices/services/ourPartners/ourPartners';
import ourSponsorsReducer from './slices/services/ourSponsors/ourSponsors';
import wcyHireReducer from './slices/business/WCYHire/WcyHire';
import careerReducer from './slices/career/career'; 
import yearlyServiceReducer from './slices/aboutpage/yearlyServices/yearlyServices'; 
import skillVerticalReducer from './slices/mca/skillVertical/skillVertical'; 
import targetStudentReducer from './slices/mca/targetStudent/targetStudent';
import collegeReducer from './slices/mca/college/college';
import currentAvailabilityReducer from './slices/business/currentAvailability/currentAvailability';
import journeyReducer from "./slices/business/learningJourney/learningJourney"
import homeServiceReducer from "./slices/home/homeServiceCount/homeServiceCount";
import homeExecutionHighlightsReducer from "./slices/home/homeExecutionHighlights/homeExecutionHighlights";
import companiesReducer from "./slices/mca/company/company";

export default configureStore({
  reducer: {
    userSignIn: userSignInSlice,
    userSignUp: userSignUpSlice,
    superAdminRegister: superAdminSignUpSlice,
    adminRegister: adminSignUpSlice,
    admin:adminRegister,
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
    serviceOpportunities: serviceOpportunityReducer,

    testimonial: testimonialReducer,
    batches: batchesReducer,
    managedCampus: managedCampusReducer,
    hiring: hiringReducer,
    keyElements: keyElementsReducer,
    placementTestimonial: placementTestimonialReducer,
    engagedGovernance: engagedGovernanceReducer,

    businessService: businessServiceReducer,
    serviceAbout: serviceAboutReducer,
    serviceProcess: serviceProcessReducer,
    enquiry: enquiryReducer,
    contact: contactReducer,
    careerForm: careerFormReducer,
    reviews: reviewReducer,
    joinUs: joinUsReducer,  // This should match useSelector(state => state.joinUs)
    placementTrainingTrack: placementTrainingTrackReducer,
    visionMission: visionMissionReducer,
    aboutUs: aboutUsReducer,
    shines: shineReducer,

    gallery: galleryReducer,
    ourPartners: ourPartnersReducer,
    ourSponsors: ourSponsorsReducer,

    wcyHire: wcyHireReducer,
    career: careerReducer,
    yearlyService:yearlyServiceReducer,
    skillVertical:skillVerticalReducer,
    targetStudent:targetStudentReducer,
    college:collegeReducer,
    currentAvailability:currentAvailabilityReducer,
    journey:journeyReducer,
    homeServices: homeServiceReducer,
    homeExecutionHighlights:homeExecutionHighlightsReducer,
    companies:companiesReducer,
  },
});
