import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CreditCard,
  AlertTriangle,
  BarChart3,
  Settings,
  Shield,
  Bell,
  Search,
  Menu,
  X,
  ChevronLeft
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: CreditCard },
  { path: '/alerts', label: 'Alert Center', icon: AlertTriangle },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  // { path: '/settings', label: 'Settings', icon: Settings },
];

const NotificationsMenu = () => {
  const queryClient = useQueryClient();
  const { data: alerts } = useQuery({
    queryKey: ['alerts'],
    queryFn: api.getAlerts,
    refetchInterval: 10000
  });

  const handleOpenChange = async (open: boolean) => {
    if (open) {
      try {
        await api.markAlertsRead();
        // Optimistically update or invalidate
        queryClient.invalidateQueries({ queryKey: ['alerts'] });
      } catch (e) {
        console.error("Failed to mark read", e);
      }
    }
  };

  // Count alerts that are New
  const unreadCount = alerts?.filter(a => a.status === 'new').length || 0;
  const recentAlerts = alerts?.slice(0, 5) || [];

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white animate-in zoom-in">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h4 className="font-semibold">Notifications</h4>
          <span className="text-xs text-muted-foreground">{unreadCount} unread</span>
        </div>
        <ScrollArea className="h-[300px]">
          {recentAlerts.length > 0 ? (
            <div className="divide-y">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className={cn(
                    "mt-1 h-2 w-2 rounded-full",
                    alert.riskLevel === 'high' ? "bg-destructive" : "bg-primary"
                  )} />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {alert.riskLevel === 'high' ? 'High Risk Detected' : 'Suspicious Activity'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {alert.transactionId} • ${alert.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {alert.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No recent notifications
            </div>
          )}
        </ScrollArea>
        <div className="border-t p-2">
          <NavLink to="/alerts">
            <Button variant="ghost" size="sm" className="w-full text-xs">
              View all alerts
            </Button>
          </NavLink>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const DashboardLayout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-20'
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            {sidebarOpen && (
              <div className="animate-fade-up">
                <h1 className="text-lg font-bold">FraudShield</h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Detection System</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <ChevronLeft className={cn(
              'w-4 h-4 transition-transform duration-300',
              !sidebarOpen && 'rotate-180'
            )} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'nav-link',
                  isActive && 'nav-link-active'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="animate-fade-up">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <NavLink
            to="/settings"
            className={cn(
              'nav-link',
              location.pathname === '/settings' && 'nav-link-active'
            )}
          >
            <Settings className="w-5 h-5" />
            {sidebarOpen && <span>Settings</span>}
          </NavLink>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 lg:hidden',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-lg font-bold">FraudShield</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'nav-link',
                  isActive && 'nav-link-active'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-card/50 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions, alerts..."
                className="w-80 pl-10 bg-muted/50 border-border/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="live-indicator hidden sm:flex">
              <span>Live Data</span>
            </div>

            <NotificationsMenu />

            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">RA</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 lg:p-6 overflow-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};
