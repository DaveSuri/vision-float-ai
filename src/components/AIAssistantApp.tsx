import React, { useState, useEffect } from 'react';
import { FloatingWidget } from './FloatingWidget';
import { AnalysisPanel } from './AnalysisPanel';
import { PermissionSetup } from './PermissionSetup';
import { ChatInterface } from './ChatInterface';
import { CameraService } from '@/services/camera';
import { VisionAIService } from '@/services/vision-ai';
import { AnalysisResponse } from '@/types/ai-assistant';
import { useToast } from '@/hooks/use-toast';

export const AIAssistantApp: React.FC = () => {
  const [isPermissionsGranted, setIsPermissionsGranted] = useState(false);
  const [isWidgetVisible, setIsWidgetVisible] = useState(true);
  const [isAnalysisPanelVisible, setIsAnalysisPanelVisible] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if permissions were previously granted
    const checkInitialPermissions = async () => {
      // This would check actual permissions in a real app
      // For now, we'll start with the setup flow
    };
    
    const handleOpenChat = () => {
      setIsChatVisible(true);
    };
    
    window.addEventListener('openChat', handleOpenChat);
    checkInitialPermissions();
    
    return () => {
      window.removeEventListener('openChat', handleOpenChat);
    };
  }, []);

  const handlePermissionsGranted = () => {
    setIsPermissionsGranted(true);
    toast({
      title: "Permissions Granted",
      description: "AI Assistant is ready to use!",
    });
  };

  const handleCapture = async () => {
    if (isAnalyzing) return;
    
    setIsAnalyzing(true);
    try {
      const imageData = await CameraService.capturePhoto();
      await handleAnalyze(imageData);
    } catch (error) {
      console.error('Capture failed:', error);
      toast({
        title: "Capture Failed",
        description: "Could not capture image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = async (imageData: string) => {
    if (isAnalyzing) return;
    
    setIsAnalyzing(true);
    try {
      toast({
        title: "Analyzing Image",
        description: "AI is processing your image...",
      });

      const analysis = await VisionAIService.analyzeImage(imageData);
      setCurrentAnalysis(analysis);
      setIsAnalysisPanelVisible(true);
      
      toast({
        title: "Analysis Complete",
        description: analysis.summary,
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleWidgetClose = () => {
    setIsWidgetVisible(false);
    // In a real app, this would minimize to system tray or similar
    toast({
      title: "Assistant Minimized",
      description: "Tap the notification to restore the assistant.",
    });
  };

  const handleNewAnalysis = () => {
    setIsAnalysisPanelVisible(false);
    setCurrentAnalysis(null);
    // Reset to capture mode
  };

  if (!isPermissionsGranted) {
    return <PermissionSetup onPermissionsGranted={handlePermissionsGranted} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main background/demo content */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-ai flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">AI Visual Assistant</h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Your floating AI assistant is ready! Use the floating widget to capture and analyze 
            any screen content with Google Vision AI.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Camera Ready
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              AI Analysis Active
            </div>
          </div>
        </div>
      </div>

      {/* Floating Widget */}
      <FloatingWidget
        isVisible={isWidgetVisible}
        onClose={handleWidgetClose}
        onCapture={handleCapture}
        onAnalyze={handleAnalyze}
      />

      {/* Analysis Panel */}
      <AnalysisPanel
        analysis={currentAnalysis}
        isVisible={isAnalysisPanelVisible}
        onClose={() => setIsAnalysisPanelVisible(false)}
        onNewAnalysis={handleNewAnalysis}
      />

      {/* Chat Interface */}
      <ChatInterface
        isVisible={isChatVisible}
        onClose={() => setIsChatVisible(false)}
        analysisResults={currentAnalysis?.results || []}
      />

      {/* Loading overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-ai-glass/95 backdrop-blur-xl border border-ai-primary/20 rounded-lg p-6 flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-ai animate-spin">
              <div className="w-full h-full rounded-full border-2 border-transparent border-t-white" />
            </div>
            <span className="text-foreground font-medium">Analyzing with AI...</span>
          </div>
        </div>
      )}
    </div>
  );
};