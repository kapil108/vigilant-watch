import { useState } from 'react';
import { Transaction, Channel, FraudStatus } from '@/types/fraud';
import { cn } from '@/lib/utils';
import {
  ChevronUp,
  ChevronDown,
  Filter,
  Search,
  CreditCard,
  Smartphone,
  Building,
  Globe,
  ArrowUpRight,
  Eye
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TransactionsTableProps {
  transactions: Transaction[];
  onViewTransaction?: (transaction: Transaction) => void;
}

const channelIcons: Record<Channel, React.ElementType> = {
  card: CreditCard,
  upi: Smartphone,
  atm: Building,
  netbanking: Globe,
  wire: ArrowUpRight
};

const statusColors: Record<FraudStatus, string> = {
  flagged: 'risk-badge-high',
  confirmed: 'bg-destructive/30 text-destructive border border-destructive/50',
  cleared: 'risk-badge-low',
  pending: 'risk-badge-medium'
};

type SortField = 'timestamp' | 'amount' | 'riskScore';
type SortDirection = 'asc' | 'desc';

export const TransactionsTable = ({ transactions, onViewTransaction }: TransactionsTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredTransactions = transactions
    .filter(tx => {
      const matchesSearch = tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.accountId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesChannel = channelFilter === 'all' || tx.channel === channelFilter;
      const matchesRisk = riskFilter === 'all' ||
        (riskFilter === 'high' && tx.riskScore > 80) ||
        (riskFilter === 'medium' && tx.riskScore > 50 && tx.riskScore <= 80) ||
        (riskFilter === 'low' && tx.riskScore <= 50);
      return matchesSearch && matchesChannel && matchesRisk;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'timestamp') {
        comparison = a.timestamp.getTime() - b.timestamp.getTime();
      } else if (sortField === 'amount') {
        comparison = a.amount - b.amount;
      } else if (sortField === 'riskScore') {
        comparison = a.riskScore - b.riskScore;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ?
      <ChevronUp className="w-3 h-3" /> :
      <ChevronDown className="w-3 h-3" />;
  };

  return (
    <div className="glass-card overflow-hidden animate-fade-up">
      {/* Filters */}
      <div className="p-4 border-b border-border/50 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-10 bg-muted/50 border-border/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <Select value={channelFilter} onValueChange={setChannelFilter}>
            <SelectTrigger className="w-[140px] bg-muted/50 border-border/50">
              <SelectValue placeholder="Channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="atm">ATM</SelectItem>
              <SelectItem value="netbanking">Net Banking</SelectItem>
              <SelectItem value="wire">Wire</SelectItem>
            </SelectContent>
          </Select>

          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-[140px] bg-muted/50 border-border/50">
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
              <SelectItem value="medium">Medium Risk</SelectItem>
              <SelectItem value="low">Low Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                Transaction
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                Account
              </th>
              <th
                className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center gap-1">
                  Amount <SortIcon field="amount" />
                </div>
              </th>
              <th
                className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('timestamp')}
              >
                <div className="flex items-center gap-1">
                  Time <SortIcon field="timestamp" />
                </div>
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                Location
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                Channel
              </th>
              <th
                className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('riskScore')}
              >
                <div className="flex items-center gap-1">
                  Risk <SortIcon field="riskScore" />
                </div>
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                Status
              </th>
              <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {paginatedTransactions.map((tx) => {
              const Icon = channelIcons[tx.channel] || channelIcons.card;
              const isHighRisk = tx.riskScore > 80;

              return (
                <tr
                  key={tx.id}
                  className={cn(
                    'data-table-row',
                    isHighRisk && 'data-table-row-high-risk'
                  )}
                >
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium">{tx.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">{tx.accountId}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold">${tx.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      {tx.timestamp.toLocaleTimeString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">{tx.location}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm capitalize">{tx.channel}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            tx.riskScore > 80 ? 'bg-destructive' :
                              tx.riskScore > 50 ? 'bg-warning' : 'bg-success'
                          )}
                          style={{ width: `${tx.riskScore}%` }}
                        />
                      </div>
                      <span className={cn(
                        'text-xs font-semibold',
                        tx.riskScore > 80 ? 'text-destructive' :
                          tx.riskScore > 50 ? 'text-warning' : 'text-success'
                      )}>
                        {tx.riskScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium capitalize',
                      statusColors[tx.fraudStatus]
                    )}>
                      {tx.fraudStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => onViewTransaction?.(tx)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-border/50 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="bg-muted/50"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="bg-muted/50"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
