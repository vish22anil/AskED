import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AIProviderFactory, AIMessage } from '../services/ai.service';
import prisma from '../utils/prisma';
import { AppError } from '../utils/errors';

export const handleAiChatStream = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Make auth optional for the public AI feature
    const userId = req.user?.id;
    const isGuest = !userId;

    const { messages, message, conversationId, mode = 'chat' } = req.body;
    
    let finalMessages = messages;
    if (!finalMessages && message) {
      finalMessages = [{ role: 'user', content: message }];
    }
    
    if (!finalMessages || !Array.isArray(finalMessages) || finalMessages.length === 0) {
      throw new AppError('Messages or message is required', 400);
    }

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const provider = AIProviderFactory.getProvider(process.env.AI_PROVIDER || 'gemini');

    let systemPrompt = `You are AskED's AI Study Buddy, an expert tutor. 
Your goal is to guide the student to the answer using hints and step-by-step explanations.
You MUST format your response using Markdown, and you MUST include the following sections exactly:

**Subject:** (Auto-detect the subject: Mathematics, Physics, Chemistry, Biology, Computer Science, DSA, etc.)
**Concept:** (A brief 1-2 sentence explanation of the core concept being asked)
**Step-by-step Explanation:** (Break the solution down into logical, easy-to-follow steps)
**Example:** (Provide a quick real-world or related example if applicable, otherwise omit)
**Important Points:** (Bullet points of key takeaways or formulas to remember)
**Final Answer:** (The final conclusion or answer)

Do not just give away the final answer immediately. Explain it thoroughly.`;
    if (mode === 'code') {
      systemPrompt = "You are an expert programming tutor. Explain code step-by-step, debug issues, and provide structural hints. Do not write the full solution for assignments, guide the student.";
    } else if (mode === 'quiz') {
      systemPrompt = "You are a quiz generator. Generate a challenging but fair multiple-choice quiz based on the user's topic. Provide explanations for the correct answers.";
    } else if (mode === 'summary') {
      systemPrompt = "You are an expert summarizer. Summarize the provided text or document clearly, highlighting the most important concepts and takeaways.";
    }

    const fullMessages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      ...finalMessages
    ];

    let fullResponse = '';

    await provider.chatStream(fullMessages, (chunk) => {
      fullResponse += chunk;
      // Send SSE format
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    });

    res.write('data: [DONE]\n\n');
    res.end();

    // Only save to DB if user is authenticated
    if (!isGuest && userId) {
      let activeConvId = conversationId;
      if (!activeConvId) {
        const conv = await prisma.aiConversation.create({
          data: {
            userId,
            title: finalMessages[0].content.substring(0, 50) + '...',
          }
        });
        activeConvId = conv.id;
      }

      if (activeConvId) {
        // Save user message and AI response
        const userMessage = finalMessages[finalMessages.length - 1];
        await prisma.aiMessage.createMany({
          data: [
            { conversationId: activeConvId, role: 'user', content: userMessage.content },
            { conversationId: activeConvId, role: 'assistant', content: fullResponse }
          ]
        });
      }
    }

  } catch (error: any) {
    console.error('AI Stream Error:', error);
    const rawMessage = error.message || '';
    let statusCode = 500;
    let cleanMessage = 'An unexpected error occurred during generation. Please try again.';
    
    if (rawMessage.includes('AI provider unavailable')) {
      statusCode = 503;
      cleanMessage = 'AI provider unavailable';
    } else if (rawMessage.includes('not configured') || rawMessage.includes('API_KEY') || rawMessage.includes('API key not valid')) {
      statusCode = 401;
      cleanMessage = 'AI provider authentication failed. Please check your API key.';
    } else if (rawMessage.includes('Rate limit') || rawMessage.includes('429') || rawMessage.includes('RESOURCE_EXHAUSTED')) {
      statusCode = 429;
      cleanMessage = 'Your Gemini API key has exceeded its quota or has a limit of 0 requests. Please enable billing in Google AI Studio or use a new API key.';
    } else if (rawMessage.includes('timeout') || rawMessage.includes('unavailable')) {
      statusCode = 503;
      cleanMessage = 'The AI service is temporarily unavailable. Please try again.';
    } else if (rawMessage.includes('404')) {
      statusCode = 404;
      cleanMessage = 'The requested AI model is not available or not supported by your API key.';
    }

    if (!res.headersSent) {
      res.status(statusCode).json({ success: false, message: cleanMessage });
    } else {
      res.write(`data: ${JSON.stringify({ error: cleanMessage })}\n\n`);
      res.end();
    }
  }
};

export const getHealth = async (req: Request, res: Response) => {
  const provider = process.env.AI_PROVIDER || 'gemini';
  const isConfigured = AIProviderFactory.isProviderConfigured(provider);
  res.status(200).json({
    configured: isConfigured,
    provider: provider,
    status: isConfigured ? 'ready' : 'missing_api_key'
  });
};

export const getConversations = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Unauthorized', 401);

    // Guest users should not see previous history from other guests
    if (req.user?.email === 'guest@asked.local') {
      return res.status(200).json({ success: true, data: [] });
    }

    const conversations = await prisma.aiConversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: { id: true, title: true, updatedAt: true }
    });

    res.status(200).json({ success: true, data: conversations });
  } catch (error) {
    next(error);
  }
};

export const getConversationMessages = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;

    const conversation = await prisma.aiConversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          select: { role: true, content: true }
        }
      }
    });

    if (!conversation || conversation.userId !== userId) {
      throw new AppError('Conversation not found', 404);
    }

    res.status(200).json({ success: true, data: conversation.messages });
  } catch (error) {
    next(error);
  }
};
