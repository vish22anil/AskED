import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, MessageSquare, Share2, Bookmark, CheckCircle, BrainCircuit, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useQuestion, usePostAnswer } from "@/hooks/useQuestions";
import { useToggleBookmark, useToggleVote, useAcceptAnswer } from "@/hooks/useInteractions";
import { useAuth } from "@/contexts/AuthContext";
import RichTextEditor from "@/components/shared/RichTextEditor";

export default function QuestionPage() {
  const { id } = useParams<{ id: string }>();
  const { data: question, isLoading, error } = useQuestion(id || "");
  const { user } = useAuth();
  
  const toggleBookmark = useToggleBookmark();
  const toggleVote = useToggleVote();
  const acceptAnswer = useAcceptAnswer();

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error || !question) return <div className="p-12 text-center text-red-500">Question not found</div>;

  // Check if current user has bookmarked this question
  const isBookmarked = question.bookmarks?.some((b: any) => b.userId === user?.id);
  const userVote = question.votes?.find((v: any) => v.userId === user?.id);
  
  const [answerContent, setAnswerContent] = useState("");
  const postAnswer = usePostAnswer();

  const handlePostAnswer = () => {
    if (!answerContent.trim()) return;
    postAnswer.mutate(
      { questionId: question.id, content: answerContent },
      {
        onSuccess: () => setAnswerContent(""),
      }
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 space-y-6">
        {/* Main Question */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">{question.title}</h1>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground items-center">
                  <Badge variant="secondary">{question.subject.name}</Badge>
                  {question.tags?.map((t: any) => (
                    <Badge key={t.tag.id} variant="outline">{t.tag.name}</Badge>
                  ))}
                  <span>Asked {new Date(question.createdAt).toLocaleDateString()}</span>
                  <span>by <span className="text-primary font-medium">{question.student.fullName}</span></span>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => toggleBookmark.mutate(question.id)}
                className={isBookmarked ? "text-primary" : ""}
              >
                <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="leading-relaxed whitespace-pre-wrap prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: question.description }} />
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button 
              variant={userVote?.isUpvote ? "default" : "outline"} 
              size="sm" 
              className="gap-2"
              onClick={() => toggleVote.mutate({ questionId: question.id, isUpvote: true })}
            >
              <ThumbsUp className="h-4 w-4" /> {question.votes?.filter((v: any) => v.isUpvote).length || 0}
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <MessageSquare className="h-4 w-4" /> {question.comments?.length || 0}
            </Button>
          </CardFooter>
        </Card>

        {/* AI Answer / Hint */}
        <Card className="border-primary/50 bg-primary/5 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-primary">
              <BrainCircuit className="h-5 w-5" /> AskED AI Suggestion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">
              Think of the Virtual DOM as a lightweight blueprint of the real DOM. When state changes in React:
              <br/><br/>
              1. React creates a new Virtual DOM tree.<br/>
              2. It compares (diffs) this new tree with the previous Virtual DOM tree.<br/>
              3. It figures out exactly what changed.<br/>
              4. It applies only those specific changes to the real DOM (reconciliation).
              <br/><br/>
              This is faster because manipulating the real DOM involves expensive browser layout and paint operations, whereas updating JavaScript objects (Virtual DOM) is very fast.
            </p>
          </CardContent>
        </Card>

        <Separator className="my-8" />
        <h3 className="text-xl font-bold tracking-tight mb-4">Answers ({question.answers?.length || 0})</h3>

        {question.answers?.map((answer: any) => {
          const ansVote = answer.votes?.find((v: any) => v.userId === user?.id);
          const upvotes = answer.votes?.filter((v: any) => v.isUpvote).length || 0;

          return (
            <Card key={answer.id} className={`shadow-sm relative overflow-hidden ${answer.isAccepted ? 'border-green-200 dark:border-green-900' : ''}`}>
              {answer.isAccepted && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Verified Teacher
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={answer.teacher.profileImage} />
                    <AvatarFallback>{answer.teacher.fullName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{answer.teacher.fullName}</div>
                    <div className="text-xs text-muted-foreground">Answered {new Date(answer.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="leading-relaxed whitespace-pre-wrap prose dark:prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: answer.content }} />
              </CardContent>
              <CardFooter className="flex gap-4">
                <Button 
                  variant={ansVote?.isUpvote ? "default" : "outline"} 
                  size="sm" 
                  className={`gap-2 ${answer.isAccepted ? 'text-green-600 border-green-200 hover:bg-green-50' : ''}`}
                  onClick={() => toggleVote.mutate({ answerId: answer.id, isUpvote: true })}
                >
                  <ThumbsUp className="h-4 w-4" /> {upvotes}
                </Button>
                {user?.id === question.studentId && !answer.isAccepted && (
                  <Button variant="outline" size="sm" className="gap-2 border-green-200 text-green-600" onClick={() => acceptAnswer.mutate(answer.id)}>
                    <CheckCircle className="h-4 w-4" /> Accept
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="w-full lg:w-96 space-y-6">
        {user?.role === 'TEACHER' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Answer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RichTextEditor value={answerContent} onChange={setAnswerContent} />
              <Button 
                className="w-full" 
                onClick={handlePostAnswer}
                disabled={postAnswer.isPending || !answerContent.trim()}
              >
                {postAnswer.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post Answer"}
              </Button>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Related Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">More questions coming soon...</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
