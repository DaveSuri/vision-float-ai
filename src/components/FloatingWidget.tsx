import React, { useState, useRef, useEffect } from 'react';
import { Camera, Eye, MessageSquare, Settings, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FloatingWidgetProps } from '@/types/ai-assistant';
import { ScreenScannerService } from '@/services/screen-scanner';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

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
  const [showWidget, setShowWidget] = useState(isVisible);
  const [showCommandModal, setShowCommandModal] = useState(false);
  const [userCommand, setUserCommand] = useState('');
  const [aiResponse, setAiResponse] = useState('');

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

  // Gesture hotspot logic
  useEffect(() => {
    const handleHotspotSwipe = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      // Detect swipe from bottom-right corner (within 40px)
      if (
        touch.clientX > window.innerWidth - 40 &&
        touch.clientY > window.innerHeight - 40
      ) {
        setShowWidget(true);
      }
    };
    window.addEventListener('touchstart', handleHotspotSwipe);
    return () => window.removeEventListener('touchstart', handleHotspotSwipe);
  }, []);

  const handleQuickCapture = async () => {
    try {
      onCapture();
    } catch (error) {
      console.error('Quick capture failed:', error);
    }
  };

  const handleScreenScan = async () => {
    await ScreenScannerService.requestScreenScan();
  };

  if (!showWidget) {
    // Hotspot for gesture/swipe to open widget
    return (
      <div
        className="fixed bottom-0 right-0 z-50"
        style={{ width: 40, height: 40, opacity: 0.1, background: 'transparent' }}
        onClick={() => setShowWidget(true)}
      />
    );
  }

  if (!isVisible) return null;

  return (
    <>
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
              onClick={() => setShowCommandModal(true)}
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
                  onClick={handleScreenScan}
                >
                  <Eye className="w-5 h-5" />
                  <span className="text-xs">Scan Screen</span>
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
      {/* Command Modal */}
      <Dialog open={showCommandModal} onOpenChange={setShowCommandModal}>
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-80 shadow-lg flex flex-col gap-4">
            <h2 className="text-lg font-semibold mb-2">AI Command</h2>
            <Input
              placeholder="What do you want the AI to do?"
              value={userCommand}
              onChange={e => setUserCommand(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  // Simulate AI response
                  setAiResponse(`(Stub) AI will process: "${userCommand}" with context from Vision AI.`);
                }
              }}
            />
            <Button
              onClick={() => {
                setAiResponse(`(Stub) AI will process: "${userCommand}" with context from Vision AI.`);
              }}
              disabled={!userCommand}
            >
              Send
            </Button>
            {aiResponse && (
              <div className="mt-2 p-2 bg-zinc-100 dark:bg-zinc-800 rounded text-sm">
                {aiResponse}
              </div>
            )}
            <Button variant="ghost" onClick={() => setShowCommandModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};