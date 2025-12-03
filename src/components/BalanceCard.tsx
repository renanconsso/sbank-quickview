import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface BalanceCardProps {
  balance: number;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="card-gradient rounded-2xl p-6 border border-border glow animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <span className="text-muted-foreground text-sm font-medium">
          Saldo disponível
        </span>
        <button
          onClick={() => setShowBalance(!showBalance)}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
          aria-label={showBalance ? "Ocultar saldo" : "Mostrar saldo"}
        >
          {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-foreground tracking-tight">
          {showBalance ? formatCurrency(balance) : "R$ ••••••"}
        </span>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
        <span className="text-success text-sm font-medium">Conta ativa</span>
      </div>
    </div>
  );
}
