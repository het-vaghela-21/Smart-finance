"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { format, subDays } from 'date-fns'; // We will use this once installed

export type TransactionCategory = 'Food' | 'Shopping' | 'Jewellery' | 'Stocks' | 'Travel' | 'Miscellaneous';
export type TransactionType = 'credit' | 'debit';

export interface Transaction {
    id: string;
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    date: Date;
    title: string;
}

interface DashboardContextType {
    transactions: Transaction[];
    addTransaction: (tx: Omit<Transaction, 'id'>) => void;
    deleteTransaction: (id: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Generate some realistic dummy data
const generateDummyData = (): Transaction[] => {
    const data: Transaction[] = [];
    const now = new Date();

    // Some initial data
    data.push({ id: '1', amount: 4500, type: 'credit', category: 'Miscellaneous', date: subDays(now, 10), title: 'Salary' });
    data.push({ id: '2', amount: 150, type: 'debit', category: 'Food', date: subDays(now, 9), title: 'Grocery Run' });
    data.push({ id: '3', amount: 80, type: 'debit', category: 'Travel', date: subDays(now, 8), title: 'Uber' });
    data.push({ id: '4', amount: 1200, type: 'debit', category: 'Stocks', date: subDays(now, 7), title: 'AAPL Shares' });
    data.push({ id: '5', amount: 300, type: 'debit', category: 'Shopping', date: subDays(now, 5), title: 'Amazon' });
    data.push({ id: '6', amount: 850, type: 'credit', category: 'Stocks', date: subDays(now, 3), title: 'TSLA Dividend' });
    data.push({ id: '7', amount: 45, type: 'debit', category: 'Food', date: subDays(now, 1), title: 'Coffee' });
    data.push({ id: '8', amount: 200, type: 'debit', category: 'Jewellery', date: now, title: 'Gift' });

    // Sort by date descending
    return data.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export function DashboardProvider({ children }: { children: ReactNode }) {
    const [transactions, setTransactions] = useState<Transaction[]>(generateDummyData());

    const addTransaction = (tx: Omit<Transaction, 'id'>) => {
        const newTx: Transaction = {
            ...tx,
            id: Math.random().toString(36).substring(7),
        };
        setTransactions(prev => [newTx, ...prev].sort((a, b) => b.date.getTime() - a.date.getTime()));
    };

    const deleteTransaction = (id: string) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    return (
        <DashboardContext.Provider value={{ transactions, addTransaction, deleteTransaction }}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
}
