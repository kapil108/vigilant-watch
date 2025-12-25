import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { PlusCircle } from 'lucide-react';

interface TransactionFormProps {
    trigger?: React.ReactNode;
}

export function TransactionForm({ trigger }: TransactionFormProps) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const form = useForm({
        defaultValues: {
            account_id: 'user_123',
            amount: '',
            currency: 'USD',
            merchant_category: 'retail',
            channel: 'online',
        },
    });

    const mutation = useMutation({
        mutationFn: async (values: any) => {
            // Add random coordinates and ID
            const tx = {
                ...values,
                id: `manual_${Date.now()}`,
                amount: Number(values.amount),
                location_lat: 40.7128,
                location_lon: -74.0060,
            };
            return api.ingestTransaction(tx);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['alerts'] });
            queryClient.invalidateQueries({ queryKey: ['anomaly-stats'] });
            queryClient.invalidateQueries({ queryKey: ['geo-stats'] });
            queryClient.invalidateQueries({ queryKey: ['category-stats'] });
            queryClient.invalidateQueries({ queryKey: ['rule-stats'] });
            queryClient.invalidateQueries({ queryKey: ['time-stats'] });
            queryClient.invalidateQueries({ queryKey: ['anomaly-type-stats'] });
            setOpen(false);
            form.reset();

            if (data.fraudStatus === 'flagged') {
                toast.error(`Blocked! Transaction Flagged as Fraud.`, {
                    description: `Transaction ID: ${data.id}`
                });
            } else {
                toast.success(`Success! Transaction Approved.`, {
                    description: `Transaction ID: ${data.id}`
                });
            }
        },
        onError: () => {
            toast.error("Failed to process transaction");
        }
    });

    const onSubmit = (values: any) => {
        mutation.mutate(values);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="gap-2">
                        <PlusCircle className="w-4 h-4" />
                        New Transaction
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Transaction</DialogTitle>
                    <DialogDescription>
                        Manually enter transaction details to test fraud detection rules.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="account_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account ID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="user_123" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="0.00" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="currency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Currency</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select currency" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="USD">USD ($)</SelectItem>
                                                <SelectItem value="EUR">EUR (€)</SelectItem>
                                                <SelectItem value="GBP">GBP (£)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="merchant_category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="retail">Retail</SelectItem>
                                                <SelectItem value="food">Food & Dining</SelectItem>
                                                <SelectItem value="travel">Travel</SelectItem>
                                                <SelectItem value="electronics">Electronics</SelectItem>
                                                <SelectItem value="jewelry">Jewelry</SelectItem>
                                                <SelectItem value="digital">Digital Services</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="channel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Channel</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Channel" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="online">Online</SelectItem>
                                                <SelectItem value="pos">In-Store (POS)</SelectItem>
                                                <SelectItem value="atm">ATM</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="submit" disabled={mutation.isPending} className="w-full">
                                {mutation.isPending ? 'Processing...' : 'Submit Transaction'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
