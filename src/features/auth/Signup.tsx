import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowRight, ArrowLeft, GraduationCap, Users } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().regex(passwordRegex, { message: "Password must be at least 8 chars, 1 uppercase, 1 lowercase, 1 number, and 1 special char." }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password." }),
  role: z.enum(["student", "teacher"]),
  university: z.string().min(1, { message: "University is required." }),
  department: z.string().min(1, { message: "Department is required." }),
  year: z.string().optional(),
  rollNumber: z.string().optional(),
  employeeId: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.role === "student") return !!data.year;
  return true;
}, {
  message: "Year is required for students",
  path: ["year"],
}).refine((data) => {
  if (data.role === "student") return !!data.rollNumber;
  return true;
}, {
  message: "Roll Number is required for students",
  path: ["rollNumber"],
}).refine((data) => {
  if (data.role === "teacher") return !!data.employeeId;
  return true;
}, {
  message: "Employee ID is required for teachers",
  path: ["employeeId"],
});

type SignupFormValues = z.infer<typeof formSchema>;

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // OTP State
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
      university: "",
      department: "",
      year: "",
      rollNumber: "",
      employeeId: "",
    },
    mode: "onChange"
  });

  const selectedRole = useWatch({
    control,
    name: "role",
  });

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (step === 3 && cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    } else if (step === 3 && cooldown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, cooldown]);

  const handleRoleSelect = (role: "student" | "teacher") => {
    setValue("role", role);
    setStep(2);
  };

  const onDetailsSubmit = async (data: SignupFormValues) => {
    const isValid = await trigger();
    if (!isValid) return;

    setIsLoading(true);
    try {
      const endpoint = data.role === "student" ? '/auth/register/student' : '/auth/register/teacher';
      const response = await api.post(endpoint, data);

      if (response.data.success) {
        toast.success(response.data.message || "Verification code sent to your email.");
        setStep(3);
        setCooldown(60);
        setCanResend(false);
      }
    } catch (error: any) {
      console.error(`\n--- 🚨 FRONTEND CAUGHT EXCEPTION 🚨 ---`);
      console.error(`Request:`, data);
      console.error(`Response Body:`, error.response?.data);
      console.error(`Status:`, error.response?.status);
      console.error(`--------------------------------\n`);

      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const firstError = error.response.data.errors[0];
        toast.error(`Validation Error: ${firstError.path} - ${firstError.message}`);
      } else if (error.response?.data?.errorName) {
        toast.error(`[${error.response.data.errorName}] ${error.response.data.message}`);
      } else {
        toast.error(error.message || "Network Error or Unknown Exception");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.post('/auth/verify-otp', {
        email: getValues('email'),
        otp,
        type: 'REGISTRATION'
      });
      if (response.data.success) {
        toast.success("Account created successfully!");
        if (getValues('role') === 'teacher') {
          toast.info("Your teacher account is pending admin approval.");
        }
        login(response.data.data.user);
        navigate(`/dashboard/${response.data.data.user.role.toLowerCase()}`);
      }
    } catch (error: any) {
      console.error(`\n--- 🚨 FRONTEND CAUGHT EXCEPTION (OTP Verify) 🚨 ---`);
      console.error(`Request:`, { email: getValues('email'), otp, type: 'REGISTRATION' });
      console.error(`Response Body:`, error.response?.data);
      console.error(`Status:`, error.response?.status);
      console.error(`--------------------------------\n`);

      if (error.response?.data?.errorName) {
        toast.error(`[${error.response.data.errorName}] ${error.response.data.message}`);
      } else {
        toast.error(error.message || "Network Error or Unknown Exception");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/resend-otp', {
        email: getValues('email'),
        type: 'REGISTRATION'
      });
      if (response.data.success) {
        toast.success("A new OTP has been sent to your email.");
        setCooldown(60);
        setCanResend(false);
        setOtp("");
      }
    } catch (error: any) {
      console.error(`\n--- 🚨 FRONTEND CAUGHT EXCEPTION (Resend OTP) 🚨 ---`);
      console.error(`Request:`, { email: getValues('email'), type: 'REGISTRATION' });
      console.error(`Response Body:`, error.response?.data);
      console.error(`Status:`, error.response?.status);
      console.error(`--------------------------------\n`);

      if (error.response?.data?.errorName) {
        toast.error(`[${error.response.data.errorName}] ${error.response.data.message}`);
      } else {
        toast.error(error.message || "Network Error or Unknown Exception");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[500px]">
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Join AskED</h1>
        <p className="text-muted-foreground">
          {step === 1 && "Choose how you want to use AskED"}
          {step === 2 && "Enter your details to create an account"}
          {step === 3 && `Verify your email: ${getValues('email')}`}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-2 gap-4"
          >
            <Card className="cursor-pointer hover:border-primary transition-all hover:shadow-md" onClick={() => handleRoleSelect('student')}>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <GraduationCap className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Student</h3>
                  <p className="text-sm text-muted-foreground mt-1">Ask questions, get help, and learn from peers.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-primary transition-all hover:shadow-md" onClick={() => handleRoleSelect('teacher')}>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Teacher</h3>
                  <p className="text-sm text-muted-foreground mt-1">Answer questions and guide students.</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="col-span-2 text-center mt-4 text-sm">
              Already have an account?{" "}
              <Link to="/auth/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Card className="border-0 shadow-lg">
              <form onSubmit={handleSubmit(onDetailsSubmit)}>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <Button type="button" variant="ghost" size="icon" onClick={() => setStep(1)}>
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <div>
                    <CardTitle>Sign Up as {selectedRole === 'student' ? 'Student' : 'Teacher'}</CardTitle>
                    <CardDescription>Fill in your academic details</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" placeholder="John Doe" disabled={isLoading} {...register("fullName")} />
                    {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="university">University</Label>
                      <Input id="university" placeholder="e.g. MIT" disabled={isLoading} {...register("university")} />
                      {errors.university && <p className="text-sm text-destructive">{errors.university.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input id="department" placeholder="e.g. CS" disabled={isLoading} {...register("department")} />
                      {errors.department && <p className="text-sm text-destructive">{errors.department.message}</p>}
                    </div>
                  </div>

                  {selectedRole === "student" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Select disabled={isLoading} onValueChange={(value) => setValue("year", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1st Year</SelectItem>
                            <SelectItem value="2">2nd Year</SelectItem>
                            <SelectItem value="3">3rd Year</SelectItem>
                            <SelectItem value="4">4th Year</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.year && <p className="text-sm text-destructive">{errors.year.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rollNumber">Roll Number</Label>
                        <Input id="rollNumber" placeholder="e.g. 10234" disabled={isLoading} {...register("rollNumber")} />
                        {errors.rollNumber && <p className="text-sm text-destructive">{errors.rollNumber.message}</p>}
                      </div>
                    </div>
                  )}

                  {selectedRole === "teacher" && (
                    <div className="space-y-2">
                      <Label htmlFor="employeeId">Employee ID</Label>
                      <Input id="employeeId" placeholder="e.g. EMP001" disabled={isLoading} {...register("employeeId")} />
                      {errors.employeeId && <p className="text-sm text-destructive">{errors.employeeId.message}</p>}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">{selectedRole === 'teacher' ? 'Official Email' : 'Email'}</Label>
                    <Input id="email" placeholder="m@example.com" type="email" autoCapitalize="none" autoComplete="email" disabled={isLoading} {...register("email")} />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" disabled={isLoading} {...register("password")} />
                      {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" disabled={isLoading} {...register("confirmPassword")} />
                      {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
                    </div>
                  </div>

                </CardContent>
                <CardFooter>
                  <Button className="w-full gap-2" type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Continue <ArrowRight className="w-4 h-4" /></>}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Card className="border-0 shadow-lg">
              <form onSubmit={handleVerifyOTP}>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 text-left">
                  <Button type="button" variant="ghost" size="icon" onClick={() => setStep(2)}>
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <div>
                    <CardTitle>Enter OTP</CardTitle>
                    <CardDescription>
                      Sent to <strong>{getValues('email')}</strong>
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 text-center py-6">
                  <div className="max-w-[280px] mx-auto">
                    <Input
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                      placeholder="000000"
                      className="text-center text-4xl tracking-[0.5em] h-20 font-mono font-bold bg-muted/50 border-primary/20"
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-6">
                  <Button className="w-full h-12 text-lg" type="submit" disabled={isLoading || otp.length !== 6}>
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Verify & Create Account"}
                  </Button>
                  <div className="text-center text-sm bg-muted/50 w-full p-3 rounded-lg flex items-center justify-center gap-2">
                    <span className="text-muted-foreground">Didn't receive the code?</span>
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
                      <span className="font-mono bg-background px-2 py-1 rounded border text-primary">00:{cooldown.toString().padStart(2, '0')}</span>
                    )}
                  </div>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
