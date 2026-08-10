import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw, X, Check } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  onCancel: () => void;
}

export default function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      setError("Could not access camera. Please check permissions.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsStreaming(false);
    }
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageSrc = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedImage(imageSrc);
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  // Start camera on mount if no image is captured
  if (!isStreaming && !capturedImage && !error) {
    startCamera();
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-background rounded-xl border shadow-sm w-full max-w-md mx-auto">
      {error ? (
        <div className="text-destructive text-center p-4">
          <p>{error}</p>
          <Button variant="outline" className="mt-4" onClick={onCancel}>Close</Button>
        </div>
      ) : capturedImage ? (
        <>
          <img src={capturedImage} alt="Captured" className="w-full rounded-lg object-cover" />
          <div className="flex gap-4 w-full">
            <Button variant="outline" className="flex-1" onClick={retakePhoto}>
              <RefreshCw className="w-4 h-4 mr-2" /> Retake
            </Button>
            <Button className="flex-1" onClick={confirmPhoto}>
              <Check className="w-4 h-4 mr-2" /> Use Photo
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="relative w-full aspect-[4/3] bg-black rounded-lg overflow-hidden flex items-center justify-center">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex gap-4 w-full justify-between items-center">
            <Button variant="ghost" size="icon" onClick={() => { stopCamera(); onCancel(); }}>
              <X className="w-6 h-6" />
            </Button>
            <Button size="lg" className="rounded-full w-16 h-16 p-0" onClick={capturePhoto}>
              <Camera className="w-8 h-8" />
            </Button>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>
        </>
      )}
    </div>
  );
}
