import React, { useRef, useState } from 'react';
import { Camera, Upload, X, Check, Loader2, AlertCircle } from 'lucide-react';

interface CameraCaptureProps {
  onImageCapture: (imageUrl: string, file: File) => void;
  isAnalyzing: boolean;
  error?: string | null;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onImageCapture, isAnalyzing, error }) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please try uploading a file instead.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'captured-food.jpg', { type: 'image/jpeg' });
            const imageUrl = URL.createObjectURL(blob);
            setCapturedImage(imageUrl);
            setCapturedFile(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
      setCapturedFile(file);
    }
  };

  const confirmImage = () => {
    if (capturedImage && capturedFile) {
      onImageCapture(capturedImage, capturedFile);
    }
  };

  const resetCapture = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    setCapturedImage(null);
    setCapturedFile(null);
    stopCamera();
  };

  if (capturedImage) {
    return (
      <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <img 
          src={capturedImage} 
          alt="Captured food"
          className="w-full h-64 object-cover"
        />
        
        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-800 text-sm font-medium">Analysis Failed</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}
          
          <p className="text-gray-600 text-sm mb-4">
            {error ? 'Please try again or upload a different image' : 'Ready to analyze this food?'}
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={confirmImage}
              disabled={isAnalyzing}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {error ? 'Try Again' : 'Analyze Food'}
                </>
              )}
            </button>
            <button
              onClick={resetCapture}
              disabled={isAnalyzing}
              className="px-4 py-3 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showCamera) {
    return (
      <div className="relative bg-black rounded-xl overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-64 object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
          <button
            onClick={capturePhoto}
            className="bg-white hover:bg-gray-100 p-4 rounded-full shadow-lg transition-colors duration-200"
          >
            <Camera className="w-6 h-6 text-gray-800" />
          </button>
          <button
            onClick={stopCamera}
            className="bg-red-500 hover:bg-red-600 p-4 rounded-full shadow-lg transition-colors duration-200"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-8 text-center border border-gray-200">
        <Camera className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Capture Your Food</h3>
        <p className="text-gray-600 mb-6">Take a photo or upload an image to get instant AI-powered nutritional analysis</p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={startCamera}
            className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4" />
            Take Photo
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Image
          </button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default CameraCapture;