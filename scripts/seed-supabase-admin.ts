import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables. Please set EXPO_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
});

const ADMIN_EMAIL = 'info.shashankrajput@gmail.com';
const ADMIN_PASSWORD = 'asdfghjkl';
const ADMIN_PHONE = '6307500844';
const ADMIN_NAME = 'Shashank Rajput';

function normalizePhone(phone: string): string {
    return phone.replace(/\D/g, '');
}

function formatPhoneForDb(phone: string): string {
    const digits = normalizePhone(phone);
    if (!digits) {
        return '';
    }
    if (digits.length === 10) {
        return `+91${digits}`;
    }
    if (digits.length === 12 && digits.startsWith('91')) {
        return `+${digits}`;
    }
    if (digits.startsWith('91')) {
        return `+${digits}`;
    }
    return digits;
}

async function findAdminUser(email: string) {
    const listResponse = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 });
    if (listResponse.error) {
        throw listResponse.error;
    }

    const users = (listResponse.data as any)?.users ?? [];
    return users.find((user: any) => user.email === email || user.user_metadata?.email === email);
}

async function main() {
    const dbPhone = formatPhoneForDb(ADMIN_PHONE);
    let adminUser = await findAdminUser(ADMIN_EMAIL);

    if (adminUser) {
        console.log(`Found existing admin auth user: ${adminUser.id}`);
        const updateResponse = await supabase.auth.admin.updateUserById(adminUser.id, {
            password: ADMIN_PASSWORD,
            user_metadata: {
                name: ADMIN_NAME,
                username: 'adminchaknaco',
                phone: dbPhone,
                role: 'admin',
                email: ADMIN_EMAIL,
            },
        });
        if (updateResponse.error) {
            throw updateResponse.error;
        }
        adminUser = updateResponse.data?.user ?? adminUser;
        console.log('Updated admin auth credentials.');
    } else {
        const createResponse = await supabase.auth.admin.createUser({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            email_confirm: true,
            user_metadata: {
                name: ADMIN_NAME,
                username: 'adminchaknaco',
                phone: dbPhone,
                role: 'admin',
            },
        });

        if (createResponse.error) {
            throw createResponse.error;
        }

        adminUser = createResponse.data?.user;
        if (!adminUser) {
            throw new Error('Unable to create admin auth user.');
        }

        console.log(`Created admin auth user: ${adminUser.id}`);
    }

    const profile = {
        id: adminUser.id,
        openId: adminUser.id,
        username: 'adminchaknaco',
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        phone: dbPhone,
        role: 'admin',
        loginMethod: 'email',
        referral_code: null,
        points_balance: 0,
        createdAt: new Date().toISOString(),
    };

    const { error: profileError } = await supabase.from('users').upsert(profile, { onConflict: 'id' });
    if (profileError) {
        throw profileError;
    }

    console.log(`Admin profile seeded in "users" table for ${ADMIN_EMAIL}.`);
    console.log('Admin user creation complete. You can now login with the admin credentials.');
}

main().catch((error) => {
    console.error('Failed to seed admin:', error);
    process.exit(1);
});
