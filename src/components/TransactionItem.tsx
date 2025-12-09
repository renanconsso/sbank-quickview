import { ArrowDownLeft, ArrowUpRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Transaction {
  id: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  date: string;
}

interface TransactionItemProps {
  transaction: Transaction;
  index: number;
  onContest?: (transaction: Transaction) => void;
}

export function TransactionItem({ transaction, index, onContest }: TransactionItemProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
    }).format(date);
  };

  const isIncome = transaction.type === "income";

  return (
    <div
      className="flex items-center justify-between py-4 border-b border-border last:border-0 animate-slide-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-2.5 rounded-xl ${
            isIncome
              ? "bg-success/10 text-success"
              : "bg-gradient-primary"
          }`}
        >
          {isIncome ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} className="text-foreground" />}
        </div>
        <div>
          <p className="font-medium text-foreground">{transaction.description}</p>
          <p className="text-sm text-muted-foreground">
            {formatDate(transaction.date)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {!isIncome && onContest && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onContest(transaction)}
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            <MessageCircle size={16} className="mr-1" />
            Contestar
          </Button>
        )}
        <span
          className={`font-semibold ${
            isIncome ? "text-success" : "text-foreground"
          }`}
        >
          {isIncome ? "+" : "-"} {formatCurrency(transaction.amount)}
        </span>
      </div>
    </div>
  );
}
