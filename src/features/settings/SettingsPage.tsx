import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateSettings, useUpdateAvatar } from "@/hooks/useSettings";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import GuestOverlay from "@/components/shared/GuestOverlay";

export default function SettingsPage() {
  const { user, isGuest } = useAuth();

  if (isGuest) {
    return <GuestOverlay />;
  }
  
  const [bio, setBio] = useState(user?.bio || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  
  const updateSettings = useUpdateSettings();
  const updateAvatar = useUpdateAvatar();

  const handleSaveProfile = () => {
    updateSettings.mutate({ bio }, {
      onSuccess: () => toast.success("Profile updated"),
      onError: () => toast.error("Failed to update profile")
    });
  };

  const handleSaveAvatar = () => {
    updateAvatar.mutate({ profileImage }, {
      onSuccess: () => toast.success("Avatar updated"),
      onError: () => toast.error("Failed to update avatar")
    });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Separator />

      <div className="grid gap-8 md:grid-cols-[200px_1fr]">
        <nav className="flex flex-col gap-2 text-sm font-medium">
          <a href="#" className="px-3 py-2 bg-muted rounded-md text-primary">Account</a>
          <a href="#" className="px-3 py-2 text-muted-foreground hover:bg-muted/50 rounded-md transition-colors">Notifications</a>
          <a href="#" className="px-3 py-2 text-muted-foreground hover:bg-muted/50 rounded-md transition-colors">Appearance</a>
          <a href="#" className="px-3 py-2 text-muted-foreground hover:bg-muted/50 rounded-md transition-colors">Security</a>
        </nav>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={user?.email} disabled />
                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
              </div>
              <Button onClick={handleSaveProfile} disabled={updateSettings.isPending}>
                {updateSettings.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avatar</CardTitle>
              <CardDescription>Update your profile picture using an image URL.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-center">
                <img src={profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} alt="Avatar preview" className="w-16 h-16 rounded-full border bg-muted" />
                <div className="space-y-2 flex-1">
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <Input id="avatarUrl" value={profileImage} onChange={e => setProfileImage(e.target.value)} placeholder="https://example.com/avatar.png" />
                </div>
              </div>
              <Button onClick={handleSaveAvatar} disabled={updateAvatar.isPending}>
                {updateAvatar.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Avatar
              </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive">Delete Account</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
