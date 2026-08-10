import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Search,
  User,
  Settings,
  Users,
  BarChart3,
  BookOpen
} from "lucide-react";

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const getLinks = () => {
    const base = [
      { name: "Search", href: "/app/search", icon: Search },
      { name: "Profile", href: "/app/profile", icon: User },
      { name: "Settings", href: "/app/settings", icon: Settings },
    ];

    if (user?.role === "student") {
      return [
        { name: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
        { name: "My Questions", href: "/app/questions", icon: MessageSquare },
        { name: "Bookmarks", href: "/app/bookmarks", icon: BookOpen },
        ...base
      ];
    }
    
    if (user?.role === "teacher") {
      return [
        { name: "Dashboard", href: "/dashboard/teacher", icon: LayoutDashboard },
        { name: "Answer Questions", href: "/app/answer", icon: MessageSquare },
        { name: "My Students", href: "/app/students", icon: Users },
        ...base
      ];
    }
    
    if (user?.role === "admin") {
      return [
        { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
        { name: "Users", href: "/app/users", icon: Users },
        { name: "Analytics", href: "/app/analytics", icon: BarChart3 },
        ...base
      ];
    }

    return base;
  };

  const links = getLinks();

  return (
    <div className="hidden border-r bg-muted/20 md:block md:w-64 lg:w-72">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="">AskED</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
            {links.map((link) => {
              const isActive = location.pathname.startsWith(link.href) || 
                               (location.pathname === "/" && link.href.includes("dashboard"));
              
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-primary"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
