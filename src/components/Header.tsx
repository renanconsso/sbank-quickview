import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import sbankLogo from "@/assets/sbank-logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const navigate = useNavigate();

  const userName = localStorage.getItem("user.name") || "Usuário";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user.username");
  localStorage.removeItem("user.name");
  navigate("/");
};

  return (
    <header className="flex items-center justify-between py-6 animate-fade-in">
      <div>
        <img src={sbankLogo} alt="Sbank" className="h-8" />
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm text-muted-foreground">{getGreeting()},</p>
          <p className="font-semibold text-foreground">{userName}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
              <User size={20} className="text-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            <DropdownMenuItem 
              onClick={handleLogout}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut size={16} className="mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
