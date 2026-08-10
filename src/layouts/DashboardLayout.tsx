import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/shared/Sidebar";
import Topbar from "@/components/shared/Topbar";
import FloatingAiButton from "@/components/shared/FloatingAiButton";

export default function DashboardLayout() {
  const { isAuthenticated, isGuest } = useAuth();
  
  if (!isAuthenticated || isGuest) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex w-full flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
      <FloatingAiButton />
    </div>
  );
}
