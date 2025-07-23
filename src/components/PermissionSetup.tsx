import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  Eye, 
  HardDrive, 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Smartphone
} from 'lucide-react';
import { PermissionStatus } from '@/types/ai-assistant';
import { PermissionService } from '@/services/permissions';

interface PermissionSetupProps {
  onPermissionsGranted: () => void;
}

export const PermissionSetup: React.FC<PermissionSetupProps> = ({
  onPermissionsGranted
}) => {
  const [permissions, setPermissions] = useState<PermissionStatus>({
    camera: false,
    overlay: false,
    storage: false
  });
  const [isRequesting, setIsRequesting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const permissionSteps = [
    {
      id: 'camera',
      title: 'Camera Access',
      description: 'Required to capture photos for AI analysis',
      icon: Camera,
      required: true
    },
    {
      id: 'overlay',
      title: 'Display Over Apps',
      description: 'Allows the assistant to appear over other apps',
      icon: Eye,
      required: true
    },
    {
      id: 'storage',
      title: 'Storage Access',
      description: 'Save analysis results and app data',
      icon: HardDrive,
      required: false
    }
  ];

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const status = await PermissionService.checkAllPermissions();
    setPermissions(status);
    
    if (status.camera && status.overlay && status.storage) {
      onPermissionsGranted();
    }
  };

  const requestPermissions = async () => {
    setIsRequesting(true);
    
    try {
      const status = await PermissionService.requestAllPermissions();
      setPermissions(status);
      
      if (status.camera && status.overlay && status.storage) {
        onPermissionsGranted();
      }
    } catch (error) {
      console.error('Permission request failed:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  const getPermissionStatus = (key: keyof PermissionStatus) => {
    return permissions[key];
  };

  const getStatusIcon = (granted: boolean) => {
    return granted ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const allRequiredGranted = permissions.camera && permissions.overlay;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-ai flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">AI Assistant Setup</h1>
          <p className="text-muted-foreground">
            Grant permissions to enable floating AI analysis
          </p>
        </div>

        {/* Permissions List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Required Permissions
            </CardTitle>
            <CardDescription>
              These permissions are needed for the AI assistant to function properly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {permissionSteps.map((step) => {
              const isGranted = getPermissionStatus(step.id as keyof PermissionStatus);
              const Icon = step.icon;
              
              return (
                <div 
                  key={step.id}
                  className="flex items-center gap-3 p-3 rounded-lg border"
                >
                  <div className="p-2 rounded-lg bg-ai-primary/10">
                    <Icon className="w-5 h-5 text-ai-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm">{step.title}</h3>
                      {step.required && (
                        <Badge variant="secondary" className="text-xs">Required</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                  
                  {getStatusIcon(isGranted)}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Privacy Notice:</strong> All image analysis happens securely. 
            Images are processed only when you request analysis and are not stored 
            permanently without your consent.
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="space-y-3">
          {!allRequiredGranted ? (
            <Button
              onClick={requestPermissions}
              disabled={isRequesting}
              className="w-full bg-gradient-ai hover:opacity-90 transition-opacity"
            >
              {isRequesting ? 'Requesting Permissions...' : 'Grant Permissions'}
            </Button>
          ) : (
            <Button
              onClick={onPermissionsGranted}
              className="w-full bg-gradient-ai hover:opacity-90 transition-opacity"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Continue to App
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={checkPermissions}
            className="w-full"
          >
            Check Permissions Again
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-center text-xs text-muted-foreground">
          Having trouble? Make sure to allow permissions in your device settings
        </div>
      </div>
    </div>
  );
};