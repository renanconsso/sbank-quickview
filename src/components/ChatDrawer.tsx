import { useState } from "react";
import { X, Send, ScanFace } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FacialValidationModal } from "./FacialValidationModal";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transactionDescription: string;
}

export function ChatDrawer({ isOpen, onClose, transactionDescription }: ChatDrawerProps) {
  const { toast } = useToast();
  const [showFacialValidation, setShowFacialValidation] = useState(false);
  const [facialValidationRequested, setFacialValidationRequested] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Olá! Estou aqui para ajudar com a contestação da transação "${transactionDescription}". Como posso ajudar?`,
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    const newCount = messageCount + 1;
    setMessageCount(newCount);

    // Simulated response
    setTimeout(() => {
      let responseContent: string;
      
      if (newCount === 1) {
        responseContent = "Entendi. Para prosseguir com a contestação deste valor, precisamos validar sua identidade por questões de segurança. Por favor, realize a validação facial clicando no botão abaixo.";
        setFacialValidationRequested(true);
      } else {
        responseContent = "Obrigado pela informação. Por favor, realize a validação facial para continuarmos com o processo de contestação.";
      }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleValidationComplete = (success: boolean) => {
    if (success) {
      toast({
        title: "Validação concluída",
        description: "Sua identidade foi confirmada. A contestação pode prosseguir.",
      });
      const botResponse: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sua identidade foi validada com sucesso! Agora podemos prosseguir com a análise da sua contestação. Um analista entrará em contato em até 48 horas úteis.",
      };
      setMessages((prev) => [...prev, botResponse]);
    } else {
      toast({
        title: "Validação falhou",
        description: "Não foi possível confirmar sua identidade. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-card border-l border-border shadow-2xl z-50 flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-primary">
          <div>
            <h3 className="font-semibold text-foreground">Contestar Pagamento</h3>
            <p className="text-xs text-muted-foreground">Assistente virtual</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-foreground hover:bg-background/20"
          >
            <X size={20} />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === "user"
                      ? "bg-gradient-primary text-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border space-y-3">
          {facialValidationRequested && (
            <Button
              onClick={() => setShowFacialValidation(true)}
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary/10"
            >
              <ScanFace size={18} className="mr-2" />
              Validação Facial
            </Button>
          )}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="bg-muted border-border"
            />
            <Button
              onClick={handleSend}
              size="icon"
              className="bg-gradient-primary hover:opacity-90"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>

      <FacialValidationModal
        isOpen={showFacialValidation}
        onClose={() => setShowFacialValidation(false)}
        onValidationComplete={handleValidationComplete}
      />
    </>
  );
}
