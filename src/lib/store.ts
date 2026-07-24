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

const DEFAULT_FILES: UploadedFile[] = [
  { name: "GTBank_June_2026.pdf", status: "Parsed", txns: 8, when: "2 hours ago", bank: "GTBank" },
  { name: "Kuda_May_export.csv", status: "Parsed", txns: 4, when: "Yesterday", bank: "Kuda" },
  { name: "Access_Q1_2026.pdf", status: "Parsed", txns: 6, when: "Jul 03", bank: "Access" },
];

const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: "t1",
    name: "Chowdeck",
    merchant: "chowdeck.com",
    cat: "Food",
    amount: -8500,
    date: "Jul 11, 12:42",
    type: "debit",
    channel: "Card",
  },
  {
    id: "t2",
    name: "Salary · Netfixed Ltd",
    merchant: "Salary credit",
    cat: "Income",
    amount: 820000,
    date: "Jul 10, 09:15",
    type: "credit",
    channel: "Transfer",
  },
  {
    id: "t3",
    name: "Bolt Ride",
    merchant: "bolt.eu",
    cat: "Transport",
    amount: -3200,
    date: "Jul 10, 20:11",
    type: "debit",
    channel: "Card",
  },
  {
    id: "t4",
    name: "Shoprite Ikeja",
    merchant: "shoprite.ng",
    cat: "Groceries",
    amount: -34200,
    date: "Jul 08, 18:44",
    type: "debit",
    channel: "POS",
  },
  {
    id: "t5",
    name: "Ikeja Electric",
    merchant: "IE prepaid",
    cat: "Bills",
    amount: -18500,
    date: "Jul 07, 08:00",
    type: "debit",
    channel: "Transfer",
  },
  {
    id: "t6",
    name: "MTN Airtime",
    merchant: "MTN Nigeria",
    cat: "Telecom",
    amount: -2500,
    date: "Jul 06, 07:12",
    type: "debit",
    channel: "USSD",
  },
  {
    id: "t7",
    name: "Starbucks Lekki",
    merchant: "starbucks.ng",
    cat: "Coffee",
    amount: -4200,
    date: "Jul 05, 09:11",
    type: "debit",
    channel: "Card",
  },
  {
    id: "t8",
    name: "Freelance · Adeola",
    merchant: "Transfer in",
    cat: "Income",
    amount: 150000,
    date: "Jul 04, 14:22",
    type: "credit",
    channel: "Transfer",
  },
  {
    id: "t9",
    name: "Rent · Aunty T",
    merchant: "Housing",
    cat: "Housing",
    amount: -180000,
    date: "Jul 01, 07:30",
    type: "debit",
    channel: "Transfer",
  },
  // June
  {
    id: "t10",
    name: "Chowdeck June",
    merchant: "chowdeck.com",
    cat: "Food",
    amount: -12000,
    date: "Jun 28, 19:15",
    type: "debit",
    channel: "Card",
  },
  {
    id: "t11",
    name: "Salary June",
    merchant: "Salary credit",
    cat: "Income",
    amount: 820000,
    date: "Jun 25, 09:15",
    type: "credit",
    channel: "Transfer",
  },
  {
    id: "t12",
    name: "Bolt Ride June",
    merchant: "bolt.eu",
    cat: "Transport",
    amount: -4500,
    date: "Jun 24, 18:30",
    type: "debit",
    channel: "Card",
  },
  {
    id: "t13",
    name: "MTN Airtime June",
    merchant: "MTN Nigeria",
    cat: "Telecom",
    amount: -5000,
    date: "Jun 20, 10:11",
    type: "debit",
    channel: "USSD",
  },
  {
    id: "t14",
    name: "Ikeja Electric June",
    merchant: "IE prepaid",
    cat: "Bills",
    amount: -18500,
    date: "Jun 15, 08:30",
    type: "debit",
    channel: "Transfer",
  },
  // May
  {
    id: "t15",
    name: "Salary May",
    merchant: "Salary credit",
    cat: "Income",
    amount: 820000,
    date: "May 25, 09:15",
    type: "credit",
    channel: "Transfer",
  },
  {
    id: "t16",
    name: "Chowdeck May",
    merchant: "chowdeck.com",
    cat: "Food",
    amount: -15000,
    date: "May 20, 13:10",
    type: "debit",
    channel: "Card",
  },
  {
    id: "t17",
    name: "Shopping May",
    merchant: "shoprite.ng",
    cat: "Groceries",
    amount: -25000,
    date: "May 18, 14:15",
    type: "debit",
    channel: "POS",
  },
];

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
