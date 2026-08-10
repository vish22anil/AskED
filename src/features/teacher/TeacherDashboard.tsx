import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Users, Star, Activity, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTeacherDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { data, isLoading, error } = useTeacherDashboard();

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
          <p className="text-muted-foreground">Manage student doubts and track your impact.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions Answered</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats.answersProvided || 0}</div>
            <p className="text-xs text-muted-foreground">Total answers provided</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted Answers</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats.acceptedAnswers || 0}</div>
            <p className="text-xs text-muted-foreground">Marked as helpful</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Upvotes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats.totalVotes || 0}</div>
            <p className="text-xs text-muted-foreground">From students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reputation</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.reputation || 0}</div>
            <p className="text-xs text-muted-foreground">Your impact score</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Needs Attention</CardTitle>
            <CardDescription>Questions waiting for your verified answer.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-muted-foreground text-sm">You can view open questions on the Q&A page.</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest interactions on the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.recentActivity?.length > 0 ? data.recentActivity.map((activity: any, i: number) => (
                <div key={i} className="flex flex-col gap-1 border-l-2 border-primary pl-4 py-1">
                  <p className="text-sm">
                    {activity.type === 'ANSWERED_QUESTION' ? `Answered a question` : 
                     activity.type.replace('_', ' ')}
                  </p>
                  <span className="text-xs text-muted-foreground">{new Date(activity.createdAt).toLocaleDateString()}</span>
                </div>
              )) : (
                <div className="text-muted-foreground text-sm">No recent activity.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
