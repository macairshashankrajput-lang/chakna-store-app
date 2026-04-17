/**
 * Supabase Authentication Helpers
 * Centralized Supabase Auth operations for the app
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as customAuth from '@/lib/_core/auth';
import { startOAuthLogin } from '@/constants/oauth';
import { supabase } from './supabase-service';
import { DEFAULT_ADMIN_CREDENTIALS } from './default-credentials';
import type { UserRole, User } from './auth-context';

function normalizePhone(phone: string): string {
    return phone.replace(/\D/g, '');
}

function deriveUsernameFromSupabaseUser(
    supabaseUser: { email?: string | null; user_metadata?: Record<string, any> }
): string {
    const metadataUsername = supabaseUser.user_metadata?.username;
    if (metadataUsername && typeof metadataUsername === 'string' && metadataUsername.trim().length > 0) {
        return metadataUsername.trim().toLowerCase();
    }
    if (supabaseUser.email) {
        return supabaseUser.email.split('@')[0].toLowerCase();
    }
    return `user_${supabaseUser.email ? supabaseUser.email.split('@')[0] : 'unknown'}`;
}

function getAuthEmailForUsername(username: string) {
    return `${username.trim().toLowerCase()}@chakna.app`;
}

function resolveLoginEmailFromProfile(
    profile: { email?: string | null; username?: string | null; profileEmail?: string | null },
    fallbackUsername?: string
): string | null {
    const profileEmail = profile.email?.toLowerCase();
    if (profileEmail && profileEmail.endsWith('@chakna.app')) {
        return profileEmail;
    }

    const profileUsername = profile.username?.trim().toLowerCase();
    if (profileUsername) {
        return getAuthEmailForUsername(profileUsername);
    }

    if (fallbackUsername) {
        return getAuthEmailForUsername(fallbackUsername);
    }

    return null;
}

function supabaseUserToAppUser(
    supabaseUser: { id: string; email?: string | null; user_metadata?: Record<string, any> },
    role: UserRole,
    phone?: string,
    referralCode?: string
): User {
    const normalizedPhone = phone ? normalizePhone(phone) : normalizePhone(supabaseUser.user_metadata?.phone ?? '');
    const metadataRole = supabaseUser.user_metadata?.role;
    const finalRole = ['customer', 'vendor', 'admin'].includes(metadataRole) ? (metadataRole as UserRole) : role;
    const username = deriveUsernameFromSupabaseUser(supabaseUser);
    return {
        id: supabaseUser.id,
        username,
        email: (supabaseUser.user_metadata?.profileEmail?.toLowerCase() || supabaseUser.email) ?? getAuthEmailForUsername(username),
        name: supabaseUser.user_metadata?.name || 'Customer',
        phone: normalizedPhone,
        role: finalRole,
        referralCode,
        businessName: supabaseUser.user_metadata?.businessName || supabaseUser.user_metadata?.business_name,
        createdAt: new Date().toISOString(),
    };
}

function getAdminIdentifierEmail(identifier: string): string | null {
    const trimmedLower = identifier.trim().toLowerCase();
    const adminEmail = DEFAULT_ADMIN_CREDENTIALS.email.toLowerCase();
    const adminUsername = DEFAULT_ADMIN_CREDENTIALS.username.toLowerCase();
    const adminPhone = normalizePhone(DEFAULT_ADMIN_CREDENTIALS.phone);
    const normalizedIdentifierPhone = normalizePhone(identifier);
    const normalizedVariants = new Set<string>([adminPhone]);
    normalizedVariants.add(`91${adminPhone}`);
    normalizedVariants.add(`+91${adminPhone}`);
    if (adminPhone.startsWith('91')) {
        normalizedVariants.add(adminPhone.replace(/^91/, ''));
    }

    if (trimmedLower === adminUsername || trimmedLower === adminEmail) {
        return adminEmail;
    }
    if (normalizedIdentifierPhone && normalizedVariants.has(normalizedIdentifierPhone)) {
        return adminEmail;
    }
    return null;
}

function getProfileTables(): string[] {
    return ['users'];
}

function isUserProfileSchemaError(error: any): boolean {
    if (!error || typeof error.message !== 'string') {
        return false;
    }
    const message = error.message as string;
    return /column .* does not exist|could not find the '.*' column of '.*' in the schema cache|42703|invalid column|undefined .*username|undefined .*openId/i.test(message);
}

async function queryProfileEmailByUsername(username: string): Promise<string | null> {
    const adminEmail = getAdminIdentifierEmail(username);
    if (adminEmail) {
        return adminEmail;
    }

    const tables = getProfileTables();

    for (const table of tables) {
        const usernameQueries = [
            { field: 'username', value: username },
            { field: 'id', value: username },
        ];

        for (const queryField of usernameQueries) {
            const { data, error } = await supabase
                .from(table)
                .select('email,username')
                .eq(queryField.field, queryField.value)
                .limit(1)
                .maybeSingle();

            if (error) {
                if (isUserProfileSchemaError(error)) {
                    continue;
                }
                console.error(`[SupabaseAuth] username lookup failed on ${table}.${queryField.field}:`, error);
                break;
            }

            if (data) {
                const resolvedEmail = resolveLoginEmailFromProfile(data, username);
                if (resolvedEmail) {
                    return resolvedEmail;
                }
            }
        }
    }

    return null;
}

async function queryProfileEmailByAddress(address: string): Promise<string | null> {
    const lookupEmail = address.toLowerCase();
    const adminEmail = getAdminIdentifierEmail(lookupEmail);
    if (adminEmail) {
        return adminEmail;
    }

    const tables = getProfileTables();
    for (const table of tables) {
        const { data, error } = await supabase
            .from(table)
            .select('email,username,phone')
            .eq('email', lookupEmail)
            .limit(1)
            .maybeSingle();

        if (error) {
            if (isUserProfileSchemaError(error)) {
                continue;
            }
            console.error(`[SupabaseAuth] email lookup failed on ${table}:`, error);
            continue;
        }

        if (data) {
            const resolvedEmail = resolveLoginEmailFromProfile(data);
            if (resolvedEmail) {
                return resolvedEmail;
            }

            if (data.phone) {
                const phoneEmail = await queryProfileEmailByPhone(normalizePhone(data.phone));
                if (phoneEmail) {
                    return phoneEmail;
                }
            }
        }
    }

    return null;
}

async function queryProfileEmailByPhone(normalizedPhone: string): Promise<string | null> {
    const adminEmail = getAdminIdentifierEmail(normalizedPhone);
    if (adminEmail) {
        return adminEmail;
    }

    const tables = getProfileTables();
    const variants = new Set<string>([normalizedPhone]);

    if (normalizedPhone.length === 10) {
        variants.add(`91${normalizedPhone}`);
        variants.add(`+91${normalizedPhone}`);
        variants.add(`0${normalizedPhone}`);
    } else if (normalizedPhone.length === 11 && normalizedPhone.startsWith('0')) {
        const local = normalizedPhone.slice(1);
        variants.add(local);
        variants.add(`91${local}`);
        variants.add(`+91${local}`);
    } else if (normalizedPhone.length === 12 && normalizedPhone.startsWith('91')) {
        const local = normalizedPhone.slice(2);
        variants.add(local);
        variants.add(`+${normalizedPhone}`);
        variants.add(`0${local}`);
    } else if (normalizedPhone.length === 13 && normalizedPhone.startsWith('91')) {
        const local = normalizedPhone.slice(3);
        variants.add(local);
        variants.add(`91${local}`);
        variants.add(`0${local}`);
    }

    const orExpression = Array.from(variants)
        .map((value) => `phone.eq.${value}`)
        .join(',');

    for (const table of tables) {
        const { data, error } = await supabase
            .from(table)
            .select('email,username,profileEmail')
            .or(orExpression)
            .limit(1)
            .maybeSingle();

        if (error) {
            if (isUserProfileSchemaError(error)) {
                continue;
            }
            console.error(`[SupabaseAuth] phone lookup failed on ${table}:`, error);
            continue;
        }

        if (data) {
            const resolvedEmail = resolveLoginEmailFromProfile(data);
            if (resolvedEmail) {
                return resolvedEmail;
            }

            const contactEmail = data.profileEmail?.toLowerCase() || data.email?.toLowerCase();
            if (contactEmail && !contactEmail.endsWith('@chakna.app')) {
                const mappedEmail = await queryProfileEmailByAddress(contactEmail);
                if (mappedEmail) {
                    return mappedEmail;
                }
            }
        }
    }

    return null;
}

async function lookupReferralCode(referralCode: string): Promise<boolean> {
    const tables = getProfileTables();

    for (const table of tables) {
        const { data, error } = await supabase
            .from(table)
            .select('id')
            .eq('referral_code', referralCode)
            .limit(1)
            .maybeSingle();

        if (error) {
            if (isUserProfileSchemaError(error)) {
                continue;
            }
            console.error(`[SupabaseAuth] referral lookup failed on ${table}:`, error);
            continue;
        }

        if (data) {
            return true;
        }
    }

    return false;
}

async function lookupIdentifierEmail(identifier: string, options: { allowUnknownUsernameFallback?: boolean } = { allowUnknownUsernameFallback: true }): Promise<string> {
    const trimmed = identifier.trim();
    if (!trimmed) {
        throw new Error('Please enter a valid username or phone number.');
    }

    if (trimmed.includes('@')) {
        const normalizedEmail = trimmed.toLowerCase();
        const mappedEmail = await queryProfileEmailByAddress(normalizedEmail);
        return mappedEmail || normalizedEmail;
    }

    const normalizedPhone = normalizePhone(trimmed);
    const username = trimmed.toLowerCase();
    const isPhoneLookup = !!normalizedPhone && /^[+0-9\s\-()]+$/.test(trimmed) && normalizedPhone.length >= 9;

    if (isPhoneLookup) {
        const email = await queryProfileEmailByPhone(normalizedPhone);
        if (email) {
            return email;
        }
        throw new Error('No account found for this phone number. Please verify your number or sign up.');
    }

    const foundEmail = await queryProfileEmailByUsername(username);
    const authEmail = getAuthEmailForUsername(username);
    if (foundEmail) {
        return foundEmail;
    }

    if (options.allowUnknownUsernameFallback) {
        return authEmail;
    }

    throw new Error('No account found for this username. Please verify your username or sign up.');
}

async function queryProfileByAuthId(authId: string): Promise<Partial<User> | null> {
    const tables = getProfileTables();

    for (const table of tables) {
        const attempts = [
            table === 'users'
                ? supabase.from(table).select('*').or(`id.eq.${authId},open_id.eq.${authId}`).limit(1).maybeSingle()
                : supabase.from(table).select('*').eq('id', authId).limit(1).maybeSingle(),
            supabase.from(table).select('*').eq('id', authId).limit(1).maybeSingle(),
        ];

        for (const attempt of attempts) {
            const { data, error } = await attempt;

            if (error) {
                if (isUserProfileSchemaError(error)) {
                    continue;
                }
                console.error(`[SupabaseAuth] profile lookup failed on ${table}:`, error);
                break;
            }

            if (data) {
                return {
                    id: data.id,
                    username: data.username ?? data.id,
                    email: data.email,
                    name: data.name,
                    phone: data.phone,
                    role: data.role as UserRole,
                    referralCode: data.referralCode ?? data.referral_code ?? undefined,
                    businessName: data.businessName ?? data.business_name ?? undefined,
                    createdAt: data.createdAt ?? data.created_at ?? new Date().toISOString(),
                };
            }
        }
    }

    return null;
}

async function insertProfileForCustomer(userData: User & { deliveryLocation?: any }): Promise<void> {
    const authEmail = getAuthEmailForUsername(userData.username);
    const insertData: Record<string, any> = {
        id: userData.id,
        name: userData.name,
        email: userData.email?.toLowerCase() || authEmail,
        phone: userData.phone,
        username: userData.username,
        role: userData.role,
        status: 'active',
        delivery_location: userData.deliveryLocation || null,
        created_at: userData.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_signed_in: new Date().toISOString(),
    };

    if (userData.referralCode) {
        insertData.referral_code = userData.referralCode;
    }

    const { error } = await supabase.from('users').insert(insertData);

    if (error) {
        console.error('[SupabaseAuth] customer profile insert failed:', error.message);
        throw new Error(error.message);
    }
}

async function getOrCreateUserProfile(
    supabaseUser: { id: string; email?: string | null; user_metadata?: Record<string, any> },
    defaultRole: UserRole,
    phone?: string,
    referralCode?: string,
    deliveryLocation?: any
): Promise<User> {
    const username = (supabaseUser.user_metadata?.username || '').toLowerCase();

    const profile = await queryProfileByAuthId(supabaseUser.id);
    if (profile) {
        return {
            id: profile.id ?? supabaseUser.id,
            username: profile.username ?? username,
            email:
                supabaseUser.user_metadata?.profileEmail?.toLowerCase() ||
                profile.email ||
                supabaseUser.email ||
                getAuthEmailForUsername(username),
            name: profile.name ?? supabaseUser.user_metadata?.name ?? 'Customer',
            phone: profile.phone ?? normalizePhone(phone ?? supabaseUser.user_metadata?.phone ?? ''),
            role: profile.role ?? defaultRole,
            referralCode: profile.referralCode,
            businessName: profile.businessName,
            createdAt: profile.createdAt ?? new Date().toISOString(),
        };
    }

    const userData = supabaseUserToAppUser(supabaseUser, defaultRole, phone, referralCode);

    if (username) {
        const insertData: Record<string, any> = {
            id: userData.id,
            open_id: userData.id,
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            role: userData.role,
            referral_code: userData.referralCode ?? null,
            points_balance: 0,
            delivery_location: deliveryLocation || userData.deliveryLocation || null,
            created_at: userData.createdAt,
        };

        if (userData.username) {
            insertData.username = userData.username;
        }

        const { error: insertError } = await supabase.from('users').insert(insertData);

        if (insertError) {
            if (isUserProfileSchemaError(insertError)) {
                console.warn('[SupabaseAuth] user profile insert skipped due to missing or incompatible users schema:', insertError.message);
                await insertProfileForCustomer({ ...userData, deliveryLocation });
                return userData;
            }
            throw new Error(insertError.message);
        }
    } else {
        await insertProfileForCustomer({ ...userData, deliveryLocation });
    }

    return userData;
}

// Sign up new customer
export async function signUpCustomer(
    username: string,
    password: string,
    name: string,
    email: string | undefined,
    phone: string,
    referralCode?: string,
    deliveryLocation?: any
): Promise<{ user: User; token: string | null }> {
    try {
        const normalizedUsername = username.trim().toLowerCase();
        if (!normalizedUsername) {
            throw new Error('Please enter a valid username.');
        }

        // Check for existing username in users table
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('username', normalizedUsername)
            .maybeSingle();

        if (existingUser) {
            throw new Error('This username is already taken. Please choose a different one.');
        }

        const normalizedPhone = normalizePhone(phone);
        const normalizedEmail = email?.trim().toLowerCase();
        const authEmail = normalizedEmail || `${normalizedUsername}@chakna.app`;
        const profileEmail = normalizedEmail || authEmail;

        if (referralCode) {
            const isValidReferral = await lookupReferralCode(referralCode);
            if (!isValidReferral) {
                throw new Error('Invalid referral code. Please check the code and try again.');
            }
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: authEmail,
            password,
            options: {
                data: {
                    name,
                    username: normalizedUsername,
                    phone: normalizedPhone,
                    role: 'customer',
                    referralCode: referralCode || null,
                    profileEmail,
                },
            },
        });

        if (signUpError) {
            console.error('[SupabaseAuth] signUp error:', signUpError);
            if (signUpError.status === 429 || /rate limit/i.test(signUpError.message)) {
                throw new Error('Too many signup attempts. Please wait a few minutes and try again.');
            }
            if (/already registered|duplicate|user already exists/i.test(signUpError.message)) {
                throw new Error('This username is already taken. Please choose a different one.');
            }
            throw new Error(signUpError.message);
        }

        const user = signUpData.user;
        if (!user) {
            throw new Error('Unable to create user account');
        }

        const clientUser = await getOrCreateUserProfile(user, 'customer', normalizedPhone, referralCode, deliveryLocation);
        let token = signUpData.session?.access_token ?? null;

        if (!token) {
            const signInResponse = await supabase.auth.signInWithPassword({
                email: authEmail,
                password,
            });
            if (!signInResponse.error) {
                token = signInResponse.data.session?.access_token ?? null;
            }
        }

        await AsyncStorage.setItem('user', JSON.stringify(clientUser));
        if (token) {
            await AsyncStorage.setItem('userToken', token);
        }

        return { user: clientUser, token };
    } catch (error: any) {
        console.error('Sign up error:', error);
        throw new Error(error.message || 'Sign up failed');
    }
}

export async function getUserByOpenId(openId: string): Promise<User | null> {
    const profile = await queryProfileByAuthId(openId);
    if (!profile) {
        return null;
    }

    return {
        id: profile.id ?? openId,
        username: profile.username ?? '',
        email: profile.email ?? '',
        name: profile.name ?? 'Customer',
        phone: profile.phone ?? '',
        role: profile.role ?? 'customer',
        referralCode: profile.referralCode,
        createdAt: profile.createdAt ?? new Date().toISOString(),
    };
}

export async function signInWithGoogle(): Promise<void> {
    const started = await startOAuthLogin();
    if (!started) {
        throw new Error('Google sign-in could not be started. Please check your OAuth configuration and try again.');
    }
}

// Sign in user
export async function signIn(
    identifier: string,
    password: string
): Promise<{ user: User; token: string }> {
    console.log('[SupabaseAuth] signIn called:', { identifier });
    try {
        const email = await lookupIdentifierEmail(identifier);
        console.log('[SupabaseAuth] resolved login email:', email);
        const { data: signInData, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            console.error('[SupabaseAuth] signIn error:', error);
            throw new Error(error.message);
        }

        const user = signInData.user;
        if (!user) {
            throw new Error('Unable to sign in');
        }

        const clientUser = await getOrCreateUserProfile(user, 'customer');
        const token = signInData.session?.access_token ?? '';

        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(clientUser));

        console.log('[SupabaseAuth] signIn success');
        return { user: clientUser, token };
    } catch (error: any) {
        console.error('Sign in error:', error);
        const message = typeof error?.message === 'string' ? error.message : 'Sign in failed';
        throw new Error(message);
    }
}

// Sign out
export async function signOutUser(): Promise<void> {
    try {
        await supabase.auth.signOut();
    } catch (error) {
        console.warn('[SupabaseAuth] supabase signOut failed:', error);
    }
    await AsyncStorage.multiRemove(['userToken', 'user']);
    await customAuth.removeSessionToken();
    await customAuth.clearUserInfo();
}

export async function resetPassword(identifier: string): Promise<void> {
    const email = identifier.includes('@')
        ? identifier.toLowerCase()
        : await lookupIdentifierEmail(identifier, { allowUnknownUsernameFallback: false });
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined;
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, redirectTo ? { redirectTo } : undefined);

    if (error) {
        console.error('[SupabaseAuth] resetPassword error:', error);
        throw new Error('Unable to request a password reset. Please verify your username or phone number and try again.');
    }

    if (!data) {
        throw new Error('Unable to request password reset');
    }
}

// Auth state listener (for context)
export function onAuthStateChangedListener(callback: (user: User | null) => void) {
    const {
        data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
            const user = await getOrCreateUserProfile(session.user, 'customer');
            callback(user);
            return;
        }
        callback(null);
    });

    return () => {
        subscription.unsubscribe();
    };
}

// Get current auth user
export async function getCurrentSession(): Promise<{ user: User | null; token: string | null }> {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session?.user) {
        return { user: null, token: null };
    }

    const user = await getOrCreateUserProfile(data.session.user, 'customer');
    return { user, token: data.session.access_token ?? null };
}

export async function getCurrentUser(): Promise<User | null> {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
        return null;
    }

    return getOrCreateUserProfile(data.user, 'customer');
}

