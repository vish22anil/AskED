import { Outlet, Link } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { GraduationCap } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <header className="absolute top-0 w-full flex items-center justify-between p-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span>AskED</span>
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Outlet />
      </main>
    </div>
  );
}
