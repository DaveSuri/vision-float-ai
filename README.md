# AI Visual Assistant - Android Floating Overlay App

A powerful Android app that provides a floating AI assistant overlay for real-time visual analysis using Google Vision AI. The assistant can analyze screen content, recognize text, identify objects, and provide intelligent responses.

## 🌟 Features

- **Floating Overlay Widget**: Persistent floating assistant that works over all apps
- **Google Vision AI Integration**: Advanced text recognition and object detection
- **Smart Analysis**: Real-time analysis of captured images and screenshots
- **Interactive Chat**: AI-powered conversations about visual content
- **Permission Management**: Secure handling of camera and overlay permissions
- **Production Ready**: Privacy-focused with secure data handling

## 🚀 Quick Start

### Prerequisites

- Android device or emulator
- Node.js & npm installed
- Android Studio (for native development)
- Google Cloud Vision API key

### Installation

1. **Export to GitHub** via the Lovable interface
2. **Clone your repository**:
   ```bash
   git clone <YOUR_GITHUB_REPO_URL>
   cd your-repo-name
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Configure Google Vision AI**:
   - Get a Google Cloud Vision API key
   - Update `src/services/vision-ai.ts` with your API key:
   ```typescript
   private static readonly API_KEY = 'YOUR_GOOGLE_CLOUD_VISION_API_KEY';
   ```

5. **Initialize Capacitor**:
   ```bash
   npx cap init
   ```

6. **Add Android platform**:
   ```bash
   npx cap add android
   ```

7. **Build and sync**:
   ```bash
   npm run build
   npx cap sync android
   ```

8. **Run on device**:
   ```bash
   npx cap run android
   ```

## 📱 Android Setup Requirements

### Required Permissions

The app requires these Android permissions:

1. **CAMERA** - For capturing photos
2. **SYSTEM_ALERT_WINDOW** - For floating overlay
3. **WRITE_EXTERNAL_STORAGE** - For saving analysis results

### Native Android Configuration

For full floating overlay functionality, you may need to add native Android code:

1. **AndroidManifest.xml** additions:
   ```xml
   <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
   <uses-permission android:name="android.permission.CAMERA" />
   <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
   ```

2. **Service for floating overlay** (requires native development)

## 🏗️ Architecture

### Core Components

- **FloatingWidget**: Draggable floating assistant interface
- **AnalysisPanel**: Results display with detailed analysis
- **ChatInterface**: AI conversation interface
- **PermissionSetup**: Secure permission management
- **VisionAIService**: Google Vision AI integration
- **CameraService**: Camera and screenshot capture

### Key Technologies

- **React + TypeScript**: Frontend framework
- **Capacitor**: Native mobile capabilities
- **Google Vision AI**: Image analysis and recognition
- **Tailwind CSS**: Beautiful, responsive design
- **shadcn/ui**: Polished UI components

## 🔒 Privacy & Security

- **Local Processing**: Images processed securely
- **No Permanent Storage**: Images not stored without consent
- **Permission-Based**: All features require explicit user consent
- **Secure API**: Google Vision AI with proper authentication

## 🎨 Customization

### Design System

The app uses a dark theme with AI-focused design tokens:

```css
--ai-primary: 142.1 76.2% 36.3%;     /* Green accent */
--ai-secondary: 217.2 91.2% 59.8%;   /* Blue accent */
--ai-accent: 270 95% 75%;             /* Purple accent */
```

### Predefined Actions

Customize AI analysis prompts in `ChatInterface.tsx`:

```typescript
const predefinedPrompts = [
  { label: "Summarize text", prompt: "Summarize all the text..." },
  { label: "Translate", prompt: "Translate any text..." },
  // Add your custom prompts
];
```

## 🛠️ Development

### Local Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Sync with native platforms
npx cap sync
```

### Adding Features

1. **New AI Capabilities**: Extend `VisionAIService`
2. **UI Components**: Add to `src/components/`
3. **Native Features**: Use Capacitor plugins

## 📖 API Documentation

### VisionAIService

```typescript
// Analyze image with Google Vision AI
const analysis = await VisionAIService.analyzeImage(imageData);

// Returns: AnalysisResponse with detected text, objects, landmarks
```

### CameraService

```typescript
// Capture photo from camera
const imageData = await CameraService.capturePhoto();

// Capture screenshot (requires native implementation)
const screenshot = await CameraService.captureScreenshot();
```

## 🚧 Known Limitations

1. **System-wide overlay**: Requires native Android development for full functionality
2. **Screenshot capture**: Limited to gallery selection in web environment
3. **Voice commands**: Requires additional native implementation
4. **Background processing**: Limited by platform restrictions

## 🔮 Roadmap

- [ ] Enhanced voice command integration
- [ ] Backend storage for analysis history
- [ ] Advanced accessibility features
- [ ] Multi-language support
- [ ] Custom AI model integration
- [ ] Widget customization options

## 📄 License

This project is built with Lovable and uses the following technologies:
- React, TypeScript, Tailwind CSS
- Capacitor for mobile capabilities
- Google Cloud Vision AI

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues and questions:
- Check the [Capacitor documentation](https://capacitorjs.com/docs)
- Review [Google Vision AI docs](https://cloud.google.com/vision/docs)
- Visit [Lovable documentation](https://docs.lovable.dev)

---

**Note**: This app requires Google Cloud Vision API setup and Android development environment for full native functionality. The floating overlay feature works best on actual Android devices with proper permissions granted.