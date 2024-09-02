import { lazy } from "react";
import PageNotFound from "../pages/pagenotfound";
import EditRoleForm from "../pages/roles/EditRole";
import EditUserForm from "../pages/users/EditUserForm";
import ACLRoute from "./ACLRoute";
import Jobs from "../pages/facilities/facilitylisting/jobs";
import AddNewJob from "../pages/facilities/facilitylisting/jobs/AddNewJob";
import EditTemplate from "../pages/facilities/facilitylisting/facilitycomponent/jobtemplate/EditTemplate";
import { FacilityActiveComponentContextProvider } from "../helpers/context/FacilityActiveComponent";
import ViewJob from "../pages/facilities/facilitylisting/jobs/ViewJob";
import { FacilityContextProvider } from "../helpers/context/FacilityContext";
import EditProfessionalForm from "../pages/professionals/EditProfessional";
// import Submission from "../pages/facilities/facilitylisting/jobs/Submissions/Submissions";
// import Applicant from "../pages/facilities/facilitylisting/jobs/Applicant/ApplicantList";
import ProfessionalLayout from "../pages/professionals/ProfessionalLayout";
import { ActiveSidebarMenuProvider } from "../helpers/context/ActiveSidebar";
import TalentLogin from "../pages/talent/login";
import TalentForgotPassword from "../pages/talent/forgotpassword";
import TalentResetPassword from "../pages/talent/resetpassword";
import TalentRegister from "../pages/talent/register";
import TalentHome from "../pages/talent/home";
import SearchJobs from "../pages/talent/searchjobs";
import ViewJobs from "../pages/talent/searchjobs/ViewJob";
import ChangePassword from "../pages/talent/changepassword";
import MyTeam from "../pages/talent/myteam";
import PersonalInformation from "../pages/talent/personalinformation";
import MyProfile from "../pages/talent/myprofile";
import Gigs from "../pages/talent/gigs";
import OnBoarding from "../pages/talent/onboarding";

import { FacilityNameContextProvider } from "../helpers/context/FacilityName";
import MainHome from "../pages/talent/mainHome/Index";
import EditJob from "../pages/facilities/facilitylisting/jobs/EditJob";
const CreateTemplate = lazy(
  () =>
    import(
      "../pages/facilities/facilitylisting/facilitycomponent/jobtemplate/CreateTemplate"
    )
);
const Login = lazy(() => import("../pages/login/index"));
const ForgotPassword = lazy(() => import("../pages/forgotpassword/index"));
const ResetPassword = lazy(() => import("../pages/resetpassword/index"));
const Layout = lazy(() => import("../components/layouts/Layout"));
const TalentLayout = lazy(() => import("../components/talentlayout/Layout"));
const Profile = lazy(() => import("../pages/profile/index"));
const ManageUsers = lazy(() => import("../pages/users/index"));
const CreateUser = lazy(() => import("../pages/users/CreateUser"));
const Facility = lazy(() => import("../pages/facilities/index"));
const AddNewFacility = lazy(() => import("../pages/facilities/AddNewFacility"));
const RoleManagement = lazy(() => import("../pages/roles"));
const CreateRole = lazy(() => import("../pages/roles/CreateRole-copy"));
const DocumentMaster = lazy(() => import("../pages/documentmasters/index"));
const FacilityLayout = lazy(
  () => import("../pages/facilities/facilitylisting/index")
);
const NewContract = lazy(
  () =>
    import(
      "../pages/facilities/facilitylisting/facilitycomponent/contract/CreateNewContract"
    )
);
const EditFacility = lazy(() => import("../pages/facilities/EditFacility"));
const ManageProfessionals = lazy(() => import("../pages/professionals/index"));
const CreateProfessional = lazy(
  () => import("../pages/professionals/CreateProfessional")
);

export const routes = [
  {
    path: "/login",
    element: <Login />,
    needsAuth: false,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    needsAuth: false,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
    needsAuth: false,
  },

  {
    path: "/set-password",
    element: <ResetPassword />,
    needsAuth: false,
  },

  {
    path: "/",
    element: (
      <FacilityContextProvider>
        <ActiveSidebarMenuProvider>
          <FacilityNameContextProvider>
            <Layout />
          </FacilityNameContextProvider>
        </ActiveSidebarMenuProvider>
      </FacilityContextProvider>
    ),
    children: [
      {
        path: "/profile",
        element: <Profile />,
        index: false,
      },
      {
        path: "/users",
        element: (
          <ACLRoute module="users" action={["GET"]} submodule={null}>
            <ManageUsers />
          </ACLRoute>
        ),
        index: false,
      },
      {
        path: "/users/create",
        element: (
          <ACLRoute module="users" action={["GET", "POST"]} submodule={null}>
            <CreateUser />
          </ACLRoute>
        ),
        index: false,
      },
      {
        path: "/facility",
        element: (
          <ACLRoute module="facilities" action={["GET"]} submodule={null}>
            <Facility />
          </ACLRoute>
        ),
        index: false,
      },
      {
        path: "/facility/:id/details",
        element: (
          <ACLRoute module="facilities" action={["GET"]} submodule="details">
            <Facility />
          </ACLRoute>
        ),
        index: false,
      },
      {
        path: "/facility/create",
        element: (
          <ACLRoute
            module="facilities"
            action={["GET", "POST"]}
            submodule={null}
          >
            {" "}
            <AddNewFacility />
          </ACLRoute>
        ),
        index: false,
      },
      {
        path: "/facility/edit/:userId",
        element: <EditFacility />,
      },
      {
        path: "/roles",
        element: (
          <ACLRoute module="roles" action={["GET"]} submodule={null}>
            <RoleManagement />
          </ACLRoute>
        ),
        index: false,
      },
      {
        path: "/roles/create",
        element: (
          <ACLRoute module="roles" action={["GET", "POST"]} submodule={null}>
            <CreateRole />
          </ACLRoute>
        ),
        index: false,
      },
      {
        path: "/document-master",
        element: (
          <ACLRoute module="documentmaster" action={["GET"]} submodule={null}>
            <DocumentMaster />
          </ACLRoute>
        ),
        index: false,
      },
      {
        path: "/facility/:Id",
        element: (
          <FacilityActiveComponentContextProvider>
            <FacilityLayout />
          </FacilityActiveComponentContextProvider>
        ),
        index: false,
      },
      {
        path: "/user/edit/:userId",
        element: (
          <ACLRoute module="users" action={["GET", "PUT"]} submodule={null}>
            <EditUserForm />
          </ACLRoute>
        ),
      },
      {
        path: "/role/edit/:roleId",
        element: (
          <ACLRoute module="roles" action={["GET", "PUT"]} submodule={null}>
            <EditRoleForm />
          </ACLRoute>
        ),
      },
      {
        path: "/facility/:id/new-contract",
        element: <NewContract />,
        index: false,
      },
      {
        path: "/facility/:Id/job-template/create",
        element: (
          <FacilityActiveComponentContextProvider>
            <ACLRoute
              module="facilities"
              submodule={"jobtemplates"}
              action={["GET", "POST"]}
            >
              <CreateTemplate />
            </ACLRoute>
          </FacilityActiveComponentContextProvider>
        ),
        index: false,
      },
      {
        path: "/facility/:facilityId/job-template/edit/:Id",
        element: (
          <FacilityActiveComponentContextProvider>
            <ACLRoute
              module="facilities"
              submodule={"jobtemplates"}
              action={["GET", "PUT"]}
            >
              <EditTemplate />
            </ACLRoute>
          </FacilityActiveComponentContextProvider>
        ),
        index: false,
      },
      {
        path: "/facility/:Id/contract/create",
        element: (
          <FacilityActiveComponentContextProvider>
            <ACLRoute
              module="facilities"
              submodule={"contractterms"}
              action={["GET", "POST"]}
            >
              <NewContract />
            </ACLRoute>
          </FacilityActiveComponentContextProvider>
        ),
        index: false,
      },
      {
        path: "/facility/:Id/contract/edit/:contractId",
        element: (
          <FacilityActiveComponentContextProvider>
            <ACLRoute
              module="facilities"
              submodule={"contractterms"}
              action={["GET", "PUT"]}
            >
              <NewContract />
            </ACLRoute>
          </FacilityActiveComponentContextProvider>
        ),
        index: false,
      },
      {
        path: "/jobs",
        element: <Jobs />,
        index: false,
      },
      {
        path: "/jobs/create",
        element: <AddNewJob />,
        index: false,
      },
      {
        path: "/facility/:facId/jobs/edit/:id",
        element: <EditJob />,
        index: false,
      },
      {
        // path: "view/facility/:fId/job/:jId",
        path: "view/facility/:fId/job/:jId",
        element: <ViewJob />,
        index: false,
      },
      // {
      //   path: "view/details/:Id",
      //   element: <OpeningsAssignments />,
      //   index: false,
      // },
      // {
      //   path: "view/submmision/:Id",
      //   element: <Submission />,
      //   index: false,
      // },
      // {
      //   path: "view/applicant/:Id",
      //   element: <Applicant />,
      //   index: false,
      // },
      {
        path: "/professionals",
        element: (
          <ACLRoute module="professionals" action={["GET"]} submodule={null}>
            <ManageProfessionals />
          </ACLRoute>
        ),
        index: false,
      },
      {
        path: "/professionals/create",
        element: (
          <ACLRoute
            module="professionals"
            action={["GET", "POST"]}
            submodule={null}
          >
            <CreateProfessional />
          </ACLRoute>
        ),
      },
      {
        path: "/professionals/edit/:id",
        element: (
          <ACLRoute
            module="professionals"
            action={["GET", "PUT"]}
            submodule={null}
          >
            <EditProfessionalForm />
          </ACLRoute>
        ),
      },
      {
        path: "/professionals/:Id",
        element: (
          <FacilityActiveComponentContextProvider>
            <ProfessionalLayout />
          </FacilityActiveComponentContextProvider>
        ),
        index: false,
      },
    ],
    needsAuth: true,
  },
  {
    path: "/talent",
    element: <TalentLayout />,
    children: [
      {
        path: "/talent/login",
        element: <TalentLogin />,
        index: false,
      },
      {
        path: "/talent/forgot-password",
        element: <TalentForgotPassword />,
        index: false,
      },
      {
        path: "/talent/reset-password",
        element: <TalentResetPassword />,
        index: false,
      },
      {
        path: "/talent/set-password",
        element: <TalentResetPassword />,
        index: false,
      },
      {
        path: "/talent/register",
        element: <TalentRegister />,
        index: false,
      },
      {
        path: "/talent/search-jobs",
        element: <SearchJobs />,
        index: false,
      },
      {
        path: "/talent/search-jobs/view-jobs",
        element: <ViewJobs />,
        index: false,
      },
      {
        path: "/talent/search-jobs/view-jobs/:Id",
        element: <ViewJobs />,
        index: false,
      },
      {
        path: "/talent/home",
        element: <TalentHome />,
        index: false,
      },
      {
        path: "/talent/personal-information",
        element: <PersonalInformation />,
        index: false,
      },
      {
        path: "/talent/my-profile",
        element: <MyProfile />,
        index: false,
      },
      {
        path: "/talent/gigs",
        element: <Gigs/>,
        index: false,
      },
      {
        path: "/talent/onboarding",
        element: <OnBoarding/>,
        index: false,
      },
    ],
    needsAuth: false,
    isTalentRoute: true,
  },
  {
    path: "/talent",
    element: <TalentLayout />,
    children: [
      {
        path: "/talent/main-home",
        element: <MainHome />,
        index: false,
      },
      {
        path: "/talent/change-password",
        element: <ChangePassword />,
        index: false,
      },
      {
        path: "/talent/my-team",
        element: <MyTeam />,
        index: false,
      },
    ],
    needsAuth: true,
    isTalentRoute: true,
  },
  {
    path: "*",
    element: <PageNotFound />,
    needsAuth: true,
  },
];
