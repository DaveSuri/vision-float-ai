import { Camera } from '@capacitor/camera';
import { PermissionStatus } from '../types/ai-assistant';

export class PermissionService {
  static async requestCameraPermission(): Promise<boolean> {
    try {
      const permissions = await Camera.requestPermissions();
      return permissions.camera === 'granted';
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  }

  static async checkAllPermissions(): Promise<PermissionStatus> {
    try {
      const cameraPermissions = await Camera.checkPermissions();
      
      return {
        camera: cameraPermissions.camera === 'granted',
        overlay: true, // Will be handled by native Android layer
        storage: true  // Will be handled by filesystem plugin
      };
    } catch (error) {
      console.error('Error checking permissions:', error);
      return {
        camera: false,
        overlay: false,
        storage: false
      };
    }
  }

  static async requestAllPermissions(): Promise<PermissionStatus> {
    const cameraGranted = await this.requestCameraPermission();
    
    return {
      camera: cameraGranted,
      overlay: true, // Assuming granted for now
      storage: true  // Assuming granted for now
    };
  }
}