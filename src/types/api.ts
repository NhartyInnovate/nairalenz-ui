export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active?: boolean;
}

export interface AuthResponseData {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface StatementUploadData {
  id: string;
  original_filename: string;
  upload_status: "UPLOADED" | "QUEUED" | "PARSING" | "NORMALIZING" | "COMPLETED" | "FAILED";
  uploaded_at: string;
  parser_errors?: string[];
}

export interface TransactionItem {
  id: string;
  transaction_date: string;
  description: string;
  amount: number;
  transaction_type: "DEBIT" | "CREDIT";
  currency: string;
  category_id?: string;
  category_name?: string;
  confidence?: number;
  merchant_name?: string;
}

export interface PaginatedTransactions {
  items: TransactionItem[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface FinancialHealthData {
  financial_health_score: number;
  total_income: number;
  total_expenses: number;
  net_cash_flow: number;
  savings_rate: number;
  essential_expenses: number;
  discretionary_expenses: number;
  largest_category: string;
  largest_merchant: string;
}

export interface AlertItem {
  id: string;
  insight_type: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  title: string;
  description: string;
}

export interface SubscriptionItem {
  merchant: string;
  average_amount: number;
  next_expected_date: string;
}

export interface ChatMessageData {
  id: string;
  sender: "USER" | "AI";
  content: string;
  created_at: string;
  model_used?: string;
  prompt_version?: string;
}

export interface ChatResponseData {
  conversation_id: string;
  user_message: ChatMessageData;
  ai_message: ChatMessageData;
}

export interface ConversationItem {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}
