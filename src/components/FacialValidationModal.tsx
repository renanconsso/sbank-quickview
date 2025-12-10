import { useState, useRef, useCallback } from "react";
import { X, Camera, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FacialValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onValidationComplete: (success: boolean) => void;
}

type ValidationStatus = "idle" | "capturing" | "validating" | "success" | "error";

export function FacialValidationModal({
  isOpen,
  onClose,
  onValidationComplete,
}: FacialValidationModalProps) {
  const [status, setStatus] = useState<ValidationStatus>("idle");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStatus("capturing");
    } catch (error) {
      console.error("Erro ao acessar câmera:", error);
      setStatus("error");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageData);
        stopCamera();
        setStatus("validating");

        // Simula validação facial
        setTimeout(() => {
          const isValid = Math.random() > 0.3; // 70% de chance de sucesso
          setStatus(isValid ? "success" : "error");
          setTimeout(() => {
            onValidationComplete(isValid);
            handleClose();
          }, 2000);
        }, 2000);
      }
    }
  }, [stopCamera, onValidationComplete]);

  const handleClose = useCallback(() => {
    stopCamera();
    setStatus("idle");
    setCapturedImage(null);
    onClose();
  }, [stopCamera, onClose]);

  const resetValidation = useCallback(() => {
    setCapturedImage(null);
    setStatus("idle");
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Validação Facial
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {status === "idle" && (
            <>
              <div className="w-48 h-48 rounded-full border-4 border-dashed border-primary/50 flex items-center justify-center bg-muted">
                <Camera className="w-16 h-16 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Para continuar com a contestação, precisamos validar sua identidade através de reconhecimento facial.
              </p>
              <Button onClick={startCamera} className="bg-gradient-primary hover:opacity-90">
                Iniciar Câmera
              </Button>
            </>
          )}

          {status === "capturing" && (
            <>
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Posicione seu rosto no centro do círculo
              </p>
              <Button onClick={capturePhoto} className="bg-gradient-primary hover:opacity-90">
                Capturar Foto
              </Button>
            </>
          )}

          {status === "validating" && (
            <>
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary">
                {capturedImage && (
                  <img src={capturedImage} alt="Captura" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex items-center gap-2 text-primary">
                <Loader2 className="w-5 h-5 animate-spin" />
                <p className="text-sm">Validando identidade...</p>
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-green-500 relative">
                {capturedImage && (
                  <img src={capturedImage} alt="Captura" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
              </div>
              <p className="text-sm text-green-500 font-medium">
                Identidade validada com sucesso!
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-destructive relative">
                {capturedImage ? (
                  <img src={capturedImage} alt="Captura" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <XCircle className="w-16 h-16 text-destructive" />
                  </div>
                )}
                <div className="absolute inset-0 bg-destructive/20 flex items-center justify-center">
                  <XCircle className="w-16 h-16 text-destructive" />
                </div>
              </div>
              <p className="text-sm text-destructive font-medium">
                {capturedImage ? "Não foi possível validar sua identidade" : "Erro ao acessar a câmera"}
              </p>
              <Button onClick={resetValidation} variant="outline">
                Tentar Novamente
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
