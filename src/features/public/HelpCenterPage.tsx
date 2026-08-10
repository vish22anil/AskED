import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function HelpCenterPage() {
  const faqs = [
    {
      q: "How do I ask a question?",
      a: "Navigate to your dashboard and click the 'Ask a Question' button. Make sure to provide a clear title, select the correct subject, and add relevant tags."
    },
    {
      q: "How does the AI Study Buddy work?",
      a: "The AI Study Buddy acts as a virtual tutor. Instead of just giving you the final answer, it provides hints, explains concepts step-by-step, and guides you towards understanding the underlying problem."
    },
    {
      q: "Can I edit or delete my question after posting?",
      a: "Yes. If your question hasn't received any answers yet, you can edit or delete it from the question details page. Once a teacher or peer answers it, editing might be restricted."
    },
    {
      q: "How is reputation calculated?",
      a: "You earn reputation points when other users upvote your questions and answers, and when your answer is marked as 'Accepted' by the original poster."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Help Center</h1>
        <p className="text-xl text-muted-foreground">Find answers, documentation, and troubleshooting guides.</p>
        
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input className="pl-10 h-12 text-lg rounded-full" placeholder="Search for help articles..." />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <a href="#" className="block hover:text-primary hover:underline">Setting up your profile</a>
            <a href="#" className="block hover:text-primary hover:underline">How to formulate a great question</a>
            <a href="#" className="block hover:text-primary hover:underline">Understanding the reputation system</a>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Using the AI Workspace</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <a href="#" className="block hover:text-primary hover:underline">Getting coding help</a>
            <a href="#" className="block hover:text-primary hover:underline">Uploading documents for summary</a>
            <a href="#" className="block hover:text-primary hover:underline">Generating practice quizzes</a>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium text-lg">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
