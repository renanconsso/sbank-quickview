import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import sbankLogo from "@/assets/sbank-logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setErrorMsg("");

  if (!username || !password) {
    setErrorMsg("Preencha usuário e senha.");
    setLoading(false);
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/v1/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password
      }),
    });

    if (!response.ok) {
      throw new Error("Usuário ou senha incorretos");
    }

    const data = await response.json();

    // Armazenar token e nome no localStorage
    localStorage.setItem("access_token", data.token.access_token);
    localStorage.setItem("user_name", data.user.name);

    // Redireciona para dashboard
    navigate("/dashboard");

  } catch (err: any) {
    setErrorMsg(err.message || "Erro ao fazer login");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center space-y-4 animate-fade-in">
          <img src={sbankLogo} alt="Sbank" className="h-16 w-auto" />
          <p className="text-muted-foreground text-sm">Acesse sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
          
          <div className="space-y-2">
            <Label htmlFor="username">Usuário</Label>
            <Input
              id="username"
              type="text"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="text-red-500 text-sm text-center">{errorMsg}</p>
          )}

          <Button 
            type="submit"
            className="w-full h-12"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
