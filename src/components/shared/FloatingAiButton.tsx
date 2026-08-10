import { useState } from "react";
import { Link } from "react-router-dom";
import { Bot, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingAiButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-card border shadow-xl rounded-2xl p-4 mb-4 w-72"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" /> AI Study Buddy
              </h4>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Need help with a concept, debugging code, or summarizing notes?
            </p>
            <Link to="/app/ai" onClick={() => setIsOpen(false)}>
              <Button className="w-full gap-2">
                <Sparkles className="w-4 h-4" /> Open AI Workspace
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </Button>
    </div>
  );
}
