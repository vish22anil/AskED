import { Lock } from "lucide-react";

interface GuestOverlayProps {
  title?: string;
  description?: string;
}

export default function GuestOverlay({ 
  title = "Sign in to save your progress", 
  description = "This feature requires an account. Create a free account or log in to continue." 
}: GuestOverlayProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 border-2 border-dashed rounded-xl bg-muted/10">
      <div className="bg-primary/10 p-4 rounded-full mb-6">
        <Lock className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">{title}</h2>
      <p className="text-muted-foreground mb-8 max-w-[400px]">
        {description}
      </p>
    </div>
  );
}
