import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase, handleError } from './supabase-service';

export interface VendorOrderSummary {
    newOrders: number;
    activeOrders: number;
    totalEarnings: number;
    avgRating: number;
}

export const vendorOrderService = {
    getVendorOrders: async (vendorId: string) => {
        const { data, error } = await supabase
            .from('orders')
            .select(`
        *,
        order_items (
          menu_id,
          quantity,
          price,
          menu:menu_id (name)
        ),
        users!user_id (name, phone, delivery_location)
      `)
            .eq('vendor_id', vendorId)
            .order('created_at', { ascending: false });
        handleError(error);
        return data || [];
    },

    getVendorOrderSummary: async (vendorId: string): Promise<VendorOrderSummary> => {
        const { count: newCount, error: newError } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('vendor_id', vendorId)
            .eq('status', 'pending');
        handleError(newError);

        const { count: activeCount, error: activeError } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('vendor_id', vendorId)
            .in('status', ['cooking', 'out_for_delivery']);
        handleError(activeError);

        const { data: earningsData, error: earningsError } = await supabase
            .from('orders')
            .select('total_price')
            .eq('vendor_id', vendorId)
            .eq('status', 'delivered');
        handleError(earningsError);
        const totalEarnings = earningsData?.reduce((sum: number, order: any) => sum + (order.total_price || 0), 0) || 0;

        const avgRating = 4.8; 

        return {
            newOrders: newCount || 0,
            activeOrders: activeCount || 0,
            totalEarnings,
            avgRating,
        };
    },

    subscribeToVendorOrders: (vendorId: string, callback: (orders: any[]) => void) => {
        const channel: RealtimeChannel = supabase
            .channel(`realtime-vendor-orders-${vendorId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'orders',
                    filter: `vendor_id=eq.${vendorId}`
                },
                async () => {
                    const orders = await vendorOrderService.getVendorOrders(vendorId);
                    callback(orders);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    },
};

