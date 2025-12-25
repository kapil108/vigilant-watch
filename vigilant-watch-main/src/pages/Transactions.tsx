import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TransactionsTable } from '@/components/transactions/TransactionsTable';
import { TransactionDetail } from '@/components/transactions/TransactionDetail';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { Transaction } from '@/types/fraud';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Transactions = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: api.getTransactions,
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const mockTx = {
        id: `demo_${Date.now()}`,
        account_id: `acc_${Math.floor(Math.random() * 1000)}`,
        amount: Math.floor(Math.random() * 15000), // Random amount up to 15k
        currency: 'USD',
        merchant_category: ['food', 'luxury', 'electronics', 'travel'][Math.floor(Math.random() * 4)],
        channel: 'digital',
        location_lat: 40.7128,
        location_lon: -74.0060
      };
      return api.ingestTransaction(mockTx);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      if (data.fraudStatus === 'flagged') {
        // But api.ts mapTransaction output doesn't have is_flagged unless explicitly added. 
        // api.ingestTransaction returns mapTransaction(result).
        // mapTransaction output: { fraudStatus: 'flagged' ... }
        // The original code used data.is_flagged. 
        // Let's keep original code but be aware of type error seen earlier. 
        // Note: The previous lint error said Property 'is_flagged' does not exist on type 'Transaction'.
        // I should fix this too?
        // Let's stick to the crash fix first.
        toast.error(`Fraud Alert! Transaction ${data.id} flagged.`);
      } else {
        toast.success(`Transaction ${data.id} processed successfully.`);
      }
    },
    onError: () => {
      toast.error("Failed to process transaction");
    }
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Transactions</h1>
            <p className="text-sm text-muted-foreground">
              View and analyze all transactions with fraud detection insights
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TransactionForm />
            <Button
              variant="outline"
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
            >
              {generateMutation.isPending ? 'Processing...' : 'Simulate Random'}
            </Button>
            <span className="text-sm text-muted-foreground ml-2">
              {transactions.length} total transactions
            </span>
          </div>
        </div>

        {/* Transactions Table */}
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <TransactionsTable
            transactions={transactions}
            onViewTransaction={setSelectedTransaction}
          />
        )}
      </div>

      {/* Transaction Detail Modal */}
      {
        selectedTransaction && (
          <TransactionDetail
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
          />
        )
      }
    </DashboardLayout >
  );
};

export default Transactions;
