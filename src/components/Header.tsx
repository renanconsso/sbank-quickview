import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface HeaderProps {
  userName: string;
}

export function Header({ userName }: HeaderProps) {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <header className="flex justify-between items-center py-6">
      <div>
        <h2 className="text-xl font-bold">Bem-vindo</h2>
        <p className="text-muted-foreground text-sm">{userName}</p>
      </div>

      <Button variant="ghost" size="icon" onClick={handleLogout}>
        <LogOut />
      </Button>
    </header>
  );
}
