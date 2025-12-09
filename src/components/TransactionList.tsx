import { Transaction, TransactionItem } from "./TransactionItem";

interface TransactionListProps {
  transactions: Transaction[];
  onContestTransaction?: (transaction: Transaction) => void;
}

export function TransactionList({ transactions, onContestTransaction }: TransactionListProps) {
  return (
    <div className="border-gradient rounded-2xl p-6 animate-fade-in card-gradient" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Extrato</h2>
        <span className="text-sm text-muted-foreground">Últimas transferências</span>
      </div>
      <div className="divide-y divide-border">
        {transactions.map((transaction, index) => (
          <TransactionItem 
            key={transaction.id} 
            transaction={transaction} 
            index={index}
            onContest={onContestTransaction}
          />
        ))}
      </div>
    </div>
  );
}
