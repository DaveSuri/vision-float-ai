import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  Camera,
  Clock,
  Zap
} from 'lucide-react';
import { ChatMessage, VisionResult } from '@/types/ai-assistant';

interface ChatInterfaceProps {
  isVisible: boolean;
  onClose: () => void;
  analysisResults?: VisionResult[];
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  isVisible,
  onClose,
  analysisResults = []
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const predefinedPrompts = [
    { label: "Summarize text", prompt: "Summarize all the text you can see in this image" },
    { label: "Translate", prompt: "Translate any text in this image to English" },
    { label: "Identify objects", prompt: "List all objects and items you can identify" },
    { label: "Read aloud", prompt: "Read out all text content in natural language" },
  ];

  useEffect(() => {
    if (analysisResults.length > 0) {
      const systemMessage: ChatMessage = {
        id: `sys-${Date.now()}`,
        type: 'assistant',
        content: `I've analyzed the image and found ${analysisResults.length} items. How can I help you with this content?`,
        timestamp: new Date().toISOString(),
        analysisResults
      };
      setMessages([systemMessage]);
    }
  }, [analysisResults]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: 'assistant',
        content: generateAIResponse(content, analysisResults),
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (prompt: string, results: VisionResult[]): string => {
    const textResults = results.filter(r => r.type === 'text');
    const objectResults = results.filter(r => r.type === 'object');
    
    if (prompt.toLowerCase().includes('summarize')) {
      if (textResults.length > 0) {
        return `I found ${textResults.length} text elements: ${textResults.slice(0, 3).map(r => r.content).join(', ')}${textResults.length > 3 ? '...' : ''}`;
      }
      return "I can see the image but couldn't detect specific text to summarize.";
    }
    
    if (prompt.toLowerCase().includes('translate')) {
      if (textResults.length > 0) {
        return `Here's the text I found that could be translated: "${textResults[0].content}"`;
      }
      return "I didn't detect any text that needs translation in this image.";
    }
    
    if (prompt.toLowerCase().includes('object') || prompt.toLowerCase().includes('identify')) {
      if (objectResults.length > 0) {
        return `I can identify these objects: ${objectResults.map(r => r.content).join(', ')}`;
      }
      return "I can see the image but couldn't identify specific objects clearly.";
    }

    return `Based on the analysis, I can help you with the ${results.length} items I detected. Could you be more specific about what you'd like to know?`;
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-4 top-4 bottom-4 w-80">
        <Card className="h-full bg-ai-glass/95 backdrop-blur-xl border border-ai-primary/20 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-ai flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-foreground">AI Chat</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-8 h-8 p-0"
            >
              ×
            </Button>
          </div>

          {/* Quick prompts */}
          {messages.length <= 1 && (
            <div className="p-4 border-b border-border/50">
              <p className="text-sm text-muted-foreground mb-3">Quick actions:</p>
              <div className="grid grid-cols-2 gap-2">
                {predefinedPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendMessage(prompt.prompt)}
                    className="text-xs h-auto py-2 px-3 border-ai-primary/20 hover:bg-ai-primary/10"
                  >
                    {prompt.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-ai flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-xs rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-ai-primary text-white'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-3 h-3 opacity-50" />
                      <span className="text-xs opacity-50">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  {message.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-ai-secondary flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-ai flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-secondary rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-ai-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-ai-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-ai-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border/50">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about the image..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                  className="pr-10"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleVoiceInput}
                  className={`absolute right-1 top-1 w-8 h-8 p-0 ${isListening ? 'text-red-500' : ''}`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>
              <Button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                className="w-10 h-10 p-0 bg-gradient-ai hover:opacity-90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};