import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

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
}

export function TransactionItem({ transaction, index }: TransactionItemProps) {
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
      <span
        className={`font-semibold ${
          isIncome ? "text-success" : "text-foreground"
        }`}
      >
        {isIncome ? "+" : "-"} {formatCurrency(transaction.amount)}
      </span>
    </div>
  );
}
