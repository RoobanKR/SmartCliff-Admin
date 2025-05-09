import "./App.css";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import AdminHome from "./components/admin/AdminHome";
import CategoryAddForm from "./components/pages/category/CategoryAddForm";
import SoftwareToolsAddForm from "./components/pages/softwareTools/SoftwareToolsAddForm";
import InstructorAddForm from "./components/pages/instructor/InstructorAddForm";
import FAQAddForm from "./components/pages/faq/FaqAddForm";
import CourseModulesAddForm from "./components/pages/courseModules/CourseModulesAddForm";
import CourseAddForm from "./components/pages/course/CourseAddForm";
import CategoryControl from "./components/pages/category/CategoryControl";
import CourseModulesControl from "./components/pages/courseModules/CourseModulesControl";
import FaqControl from "./components/pages/faq/FaqControl";
import InstructorControl from "./components/pages/instructor/InstructorControl";
import SoftwareToolsControl from "./components/pages/softwareTools/SoftwareToolsControl";
import CareerOppertunitiesAddForm from "./components/pages/careerOppertunities/CareerOppertunitiesAddForm";
import CareerOpportunitiesControl from "./components/pages/careerOppertunities/CareerOppertunitiesControl";
import SignUpForm from "./components/user/SignUpForm";
import LoginForm from "./components/user/LoginForm";
import CourseControl from "./components/pages/course/CourseControl";
import CategoryEditForm from "./components/pages/category/CategoryEditForm";
import CareerOppertunitiesEditForm from "./components/pages/careerOppertunities/CareerOppertunitiesEditForm";
import SoftwareToolsEditForm from "./components/pages/softwareTools/SoftwareToolsEditForm";
import InstructorEditForm from "./components/pages/instructor/InstructorEditForm";
import FAQEditForm from "./components/pages/faq/FaqEditForm";
import CourseModulesEditForm from "./components/pages/courseModules/CourseModulesEditForm";
import CourseEditForm from "./components/pages/course/CourseEditForm";
import AssessmentAddForm from "./components/pages/mca/assesment/AssesmentAddForm";
import ProgramFeesAddForm from "./components/pages/mca/programFees/ProgramFeesAddForm";
import OurProgramControl from "./components/pages/mca/our_Program/Our_ProgramControl";
import AssessmentControl from "./components/pages/mca/assesment/AssesmentControl";
import AddOurProgramForm from "./components/pages/mca/our_Program/Our_ProgramAddForm";
import Our_ProgramEditForm from "./components/pages/mca/our_Program/Our_ProgramEditForm";
import AddSemesterForm from "./components/pages/mca/semester/SemesterAddForm";
import DegreeProgramControl from "./components/pages/mca/degree_Program/DegreeProgramControl";
import DegreeProgramEditForm from "./components/pages/mca/degree_Program/DegreeProgramEditForm";
import DegreeProgramAddForm from "./components/pages/mca/degree_Program/DegreeProgramAddForm";
import ProgramFeesControl from "./components/pages/mca/programFees/ProgramFeesControl";
import ProgramfeesEditForm from "./components/pages/mca/programFees/ProgramfeesEditForm";
import EligibilityCriteriaAddForm from "./components/pages/mca/eligibilityCriteria/EligibilityCriteriaAddForm";
import EligibilityCriteriaControll from "./components/pages/mca/eligibilityCriteria/EligibilityCriteriaControll";
import SemesterControl from "./components/pages/mca/semester/SemesterControl";
import AdmissionProcessAddForm from "./components/pages/mca/admissionProcess/AdmissionProcessAddForm";
import AdmissionProcessControl from "./components/pages/mca/admissionProcess/AdmissionProcessControl";
import AdmissionProcessEditForm from "./components/pages/mca/admissionProcess/AdmissionProcessEditForm";
import { ToastContainer } from "react-toastify";
import OutcomesAddForm from "./components/pages/mca/outcome/OutcomesAddForm";
import OutcomeControl from "./components/pages/mca/outcome/OutcomeControl";
import OutcomesEditForm from "./components/pages/mca/outcome/OutcomesEditForm";
import HighlightForm from "./components/pages/mca/highlights/HighlightsAddForm";
import HighlightsControl from "./components/pages/mca/highlights/HighlightsControl";
import HighlightsEditForm from "./components/pages/mca/highlights/HighlightsEditForm";
import ProgramRegisterControl from "./components/pages/programRegister/ProgramRegisterControl";
import EligibilityCriteriaEditForm from "./components/pages/mca/eligibilityCriteria/EligibilityCriteriaEditForm";
import SemesterEditForm from "./components/pages/mca/semester/SemesterEditForm";
import ServicesAddForm from "./components/pages/services/services/ServicesAddForm";
import ServicesControl from "./components/pages/services/services/ServicesControl";
import ServiceEditForm from "./components/pages/services/services/ServicesEditForm";
import ClientAddForm from "./components/pages/business/clients/ClientAddForm";
import ClientControl from "./components/pages/business/clients/ClientControl";
import ClientEditForm from "./components/pages/business/clients/ClientEditForm";
import ExecutionHighlightsAddForm from "./components/pages/services/executionHighlights/ExecutionHighlightsAddForm";
import ExecutionHighlightsControl from "./components/pages/services/executionHighlights/ExecutionHighlightsControlForm";
import ExecutionHighlightsEditForm from "./components/pages/services/executionHighlights/ExecutionHighlightsEditForm";
import ExecutionOverviewAddForm from "./components/pages/services/executionOverview/ExecutionOverviewAddForm";
import ExecutionOverviewControl from "./components/pages/services/executionOverview/ExecutionOverviewControl";
import ExecutionOverviewEditForm from "./components/pages/services/executionOverview/ExecutionOverviewEditForm";
import TestimonialAddForm from "./components/pages/services/testimonial/TestimonialAddForm";
import TestimonialControl from "./components/pages/services/testimonial/TestimonialControl";
import TestimonialEditForm from "./components/pages/services/testimonial/TestimonialEditForm";
import BatchAddForm from "./components/pages/batches/BatchAddForm";
import BatchControl from "./components/pages/batches/BatchControl";
import BatchEditForm from "./components/pages/batches/BatchEditForm";
import ManagedCampusAddForm from "./components/pages/services/managedCampus/ManagedCampusAddForm";
import ManagedCampusControl from "./components/pages/services/managedCampus/ManagedCampusControl";
import ManagedCampusEditForm from "./components/pages/services/managedCampus/ManagedCampusEditForm";
import HiringAddForm from "./components/pages/hiring/hiring/HiringAddForm";
import HiringControll from "./components/pages/hiring/hiring/HiringControl";
import HiringUpdateForm from "./components/pages/hiring/hiring/HiringEditForm";
import KeyElementsAddForm from "./components/pages/business/keyelements/KeyElementsAddForm";
import KeyElementsControl from "./components/pages/business/keyelements/KeyElementsControl";
import KeyElementsEditForm from "./components/pages/business/keyelements/KeyElementsEditForm";
import PlacementTestimonialAddForm from "./components/pages/business/placementTestimonial/PlacementTestimonialAddForm";
import PlacementControl from "./components/pages/business/placementTestimonial/PlacementTestimonialControl";
import PlacementTestimonialEditForm from "./components/pages/business/placementTestimonial/PlacementTestimonialEditForm";
import EngagedGovernanceAddForm from "./components/pages/business/engagedGovernance/EngagedGovernanceAddForm";
import EngagedGovernanceControl from "./components/pages/business/engagedGovernance/EngagedGovernanceControl";
import EngagedGovernanceEditForm from "./components/pages/business/engagedGovernance/EngagedGovernanceEditForm";
import BussinessServicesAddForm from "./components/pages/services/bussinessServices/bussinessServicesAddForm";
import BussinessServicesControl from "./components/pages/services/bussinessServices/bussinessServicesControl";
import BussinessServiceEditForm from "./components/pages/services/bussinessServices/bussinessSerivesEditForm";
import ServiceAboutAddForm from "./components/pages/services/serviceAbout/ServiceAboutAddForm";
import ServiceAboutControl from "./components/pages/services/serviceAbout/ServiceAboutControl";
import ServiceAboutEditForm from "./components/pages/services/serviceAbout/ServiceAboutEditForm";
import ServicProcessAddForm from "./components/pages/services/serviceProcess/ServiceProcessAddForm";
import ServiceProcessControl from "./components/pages/services/serviceProcess/ServicesProcessControl";
import ServiceProcessEditForm from "./components/pages/services/serviceProcess/ServiceProcessEditForm";
import ServiceOpportunityAddForm from "./components/pages/services/serviceOpportunity/ServiceOpportunityAddForm";
import ServiceOpportunitiesControl from "./components/pages/services/serviceOpportunity/ServiceOpportunityControl";
import ServiceOpportunitiesEditForm from "./components/pages/services/serviceOpportunity/ServiceOpportunityEditForm";
import EnquiryControl from "./components/pages/common/enquiryControl";
import ContactControl from "./components/pages/common/contactControl";
import CareerControl from "./components/pages/common/careerControl";
import ReviewAddForm from "./components/pages/review/ReviewAddForm";
import ReviewControl from "./components/pages/review/ReviewControl";
import ReviewsEditForm from "./components/pages/review/ReviewEditForm";
import CourseAddedForm from "./components/pages/course/CourseDetails";
import JobPositionForm from "./components/pages/joinUs/joinUsAddForm";
import JobPositionControl from "./components/pages/joinUs/joinUsControl";
import EditJobPage from "./components/pages/joinUs/joinUsEditForm";
import PlacementTrainingTrackAddForm from "./components/pages/services/placementTrainingTrack/PlacementTrainingTrackAddForm";
import PlacementTrainingTrackControl from "./components/pages/services/placementTrainingTrack/PlacementTrainingTrackControl";
import PlacementTrainingTrackEditForm from "./components/pages/services/placementTrainingTrack/PlacementTraningTrackEditForm";
import VisionMissionAddForm from "./components/pages/aboutPage/visionMission/visionMissionAddForm";
import VisionMissionControl from "./components/pages/aboutPage/visionMission/VisionMissionControl";
import VisionMissionEditForm from "./components/pages/aboutPage/visionMission/VisionMissionEditForm";
import GalleryAddForm from "./components/pages/gallery/GalleryAddForm";
import GalleryControl from "./components/pages/gallery/GalleryControl";
import GalleryEditForm from "./components/pages/gallery/GalleryEditForm";
import AboutUsAddForm from "./components/pages/aboutPage/aboutUs/ABoutUsAddForm";
import AboutUsControl from "./components/pages/aboutPage/aboutUs/AboutUsControl";
import AboutUsEditForm from "./components/pages/aboutPage/aboutUs/AboutUsEditForm";
import ShineAddForm from "./components/pages/aboutPage/shine/shineAddForm";
import ShineEditForm from "./components/pages/aboutPage/shine/ShineEditForm";
import ShineControlPage from "./components/pages/aboutPage/shine/ShineControl";
import OurPartnersAddForm from "./components/pages/services/ourPartners/OurPartnersAddForm";
import OurPartnersControlPage from "./components/pages/services/ourPartners/OurPartnersControl";
import OurPartnersEditForm from "./components/pages/services/ourPartners/OurPartnersEditForm";
import OurSponsorsAddForm from "./components/pages/services/ourSponsors/OurSponsorsAddForm";
import OurSponsorsControlPage from "./components/pages/services/ourSponsors/OurSponsorsControl";
import OurSponsorsEditForm from "./components/pages/services/ourSponsors/OurSponosrsEditForm";
import WCYHireAddForm from "./components/pages/business/WCYHire/WCYHireAddFrom";
import WCYHireControlPage from "./components/pages/business/WCYHire/WCYHireControlPage";
import WCYHireUpdateForm from "./components/pages/business/WCYHire/WCYHireUpdateForm";
import CareerAddForm from "./components/pages/career/CareerAddForm";
import CareerControlPage from "./components/pages/career/CareerControlPage";
import CareerUpdateForm from "./components/pages/career/CarrerUpdateForm";
import YearlyServiceAddForm from "./components/pages/aboutPage/YearlyServices/YearlyServicesAddFrom";
import YearlyServiceControlPage from "./components/pages/aboutPage/YearlyServices/YearlyServiceControlPage";
import YearlyServiceEditForm from "./components/pages/aboutPage/YearlyServices/YearlyServiceEditForm";
import SkillVerticalAddForm from "./components/pages/mca/skillVerical/SkillVericalAddForm";
import TargetStudentAddFrom from "./components/pages/mca/targetStudent/TargetStudentAddFrom";
import TargetStudentControlPage from "./components/pages/mca/targetStudent/TargetStudentControlPage";

import TargetStudentEditForm from "./components/pages/mca/targetStudent/TargetStudentEditForm";
import SkillVerticalControlPage from "./components/pages/mca/skillVerical/SkillVerticalControlPage";
import SkillVerticalEditForm from "./components/pages/mca/skillVerical/SkillVerticalEditForm";
import AddCollegeForm from "./components/pages/mca/college/collegeAddForm";
import CollegeAddForm from "./components/pages/mca/college/collegeAddForm";
import CollegeControl from "./components/pages/mca/college/collegeControl";
import CollegeEditForm from "./components/pages/mca/college/collegeEditForm";
import LearningJourneyAddForm from "./components/pages/business/learningJourney/learningJourney-add";
import LearningJourneyControlPage from "./components/pages/business/learningJourney/learningJourney-control";
import CurrentAvailabilityAddForm from "./components/pages/business/currentAvailability/CurrentAvailabilityAddForm";
import CurrentAvailabilityControlPage from "./components/pages/business/currentAvailability/CurrentAvailabilityControlPage";
import CurrentAvailabilityEditForm from "./components/pages/business/currentAvailability/CurrentAvailabilityEditForm";
import HomeServiceCountAddForm from "./components/pages/home/homeServiceCount/HomeExecutionCountAddForm";
import HomeServiceCountControlPage from "./components/pages/home/homeServiceCount/HomeExecutionCountControlPage";
import HomeServiceCountEditForm from "./components/pages/home/homeServiceCount/HomeExecutionEditForm";
import HomeExecutionHighlightsAddForm from "./components/pages/home/homeExecutionHighlights/homeExecutionSliderAddForm";
import HomeExecutionHighlightsControl from "./components/pages/home/homeExecutionHighlights/HomeExecutionSliderControlpage";
import HomeExecutionHighlightsEditForm from "./components/pages/home/homeExecutionHighlights/HomeExecutionSliderEditForm";
import LearningJourneyEditForm from "./components/pages/business/learningJourney/learningJourney-edit";
import CourseForm from "./components/pages/course/CourseDetails";
import CompanyAddForm from "./components/pages/mca/company/companyAddForm";
import CompanyControl from "./components/pages/mca/company/CompanyControlPage";
import CompanyEditForm from "./components/pages/mca/company/CompanyEditForm";
import AdminRegistrationForm from "./components/admin/AdminRegister";
import AdminControl from "./components/admin/AdminControl";
import AdminEditForm from "./components/admin/AdminEdit";
import HireFromUsFormsControl from "./components/pages/business/forms/HireFromUsFormsControl";
import TrainFromUsFormsControl from "./components/pages/business/forms/TrainFromUsFormsControl";
import InstituteUsFormsControl from "./components/pages/business/forms/InstituteFormControl";
import WCUControl from "./components/pages/home/wcu/WCUControl";
import WCUAddForm from "./components/pages/home/wcu/WCUAddForm";
import WCUEditForm from "./components/pages/home/wcu/WCUEditForm";
import HowItWorksControl from "./components/pages/business/howItsWork/HowItWorksControl";
import HowItWorksAddForm from "./components/pages/business/howItsWork/HowItWorksAddForm";
import HowItWorksEditForm from "./components/pages/business/howItsWork/HowItWorksEditForm";
import FooterAddForm from "./components/pages/footer/FooterAddForm";
import FooterEditForm from "./components/pages/footer/FooterEditFrom";
import FooterControlPage from "./components/pages/footer/FooterControlPage";
import PopUpNotificationAddForm from "./components/pages/home/popUpNotification/PopUpNotificationAddForm";
import PopUpNotificationControl from "./components/pages/home/popUpNotification/PopUpNotificationControl";
import PopUpNotificationEditForm from "./components/pages/home/popUpNotification/PopUpNotificationEditForm";
import ContactPageAddForm from "./components/pages/contactPage/ContactPageAddForm";
import ContactPageControl from "./components/pages/contactPage/ContactpageControl";
import ContactPageEditForm from "./components/pages/contactPage/ContactPageEditForm";
import MuiVisitorStats from "./components/pages/visitor/Visior";
import AddressAddForm from "./components/pages/address/AddressAddForm";
import AddressControl from "./components/pages/address/AddressControlPage";
import AddressEditForm from "./components/pages/address/AddressEditForm";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route index element={<LoginForm />} />
        <Route path="adminhome" element={<AdminHome />} />
        <Route path="enquiry-details" element={<EnquiryControl />} />
        <Route path="contact-details" element={<ContactControl />} />
        <Route path="career-details" element={<CareerControl />} />

        <Route path="Review-add" element={<ReviewAddForm />} />
        <Route path="Review-control" element={<ReviewControl />} />
        <Route path="Review-edit/:reviewId" element={<ReviewsEditForm />} />

        <Route path="Category-add" element={<CategoryAddForm />} />
        <Route path="Category-control" element={<CategoryControl />} />
        <Route
          path="category-edit/:categoryId"
          element={<CategoryEditForm />}
        />
        <Route path="Joinus-add" element={<JobPositionForm />} />
        <Route path="Joinus-control" element={<JobPositionControl />} />
        <Route path="joinus-edit/:id" element={<EditJobPage />} />

        <Route
          path="Career_Opportunities-add"
          element={<CareerOppertunitiesAddForm />}
        />
        <Route
          path="Career_Opportunities-control"
          element={<CareerOpportunitiesControl />}
        />
        <Route
          path="Career_Opportunities-edit/:careeroppId"
          element={<CareerOppertunitiesEditForm />}
        />

        <Route path="Software_Tools-add" element={<SoftwareToolsAddForm />} />
        <Route
          path="Software_Tools-control"
          element={<SoftwareToolsControl />}
        />
        <Route
          path="Software_Tools-edit/:toolsId"
          element={<SoftwareToolsEditForm />}
        />

        <Route path="Instructor-add" element={<InstructorAddForm />} />
        <Route path="Instructor-control" element={<InstructorControl />} />
        <Route
          path="Instructor-edit/:instructorId"
          element={<InstructorEditForm />}
        />

        <Route path="FAQ-add" element={<FAQAddForm />} />
        <Route path="FAQ-control" element={<FaqControl />} />
        <Route path="Faq-edit/:faqId" element={<FAQEditForm />} />

        <Route path="Course_Modules-add" element={<CourseModulesAddForm />} />
        <Route
          path="Course_Modules-control"
          element={<CourseModulesControl />}
        />
        <Route
          path="courseModule-edit/:moduleId"
          element={<CourseModulesEditForm />}
        />
        <Route path="Course-add" element={<CourseAddForm />} />
        <Route path="Course-control" element={<CourseControl />} />
        <Route path="Course-edit/:courseId" element={<CourseEditForm />} />
        {/* <Route path="Course-added" element={<CourseForm />} /> */}

        <Route path="Batch-add" element={<BatchAddForm />} />
        <Route path="Batch-control" element={<BatchControl />} />
        <Route path="Batch-edit/:batchId" element={<BatchEditForm />} />

        <Route path="Signup" element={<SignUpForm />} />

        {/* MCA Program */}

        <Route path="Degree_Program-add" element={<DegreeProgramAddForm />} />
        <Route
          path="Degree_Program-control"
          element={<DegreeProgramControl />}
        />
        <Route
          path="Degree_Program-edit/:degreeProgramId"
          element={<DegreeProgramEditForm />}
        />

        <Route path="Our_Program-add" element={<AddOurProgramForm />} />
        <Route path="Our_Program-Control" element={<OurProgramControl />} />
        <Route
          path="Our_Program-edit/:programId"
          element={<Our_ProgramEditForm />}
        />

        <Route path="Semester-add" element={<AddSemesterForm />} />
        <Route path="Semester-control" element={<SemesterControl />} />
        <Route path="Semester-edit/:id" element={<SemesterEditForm />} />

        <Route path="Assesment-add" element={<AssessmentAddForm />} />
        <Route path="Assesment-control" element={<AssessmentControl />} />

        <Route
          path="EligibilityCriteria-add"
          element={<EligibilityCriteriaAddForm />}
        />
        <Route
          path="EligibilityCriteria-control"
          element={<EligibilityCriteriaControll />}
        />
        <Route
          path="EligibilityCriteria-edit/:id"
          element={<EligibilityCriteriaEditForm />}
        />
        <Route
          path="degreeprogram/target-student-add"
          element={<TargetStudentAddFrom />}
        />
        <Route
          path="degreeprogram/target-student-control"
          element={<TargetStudentControlPage />}
        />
        <Route
          path="degreeprogram/target-student-edit/:id"
          element={<TargetStudentEditForm />}
        />

        <Route path="ProgramFees-add" element={<ProgramFeesAddForm />} />
        <Route path="ProgramFees-control" element={<ProgramFeesControl />} />
        <Route
          path="Program_Fees-edit/:feesId"
          element={<ProgramfeesEditForm />}
        />

        <Route
          path="AdmissionProcess-add"
          element={<AdmissionProcessAddForm />}
        />
        <Route
          path="AdmissionProcess-control"
          element={<AdmissionProcessControl />}
        />
        <Route
          path="Admission_Process-edit/:admissionId"
          element={<AdmissionProcessEditForm />}
        />

        <Route path="Outcomes-add" element={<OutcomesAddForm />} />
        <Route path="Outcomes-control" element={<OutcomeControl />} />
        <Route path="Outcome-edit/:outcomeId" element={<OutcomesEditForm />} />

        <Route path="Highlight-add" element={<HighlightForm />} />
        <Route path="Highlight-control" element={<HighlightsControl />} />
        <Route
          path="Highlight-edit/:highlightId"
          element={<HighlightsEditForm />}
        />

        {/* service */}
        <Route
          path="Business-Services-add"
          element={<BussinessServicesAddForm />}
        />
        <Route
          path="Business-Services-control"
          element={<BussinessServicesControl />}
        />
        <Route
          path="Business-Services-edit/:businessServiceId"
          element={<BussinessServiceEditForm />}
        />

        <Route path="Services-add" element={<ServicesAddForm />} />
        <Route path="Services-control" element={<ServicesControl />} />
        <Route path="Services-edit/:serviceId" element={<ServiceEditForm />} />

        <Route
          path="Services-About-control"
          element={<ServiceAboutControl />}
        />
        <Route path="Services-About-add" element={<ServiceAboutAddForm />} />
        <Route
          path="Services-About-edit/:id"
          element={<ServiceAboutEditForm />}
        />

        <Route path="Services-Process-add" element={<ServicProcessAddForm />} />
        <Route
          path="Services-Process-control"
          element={<ServiceProcessControl />}
        />
        <Route
          path="Services-Process-edit/:id"
          element={<ServiceProcessEditForm />}
        />

        <Route
          path="Services-Opportunity-add"
          element={<ServiceOpportunityAddForm />}
        />
        <Route
          path="Services-Opportunity-control"
          element={<ServiceOpportunitiesControl />}
        />
        <Route
          path="Services-Opportunity-edit/:id"
          element={<ServiceOpportunitiesEditForm />}
        />

        <Route path="business/Client-add" element={<ClientAddForm />} />
        <Route path="business/Client-control" element={<ClientControl />} />
        <Route
          path="business/Client-edit/:clientId"
          element={<ClientEditForm />}
        />

        <Route
          path="Execution_Highlights-add"
          element={<ExecutionHighlightsAddForm />}
        />
        <Route
          path="Execution_Highlights-control"
          element={<ExecutionHighlightsControl />}
        />
        <Route
          path="Execution_Highlights-edit/:executionHighlightId"
          element={<ExecutionHighlightsEditForm />}
        />

        <Route
          path="Execution_Overview-add"
          element={<ExecutionOverviewAddForm />}
        />
        <Route
          path="Execution_Overview-control"
          element={<ExecutionOverviewControl />}
        />
        <Route
          path="Execution_Overview-edit/:id"
          element={<ExecutionOverviewEditForm />}
        />

        <Route
          path="Service_Testimonial-add"
          element={<TestimonialAddForm />}
        />
        <Route
          path="Service_Testimonial-control"
          element={<TestimonialControl />}
        />
        <Route
          path="Service_Testimonial-edit/:id"
          element={<TestimonialEditForm />}
        />

        {/* <Route path="Gallery-add" element={<GalleryAddForm />} />
        <Route path="Gallery-control" element={<GalleryControl />} />
        <Route path="Gallery-edit/:id" element={<GalleryEditForm />} />
 */}
        <Route path="managed_Campus-add" element={<ManagedCampusAddForm />} />
        <Route
          path="managed_Campus-control"
          element={<ManagedCampusControl />}
        />
        <Route
          path="managed_Campus-edit/:id"
          element={<ManagedCampusEditForm />}
        />

        <Route
          path="ProgramRegister-control"
          element={<ProgramRegisterControl />}
        />

        {/* <Route path="hiring-add" element={<HiringAddForm />} />
        <Route path="hiring-control" element={<HiringControll />} />
        <Route path="hiring-edit/:id" element={<HiringUpdateForm />} /> */}

        <Route path="key_elements-add" element={<KeyElementsAddForm />} />
        <Route path="key_elements-control" element={<KeyElementsControl />} />
        <Route path="key_elements-edit/:id" element={<KeyElementsEditForm />} />

        <Route
          path="placement_testimonial-add"
          element={<PlacementTestimonialAddForm />}
        />
        <Route
          path="placement_testimonial-control"
          element={<PlacementControl />}
        />
        <Route
          path="placement_testimonial-edit/:id"
          element={<PlacementTestimonialEditForm />}
        />

        <Route
          path="engaged_Governance-add"
          element={<EngagedGovernanceAddForm />}
        />
        <Route
          path="engaged_Governance-control"
          element={<EngagedGovernanceControl />}
        />
        <Route
          path="engaged_Governance-edit/:id"
          element={<EngagedGovernanceEditForm />}
        />

        <Route
          path="about/vision-mission-add"
          element={<VisionMissionAddForm />}
        />
        <Route
          path="about/vision-mission-control"
          element={<VisionMissionControl />}
        />
        <Route
          path="about/vision-mission-edit/:id"
          element={<VisionMissionEditForm />}
        />

        <Route path="about/aboutus-add" element={<AboutUsAddForm />} />
        <Route path="about/aboutus-control" element={<AboutUsControl />} />
        <Route path="about/aboutus-edit/:id" element={<AboutUsEditForm />} />

        <Route path="gallery-add" element={<GalleryAddForm />} />
        <Route path="gallery-control" element={<GalleryControl />} />
        <Route path="gallery-edit/:id" element={<GalleryEditForm />} />

        <Route path="about/shine-add" element={<ShineAddForm />} />
        <Route path="about/shine-edit/:id" element={<ShineEditForm />} />
        <Route path="about/shine-control" element={<ShineControlPage />} />

        <Route
          path="degreeprogram/our-partners-add"
          element={<OurPartnersAddForm />}
        />
        <Route
          path="degreeprogram/our-partners-control"
          element={<OurPartnersControlPage />}
        />
        <Route
          path="degreeprogram/our-partners-edit/:id"
          element={<OurPartnersEditForm />}
        />

        <Route
          path="Placement-Training-Track-add"
          element={<PlacementTrainingTrackAddForm />}
        />
        <Route
          path="Placement-Training-Track-control"
          element={<PlacementTrainingTrackControl />}
        />
        <Route
          path="Placement-Training-Track-edit/:id"
          element={<PlacementTrainingTrackEditForm />}
        />

        <Route
          path="degreeprogram/our-sponsor-add"
          element={<OurSponsorsAddForm />}
        />
        <Route
          path="degreeprogram/our-sponsor-control"
          element={<OurSponsorsControlPage />}
        />
        <Route
          path="degreeprogram/our-sponsor-edit/:id"
          element={<OurSponsorsEditForm />}
        />

        <Route path="business/wcy-hire-add" element={<WCYHireAddForm />} />
        <Route
          path="business/wcy-hire-control"
          element={<WCYHireControlPage />}
        />
        <Route
          path="business/wcy-hire-edit/:id"
          element={<WCYHireUpdateForm />}
        />

        <Route path="career-add" element={<CareerAddForm />} />
        <Route path="career-control" element={<CareerControlPage />} />
        <Route path="career-edit/:id" element={<CareerUpdateForm />} />

        <Route
          path="about/yearly-service-add"
          element={<YearlyServiceAddForm />}
        />
        <Route
          path="about/yearly-service-control"
          element={<YearlyServiceControlPage />}
        />
        <Route
          path="about/yearly-service-edit/:id"
          element={<YearlyServiceEditForm />}
        />

        <Route
          path="degreeprogram/skill-vertical-add"
          element={<SkillVerticalAddForm />}
        />
        <Route
          path="degreeprogram/skill-vertical-control"
          element={<SkillVerticalControlPage />}
        />
        <Route
          path="degreeprogram/skill-vertical-edit/:id"
          element={<SkillVerticalEditForm />}
        />
        <Route path="college-add" element={<CollegeAddForm />} />
        <Route path="college-control" element={<CollegeControl />} />
        <Route path="college-edit/:id" element={<CollegeEditForm />} />

        <Route
          path="business/learningjourney-add"
          element={<LearningJourneyAddForm />}
        />
        <Route
          path="business/learningjourney-control"
          element={<LearningJourneyControlPage />}
        />
        <Route
          path="/business/learningjourney-edit/:id"
          element={<LearningJourneyEditForm />}
        />

        <Route
          path="business/current-availability-add"
          element={<CurrentAvailabilityAddForm />}
        />
        <Route
          path="business/current-availability-control"
          element={<CurrentAvailabilityControlPage />}
        />
        <Route
          path="business/current-availability-edit/:id"
          element={<CurrentAvailabilityEditForm />}
        />

        {/* leftNavigation not include */}

        <Route
          path="home/service-count-add"
          element={<HomeServiceCountAddForm />}
        />
        <Route
          path="home/service-count-control"
          element={<HomeServiceCountControlPage />}
        />
        {/* form is submit but error message show */}
        <Route
          path="home/service-count-edit/:id"
          element={<HomeServiceCountEditForm />}
        />

        <Route
          path="home/execution-highlights-add"
          element={<HomeExecutionHighlightsAddForm />}
        />
        <Route
          path="home/execution-highlights-control"
          element={<HomeExecutionHighlightsControl />}
        />
        <Route
          path="home/execution-highlights-edit/:id"
          element={<HomeExecutionHighlightsEditForm />}
        />

        <Route path="degreeprogram/company-add" element={<CompanyAddForm />} />
        <Route
          path="degreeprogram/company-control"
          element={<CompanyControl />}
        />
        <Route
          path="degreeprogram/company-edit/:companyId"
          element={<CompanyEditForm />}
        />

        <Route path="admin-add" element={<AdminRegistrationForm />} />
        <Route path="admin/control" element={<AdminControl />} />
        <Route path="admin-edit/:id" element={<AdminEditForm />} />
        <Route path="hiring-control" element={<HireFromUsFormsControl />} />
        <Route
          path="train-from-us-control"
          element={<TrainFromUsFormsControl />}
        />
        <Route path="institute-control" element={<InstituteUsFormsControl />} />

        <Route path="home/wcu-control" element={<WCUControl />} />
        <Route path="home/wcu-add" element={<WCUAddForm />} />
        <Route path="home/wcu-edit/:id" element={<WCUEditForm />} />

        <Route
          path="business/how-it-works-control"
          element={<HowItWorksControl />}
        />
        <Route
          path="business/how-it-works-add"
          element={<HowItWorksAddForm />}
        />

        <Route
          path="business/how-it-works-edit/:id"
          element={<HowItWorksEditForm />}
        />

        <Route path="footer-add" element={<FooterAddForm />} />
        <Route path="footer-control" element={<FooterControlPage />} />
        <Route path="footer-edit/:id" element={<FooterEditForm />} />

        <Route path="popup-notification-add" element={<PopUpNotificationAddForm />} />
        <Route path="popup-notification-control" element={<PopUpNotificationControl />} />
        <Route path="popup-notification-edit/:id" element={<PopUpNotificationEditForm />} />

        <Route path="contact-page-add" element={<ContactPageAddForm />} />
        <Route path="contact-page-control" element={<ContactPageControl />} />
        <Route path="contact-page-edit/:id" element={<ContactPageEditForm />} />

        <Route path="visitor-control" element={<MuiVisitorStats />} />

        <Route path="address-add" element={<AddressAddForm />} />
        <Route path="address-control" element={<AddressControl />} />
        <Route path="address-edit/:id" element={<AddressEditForm />} />

      </Route>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
