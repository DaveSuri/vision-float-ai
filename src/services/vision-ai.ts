import { VisionResult, AnalysisResponse } from '../types/ai-assistant';

export class VisionAIService {
  private static readonly API_KEY = '543029716296-rbssrer3q9sd0v8mim39n363onl44lh5.apps.googleusercontent.com'; // To be configured by user
  private static readonly API_URL = 'https://vision.googleapis.com/v1/images:annotate';

  static async analyzeImage(imageData: string): Promise<AnalysisResponse> {
    try {
      // Remove data URL prefix if present
      const base64Image = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
      
      const requestBody = {
        requests: [
          {
            image: {
              content: base64Image
            },
            features: [
              { type: 'TEXT_DETECTION', maxResults: 50 },
              { type: 'OBJECT_LOCALIZATION', maxResults: 20 },
              { type: 'LANDMARK_DETECTION', maxResults: 10 },
              { type: 'LOGO_DETECTION', maxResults: 10 }
            ]
          }
        ]
      };

      const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Vision API error: ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseVisionResponse(data, imageData);
    } catch (error) {
      console.error('Error analyzing image:', error);
      
      // Return mock data for development/demo purposes
      return this.getMockAnalysis(imageData);
    }
  }

  private static parseVisionResponse(data: any, imageData: string): AnalysisResponse {
    const results: VisionResult[] = [];
    const response = data.responses[0];

    // Parse text annotations
    if (response.textAnnotations) {
      response.textAnnotations.forEach((annotation: any, index: number) => {
        if (index === 0) return; // Skip the full text annotation
        
        results.push({
          id: `text-${index}`,
          type: 'text',
          content: annotation.description,
          confidence: 0.9, // Google Vision doesn't return confidence for text
          boundingBox: this.parseBoundingBox(annotation.boundingPoly)
        });
      });
    }

    // Parse object annotations
    if (response.localizedObjectAnnotations) {
      response.localizedObjectAnnotations.forEach((obj: any, index: number) => {
        results.push({
          id: `object-${index}`,
          type: 'object',
          content: obj.name,
          confidence: obj.score,
          boundingBox: this.parseBoundingBox(obj.boundingPoly)
        });
      });
    }

    // Parse landmark annotations
    if (response.landmarkAnnotations) {
      response.landmarkAnnotations.forEach((landmark: any, index: number) => {
        results.push({
          id: `landmark-${index}`,
          type: 'landmark',
          content: landmark.description,
          confidence: landmark.score || 0.8,
          boundingBox: this.parseBoundingBox(landmark.boundingPoly)
        });
      });
    }

    // Parse logo annotations
    if (response.logoAnnotations) {
      response.logoAnnotations.forEach((logo: any, index: number) => {
        results.push({
          id: `logo-${index}`,
          type: 'logo',
          content: logo.description,
          confidence: logo.score || 0.8,
          boundingBox: this.parseBoundingBox(logo.boundingPoly)
        });
      });
    }

    const summary = this.generateSummary(results);

    return {
      timestamp: new Date().toISOString(),
      imageUrl: imageData,
      results,
      summary
    };
  }

  private static parseBoundingBox(boundingPoly: any) {
    if (!boundingPoly || !boundingPoly.vertices) return undefined;

    const vertices = boundingPoly.vertices;
    const xs = vertices.map((v: any) => v.x || 0);
    const ys = vertices.map((v: any) => v.y || 0);

    return {
      x: Math.min(...xs),
      y: Math.min(...ys),
      width: Math.max(...xs) - Math.min(...xs),
      height: Math.max(...ys) - Math.min(...ys)
    };
  }

  private static generateSummary(results: VisionResult[]): string {
    const textCount = results.filter(r => r.type === 'text').length;
    const objectCount = results.filter(r => r.type === 'object').length;
    const landmarkCount = results.filter(r => r.type === 'landmark').length;
    const logoCount = results.filter(r => r.type === 'logo').length;

    let summary = 'Analysis complete. Found: ';
    const parts = [];
    
    if (textCount > 0) parts.push(`${textCount} text element${textCount > 1 ? 's' : ''}`);
    if (objectCount > 0) parts.push(`${objectCount} object${objectCount > 1 ? 's' : ''}`);
    if (landmarkCount > 0) parts.push(`${landmarkCount} landmark${landmarkCount > 1 ? 's' : ''}`);
    if (logoCount > 0) parts.push(`${logoCount} logo${logoCount > 1 ? 's' : ''}`);

    return summary + (parts.length > 0 ? parts.join(', ') : 'no recognizable content');
  }

  private static getMockAnalysis(imageData: string): AnalysisResponse {
    return {
      timestamp: new Date().toISOString(),
      imageUrl: imageData,
      results: [
        {
          id: 'mock-text-1',
          type: 'text',
          content: 'Sample detected text',
          confidence: 0.95
        },
        {
          id: 'mock-object-1',
          type: 'object',
          content: 'Mobile phone',
          confidence: 0.87
        }
      ],
      summary: 'Mock analysis: Found 1 text element and 1 object'
    };
  }
}
