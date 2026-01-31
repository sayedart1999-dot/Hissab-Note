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
    previousDue: number;
    newAmount: number;
    paidNow: number;
    remainingDue: number;
    date: string;
    description?: string;
    items?: { name: string; qty: number; rate: number }[];
    note?: string;
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
        return data || [];
    },
    async saveAccount(account: Account) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
            .from('accounts')
            .upsert({ ...account, user_id: user.id });
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
    async getWholesale(): Promise<WholesaleEntry[]> {
        const { data, error } = await supabase
            .from('wholesale_entries')
            .select('*')
            .order('date', { ascending: false });
        if (error) throw error;

        return (data || []).map(entry => ({
            id: entry.id,
            user_id: entry.user_id,
            customerName: entry.customer_name,
            previousDue: Number(entry.previous_due) || 0,
            newAmount: Number(entry.new_amount) || 0,
            paidNow: Number(entry.paid_now) || 0,
            remainingDue: Number(entry.remaining_due) || 0,
            date: entry.date,
            description: entry.description,
            items: entry.items,
            note: entry.note
        }));
    },
    async saveWholesale(entry: WholesaleEntry) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

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
                description: entry.description,
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
