import { Link } from "react-router-dom";
import { GraduationCap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const routes = [
    { name: "Ask a Doubt", href: "/ai" },
    { name: "AI Study Buddy", href: "/ai" },
    { name: "Explore Questions", href: "#" },
    { name: "Subjects", href: "/#subjects" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Help", href: "/help" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span>AskED</span>
          </Link>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {routes.map((route) => (
            <a
              key={route.name}
              href={route.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {route.name}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {routes.map((route) => (
                  <a
                    key={route.name}
                    href={route.href}
                    className="text-lg font-medium text-muted-foreground hover:text-foreground"
                  >
                    {route.name}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
