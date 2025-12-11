import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type ValidationStatus = "idle" | "capturing" | "validating" | "success" | "error";

const FacialValidation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [status, setStatus] = useState<ValidationStatus>("idle");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // --------------------------
  // Iniciar câmera
  // --------------------------
  const startCamera = useCallback(async () => {
    try {
      setStatus("capturing");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
      }
    } catch (error) {
      console.error("Erro ao acessar câmera:", error);
      setStatus("error");
      toast({
        title: "Erro na câmera",
        description: "Verifique as permissões de acesso à câmera.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // --------------------------
  // Enviar foto para o backend
  // --------------------------
  const sendPhotoToBackend = async (file: File) => {
    const token = localStorage.getItem("token");

    const formdata = new FormData();
    formdata.append("file", file);

    const response = await fetch(
      "http://127.0.0.1:8000/api/v1/recognition/identification",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formdata,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro do backend:", errorText);
      throw new Error("Erro no servidor");
    }

    return await response.json();
  };

  // --------------------------
  // Converter Base64 → File
  // --------------------------
  const base64ToFile = (base64: string, filename: string): File => {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) u8arr[n] = bstr.charCodeAt(n);

    return new File([u8arr], filename, { type: mime });
  };

  // --------------------------
  // Tirar foto e enviar pro backend
  // --------------------------
  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (ctx) {
      // espelha a imagem
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0);

      const imgBase64 = canvas.toDataURL("image/jpeg", 1.0);
      setCapturedImage(imgBase64);

      stopCamera();
      setStatus("validating");

      const file = base64ToFile(imgBase64, "captura.jpg");

      try {
        const result = await sendPhotoToBackend(file);

        console.log("Resposta BACKEND:", result);

        // --------------------------
        // LÓGICA MULTIUSUÁRIO:
        // Reconhecimento aceito se:
        // - IA encontrou uma identidade (string != null)
        // - confiança >= 0.65
        // --------------------------
        const isValid =
          typeof result?.identidade === "string" &&
          result?.identidade.length > 0 &&
          result?.confianca >= 0.80;

        if (isValid) {
          setStatus("success");

          toast({
            title: "Identidade reconhecida",
            description: `Contestação concluída, ${result.identidade}!`,
          });

          setTimeout(() => navigate("/dashboard"), 2000);
        } else {
          setStatus("error");

          toast({
            title: "Falha na validação",
            description: "A foto não corresponde a nenhuma face cadastrada.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Erro ao enviar imagem:", error);
        setStatus("error");

        toast({
          title: "Erro no servidor",
          description: "Não foi possível validar sua imagem.",
          variant: "destructive",
        });
      }
    }
  }, [stopCamera, navigate, toast]);

  // --------------------------
  // Reset
  // --------------------------
  const resetValidation = useCallback(() => {
    setCapturedImage(null);
    setStatus("idle");
    startCamera();
  }, [startCamera]);

  const handleBack = useCallback(() => {
    stopCamera();
    navigate("/dashboard");
  }, [stopCamera, navigate]);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

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

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">

        <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-primary shadow-lg shadow-primary/20">
          {status === "capturing" && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
          )}

          {capturedImage && (
            <img src={capturedImage} className="w-full h-full object-cover" />
          )}
        </div>

        {status === "capturing" && (
          <Button onClick={capturePhoto} className="bg-gradient-primary h-12 w-32">
            Capturar
          </Button>
        )}

        {status === "validating" && (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Validando sua identidade...</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="w-12 h-12 text-green-500" />
            <p className="text-green-500">Sucesso!</p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="w-12 h-12 text-destructive" />
            <p className="text-destructive">
              Falha na validação. Nenhum rosto conhecido foi identificado.
            </p>

            <Button onClick={resetValidation} variant="outline" className="h-12">
              Tentar novamente
            </Button>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default FacialValidation;
