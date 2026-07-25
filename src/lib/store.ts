import { useState, useEffect } from "react";
import {
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Smartphone,
  Coffee,
  Briefcase,
  TrendingUp,
  Home as HomeIcon,
  HelpCircle,
  LucideIcon,
} from "lucide-react";

export interface Transaction {
  id: string;
  name: string;
  merchant: string;
  cat: string; // "Food" | "Transport" | "Groceries" | "Bills" | "Income" | "Housing" | "Telecom" | "Coffee" | "Others"
  amount: number; // positive for credit, negative for debit
  date: string; // e.g. "Jul 11, 12:42" or ISO timestamp
  type: "credit" | "debit";
  channel: "Card" | "Transfer" | "POS" | "USSD";
}

export interface UploadedFile {
  name: string;
  status: "Parsed" | "Parsing" | "Failed";
  txns: number;
  when: string;
  bank: string;
}

export interface FinancialProfile {
  fullName: string;
  householdSize: string;
  monthlyIncome: number;
  primaryGoal: string;
  riskTolerance: string;
}

const DEFAULT_PROFILE: FinancialProfile = {
  fullName: "Adaeze Okafor",
  householdSize: "1 adult",
  monthlyIncome: 820000,
  primaryGoal: "Save ₦5M in 12 months",
  riskTolerance: "Moderate",
};

const DEFAULT_FILES: UploadedFile[] = [];

const DEFAULT_TRANSACTIONS: Transaction[] = [];

export const getIconForCategory = (cat: string): LucideIcon => {
  const mapping: Record<string, LucideIcon> = {
    Food: Utensils,
    Transport: Car,
    Groceries: ShoppingBag,
    Bills: Zap,
    Telecom: Smartphone,
    Coffee: Coffee,
    Income: Briefcase,
    Housing: HomeIcon,
  };
  return mapping[cat] || HelpCircle;
};

const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach((l) => l());
};

const STORAGE_KEYS = {
  TRANSACTIONS: "nairalens_txns",
  FILES: "nairalens_files",
  PROFILE: "nairalens_profile",
};

export const getTransactions = (): Transaction[] => {
  if (typeof window === "undefined") return DEFAULT_TRANSACTIONS;
  const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(DEFAULT_TRANSACTIONS));
    return DEFAULT_TRANSACTIONS;
  }
  return JSON.parse(stored);
};

export const getFiles = (): UploadedFile[] => {
  if (typeof window === "undefined") return DEFAULT_FILES;
  const stored = localStorage.getItem(STORAGE_KEYS.FILES);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(DEFAULT_FILES));
    return DEFAULT_FILES;
  }
  return JSON.parse(stored);
};

export const getProfile = (): FinancialProfile => {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
    return DEFAULT_PROFILE;
  }
  return JSON.parse(stored);
};

export const updateProfile = (profile: Partial<FinancialProfile>) => {
  const current = getProfile();
  const updated = { ...current, ...profile };
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
  notify();
};

export const addUploadedFile = (name: string, bank: string, transactions: Transaction[]) => {
  const files = getFiles();
  const txns = getTransactions();

  const newFile: UploadedFile = {
    name,
    status: "Parsed",
    txns: transactions.length,
    when: "Just now",
    bank,
  };

  localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify([newFile, ...files]));
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([...transactions, ...txns]));
  notify();
};

export const deleteFile = (fileName: string) => {
  const files = getFiles();
  const filteredFiles = files.filter((f) => f.name !== fileName);
  localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(filteredFiles));
  // Keep transactions but delete the file record for simplicity, or we could tag transactions with source
  notify();
};

export const resetStore = () => {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(DEFAULT_TRANSACTIONS));
  localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(DEFAULT_FILES));
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
  notify();
};

export function useFinanceStore() {
  const [txns, setTxns] = useState<Transaction[]>(getTransactions);
  const [files, setFiles] = useState<UploadedFile[]>(getFiles);
  const [profile, setProfile] = useState<FinancialProfile>(getProfile);

  useEffect(() => {
    const handleUpdate = () => {
      setTxns(getTransactions());
      setFiles(getFiles());
      setProfile(getProfile());
    };

    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  return {
    transactions: txns,
    files,
    profile,
    updateProfile,
    addUploadedFile,
    deleteFile,
    resetStore,
  };
}
