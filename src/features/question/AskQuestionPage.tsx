import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, X, UploadCloud, Eye } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import RichTextEditor from "@/components/shared/RichTextEditor";

const DIFFICULTIES = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
// In a real app, subjects would be fetched from API
const MOCK_SUBJECTS = [
  { id: "cm032jfow0000abc123", name: "Data Structures & Algorithms" },
  { id: "cm032jfow0001def456", name: "Database Management Systems" },
  { id: "cm032jfow0002ghi789", name: "Operating Systems" },
];

export default function AskQuestionPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [difficulty, setDifficulty] = useState("BEGINNER");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim().toLowerCase())) {
        setTags([...tags, currentTag.trim().toLowerCase()]);
      }
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (isDraft: boolean) => {
    if (!title || !description || !subjectId) {
      toast.error("Please fill out title, subject, and description.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        title,
        description,
        subjectId,
        difficulty,
        tags,
        isDraft,
      };

      const res = await api.post('/api/questions', payload);
      toast.success(res.data.message || "Saved successfully");
      
      if (!isDraft) {
        navigate(`/app/question/${res.data.data.id}`);
      } else {
        navigate(`/dashboard/student`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save question");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPreview) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Preview Question</h1>
          <Button variant="outline" onClick={() => setIsPreview(false)}>Edit Question</Button>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{DIFFICULTIES.find(d => d === difficulty) || difficulty}</Badge>
            </div>
            <CardTitle className="text-2xl">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
            {tags.length > 0 && (
              <div className="flex gap-2 mt-6">
                {tags.map(tag => (
                  <Badge key={tag} variant="outline">#{tag}</Badge>
                ))}
              </div>
            )}
            <div className="mt-8 flex gap-4 justify-end border-t pt-4">
              <Button variant="outline" onClick={() => handleSubmit(true)} disabled={isSubmitting}>
                Save as Draft
              </Button>
              <Button onClick={() => handleSubmit(false)} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Post Question
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ask a Question</h1>
        <p className="text-muted-foreground">Get help from verified teachers and your peers.</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Question Title <span className="text-destructive">*</span></Label>
            <Input 
              id="title" 
              placeholder="e.g., How does Dijkstra's algorithm work?" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Subject <span className="text-destructive">*</span></Label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_SUBJECTS.map(sub => (
                    <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map(d => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description <span className="text-destructive">*</span></Label>
            <div className="min-h-[300px] border rounded-md">
              <RichTextEditor 
                value={description} 
                onChange={setDescription} 
                placeholder="Provide all the details someone would need to answer your question..." 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <Input 
              placeholder="Type a tag and press Enter" 
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleAddTag}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1 px-2 py-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <Button variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
            <Button variant="outline" onClick={() => setIsPreview(true)}><Eye className="h-4 w-4 mr-2" /> Preview</Button>
            <Button variant="outline" onClick={() => handleSubmit(true)} disabled={isSubmitting}>
              Save Draft
            </Button>
            <Button onClick={() => handleSubmit(false)} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Post Question
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
