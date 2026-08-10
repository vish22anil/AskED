import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LegalPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Legal & Policies</h1>
        <p className="text-xl text-muted-foreground">Please read our terms and policies carefully.</p>
      </div>

      <Tabs defaultValue="terms" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="cookies">Cookie Policy</TabsTrigger>
          <TabsTrigger value="community">Community Guidelines</TabsTrigger>
        </TabsList>
        
        <TabsContent value="terms">
          <Card>
            <CardHeader>
              <CardTitle>Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none text-sm text-muted-foreground space-y-4">
              <p>Welcome to AskED. By accessing our platform, you agree to these terms and conditions.</p>
              <h3>1. Academic Integrity</h3>
              <p>AskED is designed as a learning aid, not a cheating tool. Users must not use the platform to violate the academic honor code of their respective institutions.</p>
              <h3>2. User Accounts</h3>
              <p>You must provide accurate information when creating an account. You are responsible for safeguarding your password and account details.</p>
              <h3>3. Content Ownership</h3>
              <p>By posting content on AskED (questions, answers, comments), you grant us a non-exclusive, worldwide license to use, display, and distribute that content on the platform.</p>
              <h3>4. Termination</h3>
              <p>We reserve the right to suspend or terminate accounts that violate these terms, particularly regarding academic dishonesty or community guidelines violations.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none text-sm text-muted-foreground space-y-4">
              <p>Your privacy is important to us. This policy explains how we collect, use, and protect your data.</p>
              <h3>1. Data Collection</h3>
              <p>We collect information you provide directly to us, such as when you create an account, post content, or communicate with us. This includes your name, email, department, and university credentials.</p>
              <h3>2. Use of Data</h3>
              <p>We use your data to provide, maintain, and improve our services, including the AI Study Buddy features. Your questions and interactions may be used to train our AI models securely.</p>
              <h3>3. Data Sharing</h3>
              <p>We do not sell your personal data. We may share anonymous aggregated data for research purposes. Verified teachers within your institution may see your profile details.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cookies">
          <Card>
            <CardHeader>
              <CardTitle>Cookie Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none text-sm text-muted-foreground space-y-4">
              <p>AskED uses cookies to improve your experience.</p>
              <h3>1. Essential Cookies</h3>
              <p>We use strict HTTP-only cookies to securely manage your authentication state (JWT tokens). These are required for the platform to function.</p>
              <h3>2. Analytics Cookies</h3>
              <p>We use minimal analytics cookies to understand how our users navigate the platform so we can improve the user interface.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community">
          <Card>
            <CardHeader>
              <CardTitle>Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none text-sm text-muted-foreground space-y-4">
              <p>To keep AskED a safe and helpful environment, all users must adhere to the following guidelines:</p>
              <h3>1. Be Respectful</h3>
              <p>Treat all users (students, teachers, and admins) with respect. Harassment, hate speech, or bullying will result in immediate account termination.</p>
              <h3>2. Provide Helpful Answers</h3>
              <p>When answering a peer's question, focus on explaining the concept rather than just providing the final answer. Act like a tutor.</p>
              <h3>3. No Spam</h3>
              <p>Do not post irrelevant content, self-promotion, or duplicate questions.</p>
              <h3>4. Reporting</h3>
              <p>If you see content that violates these guidelines, use the reporting tools to notify the moderation team.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
