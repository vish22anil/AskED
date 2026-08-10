import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Layouts
import LandingLayout from "@/layouts/LandingLayout";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

// Loading Fallback
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center p-8">
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[160px]" />
    </div>
  </div>
);

const Loadable = (Component: React.ComponentType) => (props: any) => (
  <Suspense fallback={<PageLoader />}>
    <Component {...props} />
  </Suspense>
);

// Lazy Pages
const LandingPage = Loadable(lazy(() => import("@/features/landing/LandingPage")));

const Login = Loadable(lazy(() => import("@/features/auth/Login")));
const Signup = Loadable(lazy(() => import("@/features/auth/Signup")));
const ForgotPassword = Loadable(lazy(() => import("@/features/auth/ForgotPassword")));

const StudentDashboard = Loadable(lazy(() => import("@/features/student/StudentDashboard")));
const TeacherDashboard = Loadable(lazy(() => import("@/features/teacher/TeacherDashboard")));
const AdminDashboard = Loadable(lazy(() => import("@/features/admin/AdminDashboard")));

const QuestionPage = Loadable(lazy(() => import("@/features/question/QuestionPage")));
const SearchPage = Loadable(lazy(() => import("@/features/search/SearchPage")));
const ProfilePage = Loadable(lazy(() => import("@/features/profile/ProfilePage")));
const SettingsPage = Loadable(lazy(() => import("@/features/settings/SettingsPage")));
const AskQuestionPage = Loadable(lazy(() => import("@/features/question/AskQuestionPage")));
const AiWorkspacePage = Loadable(lazy(() => import("@/features/ai/AiWorkspacePage")));

// Public Static Pages
const AboutPage = Loadable(lazy(() => import("@/features/public/AboutPage")));
const ContactPage = Loadable(lazy(() => import("@/features/public/ContactPage")));
const LegalPage = Loadable(lazy(() => import("@/features/public/LegalPage")));
const HelpCenterPage = Loadable(lazy(() => import("@/features/public/HelpCenterPage")));
const NotFoundPage = Loadable(lazy(() => import("@/features/public/NotFoundPage")));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "legal", element: <LegalPage /> },
      { path: "help", element: <HelpCenterPage /> },
      { path: "ai", element: <AiWorkspacePage /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { index: true, element: <Navigate to="/auth/login" replace /> },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { path: "student", element: <StudentDashboard /> },
      { path: "teacher", element: <TeacherDashboard /> },
      { path: "admin", element: <AdminDashboard /> },
      { index: true, element: <Navigate to="/dashboard/student" replace /> },
    ],
  },
  {
    path: "/app",
    element: <DashboardLayout />,
    children: [
      { path: "question/:id", element: <QuestionPage /> },
      { path: "ask", element: <AskQuestionPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
