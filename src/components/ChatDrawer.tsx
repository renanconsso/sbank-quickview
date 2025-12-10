import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Send, ScanFace } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const navigate = useNavigate();
  const [facialValidationRequested, setFacialValidationRequested] = useState(false);
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

    // Simulated backend response
    setTimeout(() => {
      // Backend returns message requiring photo validation
      const responseContent = "Para prosseguir com a contestação deste valor, é necessário validação por foto. Por favor, clique no botão abaixo para realizar a validação facial.";
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
      };
      setMessages((prev) => [...prev, botResponse]);

      // Check if message contains the trigger phrase
      if (responseContent.toLowerCase().includes("necessário validação por foto")) {
        setFacialValidationRequested(true);
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFacialValidation = () => {
    navigate("/facial-validation");
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
              onClick={handleFacialValidation}
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
    </>
  );
}
