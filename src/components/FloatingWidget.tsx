import React, { useState, useRef, useEffect } from 'react';
import { Camera, Eye, MessageSquare, Settings, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FloatingWidgetProps } from '@/types/ai-assistant';

export const FloatingWidget: React.FC<FloatingWidgetProps> = ({
  isVisible,
  onClose,
  onCapture,
  onAnalyze
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const handleQuickCapture = async () => {
    try {
      onCapture();
    } catch (error) {
      console.error('Quick capture failed:', error);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={dragRef}
      className="fixed z-50 select-none"
      style={{
        left: position.x,
        top: position.y,
        transform: isExpanded ? 'none' : 'none'
      }}
    >
      {!isExpanded ? (
        // Collapsed floating button
        <div 
          className="relative group cursor-move"
          onMouseDown={handleMouseDown}
        >
          <Button
            size="lg"
            className="w-16 h-16 rounded-full bg-gradient-ai shadow-floating border border-ai-primary/20 hover:scale-110 transition-all duration-300 ease-bounce-in"
            onClick={() => setIsExpanded(true)}
          >
            <Zap className="w-8 h-8 text-white" />
          </Button>
          
          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-ai-primary/20 animate-ping" />
          
          {/* Tooltip */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg px-3 py-1 text-sm whitespace-nowrap">
            AI Assistant
          </div>
        </div>
      ) : (
        // Expanded widget panel
        <Card className="w-80 bg-ai-glass/95 backdrop-blur-xl border border-ai-primary/20 shadow-floating">
          {/* Header */}
          <div 
            className="flex items-center justify-between p-4 border-b border-border/50 cursor-move"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-ai flex items-center justify-center">
                <Eye className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-foreground">AI Assistant</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="w-8 h-8 p-0 hover:bg-ai-primary/10"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="w-8 h-8 p-0 hover:bg-destructive/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick actions */}
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="h-12 flex-col gap-1 border-ai-primary/20 hover:bg-ai-primary/10"
                onClick={handleQuickCapture}
              >
                <Camera className="w-5 h-5" />
                <span className="text-xs">Capture</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-12 flex-col gap-1 border-ai-secondary/20 hover:bg-ai-secondary/10"
                onClick={() => {/* Handle screenshot */}}
              >
                <Eye className="w-5 h-5" />
                <span className="text-xs">Screenshot</span>
              </Button>
            </div>

            <Button
              className="w-full bg-gradient-ai hover:opacity-90 transition-opacity"
              onClick={() => window.dispatchEvent(new CustomEvent('openChat'))}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Start Analysis
            </Button>
          </div>

          {/* Status indicator */}
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-ai-primary animate-pulse" />
              Ready for analysis
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};