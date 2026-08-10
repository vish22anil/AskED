import { Card, CardContent } from "@/components/ui/card";
import { BrainCircuit, Lightbulb, Users, Target } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">About AskED</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We are on a mission to democratize learning through AI-powered guidance and community collaboration.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg"><Target className="w-6 h-6 text-primary" /></div>
              <h2 className="text-2xl font-bold">Our Mission</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              To provide students with instant, accurate, and structured academic support that fosters genuine understanding rather than just giving away the answers. We believe in teaching how to think, not just what to write.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg"><Lightbulb className="w-6 h-6 text-blue-500" /></div>
              <h2 className="text-2xl font-bold">Our Vision</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              To become the global standard for educational collaboration, where every student has access to a 24/7 personalized tutor and every teacher has the tools to impact thousands of learners simultaneously.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Why AskED Exists</h2>
        <div className="prose dark:prose-invert max-w-none text-muted-foreground">
          <p>
            Traditional education often leaves students waiting days for office hours to resolve simple doubts. Generic AI tools, on the other hand, provide direct answers without ensuring the student actually learns the concept.
          </p>
          <p>
            AskED bridges this gap. By combining the immediacy of an <strong>AI Study Buddy</strong> with the expertise of <strong>Verified Teachers</strong>, we create an environment where students are guided to the solution step-by-step.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Our Technology</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { name: "React & Vite", desc: "Lightning fast frontend UI" },
            { name: "Node.js & Express", desc: "Scalable backend architecture" },
            { name: "PostgreSQL", desc: "Robust data persistence" },
            { name: "Generative AI", desc: "Smart tutoring via LLMs" }
          ].map(tech => (
            <Card key={tech.name}>
              <CardContent className="pt-6 space-y-2">
                <BrainCircuit className="w-8 h-8 mx-auto text-primary" />
                <h3 className="font-semibold">{tech.name}</h3>
                <p className="text-xs text-muted-foreground">{tech.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
