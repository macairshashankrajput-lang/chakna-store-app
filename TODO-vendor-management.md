# Vendor Management Implementation TODO

Status: **In Progress** (Step 1/8)

## Steps from Approved Plan

1. ✅ **Update drizzle/schema.ts**: Add `status` enum('active','inactive','pending') to users table (default 'pending'). **DONE**
2. ✅ **Fix lib/supabase-service.ts**: 
   - Update userService.getActiveVendorCount() to filter role='vendor' AND status='active'.
   - Replace vendorService: Query users role='vendor'.
   - Add vendorOrderService: getVendorOrders(vendorId), subscribeVendorOrders, etc. **DONE**
3. ✅ **Update lib/admin-context.tsx**: Use active vendor count. **DONE** (already calls updated service)
4. **Enhance app/(admin)/manage/vendors.tsx**: Add create/edit/delete modals/forms.
7. **Database Migration**: Generated new migration `drizzle/0002_fine_the_professor.sql` - needs apply.
5. **Implement app/(vendor)/index.tsx**: Dynamic KPIs from own orders, realtime sub.
6. **Implement app/(vendor)/orders.tsx**: List own orders, status updates, realtime.
7. **Database Migration**: Generate & apply new Drizzle migration for users.status.
8. **Testing & Polish**: Seed test vendor, verify RLS, error handling.

## Next Action
Complete Step 1: Update schema.ts.

**Completed Steps: 0/8**

