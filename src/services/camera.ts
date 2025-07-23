import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export class CameraService {
  static async capturePhoto(): Promise<string> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (!image.dataUrl) {
        throw new Error('Failed to capture image data');
      }

      return image.dataUrl;
    } catch (error) {
      console.error('Error capturing photo:', error);
      throw new Error('Failed to capture photo');
    }
  }

  static async captureScreenshot(): Promise<string> {
    try {
      // Note: This is a simplified implementation
      // In a real app, you'd need a native plugin for system screenshots
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos, // For now, allow user to pick existing image
      });

      if (!image.dataUrl) {
        throw new Error('Failed to capture screenshot data');
      }

      return image.dataUrl;
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      throw new Error('Failed to capture screenshot');
    }
  }
}