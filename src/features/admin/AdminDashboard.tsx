import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, GraduationCap, MessageSquare, CheckCircle, Ban, Check } from "lucide-react";
import { useAdminDashboard } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { data, isLoading, error } = useAdminDashboard();
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/admin/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const toggleUserStatus = async (id: string, currentlyDisabled: boolean) => {
    try {
      if (currentlyDisabled) {
        await api.put(`/api/admin/users/${id}/enable`);
        toast.success("User enabled");
      } else {
        await api.put(`/api/admin/users/${id}/disable`);
        toast.success("User disabled");
      }
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

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
          <h2 className="text-3xl font-bold tracking-tight">System Admin</h2>
          <p className="text-muted-foreground">Monitor platform health and user statistics.</p>
        </div>
        <Button variant="outline">Download Report</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">Registered students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Teachers</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats.totalTeachers || 0}</div>
            <p className="text-xs text-muted-foreground">Registered teachers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats.totalQuestions || 0}</div>
            <p className="text-xs text-muted-foreground">{data?.stats.openQuestions || 0} currently open</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Answers</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats.totalAnswers || 0}</div>
            <p className="text-xs text-muted-foreground">Across all subjects</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Platform Metrics</CardTitle>
            <CardDescription>Live stats from the PostgreSQL database.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-muted-foreground text-sm">Real-time statistics are currently being gathered.</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Disable or enable users.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {loadingUsers ? <Skeleton className="h-20 w-full" /> : users.map(u => (
                <div key={u.id} className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium text-sm">{u.fullName}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                    <div className="flex gap-2 mt-1 text-[10px]">
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">{u.role}</span>
                      {u.isDisabled ? (
                        <span className="bg-destructive/10 text-destructive px-2 py-0.5 rounded">Disabled</span>
                      ) : (
                        <span className="bg-green-500/10 text-green-600 px-2 py-0.5 rounded">Active</span>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant={u.isDisabled ? "outline" : "destructive"} 
                    size="sm"
                    onClick={() => toggleUserStatus(u.id, u.isDisabled)}
                  >
                    {u.isDisabled ? <Check className="h-4 w-4 mr-1" /> : <Ban className="h-4 w-4 mr-1" />}
                    {u.isDisabled ? 'Enable' : 'Disable'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
