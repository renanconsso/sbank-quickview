import { Header } from "@/components/Header";
import { BalanceCard } from "@/components/BalanceCard";
import { TransactionList } from "@/components/TransactionList";
import { Transaction } from "@/components/TransactionItem";

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "expense",
    description: "Pix para João Silva",
    amount: 250.0,
    date: "2024-12-02",
  },
  {
    id: "2",
    type: "income",
    description: "Transferência recebida",
    amount: 1500.0,
    date: "2024-12-01",
  },
  {
    id: "3",
    type: "expense",
    description: "Pix para Maria Santos",
    amount: 89.9,
    date: "2024-11-30",
  },
  {
    id: "4",
    type: "expense",
    description: "Pagamento de boleto",
    amount: 450.0,
    date: "2024-11-29",
  },
  {
    id: "5",
    type: "income",
    description: "Depósito TED",
    amount: 3200.0,
    date: "2024-11-28",
  },
];

const Index = () => {
  const userName = "Carlos Eduardo";
  const balance = 8750.42;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 pb-8">
        <Header userName={userName} />
        
        <main className="space-y-6">
          <BalanceCard balance={balance} />
          <TransactionList transactions={mockTransactions} />
        </main>
      </div>
    </div>
  );
};

export default Index;
