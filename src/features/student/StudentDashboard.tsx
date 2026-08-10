import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Clock, MessageSquare, TrendingUp, Sparkles, Bookmark, Activity } from "lucide-react";
import { useStudentDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data, isLoading, error } = useStudentDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error loading dashboard data</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.fullName?.split(' ')[0]}!</h2>
          <p className="text-muted-foreground">Here's an overview of your recent learning activity.</p>
        </div>
        <Link to="/app/ask">
          <Button size="lg" className="shrink-0 gap-2">
            <Sparkles className="h-4 w-4" /> Ask a Question
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions Asked</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats.questionsAsked || 0}</div>
            <p className="text-xs text-muted-foreground">Total questions posted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Answers Received</CardTitle>
            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats.answersReceived || 0}</div>
            <p className="text-xs text-muted-foreground">From teachers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookmarks</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats.bookmarks || 0}</div>
            <p className="text-xs text-muted-foreground">Saved for later</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reputation</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.reputation || 0}</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions on AskED.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.recentActivity?.length > 0 ? data.recentActivity.map((activity: any, i: number) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="font-medium leading-none">
                      {activity.type === 'ASKED_QUESTION' ? `Asked: ${activity.metadata?.title || 'a question'}` : 
                       activity.type.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-muted-foreground">{new Date(activity.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    <Activity className="h-3 w-3" />
                  </div>
                </div>
              )) : (
                <EmptyState 
                  title="No Recent Activity" 
                  description="You haven't asked any questions or received answers recently." 
                  icon="inbox" 
                />
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Your Subjects</CardTitle>
            <CardDescription>Subjects you are enrolled in.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Replace with real subjects list if available */}
              <div className="text-muted-foreground text-sm">Connect with subjects from your department.</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
