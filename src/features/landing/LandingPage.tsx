import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowRight, 
  BrainCircuit, 
  Camera, 
  Upload, 
  Search, 
  BookMarked,
  ShieldCheck,
  Send
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      navigate('/ai', { state: { initialQuestion: question } });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-16 md:pt-24 pb-16 md:pb-24">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" style={{ backgroundSize: "30px 30px", backgroundImage: "linear-gradient(to right, #80808012 1px, transparent 1px), linear-gradient(to bottom, #80808012 1px, transparent 1px)" }} />
        
        <div className="container relative mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mx-auto max-w-4xl"
          >
            <motion.h1 
              variants={fadeIn}
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400"
            >
              Ask Anything.<br />Understand Everything.
            </motion.h1>
            <motion.p 
              variants={fadeIn}
              className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
            >
              Take a photo, upload a question, or type your doubt. AskED's AI Study Buddy explains it step by step.
            </motion.p>

            <motion.div variants={fadeIn} className="max-w-2xl mx-auto">
              <Card className="border-2 shadow-xl bg-card/80 backdrop-blur-xl">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="h-24 flex flex-col gap-2 rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all"
                      onClick={() => navigate('/ai', { state: { openCamera: true } })}
                    >
                      <Camera className="w-8 h-8 text-primary" />
                      <span className="font-semibold text-lg">Scan Question</span>
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="h-24 flex flex-col gap-2 rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all"
                      onClick={() => navigate('/ai', { state: { openUpload: true } })}
                    >
                      <Upload className="w-8 h-8 text-primary" />
                      <span className="font-semibold text-lg">Upload File</span>
                    </Button>
                  </div>
                  
                  <div className="relative flex items-center justify-center my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-muted"></div>
                    </div>
                    <div className="relative bg-card px-4 text-muted-foreground text-sm font-medium uppercase">
                      Or type it
                    </div>
                  </div>

                  <form onSubmit={handleAsk} className="relative flex items-center">
                    <Input 
                      placeholder="e.g. Explain binary search with an example..." 
                      className="h-14 pr-16 text-lg rounded-2xl bg-background/50 border-muted-foreground/20 focus-visible:ring-primary/50"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                    />
                    <Button 
                      type="submit"
                      size="icon" 
                      className="absolute right-2 h-10 w-10 rounded-xl"
                      disabled={!question.trim()}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Subjects Section */}
      <section id="subjects" className="py-16 border-y bg-muted/30">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h3 className="text-xl font-semibold mb-8 text-muted-foreground">Master any subject with instant explanations</h3>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Programming", "DSA", "DBMS", "Operating Systems", "AI/ML", "Statistics", "Economics", "English"].map((subject) => (
              <span key={subject} className="px-4 py-2 rounded-full bg-background border shadow-sm text-sm font-medium">
                {subject}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Your Ultimate AI Study Buddy</h2>
            <p className="text-lg text-muted-foreground">Built specifically for students to understand concepts, not just copy answers.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BrainCircuit, title: "Step-by-Step Logic", desc: "Get detailed explanations broken down into easy-to-understand steps." },
              { icon: Search, title: "Instant Subject Detection", desc: "Our AI automatically detects the subject and tailors the explanation." },
              { icon: BookMarked, title: "Smart Study Modes", desc: "Ask it to explain simply, give examples, or quiz you on the topic." },
              { icon: Camera, title: "Vision AI", desc: "Take a picture of any complex equation or diagram to get help." },
              { icon: Upload, title: "PDF & Document Support", desc: "Upload your study materials for contextual doubt solving." },
              { icon: ShieldCheck, title: "Reliable Guidance", desc: "Built to act like a true tutor, guiding you to the right answer safely." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How it works</h2>
            <p className="text-lg text-muted-foreground">A seamless workflow designed for quick and accurate doubt resolution.</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -z-10" />
            
            {[
              { step: "1", title: "Capture Doubt", desc: "Take a photo or type your question." },
              { step: "2", title: "AI Analyzes", desc: "Advanced vision models read your doubt." },
              { step: "3", title: "Get Explanation", desc: "Receive a step-by-step breakdown." },
              { step: "4", title: "Follow Up", desc: "Ask clarifying questions or for examples." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center bg-background p-6 rounded-xl border shadow-sm w-full md:w-64 z-10"
              >
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is AskED free for students?</AccordionTrigger>
              <AccordionContent>
                Yes! The core AI doubt-solving platform is completely free and accessible without an account.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How accurate is the AI Assistant?</AccordionTrigger>
              <AccordionContent>
                The AI is designed to act as a tutor, providing hints and structural guidance. It excels at breaking down complex concepts, but as with all AI, it's best to use it as a learning aid rather than an absolute source of truth.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I upload images of my handwritten notes?</AccordionTrigger>
              <AccordionContent>
                Absolutely. AskED supports image and PDF uploads. Our OCR technology can read handwritten equations and diagrams to help you understand your exact problem.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Do I need to create an account?</AccordionTrigger>
              <AccordionContent>
                No! You can instantly ask questions, scan doubts, and get step-by-step explanations without ever signing up or logging in.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Ready to understand everything?</h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Try AskED right now. No signup required.
          </p>
          <Button size="lg" variant="secondary" className="text-lg h-14 px-10" asChild>
            <Link to="/ai">Ask Your First Question <ArrowRight className="ml-2 w-5 h-5" /></Link>
          </Button>
        </div>
      </section>
      
    </div>
  );
}
