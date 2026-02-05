import { supabase } from './supabase';

/**
 * SQL Schema for Supabase (Run this in Supabase SQL Editor):
 * 
 * CREATE TABLE IF NOT EXISTS accounts (
 *     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 *     name TEXT NOT NULL,
 *     description TEXT,
 *     total NUMERIC DEFAULT 0,
 *     paid NUMERIC DEFAULT 0,
 *     due NUMERIC DEFAULT 0,
 *     date DATE DEFAULT CURRENT_DATE
 * );
 * 
 * CREATE TABLE IF NOT EXISTS tasks (
 *     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 *     type TEXT,
 *     size TEXT,
 *     quantity NUMERIC DEFAULT 0,
 *     rate NUMERIC DEFAULT 0,
 *     total NUMERIC DEFAULT 0,
 *     advance NUMERIC DEFAULT 0,
 *     due NUMERIC DEFAULT 0,
 *     completed BOOLEAN DEFAULT FALSE,
 *     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * CREATE TABLE IF NOT EXISTS wholesale_entries (
 *     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 *     customer_name TEXT NOT NULL,
 *     previous_due NUMERIC DEFAULT 0,
 *     new_amount NUMERIC DEFAULT 0,
 *     paid_now NUMERIC DEFAULT 0,
 *     remaining_due NUMERIC DEFAULT 0,
 *     date DATE DEFAULT CURRENT_DATE,
 *     description TEXT,
 *     note TEXT,
 *     items JSONB DEFAULT '[]'::JSONB
 * );
 * 
 * ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE wholesale_entries ENABLE ROW LEVEL SECURITY;
 * 
 * CREATE POLICY "Users can only access their own accounts" ON accounts FOR ALL USING (auth.uid() = user_id);
 * CREATE POLICY "Users can only access their own tasks" ON tasks FOR ALL USING (auth.uid() = user_id);
 * CREATE POLICY "Users can only access their own wholesale entries" ON wholesale_entries FOR ALL USING (auth.uid() = user_id);
 */

export interface Account {
    id: string;
    user_id?: string;
    name: string;
    description: string;
    total: number;
    paid: number;
    due: number;
    date: string;
    quantity?: number;
    rate?: number;
    mobile?: string;
    timestamp?: number;
}

export interface Task {
    id: string;
    user_id?: string;
    type: string;
    size: string;
    quantity: number;
    rate: number;
    total: number;
    advance: number;
    due: number;
    completed: boolean;
}

export interface WholesaleEntry {
    id: string;
    user_id?: string;
    customerName: string;
    mobile?: string;
    previousDue: number;
    newAmount: number;
    paidNow: number;
    remainingDue: number;
    date: string;
    description?: string;
    items?: { name: string; qty: number; rate: number }[];
    note?: string;
    timestamp?: number;
}

const STORAGE_KEYS = {
    AUTH: 'sb-wdttymfqxxrdhkxvtloj-auth-token'
};

export interface User {
    id?: string;
    name: string;
    email: string;
}

export const Storage = {
    // Accounts
    async getAccounts(): Promise<Account[]> {
        const { data, error } = await supabase
            .from('accounts')
            .select('*')
            .order('date', { ascending: false });
        if (error) throw error;

        return (data || []).map((item: any) => {
            let quantity = 0;
            let rate = 0;
            let desc = item.description || '';

            // Parse metadata from description (Separator: :::)
            let mobile = '';
            let timestamp = 0;
            if (desc && desc.includes(':::')) {
                const parts = desc.split(':::');
                if (parts.length === 2) {
                    try {
                        const meta = JSON.parse(parts[1]);
                        quantity = meta.q || 0;
                        rate = meta.r || 0;
                        mobile = meta.m || '';
                        timestamp = meta.ts || 0;
                        desc = parts[0];
                    } catch (e) {
                        // Keep original description if parse fails
                    }
                }
            }

            return {
                ...item,
                description: desc,
                quantity,
                rate,
                mobile,
                timestamp,
                total: Number(item.total),
                paid: Number(item.paid),
                due: Number(item.due)
            };
        });
    },
    async saveAccount(account: Account) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Store metadata in description field to avoid schema changes
        const meta = JSON.stringify({
            q: account.quantity,
            r: account.rate,
            m: account.mobile,
            ts: account.timestamp || Date.now()
        });
        // Ensure we don't double-append if editing an existing padded description
        const cleanDescription = (account.description || '').split(':::')[0];
        const dbDescription = cleanDescription + ':::' + meta;

        // Exclude UI-only fields from payload, use modified description
        const dbData = {
            id: account.id,
            name: account.name,
            total: account.total,
            paid: account.paid,
            due: account.due,
            date: account.date,
            description: dbDescription,
            user_id: user.id
        };

        const { error } = await supabase
            .from('accounts')
            .upsert(dbData);
        if (error) throw error;
    },
    async deleteAccount(id: string) {
        const { error } = await supabase
            .from('accounts')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    // Tasks
    async getTasks(): Promise<Task[]> {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },
    async saveTask(task: Task) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
            .from('tasks')
            .upsert({ ...task, user_id: user.id });
        if (error) throw error;
    },

    async deleteTask(id: string) {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    // Wholesale
    // Wholesale
    async getWholesale(): Promise<WholesaleEntry[]> {
        const { data, error } = await supabase
            .from('wholesale_entries')
            .select('*')
            .order('date', { ascending: false });
        if (error) throw error;

        return (data || []).map(entry => {
            let timestamp = 0;
            let desc = entry.description || '';

            // Parse metadata (Separator: :::)
            let mobile = '';
            if (desc && desc.includes(':::')) {
                const parts = desc.split(':::');
                if (parts.length === 2) {
                    try {
                        const meta = JSON.parse(parts[1]);
                        timestamp = meta.ts || 0;
                        mobile = meta.m || '';
                        desc = parts[0];
                    } catch (e) {
                        // Keep original description
                    }
                }
            }

            return {
                id: entry.id,
                user_id: entry.user_id,
                customerName: entry.customer_name,
                previousDue: Number(entry.previous_due) || 0,
                newAmount: Number(entry.new_amount) || 0,
                paidNow: Number(entry.paid_now) || 0,
                remainingDue: Number(entry.remaining_due) || 0,
                date: entry.date,
                description: desc,
                mobile,
                items: entry.items,
                note: entry.note,
                timestamp // Add parsed timestamp
            };
        });
    },
    async saveWholesale(entry: WholesaleEntry) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Pack metadata
        const meta = JSON.stringify({
            ts: entry.timestamp || Date.now(),
            m: entry.mobile || ''
        });
        const cleanDescription = (entry.description || '').split(':::')[0];
        const dbDescription = cleanDescription + ':::' + meta;

        const { error } = await supabase
            .from('wholesale_entries')
            .upsert({
                id: entry.id,
                user_id: user.id,
                customer_name: entry.customerName,
                previous_due: entry.previousDue,
                new_amount: entry.newAmount,
                paid_now: entry.paidNow,
                remaining_due: entry.remainingDue,
                date: entry.date,
                description: dbDescription, // Save with metadata
                items: entry.items,
                note: entry.note
            });
        if (error) throw error;
    },
    async deleteWholesale(id: string) {
        const { error } = await supabase
            .from('wholesale_entries')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    // Authentication
    async getUser(): Promise<User | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;
        return {
            id: user.id,
            name: user.user_metadata?.name || 'User',
            email: user.email || ''
        };
    },
    async signup(email: string, password: string, name: string) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name }
            }
        });
        if (error) throw error;
        return data;
    },
    async login(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data;
    },
    async logout() {
        await supabase.auth.signOut();
    },
    async updateProfile(name: string, email: string) {
        const { error } = await supabase.auth.updateUser({
            email,
            data: { name }
        });
        if (error) throw error;
    },
    async updatePassword(password: string) {
        const { error } = await supabase.auth.updateUser({
            password
        });
        if (error) throw error;
    },
    async resetPassword(email: string) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/login',
        });
        if (error) throw error;
    },
    isLoggedIn: () => {
        return !!localStorage.getItem(STORAGE_KEYS.AUTH);
    }
};
