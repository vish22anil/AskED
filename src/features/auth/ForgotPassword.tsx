import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

const resetSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be exactly 6 digits." }),
  newPassword: z.string().regex(passwordRegex, { message: "Password must be at least 8 chars, 1 uppercase, 1 lowercase, 1 number, and 1 special char." }),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type EmailFormValues = z.infer<typeof emailSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  
  const [cooldown, setCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { otp: "", newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (step === 2 && cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    } else if (cooldown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, cooldown]);

  const onEmailSubmit = async (data: EmailFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email: data.email });
      if (response.data.success) {
        toast.success(response.data.message || "OTP sent to your email.");
        setEmail(data.email);
        setStep(2);
        setCooldown(60);
        setCanResend(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const onResetSubmit = async (data: ResetFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/reset-password', {
        email,
        otp: data.otp,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      });
      if (response.data.success) {
        toast.success("Password reset successfully! You can now log in.");
        navigate('/auth/login');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP or request.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/resend-otp', {
        email,
        type: 'FORGOT_PASSWORD'
      });
      if (response.data.success) {
        toast.success("A new OTP has been sent to your email.");
        setCooldown(60);
        setCanResend(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px]">
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
        <p className="text-sm text-muted-foreground">
          {step === 1 ? "Enter your email to receive an OTP" : "Enter the OTP and your new password"}
        </p>
      </div>

      <Card className="border-0 shadow-lg">
        {step === 1 ? (
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
            <CardHeader>
              <CardTitle>Forgot Password</CardTitle>
              <CardDescription>
                We'll email you an OTP to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="m@example.com"
                  type="email"
                  disabled={isLoading}
                  {...emailForm.register("email")}
                />
                {emailForm.formState.errors.email && (
                  <p className="text-sm text-destructive">{emailForm.formState.errors.email.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send OTP
              </Button>
              <div className="text-center text-sm">
                Remember your password?{" "}
                <Link to="/auth/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={resetForm.handleSubmit(onResetSubmit)}>
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>
                Please enter the 6-digit code sent to {email}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">6-Digit OTP</Label>
                <Input
                  id="otp"
                  placeholder="000000"
                  className="text-center tracking-widest font-mono"
                  disabled={isLoading}
                  {...resetForm.register("otp")}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                    resetForm.setValue("otp", val);
                  }}
                />
                {resetForm.formState.errors.otp && (
                  <p className="text-sm text-destructive">{resetForm.formState.errors.otp.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  disabled={isLoading}
                  {...resetForm.register("newPassword")}
                />
                {resetForm.formState.errors.newPassword && (
                  <p className="text-sm text-destructive">{resetForm.formState.errors.newPassword.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  disabled={isLoading}
                  {...resetForm.register("confirmPassword")}
                />
                {resetForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">{resetForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset Password
              </Button>
              <div className="text-center text-sm">
                Didn't receive the code?{" "}
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="font-medium text-primary hover:underline"
                    disabled={isLoading}
                  >
                    Resend OTP
                  </button>
                ) : (
                  <span className="text-muted-foreground">Resend in {cooldown}s</span>
                )}
              </div>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
