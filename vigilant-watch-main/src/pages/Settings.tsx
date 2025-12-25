import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Bell, Lock, User } from 'lucide-react';

const Settings = () => {
    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-up">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your account settings and preferences
                    </p>
                </div>

                <div className="grid gap-6 max-w-4xl">
                    {/* Profile Section */}
                    <div className="glass-card p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold">Profile Information</h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" defaultValue="Risk Analyst Demo" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" defaultValue="analyst@fraudshield.example" />
                            </div>
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div className="glass-card p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Bell className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold">Notifications</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Email Alerts</Label>
                                    <p className="text-xs text-muted-foreground">Receive daily summaries via email</p>
                                </div>
                                <Button variant="outline" size="sm">Enabled</Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Real-time Notifications</Label>
                                    <p className="text-xs text-muted-foreground">Get instant alerts for high-risk transactions</p>
                                </div>
                                <Button variant="default" size="sm">Enabled</Button>
                            </div>
                        </div>
                    </div>

                    {/* Security Section */}
                    <div className="glass-card p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold">Security Settings</h2>
                        </div>
                        <div className="space-y-2">
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <Lock className="w-4 h-4" />
                                Change Password
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <Shield className="w-4 h-4" />
                                Two-Factor Authentication
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
