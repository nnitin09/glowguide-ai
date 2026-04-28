import React, { useRef, useState, useCallback } from 'react';
import { Camera as CameraIcon, RefreshCw, Check, X, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CameraProps {
  onCapture: (image: string) => void;
  onCancel: () => void;
}

export const Camera: React.FC<CameraProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error("Error accessing camera:\n", err.message || err.name || err);
      const errorStr = (err.message || err.name || String(err)).toLowerCase();
      
      if (errorStr.includes('dismissed')) {
        setError("Camera permission was dismissed. Please click 'Try Again' and choose 'Allow' when prompted.");
      } else if (errorStr.includes('denied') || err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError("Camera access is blocked. If you are viewing this inside an embedded window, you MUST click 'Open in New Tab' below to grant camera permissions, or use the 'Upload Photo' button instead.");
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError("No camera found on this device.");
      } else {
        setError("Could not access camera. Please ensure permissions are granted and no other app is using the camera.");
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera]);

  React.useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.6);
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const retake = () => {
    setCapturedImage(null);
    startCamera();
  };

  return (
    <div className="fixed inset-0 z-50 bg-brand-ink flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-2xl aspect-[3/4] bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
        <AnimatePresence mode="wait">
          {!capturedImage ? (
            <motion.div
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full relative"
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />
              
              <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
                <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-white text-xs font-medium border border-white/10">
                  <Sun size={14} className="text-yellow-400" />
                  <span>Face the light for best results</span>
                </div>
              </div>

              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-white p-8 text-center space-y-6">
                  <div className="p-4 bg-red-500/20 rounded-full">
                    <X size={32} className="text-red-500" />
                  </div>
                  <p className="text-lg font-medium">{error}</p>
                  <div className="flex flex-col gap-4 w-full max-w-xs">
                    <button
                      onClick={startCamera}
                      className="px-8 py-3 bg-white text-brand-ink rounded-full font-semibold hover:scale-105 transition-transform"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => window.open(window.location.href, '_blank')}
                      className="px-8 py-3 bg-white/10 text-white border border-white/20 rounded-full font-semibold hover:bg-white/20 transition-colors"
                    >
                      Open in New Tab
                    </button>
                  </div>
                </div>
              )}
              <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8">
                <button
                  onClick={onCancel}
                  className="p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <X size={24} />
                </button>
                <button
                  onClick={capture}
                  disabled={!!error}
                  className="p-6 rounded-full bg-white text-brand-ink hover:scale-110 transition-transform shadow-lg disabled:opacity-50"
                >
                  <CameraIcon size={32} />
                </button>
                <div className="w-14" /> {/* Spacer */}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full relative"
            >
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8">
                <button
                  onClick={retake}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-md"
                >
                  <RefreshCw size={20} />
                  <span>Retake</span>
                </button>
                <button
                  onClick={() => onCapture(capturedImage)}
                  className="flex items-center gap-2 px-8 py-3 rounded-full bg-white text-brand-ink font-semibold hover:scale-105 transition-transform shadow-lg"
                >
                  <Check size={20} />
                  <span>Confirm</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
