import { User } from "lucide-react";
import sbankLogo from "@/assets/sbank-logo.png";

interface HeaderProps {
  userName: string;
}

export function Header({ userName }: HeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
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
        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
          <User size={20} className="text-foreground" />
        </div>
      </div>
    </header>
  );
}
