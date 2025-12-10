import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type ValidationStatus = "idle" | "capturing" | "validating" | "success" | "error";

const FacialValidation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
          
          if (isValid) {
            toast({
              title: "Validação concluída",
              description: "Sua identidade foi confirmada com sucesso!",
            });
            setTimeout(() => {
              navigate("/dashboard");
            }, 2000);
          }
        }, 2000);
      }
    }
  }, [stopCamera, toast, navigate]);

  const resetValidation = useCallback(() => {
    setCapturedImage(null);
    setStatus("idle");
  }, []);

  const handleBack = useCallback(() => {
    stopCamera();
    navigate("/dashboard");
  }, [stopCamera, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-gradient-primary p-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="text-foreground hover:bg-background/20"
        >
          <ArrowLeft size={24} />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Validação Facial</h1>
          <p className="text-sm text-muted-foreground">Confirme sua identidade</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
        {status === "idle" && (
          <>
            <div className="w-64 h-64 rounded-full border-4 border-dashed border-primary/50 flex items-center justify-center bg-muted">
              <Camera className="w-24 h-24 text-muted-foreground" />
            </div>
            <div className="text-center max-w-sm">
              <h2 className="text-lg font-medium text-foreground mb-2">
                Validação de Identidade
              </h2>
              <p className="text-sm text-muted-foreground">
                Para continuar com a contestação, precisamos validar sua identidade através de reconhecimento facial. Clique no botão abaixo para iniciar.
              </p>
            </div>
            <Button onClick={startCamera} size="lg" className="bg-gradient-primary hover:opacity-90">
              <Camera className="mr-2" size={20} />
              Iniciar Câmera
            </Button>
          </>
        )}

        {status === "capturing" && (
          <>
            <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-primary shadow-lg shadow-primary/20">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center max-w-sm">
              <p className="text-sm text-muted-foreground">
                Posicione seu rosto no centro do círculo e mantenha-se em um ambiente bem iluminado.
              </p>
            </div>
            <Button onClick={capturePhoto} size="lg" className="bg-gradient-primary hover:opacity-90">
              Capturar Foto
            </Button>
          </>
        )}

        {status === "validating" && (
          <>
            <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-primary">
              {capturedImage && (
                <img src={capturedImage} alt="Captura" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Validando sua identidade...</p>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-green-500 relative">
              {capturedImage && (
                <img src={capturedImage} alt="Captura" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-24 h-24 text-green-500" />
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-lg font-medium text-green-500 mb-2">
                Identidade Validada!
              </h2>
              <p className="text-sm text-muted-foreground">
                Redirecionando para o chat...
              </p>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-destructive relative">
              {capturedImage ? (
                <img src={capturedImage} alt="Captura" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <XCircle className="w-24 h-24 text-destructive" />
                </div>
              )}
              <div className="absolute inset-0 bg-destructive/20 flex items-center justify-center">
                <XCircle className="w-24 h-24 text-destructive" />
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-lg font-medium text-destructive mb-2">
                {capturedImage ? "Validação Falhou" : "Erro na Câmera"}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                {capturedImage
                  ? "Não foi possível validar sua identidade. Tente novamente."
                  : "Não foi possível acessar a câmera. Verifique as permissões."}
              </p>
            </div>
            <Button onClick={resetValidation} size="lg" variant="outline">
              Tentar Novamente
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default FacialValidation;
