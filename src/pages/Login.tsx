import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import sbankLogo from "@/assets/sbank-logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    if (formatted.length <= 14) {
      setCpf(formatted);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center space-y-4 animate-fade-in">
          <img src={sbankLogo} alt="Sbank" className="h-16 w-auto" />
          <p className="text-muted-foreground text-sm">Acesse sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="space-y-2">
            <Label htmlFor="cpf" className="text-foreground">CPF</Label>
            <Input
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={handleCPFChange}
              className="bg-card border-border focus:border-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-card border-border focus:border-primary pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity text-primary-foreground font-semibold h-12"
          >
            Entrar
          </Button>

          <button
            type="button"
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Esqueci minha senha
          </button>
        </form>

        <div className="text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <p className="text-muted-foreground text-sm">
            Ainda não tem conta?{" "}
            <button className="text-gradient font-semibold hover:opacity-80 transition-opacity">
              Abra a sua
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
