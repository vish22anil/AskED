import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Link as LinkIcon, Trophy } from "lucide-react";
import GuestOverlay from "@/components/shared/GuestOverlay";

export default function ProfilePage() {
  const { user, isGuest } = useAuth();

  if (isGuest) {
    return <GuestOverlay />;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-lg">
          <AvatarImage src={user?.profileImage} alt={user?.fullName} />
          <AvatarFallback className="text-3xl">{user?.fullName?.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="space-y-3 flex-1">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{user?.fullName}</h1>
            <p className="text-lg text-muted-foreground capitalize">{user?.role?.toLowerCase()}</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {user?.department && (
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {user.department}</span>
            )}
            {user?.year && (
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Year {user.year}</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" /> Reputation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <Badge variant="secondary" className="px-3 py-1.5 text-base w-max">{user?.reputation || 0} Points</Badge>
                
                {user?.badges && user.badges.length > 0 && (
                  <div className="space-y-2 mt-2">
                    <p className="text-sm font-semibold">Badges</p>
                    <div className="flex flex-wrap gap-2">
                      {user.badges.map((ub: any) => (
                        <div key={ub.badge.id} className="flex items-center gap-1.5 text-xs bg-muted px-2 py-1 rounded-md" title={ub.badge.description}>
                          <img src={ub.badge.iconUrl} alt={ub.badge.name} className="w-4 h-4 object-contain" />
                          <span className="font-medium">{ub.badge.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {user?.bio || "No bio provided yet."}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0">
              <TabsTrigger value="activity" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full bg-transparent px-6 font-medium">Activity</TabsTrigger>
              <TabsTrigger value="questions" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full bg-transparent px-6 font-medium">Questions</TabsTrigger>
              <TabsTrigger value="answers" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full bg-transparent px-6 font-medium">Answers</TabsTrigger>
            </TabsList>
            <TabsContent value="activity" className="pt-6">
              <Card className="border-0 shadow-none bg-transparent">
                <CardContent className="p-0 text-center text-muted-foreground py-12">
                  No recent activity to show.
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
