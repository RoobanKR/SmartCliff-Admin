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
import ProgramMentorAddForm from "./components/pages/mca/programMentor/ProgramMentorAddForm";
import ProgramFeesAddForm from "./components/pages/mca/programFees/ProgramFeesAddForm";
import OurProgramControl from "./components/pages/mca/our_Program/Our_ProgramControl";
import AssessmentControl from "./components/pages/mca/assesment/AssesmentControl";
import AddOurProgramForm from "./components/pages/mca/our_Program/Our_ProgramAddForm";
import Our_ProgramEditForm from "./components/pages/mca/our_Program/Our_ProgramEditForm";
import AddSemesterForm from "./components/pages/mca/semester/SemesterAddForm";
import DegreeProgramControl from "./components/pages/mca/degree_Program/DegreeProgramControl";
import DegreeProgramEditForm from "./components/pages/mca/degree_Program/DegreeProgramEditForm";
import DegreeProgramAddForm from "./components/pages/mca/degree_Program/DegreeProgramAddForm";
import ProgramMentorControl from "./components/pages/mca/programMentor/ProgramMentorControl";
import ProgramFeesControl from "./components/pages/mca/programFees/ProgramFeesControl";
import ProgramfeesEditForm from "./components/pages/mca/programFees/ProgramfeesEditForm";
import EligibilityCriteriaAddForm from "./components/pages/mca/eligibilityCriteria/EligibilityCriteriaAddForm";
import EligibilityCriteriaControll from "./components/pages/mca/eligibilityCriteria/EligibilityCriteriaControll";
import SemesterControl from "./components/pages/mca/semester/SemesterControl";
import AdmissionProcessAddForm from "./components/pages/mca/admissionProcess/AdmissionProcessAddForm";
import AdmissionProcessControl from "./components/pages/mca/admissionProcess/AdmissionProcessControl";
import AdmissionProcessEditForm from "./components/pages/mca/admissionProcess/AdmissionProcessEditForm";
import ProgramMentorEditForm from "./components/pages/mca/programMentor/ProgramMentorEditForm";
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
import ClientAddForm from "./components/pages/services/clients/ClientAddForm";
import ClientControl from "./components/pages/services/clients/ClientControl";
import ClientEditForm from "./components/pages/services/clients/ClientEditForm";
import ExecutionHighlightsAddForm from "./components/pages/services/executionHighlights/ExecutionHighlightsAddForm";
import ExecutionHighlightsControl from "./components/pages/services/executionHighlights/ExecutionHighlightsControlForm";
import ExecutionHighlightsEditForm from "./components/pages/services/executionHighlights/ExecutionHighlightsEditForm";
import ExecutionOverviewAddForm from "./components/pages/services/executionOverview/ExecutionOverviewAddForm";
import ExecutionOverviewControl from "./components/pages/services/executionOverview/ExecutionOverviewControl";
import ExecutionOverviewEditForm from "./components/pages/services/executionOverview/ExecutionOverviewEditForm";
import TestimonialAddForm from "./components/pages/services/testimonial/TestimonialAddForm";
import TestimonialControl from "./components/pages/services/testimonial/TestimonialControl";
import TestimonialEditForm from "./components/pages/services/testimonial/TestimonialEditForm";
import GalleryAddForm from "./components/pages/services/gallery/GalleryAddForm";
import GalleryControl from "./components/pages/services/gallery/GalleryControl";
import GalleryEditForm from "./components/pages/services/gallery/GalleryEditForm";
import BatchAddForm from "./components/pages/batches/BatchAddForm";
import BatchControl from "./components/pages/batches/BatchControl";
import BatchEditForm from "./components/pages/batches/BatchEditForm";
import ManagedCampusAddForm from "./components/pages/services/managedCampus/ManagedCampusAddForm";
import ManagedCampusControl from "./components/pages/services/managedCampus/ManagedCampusControl";
import ManagedCampusEditForm from "./components/pages/services/managedCampus/ManagedCampusEditForm";
import HiringAddForm from "./components/pages/hiring/hiring/HiringAddForm";
import HiringControll from "./components/pages/hiring/hiring/HiringControl";
import HiringUpdateForm from "./components/pages/hiring/hiring/HiringEditForm";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route index element={<LoginForm />} />
        <Route path="adminhome" element={<AdminHome />} />

        <Route path="Category-add" element={<CategoryAddForm />} />
        <Route path="Category-control" element={<CategoryControl />} />
        <Route
          path="category-edit/:categoryId"
          element={<CategoryEditForm />}
        />

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


        <Route path="Batch-add" element={<BatchAddForm />} />
        <Route path="Batch-control" element={<BatchControl />} />
        <Route path="Batch-edit/:batchId" element={<BatchEditForm />} />


        <Route path="Signup" element={<SignUpForm />} />

        {/* MCA Program */}


        <Route path="Degree_Program-add" element={<DegreeProgramAddForm />} />
        <Route path="Degree_Program-control" element={<DegreeProgramControl />} />
        <Route path="Degree_Program-edit/:degreeProgramId" element={<DegreeProgramEditForm />} />

        <Route path="Our_Program-add" element={<AddOurProgramForm />} />
        <Route path="Our_Program-Control" element={<OurProgramControl />} />
        <Route path="Our_Program-edit/:programId" element={<Our_ProgramEditForm />} />

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
        <Route path="ProgramMentor-add" element={<ProgramMentorAddForm />} />
        <Route
          path="ProgramMentor-control"
          element={<ProgramMentorControl />}
        />
                <Route path="Program_Mentor-edit/:mentorId" element={<ProgramMentorEditForm />} />


        <Route path="ProgramFees-add" element={<ProgramFeesAddForm />} />
        <Route path="ProgramFees-control" element={<ProgramFeesControl />} />
        <Route path="Program_Fees-edit/:feesId" element={<ProgramfeesEditForm />} />


        <Route path="AdmissionProcess-add" element={<AdmissionProcessAddForm />} />
        <Route path="AdmissionProcess-control" element={<AdmissionProcessControl />} />
        <Route path="Admission_Process-edit/:admissionId" element={<AdmissionProcessEditForm />} />

        <Route path="Outcomes-add" element={<OutcomesAddForm />} />
        <Route path="Outcomes-control" element={<OutcomeControl />} />
        <Route path="Outcome-edit/:outcomeId" element={<OutcomesEditForm />} />


        <Route path="Highlight-add" element={<HighlightForm />} />
        <Route path="Highlight-control" element={<HighlightsControl />} />
        <Route path="Highlight-edit/:highlightId" element={<HighlightsEditForm />} />
        
        {/* service */}

        <Route path="Services-add" element={<ServicesAddForm />} />
        <Route path="Services-control" element={<ServicesControl />} />
        <Route path="Services-edit/:serviceId" element={<ServiceEditForm />} />

        <Route path="Client-add" element={<ClientAddForm />} />
        <Route path="Client-control" element={<ClientControl />} />
        <Route path="Client-edit/:clientId" element={<ClientEditForm />} />

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

        <Route path="Service_Testimonial-add" element={<TestimonialAddForm />} />
        <Route path="Service_Testimonial-control" element={<TestimonialControl />} />
        <Route path="Service_Testimonial-edit/:id" element={<TestimonialEditForm />} />

        <Route path="Gallery-add" element={<GalleryAddForm />} />
        <Route path="Gallery-control" element={<GalleryControl />} />
        <Route path="Gallery-edit/:id" element={<GalleryEditForm />} />

        <Route path="managed_Campus-add" element={<ManagedCampusAddForm />} />
        <Route path="managed_Campus-control" element={<ManagedCampusControl />} />
        <Route path="managed_Campus-edit/:id" element={<ManagedCampusEditForm />} />

        <Route path="ProgramRegister-control" element={<ProgramRegisterControl />} />

        <Route path="hiring-add" element={<HiringAddForm />} />
        <Route path="hiring-control" element={<HiringControll />} />
        <Route path="hiring-edit/:id" element={<HiringUpdateForm />} />


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
