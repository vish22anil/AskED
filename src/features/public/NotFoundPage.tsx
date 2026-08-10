import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-6 text-center">
      <div className="bg-muted p-6 rounded-full">
        <SearchX className="h-16 w-16 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">404</h1>
        <h2 className="text-2xl font-semibold tracking-tight">Page Not Found</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          We couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
      </div>
      <Link to="/">
        <Button size="lg">Go Back Home</Button>
      </Link>
    </div>
  );
}
