import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { Layout } from "./components/mycomponents/Layout";
import { Dashboard } from "./components/pages/Dashboard";
import { PrivateRoute } from "./components/mycomponents/PrivateRoute";
import { Login } from "./components/pages/Login";
import "./App.css";
import { cn } from "./lib/utils";
import { buttonVariants } from "./components/ui/button";
import { SignUp } from "./components/pages/SignUp";
import {  useRecoilValue } from "recoil";
import { isLoggedinAtom } from "./recoil/atoms";
import {ResetPassword } from "./components/pages/ResetPassword";
import 'bootstrap/dist/css/bootstrap.min.css';  // Added by tejasvi 2-12-2024
import UniversityListPage from "./components/pages/University"; // Added by tejasvi 5-12-2024
import UserListPage from "./components/pages/UserList"; // Added by tejasvi 5-12-2024
import PaymentModesList from "./components/pages/PaymentModesList"; // Added by tejasvi 6-12-2024
import FeeRecieptOptionList from "./components/pages/FeeRecieptOption"; // Added by tejasvi 6-12-2024
import BankNameList from "./components/pages/BankName"; // Added by tejasvi 6-12-2024
import SessionNameList from "./components/pages/SessionName"; // Added by tejasvi 6-12-2024
import CourseCrud from "./components/pages/Course"; // Added by tejasvi 6-12-2024
import StreamCrud from "./components/pages/Stream"; // Added by tejasvi 10-12-2024
import SubStream from "./components/pages/SubStream"; // Added by tejasvi 12-12-2024
import ChangePassword from "./components/pages/ChangePassword"; // Added by tejasvi 17-12-2024
import StudentQuickRegister from "./components/pages/StudentQuickRegister"; // Added by tejasvi 17-12-2024
import ChangeCourse from "./components/pages/ChangeCourse"; // Added by tejasvi 19-12-2024
import QuickRegisterView from "./components/pages/QuickRegisterView"; // Added by tejasvi 19-12-2024
import CourseFees from "./components/pages/CourseFees"; // Added by tejasvi 20-12-2024
import StudentRegister from "./components/pages/StudentRegister"; // Added by tejasvi 23-12-2024
import StudentRegisterView from "./components/pages/StudentRegisterView"; // Added by tejasvi 26-12-2024
import EditStudent from "./components/pages/EditStudent"; // Added by tejasvi 26-12-2024
import Subject from "./components/pages/Subject"; // Added by tejasvi 6-1-2025
import BulkDataUpload from "./components/pages/BulkDataUpload"; // Added by tejasvi 13-1-2025
import SetExam from "./components/pages/SetExam"; // Added by tejasvi 13-1-2025
import CheckResults from "./components/pages/CheckResults"; // Added by tejasvi 15-1-2025
import AssignExam from "./components/pages/AssignExam"; // Added by tejasvi 16-1-2025
import Validate from "./components/pages/validate"; // Added by tejasvi 11-2-2025
import StudentExaminationLogin from "./components/pages/StudentExaminationLogin"; // Added by tejasvi 24-2-2025
import StudentExam from "./components/pages/StudentExam"; // Added by tejasvi 24-2-2025
import ExamTest from "./components/pages/ExamTest"; // Added by tejasvi 24-2-2025
import AllRegisteredStudents from "./components/pages/AllRegisteredStudents"; // Added by tejasvi 26-2-2025

import CanclledStudent from "./components/pages/CanclledStudent"

import DocumentSummary from "./components/pages/DocumentSummary";  

import RoleDisplay from "./components/pages/RoleDisplay";
import Permissions from "./components/pages/Permissions";
import UsersTable from "./components/pages/UsersTable";
import NewUser from "./components/pages/NewUser";
import CategoryList from "./components/pages/CategoryList";
import SourceList from "./components/pages/SourceList";
import RoleStatusList from "./components/pages/RoleStatusList";
import LeadLabelTagList from "./components/pages/LeadLabelTagList";
import CountryPage from "./components/pages/CountryPage";
import StatePage from "./components/pages/StatePage";

const App = () => {

  const isLoggedin = useRecoilValue(isLoggedinAtom);

  return (
    <Router>
      {/* <AuthHandler /> */}
      <Routes>
        <Route path="login" element={<Login />} />

        <Route path="exam" element={<StudentExam />} />
        {/* <Route path="dashboard" element={<Dashboard />} /> */}

        <Route path="examination_login" element={<StudentExaminationLogin />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="/password_reset/:uid/:token" element={<ResetPassword />} />
        <Route path="" element={<PrivateRoute auth={isLoggedin}/>}>
          <Route path="" element={<Layout />}>
            <Route path="" element={<Dashboard />} />
            <Route path="/university-list" element={<UniversityListPage />} />
            <Route path="/user-list" element={<UserListPage />} />
            <Route path="/payment-modes-list" element={<PaymentModesList />} />
            <Route path="/fee-reciept-list" element={<FeeRecieptOptionList />} />
            <Route path="/bank-name-list" element={<BankNameList />} />
            <Route path="/session-list" element={<SessionNameList />} />
            <Route path="/course-list" element={<CourseCrud />} />
            <Route path="/stream-list" element={<StreamCrud />} />
            <Route path="/sub-stream-list" element={<SubStream />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/quick-register" element={<StudentQuickRegister />} />
            <Route path="/change-course" element={<ChangeCourse />} />
            <Route path="/quick-register-view" element={<QuickRegisterView />} />
            <Route path="/course-fees" element={<CourseFees />} />
            <Route path="/student-register" element={<StudentRegister />} />
            <Route path="/register-student-view" element={<StudentRegisterView />} />
            <Route path="/edit-student/:enrollmentId" element={<EditStudent />} />
            <Route path="/subject" element={<Subject />} />
            <Route path="/bulk-data-upload" element={<BulkDataUpload />} />
            <Route path="/setexamination" element={<SetExam />} />
            <Route path="/check-result" element={<CheckResults />} />
            <Route path="/assign-exam" element={<AssignExam />} />
            <Route path="/validate" element={<Validate />} />
            <Route path="/exam" element={<StudentExam />} />
            <Route path="/test" element={<ExamTest />} />
            <Route path="/all-registered-student" element={<AllRegisteredStudents />} />
            <Route path="/canclled-students" element={<CanclledStudent />} />
            <Route path="/view-roles" element={<RoleDisplay />} />  {/* Display roles */}
            <Route path="/role-permissions/:roleId" element={<Permissions />} />  {/* Manage role permissions */}
            <Route path="/view-users" element={<UsersTable />} />  {/* Display Users */}
            <Route path="/users/new" element={<NewUser />} />
            <Route path="/users/new/:userId" element={<NewUser />} />  {/* The :userId part is dynamic */}
            <Route path="/category-list" element={<CategoryList />} />
            <Route path="/source-list" element={<SourceList />} />
            <Route path="/status-list" element={<RoleStatusList />} />
            <Route path="/Tags-list" element={<LeadLabelTagList />} />
            <Route path="/Country-list" element={<CountryPage />} />
            <Route path="/State-list" element={<StatePage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-svh min-h-[400px] space-y-4 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl">
          404 Not Found
        </h1>
        <p className="text-gray-500 md:text-xl/relaxed dark:text-gray-400">
          The page you are looking for could not be found.
        </p>
      </div>
      <Link
        onClick={() => navigate(-1)}
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        Go Back
      </Link>
    </div>
  );
};

export default App;
