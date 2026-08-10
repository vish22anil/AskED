import { FileQuestion, FolderOpen, SearchX, Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: "question" | "folder" | "search" | "inbox";
}

export default function EmptyState({ title, description, icon = "inbox" }: EmptyStateProps) {
  const IconComponent = {
    question: FileQuestion,
    folder: FolderOpen,
    search: SearchX,
    inbox: Inbox
  }[icon];

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg border-dashed bg-muted/10">
      <div className="bg-muted p-4 rounded-full mb-4">
        <IconComponent className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm">{description}</p>
    </div>
  );
}
