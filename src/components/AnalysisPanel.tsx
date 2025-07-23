import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Camera, 
  Copy, 
  Download, 
  Eye, 
  FileText, 
  MapPin, 
  Package,
  Sparkles,
  Type,
  X 
} from 'lucide-react';
import { VisionResult, AnalysisResponse } from '@/types/ai-assistant';
import { useToast } from '@/hooks/use-toast';

interface AnalysisPanelProps {
  analysis: AnalysisResponse | null;
  isVisible: boolean;
  onClose: () => void;
  onNewAnalysis: () => void;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  analysis,
  isVisible,
  onClose,
  onNewAnalysis
}) => {
  const [selectedResult, setSelectedResult] = useState<VisionResult | null>(null);
  const { toast } = useToast();

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'text': return <Type className="w-4 h-4" />;
      case 'object': return <Package className="w-4 h-4" />;
      case 'landmark': return <MapPin className="w-4 h-4" />;
      case 'logo': return <Sparkles className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const getResultColor = (type: string) => {
    switch (type) {
      case 'text': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'object': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'landmark': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'logo': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const handleCopyResult = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Result copied successfully",
    });
  };

  const handleExportAnalysis = () => {
    if (!analysis) return;
    
    const exportData = {
      timestamp: analysis.timestamp,
      summary: analysis.summary,
      results: analysis.results.map(r => ({
        type: r.type,
        content: r.content,
        confidence: r.confidence
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vision-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isVisible || !analysis) return null;

  return (
    <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm">
      <div className="fixed right-4 top-4 bottom-4 w-96">
        <Card className="h-full bg-ai-glass/95 backdrop-blur-xl border border-ai-primary/20 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-ai flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-foreground">Analysis Results</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExportAnalysis}
                className="w-8 h-8 p-0 hover:bg-ai-primary/10"
              >
                <Download className="w-4 h-4" />
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

          {/* Summary */}
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-ai-primary" />
              <span className="text-sm font-medium">Summary</span>
            </div>
            <p className="text-sm text-muted-foreground">{analysis.summary}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {analysis.results.length} results
              </Badge>
              <Badge variant="outline" className="text-xs">
                {new Date(analysis.timestamp).toLocaleTimeString()}
              </Badge>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-3">
                {analysis.results.map((result) => (
                  <Card 
                    key={result.id}
                    className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                      selectedResult?.id === result.id ? 'ring-2 ring-ai-primary' : ''
                    }`}
                    onClick={() => setSelectedResult(result)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getResultColor(result.type)}`}>
                        {getResultIcon(result.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getResultColor(result.type)}`}
                          >
                            {result.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {Math.round(result.confidence * 100)}%
                          </span>
                        </div>
                        
                        <p className="text-sm font-medium text-foreground truncate">
                          {result.content}
                        </p>
                        
                        {result.boundingBox && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Position: {result.boundingBox.x}, {result.boundingBox.y}
                          </p>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyResult(result.content);
                        }}
                        className="w-8 h-8 p-0 hover:bg-ai-primary/10"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-border/50">
            <Button
              onClick={onNewAnalysis}
              className="w-full bg-gradient-ai hover:opacity-90 transition-opacity"
            >
              <Camera className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};