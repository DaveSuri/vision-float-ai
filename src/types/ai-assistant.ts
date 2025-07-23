export interface VisionResult {
  id: string;
  type: 'text' | 'object' | 'landmark' | 'logo';
  content: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface AnalysisResponse {
  timestamp: string;
  imageUrl: string;
  results: VisionResult[];
  summary: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  imageData?: string;
  analysisResults?: VisionResult[];
}

export interface PermissionStatus {
  camera: boolean;
  overlay: boolean;
  storage: boolean;
}

export interface FloatingWidgetProps {
  isVisible: boolean;
  onClose: () => void;
  onCapture: () => void;
  onAnalyze: (imageData: string) => void;
}

export interface PreDefinedAction {
  id: string;
  label: string;
  icon: string;
  prompt: string;
  category: 'text' | 'translate' | 'identify' | 'summarize';
}