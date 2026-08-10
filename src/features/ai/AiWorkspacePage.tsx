import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, User, BrainCircuit, Loader2, Camera, Upload, Image as ImageIcon } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import CameraCapture from "@/components/shared/CameraCapture";
import FileUpload from "@/components/shared/FileUpload";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  image?: string;
}

export default function AiWorkspacePage() {
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi there! I'm your AskED AI Study Buddy. How can I help you understand a concept today? You can type a question, take a photo, or upload an image." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, showCamera, showUpload, attachedImage]);

  useEffect(() => {
    // Handle initial state from landing page routing
    const state = location.state as { initialQuestion?: string, openCamera?: boolean, openUpload?: boolean } | null;
    if (state) {
      if (state.initialQuestion) {
        setInput(state.initialQuestion);
        // Clean state so we don't re-trigger
        window.history.replaceState({}, document.title);
      }
      if (state.openCamera) {
        setShowCamera(true);
        window.history.replaceState({}, document.title);
      }
      if (state.openUpload) {
        setShowUpload(true);
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() && !attachedImage || isTyping) return;

    const userMessage: Message = { 
      role: "user", 
      content: textToSend,
      image: attachedImage || undefined 
    };
    
    setMessages(prev => [...prev, userMessage]);
    if (!customPrompt) setInput("");
    setAttachedImage(null);
    setIsTyping(true);

    try {
      const payloadMessages = [...messages, userMessage].map(m => {
        const payload: any = { role: m.role, content: m.content };
        if (m.image) {
          if (m.image.startsWith('data:image/')) {
            payload.image = m.image;
          } else {
            payload.content = `${m.image}\n\n${m.content}`;
          }
        }
        return payload;
      });

      // Only send token if it exists (for unauthenticated flow)
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({ messages: payloadMessages, mode: 'chat' })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP ${response.status} - ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          
          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.error) {
                  setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMsg = { ...newMessages[newMessages.length - 1] };
                    lastMsg.content = `**Error:** ${data.error}`;
                    newMessages[newMessages.length - 1] = lastMsg;
                    return newMessages;
                  });
                } else if (data.text) {
                  setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMsg = { ...newMessages[newMessages.length - 1] };
                    lastMsg.content += data.text;
                    newMessages[newMessages.length - 1] = lastMsg;
                    return newMessages;
                  });
                }
              } catch (e) {
                // Ignore parse errors on partial chunks
              }
            }
          }
        }
      }
    } catch (error: any) {
      setMessages(prev => [...prev, { role: "assistant", content: `**Backend Error:** ${error.message}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCameraCapture = (imageSrc: string) => {
    setAttachedImage(imageSrc);
    setShowCamera(false);
  };

  const handleFileUpload = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
        setShowUpload(false);
      };
      reader.readAsDataURL(file);
    } else {
      // PDF handling would go here, maybe setting file metadata
      setAttachedImage(`[PDF Attached: ${file.name}]`);
      setShowUpload(false);
    }
  };

  const studyModes = [
    { label: "Explain Simply", prompt: "Explain this to me in simpler terms, like I am a beginner." },
    { label: "Give an Example", prompt: "Can you provide a real-world example of this?" },
    { label: "Show Steps", prompt: "Break this down into step-by-step instructions." },
    { label: "Quiz Me", prompt: "Generate a quick quiz question based on what we just discussed to test my understanding." },
  ];

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-100px)] flex flex-col p-4 md:p-8">
      
      <div className="flex items-center gap-2 mb-4 px-2">
        <BrainCircuit className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">AI Study Buddy</h1>
      </div>

      <Card className="flex-1 flex flex-col h-full shadow-xl border-primary/10 overflow-hidden bg-card/80 backdrop-blur-md">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex gap-4 max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted/50 border shadow-sm'}`}>
                <div className="prose dark:prose-invert max-w-none text-sm break-words">
                  {msg.image && !msg.image.startsWith('[PDF') && (
                    <img src={msg.image} alt="User Attachment" className="max-w-full rounded-lg mb-3 border object-cover max-h-64" />
                  )}
                  {msg.image?.startsWith('[PDF') && (
                    <div className="bg-background/20 p-2 rounded mb-2 text-xs opacity-80">{msg.image}</div>
                  )}
                  {msg.role === 'user' ? (
                    <p className="m-0">{msg.content}</p>
                  ) : (
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
                
                {/* Show Study Mode Actions on the last AI response */}
                {msg.role === 'assistant' && index === messages.length - 1 && index !== 0 && !isTyping && (
                  <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap gap-2">
                    {studyModes.map((mode, i) => (
                      <Button 
                        key={i} 
                        variant="secondary" 
                        size="sm" 
                        className="text-xs h-7"
                        onClick={() => handleSend(mode.prompt)}
                      >
                        {mode.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {showCamera && (
            <div className="my-4">
              <CameraCapture onCapture={handleCameraCapture} onCancel={() => setShowCamera(false)} />
            </div>
          )}

          {showUpload && (
            <div className="my-4">
              <FileUpload onUpload={handleFileUpload} onCancel={() => setShowUpload(false)} />
            </div>
          )}

          {isTyping && (
             <div className="flex gap-4 max-w-[85%]">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-muted">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-xl bg-muted/50 border flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t bg-background">
          {attachedImage && (
            <div className="mb-3 relative inline-block">
              {attachedImage.startsWith('[PDF') ? (
                <div className="px-3 py-1 bg-muted border rounded-md text-xs font-medium flex items-center gap-2">
                  <span>📄 {attachedImage.replace('[PDF Attached: ', '').replace(']', '')}</span>
                  <button onClick={() => setAttachedImage(null)} className="hover:text-destructive"><X className="w-3 h-3" /></button>
                </div>
              ) : (
                <>
                  <img src={attachedImage} alt="Attachment" className="h-16 w-16 object-cover rounded-lg border" />
                  <button 
                    onClick={() => setAttachedImage(null)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 shadow-sm"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
          )}
          
          <div className="relative flex items-end gap-2">
            <div className="flex flex-col gap-2 pb-2 pl-2">
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                className="rounded-full w-8 h-8 hover:bg-primary/10 hover:text-primary"
                onClick={() => { setShowCamera(true); setShowUpload(false); }}
                title="Scan Question"
              >
                <Camera className="w-4 h-4" />
              </Button>
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                className="rounded-full w-8 h-8 hover:bg-primary/10 hover:text-primary"
                onClick={() => { setShowUpload(true); setShowCamera(false); }}
                title="Upload Image/PDF"
              >
                <ImageIcon className="w-4 h-4" />
              </Button>
            </div>
            <Textarea 
              placeholder="Ask anything..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="min-h-[60px] resize-none rounded-2xl border-muted-foreground/20 focus-visible:ring-primary/50"
            />
            <Button 
              size="icon" 
              className="h-12 w-12 rounded-xl shrink-0" 
              onClick={() => handleSend()}
              disabled={(!input.trim() && !attachedImage) || isTyping}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <div className="text-center mt-3">
            <span className="text-xs text-muted-foreground font-medium">AskED AI can make mistakes. Consider verifying important information.</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
