/**
 * Supabase Authentication Helpers
 * Centralized Supabase Auth operations for the app
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as customAuth from '@/lib/_core/auth';
import { startOAuthLogin } from '@/constants/oauth';
import { supabase } from './supabase-service';
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
        createdAt: new Date().toISOString(),
    };
}

async function lookupIdentifierEmail(identifier: string): Promise<string> {
    const trimmed = identifier.trim();
    if (!trimmed) {
        throw new Error('Please enter a valid username or phone number.');
    }

    if (trimmed.includes('@')) {
        return trimmed.toLowerCase();
    }

    const normalizedPhone = normalizePhone(trimmed);
    const username = trimmed.toLowerCase();
    const isPhoneLookup = !!normalizedPhone && /^[+0-9 ]+$/.test(trimmed);

    if (isPhoneLookup) {
        const variants = new Set<string>([normalizedPhone]);
        if (normalizedPhone.length === 10) {
            variants.add(`91${normalizedPhone}`);
            variants.add(`+91${normalizedPhone}`);
        } else if (normalizedPhone.length === 12 && normalizedPhone.startsWith('91')) {
            variants.add(`+${normalizedPhone}`);
        }

        const orExpression = Array.from(variants)
            .map((value) => `phone.eq.${value}`)
            .join(',');

        const { data, error } = await supabase
            .from('users')
            .select('email')
            .or(orExpression)
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error('[SupabaseAuth] phone lookup failed:', error);
        }

        if (data?.email) {
            return data.email.toLowerCase();
        }

        throw new Error('No account found for this phone number. Please verify your number or sign up.');
    }

    const authEmail = getAuthEmailForUsername(username);
    const { data, error } = await supabase
        .from('users')
        .select('email')
        .eq('username', username)
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error('[SupabaseAuth] username lookup failed:', error);
    }

    if (data?.email) {
        return data.email.toLowerCase();
    }

    return authEmail;
}

async function getOrCreateUserProfile(
    supabaseUser: { id: string; email?: string | null; user_metadata?: Record<string, any> },
    defaultRole: UserRole,
    phone?: string,
    referralCode?: string
): Promise<User> {
    const username = (supabaseUser.user_metadata?.username || '').toLowerCase();
    const { data, error } = await supabase.from('users').select('*').eq('id', supabaseUser.id).maybeSingle();
    if (error) {
        throw new Error(error.message);
    }

    if (data) {
        return {
            id: data.id,
            username: data.username ?? username,
            email: data.email,
            name: data.name,
            phone: data.phone,
            role: data.role as UserRole,
            referralCode: data.referralCode ?? data.referral_code ?? undefined,
            createdAt: data.createdAt,
        };
    }

    const userData = supabaseUserToAppUser(supabaseUser, defaultRole, phone, referralCode);
    const { error: insertError } = await supabase.from('users').insert({
        id: userData.id,
        openId: userData.id,
        username: userData.username,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role: userData.role,
        loginMethod: 'email',
        referral_code: userData.referralCode ?? null,
        points_balance: 0,
        createdAt: userData.createdAt,
    });

    if (insertError) {
        throw new Error(insertError.message);
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
    referralCode?: string
): Promise<{ user: User; token: string | null }> {
    try {
        const normalizedUsername = username.trim().toLowerCase();
        if (!normalizedUsername) {
            throw new Error('Please enter a valid username.');
        }

        const normalizedPhone = normalizePhone(phone);
        const authEmail = `${normalizedUsername}@chakna.app`;
        const profileEmail = email?.trim().toLowerCase() || authEmail;

        if (referralCode) {
            const { data: referralMatch, error: referralError } = await supabase
                .from('users')
                .select('id')
                .eq('referral_code', referralCode)
                .limit(1)
                .maybeSingle();
            if (referralError) {
                console.error('[SupabaseAuth] referral lookup failed:', referralError);
                throw new Error('Unable to validate referral code. Please try again later.');
            }
            if (!referralMatch) {
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

        const clientUser = await getOrCreateUserProfile(user, 'customer', normalizedPhone, referralCode);
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
    const { data, error } = await supabase.from('users').select('*').eq('openId', openId).maybeSingle();
    if (error) {
        console.error('[SupabaseAuth] getUserByOpenId failed:', error);
        return null;
    }
    if (!data) {
        return null;
    }
    return {
        id: data.id,
        username: data.username ?? '',
        email: data.email,
        name: data.name,
        phone: data.phone,
        role: data.role as UserRole,
        referralCode: data.referralCode ?? data.referral_code ?? undefined,
        createdAt: data.createdAt,
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
    const email = identifier.includes('@') ? identifier.toLowerCase() : await lookupIdentifierEmail(identifier);
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined;
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
    });

    if (error) {
        console.error('[SupabaseAuth] resetPassword error:', error);
        throw new Error(error.message);
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

